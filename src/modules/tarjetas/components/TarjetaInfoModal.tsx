import type { Banco } from '../../../shared/types/banco';
import type { CicloFacturacion } from '../../../shared/types/cicloFacturacion';
import type { LineaCredito } from '../../../shared/types/lineaCredito';
import { formatCurrencyPen } from '../../../shared/utils/formatters';
import { calcularDistribucionLineaCredito } from '../domain/services/tarjetaDisplayService';

export type TarjetaInfoModalData =
  | { tipo: 'banco'; data?: Banco | string }
  | { tipo: 'cicloFacturacion'; data?: CicloFacturacion }
  | { tipo: 'lineaCredito'; data?: LineaCredito };

interface TarjetaInfoModalProps {
  modal: TarjetaInfoModalData | null;
  onClose: () => void;
}

const renderValor = (valor: string | number | undefined) => {
  if (valor === undefined || valor === '') return 'No registrado';
  return valor;
};

export function TarjetaInfoModal({ modal, onClose }: TarjetaInfoModalProps) {
  if (!modal) return null;

  const titulo = {
    banco: 'Información del banco',
    cicloFacturacion: 'Ciclo de facturación',
    lineaCredito: 'Línea de crédito',
  }[modal.tipo];

  return (
    <>
      <div className="modal fade show d-block tarjeta-info-modal" tabIndex={-1} role="dialog" aria-modal="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold">{titulo}</h5>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onClose} />
            </div>
            <div className="modal-body">
              {modal.tipo === 'banco' ? <BancoDetalle banco={modal.data} /> : null}
              {modal.tipo === 'cicloFacturacion' ? <CicloFacturacionDetalle ciclo={modal.data} /> : null}
              {modal.tipo === 'lineaCredito' ? <LineaCreditoDetalle linea={modal.data} /> : null}
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show tarjeta-info-backdrop" />
    </>
  );
}

function BancoDetalle({ banco }: { banco?: Banco | string }) {
  if (!banco) return <p className="text-muted mb-0">No hay información del banco vinculada a esta tarjeta.</p>;

  if (typeof banco === 'string') {
    return (
      <div className="list-group list-group-flush">
        <DetalleItem label="Banco" value={banco} />
        <DetalleItem label="Modo de registro" value="Texto simple" />
      </div>
    );
  }

  return (
    <div className="list-group list-group-flush">
      <DetalleItem label="Nombre" value={banco.nombre} />
      <DetalleItem label="Logo URL" value={renderValor(banco.logoUrl)} />
      <DetalleItem label="TCEA" value={`${banco.tcea}%`} />
      <DetalleItem label="Tiempos de pago" value={`${banco.tiemposDePagoMeses.join(', ')} meses`} />
      <DetalleItem label="Seguro desgravamen" value={banco.seguroDesgravamen} />
    </div>
  );
}

function CicloFacturacionDetalle({ ciclo }: { ciclo?: CicloFacturacion }) {
  if (!ciclo) return <p className="text-muted mb-0">Esta tarjeta no tiene ciclo de facturación registrado.</p>;

  return (
    <div className="list-group list-group-flush">
      <DetalleItem label="Día de corte" value={ciclo.diaCorte} />
      <DetalleItem label="Día de pago" value={ciclo.diaPago} />
      <DetalleItem label="Mes actual" value={ciclo.mesActual} />
      <DetalleItem label="Monto facturado" value={formatCurrencyPen(ciclo.montoFacturado)} />
      <DetalleItem label="Pago mínimo" value={formatCurrencyPen(ciclo.pagoMinimo)} />
    </div>
  );
}

function LineaCreditoDetalle({ linea }: { linea?: LineaCredito }) {
  const distribucion = calcularDistribucionLineaCredito(linea);

  if (!linea || !distribucion) {
    return <p className="text-muted mb-0">Esta tarjeta no tiene línea de crédito registrada.</p>;
  }

  return (
    <div className="list-group list-group-flush">
      <DetalleItem label="Límite total" value={formatCurrencyPen(linea.limiteTotal)} />
      <DetalleItem label="Línea disponible" value={formatCurrencyPen(linea.lineaDisponible)} />
      <DetalleItem label="Línea utilizada" value={formatCurrencyPen(linea.lineaUtilizada)} />
      <DetalleItem label="Disponible" value={`${distribucion.disponiblePorcentaje.toFixed(1)}%`} />
      <DetalleItem label="Utilizada" value={`${distribucion.utilizadaPorcentaje.toFixed(1)}%`} />
    </div>
  );
}

function DetalleItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="list-group-item px-0 d-flex justify-content-between gap-3">
      <span className="text-muted fw-semibold">{label}</span>
      <span className="text-end fw-bold">{value}</span>
    </div>
  );
}
