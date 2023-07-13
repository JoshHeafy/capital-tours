import { API } from "@/library/api";
import { MyContext } from "@/context/MyContext";
import { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ComprobantesPage() {
  const { openModalDetail, setOpenModalDetail } = useContext(MyContext);
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
        setOpenModalDetail(false);
      }
    });
  };

  useEffect(() => {
    getPropietarios();
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="pages">
        <h2>COMPROBANTES</h2>
        <div className="table">
          <table className="my_table">
            <thead className="head_table">
              <tr>
                <th>Nombre</th>
                <th>N° doc</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="body_table">
              {propietarios.map((prop, index) => (
                <tr key={index}>
                  <td>{prop["nombre_propietario"]}</td>
                  <td>{prop["numero_documento"]}</td>
                  <td
                    className="success editable"
                    onClick={() => {
                      setOpenModalDetail(true);
                      getComprobante(prop["numero_documento"]);
                    }}
                  >
                    Ver Detalle
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {openModalDetail && (
            <>
              <hr className="divider" />
              <table className="my_table">
                <thead className="head_table">
                  <tr>
                    <th>N° Docu</th>
                    <th>N° Serie</th>
                    <th>Desc.</th>
                    <th>IGV</th>
                    <th>Total</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody className="body_table">
                  {comprobantes.map((prop, index) => (
                    <tr key={index}>
                      <td>{prop["numero_documento"]}</td>
                      <td>{prop["numero_serie"]}</td>
                      <td>{prop["descuento"]}</td>
                      <td>{prop["igv"]}</td>
                      <td>{prop["total"]}</td>
                      <td>
                        <span
                          className="color-table"
                          style={{
                            background:
                              prop["estado"] === 0
                                ? "#ff7782"
                                : prop["estado"] === 1 && "#41f1b6",
                          }}
                        ></span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </>
  );
}
