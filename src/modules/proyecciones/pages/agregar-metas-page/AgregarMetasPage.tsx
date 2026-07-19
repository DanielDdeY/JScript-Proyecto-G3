import { useNavigate } from 'react-router-dom';
import { MetaForm } from '../../components/MetaForm';
import { useMetas } from '../../presentation/hooks/useMetas';
import type { NuevaMetaAhorro } from '../../domain/repositories/metasRepository';

export function AgregarMetasPage() {
  const { agregarMeta, cargando, error } = useMetas();
  const navigate = useNavigate();

  const guardarMeta = async (meta: NuevaMetaAhorro) => {
    await agregarMeta(meta);
    navigate('/app/proyecciones/listar');
  };

  return (
    <section className="d-flex flex-column gap-3">
      {error ? (
        <div className="alert alert-danger border-0 shadow-sm" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2" /> {error}
        </div>
      ) : null}

      <MetaForm cargando={cargando} textoBoton="Agregar meta" onGuardar={(meta) => guardarMeta(meta as NuevaMetaAhorro)} />
    </section>
  );
}
