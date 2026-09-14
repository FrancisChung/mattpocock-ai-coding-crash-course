import { and, asc, desc, eq, inArray, isNull, sql } from "drizzle-orm";
import { db } from "~/db";
import {
  CommentReportStatus,
  CommentStatus,
  comments,
  commentReports,
  courses,
  lessons,
  modules,
  UserRole,
  users,
} from "~/db/schema";
import { isUserEnrolled } from "~/services/enrollmentService";

export const COMMENT_LIMIT = 2000;
export const COMMENT_PAGE_SIZE = 20;

type FormattedComment = {
  id: number;
  lessonId: number;
  userId: number;
  parentId: number | null;
  content: string | null;
  status: CommentStatus;
  isPinned: boolean;
  isAnswered: boolean;
  createdAt: string;
  updatedAt: string;
  editedAt: string | null;
  author: { id: number; name: string; avatarUrl: string | null; role: string };
  canEdit: boolean;
  canDelete: boolean;
  canModerate: boolean;
  isHiddenPlaceholder: boolean;
  replies: FormattedComment[];
};

export function getLessonCommentContext(lessonId: number) {
  return db
    .select({
      lessonId: lessons.id,
      courseId: courses.id,
      courseStatus: courses.status,
      instructorId: courses.instructorId,
    })
    .from(lessons)
    .innerJoin(modules, eq(lessons.moduleId, modules.id))
    .innerJoin(courses, eq(modules.courseId, courses.id))
    .where(eq(lessons.id, lessonId))
    .get();
}

export function getCommentViewerAccess(lessonId: number, userId: number | null) {
  const context = getLessonCommentContext(lessonId);
  if (!context) return null;

  const user = userId ? db.select().from(users).where(eq(users.id, userId)).get() : null;
  const isModerator = !!user && (user.role === UserRole.Admin || user.id === context.instructorId);
  const enrolled = userId ? isUserEnrolled(userId, context.courseId) : false;
  const canRead = context.courseStatus !== "draft" || isModerator;
  const canPost = isModerator || (enrolled && context.courseStatus !== "archived");

  return { context, user, isModerator, enrolled, canRead, canPost };
}

function formatComment(comment: typeof comments.$inferSelect, author: typeof users.$inferSelect, access: ReturnType<typeof getCommentViewerAccess>): FormattedComment {
  const canSeeHiddenContent = !!access?.isModerator;
  const isPlaceholder = comment.status === CommentStatus.Deleted || (comment.status === CommentStatus.Hidden && !canSeeHiddenContent);
  return {
    id: comment.id,
    lessonId: comment.lessonId,
    userId: comment.userId,
    parentId: comment.parentId,
    content: isPlaceholder ? null : comment.content,
    status: comment.status,
    isPinned: comment.isPinned,
    isAnswered: comment.isAnswered,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    editedAt: comment.editedAt,
    author: { id: author.id, name: author.name, avatarUrl: author.avatarUrl, role: author.role },
    canEdit: access?.user?.id === comment.userId && comment.status === CommentStatus.Visible,
    canDelete: access?.user?.id === comment.userId || !!access?.isModerator,
    canModerate: !!access?.isModerator,
    isHiddenPlaceholder: isPlaceholder,
    replies: [] as ReturnType<typeof formatComment>[],
  };
}

export function getCommentPage(lessonId: number, userId: number | null, offset = 0) {
  const access = getCommentViewerAccess(lessonId, userId);
  if (!access || !access.canRead) return null;

  const topLevel = db
    .select({ comment: comments, author: users })
    .from(comments)
    .innerJoin(users, eq(comments.userId, users.id))
    .where(and(eq(comments.lessonId, lessonId), isNull(comments.parentId)))
    .orderBy(desc(comments.isPinned), desc(comments.createdAt))
    .limit(COMMENT_PAGE_SIZE)
    .offset(offset)
    .all();

  const count = db
    .select({ count: sql<number>`count(*)` })
    .from(comments)
    .where(and(eq(comments.lessonId, lessonId), isNull(comments.parentId)))
    .get()?.count ?? 0;

  const parentIds = topLevel.map(({ comment }) => comment.id);
  const replies = parentIds.length
    ? db
        .select({ comment: comments, author: users })
        .from(comments)
        .innerJoin(users, eq(comments.userId, users.id))
        .where(and(eq(comments.lessonId, lessonId), inArray(comments.parentId, parentIds)))
        .orderBy(asc(comments.createdAt))
        .all()
    : [];

  const formatted = topLevel.map(({ comment, author }) => formatComment(comment, author, access));
  for (const reply of replies) {
    const parent = formatted.find((comment) => comment.id === reply.comment.parentId);
    if (parent) parent.replies.push(formatComment(reply.comment, reply.author, access));
  }

  return {
    comments: formatted,
    total: count,
    hasMore: offset + topLevel.length < count,
    canPost: access.canPost,
    canModerate: access.isModerator,
    canReport: !!access.user && !access.isModerator,
    currentUserId: userId,
  };
}

export function createComment(lessonId: number, userId: number, content: string, parentId: number | null) {
  const access = getCommentViewerAccess(lessonId, userId);
  if (!access?.canPost) throw new Error("You do not have permission to comment on this lesson.");

  if (parentId !== null) {
    const parent = db.select().from(comments).where(and(eq(comments.id, parentId), eq(comments.lessonId, lessonId), isNull(comments.parentId))).get();
    if (!parent) throw new Error("Replies must belong to a top-level comment.");
  }

  return db.insert(comments).values({
    lessonId,
    userId,
    parentId,
    content,
    status: CommentStatus.Visible,
  }).returning().get();
}

export function editComment(commentId: number, userId: number, content: string) {
  const comment = db.select().from(comments).where(eq(comments.id, commentId)).get();
  if (!comment || comment.userId !== userId || comment.status !== CommentStatus.Visible) throw new Error("You cannot edit this comment.");
  return db.update(comments).set({ content, editedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }).where(eq(comments.id, commentId)).returning().get();
}

export function deleteComment(commentId: number, userId: number) {
  const comment = db.select().from(comments).where(eq(comments.id, commentId)).get();
  const access = comment ? getCommentViewerAccess(comment.lessonId, userId) : null;
  if (!comment || (comment.userId !== userId && !access?.isModerator)) throw new Error("You cannot delete this comment.");
  return db.update(comments).set({ status: CommentStatus.Deleted, isPinned: false, isAnswered: false, deletedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }).where(eq(comments.id, commentId)).returning().get();
}

export function setCommentVisibility(commentId: number, userId: number, status: CommentStatus.Visible | CommentStatus.Hidden) {
  const comment = db.select().from(comments).where(eq(comments.id, commentId)).get();
  const access = comment ? getCommentViewerAccess(comment.lessonId, userId) : null;
  if (!comment || !access?.isModerator || comment.status === CommentStatus.Deleted) throw new Error("You cannot moderate this comment.");
  return db.update(comments).set({ status, updatedAt: new Date().toISOString() }).where(eq(comments.id, commentId)).returning().get();
}

export function setCommentPinned(commentId: number, userId: number, pinned: boolean) {
  const comment = db.select().from(comments).where(eq(comments.id, commentId)).get();
  const access = comment ? getCommentViewerAccess(comment.lessonId, userId) : null;
  if (!comment || !access?.isModerator || comment.parentId !== null || comment.status !== CommentStatus.Visible) throw new Error("Only visible top-level comments can be pinned.");
  if (pinned) {
    const pinnedCount = db.select({ count: sql<number>`count(*)` }).from(comments).where(and(eq(comments.lessonId, comment.lessonId), isNull(comments.parentId), eq(comments.isPinned, true), eq(comments.status, CommentStatus.Visible))).get()?.count ?? 0;
    if (pinnedCount >= 3) throw new Error("A lesson can have at most 3 pinned comments.");
  }
  return db.update(comments).set({ isPinned: pinned, updatedAt: new Date().toISOString() }).where(eq(comments.id, commentId)).returning().get();
}

export function setCommentAnswered(commentId: number, userId: number, answered: boolean) {
  const comment = db.select().from(comments).where(eq(comments.id, commentId)).get();
  const access = comment ? getCommentViewerAccess(comment.lessonId, userId) : null;
  if (!comment || !access?.isModerator || comment.parentId !== null || comment.status !== CommentStatus.Visible) throw new Error("Only visible top-level comments can be marked answered.");
  return db.update(comments).set({ isAnswered: answered, updatedAt: new Date().toISOString() }).where(eq(comments.id, commentId)).returning().get();
}

export function reportComment(commentId: number, reporterId: number, reason: string, explanation: string | null) {
  const comment = db.select().from(comments).where(eq(comments.id, commentId)).get();
  const access = comment ? getCommentViewerAccess(comment.lessonId, reporterId) : null;
  if (!comment || !access?.user || access.isModerator || comment.userId === reporterId) throw new Error("You cannot report this comment.");
  const existing = db.select().from(commentReports).where(and(eq(commentReports.commentId, commentId), eq(commentReports.reporterId, reporterId))).get();
  if (existing) throw new Error("You have already reported this comment.");
  return db.insert(commentReports).values({ commentId, reporterId, reason, explanation, status: CommentReportStatus.Open }).returning().get();
}

export function getCommentReports(userId: number) {
  const user = db.select().from(users).where(eq(users.id, userId)).get();
  if (!user || (user.role !== UserRole.Admin && user.role !== UserRole.Instructor)) return [];

  const rows = db
    .select({ report: commentReports, comment: comments, lesson: lessons, course: courses, reporter: users })
    .from(commentReports)
    .innerJoin(comments, eq(commentReports.commentId, comments.id))
    .innerJoin(lessons, eq(comments.lessonId, lessons.id))
    .innerJoin(modules, eq(lessons.moduleId, modules.id))
    .innerJoin(courses, eq(modules.courseId, courses.id))
    .innerJoin(users, eq(commentReports.reporterId, users.id))
    .where(user.role === UserRole.Admin ? undefined : eq(courses.instructorId, userId))
    .orderBy(desc(commentReports.createdAt))
    .all();

  return rows.map((row) => {
    const author = db.select().from(users).where(eq(users.id, row.comment.userId)).get();
    return {
      ...row.report,
      comment: {
        id: row.comment.id,
        content: row.comment.content,
        status: row.comment.status,
        authorName: author?.name ?? "Unknown user",
      },
      lessonTitle: row.lesson.title,
      courseTitle: row.course.title,
      reporterName: row.reporter.name,
    };
  });
}

export function resolveCommentReport(reportId: number, userId: number, status: CommentReportStatus, resolutionNote: string) {
  const report = db.select().from(commentReports).where(eq(commentReports.id, reportId)).get();
  if (!report) throw new Error("Report not found.");
  const comment = db.select().from(comments).where(eq(comments.id, report.commentId)).get();
  const access = comment ? getCommentViewerAccess(comment.lessonId, userId) : null;
  if (!access?.isModerator) throw new Error("You cannot moderate this report.");
  return db.update(commentReports).set({ status, resolutionNote, reviewedAt: new Date().toISOString() }).where(eq(commentReports.id, reportId)).returning().get();
}
