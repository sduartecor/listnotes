import React, { useState } from "react";
import PropTypes from "prop-types";

export const Notes = () => {
  return (
    <div className="container sizeAuto d-flex align-items-center">
      <div className="w-50 h-100 my-5 mx-auto card shadow-lg rounded">
        <div className="card-header">
          <h3 className="card-title text-center">List</h3>
        </div>
        <div className="card-body"></div>
        <div className="card-footer text-center">
          <button
            type="button"
            className="btn btn-outline-secondary border-0 w-100"
          >
            {" "}
            <i className="fa fa-archive me-2"></i>Archived
          </button>
        </div>
      </div>
    </div>
  );
};

Notes.propTypes = {
  match: PropTypes.object,
};
