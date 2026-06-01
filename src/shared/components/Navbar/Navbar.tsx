import React from 'react';
import { useWallet } from '../../../core/context/WalletContext';
import { Link } from "react-router-dom";

export const Navbar: React.FC = () => {
    const { perfil } = useWallet();

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom py-3">
            <div className="container-fluid px-4">
                <a className="navbar-brand fw-bold text-primary" href="#resumen">
                    MiBilletera
                </a>
                <div className="collapse navbar-collapse justify-content-center">
                    <ul className="navbar-nav gap-3">
                        <li className="nav-item">
                            <Link to="/app/dashboard">Resumen</Link>
                        </li>
                        <li className="nav-item"><Link to="/app/saldo">Saldo</Link></li>
                        <li className="nav-item"><Link to="/app/tarjetas">Tarjetas</Link></li>
                        <li className="nav-item"><Link to="/app/gastos">Gastos</Link></li>
                        <li className="nav-item"><Link to="/app/ingresos">Ingresos</Link></li>
                        <li className="nav-item"><Link to="/app/proyecciones">Proyectadas</Link></li>
                    </ul>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <span className="fw-semibold text-dark">{perfil.nombre}</span>
                    <div className="bg-secondary rounded-circle" style={{ width: '40px', height: '40px' }}></div>
                </div>
            </div>
        </nav>
    );
};