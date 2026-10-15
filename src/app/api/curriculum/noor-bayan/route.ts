import { NextResponse } from "next/server";
import { noorBayanLessons } from "@/modules/noor-bayan";

export function GET() {
  return NextResponse.json({ lessons: noorBayanLessons });
}
