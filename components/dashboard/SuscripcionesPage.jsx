import { API } from "@/library/api";
import { MyContext } from "@/context/MyContext";
import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import MyInput from "../Inputs/MyInput";
import MyButton from "../buttons/MyButton";
import WindowScreen from "../Window";
import {
  newDataGenerate,
  toCapitalice,
} from "@/library/functions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyInputNumber from "../Inputs/MyInputNumber";
import MyButtonIcon from "../buttons/MyButtonIcon";
import MySelect from "../select/MySelect";

export default function SuscripcionesPage() {
  const formIdCreate = "id_" + uuidv4();
  const {
    openModal1,
    setOpenModal1,
    openModal2,
    setOpenModal2,
    openModal3,
    setOpenModal3,
  } = useContext(MyContext);

  const [verTodo, setVerTodo] = useState(true);
  const [verTodoIcon, setVerTodoIcon] = useState("bx bx-search-alt");
  const [verTodoText, setVerTodoText] = useState("BUSCAR SUSCRIPCIÓN");
  const [filterValue, setFilterValue] = useState("");
  const [filterResult, setFilterResult] = useState("");
  const [propietarios, setPropietarios] = useState([]);
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [numeroPlaca, setNumeroPlaca] = useState("");
  const [propietarioName, setPropietarioName] = useState("");
  const [newImporteAlta, setNewImporteAlta] = useState(0);
  const [newImporteDisabled, setNewImporteDisabled] = useState(true);

  const [vehiculos, setVehiculos] = useState([]);

  const [loadButton, setLoadButton] = useState(false);
  const [suscripciones, setSuscripciones] = useState([]);
  const [suscripcion, setSuscripcion] = useState({
    numero_flota: 0,
    importe: 0,
  });

  const getNamePropietario = async (numero_documento) => {
    await API(`propietarios/info-prop/${numero_documento}`).then((res) => {
      if (res["propietario-info"]) {
        setPropietarioName(res["propietario-info"]["nombre_propietario"]);
      }
    });
  };

  const getVehiculosByPropietario = async () => {
    await API(`vehiculos/info/${numeroDocumento}`).then((res) => {
      if (res["vehiculos-info"]) {
        const vehiculosTmp = [];
        for (const vehiculo of res["vehiculos-info"]) {
          vehiculosTmp.push({
            name: vehiculo.numero_placa,
            value: vehiculo.numero_placa,
          });
        }
        setVehiculos(vehiculosTmp);
      }
    });
  };

  const getSuscripciones = async () => {
    await API("inscripciones/list").then((res) => {
      if (res["inscripciones"]) {
        setSuscripciones(res["inscripciones"]);
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

  const darBajaVehiculo = async () => {
    setLoadButton(true);
    await API(`inscripciones/service-baja/${numeroPlaca}`, {
      method: "PUT",
    }).then((resp) => {
      if (resp["estado"] === 0) {
        setLoadButton(false);
        setOpenModal2(false);
        if (verTodo) {
          getSuscripciones();
        } else {
          getSuscripcionesByPropietario(numeroDocumento);
        }
        toast.success("Se dió de baja a este vehiculo con éxito!");
      } else {
        setLoadButton(false);
        toast.error("No se pudo dar de baja a este vehiculo");
      }
    });
  };

  const darAltaVehiculo = async () => {
    setLoadButton(true);
    await API(`inscripciones/service-alta/${numeroPlaca}`, {
      data: { importe: newImporteAlta },
      method: "PUT",
    }).then((resp) => {
      if (resp["estado"] === 1) {
        setLoadButton(false);
        setOpenModal1(false);
        getSuscripciones();
        if (verTodo) {
          getSuscripciones();
        } else {
          getSuscripcionesByPropietario(numeroDocumento);
        }
        toast.success("Se dió de alta a este vehiculo con éxito!");
      } else {
        setLoadButton(false);
        toast.error("No se pudo dar de alta a este vehiculo");
      }
    });
  };

  const createSuscripcion = async (e) => {
    e.preventDefault();
    setLoadButton(true);
    var result = newDataGenerate(formIdCreate);
    if (result.status) {
      await API("inscripciones/create-ins", {
        data: result.data,
        method: "POST",
      }).then((resp) => {
        if (resp["numero_placa"]) {
          setLoadButton(false);
          setOpenModal1(false);
          setOpenModal2(false);
          setOpenModal3(false);
          if (verTodo) {
            getSuscripciones();
          } else {
            getSuscripcionesByPropietario(resp["numero_documento"]);
          }
          toast.success("El registro se completó correctamente");
        } else {
          setLoadButton(false);
        }
      });
    } else {
      setLoadButton(false);
    }
  };

  const filterPropietarios = async (value) => {
    await API(`propietarios/filter/${value}`).then((res) => {
      if (res["propietarios"]) {
        setPropietarios(res["propietarios"]);
      }
    });
  };

  useEffect(() => {
    getSuscripciones();
  }, []);

  useEffect(() => {
    if (!openModal3) {
      setSuscripcion({ ...suscripcion, numero_flota: 0, importe: 0 });
    }
  }, [openModal3]);

  return (
    <>
      <ToastContainer />
      <div className="pages suscripciones">
        <div className="suscripciones_interaction">
          <h2>SUSCRIPCIONES</h2>
          <div className="toggle_all">
            <MyButtonIcon
              name={verTodoText}
              icon={verTodoIcon}
              onClick={() => {
                setVerTodo(!verTodo);
                if (!verTodo) {
                  setVerTodoText("BUSCAR SUSCRIPCIÓN");
                  setVerTodoIcon("bx bx-search-alt");
                  getSuscripciones();
                  setPropietarios([]);
                  setFilterValue("");
                  setNumeroDocumento("");
                } else {
                  setSuscripciones([]);
                  setFilterResult("");
                  setVerTodoIcon("bx bx-grid-small");
                  setVerTodoText("VER TODO");
                }
              }}
            />
          </div>
          <div className="table">
            {!verTodo && (
              <div className="filtro">
                <h5>Filtrar por propietario:</h5>
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
                            getSuscripcionesByPropietario(
                              propietario.numero_documento
                            );
                            setPropietarios([]);
                            setFilterValue("");
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
            )}
            {suscripciones.length > 0 && (
              <>
                <table className="my_table">
                  <thead className="head_table">
                    <tr>
                      <th>N° Flota</th>
                      <th>N° Doc</th>
                      <th>N° Placa</th>
                      <th>Importe</th>
                      <th>Fecha Inicio</th>
                      <th>Estado</th>
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
                        <td>{suscripcion.fecha_inicio}</td>
                        <td>
                          <span
                            className="color-table"
                            style={{
                              background:
                                suscripcion.estado === 0
                                  ? "#ff7782"
                                  : "#41f1b6",
                            }}
                          ></span>
                        </td>
                        {suscripcion.estado === 0 ? (
                          <td
                            className="success editable"
                            onClick={() => {
                              setOpenModal1(true);
                              setNumeroPlaca(suscripcion.numero_placa);
                              getNamePropietario(suscripcion.numero_documento);
                              setNewImporteAlta(suscripcion.importe);
                            }}
                          >
                            Dar Alta
                          </td>
                        ) : (
                          <td
                            className="danger editable"
                            onClick={() => {
                              setOpenModal2(true);
                              setNumeroPlaca(suscripcion.numero_placa);
                              getNamePropietario(suscripcion.numero_documento);
                            }}
                          >
                            Dar Baja
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
        {numeroDocumento !== "" && (
          <div className="suscripcion_create">
            <MyButton
              name="+ Agregar Suscripción"
              onClick={() => {
                getVehiculosByPropietario();
                setOpenModal3(true);
              }}
            />
          </div>
        )}
      </div>
      {openModal1 && (
        <WindowScreen title={"Gestionar Suscripción"} width={30} height={45}>
          <div className="container_modal">
            <div className="mini_form">
              <h5 className="success_title">Dar Alta a Vehiculo</h5>
              <p>N° Placa: {numeroPlaca}</p>
              <p>Propietario: {toCapitalice(propietarioName)}</p>
              <MyInputNumber
                title="Importe"
                max={3}
                value={newImporteAlta}
                disabled={newImporteDisabled}
                onChange={(value) => setNewImporteAlta(value)}
              />
              <div className="group_button">
                <MyButton
                  name="Dar de Alta"
                  type="button"
                  load={loadButton}
                  onClick={() => darAltaVehiculo()}
                />
                <MyButton
                  name="Cambiar Importe"
                  type="button"
                  onClick={() => setNewImporteDisabled(!newImporteDisabled)}
                />
              </div>
            </div>
          </div>
        </WindowScreen>
      )}
      {openModal2 && (
        <WindowScreen title={"Gestionar Suscripción"} width={30} height={45}>
          <div className="container_modal">
            <div className="mini_form">
              <h5>Dar Baja a Vehiculo</h5>
              <p>N° Placa: {numeroPlaca}</p>
              <p>Propietario: {toCapitalice(propietarioName)}</p>
              <MyButton
                name="Dar de Baja"
                type="button"
                load={loadButton}
                onClick={() => darBajaVehiculo()}
              />
            </div>
          </div>
        </WindowScreen>
      )}

      {openModal3 && (
        <WindowScreen title="Agregar Suscripción" width={40} height={40}>
          <div className="container_modal">
            <form
              id={formIdCreate}
              className="form-modal modal_create_vehiculo"
              onSubmit={createSuscripcion}
            >
              <MySelect
                title="N° Placa"
                _key="numero_placa"
                options={vehiculos}
              />
              <MyInputNumber
                title="N° Documento"
                _key="numero_documento"
                value={numeroDocumento}
                disabled={true}
                required={true}
              />

              <MyInputNumber
                title="Importe"
                _key="importe"
                value={suscripcion.importe}
                max={3}
                required={true}
                onChange={(value) =>
                  setSuscripcion({
                    ...suscripcion,
                    importe: value,
                  })
                }
              />
              <MyInputNumber
                title="N° Flota"
                _key="numero_flota"
                value={suscripcion.numero_flota}
                max={3}
                required={true}
                onChange={(value) =>
                  setSuscripcion({
                    ...suscripcion,
                    numero_flota: value,
                  })
                }
              />

              <MyButton name="Crear" load={loadButton} />
            </form>
          </div>
        </WindowScreen>
      )}
    </>
  );
}
