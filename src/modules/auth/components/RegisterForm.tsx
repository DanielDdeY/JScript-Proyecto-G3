export function RegisterForm() {
  return (
    <form className="d-flex flex-column gap-3">
      <input className="form-control" type="text" placeholder="Nombre" aria-label="Nombre" />
      <input className="form-control" type="email" placeholder="Correo electrónico" aria-label="Correo electrónico" />
      <input className="form-control" type="password" placeholder="Contraseña" aria-label="Contraseña" />
      <button className="btn btn-primary" type="submit">
        Crear cuenta
      </button>
    </form>
  );
}
