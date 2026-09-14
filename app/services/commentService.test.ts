import { beforeEach, describe, expect, it, vi } from "vitest";
import { createTestDb, seedBaseData } from "~/test/setup";
import * as schema from "~/db/schema";

let testDb: ReturnType<typeof createTestDb>;
let base: ReturnType<typeof seedBaseData>;
let reporter: typeof base.user;

vi.mock("~/db", () => ({
  get db() {
    return testDb;
  },
}));

import {
  createComment,
  deleteComment,
  editComment,
  getCommentPage,
  reportComment,
  setCommentAnswered,
  setCommentPinned,
} from "./commentService";

function createLesson() {
  const module = testDb.insert(schema.modules).values({ courseId: base.course.id, title: "Module 1", position: 1 }).returning().get();
  return testDb.insert(schema.lessons).values({ moduleId: module.id, title: "Lesson 1", position: 1 }).returning().get();
}

describe("commentService", () => {
  beforeEach(() => {
    testDb = createTestDb();
    base = seedBaseData(testDb);
    reporter = testDb.insert(schema.users).values({ name: "Second Student", email: "second@example.com", role: schema.UserRole.Student }).returning().get();
    testDb.insert(schema.enrollments).values({ userId: base.user.id, courseId: base.course.id }).run();
    testDb.insert(schema.enrollments).values({ userId: reporter.id, courseId: base.course.id }).run();
  });

  it("creates top-level comments and one-level replies", () => {
    const lesson = createLesson();
    const parent = createComment(lesson.id, base.user.id, "Question", null);
    const reply = createComment(lesson.id, base.instructor.id, "Answer", parent.id);

    expect(reply.parentId).toBe(parent.id);
    expect(getCommentPage(lesson.id, base.user.id)?.comments[0].replies[0].content).toBe("Answer");
  });

  it("edits and soft-deletes comments while retaining replies", () => {
    const lesson = createLesson();
    const comment = createComment(lesson.id, base.user.id, "Original", null);
    createComment(lesson.id, base.instructor.id, "Reply", comment.id);
    editComment(comment.id, base.user.id, "Edited");
    deleteComment(comment.id, base.user.id);

    const page = getCommentPage(lesson.id, base.user.id)!;
    expect(page.comments[0].isHiddenPlaceholder).toBe(true);
    expect(page.comments[0].replies).toHaveLength(1);
  });

  it("supports moderator pinning, answering, and reporting", () => {
    const lesson = createLesson();
    const comment = createComment(lesson.id, base.user.id, "Question", null);
    setCommentPinned(comment.id, base.instructor.id, true);
    setCommentAnswered(comment.id, base.instructor.id, true);
    const report = reportComment(comment.id, reporter.id, "other", "Needs review");

    expect(report.status).toBe(schema.CommentReportStatus.Open);
    expect(getCommentPage(lesson.id, null)?.comments[0].isPinned).toBe(true);
    expect(getCommentPage(lesson.id, null)?.comments[0].isAnswered).toBe(true);
  });
});
