import React, { useState, useContext, useEffect, useRef } from "react";
import { Context } from "../store/appContext";
import PropTypes from "prop-types";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Modal, Button } from "react-bootstrap";

export const Notes = () => {
  const { store, actions } = useContext(Context);
  const [creatingNote, setCreatingNote] = useState(false);
  const isComponentMounted = useRef(true); // Ref para verificar si el componente está montado
  const [showModal, setShowModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

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

  const handleNoteClick = (note) => {
    setSelectedNote(note);
    setShowModal(true); // Muestra el modal al hacer clic en una nota
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (values) => {
    try {
      // Realiza la lógica asíncrona aquí (por ejemplo, fetch)
      await actions.createNote(values.content, store.profile.id, false);
      actions.getNotesActive();
      // Verifica si el componente está montado antes de realizar la actualización de estado
      if (isComponentMounted.current) {
        setCreatingNote(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleArchiveNote = (note) => {
    // Llama a la función para archivar la nota
    actions.archiveNote(note.id);
    setShowModal(false);
    actions.getNotesActive();

    // Puedes agregar lógica adicional después de archivar la nota si es necesario
  };

  const lostSchema = Yup.object().shape({
    content: Yup.string().required("Please enter some content for the note."),
  });

  return (
    <div className="container sizeAuto d-flex align-items-center">
      <div className="w-50 h-100 my-5 mx-auto card shadow-lg rounded">
        <div className="card-header">
          <h3 className="card-title text-center">List</h3>
        </div>
        <div className="card-body">
          <div className="card-body">
            {Array.isArray(store.notesActive) &&
            store.notesActive.length > 0 ? (
              store.notesActive.map((item, id) => (
                <li
                  key={id}
                  className="list-group-item d-flex justify-content-between align-items-center rounded my-2 border border-black"
                  onClick={() => handleNoteClick(item)}
                  style={{ cursor: "pointer" }}
                >
                  <pre className="fs-5 mb-0">{item.content}</pre>
                </li>
              ))
            ) : (
              <p className="text-center">No hay notas disponibles</p>
            )}
          </div>
        </div>
        {/*  */}
        <div className="card-footer text-center">
          {creatingNote ? (
            // Contenido para la creación de la nota
            <div className="mb-3">
              <Formik
                initialValues={{
                  content: "",
                }}
                validationSchema={lostSchema}
                onSubmit={(values, { resetForm }) => {
                  handleSubmit(values);
                  resetForm();
                }}
              >
                {({ errors, touched, values }) => (
                  <Form>
                    <Field
                      as="textarea"
                      className={`form-control ${
                        errors.content && touched.content ? "is-invalid" : ""
                      }`}
                      id="content"
                      name="content"
                      rows="2"
                    />
                    <ErrorMessage
                      name="content"
                      component="div"
                      className="invalid-feedback"
                    />
                    <div className="mb-3 d-flex ">
                      <button
                        type="submit"
                        className="btn btn-success border-0 w-75 me-1 mt-2" // Ajusta el ancho según tus necesidades
                      >
                        Send
                      </button>
                      <button
                        type="submit"
                        onClick={handleCancelNote}
                        className="btn btn-danger border-0 w-75 ms-1 mt-2" // Ajusta el ancho según tus necesidades
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
              Create Note
            </button>
          )}
        </div>
      </div>
      {/* Modal para editar o eliminar la nota */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Contenido del modal para editar la nota */}
          <Formik
            initialValues={{
              content: selectedNote ? selectedNote.content : "",
            }}
            validationSchema={lostSchema}
            onSubmit={(values, { resetForm }) => {
              // Lógica para guardar la nota editada
              // Puedes llamar a tu función de edición aquí
              // actions.editNote(selectedNote.id, values.content);
              resetForm();
              setShowModal(false);
            }}
          >
            {({ errors, touched, values }) => (
              <Form>
                <Field
                  as="textarea"
                  className={`form-control ${
                    errors.content && touched.content ? "is-invalid" : ""
                  }`}
                  id="content"
                  name="content"
                  rows="4"
                />
                <ErrorMessage
                  name="content"
                  component="div"
                  className="invalid-feedback"
                />
                <div className="my-2 d-flex">
                  <Button type="submit" variant="primary" className="me-2">
                    Update
                  </Button>
                  <Button
                    type="submit"
                    variant="warning"
                    className="me-2"
                    onClick={() => handleArchiveNote(selectedNote)}
                  >
                    Archive
                  </Button>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Cancel
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
};

Notes.propTypes = {
  match: PropTypes.object,
};
