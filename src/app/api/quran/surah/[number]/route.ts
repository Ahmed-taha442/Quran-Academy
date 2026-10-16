import { NextResponse } from "next/server";

export const revalidate = 86_400;

const translationEditions: Record<string, string> = {
  en: "en.sahih",
  ar: "en.sahih",
  ur: "ur.jalandhry",
  fr: "fr.hamidullah",
  id: "id.indonesian",
  tr: "tr.diyanet",
};

type ApiAyah = {
  numberInSurah: number;
  page: number;
  text: string;
  audio?: string;
};

type ApiEdition = {
  code: number;
  data: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
    edition: { englishName: string; name: string };
    ayahs: ApiAyah[];
  };
};

async function getEdition(surah: number, edition: string): Promise<ApiEdition> {
  const response = await fetch(
    `https://api.alquran.cloud/v1/surah/${surah}/${edition}`,
    { next: { revalidate } },
  );

  if (!response.ok) {
    throw new Error(`Quran content provider returned ${response.status}`);
  }

  const result = (await response.json()) as ApiEdition;
  if (result.code !== 200 || !Array.isArray(result.data?.ayahs)) {
    throw new Error("Quran content provider returned an invalid response");
  }

  return result;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ number: string }> },
) {
  const { number: rawNumber } = await context.params;
  const surahNumber = Number(rawNumber);

  if (!Number.isInteger(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    return NextResponse.json({ error: "Invalid surah number." }, { status: 400 });
  }

  const locale = new URL(_request.url).searchParams.get("locale") ?? "en";
  const translationEdition = translationEditions[locale] ?? "en.sahih";

  try {
    const [arabic, translation, recitation] = await Promise.all([
      getEdition(surahNumber, "quran-uthmani"),
      getEdition(surahNumber, translationEdition),
      getEdition(surahNumber, "ar.alafasy"),
    ]);

    const ayahs = arabic.data.ayahs.map((ayah, index) => ({
      numberInSurah: ayah.numberInSurah,
      pageNumber: ayah.page,
      text: ayah.text,
      translation: translation.data.ayahs[index]?.text ?? "",
      audio: recitation.data.ayahs[index]?.audio ?? null,
    }));

    return NextResponse.json({
      surah: {
        number: arabic.data.number,
        name: arabic.data.name,
        englishName: arabic.data.englishName,
        englishNameTranslation: arabic.data.englishNameTranslation,
        numberOfAyahs: arabic.data.numberOfAyahs,
        revelationType: arabic.data.revelationType,
      },
      translationSource: translation.data.edition.englishName,
      ayahs,
    });
  } catch {
    return NextResponse.json(
      { error: "Quran content is temporarily unavailable. Please try again." },
      { status: 502 },
    );
  }
}
