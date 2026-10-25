type Activity = {
  activityType: string;
  surahNumber: number;
  fromAyah: number;
  toAyah: number;
  durationSeconds: number;
  selfRating: string | null;
};

const ratingScores: Record<string, number> = { again: 25, hard: 50, good: 75, easy: 100 };

export function summarizeQuranProgress(activities: Activity[]) {
  const ayahs = new Set<string>();
  for (const activity of activities) {
    for (let ayah = activity.fromAyah; ayah <= activity.toAyah; ayah += 1) {
      ayahs.add(`${activity.surahNumber}:${ayah}`);
    }
  }
  const ratings = activities
    .filter((activity) => activity.activityType === "REVIEW" && activity.selfRating && ratingScores[activity.selfRating])
    .map((activity) => ratingScores[activity.selfRating as string]);
  return {
    uniqueAyahs: ayahs.size,
    readingSessions: activities.filter((activity) => activity.activityType === "READING").length,
    reviewSessions: activities.filter((activity) => activity.activityType === "REVIEW" || activity.activityType === "MEMORIZATION").length,
    listeningMinutes: Math.round(activities.reduce((total, activity) => total + activity.durationSeconds, 0) / 60),
    selfRatingPercent: ratings.length ? Math.round(ratings.reduce((total, score) => total + score, 0) / ratings.length) : null,
  };
}
