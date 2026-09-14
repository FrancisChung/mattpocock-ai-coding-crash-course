import { z } from "zod";
import { data } from "react-router";
import type { Route } from "./+types/api.comments";
import { getCurrentUserId } from "~/lib/session";
import { renderMarkdown } from "~/lib/markdown.server";
import { CommentReportStatus, CommentStatus } from "~/db/schema";
import {
  COMMENT_LIMIT,
  createComment,
  deleteComment,
  editComment,
  getCommentPage,
  reportComment,
  resolveCommentReport,
  setCommentAnswered,
  setCommentPinned,
  setCommentVisibility,
} from "~/services/commentService";

async function addRenderedContent<T extends { content: string | null; replies: T[] }>(comment: T): Promise<T & { contentHtml: string | null }> {
  return {
    ...comment,
    contentHtml: comment.content ? await renderMarkdown(comment.content) : null,
    replies: await Promise.all(comment.replies.map(addRenderedContent)),
  };
}

const createSchema = z.object({
  lessonId: z.coerce.number().int().positive(),
  content: z.string().trim().min(1).max(COMMENT_LIMIT),
  parentId: z.coerce.number().int().positive().nullable().catch(null),
});

const editSchema = z.object({
  commentId: z.coerce.number().int().positive(),
  content: z.string().trim().min(1).max(COMMENT_LIMIT),
});

const reportSchema = z.object({
  commentId: z.coerce.number().int().positive(),
  reason: z.enum(["spam", "abuse", "harassment", "inappropriate", "other"]),
  explanation: z.string().trim().max(500).nullable().catch(null),
});

const commentIdSchema = z.object({ commentId: z.coerce.number().int().positive() });
const reportResolutionSchema = z.object({ reportId: z.coerce.number().int().positive(), resolutionNote: z.string().trim().max(1000).catch("") });

const recentPosts = new Map<number, number[]>();

function enforceRateLimit(userId: number) {
  const now = Date.now();
  const timestamps = (recentPosts.get(userId) ?? []).filter((timestamp) => now - timestamp < 60 * 60 * 1000);
  const minuteCount = timestamps.filter((timestamp) => now - timestamp < 60 * 1000).length;
  if (minuteCount >= 5 || timestamps.length >= 30) throw data("You are posting too frequently. Please try again later.", { status: 429 });
  timestamps.push(now);
  recentPosts.set(userId, timestamps);
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const lessonId = Number(url.searchParams.get("lessonId"));
  const offset = Math.max(0, Number(url.searchParams.get("offset") ?? 0));
  if (!Number.isInteger(lessonId) || lessonId < 1 || !Number.isInteger(offset)) throw data("Invalid comment query.", { status: 400 });

  const page = getCommentPage(lessonId, await getCurrentUserId(request), offset);
  if (!page) throw data("Comments are not available for this lesson.", { status: 403 });
  return {
    ...page,
    comments: await Promise.all(page.comments.map(addRenderedContent)),
  };
}

export async function action({ request }: Route.ActionArgs) {
  const userId = await getCurrentUserId(request);
  if (!userId) throw data("You must be logged in to use comments.", { status: 401 });

  const formData = Object.fromEntries(await request.formData());
  const intent = String(formData.intent ?? "");

  try {
    if (intent === "create") {
      const parsed = createSchema.safeParse(formData);
      if (!parsed.success) throw data("Comments must contain 1–2,000 characters.", { status: 400 });
      enforceRateLimit(userId);
      createComment(parsed.data.lessonId, userId, parsed.data.content, parsed.data.parentId);
      return { success: true };
    }

    if (intent === "edit") {
      const parsed = editSchema.safeParse(formData);
      if (!parsed.success) throw data("Comments must contain 1–2,000 characters.", { status: 400 });
      editComment(parsed.data.commentId, userId, parsed.data.content);
      return { success: true };
    }

    if (intent === "delete") {
      const parsed = commentIdSchema.safeParse(formData);
      if (!parsed.success) throw data("Invalid comment.", { status: 400 });
      deleteComment(parsed.data.commentId, userId);
      return { success: true };
    }

    if (intent === "report") {
      const parsed = reportSchema.safeParse(formData);
      if (!parsed.success) throw data("Choose a report reason.", { status: 400 });
      reportComment(parsed.data.commentId, userId, parsed.data.reason, parsed.data.explanation || null);
      return { success: true };
    }

    if (intent === "resolve-report" || intent === "dismiss-report") {
      const parsed = reportResolutionSchema.safeParse(formData);
      if (!parsed.success) throw data("Invalid report.", { status: 400 });
      resolveCommentReport(parsed.data.reportId, userId, intent === "resolve-report" ? CommentReportStatus.Resolved : CommentReportStatus.Dismissed, parsed.data.resolutionNote);
      return { success: true };
    }

    if (["hide", "show", "pin", "unpin", "answer", "unanswer"].includes(intent)) {
      const parsed = commentIdSchema.safeParse(formData);
      if (!parsed.success) throw data("Invalid comment.", { status: 400 });
      if (intent === "hide") setCommentVisibility(parsed.data.commentId, userId, CommentStatus.Hidden);
      if (intent === "show") setCommentVisibility(parsed.data.commentId, userId, CommentStatus.Visible);
      if (intent === "pin") setCommentPinned(parsed.data.commentId, userId, true);
      if (intent === "unpin") setCommentPinned(parsed.data.commentId, userId, false);
      if (intent === "answer") setCommentAnswered(parsed.data.commentId, userId, true);
      if (intent === "unanswer") setCommentAnswered(parsed.data.commentId, userId, false);
      return { success: true };
    }
  } catch (error) {
    if (error && typeof error === "object" && "status" in error) throw error;
    throw data(error instanceof Error ? error.message : "Unable to update the comment.", { status: 400 });
  }

  throw data("Invalid comment action.", { status: 400 });
}
