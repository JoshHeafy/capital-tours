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

export default function SuscripcionesPage() {
  const formIdCreate = "id_" + uuidv4();
  const {
    openModalDetail,
    setOpenModalDetail,
    apiProp,
    openModalCreate,
    setOpenModalCreate,
  } = useContext(MyContext);
  const [loadButton, setLoadButton] = useState(false);
  const [loadButtonBaja, setLoadButtonBaja] = useState(false);
  const [loadButtonAlta, setLoadButtonAlta] = useState(false);
  const [suscripciones, setSuscripciones] = useState([]);
  const [suscripcion, setSuscripcion] = useState({
    numero_documento: "",
    numero_placa: "",
    numero_flota: 0,
    years: 2023,
    months: 1,
    importe: 0,
    fecha_inicio: "",
    fecha_pago: "",
  });
  const [comprobante, setComprobante] = useState({
    numero_documento: "", //
    tipo: "01",
    numero_serie: "0001",
    numero_comprobante: "00001",
    fecha_pago: "", //
    importe: 0, //
    igv: 0,
    descuento: 0,
    total: 0,
    observaciones: "",
    id_inscripcion: "",
  });

  const getSuscripciones = async () => {
    await API("inscripciones/list").then((res) => {
      if (res["inscripciones"]) {
        setSuscripciones(res["inscripciones"]);
      }
    });
  };

  const darBajaVehiculo = async () => {
    setLoadButtonBaja(true);
    await API(`inscripciones/service-baja/${apiProp}`, { method: "PUT" }).then(
      (resp) => {
        if (resp["estado"] === 0) {
          setLoadButtonBaja(false);
          setOpenModalDetail(false);
          getSuscripciones();
          toast.success("Se dió de baja a este vehiculo con éxito!");
        } else {
          setLoadButtonBaja(false);
          toast.error("No se pudo dar de baja a este vehiculo");
        }
      }
    );
  };

  const darAltaVehiculo = async () => {
    setLoadButtonAlta(true);
    await API(`inscripciones/service-alta/${apiProp}`, { method: "PUT" }).then(
      (resp) => {
        if (resp["estado"] === 1) {
          setLoadButtonAlta(false);
          setOpenModalDetail(false);
          getSuscripciones();
          toast.success("Se dió de alta a este vehiculo con éxito!");
        } else {
          setLoadButtonAlta(false);
          toast.error("No se pudo dar de alta a este vehiculo");
        }
      }
    );
  };

  const createComprobante = async (idInscripcion) => {
    let dataSend = comprobante;
    dataSend["id_inscripcion"] = idInscripcion;
    await API("comprobantes/create", {
      data: dataSend,
      method: "POST",
    }).then((resp) => {
      if (resp !== {}) {
        setLoadButton(false);
        setOpenModalDetail(false);
        setOpenModalCreate(false);
        getSuscripciones();
        toast.success("El registro se completó correctamente");
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
        if (resp !== {}) {
          createComprobante(resp["id_inscripcion"]);
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
    getSuscripciones();
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="pages">
        <h2>SUSCRIPCIONES</h2>
        <div className="table">
          <MyTable
            data={suscripciones}
            apiProp="numero_placa"
            filtro="numero_documento"
            color={true}
            detalle={true}
            detalleName="Gestionar"
            titulos={[
              "N° Doc",
              "N° Placa",
              "N° Flota",
              "Fecha Inicio",
              "Fecha Pago",
              "Estado",
            ]}
            campos={[
              "numero_documento",
              "numero_placa",
              "numero_flota",
              "fecha_inicio",
              "fecha_pago",
              "estado",
            ]}
          />
          <div className="create_registro">
            <MyButton
              name="Agregar Suscripción"
              onClick={() => setOpenModalCreate(true)}
            />
          </div>
        </div>
      </div>
      {openModalDetail && (
        <WindowScreen title={"Gestionar Vehiculo - " + apiProp} size={30}>
          <div className="container_modal">
            <div className="group_buttons">
              <h5>Baja</h5>
              <h5>Alta</h5>
              <p>Cancelar servicio de este vehículo</p>
              <p>Contratar servicio de vehículo</p>
              <MyButton
                name="Dar de Baja"
                type="button"
                load={loadButtonBaja}
                onClick={() => darBajaVehiculo()}
              />
              <MyButton
                name="Dar de Alta"
                type="button"
                load={loadButtonAlta}
                onClick={() => darAltaVehiculo()}
              />
            </div>
          </div>
        </WindowScreen>
      )}
      {openModalCreate && (
        <WindowScreen title="Crear Suscripción" size={70}>
          <div className="container_modal big">
            <h5 className="modal_warning">
              Ojo:
              <span>
                - Para crear la suscripción es necesario un documento y placa ya
                registrado
              </span>
            </h5>
            <form
              id={formIdCreate}
              className="form-modal"
              onSubmit={createSuscripcion}
            >
              <MyInput
                title="N° Documento"
                _key="numero_documento"
                value={suscripcion["numero_documento"]}
                required={true}
                onChange={(e) => {
                  setSuscripcion({
                    ...suscripcion,
                    numero_documento: e.target.value,
                  });
                  setComprobante({
                    ...comprobante,
                    numero_documento: e.target.value,
                  });
                }}
              />
              <MyInput
                title="N° Placa"
                _key="numero_placa"
                value={suscripcion["numero_placa"]}
                required={true}
                onChange={(e) =>
                  setSuscripcion({
                    ...suscripcion,
                    numero_placa: e.target.value,
                  })
                }
              />
              <MyInputNumber
                title="N° Flota"
                _key="numero_flota"
                value={suscripcion["numero_flota"]}
                required={true}
                max={3}
                onChange={(value) =>
                  setSuscripcion({
                    ...suscripcion,
                    numero_flota: value,
                  })
                }
              />
              <MyInputNumber
                title="Importe"
                _key="importe"
                value={suscripcion["importe"]}
                max={4}
                required={true}
                onChange={(value) => {
                  setSuscripcion({
                    ...suscripcion,
                    importe: value,
                  });
                  setComprobante({
                    ...comprobante,
                    importe: value,
                  });
                }}
              />
              <MyInputNumber
                title="Año Actual"
                _key="years"
                value={suscripcion["years"]}
                max={4}
                required={true}
                onChange={(value) =>
                  setSuscripcion({
                    ...suscripcion,
                    years: value,
                  })
                }
              />
              <MyInputNumber
                title="Mes Actual"
                _key="months"
                value={suscripcion["months"]}
                max={2}
                required={true}
                onChange={(value) =>
                  setSuscripcion({
                    ...suscripcion,
                    months: value,
                  })
                }
              />
              <MyInput
                title="Fecha Inicio"
                _key="fecha_inicio"
                placeholder="dd/mm/aaaa"
                disableLabel={true}
                value={suscripcion["fecha_inicio"]}
                required={true}
                onChange={(e) =>
                  setSuscripcion({
                    ...suscripcion,
                    fecha_inicio: e.target.value,
                  })
                }
              />
              <MyInput
                title="Fecha Pago"
                _key="fecha_pago"
                placeholder="dd/mm/aaaa"
                disableLabel={true}
                value={suscripcion["fecha_pago"]}
                required={true}
                onChange={(e) => {
                  setSuscripcion({
                    ...suscripcion,
                    fecha_pago: e.target.value,
                  });
                  setComprobante({
                    ...comprobante,
                    fecha_pago: e.target.value,
                  });
                }}
              />
              {/* ------ Complement comprobante ------ */}
              <MyInput
                title="Tipo Comprobante"
                disableLabel={true}
                value={comprobante["tipo"]}
                required={true}
                onChange={(e) => {
                  setComprobante({
                    ...comprobante,
                    tipo: e.target.value,
                  });
                }}
              />
              <MyInput
                title="N° Serie"
                disableLabel={true}
                value={comprobante["numero_serie"]}
                required={true}
                onChange={(e) => {
                  setComprobante({
                    ...comprobante,
                    numero_serie: e.target.value,
                  });
                }}
              />
              <MyInput
                title="N° Comprobante"
                disableLabel={true}
                value={comprobante["numero_comprobante"]}
                required={true}
                onChange={(e) => {
                  setComprobante({
                    ...comprobante,
                    numero_comprobante: e.target.value,
                  });
                }}
              />
              <MyInputNumber
                title="IGV"
                disableLabel={true}
                value={comprobante["igv"]}
                required={true}
                max={5}
                onChange={(value) => {
                  setComprobante({
                    ...comprobante,
                    igv: value,
                  });
                }}
              />
              <MyInputNumber
                title="Descuento"
                disableLabel={true}
                value={comprobante["descuento"]}
                max={4}
                onChange={(value) => {
                  setComprobante({
                    ...comprobante,
                    descuento: value,
                  });
                }}
              />
              <MyInputNumber
                title="Total"
                disableLabel={true}
                value={comprobante["total"]}
                required={true}
                max={5}
                onChange={(value) => {
                  setComprobante({
                    ...comprobante,
                    total: value,
                  });
                }}
              />
              <MyInput
                title="Observaciones"
                disableLabel={true}
                value={comprobante["observaciones"]}
                onChange={(e) => {
                  setComprobante({
                    ...comprobante,
                    observaciones: e.target.value,
                  });
                }}
              />
              <MyButton name="Crear" load={loadButton} />
            </form>
          </div>
        </WindowScreen>
      )}
    </>
  );
}
