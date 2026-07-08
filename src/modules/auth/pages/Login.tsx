import React from "react";
import { LoginForm } from "../components/LoginForm";
import "../../../assets/styles/login.css";

import loginImage from "../../../assets/images/login-image.jpg";
import phone from "../../../assets/images/phone.png";

export const Login: React.FC = () => {
  return (
    <div className="login-page">

      <div className="login-card">

        {/* LADO IZQUIERDO */}

        <div className="login-left">

          <img
            src={loginImage}
            alt="login"
            className="login-image"
          />

        </div>

        {/* LADO DERECHO */}

        <div className="login-right">

          <div className="brand">

            <img
              src={phone}
              alt="phone"
              className="brand-phone"
            />

            <div>

              <h2>Vizcash</h2>

              <span>Nacional</span>

            </div>

          </div>

          <h3 className="login-title">
            Inicia sesión
          </h3>

          <LoginForm />

        </div>

      </div>

    </div>
  );
};