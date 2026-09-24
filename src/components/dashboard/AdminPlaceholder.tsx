export function AdminPlaceholder({ title, description, needs }: { title: string; description: string; needs: string }) {
  return (
    <div>
      <h1 className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground">{title}</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>

      <div className="mt-6 rounded-[14px] border border-dashed border-border p-8 text-center">
        <p className="text-sm font-semibold text-foreground">Ta razdelek še ni povezan s podatki.</p>
        <p className="mt-1 text-sm text-muted-foreground">{needs}</p>
      </div>
    </div>
  );
}
