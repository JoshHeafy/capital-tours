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
  updateDataGenerate,
} from "@/library/functions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyInputNumber from "../Inputs/MyInputNumber";
import MyInputColor from "../Inputs/MyInputColor";
import MyInputPlaca from "../Inputs/MyInputPlaca";

export default function VehiculosPage() {
  const formIdUpdate = "id_" + uuidv4();
  const formIdCreate = "id_" + uuidv4();
  const {
    openModal1,
    setOpenModal1,
    openModal2,
    setOpenModal2,
    openModal3,
    setOpenModal3,
  } = useContext(MyContext);
  const [loadButton, setLoadButton] = useState(false);
  const [vehiculos, setVehiculos] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [filterResult, setFilterResult] = useState("");
  const [verTodo, setVerTodo] = useState(true);
  const [verTodoText, setVerTodoText] = useState("FILTRAR");
  const [maxList, setMaxList] = useState(10);

  const [propietarioName, setPropietarioName] = useState("");
  const [propietarios, setPropietarios] = useState([]);
  const [vehiculoStatic, setVehiculoStatic] = useState({});
  const [vehiculo, setVehiculo] = useState({
    anio: 0,
    color: "",
    marca: "",
    modelo: "",
    numero_asientos: 0,
    numero_documento: "",
    numero_pasajeros: 0,
    numero_placa: "",
    numero_serie: "",
    observaciones: "",
  });
  const [vehiculoCreate, setVehiculoCreate] = useState({
    anio: 0,
    color: "",
    marca: "",
    modelo: "",
    numero_asientos: 0,
    numero_documento: "",
    numero_pasajeros: 0,
    numero_placa: "",
    numero_serie: "",
    observaciones: "",
  });
  const [numeroPlaca, setNumeroPlaca] = useState("");
  const [numeroDocumento, setNumeroDocumento] = useState("");

  // Constantes Filtro re asignar
  const [numeroPlacaReAsign, setNumeroPlacaReAsign] = useState("");
  const [filterValueReAsign, setFilterValueReAsign] = useState("");
  const [filterResultReAsign, setFilterResultReAsign] = useState("");
  const [numeroDocumentoReAsign, setNumeroDocumentoReAsign] = useState("");

  // Constantes Filtro crear vehiculo
  const [filterValueCreate, setFilterValueCreate] = useState("");
  const [filterResultCreate, setFilterResultCreate] = useState("");
  const [numeroDocumentoCreate, setNumeroDocumentoCreate] = useState("");

  const getVehiculos = async () => {
    await API("vehiculos/list").then((res) => {
      if (res["vehiculos"]) {
        setVehiculos(res["vehiculos"]);
      }
    });
  };

  const getOneVehiculo = async (numero_placa) => {
    await API(`vehiculos/info-placa/${numero_placa}`).then((res) => {
      if (res["vehiculo_info"]) {
        setVehiculo(res["vehiculo_info"]);
        setVehiculoStatic(res["vehiculo_info"]);
        getNamePropietario(res["vehiculo_info"]["numero_documento"]);
        setNumeroPlaca(res["vehiculo_info"]["numero_placa"]);
      }
    });
  };

  const getNamePropietario = async (numero_documento) => {
    await API(`propietarios/info-prop/${numero_documento}`).then((res) => {
      if (res["propietario_info"]) {
        setPropietarioName(res["propietario_info"]["nombre_propietario"]);
      }
    });
  };

  const getVehiculosByPropietario = async (numero_documento) => {
    await API(`vehiculos/info/${numero_documento}`).then((res) => {
      if (res["vehiculos_info"]) {
        setVehiculos(res["vehiculos_info"]);
      }
    });
  };

  const updateVehiculo = async (e) => {
    e.preventDefault();
    setLoadButton(true);
    var result = updateDataGenerate(formIdUpdate, vehiculoStatic);
    if (result.status) {
      await API(`vehiculos/update/${numeroPlaca}`, {
        data: result.data,
        method: "PUT",
      }).then((resp) => {
        if (resp) {
          setLoadButton(false);
          setOpenModal1(false);
          if (verTodo) {
            getVehiculos();
          } else {
            getVehiculosByPropietario(numeroDocumento);
          }
          toast.success("La actualización se completó correctamente");
        } else {
          setLoadButton(false);
        }
      });
      setLoadButton(false);
    } else {
      setLoadButton(false);
    }
  };

  const createVehiculo = async (e) => {
    e.preventDefault();
    setLoadButton(true);
    var result = newDataGenerate(formIdCreate);
    if (result.status) {
      await API("vehiculos/create", {
        data: result.data,
        method: "POST",
      }).then((resp) => {
        if (resp["numero_documento"]) {
          setLoadButton(false);
          setOpenModal1(false);
          setOpenModal2(false);
          setOpenModal3(false);
          if (verTodo) {
            getVehiculos();
          } else {
            getVehiculosByPropietario(numeroDocumento);
          }
          toast.success("El registro se completó correctamente");
        } else {
          setLoadButton(false);
        }
      });
      setLoadButton(false);
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

  const reAsignarVehiculo = async () => {
    await API(`vehiculos/re-assign/${numeroPlacaReAsign}`, {
      data: { numero_documento: numeroDocumentoReAsign },
      method: "PUT",
    }).then((res) => {
      setOpenModal2(false);
      if (res["update_vehiculo"]["numero_documento"]) {
        if (verTodo) {
          getVehiculos();
        } else {
          getVehiculosByPropietario(numeroDocumento);
        }
        toast.success(
          `Se re asigno el vehiculo de placa ${numeroPlacaReAsign} al n° documento ${numeroDocumentoReAsign}`
        );
      }
    });
  };

  useEffect(() => {
    if (!openModal1) {
      setVehiculo({
        anio: 0,
        color: "",
        marca: "",
        modelo: "",
        numero_asientos: 0,
        numero_documento: "",
        numero_pasajeros: 0,
        numero_placa: "",
        numero_serie: "",
        observaciones: "",
      });
    }
  }, [openModal1]);

  useEffect(() => {
    if (!openModal2) {
      setNumeroDocumentoReAsign("");
      setNumeroPlacaReAsign("");
      setFilterValueReAsign("");
      setFilterResultReAsign("");
    }
  }, [openModal2]);

  useEffect(() => {
    if (!openModal3) {
      setNumeroDocumentoCreate("");
      setFilterResultCreate("");
      setVehiculoCreate({
        anio: 0,
        marca: "",
        modelo: "",
        numero_placa: "",
        numero_serie: "",
        observaciones: "",
      });
    }
  }, [openModal3]);

  useEffect(() => {
    getVehiculos();
  }, []);

  return (
    <>
      <ToastContainer limit={3} />
      <div className="pages vehiculos">
        <div className="vehiculos_interaction">
          <h2>VEHÍCULOS</h2>
          <div className="toggle_all">
            <MyButton
              name={verTodoText}
              onClick={() => {
                setVerTodo(!verTodo);
                if (!verTodo) {
                  setVerTodoText("FILTRAR");
                  getVehiculos();
                  setPropietarios([]);
                  setFilterValue("");
                } else {
                  setVehiculos([]);
                  setFilterResult("");
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
                            getVehiculosByPropietario(
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
            {vehiculos.length > 0 && (
              <>
                <table className="my_table">
                  <thead className="head_table">
                    <tr>
                      <th>N°</th>
                      <th>N° Placa</th>
                      <th>N° Doc</th>
                      <th>Marca</th>
                      <th>Modelo</th>
                      <th>Año</th>
                      <th>Color</th>
                      <th />
                      <th />
                    </tr>
                  </thead>
                  <tbody className="body_table">
                    {vehiculos.map((vehiculo, i) => {
                      if (i < maxList) {
                        return (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{vehiculo.numero_placa}</td>
                            <td>{vehiculo.numero_documento}</td>
                            <td>{toCapitalice(vehiculo.marca)}</td>
                            <td>{toCapitalice(vehiculo.modelo)}</td>
                            <td>{vehiculo.anio}</td>
                            <td>
                              <span
                                className="color-table"
                                style={{
                                  background: vehiculo.color,
                                }}
                              ></span>
                            </td>
                            <td
                              className="success editable"
                              onClick={() => {
                                setOpenModal1(true);
                                getOneVehiculo(vehiculo.numero_placa);
                              }}
                            >
                              Editar
                            </td>
                            <td
                              className="success editable"
                              onClick={() => {
                                setOpenModal2(true);
                                setNumeroPlacaReAsign(vehiculo.numero_placa);
                              }}
                            >
                              Re asignar
                            </td>
                          </tr>
                        );
                      }
                    })}
                  </tbody>
                </table>
                {vehiculos.length > maxList && (
                  <a
                    className="editable success"
                    onClick={() => setMaxList(maxList + 10)}
                  >
                    Ver Más
                  </a>
                )}
              </>
            )}
          </div>
        </div>
        <div className="vehiculo_create">
          <MyButton
            name="+ Agregar Vehiculo"
            onClick={() => setOpenModal3(true)}
          />
        </div>
      </div>
      {openModal1 && (
        <WindowScreen title="Editar Vehículo" width={60} height={70}>
          <div className="container_modal">
            <h5 className="modal_warning">
              Propietario: <span>{toCapitalice(propietarioName)}</span>
            </h5>

            <form
              id={formIdUpdate}
              className="form-modal"
              onSubmit={updateVehiculo}
            >
              <MyInput
                title="N° Placa"
                value={vehiculo.numero_placa}
                disabled={true}
              />
              <MyInput
                title="N° Documento"
                value={vehiculo.numero_documento}
                disabled={true}
              />
              <MyInput
                title="N° Serie"
                value={vehiculo.numero_serie}
                disabled={true}
                onChange={(e) =>
                  setVehiculo({
                    ...vehiculo,
                    numero_serie: e.target.value,
                  })
                }
              />
              <MyInputNumber
                title="N° Pasajeros"
                _key="numero_pasajeros"
                value={vehiculo.numero_pasajeros}
                max={1}
                onChange={(value) =>
                  setVehiculo({
                    ...vehiculo,
                    numero_pasajeros: value,
                  })
                }
              />
              <MyInputNumber
                title="N° Asientos"
                _key="numero_asientos"
                value={vehiculo.numero_asientos}
                max={1}
                onChange={(value) =>
                  setVehiculo({
                    ...vehiculo,
                    numero_asientos: value,
                  })
                }
              />
              <MyInputNumber
                title="Año"
                _key="anio"
                value={vehiculo.anio}
                max={4}
                onChange={(value) =>
                  setVehiculo({
                    ...vehiculo,
                    anio: value,
                  })
                }
              />
              <MyInput
                title="Marca"
                _key="marca"
                value={vehiculo.marca}
                onChange={(e) =>
                  setVehiculo({
                    ...vehiculo,
                    marca: e.target.value,
                  })
                }
              />
              <MyInput
                title="Modelo"
                _key="modelo"
                value={vehiculo.modelo}
                onChange={(e) =>
                  setVehiculo({
                    ...vehiculo,
                    modelo: e.target.value,
                  })
                }
              />
              <MyInput
                title="Observaciones"
                _key="observaciones"
                value={vehiculo.observaciones}
                onChange={(e) =>
                  setVehiculo({
                    ...vehiculo,
                    observaciones: e.target.value,
                  })
                }
              />
              <MyInputColor
                title="Color de Vehiculo"
                icon="bx bxs-car-garage"
                _key="color"
                value={vehiculo.color}
                onChange={(e) =>
                  setVehiculo({
                    ...vehiculo,
                    color: e.target.value,
                  })
                }
              />
              <MyButton name="Actualizar" load={loadButton} />
            </form>
          </div>
        </WindowScreen>
      )}
      {openModal2 && (
        <WindowScreen title="Re Asignar Vehiculo" height={30}>
          <div className="container_modal reasign">
            <h5 className="modal_warning">
              El vehículo de placa <span>{numeroPlacaReAsign} </span> se re
              asignará al propietario:
            </h5>
            <div className="filtro">
              <div className="autocomplete">
                <MyInput
                  title="Nombre o N° Documento"
                  value={filterValueReAsign}
                  required={true}
                  onFocus={(e) => {
                    setNumeroDocumentoReAsign("");
                    setFilterResultReAsign("");
                  }}
                  onChange={(e) => {
                    if (e.target.value.length > 3) {
                      filterPropietarios(e.target.value);
                    } else {
                      setPropietarios([]);
                    }
                    setFilterValueReAsign(e.target.value);
                  }}
                />
                {propietarios.length > 0 && (
                  <ul className="list_autocomplete">
                    {propietarios.map((propietario, i) => (
                      <li
                        key={i}
                        className="autocomplete_items"
                        onClick={() => {
                          setFilterResultReAsign(
                            toCapitalice(propietario.nombre_propietario)
                          );
                          setNumeroDocumentoReAsign(
                            propietario.numero_documento
                          );
                          setPropietarios([]);
                          setFilterValueReAsign("");
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
                value={filterResultReAsign}
                placeholder="Propietario"
                disabled={true}
              />
            </div>
            {numeroDocumentoReAsign !== "" && (
              <MyButton
                type="button"
                name="RE ASIGNAR"
                onClick={() => reAsignarVehiculo()}
              />
            )}
          </div>
        </WindowScreen>
      )}
      {openModal3 && (
        <WindowScreen title="Agregar Vehiculo" width={60} height={60}>
          <div className="filtro create_vehiculo">
            <h5>Propietario</h5>
            <div className="autocomplete">
              <MyInput
                title="Nombre o N° Documento"
                value={filterValueCreate}
                required={true}
                onFocus={(e) => {
                  setNumeroDocumentoCreate("");
                  setFilterResultCreate("");
                }}
                onChange={(e) => {
                  if (e.target.value.length > 3) {
                    filterPropietarios(e.target.value);
                  } else {
                    setPropietarios([]);
                  }
                  setFilterValueCreate(e.target.value);
                }}
              />
              {propietarios.length > 0 && (
                <ul className="list_autocomplete">
                  {propietarios.map((propietario, i) => (
                    <li
                      key={i}
                      className="autocomplete_items"
                      onClick={() => {
                        setFilterResultCreate(
                          toCapitalice(propietario.nombre_propietario)
                        );
                        setNumeroDocumentoCreate(propietario.numero_documento);
                        setPropietarios([]);
                        setFilterValueCreate("");
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
              value={filterResultCreate}
              placeholder="Propietario"
              disabled={true}
            />
          </div>
          <div className="container_modal big">
            <form
              id={formIdCreate}
              className="form-modal modal_create_vehiculo"
              onSubmit={createVehiculo}
            >
              <MyInputNumber
                title="N° Documento"
                _key="numero_documento"
                value={numeroDocumentoCreate}
                disabled={true}
                required={true}
              />
              <MyInputPlaca
                title="Placa"
                _key="numero_placa"
                value={vehiculoCreate.numero_placa}
                required={true}
                onChange={(value) =>
                  setVehiculoCreate({
                    ...vehiculoCreate,
                    numero_placa: value,
                  })
                }
              />
              <MyInputNumber
                title="N° Serie"
                _key="numero_serie"
                value={vehiculoCreate.numero_serie}
                max={17}
                required={true}
                onChange={(value) =>
                  setVehiculoCreate({
                    ...vehiculoCreate,
                    numero_serie: value,
                  })
                }
              />
              <MyInputNumber
                title="N° Pasajeros"
                _key="numero_pasajeros"
                value="4"
                max={1}
                disabled={true}
                required={true}
              />
              <MyInputNumber title="Año" _key="anio" max={4} required={true} />
              <MyInput title="Marca" _key="marca" required={true} />
              <MyInputNumber
                title="N° Asientos"
                _key="numero_asientos"
                value="5"
                max={1}
                disabled={true}
                required={true}
              />
              <MyInput
                title="Modelo"
                _key="modelo"
                value={vehiculoCreate.modelo}
                required={true}
                onChange={(e) =>
                  setVehiculoCreate({
                    ...vehiculoCreate,
                    modelo: e.target.value,
                  })
                }
              />
              <MyInput
                title="Observaciones"
                _key="observaciones"
                value={vehiculoCreate.observaciones}
                required={true}
                onChange={(e) =>
                  setVehiculoCreate({
                    ...vehiculoCreate,
                    observaciones: e.target.value,
                  })
                }
              />
              <MyInputColor
                title="Color de Vehiculo"
                icon="bx bxs-car-garage"
                _key="color"
              />
              {numeroDocumentoCreate !== "" && (
                <MyButton name="Crear" load={loadButton} />
              )}
            </form>
          </div>
        </WindowScreen>
      )}
    </>
  );
}
