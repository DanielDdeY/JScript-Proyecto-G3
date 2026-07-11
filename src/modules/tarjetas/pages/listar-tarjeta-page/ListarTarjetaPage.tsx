import { useLocation } from 'react-router-dom';
import { TarjetaCarousel } from '../../components/TarjetaCarousel';

interface LocationState {
  message?: string;
}

export function ListarTarjetaPage() {
  const location = useLocation();
  const message = (location.state as LocationState | null)?.message;

  return (
    <div className="card border-0 shadow-sm p-4 bg-white">
      {message ? (
        <div className="alert alert-success border-0 shadow-sm" role="alert">
          <i className="bi bi-check-circle-fill me-2" /> {message}
        </div>
      ) : null}

      <TarjetaCarousel />
    </div>
  );
}
