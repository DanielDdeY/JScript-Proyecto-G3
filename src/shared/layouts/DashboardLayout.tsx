import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar/Navbar';
import { Footer } from '../components/Footer/Footer';

export const DashboardLayout: React.FC = () => {
    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Navbar />
            <div className="container-fluid px-4 py-4 flex-grow-1">
                <div className="row g-4">
                    <aside className="col-12 col-md-3 col-lnpm install react-router-domg-2">
                        {/* ... Tu código de filtros e inputs de Bootstrap ... */}
                    </aside>

                    <main className="col-12 col-md-9 col-lg-10">
                        {/* El Outlet renderizará la página activa según la URL */}
                        <Outlet />
                    </main>
                </div>
            </div>
            <Footer />
        </div>
    );
};