import { and, eq, sql } from "drizzle-orm";
import { db } from "~/db";
import { courseReviews } from "~/db/schema";

export function getCourseRating(courseId: number, userId?: number | null) {
  const aggregate = db
    .select({ average: sql<number>`coalesce(avg(${courseReviews.rating}), 0)`, count: sql<number>`count(*)` })
    .from(courseReviews)
    .where(eq(courseReviews.courseId, courseId))
    .get();
  const userReview = userId
    ? db.select({ rating: courseReviews.rating }).from(courseReviews).where(and(eq(courseReviews.courseId, courseId), eq(courseReviews.userId, userId))).get()
    : undefined;
  return { average: Math.round((aggregate?.average ?? 0) * 10) / 10, count: aggregate?.count ?? 0, userRating: userReview?.rating ?? null };
}

export function saveCourseRating(courseId: number, userId: number, rating: number) {
  const existing = db.select({ id: courseReviews.id }).from(courseReviews).where(and(eq(courseReviews.courseId, courseId), eq(courseReviews.userId, userId))).get();
  if (existing) {
    db.update(courseReviews).set({ rating, updatedAt: new Date().toISOString() }).where(eq(courseReviews.id, existing.id)).run();
  } else {
    db.insert(courseReviews).values({ courseId, userId, rating }).run();
  }
  return getCourseRating(courseId, userId);
}
