import { useContext, useEffect, useState } from "react";
import MyInput from "../Inputs/MyInput";
import { API } from "@/library/api";
import { numeroMesANombreMes, toCapitalice } from "@/library/functions";
import MyInputNumber from "../Inputs/MyInputNumber";
import MyButton from "../buttons/MyButton";
import { MyContext } from "@/context/MyContext";
import WindowScreen from "../Window";
import MySelect from "../select/MySelect";
import { ToastContainer, toast } from "react-toastify";

export default function PagosPage() {
  const [idSubs, setIdSubs] = useState("");
  const [loadButton, setLoadButton] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [filterResult, setFilterResult] = useState("");
  const [propietarios, setPropietarios] = useState([]);
  const [suscripciones, setSuscripciones] = useState([]);
  const [suscripcionesPeriodo, setSuscripcionesPeriodo] = useState([]);
  const { openModal1, setOpenModal1 } = useContext(MyContext);

  const [numeroPlaca, setNumeroPlaca] = useState("");
  const [numeroFlota, setNumeroFlota] = useState("");

  const [dataPayNow, setDataPayNow] = useState({
    tipo: "03",
    importe: 0,
    descuento: 0,
    observaciones: "",
    estado: 1,
    years: 2023,
    months: 1,
  });

  const [modalDataPayNow, setModalDataPayNow] = useState({
    estado: 0,
    periodo: "",
  });

  const filterPropietarios = async (value) => {
    await API(`propietarios/filter/${value}`).then((res) => {
      if (res["propietarios"]) {
        setPropietarios(res["propietarios"]);
      }
    });
  };

  const getSuscripcionesByPropietario = async (numero_documento) => {
    await API(`inscripciones/info/${numero_documento}`).then((res) => {
      if (res["inscripciones-info"]) {
        setSuscripciones(res["inscripciones-info"]);
      } else {
        toast.warning("Este propietario no tiene suscripciones");
        setSuscripciones([]);
      }
    });
  };

  const getSuscripcionPeriodo = async (numero_placa) => {
    await API(`inscripciones/periodo/${numero_placa}`).then((res) => {
      if (res["periodo-inscripcion"]) {
        setSuscripcionesPeriodo(res["periodo-inscripcion"]);
      } else {
        toast.warning("Este propietario no esta suscrito");
        setSuscripcionesPeriodo([]);
      }
    });
  };

  const payNow = async () => {
    setLoadButton(true);
    await API(`comprobantes/create/${idSubs}`, {
      data: dataPayNow,
      method: "POST",
    }).then((resp) => {
      if (resp["estado"]) {
        setLoadButton(false);
        setOpenModal1(false);
        getSuscripcionPeriodo(numeroPlaca);
        toast.success("El pago se registró correctamente");
      } else {
        setLoadButton(false);
      }
    });
  };

  useEffect(() => {
    if (!openModal1) {
      setDataPayNow({
        ...dataPayNow,
        tipo: "03",
        importe: 0,
        descuento: 0,
        observaciones: "",
        estado: 1,
        years: 2023,
        months: 1,
      });
      setModalDataPayNow({
        ...modalDataPayNow,
        estado: 0,
        periodo: "",
      });
    }
  }, [openModal1]);

  return (
    <>
      <ToastContainer />
      <div className="pages pagos">
        <h2>PAGOS</h2>
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
                        getSuscripcionesByPropietario(
                          propietario.numero_documento
                        );
                        setPropietarios([]);
                        setFilterValue("");
                        setSuscripcionesPeriodo([]);
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
          {suscripciones.length > 0 && (
            <table className="my_table">
              <thead className="head_table">
                <tr>
                  <th>N° Flota</th>
                  <th>N° Doc</th>
                  <th>N° Placa</th>
                  <th>Importe</th>
                  <th />
                  <th />
                </tr>
              </thead>
              <tbody className="body_table">
                {suscripciones.map((suscripcion, i) => (
                  <tr key={i}>
                    <td>{suscripcion.numero_flota}</td>
                    <td>{suscripcion.numero_documento}</td>
                    <td>{suscripcion.numero_placa}</td>
                    <td className="green">S/. {suscripcion.importe}</td>
                    <td
                      className="success editable"
                      onClick={() => {
                        getSuscripcionPeriodo(suscripcion.numero_placa);
                        setNumeroPlaca(suscripcion.numero_placa);
                        setNumeroFlota(suscripcion.numero_flota);
                        setIdSubs(suscripcion.id_inscripcion);
                      }}
                    >
                      Ver Pagos
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {suscripcionesPeriodo.length > 0 && (
          <table className="my_table">
            <thead className="head_table">
              <tr>
                <th>Periodo</th>
                <th>Importe</th>
                <th>Estado</th>
                <th />
              </tr>
            </thead>
            <tbody className="body_table">
              {suscripcionesPeriodo.map((periodo, i) => (
                <tr key={i}>
                  <td>{`${numeroMesANombreMes(periodo.months)} ${
                    periodo.years
                  }`}</td>
                  <td className="green">S/. {periodo.importe}</td>
                  <td>
                    {periodo.estado === 0 ? (
                      <span className="warning">Pago Pendiente</span>
                    ) : periodo.estado === 1 ? (
                      <span className="success">Al día</span>
                    ) : (
                      <span className="danger">Deuda</span>
                    )}
                  </td>
                  <td
                    className="success editable"
                    onClick={() => {
                      setDataPayNow({
                        ...dataPayNow,
                        importe: periodo.importe,
                        years: periodo.years,
                        months: periodo.months,
                      });
                      setModalDataPayNow({
                        ...modalDataPayNow,
                        estado: periodo.estado,
                        periodo: `${numeroMesANombreMes(periodo.months)} ${
                          periodo.years
                        }`,
                      });
                      setOpenModal1(true);
                    }}
                  >
                    Pagar Ahora
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {openModal1 && (
        <WindowScreen title="Pagar Ahora" width={35} height={85}>
          <div className="container_modal">
            <div className="mini_form">
              {modalDataPayNow.estado === 0 ? (
                <h5 style={{ background: "#ffbb55" }}>Pago Pendiente</h5>
              ) : modalDataPayNow.estado === 1 ? (
                <h5 style={{ background: "#41f1b6" }}>Al día</h5>
              ) : (
                <h5 style={{ background: "#ff7782" }}>Deuda</h5>
              )}
              <p>N° Placa: {numeroPlaca}</p>
              <p>N° Flota: {numeroFlota}</p>
              <p>Periodo: {modalDataPayNow.periodo}</p>
              <MySelect
                title="Tipo de Pago"
                _key="tipo"
                required={true}
                options={[{ name: "Factura", value: "03" }]}
              />
              <MyInputNumber
                title="Importe"
                value={dataPayNow.importe}
                max={3}
                required={true}
                onChange={(value) => {
                  setDataPayNow({ ...dataPayNow, importe: value });
                }}
              />
              <MyInputNumber
                title="Descuento"
                value={dataPayNow.descuento}
                max={3}
                required={true}
                onChange={(value) => {
                  setDataPayNow({ ...dataPayNow, descuento: value });
                }}
              />
              <MyInput
                title="Observaciones"
                value={dataPayNow.observaciones}
                onChange={(e) => {
                  setDataPayNow({
                    ...dataPayNow,
                    observaciones: e.target.value,
                  });
                }}
              />
              <div className="group_button">
                <MyButton
                  name="Pagar Ahora"
                  type="button"
                  load={loadButton}
                  onClick={() => payNow()}
                />
              </div>
            </div>
          </div>
        </WindowScreen>
      )}
    </>
  );
}
