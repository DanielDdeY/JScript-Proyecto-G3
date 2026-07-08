import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUsuario } from "../../../core/services/AuthService";
import { useAuth } from "../../../core/context/AuthContext";

export const LoginForm: React.FC = () => {

const navigate = useNavigate();

const { login } = useAuth();

const location = useLocation();

const [correo, setCorreo] = useState("");

const [password, setPassword] = useState("");

const [mostrarPassword, setMostrarPassword] = useState(false);

const [error, setError] = useState("");

const mensajeRegistro = location.state?.mensaje || "";

const [mensaje, setMensaje] = useState(mensajeRegistro);


useEffect(() => {

    if (mensaje) {

        const tiempo = setTimeout(() => {

            setMensaje("");

            // Limpiar el state de la navegación
            navigate(location.pathname, {
                replace: true,
                state: {}
            });

        }, 2000);

        return () => clearTimeout(tiempo);

    }

}, [mensaje, navigate, location]);

    const ingresar = async (e: React.FormEvent) => {

        e.preventDefault();

        setError("");

        // Validar campos vacíos
        if (!correo || !password) {

            setError("Complete todos los campos.");

            return;

        }

        try {

            const datos = await loginUsuario(correo, password);

            if (datos.length === 0) {

                setError("Correo o contraseña incorrectos.");

                return;

            }

            // Guardar usuario en la sesión
            login(datos[0]);

            navigate("/app/dashboard");

        } catch (error) {

            setError("Ocurrió un error al iniciar sesión.");

            console.error(error);

        }

    };

    return (

       <form onSubmit={ingresar} className="w-100">

    {mensaje && (

    <div className="alert alert-success text-center">

        {mensaje}

    </div>

)}
    <div className="mb-4 text-start">

        <label className="form-label fw-semibold">

            Correo electrónico
                </label>

                <input
                    type="email"
                    className="form-control input-login"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                />

            </div>

            {/* Contraseña */}
            <div className="mb-4 text-start">

                <label className="form-label fw-semibold">
                    Contraseña
                </label>

                <div className="position-relative">

                    <input
                        type={mostrarPassword ? "text" : "password"}
                        className="form-control input-login pe-5"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        type="button"
                        className="btn border-0 position-absolute top-50 end-0 translate-middle-y"
                        onClick={() =>
                            setMostrarPassword(!mostrarPassword)
                        }
                    >

                        {mostrarPassword ? "👁️" : "👁️"}

                    </button>

                </div>

                <small className="text-danger">

                    {error}

                </small>

            </div>

            {/* Botón */}

            <div className="text-center mt-4">

                <button
                    type="submit"
                    className="btn ingresar-btn"
                >

                    Ingresar

                </button>

            </div>

            {/* Registro */}

            <p className="registro mt-4">

                ¿No tienes cuenta?{" "}

                <Link to="/register">

                    Regístrate aquí

                </Link>

            </p>

        </form>

    );

};