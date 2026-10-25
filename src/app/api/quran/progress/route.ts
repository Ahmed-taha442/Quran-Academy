import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const activitySchema = z.object({
  activityType: z.enum(["READING", "MEMORIZATION", "REVIEW"]),
  surahNumber: z.number().int().min(1).max(114),
  fromAyah: z.number().int().min(1),
  toAyah: z.number().int().min(1),
  durationSeconds: z.number().int().min(0).max(86_400).default(0),
  selfRating: z.enum(["again", "hard", "good", "easy"]).optional(),
}).refine((value) => value.fromAyah <= value.toAyah, {
  message: "The starting ayah must not come after the ending ayah.",
  path: ["toAyah"],
});

async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  const role = (session.user as typeof session.user & { role?: string }).role;
  return { id: session.user.id, role };
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (user.role === "TEACHER") {
    const students = await prisma.studentProfile.findMany({
      where: { teacherId: user.id },
      select: {
        id: true,
        user: { select: { displayName: true } },
        quranActivities: {
          orderBy: { createdAt: "desc" },
          take: 50,
          select: {
            id: true, activityType: true, surahNumber: true, fromAyah: true,
            toAyah: true, durationSeconds: true, selfRating: true, createdAt: true,
          },
        },
      },
      orderBy: { user: { displayName: "asc" } },
    });
    return NextResponse.json({ students }, { headers: { "Cache-Control": "private, no-store" } });
  }

  if (user.role !== "STUDENT") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const profile = await prisma.studentProfile.findUnique({
    where: { userId: user.id },
    select: {
      id: true,
      quranActivities: {
        orderBy: { createdAt: "desc" },
        take: 100,
        select: {
          id: true, activityType: true, surahNumber: true, fromAyah: true,
          toAyah: true, durationSeconds: true, selfRating: true, createdAt: true,
        },
      },
    },
  });
  return NextResponse.json({ activities: profile?.quranActivities ?? [] }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "STUDENT") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const parsed = activitySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid activity data." }, { status: 400 });

  const profile = await prisma.studentProfile.findUnique({ where: { userId: user.id }, select: { id: true } });
  if (!profile) return NextResponse.json({ error: "Student profile not found." }, { status: 404 });

  const activity = await prisma.quranStudyActivity.create({
    data: { ...parsed.data, selfRating: parsed.data.selfRating ?? null, studentId: profile.id },
    select: {
      id: true, activityType: true, surahNumber: true, fromAyah: true,
      toAyah: true, durationSeconds: true, selfRating: true, createdAt: true,
    },
  });
  return NextResponse.json({ activity }, { status: 201, headers: { "Cache-Control": "private, no-store" } });
}
