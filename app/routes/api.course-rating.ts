import { z } from "zod";
import { data } from "react-router";
import type { Route } from "./+types/api.course-rating";
import { getCurrentUserId } from "~/lib/session";
import { getUserById } from "~/services/userService";
import { getCourseRating, saveCourseRating } from "~/services/courseReviewService";
import { getCourseById } from "~/services/courseService";
import { UserRole } from "~/db/schema";

const ratingSchema = z.object({
  courseId: z.coerce.number().int().positive(),
  rating: z.coerce.number().min(0.5).max(5).multipleOf(0.5),
});

export async function loader({ request }: Route.LoaderArgs) {
  const courseId = Number(new URL(request.url).searchParams.get("courseId"));
  if (!Number.isInteger(courseId) || courseId < 1) throw data("Invalid course ID.", { status: 400 });
  const userId = await getCurrentUserId(request);
  const user = userId ? getUserById(userId) : null;
  return { ...getCourseRating(courseId, userId), canRate: user?.role === UserRole.Student };
}

export async function action({ request }: Route.ActionArgs) {
  const userId = await getCurrentUserId(request);
  if (!userId) throw data("You must be logged in to review a course.", { status: 401 });
  const user = getUserById(userId);
  if (!user || user.role !== UserRole.Student) throw data("Only students can review courses.", { status: 403 });
  const parsed = ratingSchema.safeParse(Object.fromEntries(await request.formData()));
  if (!parsed.success) throw data("Choose a rating from 0.5 to 5 stars.", { status: 400 });
  if (!getCourseById(parsed.data.courseId)) throw data("Course not found.", { status: 404 });
  return { ...saveCourseRating(parsed.data.courseId, userId, parsed.data.rating), canRate: true };
}
