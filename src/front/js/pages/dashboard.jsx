import React, { useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { Notes } from "../pages/notes.jsx";
import { Archived } from "../pages/archived.jsx";
import { Category } from "../pages/category.jsx";
import { Navigate } from "react-router-dom";

export const Dashboard = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    // Llama a las funciones para obtener las notas cuando el componente se monta
    actions.getNotesActive();
    actions.getNotesArchived();
    actions.getCategory();
  }, []);

  return (
    <div className="container-fluid">
      {store.auth === false ? <Navigate to="/" /> : null}{" "}
      <ul
        className="nav nav-tabs d-flex justify-content-center"
        id="myTab"
        role="tablist"
      >
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active text-center"
            id="home-tab"
            data-bs-toggle="tab"
            data-bs-target="#home-tab-pane"
            type="button"
            role="tab"
            aria-controls="home-tab-pane"
            aria-selected="true"
          >
            <i className="fa fa-plus me-1"></i> Actives
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="profile-tab"
            data-bs-toggle="tab"
            data-bs-target="#profile-tab-pane"
            type="button"
            role="tab"
            aria-controls="profile-tab-pane"
            aria-selected="false"
          >
            <i className="fa fa-archive me-1"></i> Archived
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="contact-tab"
            data-bs-toggle="tab"
            data-bs-target="#contact-tab-pane"
            type="button"
            role="tab"
            aria-controls="contact-tab-pane"
            aria-selected="false"
          >
            <i className="fa fa-tags me-1"></i> Category
          </button>
        </li>
      </ul>
      <div className="tab-content" id="myTabContent">
        <div
          className="tab-pane fade show active"
          id="home-tab-pane"
          role="tabpanel"
          aria-labelledby="home-tab"
          tabIndex={0}
        >
          <Notes />
        </div>
        <div
          className="tab-pane fade"
          id="profile-tab-pane"
          role="tabpanel"
          aria-labelledby="profile-tab"
          tabIndex={0}
        >
          <Archived />
        </div>
        <div
          className="tab-pane fade"
          id="contact-tab-pane"
          role="tabpanel"
          aria-labelledby="contact-tab"
          tabIndex={0}
        >
          <Category />
        </div>
      </div>
    </div>
  );
};
