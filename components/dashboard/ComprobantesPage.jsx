import { API } from "@/library/api";
import { MyContext } from "@/context/MyContext";
import { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyInput from "../Inputs/MyInput";
import { numeroMesANombreMes, toCapitalice } from "@/library/functions";

export default function ComprobantesPage() {
  const { openModal1, setOpenModal1 } = useContext(MyContext);
  const [filterValue, setFilterValue] = useState("");
  const [filterResult, setFilterResult] = useState("");
  const [propietarios, setPropietarios] = useState([]);
  const [numeroDocumento, setNumeroDocumento] = useState("");

  const [comprobantes, setComprobantes] = useState([]);
  const [comprobanteDetail, setComprobanteDetail] = useState({});
  const [idComprobante, setIdComprobante] = useState("");

  const getComprobanteDetail = async () => {
    await API(`comprobantes/info-detail/${idComprobante}`).then((res) => {
      if (res["comprobante_detail"]) {
        setComprobanteDetail(res.comprobante_detail);
      }
    });
  };

  const filterPropietarios = async (value) => {
    await API(`propietarios/filter/${value}`).then((res) => {
      if (res["propietarios"]) {
        setPropietarios(res["propietarios"]);
      }
    });
  };

  const getComprobantes = async () => {
    await API(`comprobantes/info/${numeroDocumento}`).then((res) => {
      if (res["comprobantes_info"]) {
        setComprobantes(res["comprobantes_info"]);
      } else {
        toast.warning(res.msg);
        setOpenModal1(false);
      }
    });
  };

  useEffect(() => {
    if (numeroDocumento !== "") {
      getComprobantes();
    }
  }, [numeroDocumento]);

  useEffect(() => {
    if (idComprobante !== "") {
      getComprobanteDetail();
    }
  }, [idComprobante]);

  return (
    <>
      <ToastContainer />
      <div className="pages comprobantes">
        <h2>COMPROBANTES</h2>
        <div className="table">
          <div className="filtro">
            <h5>Buscar propietario:</h5>
            <div className="autocomplete">
              <MyInput
                title="Nombre o N° Documento"
                value={filterValue}
                required={true}
                onChange={(e) => {
                  if (e.target.value.length > 3) {
                    filterPropietarios(e.target.value);
                  } else {
                    setPropietarios([]);
                  }
                  setFilterValue(e.target.value);
                }}
              />
              {propietarios.length > 0 && (
                <ul className="list_autocomplete">
                  {propietarios.map((propietario, i) => (
                    <li
                      key={i}
                      className="autocomplete_items"
                      onClick={() => {
                        setFilterResult(
                          toCapitalice(propietario.nombre_propietario)
                        );
                        setNumeroDocumento(propietario.numero_documento);
                        setPropietarios([]);
                        setFilterValue("");
                        setIdComprobante("");
                      }}
                    >
                      {toCapitalice(propietario["nombre_propietario"])}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <MyInput
              id="filter_result"
              value={filterResult}
              placeholder="Propietario"
              disabled={true}
            />
          </div>
          {comprobantes.length > 0 && (
            <table className="my_table">
              <thead className="head_table">
                <tr>
                  <th>N° Comprobante</th>
                  <th>N° Doc</th>
                  <th>Tipo</th>
                  <th>Fecha Pago</th>
                  <th />
                </tr>
              </thead>
              <tbody className="body_table">
                {comprobantes.map((comp, i) => (
                  <tr key={i}>
                    <td>{`${comp.numero_serie}-${comp.numero_comprobante}`}</td>
                    <td>{comp.numero_documento}</td>
                    <td>{comp.tipo == "03" && "Boleta"}</td>
                    <td>{comp.fecha_pago}</td>
                    <td
                      className="success editable"
                      onClick={() => {
                        setIdComprobante(comp.id_comprobante_pago);
                      }}
                    >
                      Ver detalle
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {idComprobante != "" && (
          <div className="message_container">
            <div className="my_card">
              <h5>{` PERIODO: ${numeroMesANombreMes(
                comprobanteDetail.months
              )} ${comprobanteDetail.years}`}</h5>
              <div className="item_card">
                <h5>Importe:</h5>
                <span className="green">S/. {comprobanteDetail.importe}</span>
              </div>
              <div className="item_card">
                <h5>IGV:</h5>
                <span className="green">S/. {comprobanteDetail.igv}</span>
              </div>
              <div className="item_card">
                <h5>Descuento:</h5>
                <span className="green">S/. {comprobanteDetail.descuento}</span>
              </div>
              <div className="item_card">
                <h5>Total:</h5>
                <span className="green">S/. {comprobanteDetail.total}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
