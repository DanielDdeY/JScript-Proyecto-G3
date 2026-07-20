import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar/Navbar';
import { Sidebar } from '../components/Sidebar/Sidebar';

export function DashboardLayout() {
  return (
    <div className="d-flex min-vh-100" style={{ background: 'var(--color-bg)' }}>
      {/* Sidebar on the left (desktop only) */}
      <Sidebar />
      
      {/* Main content on the right */}
      <div className="flex-grow-1 d-flex flex-column min-w-0">
        <Navbar />
        <div className="container-fluid px-3 px-md-4 py-4 flex-grow-1">
          <main className="col-12">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

