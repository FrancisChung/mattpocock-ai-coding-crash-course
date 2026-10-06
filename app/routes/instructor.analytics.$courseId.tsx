import { data } from "react-router";
import type { Route } from "./+types/instructor.analytics.$courseId";
import { AnalyticsDashboard } from "~/components/analytics-dashboard";
import { requireInstructorOrAdmin, requireStaff } from "~/lib/access.server";
import {
  parseAnalyticsFilters,
  parseAnalyticsRange,
} from "~/lib/analytics.server";
import {
  getAnalyticsDashboard,
  getAnalyticsInstructors,
} from "~/services/analyticsService";

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    {
      title: `${loaderData?.detailCourse?.title ?? "Course"} Analytics — Cadence`,
    },
  ];
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const courseId = Number(params.courseId);
  if (!Number.isInteger(courseId) || courseId <= 0) {
    throw data("Course not found.", { status: 404 });
  }

  await requireStaff(request, courseId);
  const { userId, user, isAdmin } = await requireInstructorOrAdmin(request);
  const url = new URL(request.url);
  const filters = parseAnalyticsFilters(url, user.role);
  const range = parseAnalyticsRange(url);
  const analytics = getAnalyticsDashboard({
    viewerId: userId,
    viewerRole: user.role,
    instructorId: filters.instructorId,
    courseId,
    status: "all",
    range,
  });
  const detailCourse = analytics.courses[0];
  if (!detailCourse) throw data("Course not found.", { status: 404 });

  return {
    analytics,
    detailCourse,
    viewerRole: user.role,
    instructors: isAdmin ? getAnalyticsInstructors() : [],
    query: Object.fromEntries(url.searchParams.entries()),
  };
}

export default function InstructorCourseAnalytics({
  loaderData,
}: Route.ComponentProps) {
  return <AnalyticsDashboard {...loaderData} />;
}
