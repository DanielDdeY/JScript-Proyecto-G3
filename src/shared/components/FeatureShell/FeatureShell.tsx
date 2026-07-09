import { Link, Outlet, useLocation } from 'react-router-dom';

export interface FeatureAction {
  to: string;
  label: string;
  match?: string;
}

interface FeatureShellProps {
  title: string;
  description?: string;
  icon?: string;
  iconClassName?: string;
  actions: FeatureAction[];
}

export function FeatureShell({ title, description, icon, iconClassName, actions }: FeatureShellProps) {
  const location = useLocation();

  const getButtonClass = (action: FeatureAction) => {
    const match = action.match ?? action.to;
    const isActive = location.pathname.includes(match);
    return `btn ${isActive ? 'btn-primary' : 'btn-outline-primary'} fw-semibold`;
  };

  return (
    <div className="d-flex flex-column gap-4">
      <section className="card p-4 border-0 shadow-sm bg-white">
        <h3 className="text-dark fw-bold mb-2">
          {icon ? <i className={`${icon} me-2 ${iconClassName ?? ''}`} /> : null}
          {title}
        </h3>
        {description ? <p className="text-muted mb-3">{description}</p> : null}

        <div className="d-flex flex-wrap gap-2">
          {actions.map((action) => (
            <Link key={action.to} to={action.to} className={getButtonClass(action)}>
              {action.label}
            </Link>
          ))}
        </div>
      </section>

      <div className="w-100">
        <Outlet />
      </div>
    </div>
  );
}
