import { useEffect, useMemo, useState } from 'react';
import { useWallet } from '../../../wallet/presentation/hooks/useWallet';
import { conversionMonedaService } from '../../domain/services/conversionMonedaService';
import { formatCurrencyPen } from '../../../../shared/utils/formatters';
import { idsIguales } from '../../../../shared/utils/ids';

const formatCurrency = (amount: number, currency: 'USD' | 'EUR' | 'JPY') =>
  new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'JPY' ? 0 : 2,
    maximumFractionDigits: currency === 'JPY' ? 0 : 2,
  }).format(amount);

export function ConversionSaldoPage() {
  const { tarjetas, cargando, error } = useWallet();
  const [tarjetaId, setTarjetaId] = useState('');

  useEffect(() => {
    if (!tarjetaId && tarjetas.length > 0) {
      setTarjetaId(String(tarjetas[0].id));
    }
  }, [tarjetaId, tarjetas]);

  const tarjetaSeleccionada = useMemo(
    () => tarjetas.find((tarjeta) => idsIguales(tarjeta.id, tarjetaId)) ?? tarjetas[0],
    [tarjetaId, tarjetas],
  );

  const conversiones = useMemo(
    () => conversionMonedaService.convertirDesdeSoles(tarjetaSeleccionada?.saldo ?? 0),
    [tarjetaSeleccionada],
  );

  if (cargando) {
    return (
      <section className="card border-0 shadow-sm p-4">
        <p className="mb-0 text-muted">Cargando tarjetas...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="card border-0 shadow-sm p-4">
        <div className="alert alert-danger mb-0">{error}</div>
      </section>
    );
  }

  if (tarjetas.length === 0) {
    return (
      <section className="card border-0 shadow-sm p-4 text-center">
        <i className="bi bi-credit-card fs-1 text-primary" />
        <h5 className="fw-bold mt-3">No tienes tarjetas registradas</h5>
        <p className="text-muted mb-0">Agrega una tarjeta para simular la conversión de su saldo en otras monedas.</p>
      </section>
    );
  }

  return (
    <div className="d-flex flex-column gap-4">
      <section className="card border-0 shadow-sm p-4 bg-white">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
          <div>
            <p className="text-primary fw-semibold mb-1">Convertir plata</p>
            <h3 className="fw-bold text-dark mb-2">Conversión aproximada de saldo</h3>
            <p className="text-muted mb-0">Selecciona una tarjeta y revisa cuánto sería su saldo en dólares, euros y yenes.</p>
          </div>
          <i className="bi bi-currency-exchange text-primary fs-1" />
        </div>

        <div className="alert alert-warning d-flex align-items-start gap-2" role="alert">
          <i className="bi bi-exclamation-triangle-fill mt-1" />
          <div>
            <strong>Importante:</strong> esta es una aproximación, no una conversión real. Las tasas son valores estáticos para uso de la app.
          </div>
        </div>

        <div className="row g-4 align-items-stretch">
          <div className="col-12 col-lg-5">
            <div className="border rounded-3 p-4 bg-light h-100">
              <label className="form-label fw-semibold">Dinero disponible en tarjeta</label>
              <select className="form-select mb-4" value={tarjetaId} onChange={(event) => setTarjetaId(event.target.value)}>
                {tarjetas.map((tarjeta) => (
                  <option key={tarjeta.id} value={String(tarjeta.id)}>
                    {conversionMonedaService.obtenerEtiquetaTarjeta(tarjeta)}
                  </option>
                ))}
              </select>

              <div className="bg-white rounded-3 p-4 shadow-sm">
                <span className="text-muted small d-block">Saldo en soles</span>
                <strong className="display-6 text-primary">{formatCurrencyPen(tarjetaSeleccionada?.saldo ?? 0)}</strong>
                <p className="text-muted small mb-0 mt-2">Este monto es el que se convierte de manera aproximada.</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-7">
            <div className="row g-3">
              {conversiones.map((conversion) => (
                <div className="col-12 col-md-4" key={conversion.moneda}>
                  <article className="card border-0 shadow-sm h-100 conversion-card">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <span className="badge bg-primary-subtle text-primary fw-bold">{conversion.moneda}</span>
                        <span className="fs-4">{conversion.simbolo}</span>
                      </div>
                      <h5 className="fw-bold mb-1">{formatCurrency(conversion.montoConvertido, conversion.moneda)}</h5>
                      <p className="text-muted small mb-3">{conversion.nombre}</p>
                      <p className="small text-muted mb-0">Tasa fija: S/. {conversion.tasaSolesPorUnidad.toFixed(3)} por 1 {conversion.moneda}</p>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}