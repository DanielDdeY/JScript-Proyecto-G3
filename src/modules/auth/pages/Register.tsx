import React from "react";
import { RegisterForm } from "../components/RegisterForm";
import "../../../assets/styles/register.css";

import loginImage from "../../../assets/images/login-image.jpg";
import phone from "../../../assets/images/phone.png";
import { Link } from "react-router-dom";

export const Register: React.FC = () => {

    return (

        <div className="login-page">

            <div className="login-card">

                <div className="login-left">

                    <img
                        src={loginImage}
                        alt="Registro"
                        className="login-image"
                    />

                </div>

                <div className="login-right">

                    <Link to="/login" className="back-button">
                        ←
                    </Link>

                    <div className="brand">

                        <img
                            src={phone}
                            alt="phone"
                            className="brand-phone"
                        />

                        <div>

                            <h2>VizCash</h2>

                            <span>Nacional</span>

                        </div>

                    </div>

                    <h3 className="login-title">
                        Regístrate
                    </h3>

                    <RegisterForm />

                </div>

            </div>

        </div>

    );

};