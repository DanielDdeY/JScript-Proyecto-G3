interface InfoCardProps {
  title: string;
  message?: string;
  detail?: string;
}

export function InfoCard({ title, message = '¡Funciona correctamente!', detail }: InfoCardProps) {
  return (
    <article className="card p-4 border-0 shadow-sm bg-white animate__animated animate__fadeIn">
      <h4 className="text-dark fw-bold mb-2">{title}</h4>
      <p className="text-success fw-semibold">{message}</p>
      {detail ? <span className="text-muted small">{detail}</span> : null}
    </article>
  );
}
