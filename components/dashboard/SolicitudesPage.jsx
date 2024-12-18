import { API } from "@/library/api";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import MyButtonIcon from "../buttons/MyButtonIcon";
import { ToastContainer, toast } from "react-toastify";
import MyButton from "../buttons/MyButton";

export default function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [verTodo, setVerTodo] = useState(true);
  const [verTodoText, setVerTodoText] = useState("VER LEIDOS");
  const [leido, setLeido] = useState(0);
  const [maxList, setMaxList] = useState(10);

  const loadSolicitudes = async () => {
    await API("solicitudes/list").then((resp) => {
      if (resp["solicitudes"]) {
        setSolicitudes(resp["solicitudes"]);
      }
    });
  };

  const markAsRead = async (id_solicitud) => {
    await API(`solicitudes/mark-as-read/${id_solicitud}`, {
      method: "POST",
    }).then((resp) => {
      if (resp["leido"]) {
        loadSolicitudes();
        toast.success("Solicitud marcada como leída");
      }
    });
  };

  useEffect(() => {
    loadSolicitudes();
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="pages solicitudes">
        <h2>COMENTARIOS Y CONSULTAS</h2>
        <div className="toggle_all">
          <MyButton
            name={verTodoText}
            onClick={() => {
              setVerTodo(!verTodo);
              if (!verTodo) {
                setVerTodoText("VER LEIDOS");
                setLeido(0);
              } else {
                setLeido(1);
                setVerTodoText("VER TODO");
              }
            }}
          />
        </div>
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
              {solicitudes.map((solicitud, i) => {
                if (i < maxList) {
                  if (solicitud.leido == leido) {
                    return (
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
                        {leido == 0 && (
                          <td
                            className="warning editable"
                            onClick={() => {
                              markAsRead(solicitud.id_solicitud);
                            }}
                          >
                            Marcar como leído
                          </td>
                        )}
                      </tr>
                    );
                  }
                }
              })}
            </tbody>
          </table>
          {solicitudes.length > maxList && (
            <a
              className="editable success"
              onClick={() => setMaxList(maxList + 10)}
            >
              Ver Más
            </a>
          )}
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
