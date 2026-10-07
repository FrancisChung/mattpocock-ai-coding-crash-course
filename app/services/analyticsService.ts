import { asc, eq, inArray } from "drizzle-orm";
import { db } from "~/db";
import {
  CourseStatus,
  LessonProgressStatus,
  UserRole,
  courseRatings,
  courses,
  enrollments,
  lessonProgress,
  lessons,
  modules,
  purchases,
  quizAttempts,
  quizzes,
  users,
} from "~/db/schema";

export const ANALYTICS_MIN_COHORT = 5;

export type AnalyticsRange = {
  from: Date;
  to: Date;
  previousFrom: Date;
  previousTo: Date;
  label: string;
};

export type AnalyticsOptions = {
  viewerId: number;
  viewerRole: UserRole;
  instructorId?: number | null;
  courseId?: number | null;
  status?: CourseStatus | "all";
  range: AnalyticsRange;
};

type ComparisonMetric = {
  value: number;
  previous: number;
};

export type CourseAnalytics = {
  id: number;
  title: string;
  status: CourseStatus;
  instructorId: number;
  instructorName: string;
  grossSales: number;
  transactions: number;
  enrollments: number;
  completionRate: number | null;
  ratingAverage: number | null;
  ratingCount: number;
  firstAttemptAverage: number | null;
  firstAttemptMedian: number | null;
  quizAttemptRate: number | null;
  largestDropOff: number | null;
};

type LessonFunnelIdentity = {
  lessonId: number;
  lessonTitle: string;
  moduleTitle: string;
};

export type LessonFunnelRow = LessonFunnelIdentity &
  (
    | {
        reached: null;
        completed: null;
        cohortConversion: null;
        stepConversion: null;
        learnerLoss: null;
        suppressed: true;
      }
    | {
        reached: number;
        completed: number;
        cohortConversion: number;
        stepConversion: number | null;
        learnerLoss: number;
        suppressed: false;
      }
  );

export type QuizAnalyticsRow = {
  quizId: number;
  title: string;
  lessonTitle: string;
  reached: number;
  attemptedStudents: number;
  attemptRate: number | null;
  firstAttemptAverage: number | null;
  firstAttemptMedian: number | null;
  eventualPassRate: number | null;
  suppressed: boolean;
};

export type AnalyticsDashboard = {
  range: AnalyticsRange;
  selectedInstructorId: number | null;
  selectedCourseId: number | null;
  metrics: {
    grossSales: ComparisonMetric;
    newEnrollments: ComparisonMetric;
    completionRate: number | null;
    ratingAverage: number | null;
    ratingCount: number;
    firstAttemptAverage: number | null;
  };
  ratingDistribution: Record<number, number>;
  timeSeries: Array<{ date: string; grossSales: number; enrollments: number }>;
  courses: CourseAnalytics[];
  lessonFunnel: LessonFunnelRow[];
  quizzes: QuizAnalyticsRow[];
  insights: Array<{ title: string; detail: string; courseId: number }>;
};

function mean(values: number[]) {
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function median(values: number[]) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

function percent(numerator: number, denominator: number) {
  return denominator === 0 ? null : (numerator / denominator) * 100;
}

function round(value: number | null, places = 1) {
  if (value === null) return null;
  const multiplier = 10 ** places;
  return Math.round(value * multiplier) / multiplier;
}

function isWithin(value: string, from: Date, to: Date) {
  const time = new Date(value).getTime();
  return time >= from.getTime() && time < to.getTime();
}

export function getAnalyticsInstructors() {
  return db
    .select({ id: users.id, name: users.name })
    .from(users)
    .where(eq(users.role, UserRole.Instructor))
    .orderBy(asc(users.name))
    .all();
}

export function getAnalyticsDashboard(
  options: AnalyticsOptions
): AnalyticsDashboard {
  const effectiveInstructorId =
    options.viewerRole === UserRole.Admin
      ? (options.instructorId ?? null)
      : options.viewerId;

  let scopedCourses = db
    .select({
      id: courses.id,
      title: courses.title,
      status: courses.status,
      instructorId: courses.instructorId,
      instructorName: users.name,
    })
    .from(courses)
    .innerJoin(users, eq(courses.instructorId, users.id))
    .all();

  if (effectiveInstructorId !== null) {
    scopedCourses = scopedCourses.filter(
      (course) => course.instructorId === effectiveInstructorId
    );
  }
  if (options.courseId) {
    scopedCourses = scopedCourses.filter(
      (course) => course.id === options.courseId
    );
  }
  if (options.status && options.status !== "all") {
    scopedCourses = scopedCourses.filter(
      (course) => course.status === options.status
    );
  }

  const courseIds = scopedCourses.map((course) => course.id);
  if (courseIds.length === 0) {
    return emptyDashboard(
      options.range,
      effectiveInstructorId,
      options.courseId
    );
  }

  const enrollmentRows = db
    .select()
    .from(enrollments)
    .where(inArray(enrollments.courseId, courseIds))
    .all();
  const purchaseRows = db
    .select()
    .from(purchases)
    .where(inArray(purchases.courseId, courseIds))
    .all();
  const ratingRows = db
    .select()
    .from(courseRatings)
    .where(inArray(courseRatings.courseId, courseIds))
    .all();
  const moduleRows = db
    .select()
    .from(modules)
    .where(inArray(modules.courseId, courseIds))
    .orderBy(asc(modules.position))
    .all();
  const moduleIds = moduleRows.map((module) => module.id);
  const lessonRows = moduleIds.length
    ? db
        .select()
        .from(lessons)
        .where(inArray(lessons.moduleId, moduleIds))
        .orderBy(asc(lessons.position))
        .all()
    : [];
  const lessonIds = lessonRows.map((lesson) => lesson.id);
  const progressRows = lessonIds.length
    ? db
        .select()
        .from(lessonProgress)
        .where(inArray(lessonProgress.lessonId, lessonIds))
        .all()
    : [];
  const quizRows = lessonIds.length
    ? db
        .select()
        .from(quizzes)
        .where(inArray(quizzes.lessonId, lessonIds))
        .all()
    : [];
  const quizIds = quizRows.map((quiz) => quiz.id);
  const attemptRows = quizIds.length
    ? db
        .select()
        .from(quizAttempts)
        .where(inArray(quizAttempts.quizId, quizIds))
        .all()
    : [];

  const currentPurchases = purchaseRows.filter((purchase) =>
    isWithin(purchase.createdAt, options.range.from, options.range.to)
  );
  const previousPurchases = purchaseRows.filter((purchase) =>
    isWithin(
      purchase.createdAt,
      options.range.previousFrom,
      options.range.previousTo
    )
  );
  const currentEnrollments = enrollmentRows.filter((enrollment) =>
    isWithin(enrollment.enrolledAt, options.range.from, options.range.to)
  );
  const previousEnrollments = enrollmentRows.filter((enrollment) =>
    isWithin(
      enrollment.enrolledAt,
      options.range.previousFrom,
      options.range.previousTo
    )
  );

  const courseAnalytics = scopedCourses.map((course) => {
    const courseEnrollments = currentEnrollments.filter(
      (row) => row.courseId === course.id
    );
    const coursePurchases = currentPurchases.filter(
      (row) => row.courseId === course.id
    );
    const courseRatings = ratingRows.filter(
      (row) => row.courseId === course.id
    );
    const courseModuleIds = new Set(
      moduleRows
        .filter((row) => row.courseId === course.id)
        .map((row) => row.id)
    );
    const courseLessons = lessonRows.filter((row) =>
      courseModuleIds.has(row.moduleId)
    );
    const courseLessonIds = new Set(courseLessons.map((row) => row.id));
    const courseQuizzes = quizRows.filter((row) =>
      courseLessonIds.has(row.lessonId)
    );
    const courseQuizIds = new Set(courseQuizzes.map((row) => row.id));
    const courseAttempts = attemptRows.filter((row) =>
      courseQuizIds.has(row.quizId)
    );
    const firstAttempts = firstAttemptsByStudentAndQuiz(courseAttempts);
    const suppressOutcomes = courseEnrollments.length < ANALYTICS_MIN_COHORT;
    const funnel = buildLessonFunnel(
      course.id,
      courseEnrollments,
      courseLessons,
      moduleRows,
      progressRows
    );
    const courseQuizRows = buildQuizRows(
      courseQuizzes,
      courseLessons,
      courseEnrollments,
      progressRows,
      courseAttempts
    );

    return {
      ...course,
      grossSales: coursePurchases.reduce(
        (sum, purchase) => sum + purchase.amountPaid,
        0
      ),
      transactions: coursePurchases.length,
      enrollments: courseEnrollments.length,
      completionRate: suppressOutcomes
        ? null
        : round(
            percent(
              courseEnrollments.filter((row) => row.completedAt !== null)
                .length,
              courseEnrollments.length
            )
          ),
      ratingAverage:
        courseRatings.length < ANALYTICS_MIN_COHORT
          ? null
          : round(mean(courseRatings.map((row) => row.rating))),
      ratingCount: courseRatings.length,
      firstAttemptAverage: suppressOutcomes
        ? null
        : round(mean(firstAttempts.map((attempt) => attempt.score * 100))),
      firstAttemptMedian: suppressOutcomes
        ? null
        : round(median(firstAttempts.map((attempt) => attempt.score * 100))),
      quizAttemptRate: suppressOutcomes
        ? null
        : round(
            courseQuizRows.length
              ? mean(
                  courseQuizRows
                    .map((row) => row.attemptRate)
                    .filter((value): value is number => value !== null)
                )
              : null
          ),
      largestDropOff:
        suppressOutcomes || funnel.length === 0
          ? null
          : Math.max(
              ...funnel.flatMap((row) =>
                row.suppressed ? [] : [row.learnerLoss]
              )
            ),
    } satisfies CourseAnalytics;
  });

  const selectedCourse =
    options.courseId && scopedCourses.length === 1 ? scopedCourses[0] : null;
  const selectedCourseEnrollments = selectedCourse
    ? currentEnrollments.filter((row) => row.courseId === selectedCourse.id)
    : [];
  const selectedModuleIds = new Set(
    selectedCourse
      ? moduleRows
          .filter((row) => row.courseId === selectedCourse.id)
          .map((row) => row.id)
      : []
  );
  const selectedLessons = lessonRows.filter((row) =>
    selectedModuleIds.has(row.moduleId)
  );
  const selectedLessonIds = new Set(selectedLessons.map((row) => row.id));
  const selectedQuizzes = quizRows.filter((row) =>
    selectedLessonIds.has(row.lessonId)
  );
  const selectedQuizIds = new Set(selectedQuizzes.map((row) => row.id));
  const selectedAttempts = attemptRows.filter((row) =>
    selectedQuizIds.has(row.quizId)
  );

  const allFirstAttempts = firstAttemptsByStudentAndQuiz(attemptRows);
  const timeSeries = buildTimeSeries(
    currentPurchases,
    currentEnrollments,
    options.range
  );
  const ratingDistribution = Object.fromEntries(
    [1, 2, 3, 4, 5].map((rating) => [
      rating,
      ratingRows.filter((row) => row.rating === rating).length,
    ])
  );

  return {
    range: options.range,
    selectedInstructorId: effectiveInstructorId,
    selectedCourseId: options.courseId ?? null,
    metrics: {
      grossSales: {
        value: currentPurchases.reduce(
          (sum, purchase) => sum + purchase.amountPaid,
          0
        ),
        previous: previousPurchases.reduce(
          (sum, purchase) => sum + purchase.amountPaid,
          0
        ),
      },
      newEnrollments: {
        value: currentEnrollments.length,
        previous: previousEnrollments.length,
      },
      completionRate:
        currentEnrollments.length < ANALYTICS_MIN_COHORT
          ? null
          : round(
              percent(
                currentEnrollments.filter((row) => row.completedAt !== null)
                  .length,
                currentEnrollments.length
              )
            ),
      ratingAverage: round(mean(ratingRows.map((row) => row.rating))),
      ratingCount: ratingRows.length,
      firstAttemptAverage: round(
        mean(allFirstAttempts.map((attempt) => attempt.score * 100))
      ),
    },
    ratingDistribution,
    timeSeries,
    courses: courseAnalytics,
    lessonFunnel: selectedCourse
      ? buildLessonFunnel(
          selectedCourse.id,
          selectedCourseEnrollments,
          selectedLessons,
          moduleRows,
          progressRows
        )
      : [],
    quizzes: selectedCourse
      ? buildQuizRows(
          selectedQuizzes,
          selectedLessons,
          selectedCourseEnrollments,
          progressRows,
          selectedAttempts
        )
      : [],
    insights: buildInsights(courseAnalytics),
  };
}

function firstAttemptsByStudentAndQuiz(
  attempts: Array<typeof quizAttempts.$inferSelect>
) {
  const first = new Map<string, typeof quizAttempts.$inferSelect>();
  for (const attempt of attempts) {
    const key = `${attempt.userId}:${attempt.quizId}`;
    const existing = first.get(key);
    if (
      !existing ||
      attempt.attemptedAt < existing.attemptedAt ||
      (attempt.attemptedAt === existing.attemptedAt && attempt.id < existing.id)
    ) {
      first.set(key, attempt);
    }
  }
  return [...first.values()];
}

function buildLessonFunnel(
  courseId: number,
  courseEnrollments: Array<typeof enrollments.$inferSelect>,
  courseLessons: Array<typeof lessons.$inferSelect>,
  allModules: Array<typeof modules.$inferSelect>,
  allProgress: Array<typeof lessonProgress.$inferSelect>
): LessonFunnelRow[] {
  const modulesById = new Map(allModules.map((module) => [module.id, module]));
  const ordered = [...courseLessons].sort((a, b) => {
    const aModule = modulesById.get(a.moduleId);
    const bModule = modulesById.get(b.moduleId);
    return (
      (aModule?.position ?? 0) - (bModule?.position ?? 0) ||
      a.position - b.position
    );
  });
  const enrolledUsers = new Set(
    courseEnrollments
      .filter((row) => row.courseId === courseId)
      .map((row) => row.userId)
  );
  let previousReached = enrolledUsers.size;

  return ordered.map<LessonFunnelRow>((lesson) => {
    const rows = allProgress.filter(
      (row) => row.lessonId === lesson.id && enrolledUsers.has(row.userId)
    );
    const reached = new Set(rows.map((row) => row.userId)).size;
    const completed = new Set(
      rows
        .filter((row) => row.status === LessonProgressStatus.Completed)
        .map((row) => row.userId)
    ).size;
    const learnerLoss = Math.max(0, previousReached - reached);
    const cohortConversion = round(percent(reached, enrolledUsers.size)) ?? 0;
    const stepConversion = round(percent(reached, previousReached));
    const suppressed = enrolledUsers.size < ANALYTICS_MIN_COHORT;
    const identity: LessonFunnelIdentity = {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      moduleTitle: modulesById.get(lesson.moduleId)?.title ?? "Module",
    };
    previousReached = reached;
    if (suppressed) {
      return {
        ...identity,
        reached: null,
        completed: null,
        cohortConversion: null,
        stepConversion: null,
        learnerLoss: null,
        suppressed: true,
      };
    }
    return {
      ...identity,
      reached,
      completed,
      cohortConversion,
      stepConversion,
      learnerLoss,
      suppressed: false,
    };
  });
}

function buildQuizRows(
  courseQuizzes: Array<typeof quizzes.$inferSelect>,
  courseLessons: Array<typeof lessons.$inferSelect>,
  courseEnrollments: Array<typeof enrollments.$inferSelect>,
  allProgress: Array<typeof lessonProgress.$inferSelect>,
  attempts: Array<typeof quizAttempts.$inferSelect>
) {
  const lessonsById = new Map(
    courseLessons.map((lesson) => [lesson.id, lesson])
  );
  const enrolledUsers = new Set(courseEnrollments.map((row) => row.userId));

  return courseQuizzes.map((quiz): QuizAnalyticsRow => {
    const reachedUsers = new Set(
      allProgress
        .filter(
          (row) =>
            row.lessonId === quiz.lessonId && enrolledUsers.has(row.userId)
        )
        .map((row) => row.userId)
    );
    const quizAttemptsForEligibleUsers = attempts.filter(
      (attempt) =>
        attempt.quizId === quiz.id && reachedUsers.has(attempt.userId)
    );
    const attemptedUsers = new Set(
      quizAttemptsForEligibleUsers.map((attempt) => attempt.userId)
    );
    const firstAttempts = firstAttemptsByStudentAndQuiz(
      quizAttemptsForEligibleUsers
    );
    const bestByUser = new Map<number, typeof quizAttempts.$inferSelect>();
    for (const attempt of quizAttemptsForEligibleUsers) {
      const existing = bestByUser.get(attempt.userId);
      if (!existing || attempt.score > existing.score) {
        bestByUser.set(attempt.userId, attempt);
      }
    }
    const suppressed = reachedUsers.size < ANALYTICS_MIN_COHORT;

    return {
      quizId: quiz.id,
      title: quiz.title,
      lessonTitle: lessonsById.get(quiz.lessonId)?.title ?? "Lesson",
      reached: reachedUsers.size,
      attemptedStudents: attemptedUsers.size,
      attemptRate: suppressed
        ? null
        : round(percent(attemptedUsers.size, reachedUsers.size)),
      firstAttemptAverage: suppressed
        ? null
        : round(mean(firstAttempts.map((attempt) => attempt.score * 100))),
      firstAttemptMedian: suppressed
        ? null
        : round(median(firstAttempts.map((attempt) => attempt.score * 100))),
      eventualPassRate: suppressed
        ? null
        : round(
            percent(
              [...bestByUser.values()].filter(
                (attempt) => attempt.score >= quiz.passingScore
              ).length,
              bestByUser.size
            )
          ),
      suppressed,
    };
  });
}

function buildTimeSeries(
  currentPurchases: Array<typeof purchases.$inferSelect>,
  currentEnrollments: Array<typeof enrollments.$inferSelect>,
  range: AnalyticsRange
) {
  const days = new Map<
    string,
    { date: string; grossSales: number; enrollments: number }
  >();

  const rangeDays = Math.ceil(
    (range.to.getTime() - range.from.getTime()) / (24 * 60 * 60 * 1000)
  );
  if (rangeDays <= 366) {
    const cursor = new Date(range.from);
    while (cursor < range.to) {
      const date = cursor.toISOString().slice(0, 10);
      days.set(date, { date, grossSales: 0, enrollments: 0 });
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
  } else {
    for (const date of [
      ...currentPurchases.map((purchase) => purchase.createdAt.slice(0, 10)),
      ...currentEnrollments.map((enrollment) =>
        enrollment.enrolledAt.slice(0, 10)
      ),
    ]) {
      days.set(date, { date, grossSales: 0, enrollments: 0 });
    }
  }
  for (const purchase of currentPurchases) {
    const row = days.get(purchase.createdAt.slice(0, 10));
    if (row) row.grossSales += purchase.amountPaid;
  }
  for (const enrollment of currentEnrollments) {
    const row = days.get(enrollment.enrolledAt.slice(0, 10));
    if (row) row.enrollments += 1;
  }
  return [...days.values()].sort((a, b) => a.date.localeCompare(b.date));
}

function buildInsights(courseRows: CourseAnalytics[]) {
  const insights: AnalyticsDashboard["insights"] = [];
  for (const course of courseRows) {
    if ((course.largestDropOff ?? 0) >= ANALYTICS_MIN_COHORT) {
      insights.push({
        title: `Review ${course.title}'s lesson funnel`,
        detail: `${course.largestDropOff} learners are lost at its largest progression step.`,
        courseId: course.id,
      });
    }
    if (
      course.firstAttemptAverage !== null &&
      course.firstAttemptAverage < 70
    ) {
      insights.push({
        title: `Quiz difficulty in ${course.title}`,
        detail: `The first-attempt average is ${course.firstAttemptAverage}%.`,
        courseId: course.id,
      });
    }
    if (
      course.ratingCount >= ANALYTICS_MIN_COHORT &&
      (course.ratingAverage ?? 5) < 3.5
    ) {
      insights.push({
        title: `Course rating needs attention`,
        detail: `${course.title} is rated ${course.ratingAverage}/5 across ${course.ratingCount} ratings.`,
        courseId: course.id,
      });
    }
  }
  return insights.slice(0, 5);
}

function emptyDashboard(
  range: AnalyticsRange,
  instructorId: number | null,
  courseId?: number | null
): AnalyticsDashboard {
  return {
    range,
    selectedInstructorId: instructorId,
    selectedCourseId: courseId ?? null,
    metrics: {
      grossSales: { value: 0, previous: 0 },
      newEnrollments: { value: 0, previous: 0 },
      completionRate: null,
      ratingAverage: null,
      ratingCount: 0,
      firstAttemptAverage: null,
    },
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    timeSeries: [],
    courses: [],
    lessonFunnel: [],
    quizzes: [],
    insights: [],
  };
}
