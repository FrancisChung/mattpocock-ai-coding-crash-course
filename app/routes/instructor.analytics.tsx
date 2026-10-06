import type { Route } from "./+types/instructor.analytics";
import { AnalyticsDashboard } from "~/components/analytics-dashboard";
import { requireInstructorOrAdmin } from "~/lib/access.server";
import {
  parseAnalyticsFilters,
  parseAnalyticsRange,
} from "~/lib/analytics.server";
import {
  getAnalyticsDashboard,
  getAnalyticsInstructors,
} from "~/services/analyticsService";

export function meta() {
  return [
    { title: "Instructor Analytics — Cadence" },
    {
      name: "description",
      content: "Revenue and learning analytics for course instructors",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { userId, user, isAdmin } = await requireInstructorOrAdmin(request);
  const url = new URL(request.url);
  const filters = parseAnalyticsFilters(url, user.role);
  const range = parseAnalyticsRange(url);
  const analytics = getAnalyticsDashboard({
    viewerId: userId,
    viewerRole: user.role,
    instructorId: filters.instructorId,
    status: filters.status,
    range,
  });

  return {
    analytics,
    viewerRole: user.role,
    instructors: isAdmin ? getAnalyticsInstructors() : [],
    query: Object.fromEntries(url.searchParams.entries()),
  };
}

export default function InstructorAnalytics({
  loaderData,
}: Route.ComponentProps) {
  return <AnalyticsDashboard {...loaderData} />;
}
