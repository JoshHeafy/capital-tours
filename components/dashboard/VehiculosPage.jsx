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
import MyInputNumber from "../Inputs/MyInputNumber";

export default function VehiculosPage() {
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
  const [vehiculos, setVehiculos] = useState([]);
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
  const [disableUpdateVehiculo, setDisableUpdateVehiculo] = useState(true);

  const getVehiculos = async () => {
    await API("vehiculos/list").then((res) => {
      if (res["vehiculos"]) {
        setVehiculos(res["vehiculos"]);
      }
    });
  };

  const getOneVehiculo = async () => {
    await API(`vehiculos/info/${apiProp}`).then((res) => {
      if (res["info"]) {
        setVehiculoStatic(res["info"]);
        setVehiculo(res["info"]);
      }
    });
  };

  const updateVehiculo = async (e) => {
    e.preventDefault();
    setLoadButton(true);
    var result = updateDataGenerate(formIdUpdate, vehiculoStatic);
    if (result.status) {
      await API(`vehiculos/update/${apiProp}`, {
        data: result.data,
        method: "PUT",
      }).then((resp) => {
        if (resp !== {}) {
          setLoadButton(false);
          setOpenModalDetail(false);
          getVehiculos();
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

  const createVehiculo = async (e) => {
    e.preventDefault();
    setLoadButton(true);
    var result = newDataGenerate(formIdCreate);
    if (result.status) {
      await API("vehiculos/create", {
        data: result.data,
        method: "POST",
      }).then((resp) => {
        if (resp !== {}) {
          setLoadButton(false);
          setOpenModalDetail(false);
          setOpenModalCreate(false);
          getVehiculos();
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
    getVehiculos();
  }, []);

  useEffect(() => {
    if (openModalDetail) {
      getOneVehiculo();
    } else {
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
      setDisableUpdateVehiculo(true);
    }
  }, [openModalDetail]);

  return (
    <>
      <ToastContainer />
      <div className="pages">
        <h2>VEHÍCULOS</h2>
        <div className="table">
          <MyTable
            data={vehiculos}
            apiProp="numero_documento"
            filtro="numero_documento"
            color={true}
            titulos={["N° Placa", "N° doc", "Modelo", "Marca", "Año", "Color"]}
            campos={[
              "numero_placa",
              "numero_documento",
              "modelo",
              "marca",
              "anio",
              "color",
            ]}
          />
          <div className="create_registro">
            <MyButton
              name="Agregar Vehículo"
              onClick={() => setOpenModalCreate(true)}
            />
          </div>
        </div>
      </div>
      {openModalDetail && (
        <WindowScreen title="Detalles de Vehículo" size={50}>
          <div className="container_modal">
            <form
              id={formIdUpdate}
              className="form-modal"
              onSubmit={updateVehiculo}
            >
              <MyInput
                title="N° Placa"
                _key="numero_placa"
                value={vehiculo["numero_placa"]}
                disabled={true}
              />
              <MyInput
                title="N° Documento"
                _key="numero_documento"
                value={vehiculo["numero_documento"]}
                disabled={true}
              />
              <MyInputNumber
                title="N° Serie"
                _key="numero_serie"
                value={vehiculo["numero_serie"]}
                disabled={disableUpdateVehiculo}
                onChange={(value) =>
                  setVehiculo({
                    ...vehiculo,
                    numero_serie: value,
                  })
                }
              />
              <MyInputNumber
                title="N° Pasajeros"
                _key="numero_pasajeros"
                value={vehiculo["numero_pasajeros"]}
                disabled={disableUpdateVehiculo}
                max={2}
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
                value={vehiculo["numero_asientos"]}
                disabled={disableUpdateVehiculo}
                max={2}
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
                value={vehiculo["anio"]}
                disabled={disableUpdateVehiculo}
                max={4}
                onChange={(value) =>
                  setVehiculo({
                    ...vehiculo,
                    anio: value,
                  })
                }
              />
              <MyInput
                title="Color"
                _key="color"
                value={vehiculo["color"]}
                disabled={disableUpdateVehiculo}
                onChange={(e) =>
                  setVehiculo({
                    ...vehiculo,
                    color: e.target.value,
                  })
                }
              />
              <MyInput
                title="Marca"
                _key="marca"
                value={vehiculo["marca"]}
                disabled={disableUpdateVehiculo}
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
                value={vehiculo["modelo"]}
                disabled={disableUpdateVehiculo}
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
                value={vehiculo["observaciones"]}
                disabled={disableUpdateVehiculo}
                onChange={(e) =>
                  setVehiculo({
                    ...vehiculo,
                    observaciones: e.target.value,
                  })
                }
              />
              {!disableUpdateVehiculo && (
                <MyButton name="Actualizar" load={loadButton} />
              )}
              <MyButton
                name="Editar"
                type="button"
                onClick={() => setDisableUpdateVehiculo(!disableUpdateVehiculo)}
              />
            </form>
          </div>
        </WindowScreen>
      )}
      {openModalCreate && (
        <WindowScreen title="Crear Vehiculo" size={50}>
          <div className="container_modal">
            <form
              id={formIdCreate}
              className="form-modal"
              onSubmit={createVehiculo}
            >
              <MyInput
                title="N° Placa"
                _key="numero_placa"
                value={vehiculo["numero_placa"]}
                required={true}
                onChange={(e) =>
                  setVehiculo({
                    ...vehiculo,
                    numero_placa: e.target.value,
                  })
                }
              />
              <MyInputNumber
                title="N° Documento"
                _key="numero_documento"
                value={vehiculo["numero_documento"]}
                required={true}
                max={11}
                onChange={(value) =>
                  setVehiculo({
                    ...vehiculo,
                    numero_documento: value,
                  })
                }
              />
              <MyInputNumber
                title="N° Serie"
                _key="numero_serie"
                value={vehiculo["numero_serie"]}
                required={true}
                onChange={(value) =>
                  setVehiculo({
                    ...vehiculo,
                    numero_serie: value,
                  })
                }
              />
              <MyInputNumber
                title="N° Pasajeros"
                _key="numero_pasajeros"
                value={vehiculo["numero_pasajeros"]}
                max={2}
                required={true}
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
                value={vehiculo["numero_asientos"]}
                max={2}
                required={true}
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
                value={vehiculo["anio"]}
                max={4}
                required={true}
                onChange={(value) =>
                  setVehiculo({
                    ...vehiculo,
                    anio: value,
                  })
                }
              />
              <MyInput
                title="Color"
                _key="color"
                value={vehiculo["color"]}
                required={true}
                onChange={(e) =>
                  setVehiculo({
                    ...vehiculo,
                    color: e.target.value,
                  })
                }
              />
              <MyInput
                title="Marca"
                _key="marca"
                value={vehiculo["marca"]}
                required={true}
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
                value={vehiculo["modelo"]}
                required={true}
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
                value={vehiculo["observaciones"]}
                required={true}
                onChange={(e) =>
                  setVehiculo({
                    ...vehiculo,
                    observaciones: e.target.value,
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
