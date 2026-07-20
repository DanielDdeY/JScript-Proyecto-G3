import { Link } from 'react-router-dom';
import type { Notificacion } from '../domain/models/notificacion';
import { useNotificaciones } from '../presentation/hooks/useNotificaciones';

const obtenerIcono = (notificacion: Notificacion) => {
  if (notificacion.tipo === 'PRESUPUESTO') return 'bi-graph-up-arrow';
  if (notificacion.tipo === 'TARJETA') return 'bi-credit-card';
  return 'bi-cash-coin';
};

const obtenerColorFondo = (notificacion: Notificacion) => {
  if (notificacion.nivel === 'PELIGRO')     return { bg: 'var(--color-danger-bg)',  icon: 'var(--color-danger)' };
  if (notificacion.nivel === 'ADVERTENCIA') return { bg: 'var(--color-warning-bg)', icon: 'var(--color-warning)' };
  return { bg: 'var(--color-primary-light)', icon: 'var(--color-primary)' };
};

interface BotonNotificacionesProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function BotonNotificaciones({ isOpen, onToggle }: BotonNotificacionesProps) {
  const { notificaciones, total, cargando, error, recargar, descartarNotificacion } = useNotificaciones();

  return (
    <div className="position-relative">
      {/* Botón campana */}
      <button
        type="button"
        aria-label="Abrir notificaciones"
        aria-expanded={isOpen}
        onClick={onToggle}
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-full)',
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
          color: 'var(--color-text-muted)'
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-bg-alt)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-surface)'; }}
      >
        <i className="bi bi-bell-fill" style={{ fontSize: '1.1rem' }} />
        {total > 0 ? (
          <span 
            style={{
              position: 'absolute',
              top: -2,
              right: -2,
              background: 'var(--color-danger)',
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: 800,
              padding: '2px 5px',
              borderRadius: 'var(--radius-full)',
              border: '2px solid var(--color-surface)',
              lineHeight: 1
            }}
          >
            {total > 9 ? '9+' : total}
          </span>
        ) : null}
      </button>

      {/* Panel desplegable */}
      {isOpen ? (
        <>
          <div
            className="notification-panel"
            style={{
              position:   'absolute',
              left:       0,
              top:        'calc(100% + 8px)',
              zIndex:     1080,
              width:      'min(360px, calc(100vw - 2rem))',
              maxHeight:  '480px',
              display:    'flex',
              flexDirection: 'column',
              background: 'var(--color-surface)',
              border:     '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              boxShadow:  'var(--shadow-xl)',
              overflow:   'hidden',
            }}
          >
            {/* Header del panel */}
            <div
              style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'space-between',
                padding:        '14px 16px',
                borderBottom:   '1px solid var(--color-border)',
                background:     'var(--color-bg-alt)',
                flexShrink:     0,
              }}
            >
              <div>
                <p style={{ margin: 0, fontWeight: 700, color: 'var(--color-text)', fontSize: '0.95rem' }}>
                  Notificaciones
                  {total > 0 ? (
                    <span
                      style={{
                        marginLeft:      8,
                        background:      'var(--color-primary)',
                        color:           'var(--color-btn-text)',
                        borderRadius:    'var(--radius-full)',
                        fontSize:        '0.7rem',
                        fontWeight:      700,
                        padding:         '2px 7px',
                        verticalAlign:   'middle',
                      }}
                    >
                      {total}
                    </span>
                  ) : null}
                </p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Presupuestos y pagos próximos
                </p>
              </div>
              <button
                style={{
                  background:   'transparent',
                  border:       '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-full)',
                  width:        32,
                  height:       32,
                  display:      'flex',
                  alignItems:   'center',
                  justifyContent: 'center',
                  cursor:       'pointer',
                  color:        'var(--color-text-muted)',
                  transition:   'all 0.2s',
                }}
                type="button"
                onClick={() => void recargar()}
                title="Actualizar notificaciones"
              >
                <i className="bi bi-arrow-clockwise" style={{ fontSize: '0.85rem' }} />
              </button>
            </div>

            {/* Lista de notificaciones (scroll) */}
            <div
              className="notification-list"
              style={{
                overflowY: 'auto',
                flex:       1,
                minHeight:  0,
              }}
            >
              {cargando ? (
                <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  <div className="spinner-border spinner-border-sm text-primary" role="status" />
                  <p style={{ margin: '8px 0 0', fontSize: '0.85rem' }}>Cargando...</p>
                </div>
              ) : null}

              {error ? (
                <div style={{ padding: '16px', margin: '12px', background: 'var(--color-danger-bg)', borderRadius: 'var(--radius-sm)', color: 'var(--color-danger)', fontSize: '0.85rem' }}>
                  <i className="bi bi-exclamation-triangle-fill me-2" />{error}
                </div>
              ) : null}

              {!cargando && !error && notificaciones.length === 0 ? (
                <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                  <i className="bi bi-bell-slash" style={{ fontSize: '2rem', color: 'var(--color-border-strong)', display: 'block', marginBottom: 8 }} />
                  <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                    No tienes notificaciones pendientes
                  </p>
                </div>
              ) : null}

              {!cargando && !error && notificaciones.map((notif) => {
                const colores = obtenerColorFondo(notif);
                return (
                  <div
                    key={notif.id}
                    style={{
                      display:      'flex',
                      alignItems:   'flex-start',
                      gap:          10,
                      padding:      '12px 14px',
                      borderBottom: '1px solid var(--color-border)',
                      transition:   'background 0.15s',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'var(--color-bg-alt)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                  >
                    {/* Icono */}
                    <div
                      style={{
                        width:          36,
                        height:         36,
                        minWidth:       36,
                        borderRadius:   'var(--radius-full)',
                        background:     colores.bg,
                        display:        'flex',
                        alignItems:     'center',
                        justifyContent: 'center',
                        flexShrink:     0,
                      }}
                    >
                      <i className={`bi ${obtenerIcono(notif)}`} style={{ fontSize: '0.9rem', color: colores.icon }} />
                    </div>

                    {/* Contenido */}
                    <Link
                      to={notif.enlace ?? '#'}
                      style={{
                        textDecoration: 'none',
                        flexGrow:       1,
                        minWidth:       0,
                      }}
                      onClick={onToggle}
                    >
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '0.825rem', color: 'var(--color-text)', wordBreak: 'break-word' }}>
                        {notif.titulo}
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '0.775rem', color: 'var(--color-text-muted)', wordBreak: 'break-word' }}>
                        {notif.mensaje}
                      </p>
                      <p style={{ margin: '4px 0 0', fontSize: '0.72rem', color: 'var(--color-text-soft)' }}>
                        {notif.fecha}
                      </p>
                    </Link>

                    {/* Descartar */}
                    <button
                      type="button"
                      aria-label="Descartar notificación"
                      title="Descartar"
                      style={{
                        background:   'transparent',
                        border:       'none',
                        padding:      '4px',
                        cursor:       'pointer',
                        color:        'var(--color-text-soft)',
                        borderRadius: 'var(--radius-xs)',
                        flexShrink:   0,
                        lineHeight:   1,
                        transition:   'color 0.15s',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-danger)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-soft)'; }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        descartarNotificacion(notif.id);
                      }}
                    >
                      <i className="bi bi-x-lg" style={{ fontSize: '0.75rem' }} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer del panel */}
            {!cargando && !error && notificaciones.length > 0 ? (
              <div
                style={{
                  padding:     '10px 16px',
                  borderTop:   '1px solid var(--color-border)',
                  background:  'var(--color-bg-alt)',
                  flexShrink:  0,
                  textAlign:   'center',
                }}
              >
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  {notificaciones.length} notificación{notificaciones.length !== 1 ? 'es' : ''} pendiente{notificaciones.length !== 1 ? 's' : ''}
                </span>
              </div>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
