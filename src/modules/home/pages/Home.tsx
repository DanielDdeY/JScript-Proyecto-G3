import { Link } from 'react-router-dom';
import { Footer } from '../../../shared/components/Footer/Footer';

export function Home() {
  return (
    <div className="d-flex flex-column min-vh-100" style={{ background: 'var(--color-bg)' }}>

      {/* ── Navbar pública ─────────────────────────────────── */}
      <nav className="py-3 border-bottom" style={{ backgroundColor: 'var(--color-surface)', borderBottomColor: 'var(--color-border)' }}>
        <div className="container px-4 d-flex align-items-center justify-content-between">
          <span className="fw-bold fs-4 d-flex align-items-center gap-2" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-sans)' }}>
            <i className="bi bi-wallet2" />{' '}Vizcash
          </span>
          <div className="d-flex gap-2">
            <Link to="/login" className="btn btn-outline-primary fw-semibold">
              Ingresar
            </Link>
            <Link to="/app/dashboard" className="btn btn-primary fw-semibold">
              Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────── */}
      <main className="flex-grow-1 d-flex align-items-center">
        <div className="container px-4 py-5">
          <div className="row align-items-center g-5">

            {/* Texto */}
            <div className="col-lg-6 text-center text-lg-start">
              <span
                className="badge fw-semibold mb-3 px-3 py-2"
                style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)', fontSize: '0.85rem', borderRadius: '9999px' }}
              >
                ✦ Tu billetera inteligente
              </span>
              <h1 className="display-4 fw-bold mb-4" style={{ color: 'var(--color-text)', lineHeight: 1.15 }}>
                Controla tus finanzas de manera{' '}
                <span style={{ color: 'var(--color-primary)' }}>inteligente</span>
              </h1>
              <p className="lead mb-5" style={{ color: 'var(--color-text-muted)' }}>
                Centraliza tus cuentas, realiza proyecciones financieras, gestiona gastos e ingresos y alcanza tus metas fácilmente.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                <Link to="/app/dashboard" className="btn btn-primary btn-lg px-5 fw-bold">
                  Probar la app
                </Link>
                <Link
                  to="/login"
                  className="btn btn-lg px-5 fw-bold"
                  style={{ background: 'var(--color-surface)', color: 'var(--color-text)', border: '2px solid var(--color-border)' }}
                >
                  Iniciar sesión
                </Link>
              </div>
            </div>

            {/* Card ilustrativa */}
            <div className="col-lg-6">
              <div
                className="p-5 rounded-4 text-center shadow-sm"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              >
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                  style={{ width: 80, height: 80, background: 'var(--color-primary-light)' }}
                >
                  <i className="bi bi-graph-up-arrow fs-2" style={{ color: 'var(--color-primary)' }} />
                </div>
                <h3 className="fw-bold mb-3" style={{ color: 'var(--color-text)' }}>Todo en un solo lugar</h3>
                <p className="mb-4" style={{ color: 'var(--color-text-muted)' }}>
                  Integración local con datos simulados para probar tus módulos de tarjetas, gastos, ingresos y proyecciones.
                </p>
                {/* Feature list */}
                <div className="d-flex flex-column gap-2 text-start">
                  {[
                    { icon: 'bi-credit-card', label: 'Gestión de tarjetas bancarias' },
                    { icon: 'bi-arrow-down-up', label: 'Historial de ingresos y gastos' },
                    { icon: 'bi-graph-up',  label: 'Proyecciones financieras' },
                    { icon: 'bi-bullseye', label: 'Metas de ahorro personales' },
                  ].map((f) => (
                    <div key={f.icon} className="d-flex align-items-center gap-3">
                      <span
                        className="rounded-circle d-inline-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: 36, height: 36, background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
                      >
                        <i className={`bi ${f.icon}`} />
                      </span>
                      <span className="fw-500" style={{ color: 'var(--color-text)' }}>{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
