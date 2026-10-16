import { NextResponse } from "next/server";

export const revalidate = 86_400;

type ApiSurah = {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
};

export async function GET() {
  try {
    const response = await fetch("https://api.alquran.cloud/v1/surah", {
      next: { revalidate },
    });

    if (!response.ok) throw new Error("Quran provider unavailable");
    const result = (await response.json()) as { code: number; data: ApiSurah[] };
    if (result.code !== 200 || !Array.isArray(result.data)) {
      throw new Error("Invalid chapter list");
    }

    return NextResponse.json({ surahs: result.data });
  } catch {
    return NextResponse.json(
      { error: "Quran chapters are temporarily unavailable." },
      { status: 502 },
    );
  }
}
