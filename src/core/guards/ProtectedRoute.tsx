import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<Props> = ({ children }) => {

    const usuario = localStorage.getItem("usuario");

    if (!usuario) {

        return <Navigate to="/login" replace />;

    }

    return <>{children}</>;

};