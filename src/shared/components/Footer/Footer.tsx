export function Footer() {
  return (
    <footer className="bg-white border-top py-3 mt-auto">
      <div className="container-fluid px-4 d-flex flex-wrap justify-content-between gap-2 text-muted small">
        <span>© 2026 MiBilletera. Todos los derechos reservados.</span>
        <div className="d-flex gap-3">
          <a href="#privacidad" className="text-decoration-none text-muted">
            Privacidad
          </a>
          <a href="#terminos" className="text-decoration-none text-muted">
            Términos
          </a>
          <a href="#ayuda" className="text-decoration-none text-muted">
            Ayuda
          </a>
        </div>
      </div>
    </footer>
  );
}
