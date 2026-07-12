import { useState } from 'react';
import { InfoCard } from '../../../../shared/components/InfoCard/InfoCard';
import { useTarjetas } from '../../../tarjetas/presentation/hooks/useTarjetas';
import { TarjetasProvider } from '../../../tarjetas/presentation/context/TarjetasProvider';

function SeparacionSaldoView() {
  const { tarjetas, cargando, error } = useTarjetas();
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState<string>('');
  const [montoRetener, setMontoRetener] = useState<number | ''>('');

  const tarjetaActual = tarjetas.find((t) => t.id === tarjetaSeleccionada);
  const saldoDisponible = tarjetaActual ? tarjetaActual.saldo : 0;
  const esMontoInvalido = typeof montoRetener === 'number' && montoRetener > saldoDisponible;

  const handleSepararSaldo = () => {
    console.warn('TODO: Enlazar con endpoint PATCH /tarjetas/:id para actualizar saldoRetenido');
    
    alert(`¡Éxito! Has separado S/ ${montoRetener} de tu tarjeta. \n\n(¡Completado!).`);
    setTarjetaSeleccionada('');
    setMontoRetener('');
  };

  return (
    <div className="d-flex flex-column gap-4 p-3">
      <InfoCard
        title="Separar parte de tu dinero"
        detail="Aquí se implementarán métodos para reservar dinero de las cuentas principales."
      />

      <div className="card shadow-sm p-4 border-0">
        {cargando && <div className="alert alert-info">Cargando tus tarjetas...</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!cargando && !error && (
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-4">
              <label className="form-label fw-bold">Selecciona la tarjeta origen</label>
              <select 
                className="form-select"
                value={tarjetaSeleccionada}
                onChange={(e) => setTarjetaSeleccionada(e.target.value)}
                required
              >
                <option value="" disabled>-- Elige una tarjeta --</option>
                {tarjetas.map((tarjeta) => (
                  <option key={tarjeta.id} value={tarjeta.id}>
                    {tarjeta.tipo} - {tarjeta.numero} (Saldo: S/ {tarjeta.saldo})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Monto a retener</label>
              <input 
                type="number" 
                className={`form-control ${esMontoInvalido ? 'is-invalid' : ''}`}
                value={montoRetener}
                onChange={(e) => setMontoRetener(e.target.value ? Number(e.target.value) : '')}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                disabled={!tarjetaSeleccionada}
                required
              />
              {esMontoInvalido && (
                <div className="invalid-feedback">
                  El monto no puede superar el saldo de la tarjeta (S/ {saldoDisponible}).
                </div>
              )}
            </div>

            <button 
              type="button" 
              className="btn btn-primary w-100"
              disabled={esMontoInvalido || !tarjetaSeleccionada || !montoRetener}
              onClick={handleSepararSaldo}
            >
              Separar Saldo
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export function SeparacionSaldoPage() {
  return (
    <TarjetasProvider>
      <SeparacionSaldoView />
    </TarjetasProvider>
  );
}