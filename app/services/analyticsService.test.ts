import { beforeEach, describe, expect, it, vi } from "vitest";
import { createTestDb, seedBaseData } from "~/test/setup";
import * as schema from "~/db/schema";

let testDb: ReturnType<typeof createTestDb>;
let base: ReturnType<typeof seedBaseData>;

vi.mock("~/db", () => ({
  get db() {
    return testDb;
  },
}));

import { getAnalyticsDashboard } from "./analyticsService";

const range = {
  from: new Date("2026-01-01T00:00:00.000Z"),
  to: new Date("2026-02-01T00:00:00.000Z"),
  previousFrom: new Date("2025-12-01T00:00:00.000Z"),
  previousTo: new Date("2026-01-01T00:00:00.000Z"),
  label: "January 2026",
};

function addCourseData() {
  const module = testDb
    .insert(schema.modules)
    .values({ courseId: base.course.id, title: "Core", position: 1 })
    .returning()
    .get();
  const lesson = testDb
    .insert(schema.lessons)
    .values({ moduleId: module.id, title: "Start", position: 1 })
    .returning()
    .get();
  const quiz = testDb
    .insert(schema.quizzes)
    .values({ lessonId: lesson.id, title: "Check", passingScore: 0.7 })
    .returning()
    .get();

  const students = [base.user];
  for (let index = 2; index <= 5; index++) {
    students.push(
      testDb
        .insert(schema.users)
        .values({
          name: `Student ${index}`,
          email: `student${index}@example.com`,
          role: schema.UserRole.Student,
        })
        .returning()
        .get()
    );
  }

  students.forEach((student, index) => {
    testDb
      .insert(schema.enrollments)
      .values({
        userId: student.id,
        courseId: base.course.id,
        enrolledAt: `2026-01-${String(index + 2).padStart(2, "0")}T00:00:00.000Z`,
        completedAt: index < 2 ? "2026-01-20T00:00:00.000Z" : null,
      })
      .run();
    testDb
      .insert(schema.lessonProgress)
      .values({
        userId: student.id,
        lessonId: lesson.id,
        status: schema.LessonProgressStatus.Completed,
        completedAt: "2026-01-10T00:00:00.000Z",
      })
      .run();
    testDb
      .insert(schema.quizAttempts)
      .values({
        userId: student.id,
        quizId: quiz.id,
        score: [0.5, 0.6, 0.7, 0.8, 0.9][index],
        passed: index >= 2,
        attemptedAt: "2026-01-11T00:00:00.000Z",
      })
      .run();
    testDb
      .insert(schema.courseRatings)
      .values({
        userId: student.id,
        courseId: base.course.id,
        rating: [1, 2, 3, 4, 5][index],
      })
      .run();
  });

  testDb
    .insert(schema.purchases)
    .values({
      userId: students[0].id,
      courseId: base.course.id,
      amountPaid: 12000,
      createdAt: "2026-01-05T00:00:00.000Z",
    })
    .run();
  testDb
    .insert(schema.purchases)
    .values({
      userId: students[1].id,
      courseId: base.course.id,
      amountPaid: 8000,
      createdAt: "2025-12-05T00:00:00.000Z",
    })
    .run();
}

describe("analyticsService", () => {
  beforeEach(() => {
    testDb = createTestDb();
    base = seedBaseData(testDb);
    addCourseData();
  });

  it("aggregates gross sales, outcomes, ratings and first attempts", () => {
    const dashboard = getAnalyticsDashboard({
      viewerId: base.instructor.id,
      viewerRole: schema.UserRole.Instructor,
      range,
      status: "all",
    });

    expect(dashboard.metrics.grossSales).toEqual({
      value: 12000,
      previous: 8000,
    });
    expect(dashboard.metrics.newEnrollments.value).toBe(5);
    expect(dashboard.metrics.completionRate).toBe(40);
    expect(dashboard.metrics.ratingAverage).toBe(3);
    expect(dashboard.metrics.firstAttemptAverage).toBe(70);
    expect(dashboard.courses[0].firstAttemptMedian).toBe(70);
    expect(dashboard.quizzes).toHaveLength(0);
  });

  it("reports completion for the selected enrollment cohort", () => {
    const earlierStudent = testDb
      .insert(schema.users)
      .values({
        name: "Earlier Student",
        email: "earlier-student@example.com",
        role: schema.UserRole.Student,
      })
      .returning()
      .get();
    testDb
      .insert(schema.enrollments)
      .values({
        userId: earlierStudent.id,
        courseId: base.course.id,
        enrolledAt: "2025-12-10T00:00:00.000Z",
        completedAt: "2025-12-20T00:00:00.000Z",
      })
      .run();

    const dashboard = getAnalyticsDashboard({
      viewerId: base.instructor.id,
      viewerRole: schema.UserRole.Instructor,
      range,
      status: "all",
    });

    expect(dashboard.metrics.completionRate).toBe(40);
    expect(dashboard.courses[0]).toMatchObject({
      enrollments: 5,
      completionRate: 40,
    });
  });

  it("includes sales across long all-time ranges in the time series", () => {
    const dashboard = getAnalyticsDashboard({
      viewerId: base.instructor.id,
      viewerRole: schema.UserRole.Instructor,
      range: {
        from: new Date("2000-01-01T00:00:00.000Z"),
        to: new Date("2026-02-01T00:00:00.000Z"),
        previousFrom: new Date("1973-12-01T00:00:00.000Z"),
        previousTo: new Date("2000-01-01T00:00:00.000Z"),
        label: "All time",
      },
      status: "all",
    });

    expect(dashboard.timeSeries).toContainEqual({
      date: "2026-01-05",
      grossSales: 12000,
      enrollments: 1,
    });
  });

  it("exposes unsuppressed course drill-downs at the five-person threshold", () => {
    const dashboard = getAnalyticsDashboard({
      viewerId: base.instructor.id,
      viewerRole: schema.UserRole.Instructor,
      courseId: base.course.id,
      range,
      status: "all",
    });

    expect(dashboard.lessonFunnel[0]).toMatchObject({
      reached: 5,
      completed: 5,
      suppressed: false,
    });
    expect(dashboard.quizzes[0]).toMatchObject({
      reached: 5,
      attemptedStudents: 5,
      attemptRate: 100,
      firstAttemptAverage: 70,
      firstAttemptMedian: 70,
      eventualPassRate: 60,
      suppressed: false,
    });
  });

  it("uses eligible learners' first attempts and their best eventual result", () => {
    const quiz = testDb.select().from(schema.quizzes).get()!;
    testDb
      .insert(schema.quizAttempts)
      .values({
        userId: base.user.id,
        quizId: quiz.id,
        score: 1,
        passed: true,
        attemptedAt: "2026-01-12T00:00:00.000Z",
      })
      .run();
    const outsider = testDb
      .insert(schema.users)
      .values({
        name: "Not Eligible",
        email: "not-eligible@example.com",
        role: schema.UserRole.Student,
      })
      .returning()
      .get();
    testDb
      .insert(schema.quizAttempts)
      .values({
        userId: outsider.id,
        quizId: quiz.id,
        score: 0,
        passed: false,
        attemptedAt: "2026-01-01T00:00:00.000Z",
      })
      .run();

    const dashboard = getAnalyticsDashboard({
      viewerId: base.instructor.id,
      viewerRole: schema.UserRole.Instructor,
      courseId: base.course.id,
      range,
      status: "all",
    });

    expect(dashboard.metrics.firstAttemptAverage).toBe(70);
    expect(dashboard.courses[0]).toMatchObject({
      firstAttemptAverage: 70,
      firstAttemptMedian: 70,
    });
    expect(dashboard.quizzes[0]).toMatchObject({
      reached: 5,
      attemptedStudents: 5,
      firstAttemptAverage: 70,
      firstAttemptMedian: 70,
      eventualPassRate: 80,
    });
  });

  it("suppresses rating outcomes below five ratings", () => {
    testDb.delete(schema.courseRatings).run();
    const cohort = testDb.select().from(schema.enrollments).all();
    cohort.slice(0, 4).forEach((enrollment, index) => {
      testDb
        .insert(schema.courseRatings)
        .values({
          userId: enrollment.userId,
          courseId: base.course.id,
          rating: index + 1,
        })
        .run();
    });

    const dashboard = getAnalyticsDashboard({
      viewerId: base.instructor.id,
      viewerRole: schema.UserRole.Instructor,
      courseId: base.course.id,
      range,
      status: "all",
    });

    expect(dashboard.metrics.ratingCount).toBe(4);
    expect(dashboard.metrics.ratingAverage).toBeNull();
    expect(dashboard.ratingDistribution).toBeNull();
    expect(dashboard.courses[0]).toMatchObject({
      ratingAverage: null,
      ratingCount: 4,
    });
  });

  it("does not aggregate scores from a quiz with fewer than five eligible learners", () => {
    const lesson = testDb.select().from(schema.lessons).get()!;
    testDb.delete(schema.lessonProgress).run();
    testDb
      .insert(schema.lessonProgress)
      .values({
        userId: base.user.id,
        lessonId: lesson.id,
        status: schema.LessonProgressStatus.Completed,
      })
      .run();

    const dashboard = getAnalyticsDashboard({
      viewerId: base.instructor.id,
      viewerRole: schema.UserRole.Instructor,
      courseId: base.course.id,
      range,
      status: "all",
    });

    expect(dashboard.quizzes[0].suppressed).toBe(true);
    expect(dashboard.courses[0]).toMatchObject({
      firstAttemptAverage: null,
      firstAttemptMedian: null,
    });
    expect(dashboard.metrics.firstAttemptAverage).toBeNull();
  });

  it("weights portfolio ratings across individual rating rows", () => {
    const secondCourse = testDb
      .insert(schema.courses)
      .values({
        title: "Small Course",
        slug: "small-course",
        description: "A small course",
        salesCopy: "Learn in a small cohort",
        instructorId: base.instructor.id,
        categoryId: base.category.id,
        status: schema.CourseStatus.Published,
        price: 1000,
      })
      .returning()
      .get();
    testDb
      .insert(schema.courseRatings)
      .values({
        userId: base.user.id,
        courseId: secondCourse.id,
        rating: 5,
      })
      .run();

    const dashboard = getAnalyticsDashboard({
      viewerId: base.instructor.id,
      viewerRole: schema.UserRole.Instructor,
      range,
      status: "all",
    });

    expect(dashboard.metrics.ratingAverage).toBe(3.3);
    expect(dashboard.metrics.ratingCount).toBe(6);
    expect(dashboard.ratingDistribution).toEqual({
      1: 1,
      2: 1,
      3: 1,
      4: 1,
      5: 2,
    });
  });

  it("orders the lesson funnel and reports cohort and step conversion", () => {
    const advancedModule = testDb
      .insert(schema.modules)
      .values({ courseId: base.course.id, title: "Advanced", position: 2 })
      .returning()
      .get();
    const endLesson = testDb
      .insert(schema.lessons)
      .values({ moduleId: advancedModule.id, title: "End", position: 2 })
      .returning()
      .get();
    const middleLesson = testDb
      .insert(schema.lessons)
      .values({ moduleId: advancedModule.id, title: "Middle", position: 1 })
      .returning()
      .get();
    const cohort = testDb.select().from(schema.enrollments).all();

    cohort.slice(0, 4).forEach((enrollment) => {
      testDb
        .insert(schema.lessonProgress)
        .values({
          userId: enrollment.userId,
          lessonId: middleLesson.id,
          status: schema.LessonProgressStatus.Completed,
        })
        .run();
    });
    cohort.slice(0, 2).forEach((enrollment) => {
      testDb
        .insert(schema.lessonProgress)
        .values({
          userId: enrollment.userId,
          lessonId: endLesson.id,
          status: schema.LessonProgressStatus.Completed,
        })
        .run();
    });

    const dashboard = getAnalyticsDashboard({
      viewerId: base.instructor.id,
      viewerRole: schema.UserRole.Instructor,
      courseId: base.course.id,
      range,
      status: "all",
    });

    expect(dashboard.lessonFunnel).toMatchObject([
      {
        lessonTitle: "Start",
        cohortConversion: 100,
        stepConversion: 100,
        learnerLoss: 0,
      },
      {
        lessonTitle: "Middle",
        cohortConversion: 80,
        stepConversion: 80,
        learnerLoss: 1,
      },
      {
        lessonTitle: "End",
        cohortConversion: 40,
        stepConversion: 50,
        learnerLoss: 2,
      },
    ]);
  });

  it("suppresses lesson outcomes below the five-person cohort boundary", () => {
    const dashboard = getAnalyticsDashboard({
      viewerId: base.instructor.id,
      viewerRole: schema.UserRole.Instructor,
      courseId: base.course.id,
      range: {
        from: new Date("2026-01-02T00:00:00.000Z"),
        to: new Date("2026-01-06T00:00:00.000Z"),
        previousFrom: new Date("2025-12-29T00:00:00.000Z"),
        previousTo: new Date("2026-01-02T00:00:00.000Z"),
        label: "January 2 to January 5",
      },
      status: "all",
    });

    expect(dashboard.lessonFunnel[0]).toEqual({
      lessonId: expect.any(Number),
      lessonTitle: "Start",
      moduleTitle: "Core",
      reached: null,
      completed: null,
      cohortConversion: null,
      stepConversion: null,
      learnerLoss: null,
      suppressed: true,
    });
    expect(dashboard.metrics.completionRate).toBeNull();
    expect(dashboard.metrics.firstAttemptAverage).toBeNull();
    expect(dashboard.courses[0].completionRate).toBeNull();
    expect(dashboard.quizzes[0]).toEqual({
      quizId: expect.any(Number),
      title: "Check",
      lessonTitle: "Start",
      reached: null,
      attemptedStudents: null,
      attemptRate: null,
      firstAttemptAverage: null,
      firstAttemptMedian: null,
      eventualPassRate: null,
      suppressed: true,
    });
  });

  it("does not expose another instructor's courses", () => {
    const otherInstructor = testDb
      .insert(schema.users)
      .values({
        name: "Other Instructor",
        email: "other-instructor@example.com",
        role: schema.UserRole.Instructor,
      })
      .returning()
      .get();

    const dashboard = getAnalyticsDashboard({
      viewerId: otherInstructor.id,
      viewerRole: schema.UserRole.Instructor,
      range,
      status: "all",
    });

    expect(dashboard.courses).toEqual([]);
    expect(dashboard.metrics.grossSales.value).toBe(0);
  });

  it("returns an empty dashboard when valid filters match no courses", () => {
    const dashboard = getAnalyticsDashboard({
      viewerId: base.instructor.id,
      viewerRole: schema.UserRole.Instructor,
      range,
      status: schema.CourseStatus.Draft,
    });

    expect(dashboard.courses).toEqual([]);
    expect(dashboard.timeSeries).toEqual([]);
    expect(dashboard.metrics.grossSales).toEqual({ value: 0, previous: 0 });
  });
});
