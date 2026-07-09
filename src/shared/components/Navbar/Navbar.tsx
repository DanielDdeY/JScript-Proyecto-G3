import { Link, NavLink } from 'react-router-dom';
import { useWallet } from '../../../modules/wallet/presentation/hooks/useWallet';

const navItems = [
  { to: '/app/dashboard', label: 'Resumen' },
  { to: '/app/saldo', label: 'Saldo' },
  { to: '/app/tarjetas', label: 'Tarjetas' },
  { to: '/app/gastos', label: 'Gastos' },
  { to: '/app/ingresos', label: 'Ingresos' },
  { to: '/app/proyecciones', label: 'Proyectadas' },
  { to: '/app/perfil', label: 'Perfil' },
] as const;

export function Navbar() {
  const { perfil, cargando } = useWallet();
  const nombre = perfil?.nombre ?? 'Usuario';

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom py-3">
      <div className="container-fluid px-4">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          <i className="bi bi-wallet2 me-2" /> MiBilletera
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

        <div className="d-flex align-items-center gap-2">
          <span className="fw-semibold text-dark">{cargando ? '...' : nombre}</span>
          <div
            className="bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white"
            style={{ width: '40px', height: '40px' }}
          >
            {cargando ? '' : nombre.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </nav>
  );
}
