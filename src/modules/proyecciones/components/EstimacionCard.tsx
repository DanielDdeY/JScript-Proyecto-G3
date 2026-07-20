interface EstimacionCardProps {
  readonly titulo?: string;
  readonly valor?: string;
}

export function EstimacionCard({ titulo = 'Estimación', valor = 'Pendiente' }: EstimacionCardProps) {
  return (
    <article className="card p-3 border-0 shadow-sm">
      <span className="text-muted small">{titulo}</span>
      <strong>{valor}</strong>
    </article>
  );
}
