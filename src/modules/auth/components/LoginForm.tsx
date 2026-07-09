export function LoginForm() {
  return (
    <form className="d-flex flex-column gap-3">
      <input className="form-control" type="email" placeholder="Correo electrónico" aria-label="Correo electrónico" />
      <input className="form-control" type="password" placeholder="Contraseña" aria-label="Contraseña" />
      <button className="btn btn-primary" type="submit">
        Iniciar Sesión
      </button>
    </form>
  );
}
