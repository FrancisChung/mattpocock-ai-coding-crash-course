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
});
