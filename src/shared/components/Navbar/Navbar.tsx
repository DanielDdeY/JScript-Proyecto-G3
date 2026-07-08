import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../core/context/AuthContext";

export const Navbar: React.FC = () => {

    const navigate = useNavigate();

    const { usuario, logout } = useAuth();

    const cerrarSesion = () => {

    logout();

    navigate("/login");

};

    return (

        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom py-3">

            <div className="container-fluid px-4">

                <Link
                    className="navbar-brand fw-bold text-primary"
                    to="/app/dashboard"
                >
                    VizCash
                </Link>

                <div className="collapse navbar-collapse justify-content-center">

                    <ul className="navbar-nav gap-3">

                        <li className="nav-item">
                            <Link to="/app/dashboard">Resumen</Link>
                        </li>

                        <li className="nav-item">
                            <Link to="/app/saldo">Saldo</Link>
                        </li>

                        <li className="nav-item">
                            <Link to="/app/gastos">Gastos</Link>
                        </li>

                        <li className="nav-item">
                            <Link to="/app/ingresos">Ingresos</Link>
                        </li>

                        <li className="nav-item">
                            <Link to="/app/proyecciones">Proyecciones</Link>
                        </li>

                    </ul>

                </div>

                <div className="dropdown">

                    <button
    className="btn btn-light dropdown-toggle d-flex align-items-center gap-2"
    data-bs-toggle="dropdown"
>

    <div className="avatar-circle">

        {usuario?.nombres?.charAt(0).toUpperCase()}

    </div>

    <span>

        {usuario?.nombres}

    </span>

</button>

                    <ul className="dropdown-menu dropdown-menu-end">

                        <li>

                            <span className="dropdown-item-text">

                                {usuario.correo}

                            </span>

                        </li>

                        <li>

                            <hr className="dropdown-divider" />

                        </li>

                        <li>

                            <button
                                className="dropdown-item text-danger"
                                onClick={cerrarSesion}
                            >

                                Cerrar sesión

                            </button>

                        </li>

                    </ul>

                </div>

            </div>

        </nav>

    );

};