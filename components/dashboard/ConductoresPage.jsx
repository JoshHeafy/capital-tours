import { API } from "@/library/api";
import { MyContext } from "@/context/MyContext";
import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import MyInput from "../Inputs/MyInput";
import MyButton from "../buttons/MyButton";
import WindowScreen from "../Window";
import MySelect from "../select/MySelect";
import {
  newDataGenerate,
  toCapitalice,
  updateDataGenerate,
} from "@/library/functions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ConductoresPage() {
  const tipoLicencia = [
    { value: "A1", name: "A1" },
    { value: "A2", name: "A2" },
    { value: "B", name: "B" },
  ];

  const generoOptions = [
    { value: 0, name: "Masculino" },
    { value: 1, name: "Femenino" },
    { value: 2, name: "Otros" },
  ];

  const formIdUpdate = "id_" + uuidv4();
  const formIdCreate = "id_" + uuidv4();
  const { openModal1, setOpenModal1, openModal2, setOpenModal2 } =
    useContext(MyContext);
  const [apiConductor, setApiConductor] = useState([]);
  const [loadButton, setLoadButton] = useState(false);
  const [conductores, setConductores] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [conductorStatic, setConductorStatic] = useState({});
  const [conductor, setConductor] = useState({
    numero_licencia: "",
    categoria_licencia: "",
    fecha_caducacion_licencia: "",
    fecha_nacimiento: "",
    nombre_conductor: "",
    genero: 0,
    direccion: "",
    telefono: "",
    email: "",
    estado: 1,
    numero_placa: "",
  });

  // Formatear fecha a DD/MM/YYYY
  const formatDate = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  // Convertir fecha de DD/MM/YYYY a YYYY-MM-DD
  const parseDate = (date) => {
    if (!date) return "";
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
  };

  // Obtener lista de conductores
  const getConductores = async () => {
    await API("conductores/list").then((res) => {
      if (res["conductores"]) {
        setConductores(res["conductores"]);
      }
    });
  };

  // Obtener lista de vehículos
  const getVehiculos = async () => {
    await API("vehiculos/list").then((res) => {
      if (res["vehiculos"]) {
        setVehiculos(res["vehiculos"]);
      }
    });
  };

  const getOneConductor = async () => {
    await API(`conductores/info/${apiConductor}`)
      .then((res) => {
        if (res["conductor_info"]) {
          const fechaNacimiento = res["conductor_info"].fecha_nacimiento;
          const fechaCaducacion =
            res["conductor_info"].fecha_caducacion_licencia;

          // Verificar si las fechas son válidas antes de pasarlas al estado
          if (fechaNacimiento && !isNaN(new Date(fechaNacimiento))) {
            setConductor({
              ...res["conductor_info"],
              fecha_nacimiento: new Date(fechaNacimiento),
              fecha_caducacion_licencia: new Date(fechaCaducacion),
            });
          } else {
            console.error("Fecha de nacimiento no válida", fechaNacimiento);
          }
        } else {
          console.error("No se encontró información del conductor.");
        }
      })
      .catch((err) => {
        console.error("Error en la solicitud:", err);
      });
  };

  const validateForm = (conductor) => {
    // Verificar campos obligatorios
    if (
      !conductor.categoria_licencia ||
      !conductor.direccion ||
      !conductor.email ||
      !conductor.estado ||
      !conductor.fecha_caducacion_licencia ||
      !conductor.fecha_nacimiento ||
      !conductor.genero ||
      !conductor.nombre_conductor ||
      !conductor.numero_licencia ||
      !conductor.numero_placa ||
      !conductor.telefono
    ) {
      toast.error("Todos los campos son obligatorios.");
      return false;
    }

    // Validación de Email
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(conductor.email)) {
      toast.error("Por favor ingrese un email válido.");
      return false;
    }

    // Validación de Teléfono (9 dígitos)
    const phonePattern = /^[0-9]{9}$/;
    if (!phonePattern.test(conductor.telefono)) {
      toast.error("El número de teléfono debe tener 9 dígitos.");
      return false;
    }

    // Validación de N° Licencia (9 dígitos)
    const licensePattern = /^[0-9]{9}$/;
    if (!licensePattern.test(conductor.numero_licencia)) {
      toast.error("El número de licencia debe tener 9 dígitos.");
      return false;
    }

    return true; // Si todas las validaciones pasan
  };

  // Función de actualización de conductor
  const updateConductor = async (e) => {
    e.preventDefault();

    // Formatear fechas al formato correcto (YYYY-MM-DD)
    const formatDate = (date) => {
      const d = new Date(date);
      return d.toISOString().split("T")[0]; // Formato YYYY-MM-DD
    };

    // Asegurarse de que el género sea el valor correcto
    const getGenero = (genero) => {
      if (genero === "Masculino") return 1;
      if (genero === "Femenino") return 0;
      return 2; // Otros
    };

    // Obtener los datos formateados
    const updatedConductor = {
      categoria_licencia: conductor.categoria_licencia,
      direccion: conductor.direccion,
      email: conductor.email,
      estado: conductor.estado,
      fecha_nacimiento: formatDate(conductor.fecha_nacimiento),
      fecha_caducacion_licencia: formatDate(
        conductor.fecha_caducacion_licencia
      ),
      genero: getGenero(conductor.genero),
      nombre_conductor: conductor.nombre_conductor,
      numero_placa: conductor.numero_placa,
      telefono: conductor.telefono,
    };

    if (!updatedConductor.numero_placa) {
      toast.error("Debe asociar un vehículo al conductor.");
      return;
    }

    setLoadButton(true);

    try {
      const result = await updateDataGenerate(formIdUpdate, conductorStatic);
      if (result.status) {
        await API(`conductores/update/${apiConductor}`, {
          data: updatedConductor,
          method: "PUT",
        }).then((resp) => {
          if (resp && Object.keys(resp).length > 0) {
            setLoadButton(false);
            setOpenModal1(false);
            getConductores();
            toast.success("Actualización satisfactoria!");
          } else {
            setLoadButton(false);
            toast.error("Error en la actualización.");
          }
        });
      }
    } catch (err) {
      setLoadButton(false);
      console.error("Error en la solicitud:", err);
    }
  };

  const validateDateFormat = (value) => {
    const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
    return datePattern.test(value) || value === "";
  };

  // Función de creación de conductor
  const createConductor = async (e) => {
    e.preventDefault();
    const newConductor = {
      ...conductor,
      fecha_nacimiento: parseDate(conductor.fecha_nacimiento),
      fecha_caducacion_licencia: parseDate(conductor.fecha_caducacion_licencia),
    };

    if (!validateForm(newConductor)) return;

    if (!newConductor.numero_placa) {
      toast.error("Debe asociar un vehículo al conductor.");
      return;
    }

    setLoadButton(true);
    var result = newDataGenerate(formIdCreate);
    if (result.status) {
      await API("conductores/create", {
        data: result.data,
        method: "POST",
      }).then((resp) => {
        if (resp["numero_licencia"]) {
          setLoadButton(false);
          setOpenModal2(false);
          getConductores();
          toast.success("El registro se completó correctamente");
        } else {
          setLoadButton(false);
        }
      });
    } else {
      setLoadButton(false);
    }
  };

  useEffect(() => {
    getConductores();
    getVehiculos();
  }, []);

  useEffect(() => {
    if (openModal1) {
      getOneConductor();
    } else {
      setConductor({
        numero_licencia: "",
        categoria_licencia: "",
        fecha_caducacion_licencia: "",
        fecha_nacimiento: "",
        nombre_conductor: "",
        genero: 0,
        direccion: "",
        telefono: "",
        email: "",
        estado: 1,
        numero_placa: "",
      });
    }
  }, [openModal1]);

  return (
    <>
      <ToastContainer />
      <div className="pages conductores">
        <h2>CONDUCTORES</h2>
        <div className="actions">
          <MyButton
            name="Registrar Conductor"
            onClick={() => setOpenModal2(true)}
          />
        </div>
        <div className="table">
          <table className="my_table">
            <thead className="head_table">
              <tr>
                <th>N°</th>
                <th>N° Licencia</th>
                <th>Nombre</th>
                <th>Genero</th>
                <th>Dirección</th>
                <th>Email</th>
                <th />
              </tr>
            </thead>
            <tbody className="body_table">
              {conductores.map((dat, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{dat["numero_licencia"]}</td>
                  <td>{toCapitalice(dat["nombre_conductor"])}</td>
                  <td>
                    {dat["genero"] === 1
                      ? "Masculino"
                      : dat["genero"] === 2
                      ? "Otros"
                      : dat["genero"] === 0
                      ? "Masculino"
                      : "No registra genero"}
                  </td>
                  <td>{dat["direccion"]}</td>
                  <td>{dat["email"]}</td>
                  <td
                    onClick={() => {
                      setOpenModal1(true);
                      setApiConductor(dat["numero_licencia"]);
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
        <WindowScreen title="Detalles de Conductor">
          <div className="container_modal">
            <form
              id={formIdUpdate}
              className="form-modal"
              onSubmit={updateConductor}
            >
              <MyInput
                title="N° Licencia"
                _key="numero_licencia"
                value={conductor["numero_licencia"]}
                onChange={(e) => {
                  const numeroLicencia = e.target.value;
                  // Aquí puedes agregar validación para asegurarte que el número tiene 9 dígitos
                  if (numeroLicencia.length <= 9) {
                    setConductor({
                      ...conductor,
                      numero_licencia: numeroLicencia,
                    });
                  } else {
                    toast.error("El número de licencia debe tener 9 dígitos.");
                  }
                }}
              />

              <MyInput
                title="Nombre"
                disabled
                _key="nombre_conductor"
                value={conductor["nombre_conductor"]}
                onChange={(e) =>
                  setConductor({
                    ...conductor,
                    nombre_conductor: e.target.value,
                  })
                }
              />

              <MyInput
                title="Dirección"
                _key="direccion"
                value={conductor["direccion"]}
                onChange={(e) =>
                  setConductor({
                    ...conductor,
                    direccion: e.target.value,
                  })
                }
              />
              <MyInput
                title="Teléfono"
                _key="telefono"
                value={conductor["telefono"]}
                onChange={(e) =>
                  setConductor({
                    ...conductor,
                    telefono: e.target.value,
                  })
                }
              />
              <MyInput
                title="Email"
                _key="email"
                value={conductor["email"]}
                onChange={(e) =>
                  setConductor({
                    ...conductor,
                    email: e.target.value,
                  })
                }
              />
              <MyInput
                title="Género"
                disabled
                _key="genero"
                value={
                  conductor["genero"] === 1
                    ? "Masculino"
                    : conductor["genero"] === 2
                    ? "Otros"
                    : conductor["genero"] === 0
                    ? "Masculino"
                    : "No registra genero"
                }
                onChange={(e) => {
                  const genero = parseInt(e.target.value);
                  setConductor({
                    ...conductor,
                    genero,
                  });
                }}
              />

              <MySelect
                title="Estado"
                options={[
                  { value: 1, name: "Activo" },
                  { value: 0, name: "Inactivo" },
                ]}
                _key="estado"
                onChange={(e) =>
                  setConductor({
                    ...conductor,
                    estado: parseInt(e.target.value),
                  })
                }
              />
              <MySelect
                disabled
                title="Categoría Licencia"
                options={tipoLicencia}
                _key="categoria_licencia"
                onChange={(e) =>
                  setConductor({
                    ...conductor,
                    categoria_licencia: e.target.value,
                  })
                }
              />
              <MyInput
                title="Fecha de Nacimiento"
                _key="fecha_nacimiento"
                disabled
                value={
                  conductor["fecha_nacimiento"]
                    ? new Date(
                        conductor["fecha_nacimiento"]
                      ).toLocaleDateString("es-ES")
                    : ""
                }
                onChange={(e) => {
                  setConductor({
                    ...conductor,
                    fecha_nacimiento: e.target.value,
                  });
                }}
              />

              <MyInput
                title="Fecha de Caducación"
                disabled
                _key="fecha_caducacion_licencia"
                value={
                  conductor["fecha_caducacion_licencia"]
                    ? new Date(
                        conductor["fecha_caducacion_licencia"]
                      ).toLocaleDateString("es-ES")
                    : ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  if (validateDateFormat(value)) {
                    setConductor({
                      ...conductor,
                      fecha_caducacion_licencia: value,
                    });
                  } else {
                    toast.error(
                      "La fecha debe estar en el formato DD/MM/YYYY."
                    );
                  }
                }}
              />

              <MySelect
                title="Vehículo Asociado"
                options={vehiculos.map((vehiculo) => ({
                  value: vehiculo.numero_placa,
                  name: vehiculo.numero_placa,
                }))}
                _key="numero_placa"
                onChange={(e) =>
                  setConductor({
                    ...conductor,
                    numero_placa: e.target.value,
                  })
                }
              />
              <div className="actions">
                <MyButton
                  type="submit"
                  name="Actualizar"
                  loading={loadButton}
                />
                <MyButton
                  type="button"
                  name="Cancelar"
                  onClick={() => setOpenModal1(false)}
                />
              </div>
            </form>
          </div>
        </WindowScreen>
      )}
      {openModal2 && (
        <WindowScreen title="Registrar Conductor">
          <div className="container_modal">
            <form
              id={formIdCreate}
              className="form-modal"
              onSubmit={createConductor}
            >
              <MyInput
                title="N° Licencia"
                _key="numero_licencia"
                value={conductor["numero_licencia"]}
                onChange={(e) =>
                  setConductor({
                    ...conductor,
                    numero_licencia: e.target.value,
                  })
                }
              />
              <MyInput
                title="Nombre"
                _key="nombre_conductor"
                value={conductor["nombre_conductor"]}
                onChange={(e) =>
                  setConductor({
                    ...conductor,
                    nombre_conductor: e.target.value,
                  })
                }
              />
              <MyInput
                title="Dirección"
                _key="direccion"
                value={conductor["direccion"]}
                onChange={(e) =>
                  setConductor({
                    ...conductor,
                    direccion: e.target.value,
                  })
                }
              />
              <MyInput
                title="Teléfono"
                _key="telefono"
                value={conductor["telefono"]}
                onChange={(e) =>
                  setConductor({
                    ...conductor,
                    telefono: e.target.value,
                  })
                }
              />
              <MyInput
                title="Email"
                _key="email"
                value={conductor["email"]}
                onChange={(e) =>
                  setConductor({
                    ...conductor,
                    email: e.target.value,
                  })
                }
              />
              <MySelect
                title="Género"
                options={generoOptions}
                _key="genero"
                onChange={(e) =>
                  setConductor({
                    ...conductor,
                    genero: parseInt(e.target.value),
                  })
                }
              />
              <MySelect
                title="Estado"
                options={[
                  { value: 1, name: "Activo" },
                  { value: 0, name: "Inactivo" },
                ]}
                _key="estado"
                onChange={(e) =>
                  setConductor({
                    ...conductor,
                    estado: parseInt(e.target.value),
                  })
                }
              />
              <MySelect
                title="Categoría Licencia"
                options={tipoLicencia}
                _key="categoria_licencia"
                onChange={(e) =>
                  setConductor({
                    ...conductor,
                    categoria_licencia: e.target.value,
                  })
                }
              />
              <MyInput
                title="Fecha de Caducación"
                _key="fecha_caducacion_licencia"
                value={conductor["fecha_caducacion_licencia"]}
                onChange={(e) =>
                  setConductor({
                    ...conductor,
                    fecha_caducacion_licencia: e.target.value,
                  })
                }
              />
              <MyInput
                title="Fecha de Nacimiento"
                _key="fecha_nacimiento"
                value={conductor["fecha_nacimiento"]}
                onChange={(e) =>
                  setConductor({
                    ...conductor,
                    fecha_nacimiento: e.target.value,
                  })
                }
              />

              <MySelect
                title="Vehículo Asociado"
                options={vehiculos.map((vehiculo) => ({
                  value: vehiculo.numero_placa,
                  name: vehiculo.numero_placa,
                }))}
                _key="numero_placa"
                onChange={(e) =>
                  setConductor({
                    ...conductor,
                    numero_placa: e.target.value,
                  })
                }
              />
              <div className="actions">
                <MyButton
                  type="submit"
                  name="Registrar"
                  loading={loadButton}
                  className="primary"
                />
                <MyButton
                  type="button"
                  name="Cancelar"
                  onClick={() => setOpenModal2(false)}
                  className="secondary"
                />
              </div>
            </form>
          </div>
        </WindowScreen>
      )}
    </>
  );
}
