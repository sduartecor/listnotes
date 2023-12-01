import React from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const Navbar = () => {
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
            <button
              type="button"
              className="btn btn-outline-dark mx-3 btn-lg shadow-sm"
            >
              <i className="fa fa-sign-in-alt mx-2"></i>
              Log In
            </button>
            <button type="button" className="btn btn-dark btn-lg shadow-sm">
              <i className="fa fa-user-plus mx-2"></i>
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};
