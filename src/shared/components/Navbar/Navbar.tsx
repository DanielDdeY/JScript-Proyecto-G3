import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../modules/auth/presentation/hooks/useAuth';
import { useWallet } from '../../../modules/wallet/presentation/hooks/useWallet';

const navItems = [
  { to: '/app/dashboard', label: 'Resumen' },
  { to: '/app/saldo', label: 'Saldo' },
  { to: '/app/tarjetas', label: 'Tarjetas' },
  { to: '/app/gastos', label: 'Gastos' },
  { to: '/app/ingresos', label: 'Ingresos' },
  { to: '/app/proyecciones', label: 'Proyectadas' },
] as const;

export function Navbar() {
  const { perfil, cargando } = useWallet();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const nombre = perfil?.nombre ?? 'Usuario';

  const handleLogout = () => {
    logout();
    setMenuAbierto(false);
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom py-3">
      <div className="container-fluid px-4">
        <Link className="navbar-brand fw-bold text-primary" to="/app/dashboard">
          <i className="bi bi-wallet2 me-2" /> Vizcash
        </Link>

        <div className="navbar-nav flex-row flex-wrap justify-content-center gap-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link p-0 ${isActive ? 'text-primary fw-bold' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="dropdown d-flex align-items-center gap-2">
          <span className="fw-semibold text-dark d-none d-sm-inline">{cargando ? '...' : nombre}</span>
          <button
            className="nav-avatar-button dropdown-toggle d-flex align-items-center"
            type="button"
            onClick={() => setMenuAbierto((current) => !current)}
            aria-expanded={menuAbierto}
            aria-label="Abrir menú de usuario"
          >
            {perfil?.avatarUrl ? (
              <img
                src={perfil.avatarUrl}
                alt={`Avatar de ${nombre}`}
                className="nav-avatar-img rounded-circle"
              />
            ) : (
              <span
                className="bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white"
                style={{ width: '40px', height: '40px' }}
              >
                {cargando ? '' : nombre.charAt(0).toUpperCase()}
              </span>
            )}
          </button>
          <ul className={`dropdown-menu dropdown-menu-end shadow border-0 ${menuAbierto ? 'show' : ''}`}>
            <li>
              <Link className="dropdown-item" to="/app/perfil" onClick={() => setMenuAbierto(false)}>
                <i className="bi bi-person me-2" /> Ver perfil
              </Link>
            </li>
            <li>
              <button className="dropdown-item text-danger" type="button" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2" /> Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
