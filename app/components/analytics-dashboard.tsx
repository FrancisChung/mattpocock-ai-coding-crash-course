import { Link } from "react-router";
import {
  ArrowDownRight,
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  CircleDollarSign,
  Download,
  GraduationCap,
  Lightbulb,
  Star,
  Users,
} from "lucide-react";
import { CourseStatus, UserRole } from "~/db/schema";
import type { AnalyticsDashboard as AnalyticsData } from "~/services/analyticsService";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

type InstructorOption = { id: number; name: string };

type Props = {
  analytics: AnalyticsData;
  viewerRole: UserRole;
  instructors: InstructorOption[];
  query: Record<string, string>;
  detailCourse?: AnalyticsData["courses"][number] | null;
};

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function comparison(current: number, previous: number) {
  if (previous === 0) return "No prior-period data";
  const change = ((current - previous) / previous) * 100;
  return `${change >= 0 ? "+" : ""}${change.toFixed(1)}% vs prior period`;
}

function MetricCard({
  title,
  value,
  detail,
  icon,
}: {
  title: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span className="text-muted-foreground">{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}

function queryString(query: Record<string, string>, additions = {}) {
  return new URLSearchParams({ ...query, ...additions }).toString();
}

export function AnalyticsDashboard({
  analytics,
  viewerRole,
  instructors,
  query,
  detailCourse,
}: Props) {
  const maxDailySales = Math.max(
    1,
    ...analytics.timeSeries.map((point) => point.grossSales)
  );
  const exportHref = `/instructor/analytics/export?${queryString(query, {
    ...(detailCourse ? { course: String(detailCourse.id) } : {}),
  })}`;

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <nav className="mb-3 text-sm text-muted-foreground">
            <Link to="/instructor" className="hover:text-foreground">
              Instructor
            </Link>
            <span className="mx-2">/</span>
            <Link to="/instructor/analytics" className="hover:text-foreground">
              Analytics
            </Link>
            {detailCourse ? (
              <>
                <span className="mx-2">/</span>
                <span className="text-foreground">{detailCourse.title}</span>
              </>
            ) : null}
          </nav>
          <h1 className="text-3xl font-bold">
            {detailCourse ? detailCourse.title : "Analytics"}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {detailCourse
              ? "Lesson progression, quiz effectiveness, and course outcomes"
              : viewerRole === UserRole.Admin
                ? "Revenue and learning outcomes across the platform"
                : "Revenue and learning outcomes across your course portfolio"}
          </p>
        </div>
        <Button asChild variant="outline">
          <a href={exportHref}>
            <Download className="mr-2 size-4" />
            Export CSV
          </a>
        </Button>
      </div>

      <form
        method="get"
        className="grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-5"
      >
        <label className="text-sm font-medium">
          Period
          <select
            name="range"
            defaultValue={query.range ?? "30d"}
            className="mt-1 block h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="ytd">Year to date</option>
            <option value="all">All time</option>
            <option value="custom">Custom range</option>
          </select>
        </label>
        <label className="text-sm font-medium">
          From
          <input
            type="date"
            name="from"
            defaultValue={query.from}
            className="mt-1 block h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </label>
        <label className="text-sm font-medium">
          To
          <input
            type="date"
            name="to"
            defaultValue={query.to}
            className="mt-1 block h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </label>
        <label className="text-sm font-medium">
          Course status
          <select
            name="status"
            defaultValue={query.status ?? CourseStatus.Published}
            className="mt-1 block h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value={CourseStatus.Published}>Published</option>
            <option value={CourseStatus.Draft}>Draft</option>
            <option value={CourseStatus.Archived}>Archived</option>
            <option value="all">All statuses</option>
          </select>
        </label>
        {viewerRole === UserRole.Admin ? (
          <label className="text-sm font-medium">
            Instructor
            <select
              name="instructor"
              defaultValue={query.instructor ?? ""}
              className="mt-1 block h-10 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="">All instructors</option>
              {instructors.map((instructor) => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.name}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <div />
        )}
        <div className="md:col-span-5 flex justify-end">
          <Button type="submit">Apply filters</Button>
        </div>
      </form>

      <p className="text-xs text-muted-foreground">
        {analytics.range.label} · Calculated live from current transactional
        records · Monetary values are gross sales in USD, not earnings. Ratings
        show current state, not historical trends. Progression indicates course
        reach, not learner abandonment. Historical records are attributed to
        each course's current owner because ownership history is not stored.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          title="Gross sales"
          value={money.format(analytics.metrics.grossSales.value / 100)}
          detail={comparison(
            analytics.metrics.grossSales.value,
            analytics.metrics.grossSales.previous
          )}
          icon={<CircleDollarSign className="size-4" />}
        />
        <MetricCard
          title="New enrollments"
          value={String(analytics.metrics.newEnrollments.value)}
          detail={comparison(
            analytics.metrics.newEnrollments.value,
            analytics.metrics.newEnrollments.previous
          )}
          icon={<Users className="size-4" />}
        />
        <MetricCard
          title="Cohort completion"
          value={
            analytics.metrics.completionRate === null
              ? "Not enough data"
              : `${analytics.metrics.completionRate}%`
          }
          detail="Selected-period cohort; recent learners may still be progressing"
          icon={<BookOpenCheck className="size-4" />}
        />
        <MetricCard
          title="Portfolio rating"
          value={
            analytics.metrics.ratingAverage === null
              ? "Not enough data"
              : `${analytics.metrics.ratingAverage}/5`
          }
          detail={`${analytics.metrics.ratingCount} ratings`}
          icon={<Star className="size-4" />}
        />
        <MetricCard
          title="First-attempt score"
          value={
            analytics.metrics.firstAttemptAverage === null
              ? "Not enough data"
              : `${analytics.metrics.firstAttemptAverage}%`
          }
          detail="Students who attempted a quiz"
          icon={<GraduationCap className="size-4" />}
        />
      </div>

      {analytics.courses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BarChart3 className="mx-auto mb-3 size-10 text-muted-foreground" />
            <h2 className="font-semibold">No analytics yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              No courses match these filters. Adjust the filters to see
              available analytics.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {!detailCourse && analytics.courses.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Sales and enrollments</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="flex h-48 items-end gap-1"
                aria-label="Gross sales by day"
              >
                {analytics.timeSeries.map((point) => (
                  <div
                    key={point.date}
                    title={`${point.date}: ${money.format(point.grossSales / 100)}, ${point.enrollments} enrollments`}
                    className="min-w-1 flex-1 rounded-t bg-primary/70"
                    style={{
                      height: `${Math.max(2, (point.grossSales / maxDailySales) * 100)}%`,
                    }}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>{analytics.timeSeries[0]?.date}</span>
                <span>{analytics.timeSeries.at(-1)?.date}</span>
              </div>
            </CardContent>
          </Card>
          <RatingDistributionCard analytics={analytics} />
        </div>
      ) : null}

      {analytics.insights.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="size-5" />
              Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {analytics.insights.map((insight) => (
              <Link
                key={`${insight.courseId}-${insight.title}`}
                to={`/instructor/analytics/${insight.courseId}?${queryString(query)}`}
                className="rounded-lg border p-4 hover:bg-muted/50"
              >
                <div className="font-medium">{insight.title}</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {insight.detail}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {insight.rule}
                </p>
              </Link>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {!detailCourse && analytics.courses.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Course comparison</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3">Course</th>
                  <th className="pb-3">Gross sales</th>
                  <th className="pb-3">Enrollments</th>
                  <th className="pb-3">Completion</th>
                  <th className="pb-3">Rating</th>
                  <th className="pb-3">First attempt</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {analytics.courses.map((course) => (
                  <tr key={course.id} className="border-b last:border-0">
                    <td className="py-3">
                      <div className="font-medium">{course.title}</div>
                      <div className="text-xs capitalize text-muted-foreground">
                        {course.status}
                      </div>
                    </td>
                    <td>
                      {money.format(course.grossSales / 100)}
                      <div className="text-xs text-muted-foreground">
                        {course.transactions} transactions
                      </div>
                    </td>
                    <td>{course.enrollments}</td>
                    <td>
                      {course.completionRate === null
                        ? "Not enough data"
                        : `${course.completionRate}%`}
                    </td>
                    <td>
                      {course.ratingAverage === null
                        ? "—"
                        : `${course.ratingAverage}/5`}
                      <div className="text-xs text-muted-foreground">
                        {course.ratingCount} ratings
                      </div>
                    </td>
                    <td>
                      {course.firstAttemptAverage === null
                        ? "Not enough data"
                        : `${course.firstAttemptAverage}%`}
                    </td>
                    <td>
                      <Button asChild size="sm" variant="ghost">
                        <Link
                          to={`/instructor/analytics/${course.id}?${queryString(query)}`}
                        >
                          Explore <ArrowRight className="ml-1 size-4" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : null}

      {detailCourse ? <CourseDetail analytics={analytics} /> : null}
    </div>
  );
}

function CourseDetail({ analytics }: { analytics: AnalyticsData }) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <RatingDistributionCard analytics={analytics} />
      <Card>
        <CardHeader>
          <CardTitle>Lesson progression</CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.lessonFunnel.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No lessons are available.
            </p>
          ) : (
            <div className="space-y-3">
              {analytics.lessonFunnel.map((row) => (
                <div key={row.lessonId} className="rounded-lg border p-3">
                  <div className="flex justify-between gap-4">
                    <div>
                      <div className="font-medium">{row.lessonTitle}</div>
                      <div className="text-xs text-muted-foreground">
                        {row.moduleTitle}
                      </div>
                    </div>
                    {row.suppressed ? (
                      <span className="text-xs text-muted-foreground">
                        Not enough data
                      </span>
                    ) : (
                      <div className="text-right text-sm">
                        <div>
                          {row.reached} reached · {row.completed} completed
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {row.cohortConversion}% of cohort ·{" "}
                          {row.stepConversion ?? 0}% step conversion
                        </div>
                      </div>
                    )}
                  </div>
                  {!row.suppressed && row.learnerLoss > 0 ? (
                    <div className="mt-2 flex items-center text-xs text-amber-700">
                      <ArrowDownRight className="mr-1 size-3" />
                      {row.learnerLoss} learner progression drop-off
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Quiz effectiveness</CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.quizzes.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No quizzes are available.
            </p>
          ) : (
            <div className="space-y-3">
              {analytics.quizzes.map((quiz) => (
                <div key={quiz.quizId} className="rounded-lg border p-3">
                  <div className="font-medium">{quiz.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {quiz.lessonTitle}
                  </div>
                  {quiz.suppressed ? (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Not enough data (minimum cohort: 5)
                    </p>
                  ) : (
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm lg:grid-cols-4">
                      <div>
                        <span className="block text-xs text-muted-foreground">
                          Lesson reach
                        </span>
                        {quiz.reached} learners
                      </div>
                      <div>
                        <span className="block text-xs text-muted-foreground">
                          Attempt rate
                        </span>
                        {quiz.attemptRate ?? 0}%
                      </div>
                      <div>
                        <span className="block text-xs text-muted-foreground">
                          First attempt
                        </span>
                        {quiz.firstAttemptAverage === null ||
                        quiz.firstAttemptMedian === null
                          ? "No attempts"
                          : `${quiz.firstAttemptAverage}% avg · ${quiz.firstAttemptMedian}% median`}
                      </div>
                      <div>
                        <span className="block text-xs text-muted-foreground">
                          Eventual pass
                        </span>
                        {quiz.eventualPassRate === null
                          ? "No attempts"
                          : `${quiz.eventualPassRate}%`}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function RatingDistributionCard({ analytics }: { analytics: AnalyticsData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current rating distribution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {analytics.ratingDistribution === null ? (
          <p className="text-sm text-muted-foreground">Not enough data</p>
        ) : (
          [5, 4, 3, 2, 1].map((rating) => {
            const count = analytics.ratingDistribution?.[rating] ?? 0;
            const width = analytics.metrics.ratingCount
              ? (count / analytics.metrics.ratingCount) * 100
              : 0;
            return (
              <div key={rating} className="flex items-center gap-2 text-sm">
                <span className="w-8">{rating}★</span>
                <div className="h-2 flex-1 overflow-hidden rounded bg-muted">
                  <div
                    className="h-full bg-amber-500"
                    style={{ width: `${width}%` }}
                  />
                </div>
                <span className="w-6 text-right text-muted-foreground">
                  {count}
                </span>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
