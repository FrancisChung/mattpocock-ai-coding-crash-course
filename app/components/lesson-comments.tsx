import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { Check, ChevronDown, Flag, MessageSquare, Pin, Pencil, Send, ShieldAlert, Trash2, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { UserAvatar } from "~/components/user-avatar";

type Comment = {
  id: number;
  lessonId: number;
  userId: number;
  parentId: number | null;
  content: string | null;
  contentHtml: string | null;
  status: string;
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
  replies: Comment[];
};

type CommentsPage = {
  comments: Comment[];
  total: number;
  hasMore: boolean;
  canPost: boolean;
  canModerate: boolean;
  canReport: boolean;
  currentUserId: number | null;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function roleLabel(role: string) {
  if (role === "instructor") return "Instructor";
  if (role === "admin") return "Admin";
  return null;
}

export function LessonComments({ lessonId }: { lessonId: number }) {
  const loader = useFetcher<CommentsPage>();
  const action = useFetcher<{ success?: boolean; error?: string }>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [canPost, setCanPost] = useState(false);
  const [canModerate, setCanModerate] = useState(false);
  const [canReport, setCanReport] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loadingOffset, setLoadingOffset] = useState(0);

  function loadComments(offset = 0) {
    setLoadingOffset(offset);
    loader.load(`/api/comments?lessonId=${lessonId}&offset=${offset}`);
  }

  useEffect(() => {
    setComments([]);
    loadComments(0);
  }, [lessonId]);

  useEffect(() => {
    if (!loader.data) return;
    setComments((current) => loadingOffset === 0 ? loader.data!.comments : [...current, ...loader.data!.comments]);
    setHasMore(loader.data.hasMore);
    setCanPost(loader.data.canPost);
    setCanModerate(loader.data.canModerate);
    setCanReport(loader.data.canReport);
    setCurrentUserId(loader.data.currentUserId);
  }, [loader.data, loadingOffset]);

  useEffect(() => {
    if (action.state !== "idle" || !action.data) return;
    if (action.data.error) toast.error(action.data.error);
    if (action.data.success) {
      setNewComment("");
      setReplyingTo(null);
      setEditingId(null);
      loadComments(0);
    }
  }, [action.state, action.data]);

  function submitCreate(content: string, parentId: number | null) {
    action.submit({ intent: "create", lessonId: String(lessonId), content, parentId: parentId ? String(parentId) : "" }, { action: "/api/comments", method: "post" });
  }

  return (
    <section className="mt-10 border-t border-border pt-8" aria-labelledby="lesson-discussion-heading">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 id="lesson-discussion-heading" className="flex items-center gap-2 text-2xl font-bold">
            <MessageSquare className="size-5" /> Discussion
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Ask questions and share ideas about this lesson.</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => loadComments(0)} disabled={loader.state !== "idle"}>
          <ChevronDown className="mr-1 size-4" /> Load newer
        </Button>
      </div>

      {canPost ? (
        <CommentComposer
          value={newComment}
          onChange={setNewComment}
          onSubmit={() => submitCreate(newComment, null)}
          pending={action.state !== "idle"}
          submitLabel="Post comment"
        />
      ) : currentUserId === null ? (
        <p className="mb-6 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">Sign in and enroll in this course to join the discussion.</p>
      ) : (
        <p className="mb-6 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">You can read this discussion, but only enrolled students can post.</p>
      )}

      {loader.state === "loading" && comments.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Loading discussion...</p>
      ) : comments.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">No comments yet. Start the conversation.</p>
      ) : (
        <div className="space-y-5">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              canReport={canReport}
              canModerate={canModerate}
              currentUserId={currentUserId}
              editingId={editingId}
              replyingTo={replyingTo}
              action={action}
              onEdit={setEditingId}
              onReply={setReplyingTo}
              onRefresh={() => loadComments(0)}
              onCancel={() => { setEditingId(null); setReplyingTo(null); }}
            />
          ))}
        </div>
      )}

      {hasMore && (
        <Button variant="outline" className="mt-6 w-full" onClick={() => loadComments(comments.length)} disabled={loader.state !== "idle"}>
          Load older comments
        </Button>
      )}
    </section>
  );
}

function CommentComposer({ value, onChange, onSubmit, pending, submitLabel }: { value: string; onChange: (value: string) => void; onSubmit: () => void; pending: boolean; submitLabel: string }) {
  return (
    <form className="mb-6" onSubmit={(event) => { event.preventDefault(); if (value.trim()) onSubmit(); }}>
      <Textarea value={value} onChange={(event) => onChange(event.target.value)} maxLength={2000} placeholder="Write a comment... Markdown is supported." rows={4} />
      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">{value.length}/2000</span>
        <Button type="submit" disabled={pending || !value.trim()}><Send className="mr-2 size-4" />{pending ? "Posting..." : submitLabel}</Button>
      </div>
    </form>
  );
}

function CommentItem({ comment, canReport, canModerate, currentUserId, editingId, replyingTo, action, onEdit, onReply, onRefresh, onCancel }: { comment: Comment; canReport: boolean; canModerate: boolean; currentUserId: number | null; editingId: number | null; replyingTo: number | null; action: ReturnType<typeof useFetcher<{ success?: boolean; error?: string }>>; onEdit: (id: number | null) => void; onReply: (id: number | null) => void; onRefresh: () => void; onCancel: () => void }) {
  const [draft, setDraft] = useState(comment.content ?? "");
  const [reply, setReply] = useState("");
  const [reporting, setReporting] = useState(false);

  function submit(intent: string, extra: Record<string, string>) {
    action.submit({ intent, ...extra }, { action: "/api/comments", method: "post" });
  }

  function edit() {
    if (draft.trim()) submit("edit", { commentId: String(comment.id), content: draft });
  }

  function remove() {
    if (window.confirm("Delete this comment? Its replies will remain visible.")) submit("delete", { commentId: String(comment.id) });
  }

  return (
    <article className={`rounded-lg border p-4 ${comment.isPinned ? "border-amber-400/60 bg-amber-50/40 dark:bg-amber-950/10" : "border-border"}`}>
      <div className="flex gap-3">
        <UserAvatar name={comment.author.name} avatarUrl={comment.author.avatarUrl} className="size-9 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold">{comment.author.name}</span>
            {roleLabel(comment.author.role) && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{roleLabel(comment.author.role)}</span>}
            <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
            {comment.editedAt && <span className="text-xs text-muted-foreground">(edited)</span>}
          </div>

          {comment.isPinned && <div className="mt-2 flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400"><Pin className="size-3" /> Pinned</div>}
          {comment.isAnswered && <div className="mt-2 flex items-center gap-1 text-xs font-medium text-green-700 dark:text-green-400"><Check className="size-3" /> Answered</div>}

          {editingId === comment.id ? (
            <div className="mt-3"><Textarea value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={2000} rows={4} /><div className="mt-2 flex gap-2"><Button size="sm" onClick={edit} disabled={action.state !== "idle" || !draft.trim()}>Save edit</Button><Button size="sm" variant="ghost" onClick={onCancel}><X className="mr-1 size-4" />Cancel</Button></div></div>
          ) : comment.isHiddenPlaceholder ? (
            <p className="mt-3 text-sm italic text-muted-foreground">{comment.status === "deleted" ? "Comment deleted" : "Comment hidden by a moderator"}</p>
          ) : (
            <div className="prose prose-sm prose-neutral dark:prose-invert mt-3 max-w-none" dangerouslySetInnerHTML={{ __html: comment.contentHtml ?? "" }} />
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {comment.canEdit && editingId !== comment.id && <Button variant="ghost" size="sm" onClick={() => { setDraft(comment.content ?? ""); onEdit(comment.id); }}><Pencil className="mr-1 size-3.5" />Edit</Button>}
            {comment.canDelete && <Button variant="ghost" size="sm" onClick={remove}><Trash2 className="mr-1 size-3.5" />Delete</Button>}
            {canReport && currentUserId !== comment.userId && !comment.isHiddenPlaceholder && <Button variant="ghost" size="sm" onClick={() => setReporting((value) => !value)}><Flag className="mr-1 size-3.5" />Report</Button>}
            {comment.parentId === null && comment.status === "visible" && <Button variant="ghost" size="sm" onClick={() => onReply(replyingTo === comment.id ? null : comment.id)}><MessageSquare className="mr-1 size-3.5" />Reply</Button>}
            {canModerate && comment.status === "visible" && <><Button variant="ghost" size="sm" onClick={() => submit(comment.isPinned ? "unpin" : "pin", { commentId: String(comment.id) })}><Pin className="mr-1 size-3.5" />{comment.isPinned ? "Unpin" : "Pin"}</Button><Button variant="ghost" size="sm" onClick={() => submit(comment.isAnswered ? "unanswer" : "answer", { commentId: String(comment.id) })}><Check className="mr-1 size-3.5" />{comment.isAnswered ? "Unmark answered" : "Mark answered"}</Button><Button variant="ghost" size="sm" onClick={() => submit("hide", { commentId: String(comment.id) })}><ShieldAlert className="mr-1 size-3.5" />Hide</Button></>}
            {canModerate && comment.status === "hidden" && <Button variant="ghost" size="sm" onClick={() => submit("show", { commentId: String(comment.id) })}><ShieldAlert className="mr-1 size-3.5" />Show</Button>}
          </div>

          {reporting && <ReportForm onSubmit={(reason, explanation) => { submit("report", { commentId: String(comment.id), reason, explanation }); setReporting(false); }} onCancel={() => setReporting(false)} />}
          {replyingTo === comment.id && <div className="mt-4 border-l-2 border-border pl-4"><CommentComposer value={reply} onChange={setReply} onSubmit={() => { if (reply.trim()) { submit("create", { lessonId: String(comment.lessonId), content: reply, parentId: String(comment.id) }); setReply(""); onReply(null); } }} pending={action.state !== "idle"} submitLabel="Post reply" /></div>}

          {comment.replies.length > 0 && <div className="mt-5 space-y-4 border-l-2 border-border pl-4">{comment.replies.map((child) => <CommentItem key={child.id} comment={child} canReport={canReport} canModerate={canModerate} currentUserId={currentUserId} editingId={editingId} replyingTo={replyingTo} action={action} onEdit={onEdit} onReply={onReply} onRefresh={onRefresh} onCancel={onCancel} />)}</div>}
        </div>
      </div>
    </article>
  );
}

function ReportForm({ onSubmit, onCancel }: { onSubmit: (reason: string, explanation: string) => void; onCancel: () => void }) {
  const [reason, setReason] = useState("spam");
  const [explanation, setExplanation] = useState("");
  return <div className="mt-3 rounded-md bg-muted/50 p-3"><div className="flex items-center gap-2 text-sm font-medium"><Flag className="size-4" />Report comment</div><select value={reason} onChange={(event) => setReason(event.target.value)} className="mt-2 h-9 w-full rounded-md border border-input bg-background px-2 text-sm"><option value="spam">Spam</option><option value="abuse">Abuse</option><option value="harassment">Harassment</option><option value="inappropriate">Inappropriate content</option><option value="other">Other</option></select><Textarea className="mt-2" value={explanation} onChange={(event) => setExplanation(event.target.value)} maxLength={500} placeholder="Optional explanation" rows={2} /><div className="mt-2 flex gap-2"><Button size="sm" onClick={() => onSubmit(reason, explanation)}>Submit report</Button><Button size="sm" variant="ghost" onClick={onCancel}>Cancel</Button></div></div>;
}
