interface TriangleSummaryProps {
  trianglesTotalArea: number;
}

const areaFormatter = new Intl.NumberFormat("pt-BR", {
  maximumSignificantDigits: 12,
});

const TriangleSummary = ({ trianglesTotalArea }: TriangleSummaryProps) => {
  return (
    <section
      aria-labelledby="triangles-total-area-label"
      className="mb-6 rounded-xl border border-border bg-card/60 p-4"
    >
      <h3
        id="triangles-total-area-label"
        className="text-xs font-medium tracking-wide text-muted-foreground"
      >
        Área total dos triângulos
      </h3>

      <output
        aria-labelledby="triangles-total-area-label"
        aria-live="polite"
        aria-atomic="true"
        className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1"
      >
        <span className="min-w-0 break-all font-mono text-3xl font-semibold tracking-tight text-foreground tabular-nums">
          {areaFormatter.format(trianglesTotalArea)}
        </span>
        <span
          aria-label="unidades quadradas"
          className="text-sm text-muted-foreground"
        >
          u²
        </span>
      </output>

      <p className="mt-3 border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
        Soma das áreas de cada triângulo completo.
      </p>
    </section>
  );
};

export default TriangleSummary;
