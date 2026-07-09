import { Link } from 'react-router-dom';
import { Footer } from '../../../shared/components/Footer/Footer';

export function Home() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-white">
      <nav className="navbar navbar-expand-lg navbar-light border-bottom py-3">
        <div className="container px-4">
          <Link className="navbar-brand fw-bold text-primary" to="/">
            <i className="bi bi-wallet2 me-2" /> MiBilletera
          </Link>
          <div>
            <Link to="/login" className="btn btn-outline-primary me-2 fw-semibold">
              Ingresar
            </Link>
            <Link to="/app/dashboard" className="btn btn-primary fw-semibold">
              Demo App
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow-1 d-flex align-items-center">
        <div className="container px-4 py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 text-center text-lg-start">
              <h1 className="display-4 fw-bold text-dark mb-4">
                Controla tus finanzas de manera <span className="text-primary">inteligente</span>
              </h1>
              <p className="lead text-muted mb-4">
                Centraliza tus cuentas, realiza proyecciones financieras, gestiona gastos e ingresos y alcanza tus metas fácilmente.
              </p>
              <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                <Link to="/app/dashboard" className="btn btn-primary btn-lg px-4 me-md-2 fw-bold">
                  Probar la app
                </Link>
                <Link to="/login" className="btn btn-outline-secondary btn-lg px-4 fw-bold">
                  Iniciar sesión
                </Link>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="bg-light p-5 rounded-4 border shadow-sm text-center">
                <i className="bi bi-graph-up-arrow text-primary" style={{ fontSize: '4rem' }} />
                <h3 className="fw-bold mt-4">Todo en un solo lugar</h3>
                <p className="text-muted mt-2 mb-0">
                  Integración local con datos simulados para probar tus módulos de tarjetas, gastos, ingresos y proyecciones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
