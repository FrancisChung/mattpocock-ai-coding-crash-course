import { beforeEach, describe, expect, it, vi } from "vitest";
import { createTestDb, seedBaseData } from "~/test/setup";
import * as schema from "~/db/schema";

let testDb: ReturnType<typeof createTestDb>;
let base: ReturnType<typeof seedBaseData>;

vi.mock("~/db", () => ({
  get db() {
    return testDb;
  },
  get getSqlite() {
    return () => null;
  },
}));

import { computeResult } from "./quizScoringService";

describe("quizScoringService", () => {
  beforeEach(() => {
    testDb = createTestDb();
    base = seedBaseData(testDb);
  });

  it("uses the configured passing score and treats the boundary as passing", () => {
    const module = testDb
      .insert(schema.modules)
      .values({ courseId: base.course.id, title: "Core", position: 1 })
      .returning()
      .get();
    const lesson = testDb
      .insert(schema.lessons)
      .values({ moduleId: module.id, title: "Lesson", position: 1 })
      .returning()
      .get();
    const quiz = testDb
      .insert(schema.quizzes)
      .values({ lessonId: lesson.id, title: "Quiz", passingScore: 0.5 })
      .returning()
      .get();
    const first = testDb
      .insert(schema.quizQuestions)
      .values({
        quizId: quiz.id,
        questionText: "One?",
        questionType: schema.QuestionType.MultipleChoice,
        position: 1,
      })
      .returning()
      .get();
    const second = testDb
      .insert(schema.quizQuestions)
      .values({
        quizId: quiz.id,
        questionText: "Two?",
        questionType: schema.QuestionType.MultipleChoice,
        position: 2,
      })
      .returning()
      .get();
    const firstCorrect = testDb
      .insert(schema.quizOptions)
      .values({ questionId: first.id, optionText: "Yes", isCorrect: true })
      .returning()
      .get();
    testDb
      .insert(schema.quizOptions)
      .values({ questionId: second.id, optionText: "Yes", isCorrect: true })
      .run();
    const secondWrong = testDb
      .insert(schema.quizOptions)
      .values({ questionId: second.id, optionText: "No", isCorrect: false })
      .returning()
      .get();

    const result = computeResult(base.user.id, quiz.id, {
      [first.id]: firstCorrect.id,
      [second.id]: secondWrong.id,
    });

    expect(result.score).toBe(0.5);
    expect(result.passed).toBe(true);
  });
});
