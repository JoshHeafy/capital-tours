import { API } from "@/library/api";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import MyButtonIcon from "../buttons/MyButtonIcon";

export default function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [mensaje, setMensaje] = useState("");

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
      <div className="pages solicitudes">
        <h2>SOLICITUDES</h2>
        <div className="table">
          <table className="my_table">
            <thead className="head_table">
              <tr>
                <th>N°</th>
                <th>Email</th>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Asunto</th>
                <th />
                <th />
              </tr>
            </thead>
            <tbody className="body_table">
              {solicitudes.map((solicitud, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{solicitud.email}</td>
                  <td>{solicitud.nombre}</td>
                  <td>{solicitud.telefono}</td>
                  <td>{solicitud.asunto}</td>
                  <td
                    className="success editable"
                    onClick={() => setMensaje(solicitud.mensaje)}
                  >
                    Ver Mensaje
                  </td>
                  <td className="danger editable">Eliminar</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {mensaje !== "" && (
          <div className="message_container">
            <div className="my_card">
              <a>{mensaje}</a>
              <MyButtonIcon
                icon="bx bx-x-circle"
                type="button"
                name="Cerrar"
                onClick={() => setMensaje("")}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
