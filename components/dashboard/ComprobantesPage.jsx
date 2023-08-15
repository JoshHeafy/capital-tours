import { API } from "@/library/api";
import { MyContext } from "@/context/MyContext";
import { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ComprobantesPage() {
  const { openModal1, setOpenModal1 } = useContext(MyContext);
  const [propietarios, setPropietarios] = useState([]);
  const [comprobantes, setComprobantes] = useState([]);

  const getPropietarios = async () => {
    await API("propietarios/list").then((res) => {
      if (res["propietarios"]) {
        setPropietarios(res["propietarios"]);
      }
    });
  };

  const getComprobante = async (nDocu) => {
    await API(`comprobantes/info/${nDocu}`).then((res) => {
      if (res["comprobantes-info"]) {
        setComprobantes(res["comprobantes-info"]);
      } else {
        toast.warning(res.msg);
        setOpenModal1(false);
      }
    });
  };

  useEffect(() => {
    getPropietarios();
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="pages comprobantes">
        <h2>COMPROBANTES</h2>
      </div>
    </>
  );
}
