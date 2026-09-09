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
          const starClass = star <= displayRating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40";
          return isInteractive ? (
            <button key={star} type="button" disabled={fetcher.state !== "idle"} onClick={(event) => { event.preventDefault(); event.stopPropagation(); selectRating(star); }} className="rounded-sm p-0.5 transition-transform hover:scale-110 disabled:opacity-60" aria-label={`Rate ${star} out of 5 stars`}>
              <Star className={`size-4 ${starClass}`} />
            </button>
          ) : <Star key={star} className={`size-4 ${starClass}`} />;
        })}
      </div>
      <span className="text-xs text-muted-foreground">{count ? `${average.toFixed(1)} (${count})` : "No ratings"}</span>
    </div>
  );
}
