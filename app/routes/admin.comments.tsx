import { useEffect } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import type { Route } from "./+types/admin.comments";
import { data, isRouteErrorResponse } from "react-router";
import { getCurrentUserId } from "~/lib/session";
import { getUserById } from "~/services/userService";
import { getCommentReports, resolveCommentReport } from "~/services/commentService";
import { CommentReportStatus, UserRole } from "~/db/schema";
import { parseFormData } from "~/lib/validation";
import { z } from "zod";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Skeleton } from "~/components/ui/skeleton";
import { ShieldAlert } from "lucide-react";

const actionSchema = z.object({
  reportId: z.coerce.number().int().positive(),
  resolutionNote: z.string().trim().max(1000).optional(),
  status: z.enum([CommentReportStatus.Resolved, CommentReportStatus.Dismissed]),
});

export function meta() {
  return [{ title: "Comment Reports — Cadence" }, { name: "description", content: "Review reported course comments" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await getCurrentUserId(request);
  if (!userId) throw data("You must be logged in.", { status: 401 });
  const user = getUserById(userId);
  if (!user || (user.role !== UserRole.Admin && user.role !== UserRole.Instructor)) throw data("Only instructors and admins can review comments.", { status: 403 });
  return { reports: getCommentReports(userId) };
}

export async function action({ request }: Route.ActionArgs) {
  const userId = await getCurrentUserId(request);
  if (!userId) throw data("You must be logged in.", { status: 401 });
  const parsed = parseFormData(await request.formData(), actionSchema);
  if (!parsed.success) return data({ error: "Invalid report action." }, { status: 400 });
  try {
    resolveCommentReport(parsed.data.reportId, userId, parsed.data.status, parsed.data.resolutionNote ?? "");
    return { success: true };
  } catch (error) {
    return data({ error: error instanceof Error ? error.message : "Unable to update report." }, { status: 400 });
  }
}

export function HydrateFallback() {
  return <div className="mx-auto max-w-4xl p-6 lg:p-8"><Skeleton className="mb-8 h-9 w-64" /><Skeleton className="h-48 w-full" /></div>;
}

export default function CommentReports({ loaderData }: Route.ComponentProps) {
  const { reports } = loaderData;
  const fetcher = useFetcher<{ success?: boolean; error?: string }>();

  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;
    if (fetcher.data.success) toast.success("Report updated.");
    if (fetcher.data.error) toast.error(fetcher.data.error);
  }, [fetcher.state, fetcher.data]);

  return (
    <div className="mx-auto max-w-4xl p-6 lg:p-8">
      <div className="mb-8"><h1 className="text-3xl font-bold">Comment Reports</h1><p className="mt-1 text-muted-foreground">Review reported comments from your courses.</p></div>
      {reports.length === 0 ? <Card><CardContent className="py-12 text-center text-muted-foreground">No comment reports.</CardContent></Card> : <div className="space-y-4">{reports.map((report) => <ReportCard key={report.id} report={report} fetcher={fetcher} />)}</div>}
    </div>
  );
}

function ReportCard({ report, fetcher }: { report: Route.ComponentProps["loaderData"]["reports"][number]; fetcher: ReturnType<typeof useFetcher<{ success?: boolean; error?: string }>> }) {
  const isOpen = report.status === CommentReportStatus.Open || report.status === CommentReportStatus.Reviewed;
  return (
    <Card className={isOpen ? "border-amber-400/60" : "opacity-75"}>
      <CardHeader className="pb-3"><div className="flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2"><ShieldAlert className="size-4 text-amber-500" /><span className="font-semibold">{report.reason}</span><span className="rounded-full bg-muted px-2 py-0.5 text-xs">{report.status}</span></div><span className="text-xs text-muted-foreground">{report.courseTitle} · {report.lessonTitle}</span></div></CardHeader>
      <CardContent><p className="mb-2 text-sm text-muted-foreground">Reported by {report.reporterName} · Comment by {report.comment.authorName}</p><div className="rounded-md bg-muted/50 p-3 text-sm whitespace-pre-wrap">{report.comment.status === "deleted" ? "Comment deleted" : report.comment.content}</div>{report.explanation && <p className="mt-3 text-sm"><strong>Report details:</strong> {report.explanation}</p>}{isOpen && <fetcher.Form method="post" className="mt-4 space-y-2"><input type="hidden" name="reportId" value={report.id} /><Textarea name="resolutionNote" placeholder="Internal resolution note (optional)" rows={2} /><div className="flex gap-2"><Button size="sm" name="status" value={CommentReportStatus.Resolved}>Resolve</Button><Button size="sm" variant="outline" name="status" value={CommentReportStatus.Dismissed}>Dismiss</Button></div></fetcher.Form>}{report.resolutionNote && <p className="mt-3 text-xs text-muted-foreground">Resolution note: {report.resolutionNote}</p>}</CardContent>
    </Card>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const message = isRouteErrorResponse(error) ? (typeof error.data === "string" ? error.data : error.statusText) : "Unable to load comment reports.";
  return <main className="mx-auto max-w-xl p-8 text-center"><h1 className="text-2xl font-bold">Comment reports</h1><p className="mt-2 text-muted-foreground">{message}</p></main>;
}
