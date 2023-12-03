import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const Home = () => {
  const { store, actions } = useContext(Context);

  return (
    <div className="container mt-5 text-center">
      <div className="row d-flex justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 border-0">
            <h2 className="text-center mb-4">Welcome to Note Page</h2>
            <p className="text-justify">
              This is a simple note-taking application where you can organize
              and manage your notes efficiently. Get started by creating your
              first note and categorize them for better organization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
