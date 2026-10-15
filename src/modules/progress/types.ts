export interface LessonProgress {
  studentId: string;
  lessonId: string;
  status: "not-started" | "in-progress" | "completed" | "needs-review";
  score?: number;
  updatedAt: string;
}

export interface TeacherFeedback {
  id: string;
  studentId: string;
  lessonId: string;
  teacherId: string;
  audioNoteUrl?: string;
  comment: string;
  createdAt: string;
}
