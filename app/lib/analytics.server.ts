import { CourseStatus, UserRole } from "~/db/schema";
import type { AnalyticsRange } from "~/services/analyticsService";

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfUtcDay(date: Date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * DAY_MS);
}

export function parseAnalyticsRange(url: URL): AnalyticsRange {
  const preset = url.searchParams.get("range") ?? "30d";
  const today = startOfUtcDay(new Date());
  const to = addDays(today, 1);
  let from: Date;
  let label: string;

  if (preset === "custom") {
    const customFrom = url.searchParams.get("from");
    const customTo = url.searchParams.get("to");
    const parsedFrom = customFrom
      ? new Date(`${customFrom}T00:00:00.000Z`)
      : null;
    const parsedTo = customTo ? new Date(`${customTo}T00:00:00.000Z`) : null;
    if (
      parsedFrom &&
      parsedTo &&
      !Number.isNaN(parsedFrom.getTime()) &&
      !Number.isNaN(parsedTo.getTime()) &&
      parsedFrom <= parsedTo
    ) {
      from = parsedFrom;
      const customEnd = addDays(parsedTo, 1);
      const duration = customEnd.getTime() - from.getTime();
      return {
        from,
        to: customEnd,
        previousFrom: new Date(from.getTime() - duration),
        previousTo: from,
        label: `${customFrom} to ${customTo}`,
      };
    }
  }

  if (preset === "7d") {
    from = addDays(to, -7);
    label = "Last 7 days";
  } else if (preset === "90d") {
    from = addDays(to, -90);
    label = "Last 90 days";
  } else if (preset === "ytd") {
    from = new Date(Date.UTC(today.getUTCFullYear(), 0, 1));
    label = "Year to date";
  } else if (preset === "all") {
    from = new Date(Date.UTC(2000, 0, 1));
    label = "All time";
  } else {
    from = addDays(to, -30);
    label = "Last 30 days";
  }

  const duration = to.getTime() - from.getTime();
  return {
    from,
    to,
    previousFrom: new Date(from.getTime() - duration),
    previousTo: from,
    label,
  };
}

export function parseAnalyticsFilters(
  url: URL,
  viewerRole: UserRole
): { instructorId: number | null; status: CourseStatus | "all" } {
  const instructorValue = Number(url.searchParams.get("instructor"));
  const statusValue = url.searchParams.get("status");
  const status: CourseStatus | "all" = Object.values(CourseStatus).includes(
    statusValue as CourseStatus
  )
    ? (statusValue as CourseStatus)
    : statusValue === "all"
      ? "all"
      : CourseStatus.Published;

  return {
    instructorId:
      viewerRole === UserRole.Admin &&
      Number.isInteger(instructorValue) &&
      instructorValue > 0
        ? instructorValue
        : null,
    status,
  };
}
