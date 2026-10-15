export interface LiveSession {
  id: string;
  teacherId: string;
  studentIds: string[];
  startsAt: string;
  durationMinutes: number;
  topic: "noor-bayan" | "quran-reading" | "tajweed" | "hifz";
  meetingUrl?: string;
}
