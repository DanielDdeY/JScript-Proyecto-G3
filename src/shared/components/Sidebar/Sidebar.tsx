import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/app/dashboard', label: 'Resumen', icon: 'bi-grid-1x2' },
  { to: '/app/saldo',     label: 'Saldo', icon: 'bi-wallet2' },
  { to: '/app/tarjetas',  label: 'Tarjetas', icon: 'bi-credit-card' },
  { to: '/app/gastos',    label: 'Gastos', icon: 'bi-graph-down-arrow' },
  { to: '/app/ingresos',  label: 'Ingresos', icon: 'bi-graph-up-arrow' },
  { to: '/app/proyecciones', label: 'Proyectadas', icon: 'bi-calendar-event' },
] as const;

export function Sidebar() {
  return (
    <aside
      className="d-none d-lg-flex flex-column"
      style={{
        width: '260px',
        backgroundColor: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 1000,
        padding: '1.5rem 1.25rem',
      }}
    >
      {/* Brand */}
      <div className="mb-5 px-3">
        <div className="d-flex align-items-center gap-3" style={{ color: 'var(--color-primary)' }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-primary)',
              color: 'var(--color-btn-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem'
            }}
          >
            <i className="bi bi-wallet2" />
          </div>
          <span style={{ fontWeight: 900, fontSize: '1.35rem', letterSpacing: '-0.02em' }}>Vizcash</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-grow-1 d-flex flex-column gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="d-flex align-items-center gap-3 px-3 py-2.5"
            style={({ isActive }) => ({
              textDecoration: 'none',
              borderRadius: 'var(--radius-md)',
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
              background: isActive ? 'var(--color-primary-light)' : 'transparent',
              fontWeight: isActive ? 700 : 600,
              transition: 'all 0.2s',
            })}
          >
            {({ isActive }) => (
              <>
                <i className={`bi ${item.icon}`} style={{ fontSize: '1.1rem', opacity: isActive ? 1 : 0.7 }} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer minimalista en sidebar */}
      <div className="mt-auto px-3" style={{ opacity: 0.6 }}>
        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          © {new Date().getFullYear()} Vizcash.
        </p>
      </div>
    </aside>
  );
}
