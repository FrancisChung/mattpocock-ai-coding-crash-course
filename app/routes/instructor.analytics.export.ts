import type { Route } from "./+types/instructor.analytics.export";
import { requireInstructorOrAdmin, requireStaff } from "~/lib/access.server";
import {
  parseAnalyticsFilters,
  parseAnalyticsRange,
} from "~/lib/analytics.server";
import { getAnalyticsDashboard } from "~/services/analyticsService";

function csvCell(value: string | number | null) {
  const text = value === null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export async function loader({ request }: Route.LoaderArgs) {
  const { userId, user } = await requireInstructorOrAdmin(request);
  const url = new URL(request.url);
  const courseIdValue = Number(url.searchParams.get("course"));
  const courseId =
    Number.isInteger(courseIdValue) && courseIdValue > 0 ? courseIdValue : null;
  if (courseId) await requireStaff(request, courseId);

  const filters = parseAnalyticsFilters(url, user.role);
  const analytics = getAnalyticsDashboard({
    viewerId: userId,
    viewerRole: user.role,
    instructorId: filters.instructorId,
    courseId,
    status: courseId ? "all" : filters.status,
    range: parseAnalyticsRange(url),
  });
  const rows = [
    [
      "Course",
      "Status",
      "Instructor",
      "Gross sales USD",
      "Transactions",
      "Enrollments",
      "Completion rate",
      "Rating",
      "Rating count",
      "First-attempt average",
      "First-attempt median",
      "Quiz attempt rate",
    ],
    ...analytics.courses.map((course) => [
      course.title,
      course.status,
      course.instructorName,
      (course.grossSales / 100).toFixed(2),
      course.transactions,
      course.enrollments,
      course.completionRate,
      course.ratingAverage,
      course.ratingCount,
      course.firstAttemptAverage,
      course.firstAttemptMedian,
      course.quizAttemptRate,
    ]),
  ];
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="instructor-analytics-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
