import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { Navigate, useNavigate } from "react-router-dom";
import "../../styles/home.css";
import PropTypes from "prop-types";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export const Login = () => {
  const { store, actions } = useContext(Context);
  let navigate = useNavigate();

  const LoginSchema = Yup.object().shape({
    email: Yup.string("Enter your email")
      .email("Enter a valid email")
      .required("Email required"),
    password: Yup.string("Enter your password")
      .min(2, "Password should be of minimum 8 characters length")
      .max(50, "Too Long!")
      .required("Password required"),
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container sizeAuto d-flex align-items-center">
      <div className="w-50 h-100 my-5 mx-auto card shadow-lg rounded">
        <div className="card-header">
          <h3 className="card-title text-center">Log in</h3>
        </div>
        <div className="card-body">
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={async (values) => {
              // Esto se guarda en una variable para atrapar lo que la funcion de flux tira
              let onLogged = await actions.login(values.email, values.password);
              // Condiciones segun la respuesta de flux
              if (onLogged === "User doesn't exist") {
                navigate("/register");
              } else if (onLogged === "Bad email or password") {
                navigate("/login");
              } else {
                navigate("/");
              }
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="form-group my-2">
                  <label htmlFor="email" className="mb-1">
                    Correo electrónico:
                  </label>
                  <Field
                    type="email"
                    name="email"
                    className={`form-control ${
                      errors.email && touched.email ? "is-invalid" : ""
                    }`}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>

                <div className="form-group my-2">
                  <label htmlFor="password" className="mb-1">
                    Contraseña:
                  </label>
                  <Field
                    type="password"
                    name="password"
                    className={`form-control ${
                      errors.password && touched.password ? "is-invalid" : ""
                    }`}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary w-75 fw-bolder btn-lg text-white mt-3"
                  >
                    Continuar
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <div className="card-footer text-center">
          <button
            type="button"
            className="btn btn-outline-secondary border-0 w-100"
          >
            {" "}
            <i className="fa fa-unlock-alt me-2"></i>Recuperar contraseña
          </button>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  match: PropTypes.object,
};
