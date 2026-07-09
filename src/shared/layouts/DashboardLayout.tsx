import { Outlet } from 'react-router-dom';
import { Footer } from '../components/Footer/Footer';
import { Navbar } from '../components/Navbar/Navbar';

export function DashboardLayout() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />
      <div className="container-fluid px-4 py-4 flex-grow-1">
        <main className="col-12">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
