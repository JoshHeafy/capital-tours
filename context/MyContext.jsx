"use client";
import { createContext, useState } from "react";

export const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
  const [openModal, setOpenModal] = useState(false);
  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);
  const [apiProp, setApiProp] = useState("");

  return (
    <MyContext.Provider
      value={{
        openModal,
        setOpenModal,
        openModal1,
        setOpenModal1,
        apiProp,
        setApiProp,
        openModal2,
        setOpenModal2,
        openModal3,
        setOpenModal3,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
