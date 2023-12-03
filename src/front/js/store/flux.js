import axios from "axios";
import Swal from "sweetalert2";

const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      message: null,
      auth: false,
      profile: {},
      notesActive: [],
      notesArchived: [],
      categoryList: [],
    },
    actions: {
      // Use getActions to call a function within a fuction
      login: async (email, password) => {
        try {
          const response = await axios.post(
            process.env.BACKEND_URL + "/api/login",
            { email: email, password: password },
            {
              headers: {
                "Access-Control-Allow-Origin": "*",
              },
            }
          );
          if (response.data.user != null) {
            setStore({
              auth: true,
              profile: response.data.user,
            });
          }
          // Guarda el token en local storage segun los datos del fetch
          console.log(response.data);
          localStorage.setItem("token", response.data.msg);
        } catch (error) {
          if (error.response.status === 404) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              confirmButtonColor: "#000000",
              text: error.response.data.msg + "... redirecting to signup...",
            });
            return error.response.data.msg;
          } else if (error.response.data.msg === "Bad email or password") {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: error.response.data.msg,
            });
            return error.response.data;
          }
        }
      },
      register: async (email, password, contact, firstname, lastname) => {
        try {
          const response = await axios.post(
            process.env.BACKEND_URL + "/api/register",
            {
              email: email,
              password: password,
              contact: contact,
              firstname: firstname,
              lastname: lastname,
            },
            {
              headers: {
                "Access-Control-Allow-Origin": "*",
              },
            }
          );

          if (response.data.msg === "New user created") {
            getActions().login(email, password);
            // Setea store para declarar al usuario como registrado
            setStore({
              auth: true,
            });
          }
          return response.data.msg;
        } catch (error) {
          // Si usuario exitste
          if (error.response.data.msg === "User exists") {
            // swal(error.response.data.msg);
            return error.response.data.msg;
          }
        }
      },
      validToken: async () => {
        let accessToken = localStorage.getItem("token");
        try {
          const response = await axios.get(
            process.env.BACKEND_URL + "/api/valid-token",
            {
              headers: {
                Authorization: "Bearer " + accessToken,
                "Access-Control-Allow-Origin": "*",
              },
            }
          );
          if (response.data.user != null) {
            setStore({
              auth: true,
              profile: response.data.user,
            });
          }

          return;
        } catch (e) {
          if (e.response.status === 402 || e.response.status === 404) {
            setStore({
              auth: false,
            });
          }
          return false;
        }
      },
      logout: () => {
        localStorage.removeItem("token");
        setStore({
          auth: false,
          profile: {},
          notesActive: [],
          notesArchived: [],
          categoryList: [],
        });
      },
      getNotesActive: async () => {
        let accessToken = localStorage.getItem("token");
        try {
          const response = await axios.get(
            process.env.BACKEND_URL + "/api/noteActive",

            {
              headers: {
                "Access-Control-Allow-Origin": "*",
                Authorization: "Bearer " + accessToken,
              },
            }
          );
          if (response.data != null) {
            setStore({
              notesActive: response.data,
            });
          }
          return;
        } catch (e) {
          return false;
        }
      },
      getNotesArchived: async () => {
        let accessToken = localStorage.getItem("token");
        try {
          const response = await axios.get(
            process.env.BACKEND_URL + "/api/noteArchived",
            {
              headers: {
                "Access-Control-Allow-Origin": "*",
                Authorization: "Bearer " + accessToken,
              },
            }
          );
          if (response.data != null) {
            setStore({
              notesArchived: response.data,
            });
          }
          return;
        } catch (e) {
          return false;
        }
      },
      createNote: async (content, user_id, archived) => {
        try {
          const response = await axios.post(
            process.env.BACKEND_URL + "/api/note",
            {
              content: content,
              user_id: user_id,
              archived: archived,
            },
            {
              headers: {
                "Access-Control-Allow-Origin": "*",
              },
            }
          );

          if (response.data.msg === "La nota fue creada con exito") {
            Swal.fire({
              icon: "success",
              title: "¡Nota creada!",
              text: "La nota se ha creado exitosamente.",
            });
          }
          return response.data.msg;
        } catch (error) {
          if (error.response.status === 400) {
            Swal.fire({
              icon: "error",
              title: "¡Algo anduvo mal!",
              text: error.response.data.msg,
            });
          }
        }
      },
      archiveNote: async (noteId) => {
        try {
          const response = await axios.put(
            `${process.env.BACKEND_URL}/api/note/${noteId}/archived`,
            {}, // Agrega las opciones directamente aquí
            {
              headers: {
                "Access-Control-Allow-Origin": "*",
              },
            }
          );

          if (response.status === 200) {
            const updatedNote = response.data; // No necesitas await response.json()
            setStore((prevStore) => ({
              ...prevStore,
              notesActive: prevStore.notesActive.map((note) =>
                note.id === updatedNote.id ? updatedNote : note
              ),
            }));

            Swal.fire({
              icon: "success",
              title: "¡Bien hecho!",
              text: "Nota archivada con éxito",
            });

            return true;
          } else {
            console.error(`Error ${response.status}: ${response.statusText}`);
            Swal.fire({
              icon: "error",
              title: "¡Algo anduvo mal!",
              text: `Error ${response.status}: ${response.statusText}`,
            });
            return false;
          }
        } catch (err) {
          console.error("Error en la solicitud:", err);
          Swal.fire({
            icon: "error",
            title: "¡Algo anduvo mal!",
            text: "Error en la solicitud",
          });
          return false;
        }
      },
      unarchiveNote: async (noteId) => {
        try {
          const response = await axios.put(
            `${process.env.BACKEND_URL}/api/note/${noteId}/unarchived`,
            {}, // Agrega las opciones directamente aquí
            {
              headers: {
                "Access-Control-Allow-Origin": "*",
              },
            }
          );

          if (response.status === 200) {
            const updatedNote = response.data; // No necesitas await response.json()
            setStore((prevStore) => ({
              ...prevStore,
              notesArchived: prevStore.notesArchived.map((note) =>
                note.id === updatedNote.id ? updatedNote : note
              ),
            }));

            Swal.fire({
              icon: "success",
              title: "¡Bien hecho!",
              text: "Nota archivada con éxito",
            });

            return true;
          } else {
            console.error(`Error ${response.status}: ${response.statusText}`);
            Swal.fire({
              icon: "error",
              title: "¡Algo anduvo mal!",
              text: `Error ${response.status}: ${response.statusText}`,
            });
            return false;
          }
        } catch (err) {
          console.error("Error en la solicitud:", err);
          Swal.fire({
            icon: "error",
            title: "¡Algo anduvo mal!",
            text: "Error en la solicitud",
          });
          return false;
        }
      },
      updateNote: async (noteId, content) => {
        try {
          const response = await axios.put(
            `${process.env.BACKEND_URL}/api/note/${noteId}`,
            {
              content,
            },
            {
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
            }
          );

          if (response.status === 200) {
            const updatedNote = response.data;
            setStore((prevStore) => ({
              ...prevStore,
              notesActive: prevStore.notesActive.map((note) =>
                note.id === updatedNote.id ? updatedNote : note
              ),
            }));

            Swal.fire({
              icon: "success",
              title: "¡Bien hecho!",
              text: "Nota actualizada con éxito",
            });

            return true;
          } else {
            console.error(`Error ${response.status}: ${response.statusText}`);
            Swal.fire({
              icon: "error",
              title: "¡Algo anduvo mal!",
              text: `Error ${response.status}: ${response.statusText}`,
            });
            return false;
          }
        } catch (err) {
          console.error("Error en la solicitud:", err);
          Swal.fire({
            icon: "error",
            title: "¡Algo anduvo mal!",
            text: "Error en la solicitud",
          });
          return false;
        }
      },
      deleteNote: async (noteId) => {
        try {
          const response = await axios.delete(
            `${process.env.BACKEND_URL}/api/note/${noteId}`,
            {
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
            }
          );

          if (response.status === 200) {
            setStore((prevStore) => ({
              ...prevStore,
              notesActive: prevStore.notesActive.filter(
                (note) => note.id !== noteId
              ),
            }));

            Swal.fire({
              icon: "success",
              title: "¡Bien hecho!",
              text: "Nota eliminada con éxito",
            });

            return true;
          } else {
            console.error(`Error ${response.status}: ${response.statusText}`);
            Swal.fire({
              icon: "error",
              title: "¡Algo anduvo mal!",
              text: `Error ${response.status}: ${response.statusText}`,
            });
            return false;
          }
        } catch (err) {
          console.error("Error en la solicitud:", err);
          Swal.fire({
            icon: "error",
            title: "¡Algo anduvo mal!",
            text: "Error en la solicitud",
          });
          return false;
        }
      },
      createCategory: async (name, user_id, color) => {
        try {
          const response = await axios.post(
            process.env.BACKEND_URL + "/api/category",
            {
              name: name,
              user_id: user_id,
              color: color,
            },
            {
              headers: {
                "Access-Control-Allow-Origin": "*",
              },
            }
          );

          if (response.data.msg === "La categoria fue creada con exito") {
            Swal.fire({
              icon: "success",
              title: "¡Categoria creada!",
              text: "La categoria se ha creado exitosamente.",
            });
          }
          return response.data.msg;
        } catch (error) {
          if (error.response.status === 400) {
            Swal.fire({
              icon: "error",
              title: "¡Algo anduvo mal!",
              text: error.response.data.msg,
            });
          }
        }
      },
      getCategory: async () => {
        let accessToken = localStorage.getItem("token");
        try {
          const response = await axios.get(
            process.env.BACKEND_URL + "/api/category",

            {
              headers: {
                "Access-Control-Allow-Origin": "*",
                Authorization: "Bearer " + accessToken,
              },
            }
          );
          if (response.data != null) {
            setStore({
              categoryList: response.data,
            });
          }
          return;
        } catch (e) {
          return false;
        }
      },
      addNoteCategory: async (note_id, category_id) => {
        let accessToken = localStorage.getItem("token");
        try {
          const response = await axios.post(
            process.env.BACKEND_URL + "/api/category/note",
            {
              note_id: note_id,
              category_id: category_id,
            },
            {
              headers: {
                "Access-Control-Allow-Origin": "*",
                Authorization: "Bearer " + accessToken,
              },
            }
          );

          if (
            response.data.msg === "Nota vinculada a la categoría exitosamente."
          ) {
            Swal.fire({
              icon: "success",
              title: "¡Categoria agregada!",
              text: "La categoria se ha asignado exitosamente.",
            });
          }
          return response.data.msg;
        } catch (error) {
          if (error.response.status === 400) {
            Swal.fire({
              icon: "error",
              title: "¡Algo anduvo mal!",
              text: error.response.data.msg,
            });
          }
        }
      },
      deleteCategory: async (categoryId) => {
        try {
          const response = await axios.delete(
            `${process.env.BACKEND_URL}/api/category/${categoryId}`,
            {
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
            }
          );

          if (response.status === 200) {
            setStore((prevStore) => ({
              ...prevStore,
              categoryList: prevStore.categoryList.filter(
                (category) => category.id !== categoryId
              ),
            }));

            Swal.fire({
              icon: "success",
              title: "¡Bien hecho!",
              text: "Categoria eliminada con éxito",
            });

            return true;
          } else {
            console.error(`Error ${response.status}: ${response.statusText}`);
            Swal.fire({
              icon: "error",
              title: "¡Algo anduvo mal!",
              text: `Error ${response.status}: ${response.statusText}`,
            });
            return false;
          }
        } catch (err) {
          console.error("Error en la solicitud:", err);
          Swal.fire({
            icon: "error",
            title: "¡Algo anduvo mal!",
            text: "Error en la solicitud",
          });
          return false;
        }
      },
      deleteNoteCategory: async (note_id, category_id) => {
        let accessToken = localStorage.getItem("token");
        try {
          const response = await axios.post(
            process.env.BACKEND_URL + "/api/category/note/remove",
            {
              note_id: note_id,
              category_id: category_id,
            },
            {
              headers: {
                "Access-Control-Allow-Origin": "*",
                Authorization: "Bearer " + accessToken,
              },
            }
          );

          if (
            response.data.msg ===
            "Nota desvinculada de la categoría exitosamente."
          ) {
            Swal.fire({
              icon: "success",
              title: "¡Categoria desvinculada!",
              text: "La categoria se ha desvinculado exitosamente.",
            });
          }
          return response.data.msg;
        } catch (error) {
          if (error.response.status === 400) {
            Swal.fire({
              icon: "error",
              title: "¡Algo anduvo mal!",
              text: error.response.data.msg,
            });
          }
        }
      },
      getNotesCategory: async (categoryId) => {
        let accessToken = localStorage.getItem("token");
        try {
          const response = await axios.get(
            `${process.env.BACKEND_URL}/api/category/note/${categoryId}`,
            {
              headers: {
                "Access-Control-Allow-Origin": "*",
                Authorization: "Bearer " + accessToken,
              },
            }
          );
          if (response.data != null) {
            // Aplicar filtro en el frontend para obtener solo las notas activas
            const activeNotes = response.data.filter((note) => !note.archived);

            setStore({
              notesActive: activeNotes,
            });
          }
          return;
        } catch (e) {
          return false;
        }
      },

      //
    },
  };
};

export default getState;
