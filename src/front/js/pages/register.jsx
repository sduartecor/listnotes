import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { Navigate, useNavigate } from "react-router-dom";
import "../../styles/home.css";
import PropTypes from "prop-types";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { phone } from "yup-phone";

export const Register = () => {
  const { store, actions } = useContext(Context);
  let navigate = useNavigate();

  const SignupSchema = Yup.object().shape({
    firstname: Yup.string().required("Required"),
    lastname: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
    contact: Yup.string().required("El número de teléfono es requerido"),
  });

  return (
    <div className="container sizeAuto d-flex align-items-center">
      <div className="w-50 h-100 my-5 mx-auto card shadow-lg rounded">
        <div className="card-header">
          <h3 className="card-title text-center">Sign up</h3>
        </div>
        <div className="card-body">
          <Formik
            initialValues={{
              email: "",
              password: "",
              contact: "",
              firstname: "",
              lastname: "",
            }}
            validationSchema={SignupSchema}
            onSubmit={async (values) => {
              let onSignUp = await actions.register(
                values.email,
                values.password,
                values.contact,
                values.firstname,
                values.lastname
              );
              if (onSignUp === "User exists") {
                Swal.fire({
                  text: "User email already exists, redirecting to login",
                  confirmButtonColor: "#000000",
                });
                navigate("/login");
              } else if (onSignUp === "New user created") {
                navigate("/");
              }
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="form-group my-2 row">
                  <div className="col-6">
                    <label htmlFor="firstname" className="mb-1">
                      Firstname:
                    </label>
                    <Field
                      type="firstname"
                      name="firstname"
                      className={`form-control ${
                        errors.firstname && touched.firstname
                          ? "is-invalid"
                          : ""
                      }`}
                    />
                    <ErrorMessage
                      name="firstname"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>

                  <div className="col-6">
                    <label htmlFor="lastname" className="mb-1">
                      Lastname:
                    </label>
                    <Field
                      type="lastname"
                      name="lastname"
                      className={`form-control ${
                        errors.lastname && touched.lastname ? "is-invalid" : ""
                      }`}
                    />
                    <ErrorMessage
                      name="lastname"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                </div>

                <div className="form-group my-2">
                  <label htmlFor="email" className="mb-1">
                    E-mail:
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
                    Password:
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

                <div className="form-group my-2">
                  <label htmlFor="contact" className="mb-1">
                    Contact:
                  </label>
                  <Field
                    type="contact"
                    name="contact"
                    className={`form-control ${
                      errors.contact && touched.contact ? "is-invalid" : ""
                    }`}
                  />
                  <ErrorMessage
                    name="contact"
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
      </div>
    </div>
  );
};

Register.propTypes = {
  match: PropTypes.object,
};
