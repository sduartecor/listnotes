const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      message: null,
    },
    actions: {
      // Use getActions to call a function within a fuction
      exampleFunction: () => {
        getActions().changeColor(0, "green");
      },

      //
    },
  };
};

export default getState;
