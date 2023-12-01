import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext.js";
import { Link, useLocation, useNavigate } from "react-router-dom";

export const Navbar = () => {
  const { store, actions } = useContext(Context);
  const location = useLocation();
  let navigate = useNavigate();

  function handleLogout() {
    actions.logout(); // cerrar la sesion
    navigate("/"); // usamos navigate para redireccionar
  }

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="navbar-brand mb-0 h1 text-dark fs-2">
            Notes
            <i className="fa fa-sticky-note mx-2"></i>
          </span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a
                className="nav-link active text-dark"
                aria-current="page"
                href="#"
              >
                Home
              </a>
            </li>
          </ul>
          <form className="d-flex">
            {store.auth === false && !location.pathname.includes("/login") ? (
              <Link to="/login">
                <button
                  type="button"
                  className="btn btn-outline-dark mx-3 btn-lg shadow-sm"
                >
                  <i className="fa fa-sign-in-alt mx-2"></i>
                  Log in
                </button>
              </Link>
            ) : null}
            {store.auth === false &&
            !location.pathname.includes("/register") ? (
              <Link to="/register">
                <button type="button" className="btn btn-dark btn-lg shadow-sm">
                  <i className="fa fa-user-plus mx-2"></i>
                  Sign up
                </button>
              </Link>
            ) : null}

            {/*  */}

            {store.auth === true ? (
              <li className="nav-item d-none d-lg-block d-xl-block">
                <div className="dropdown d-flex float-end ms-3">
                  <button
                    className="btn btn-outline-dark btn-lg dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fa fa-user mx-2"></i>
                    {store.profile.firstname}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <Link to={"/profile"}>
                      <button className="dropdown-item float-start">
                        Mi perfil
                      </button>
                    </Link>
                    <button
                      className="dropdown-item float-start text-danger"
                      onClick={handleLogout}
                    >
                      Cerrar sesión
                    </button>
                  </ul>
                </div>
              </li>
            ) : null}
          </form>
        </div>
      </div>
    </nav>
  );
};
