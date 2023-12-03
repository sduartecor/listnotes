import React, { useState, useContext, useEffect, useRef } from "react";
import { Context } from "../store/appContext";
import PropTypes from "prop-types";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Modal, Button } from "react-bootstrap";

export const Category = () => {
  const { store, actions } = useContext(Context);
  const [creatingNote, setCreatingNote] = useState(false);
  const isComponentMounted = useRef(true); // Ref para verificar si el componente está montado
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    return () => {
      // Componente desmontado, actualiza la referencia de montaje
      isComponentMounted.current = false;
    };
  }, []);

  const handleCreateNoteClick = () => {
    setCreatingNote(true);
  };

  const handleCancelNote = () => {
    // Lógica para cancelar la creación de la nota
    setCreatingNote(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (values) => {
    try {
      // Realiza la lógica asíncrona aquí (por ejemplo, fetch)
      await actions.createCategory(
        values.title,
        store.profile.id,
        values.color
      );
      actions.getCategory();
      // Verifica si el componente está montado antes de realizar la actualización de estado
      if (isComponentMounted.current) {
        setCreatingNote(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      // Realiza la lógica asíncrona aquí para eliminar la nota
      await actions.deleteCategory(categoryId);
      actions.getCategory();
    } catch (error) {
      console.error(error);
    }
  };

  const lostSchema = Yup.object().shape({
    title: Yup.string().required("Please enter some title for the category."),
  });

  return (
    <div className="container sizeAuto d-flex align-items-center">
      <div className="w-50 h-100 my-5 mx-auto card shadow-lg rounded">
        <div className="card-body scrollBar">
          {Array.isArray(store.categoryList) &&
          store.categoryList.length > 0 ? (
            store.categoryList.map((item, id) => (
              <li
                key={id}
                className="list-group-item d-flex justify-content-between align-items-center rounded my-2 "
                style={{
                  border: `2px solid ${item.color}`,
                }}
              >
                <pre className="fs-5 mb-0">{item.name}</pre>
                <button
                  type="button"
                  className="btn-close border-0 float-end"
                  onClick={() => handleDeleteCategory(item.id)}
                ></button>
              </li>
            ))
          ) : (
            <p className="text-center">No hay categorias disponibles</p>
          )}
        </div>
        {/*  */}
        <div className="card-footer text-center">
          {creatingNote ? (
            // Contenido para la creación de la nota
            <div className="mb-3">
              <Formik
                initialValues={{
                  title: "",
                  color: "#000000",
                }}
                validationSchema={lostSchema}
                onSubmit={(values, { resetForm }) => {
                  handleSubmit(values);
                  resetForm();
                }}
              >
                {({ errors, touched, values }) => (
                  <Form>
                    <div className="mb-3 d-flex">
                      {/* Agrega el input para el título */}
                      <div
                        className="mb-3 me-3 text-start"
                        style={{
                          flex: "6",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <label htmlFor="title" className="form-label">
                          Title
                        </label>
                        <Field
                          type="text"
                          className={`form-control ${
                            errors.title && touched.title ? "is-invalid" : ""
                          }`}
                          id="title"
                          name="title"
                        />
                        <ErrorMessage
                          name="title"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>

                      {/* Agrega el input para el color */}
                      <div
                        className="my-1 text-center  "
                        style={{
                          flex: "1",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <label htmlFor="color" className="form-label">
                          Color
                        </label>
                        <Field
                          type="color"
                          className={`form-control ${
                            errors.color && touched.color ? "is-invalid" : ""
                          }`}
                          id="color"
                          name="color"
                        />
                        <ErrorMessage
                          name="color"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>

                    <div className="mb-3 d-flex ">
                      <button
                        type="submit"
                        className="btn btn-success border-0 w-75 me-1 mt-2"
                      >
                        Send
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelNote}
                        className="btn btn-danger border-0 w-75 ms-1 mt-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-primary border-0 w-100"
              onClick={handleCreateNoteClick}
            >
              Create Category
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

Category.propTypes = {
  match: PropTypes.object,
};
