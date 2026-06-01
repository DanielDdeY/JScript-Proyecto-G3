import React from 'react';
import { Hero } from '../components/Hero';
import { Link } from "react-router-dom";
export const Home: React.FC = () => <div className="container mt-5">
    <Hero /><p>Esta es la página pública de inicio.</p>
    <li className="nav-item">
        <Link to="/app/dashboard">Resumen</Link>
    </li>
</div>;