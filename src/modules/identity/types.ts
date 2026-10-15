import type { ProficiencyLevel, UserRole } from "@/types/domain";

export interface AcademyUser {
  id: string;
  role: UserRole;
  displayName: string;
  email: string;
  preferredLocale: string;
  nativeLanguage: string;
}

export interface StudentProfile extends AcademyUser {
  role: "student";
  proficiency: ProficiencyLevel;
  teacherId?: string;
  guardianId?: string;
  enrolledTrackIds: string[];
}
