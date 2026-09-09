import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useFetcher } from "react-router";
import { toast } from "sonner";

export function CourseRating({ courseId, interactive = true, className = "" }: { courseId: number; interactive?: boolean; className?: string }) {
  const fetcher = useFetcher<{ average: number; count: number; userRating: number | null; canRate?: boolean; error?: string }>();
  const [rating, setRating] = useState(0);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [canRate, setCanRate] = useState(false);

  useEffect(() => { fetcher.load(`/api/course-rating?courseId=${courseId}`); }, [courseId]);
  useEffect(() => {
    if (!fetcher.data) return;
    if (fetcher.data.error) { toast.error(fetcher.data.error); return; }
    setAverage(fetcher.data.average); setCount(fetcher.data.count);
    setCanRate(fetcher.data.canRate ?? false);
    if (fetcher.data.userRating !== null) setRating(fetcher.data.userRating);
  }, [fetcher.data]);

  function selectRating(value: number) {
    const wasUnrated = rating === 0;
    setRating(value);
    if (wasUnrated) setCount((current) => current + 1);
    fetcher.submit({ courseId: String(courseId), rating: String(value) }, { action: "/api/course-rating", method: "post" });
  }

  const displayRating = rating || average;
  const isInteractive = interactive && canRate;
  return (
    <div className={`flex items-center gap-2 ${className}`} aria-label={`${average} out of 5 stars from ${count} ratings`}>
      <div className="flex items-center" role={isInteractive ? "radiogroup" : undefined}>
        {[1, 2, 3, 4, 5].map((star) => {
          const fillPercent = Math.max(0, Math.min(1, displayRating - star + 1)) * 100;
          return isInteractive ? (
            <span key={star} className="relative inline-flex size-5 transition-transform hover:scale-110">
              <Star className="absolute inset-0 size-5 text-muted-foreground/40" />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fillPercent}%` }}>
                <Star className="size-5 fill-amber-400 text-amber-400" />
              </span>
              <button
                type="button"
                disabled={fetcher.state !== "idle"}
                onClick={(event) => { event.preventDefault(); event.stopPropagation(); selectRating(star - 0.5); }}
                className="absolute inset-y-0 left-0 w-1/2 cursor-pointer disabled:cursor-wait"
                aria-label={`Rate ${star - 0.5} out of 5 stars`}
              />
              <button
                type="button"
                disabled={fetcher.state !== "idle"}
                onClick={(event) => { event.preventDefault(); event.stopPropagation(); selectRating(star); }}
                className="absolute inset-y-0 right-0 w-1/2 cursor-pointer disabled:cursor-wait"
                aria-label={`Rate ${star} out of 5 stars`}
              />
            </span>
          ) : (
            <span key={star} className="relative inline-flex size-5">
              <Star className="absolute inset-0 size-5 text-muted-foreground/40" />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fillPercent}%` }}>
                <Star className="size-5 fill-amber-400 text-amber-400" />
              </span>
            </span>
          );
        })}
      </div>
      <span className="text-xs text-muted-foreground">{count ? `${average.toFixed(1)} (${count})` : "No ratings"}</span>
    </div>
  );
}
