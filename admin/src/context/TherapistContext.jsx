import React from "react";
import { createContext } from "react";

export const TherepistContext = createContext();

const TherapistContextProvider = (props) => {
  const value = {};

  return (
    <TherepistContext.Provider value={value}>
      {props.children}
    </TherepistContext.Provider>
  );
};

export default TherapistContextProvider;
