import { API } from "@/library/api";
import MyTable from "../MyTable";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";

export default function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState([]);

  const loadSolicitudes = async () => {
    await API("solicitudes/list").then((resp) => {
      if (resp["solicitudes"]) {
        setSolicitudes(resp["solicitudes"]);
      }
    });
  };
  useEffect(() => {
    loadSolicitudes();
  }, []);

  return (
    <>
      <div className="pages">
        <h2>SOLICITUDES</h2>
        <div className="table">
          <MyTable
            data={solicitudes}
            titulos={["Email", "Nombre", "Teléfono", "Asunto", "Mensaje"]}
            campos={["email", "nombre", "telefono", "asunto", "mensaje"]}
          />
        </div>
      </div>
    </>
  );
}
