"use client";
import { createContext, useState } from "react";

export const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
  const [openModalDetail, setOpenModalDetail] = useState(false);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [apiProp, setApiProp] = useState("");

  return (
    <MyContext.Provider
      value={{
        openModalDetail,
        setOpenModalDetail,
        apiProp,
        setApiProp,
        openModalCreate,
        setOpenModalCreate,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
