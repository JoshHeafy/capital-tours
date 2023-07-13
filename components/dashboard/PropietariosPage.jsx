import { API } from "@/library/api";
import { MyContext } from "@/context/MyContext";
import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import MyTable from "../MyTable";
import MyInput from "../Inputs/MyInput";
import MyButton from "../buttons/MyButton";
import WindowScreen from "../Window";
import { newDataGenerate, updateDataGenerate } from "@/library/functions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MySelectInput from "../Inputs/MySelectInput";
import MyInputNumber from "../Inputs/MyInputNumber";

export default function PropietariosPage() {
  // const tipoDoc = [
  //   {
  //     id: 0,
  //     nombre: "Doc.trib.no.dom.sin.ruc",
  //   },
  //   {
  //     id: 1,
  //     nombre: "Doc. Nacional de identidad",
  //   },
  //   {
  //     id: 4,
  //     nombre: "Carnet de extranjería",
  //   },
  //   {
  //     id: 6,
  //     nombre: "Registro Único de contribuyentes",
  //   },
  //   {
  //     id: 7,
  //     nombre: "Pasaporte",
  //   },
  // ];

  // 0 Doc.trib.no.dom.sin.ruc
  // 1 Doc. Nacional de identidad
  // 4 Carnet de extranjería
  // 6 Registro Único de contribuyentes
  // 7 Pasaporte
  const formIdUpdate = "id_" + uuidv4();
  const formIdCreate = "id_" + uuidv4();
  const {
    openModalDetail,
    setOpenModalDetail,
    apiProp,
    openModalCreate,
    setOpenModalCreate,
  } = useContext(MyContext);
  const [loadButton, setLoadButton] = useState(false);
  const [propietarios, setPropietarios] = useState([]);
  const [propietarioStatic, setPropietarioStatic] = useState({});

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
      if (res["info"]) {
        setPropietarioStatic(res["info"]);
        setPropietario(res["info"]);
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
          setOpenModalDetail(false);
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

  const createPropietario = async (e) => {
    e.preventDefault();
    setLoadButton(true);
    var result = newDataGenerate(formIdCreate);
    if (result.status) {
      await API("propietarios/create", {
        data: result.data,
        method: "POST",
      }).then((resp) => {
        if (resp !== {}) {
          setLoadButton(false);
          setOpenModalDetail(false);
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

  useEffect(() => {
    getPropietarios();
  }, []);

  useEffect(() => {
    if (openModalDetail) {
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
  }, [openModalDetail]);

  return (
    <>
      <ToastContainer />
      <div className="pages">
        <h2>PROPIETARIOS</h2>
        <div className="table">
          <MyTable
            data={propietarios}
            apiProp="numero_documento"
            filtro="numero_documento"
            detalle={true}
            titulos={["Nombre", "N° doc", "Dirección", "Email"]}
            campos={[
              "nombre_propietario",
              "numero_documento",
              "direccion",
              "email",
            ]}
          />
          <div className="create_registro">
            <MyButton
              name="Agregar Propietario"
              onClick={() => setOpenModalCreate(true)}
            />
          </div>
        </div>
      </div>
      {openModalDetail && (
        <WindowScreen title="Detalles de Propietario" size={50}>
          <div className="container_modal">
            <form
              id={formIdUpdate}
              className="form-modal"
              onSubmit={updatePropietario}
            >
              <MyInput
                title="N° Documento"
                _key="numero_documento"
                value={propietario["numero_documento"]}
                disabled={true}
              />
              <MyInput
                title="Nombre"
                _key="nombre_propietario"
                value={propietario["nombre_propietario"]}
                disabled={disableUpdatePropietario}
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
              <MyInput
                title="Tipo Documento"
                _key="tipo_documento"
                value={propietario["tipo_documento"]}
                disabled={disableUpdatePropietario}
                onChange={(e) =>
                  setPropietario({
                    ...propietario,
                    tipo_documento: e.target.value,
                  })
                }
              />
              <MyInput
                title="Teléfono"
                _key="telefono"
                value={propietario["telefono"]}
                disabled={disableUpdatePropietario}
                onChange={(e) =>
                  setPropietario({
                    ...propietario,
                    telefono: e.target.value,
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
              {/* <MySelectInput
                title="Tipo Documento"
                values={tipoDoc}
                value="id"
                name="nombre"
                _key="tipo_documento"
                disabled={disableUpdatePropietario}
              /> */}
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
      {openModalCreate && (
        <WindowScreen title="Crear Propietario" size={50}>
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
                max={11}
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
              <MyInputNumber
                title="Tipo Documento"
                _key="tipo_documento"
                value={propietario["tipo_documento"]}
                max={1}
                required={true}
                onChange={(value) =>
                  setPropietario({
                    ...propietario,
                    tipo_documento: value,
                  })
                }
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
