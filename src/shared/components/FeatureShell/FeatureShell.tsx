import { Link, Outlet, useLocation } from 'react-router-dom';

export interface FeatureAction {
  to: string;
  label: string;
  match?: string;
}

interface FeatureShellProps {
  readonly title: string;
  readonly description?: string;
  readonly icon?: string;
  readonly iconClassName?: string;
  readonly actions: FeatureAction[];
}

export function FeatureShell({ title, description, icon, actions }: FeatureShellProps) {
  const location = useLocation();

  return (
    <div className="d-flex flex-column gap-4">
      {/* ── Header del módulo ──────────────────────────────── */}
      <div
        style={{
          background:   'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow:    'var(--shadow-sm)',
          border:       '1px solid var(--color-border)',
          overflow:     'hidden',
        }}
      >
        {/* Banner de color */}
        <div
          style={{
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-btn) 100%)',
            padding:    '18px 24px 14px',
            position:   'relative',
            overflow:   'hidden',
          }}
        >
          <div
            style={{
              position:     'absolute',
              width:        150,
              height:       150,
              borderRadius: '50%',
              background:   'rgba(255,255,255,0.07)',
              right:        -30,
              top:          -40,
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 style={{ margin: 0, color: '#fff', fontWeight: 800, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              {icon ? <i className={icon} style={{ fontSize: '1.1rem' }} /> : null}
              {title}
            </h3>
            {description ? (
              <p style={{ margin: '4px 0 0', color: 'rgba(253,227,207,0.85)', fontSize: '0.82rem' }}>
                {description}
              </p>
            ) : null}
          </div>
        </div>

        {/* Tabs de navegación */}
        <div
          style={{
            display:    'flex',
            flexWrap:   'wrap',
            gap:        8,
            padding:    '12px 20px',
            borderTop:  '1px solid var(--color-border)',
          }}
        >
          {actions.map((action) => {
            const match = action.match ?? action.to;
            const isActive = location.pathname.includes(match);
            return (
              <Link
                key={action.to}
                to={action.to}
                style={{
                  display:        'inline-flex',
                  alignItems:     'center',
                  padding:        '6px 18px',
                  borderRadius:   'var(--radius-full)',
                  fontSize:       '0.875rem',
                  fontWeight:     isActive ? 700 : 500,
                  textDecoration: 'none',
                  transition:     'all 0.2s',
                  background:     isActive ? 'var(--color-primary)' : 'transparent',
                  color:          isActive ? 'var(--color-btn-text)' : 'var(--color-text-muted)',
                  border:         isActive ? '1.5px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                }}
              >
                {action.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Contenido del outlet ───────────────────────────── */}
      <div className="w-100">
        <Outlet />
      </div>
    </div>
  );
}
