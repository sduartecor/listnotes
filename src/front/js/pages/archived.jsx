import React, { useState, useContext, useEffect, useRef } from "react";
import { Context } from "../store/appContext";
import PropTypes from "prop-types";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Modal, Button } from "react-bootstrap";

export const Archived = () => {
  const { store, actions } = useContext(Context);
  const isComponentMounted = useRef(true); // Ref para verificar si el componente está montado
  const [showModal, setShowModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    return () => {
      // Componente desmontado, actualiza la referencia de montaje
      isComponentMounted.current = false;
    };
  }, []);

  const handleNoteClick = (note) => {
    setSelectedNote(note);
    setShowModal(true); // Muestra el modal al hacer clic en una nota
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleArchiveNote = async (note) => {
    try {
      // Llama a la función para archivar la nota
      await actions.unarchiveNote(note.id);
      setShowModal(false);
      actions.getNotesArchived();
      actions.getNotesActive();
    } catch (error) {
      console.error(error);
    }
    // Puedes agregar lógica adicional después de archivar la nota si es necesario
  };

  const handleDeleteNote = async (noteId) => {
    try {
      // Realiza la lógica asíncrona aquí para eliminar la nota
      await actions.deleteNote(noteId);
      actions.getNotesArchived();
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const addNoteCategory = async (note_id, category_id) => {
    try {
      await actions.addNoteCategory(note_id, category_id);
      actions.getNotesArchived();
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveCategory = async (noteId, categoryId) => {
    try {
      await actions.deleteNoteCategory(noteId, categoryId);
      setShowModal(false);
      actions.getNotesArchived();
    } catch (error) {
      console.error(error);
    }
  };

  const lostSchema = Yup.object().shape({
    content: Yup.string().required("Please enter some content for the note."),
  });

  return (
    <div className="container sizeAuto d-flex align-items-center">
      <div className="w-50 h-100 my-5 mx-auto card shadow-lg rounded">
        <div className="card-body scrollBar">
          {Array.isArray(store.notesArchived) &&
          store.notesArchived.length > 0 ? (
            store.notesArchived.map((item, id) => (
              <li
                key={id}
                className="list-group-item d-flex justify-content-between align-items-center rounded my-2 border border-black"
                onClick={() => handleNoteClick(item)}
                style={{ cursor: "pointer", position: "relative" }}
              >
                <pre className="fs-5 mb-0">{item.content}</pre>

                {/*  */}
                {item.categories && item.categories.length > 0 && (
                  <div
                    className="category-circles"
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "-1px",
                      transform: "translateY(-50%)",
                      display: "flex",
                    }}
                  >
                    {item.categories.map((category, index) => (
                      <div
                        key={index}
                        className="circle"
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          backgroundColor: category.color,
                          marginRight: "5px",
                        }}
                        onClick={() =>
                          handleRemoveCategory(item.id, category.id)
                        }
                      ></div>
                    ))}
                  </div>
                )}
                {/*  */}
              </li>
            ))
          ) : (
            <p className="text-center">No hay notas disponibles</p>
          )}
        </div>
        {/*  */}
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
            onSubmit={async (values, { resetForm }) => {
              try {
                // Realiza la lógica asíncrona aquí (por ejemplo, fetch)
                await actions.updateNote(selectedNote.id, values.content);
                actions.getNotesArchived();
                setShowModal(false);
              } catch (error) {
                console.error(error);
              }
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
                  rows="4"
                />
                <ErrorMessage
                  name="content"
                  component="div"
                  className="invalid-feedback"
                />
                <div className="my-2 d-flex justify-content-center">
                  <Button type="submit" variant="primary" className="me-2">
                    Update
                  </Button>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => handleArchiveNote(selectedNote)}
                  >
                    Unarchive
                  </Button>
                  <Button
                    variant="danger"
                    className="me-2"
                    onClick={() => handleDeleteNote(selectedNote.id)}
                  >
                    Delete
                  </Button>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Cancel
                  </Button>
                </div>

                {/* Dentro del modal, donde se muestran las categorías */}
                <div>
                  {Array.isArray(store.categoryList) &&
                  store.categoryList.length > 0 ? (
                    store.categoryList
                      .filter((category) => {
                        console.log(
                          "selectedNote.categories:",
                          selectedNote.categories
                        );
                        console.log("category:", category);

                        const isCategoryAlreadyAdded =
                          selectedNote.categories &&
                          selectedNote.categories.some(
                            (noteCategory) => noteCategory.id === category.id
                          );

                        console.log(
                          "isCategoryAlreadyAdded:",
                          isCategoryAlreadyAdded
                        );

                        return !isCategoryAlreadyAdded;
                      })
                      .map((category, id) => (
                        <li
                          key={id}
                          className="list-group-item d-flex justify-content-between align-items-center rounded my-2"
                          style={{
                            border: `2px solid ${category.color}`,
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            addNoteCategory(selectedNote.id, category.id);
                            console.log("Adding category to note:", category);
                          }}
                        >
                          <pre className="fs-5 mb-0">{category.name}</pre>
                        </li>
                      ))
                  ) : (
                    <p className="text-center">No hay categorías disponibles</p>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
};

Archived.propTypes = {
  match: PropTypes.object,
};
