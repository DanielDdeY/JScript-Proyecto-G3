import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../modules/auth/presentation/hooks/useAuth';
import { useWallet } from '../../../modules/wallet/presentation/hooks/useWallet';
import { BotonNotificaciones } from '../../../modules/notificaciones/components/BotonNotificaciones';

const navItems = [
  { to: '/app/dashboard', label: 'Resumen' },
  { to: '/app/saldo',     label: 'Saldo' },
  { to: '/app/tarjetas',  label: 'Tarjetas' },
  { to: '/app/gastos',    label: 'Gastos' },
  { to: '/app/ingresos',  label: 'Ingresos' },
  { to: '/app/proyecciones', label: 'Proyectadas' },
] as const;

export function Navbar() {
  const { perfil, cargando } = useWallet();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<'none' | 'profile' | 'notifications'>('none');
  const [navbarAbierto, setNavbarAbierto] = useState(false);
  const rightSideRef = useRef<HTMLDivElement>(null);
  const nombre = perfil?.nombre ?? 'Usuario';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rightSideRef.current && !rightSideRef.current.contains(event.target as Node)) {
        setActiveMenu('none');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setActiveMenu('none');
    setNavbarAbierto(false);
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg border-bottom py-2" style={{ backgroundColor: 'var(--color-surface)', borderBottomColor: 'var(--color-border) !important' }}>
      <div className="container-fluid px-3 px-md-4">

        {/* Brand (Visible only on mobile) */}
        <Link
          className="navbar-brand fw-bold d-flex align-items-center gap-2 d-lg-none"
          to="/app/dashboard"
          style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-sans)' }}
        >
          <i className="bi bi-wallet2" />
          <span>Vizcash</span>
        </Link>

        {/* Hamburger toggle (mobile) */}
        <button
          className="navbar-toggler border-0 shadow-none d-lg-none"
          type="button"
          aria-controls="navbarMain"
          aria-expanded={navbarAbierto}
          aria-label="Abrir menú de navegación"
          onClick={() => setNavbarAbierto((v) => !v)}
          style={{ color: 'var(--color-primary)' }}
        >
          <i className={`bi ${navbarAbierto ? 'bi-x-lg' : 'bi-list'} fs-4`} />
        </button>

        {/* Nav links collapse */}
        <div className={`collapse navbar-collapse ${navbarAbierto ? 'show' : ''}`} id="navbarMain">
          {/* Menu items (Visible only on mobile) */}
          <ul className="navbar-nav me-auto gap-1 py-2 py-lg-0 d-lg-none">
            {navItems.map((item) => (
              <li key={item.to} className="nav-item">
                <NavLink
                  to={item.to}
                  onClick={() => setNavbarAbierto(false)}
                  className="nav-link px-3 py-2 fw-500 position-relative"
                  style={({ isActive }) => ({
                    color:      isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    fontWeight: isActive ? 700 : 500,
                    transition: 'color 0.2s ease',
                  })}
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      {isActive && (
                        <span 
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: '1rem',
                            right: '1rem',
                            height: '3px',
                            background: 'var(--color-primary)',
                            borderRadius: '3px 3px 0 0'
                          }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center gap-2 py-2 py-lg-0" ref={rightSideRef}>
            <BotonNotificaciones 
              isOpen={activeMenu === 'notifications'} 
              onToggle={() => setActiveMenu(prev => prev === 'notifications' ? 'none' : 'notifications')} 
            />

            <div className="d-flex align-items-center gap-3">
              {/* Nombre (Desktop) */}
              <span
                className="fw-semibold d-none d-sm-inline"
                style={{ color: 'var(--color-text)', fontSize: '0.9rem' }}
              >
                {cargando ? '...' : nombre}
              </span>

              {/* Botón y Menú anclados juntos */}
              <div className="position-relative d-flex">
                <button
                  type="button"
                  onClick={() => setActiveMenu(prev => prev === 'profile' ? 'none' : 'profile')}
                aria-expanded={activeMenu === 'profile'}
                aria-label="Abrir menú de usuario"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-full)',
                  width: 40,
                  height: 40,
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-bg-alt)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-surface)'; }}
              >
                {perfil?.avatarUrl ? (
                  <img
                    src={perfil.avatarUrl}
                    alt={`Avatar de ${nombre}`}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 'var(--radius-full)',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <span
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--color-primary)',
                      color: 'var(--color-btn-text)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '1rem'
                    }}
                  >
                    {cargando ? '' : nombre.charAt(0).toUpperCase()}
                  </span>
                )}
              </button>

              {activeMenu === 'profile' && (
                <div
                  className="shadow border-0"
                  style={{ 
                    minWidth: '180px',
                    position: 'absolute',
                    zIndex: 1050,
                    top: 'calc(100% + 8px)', 
                    left: 0,
                    borderRadius: 'var(--radius-xl)',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <Link
                    to="/app/perfil"
                    onClick={() => { setActiveMenu('none'); setNavbarAbierto(false); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      color: 'var(--color-text)',
                      textDecoration: 'none',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--color-bg-alt)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
                  >
                    <i className="bi bi-person" style={{ fontSize: '1rem' }} />{' '}Ver perfil
                  </Link>
                  <hr style={{ margin: '4px 0', borderColor: 'var(--color-border)' }} />
                  <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      color: 'var(--color-danger)',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-danger-bg)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                  >
                    <i className="bi bi-box-arrow-right" style={{ fontSize: '1rem' }} />{' '}Cerrar sesión
                  </button>
                </div>
              )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
