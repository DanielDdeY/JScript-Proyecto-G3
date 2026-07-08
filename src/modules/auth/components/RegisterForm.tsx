import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registrarUsuario } from "../../../core/services/AuthService";

export const RegisterForm: React.FC = () => {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        nombres: "",
        apellidos: "",
        dni: "",
        correo: "",
        celular: "",
        password: "",
        confirmar: ""
    });

    const [errores, setErrores] = useState({
        nombres: "",
        apellidos: "",
        dni: "",
        correo: "",
        celular: "",
        password: "",
        confirmar: ""
    });

    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const validarFormulario = () => {

        const nuevosErrores = {
            nombres: "",
            apellidos: "",
            dni: "",
            correo: "",
            celular: "",
            password: "",
            confirmar: ""
        };

        let valido = true;

        // Nombres
        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{3,}$/.test(form.nombres.trim())) {

            nuevosErrores.nombres =
                "Solo letras. Mínimo 3 caracteres.";

            valido = false;

        }

        // Apellidos
        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{3,}$/.test(form.apellidos.trim())) {

            nuevosErrores.apellidos =
                "Solo letras. Mínimo 3 caracteres.";

            valido = false;

        }

        // DNI
        if (!/^\d{8}$/.test(form.dni)) {

            nuevosErrores.dni =
                "El DNI debe tener exactamente 8 dígitos.";

            valido = false;

        }

        // Correo
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) {

            nuevosErrores.correo =
                "Ingrese un correo electrónico válido.";

            valido = false;

        }

        // Celular
        if (!/^9\d{8}$/.test(form.celular)) {

            nuevosErrores.celular =
                "Ingrese un celular válido de 9 dígitos.";

            valido = false;

        }

        // Contraseña
        if (
            !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/.test(form.password)
        ) {

            nuevosErrores.password =
                "Debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial.";

            valido = false;

        }

        // Confirmar contraseña
        if (form.password !== form.confirmar) {

            nuevosErrores.confirmar =
                "Las contraseñas no coinciden.";

            valido = false;

        }

        setErrores(nuevosErrores);

        return valido;

    };

    const registrar = async (e: React.FormEvent) => {

        e.preventDefault();

        if (!validarFormulario()) return;

        try {

            await registrarUsuario({

                nombres: form.nombres,
                apellidos: form.apellidos,
                dni: form.dni,
                correo: form.correo,
                celular: form.celular,
                password: form.password

            });

            navigate("/login", {
    state: {
        mensaje: "Usuario registrado correctamente. Ahora puede iniciar sesión."
    }
});

        } catch (error: any) {

            setErrores({
                ...errores,
                correo: error.message
            });

        }

    };

    return (

        <form onSubmit={registrar} className="w-100 pb-4">

            {/* Nombres */}
            <div className="mb-1 text-start">

                <label className="form-label fw-semibold">
                    Nombres completos
                </label>

                <input
                    type="text"
                    name="nombres"
                    className="form-control input-login"
                    value={form.nombres}
                    onChange={handleChange}
                />

                <small className="text-danger">
                    {errores.nombres}
                </small>

            </div>

            {/* Apellidos */}
            <div className="mb-1 text-start">

                <label className="form-label fw-semibold">
                    Apellidos completos
                </label>

                <input
                    type="text"
                    name="apellidos"
                    className="form-control input-login"
                    value={form.apellidos}
                    onChange={handleChange}
                />

                <small className="text-danger">
                    {errores.apellidos}
                </small>

            </div>

            {/* DNI */}
            <div className="mb-1 text-start">

                <label className="form-label fw-semibold">
                    DNI
                </label>

                <input
                    type="text"
                    name="dni"
                    maxLength={8}
                    className="form-control input-login"
                    value={form.dni}
                    onChange={handleChange}
                />

                <small className="text-danger">
                    {errores.dni}
                </small>

            </div>

            {/* Correo */}
            <div className="mb-1 text-start">

                <label className="form-label fw-semibold">
                    Correo electrónico
                </label>

                <input
                    type="email"
                    name="correo"
                    className="form-control input-login"
                    value={form.correo}
                    onChange={handleChange}
                />

                <small className="text-danger">
                    {errores.correo}
                </small>

            </div>

            {/* Celular */}
            <div className="mb-1 text-start">

                <label className="form-label fw-semibold">
                    Celular
                </label>

                <input
                    type="text"
                    name="celular"
                    maxLength={9}
                    className="form-control input-login"
                    value={form.celular}
                    onChange={handleChange}
                />

                <small className="text-danger">
                    {errores.celular}
                </small>

            </div>

            {/* Contraseña */}
            <div className="mb-1 text-start">

                <label className="form-label fw-semibold">
                    Contraseña
                </label>

                <div className="position-relative">

                    <input
                        type={mostrarPassword ? "text" : "password"}
                        name="password"
                        className="form-control input-login pe-5"
                        value={form.password}
                        onChange={handleChange}
                    />

                    <button
                        type="button"
                        className="btn border-0 position-absolute top-50 end-0 translate-middle-y"
                        onClick={() => setMostrarPassword(!mostrarPassword)}
                    >
                        {mostrarPassword ? "🙈" : "👁️"}
                    </button>

                </div>

                <small className="text-danger">
                    {errores.password}
                </small>

            </div>

            {/* Confirmar contraseña */}
            <div className="mb-3 text-start">

                <label className="form-label fw-semibold">
                    Confirmar contraseña
                </label>

                <div className="position-relative">

                    <input
                        type={mostrarConfirmar ? "text" : "password"}
                        name="confirmar"
                        className="form-control input-login pe-5"
                        value={form.confirmar}
                        onChange={handleChange}
                    />

                    <button
                        type="button"
                        className="btn border-0 position-absolute top-50 end-0 translate-middle-y"
                        onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                    >
                        {mostrarConfirmar ? "🙈" : "👁️"}
                    </button>

                </div>

                <small className="text-danger">
                    {errores.confirmar}
                </small>

            </div>

            <div className="text-center">

                <button
                    type="submit"
                    className="btn ingresar-btn"
                >
                    Registrar
                </button>

            </div>

        </form>

    );

};