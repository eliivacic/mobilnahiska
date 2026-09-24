interface BarChartPoint {
  label: string;
  value: number;
}

// Lightweight CSS-only bar chart for admin analytics — no charting library is
// installed in this project, and this dataset (≤30 daily buckets) doesn't
// warrant adding one.
export function AdminBarChart({ points, unit }: { points: BarChartPoint[]; unit: string }) {
  const max = Math.max(1, ...points.map((point) => point.value));

  return (
    <div className="flex h-40 items-end gap-1" role="img" aria-label={`Graf: ${unit} po dnevih`}>
      {points.map((point) => (
        <div key={point.label} className="group relative flex flex-1 flex-col items-center justify-end">
          <div
            title={`${point.label}: ${point.value} ${unit}`}
            className="w-full rounded-t-[3px] bg-primary/70 transition-colors group-hover:bg-primary"
            style={{ height: `${(point.value / max) * 100}%`, minHeight: point.value > 0 ? "3px" : "1px" }}
          />
        </div>
      ))}
    </div>
  );
}
