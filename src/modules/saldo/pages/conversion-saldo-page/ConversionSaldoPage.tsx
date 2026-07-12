import { useState } from 'react';
import { InfoCard } from '../../../../shared/components/InfoCard/InfoCard';
import { useWallet } from '../../../wallet/presentation/hooks/useWallet'; 

const TASAS_CAMBIO: Record<string, number> = {
  USD: 3.70, //wtf pq tan bajo cuando reviso esto
  EUR: 4.00 //esto sale como 3.88, aumenta con comisión
};

export function ConversionSaldoPage() {
  //se puede usar el contexto de wallet si se quiere mostrar información del usuario o de su saldo... creo
  const walletContext = useWallet(); 
  
  //estados
  const [montoSoles, setMontoSoles] = useState<number | ''>('');
  const [moneda, setMoneda] = useState<string>('USD');

  //lógica para convertir el monto según la moneda, valida que fijo sea número el ingreso
  const montoConvertido = typeof montoSoles === 'number' 
    ? (montoSoles / TASAS_CAMBIO[moneda]).toFixed(2) 
    : '0.00';

  return (
    <div className="d-flex flex-column gap-4 p-3">
      { walletContext.perfil && (
        <div className="alert alert-info" role="alert">
          Bienvenido, <strong>{walletContext.perfil.nombre}</strong>! Aquí puedes simular la conversión de tu saldo a dólares o euros.
        </div>
      )}
      <InfoCard
        title="Simulación de cambio de moneda"
        detail="Convierte montos de soles a dólares, euros u otras monedas."
      />

      {/* La nueva interfaz de simulación */}
      <div className="card shadow-sm p-4 border-0">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">Monto a convertir (Soles)</label>
            <input 
              type="number" 
              className="form-control"
              value={montoSoles}
              onChange={(e) => setMontoSoles(e.target.value ? Number(e.target.value) : '')}
              placeholder="Ej. 1500"
              min="0"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">Moneda destino</label>
            <select 
              className="form-select"
              value={moneda} 
              onChange={(e) => setMoneda(e.target.value)}
            >
              <option value="USD">Dólares (USD)</option>
              <option value="EUR">Euros (EUR)</option>
            </select>
          </div>
        </div>

        <div className="mt-4 p-3 bg-light border rounded">
          <h5 className="mb-1 text-muted">Obtienes aproximadamente:</h5>
          <span className="fs-2 fw-bold text-primary">
            {moneda === 'USD' ? '$' : '€'} {montoConvertido}
          </span>
          <p className="form-text mt-2 mb-0">
            *Tasa de cambio referencial: 1 {moneda} = S/ {TASAS_CAMBIO[moneda]}
          </p>
        </div>
      </div>
    </div>
  );
}