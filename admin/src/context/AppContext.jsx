import React from "react";
import { createContext } from "react";
import { useState } from "react";

export const AppContext = createContext();

const AppProvider = (props) => {
  const value = {};

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppProvider;
