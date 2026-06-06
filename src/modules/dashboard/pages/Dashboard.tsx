import React from 'react';
import { useWallet } from '../../../core/context/WalletContext';
import type { Tarjeta } from '../../../shared/types/tarjeta';
import type { Proyeccion } from '../../../shared/types/proyeccion';

export const Dashboard: React.FC = () => {
    const { perfil, tarjetas, resumenFinanciero, proyecciones } = useWallet();

    return (
        <div className="d-flex flex-column gap-4">

            {/* Seccion Superior: Saldo Total y Tarjetas de Credito */}
            <div className="row g-3 align-items-center">
                <div className="col-12 col-xl-3">
                    <span className="text-uppercase text-muted fw-bold small">Saldo Total</span>
                    <h2 className="fw-bold m-0 text-dark">S/. {perfil.saldoTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
                    <span className="badge bg-success-subtle text-success mt-1">↑ + 8.3% vs mes anterior</span>
                </div>

                <div className="col-12 col-xl-9">
                    <div className="row g-3">
                        {tarjetas.map((tarjeta: Tarjeta) => (
                            <div key={tarjeta.id} className="col-12 col-sm-4">
                                <div className="card p-3 text-white border-0 shadow-sm" style={{
                                    background: tarjeta.banco === 'VISA' ? 'linear-gradient(135deg, #0d6efd, #0a4baf)' :
                                        tarjeta.banco === 'BCP' ? 'linear-gradient(135deg, #6f42c1, #492787)' :
                                            'linear-gradient(135deg, #0dcaf0, #087990)'
                                }}>
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <span className="fw-bold fs-5">{tarjeta.banco}</span>
                                        <span className="small">**** {tarjeta.numero}</span>
                                    </div>
                                    <span className="small opacity-75">Saldo disponible</span>
                                    <span className="fw-bold fs-5">S/. {tarjeta.saldo.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Seccion Intermedia: Resumen Financiero */}
            <div className="card p-3 border-0 shadow-sm">
                <h6 className="text-muted text-uppercase fw-bold small mb-3">Resumen Financiero</h6>
                <div className="row text-center g-3">
                    <div className="col-4 border-end">
                        <span className="text-muted small d-block">Ingresos</span>
                        <span className="fw-bold text-success fs-5">S/. {resumenFinanciero.ingresos.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="col-4 border-end">
                        <span className="text-muted small d-block">Gastos</span>
                        <span className="fw-bold text-danger fs-5">S/. {resumenFinanciero.gastos.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="col-4">
                        <span className="text-muted small d-block">Ahorro</span>
                        <span className="fw-bold text-info fs-5">S/. {resumenFinanciero.ahorro.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>
            </div>

            {/* Seccion Inferior: Proyecciones Financieras */}
            <div>
                <h6 className="text-muted text-uppercase fw-bold small mb-3">Proyección Financiera</h6>
                <div className="row g-3">
                    {proyecciones.map((proy: Proyeccion, idx: number) => (
                        <div key={idx} className="col-12 col-sm-6 col-lg-3">
                            <div className="card p-3 border-0 shadow-sm bg-white">
                                <span className="text-muted small">{proy.tiempo}</span>
                                <h4 className="fw-bold text-primary my-1">S/. {proy.monto.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h4>
                                <span className="text-success small fw-semibold">↑ {proy.porcentaje}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};