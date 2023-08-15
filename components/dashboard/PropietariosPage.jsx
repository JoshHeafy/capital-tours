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
import MySelect from "../select/MySelect";

export default function PropietariosPage() {
  const tipoDoc = [
    {
      value: 1,
      name: "DNI",
    },
    {
      value: 6,
      name: "RUC",
    },
  ];

  const formIdUpdate = "id_" + uuidv4();
  const formIdCreate = "id_" + uuidv4();
  const { openModal1, setOpenModal1, openModal2, setOpenModal2 } =
    useContext(MyContext);
  const [apiProp, setApiProp] = useState([]);
  const [loadButton, setLoadButton] = useState(false);
  const [propietarios, setPropietarios] = useState([]);
  const [propietarioStatic, setPropietarioStatic] = useState({});
  const [maxLengthNDocumento, setMaxLengthNDocumento] = useState(8);

  const [propietario, setPropietario] = useState({
    direccion: "",
    email: "",
    nombre_propietario: "",
    numero_documento: "",
    referencia: "",
    telefono: "",
    tipo_documento: 0,
  });
  const [disableUpdatePropietario, setDisableUpdatePropietario] =
    useState(true);

  const getPropietarios = async () => {
    await API("propietarios/list").then((res) => {
      if (res["propietarios"]) {
        setPropietarios(res["propietarios"]);
      }
    });
  };

  const getOnePropietario = async () => {
    await API(`propietarios/info-prop/${apiProp}`).then((res) => {
      if (res["propietario-info"]) {
        setPropietarioStatic(res["propietario-info"]);
        setPropietario(res["propietario-info"]);
      }
    });
  };

  const updatePropietario = async (e) => {
    e.preventDefault();
    setLoadButton(true);
    var result = updateDataGenerate(formIdUpdate, propietarioStatic);
    if (result.status) {
      await API(`propietarios/update/${apiProp}`, {
        data: result.data,
        method: "PUT",
      }).then((resp) => {
        if (resp !== {}) {
          setLoadButton(false);
          setOpenModal1(false);
          getPropietarios();
          toast.success("Actualización satisfactoria!");
        } else {
          setLoadButton(false);
        }
      });
      setLoadButton(false);
    } else {
      setLoadButton(false);
    }
  };

  const createPropietario = async (e) => {
    e.preventDefault();
    setLoadButton(true);
    var result = newDataGenerate(formIdCreate);
    if (result.status) {
      await API("propietarios/create", {
        data: result.data,
        method: "POST",
      }).then((resp) => {
        if (resp["numero_documento"]) {
          setLoadButton(false);
          setOpenModal2(false);
          getPropietarios();
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

  const [filterInput, setFilterInput] = useState(0);
  const [filterValue, setFilterValue] = useState("");
  const [filteredData, setFilteredData] = useState(propietarios);

  const [filterTableBy, setFilterTableBy] = useState("numero_documento");

  useEffect(() => {
    const filtered = propietarios.filter((dat) => {
      return dat[filterTableBy].includes(filterValue);
    });
    setFilteredData(filtered);
  }, [propietarios, filterTableBy, filterValue]);

  useEffect(() => {
    getPropietarios();
  }, []);

  useEffect(() => {
    if (openModal1) {
      getOnePropietario();
    } else {
      setPropietario({
        direccion: "",
        email: "",
        nombre_propietario: "",
        numero_documento: "",
        referencia: "",
        telefono: "",
        tipo_documento: 0,
      });
      setDisableUpdatePropietario(true);
    }
  }, [openModal1]);

  return (
    <>
      <ToastContainer />
      <div className="pages propietarios">
        <h2>PROPIETARIOS</h2>
        <div className="table">
          <div className="filtro">
            <div className="total">
              <i className="bx bxs-user-badge" />
              <p>{filteredData.length}</p>
            </div>
            <h5>Filtrar por: </h5>
            <MySelect
              options={[
                { value: 0, name: "Numero Doc" },
                { value: 1, name: "Nombre" },
              ]}
              onChange={(e) => {
                setFilterInput(e.target.value);
                setFilterValue("");
                if (e.target.value == 0) {
                  setFilterTableBy("numero_documento");
                } else if (e.target.value == 1) {
                  setFilterTableBy("nombre_propietario");
                }
              }}
            />
            {filterInput == 0 ? (
              <MyInputNumber
                title="Numero Documento"
                max={11}
                onChange={(value) => setFilterValue(value)}
              />
            ) : (
              <MyInput
                title="Nombre"
                onChange={(e) => setFilterValue(e.target.value)}
              />
            )}
          </div>
          <table className="my_table">
            <thead className="head_table">
              <tr>
                <th>N°</th>
                <th>N° Doc.</th>
                <th>Nombre</th>
                <th>Dirección</th>
                <th>Email</th>
                <th />
              </tr>
            </thead>
            <tbody className="body_table">
              {filteredData.map((dat, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{dat["numero_documento"]}</td>
                  <td>{toCapitalice(dat["nombre_propietario"])}</td>
                  <td>{dat["direccion"]}</td>
                  <td>{dat["email"]}</td>
                  <td
                    onClick={() => {
                      setOpenModal1(true);
                      setApiProp(dat["numero_documento"]);
                    }}
                    className="success editable"
                  >
                    Editar
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {openModal1 && (
        <WindowScreen title="Detalles de Propietario">
          <div className="container_modal">
            <form
              id={formIdUpdate}
              className="form-modal"
              onSubmit={updatePropietario}
            >
              <MyInput
                title="N° Documento"
                value={propietario["numero_documento"]}
                disabled={true}
              />
              <MyInput
                title="Nombre"
                _key="nombre_propietario"
                value={propietario["nombre_propietario"]}
                disabled={disableUpdatePropietario}
                required={true}
                onChange={(e) =>
                  setPropietario({
                    ...propietario,
                    nombre_propietario: e.target.value,
                  })
                }
              />
              <MyInput
                title="Dirección"
                _key="direccion"
                value={propietario["direccion"]}
                disabled={disableUpdatePropietario}
                required={true}
                onChange={(e) =>
                  setPropietario({
                    ...propietario,
                    direccion: e.target.value,
                  })
                }
              />
              <MyInput
                title="Referencia"
                _key="referencia"
                value={propietario["referencia"]}
                disabled={disableUpdatePropietario}
                onChange={(e) =>
                  setPropietario({
                    ...propietario,
                    referencia: e.target.value,
                  })
                }
              />
              <MyInputNumber
                title="Teléfono"
                _key="telefono"
                value={propietario["telefono"]}
                disabled={disableUpdatePropietario}
                max={9}
                onChange={(value) =>
                  setPropietario({
                    ...propietario,
                    telefono: value,
                  })
                }
              />
              <MyInput
                title="Email"
                _key="email"
                value={propietario["email"]}
                disabled={disableUpdatePropietario}
                onChange={(e) =>
                  setPropietario({
                    ...propietario,
                    email: e.target.value,
                  })
                }
              />
              {!disableUpdatePropietario && (
                <MyButton name="Actualizar" load={loadButton} />
              )}
              <MyButton
                name="Editar"
                type="button"
                onClick={() =>
                  setDisableUpdatePropietario(!disableUpdatePropietario)
                }
              />
            </form>
          </div>
        </WindowScreen>
      )}
      {openModal2 && (
        <WindowScreen title="Crear Propietario">
          <div className="container_modal">
            <form
              id={formIdCreate}
              className="form-modal"
              onSubmit={createPropietario}
            >
              <MyInputNumber
                title="N° Documento"
                _key="numero_documento"
                value={propietario["numero_documento"]}
                max={maxLengthNDocumento}
                required={true}
                onChange={(value) =>
                  setPropietario({
                    ...propietario,
                    numero_documento: value,
                  })
                }
              />
              <MyInput
                title="Nombre"
                _key="nombre_propietario"
                value={propietario["nombre_propietario"]}
                required={true}
                onChange={(e) =>
                  setPropietario({
                    ...propietario,
                    nombre_propietario: e.target.value,
                  })
                }
              />
              <MyInput
                title="Dirección"
                _key="direccion"
                value={propietario["direccion"]}
                required={true}
                onChange={(e) =>
                  setPropietario({
                    ...propietario,
                    direccion: e.target.value,
                  })
                }
              />
              <MyInput
                title="Referencia"
                _key="referencia"
                value={propietario["referencia"]}
                onChange={(e) =>
                  setPropietario({
                    ...propietario,
                    referencia: e.target.value,
                  })
                }
              />
              <MySelect
                title="Tipo de Documento"
                options={tipoDoc}
                _key="tipo_documento"
                required={true}
                onChange={(e) => {
                  if (e.target.value == 6) {
                    setMaxLengthNDocumento(11);
                    setPropietario({ ...propietario, numero_documento: "" });
                  } else if (e.target.value == 1) {
                    setMaxLengthNDocumento(8);
                    setPropietario({ ...propietario, numero_documento: "" });
                  }
                }}
              />
              <MyInputNumber
                title="Teléfono"
                _key="telefono"
                value={propietario["telefono"]}
                max={9}
                onChange={(value) =>
                  setPropietario({
                    ...propietario,
                    telefono: value,
                  })
                }
              />
              <MyInput
                title="Email"
                _key="email"
                type="email"
                value={propietario["email"]}
                onChange={(e) =>
                  setPropietario({
                    ...propietario,
                    email: e.target.value,
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
