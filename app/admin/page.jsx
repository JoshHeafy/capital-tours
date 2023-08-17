"use client";

import Loader from "@/components/Loader";
import ConfiguracionPage from "@/components/dashboard/ConfiguracionPage";
import InicioPage from "@/components/dashboard/InicioPage";
import PropietariosPage from "@/components/dashboard/PropietariosPage";
import SolicitudesPage from "@/components/dashboard/SolicitudesPage";
import VehiculosPage from "@/components/dashboard/VehiculosPage";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import SuscripcionesPage from "@/components/dashboard/SuscripcionesPage";
import { API } from "@/library/api";
import ComprobantesPage from "@/components/dashboard/ComprobantesPage";
import { MyContext } from "@/context/MyContext";
import PagosPage from "@/components/dashboard/PagosPage";
import WindowScreen from "@/components/Window";
import { v4 as uuidv4 } from "uuid";
import MyInputNumber from "@/components/Inputs/MyInputNumber";
import { newDataGenerate, toCapitalice } from "@/library/functions";
import MyInput from "@/components/Inputs/MyInput";
import MySelect from "@/components/select/MySelect";
import MyButton from "@/components/buttons/MyButton";
import { toast } from "react-toastify";

export default function adminPage() {
  const formIdCreateProp = "id_" + uuidv4();
  const { openModal, setOpenModal } = useContext(MyContext);
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
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const [showAside, setShowAside] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [indexPage, setIndexPage] = useState(0);
  const [loadButton, setLoadButton] = useState(false);
  const [maxLengthNDocumento, setMaxLengthNDocumento] = useState(8);
  const [dataUser, setDataUser] = useState({});

  const [solicitudesRecibidas, setSolicitudesRecibidas] = useState(0);
  const [solicitudesSinLeer, setSolicitudesSinLeer] = useState(0);
  const [ultimaSolicitud, setUltimaSolicitud] = useState("");

  const [recentUpdates, setRecentUpdates] = useState([]);

  const togglePages = (index) => {
    setIndexPage(index);
    setOpenModal(false);
  };

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    Cookies.set("dark-mode", newDarkMode.toString(), { expires: 365 });
  };

  const toggleMenu = () => {
    setShowAside(!showAside);
  };

  const logout = () => {
    setLoader(true);
    Cookies.remove("token");
    Cookies.remove("data-user");
    router.push("/");
  };

  const loadSolicitudes = async () => {
    await API("solicitudes/list").then((resp) => {
      if (resp["solicitudes"]) {
        let leidasTmp = 0;
        let sinLeerTmp = 0;
        let ultimaSoliTmp = "";

        let i = 0;
        for (const s of resp["solicitudes"]) {
          i++;
          if (s.leido == 0) {
            recentUpdates.push(s);
            sinLeerTmp++;
          }
          if (s.leido == 1) {
            leidasTmp++;
          }
          if (i == resp.solicitudes.length) {
            ultimaSoliTmp = new Date(s.fecha_solicitud).toLocaleDateString();
          }
        }

        setSolicitudesRecibidas(leidasTmp);
        setSolicitudesSinLeer(sinLeerTmp);
        setUltimaSolicitud(ultimaSoliTmp);
      }
    });
  };

  const createPropietario = async (e) => {
    e.preventDefault();
    setLoadButton(true);
    var result = newDataGenerate(formIdCreateProp);
    if (result.status) {
      await API("propietarios/create", {
        data: result.data,
        method: "POST",
      }).then((resp) => {
        if (resp["numero_documento"]) {
          setLoadButton(false);
          setOpenModal(false);
          toast.success("Propietario creado con éxito!");
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
    loadSolicitudes();
    const darkModeCookie = Cookies.get("dark-mode");
    if (darkModeCookie !== undefined) {
      setDarkMode(darkModeCookie === "true");
    }
    const dataUserTmp = JSON.parse(Cookies.get("data-user"));
    setDataUser(dataUserTmp);
  }, []);

  return (
    <>
      {loader && <Loader />}
      <div
        className={darkMode ? "dashboard dark-theme-variables" : "dashboard"}
      >
        <div className="container">
          <aside className={showAside ? "active-aside" : ""}>
            <div className="top">
              <div className="logo">
                <img src="/img/logo.png" />
                <h2>
                  Capital<span className="success">Tours</span>
                </h2>
              </div>
              <div
                className="close"
                id="close-btn"
                onClick={() => toggleMenu()}
              >
                <i className="bx bx-x" />
              </div>
            </div>
            <div className="sidebar">
              <a
                className={indexPage === 0 ? "active" : ""}
                onClick={() => togglePages(0)}
              >
                <i className="bx bxs-dashboard" />
                <h3>Dashboard</h3>
              </a>
              <a
                className={indexPage === 1 ? "active" : ""}
                onClick={() => togglePages(1)}
              >
                <i className="bx bx-user" />
                <h3>Propietarios</h3>
              </a>
              <a
                className={indexPage === 2 ? "active" : ""}
                onClick={() => togglePages(2)}
              >
                <i className="bx bxs-car-garage" />
                <h3>Vehículos</h3>
              </a>
              <a
                className={indexPage === 3 ? "active" : ""}
                onClick={() => togglePages(3)}
              >
                <i className="bx bx-money-withdraw" />
                <h3>Suscripciones</h3>
              </a>
              <a
                className={indexPage === 4 ? "active" : ""}
                onClick={() => togglePages(4)}
              >
                <i className="bx bx-money" />
                <h3>Pagos</h3>
              </a>
              <a
                className={indexPage === 5 ? "active" : ""}
                onClick={() => togglePages(5)}
              >
                <i className="bx bx-spreadsheet" />
                <h3>Comprobantes</h3>
              </a>
              <a
                className={indexPage === 6 ? "active" : ""}
                onClick={() => togglePages(6)}
              >
                <i className="bx bxs-receipt" />
                <h3>Solicitudes</h3>
                {solicitudesSinLeer > 0 && (
                  <span className="message-count">{solicitudesSinLeer}</span>
                )}
              </a>
              <a
                className={indexPage === 7 ? "active" : ""}
                onClick={() => togglePages(7)}
              >
                <i className="bx bx-cog" />
                <h3>Configuración</h3>
              </a>
              <a onClick={() => logout()}>
                <i className="bx bx-log-out" />
                <h3>Logout</h3>
              </a>
            </div>
          </aside>
          {/* ------------------------- END OF ASIDE ------------------------- */}
          <div>
            {indexPage === 0 && <InicioPage />}
            {indexPage === 1 && <PropietariosPage />}
            {indexPage === 2 && <VehiculosPage />}
            {indexPage === 3 && <SuscripcionesPage />}
            {indexPage === 4 && <PagosPage />}
            {indexPage === 5 && <ComprobantesPage />}
            {indexPage === 6 && <SolicitudesPage />}
            {indexPage === 7 && <ConfiguracionPage />}
          </div>
          {/* ------------ END OF MAIN ------------ */}
          <div className="right">
            <div className="top">
              <button id="menu-btn" onClick={() => toggleMenu()}>
                <i className="bx bx-menu" />
              </button>
              <div className="theme-toggler" onClick={() => toggleTheme()}>
                <i className={!darkMode ? "bx bxs-sun active" : "bx bxs-sun"} />
                <i
                  className={darkMode ? "bx bxs-moon active" : "bx bxs-moon"}
                />
              </div>
              <div className="profile">
                <div className="info">
                  <p>
                    Hey, <b>{dataUser.nombre}</b>
                  </p>
                  <small className="text-muted">{dataUser.username}</small>
                </div>
                <div className="profile-photo">
                  <img src="/images/profile-1.jpg" />
                </div>
              </div>
            </div>
            {/* ------------ END OF TOP ------------ */}
            <div className="recent-updates">
              <h2>Recent Updates</h2>
              <div className="updates">
                {recentUpdates.length > 0 ? (
                  recentUpdates.map((soli, i) => {
                    if (i < 4) {
                      return (
                        <div key={i} className="update">
                          <div className="profile-photo">
                            <img src="/images/profile_user.jpg" />
                          </div>
                          <div className="message">
                            <p>
                              <b>{toCapitalice(soli.nombre)}</b> acaba de enviar
                              una solicitud
                            </p>
                          </div>
                        </div>
                      );
                    }
                  })
                ) : (
                  <h5>No hay solicitudes recientes</h5>
                )}

                {/* <div className="update">
                  <div className="profile-photo">
                    <img src="/images/icon-user.png" />
                  </div>
                  <div className="message">
                    <p>
                      <b>Richard Hendricks</b> has reserved a quick compression
                    </p>
                    <small className="text-muted">2 Minutes Ago</small>
                  </div>
                </div>
                <div className="update">
                  <div className="profile-photo">
                    <img src="/images/icon-user.png" />
                  </div>
                  <div className="message">
                    <p>
                      <b>Susan Lozano</b> received his order of Night lion tech
                      GPS drone
                    </p>
                    <small className="text-muted">2 Minutes Ago</small>
                  </div>
                </div>
                <div className="update">
                  <div className="profile-photo">
                    <img src="/images/icon-user.png" />
                  </div>
                  <div className="message">
                    <p>
                      <b>Alice Hell</b> received his order of Night lion tech
                      GPS drone
                    </p>
                    <small className="text-muted">2 Minutes Ago</small>
                  </div>
                </div> */}
              </div>
            </div>
            {/* ------------ END OF RECENT UPDATES ------------ */}
            <div className="sales-analytics">
              <h2>Analítica de Solicitudes</h2>
              <div className="item online">
                <div className="icon">
                  <i className="bx bx-mail-send" />
                </div>
                <div className="right">
                  <div className="info">
                    <h3>SOLICITUDES RECIBIDAS</h3>
                    {/* <small className="text-muted">Last 24 Hours</small> */}
                  </div>
                  <h5 className="success">{solicitudesRecibidas}</h5>
                </div>
              </div>
              <div className="item offline">
                <div className="icon">
                  <i className="bx bx-envelope" />
                </div>
                <div className="right">
                  <div className="info">
                    <h3>SOLICITUDES SIN LEER</h3>
                    {/* <small className="text-muted">Last 24 Hours</small> */}
                  </div>
                  <h5 className="danger">{solicitudesSinLeer}</h5>
                </div>
              </div>
              <div className="item customers">
                <div className="icon">
                  <i className="bx bxs-user" />
                </div>
                <div className="right">
                  <div className="info">
                    <h3>ÚLTIMA SOLICITUD</h3>
                    {/* <small className="text-muted">Last 24 Hours</small> */}
                  </div>
                  <h5 className="success">{ultimaSolicitud}</h5>
                </div>
              </div>
              <div
                className="item add-product"
                onClick={() => {
                  setOpenModal(true);
                }}
              >
                <div>
                  <i className="bx bx-plus" />
                  <h3>Nuevo Propietario</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        {openModal && (
          <WindowScreen title="Crear Propietario">
            <div className="container_modal">
              <form
                id={formIdCreateProp}
                className="form-modal"
                onSubmit={createPropietario}
              >
                <MySelect
                  title="Tipo de Documento"
                  options={tipoDoc}
                  _key="tipo_documento"
                  required={true}
                  onChange={(e) => {
                    if (e.target.value == 6) {
                      setMaxLengthNDocumento(11);
                    } else if (e.target.value == 1) {
                      setMaxLengthNDocumento(8);
                    }
                  }}
                />
                <MyInputNumber
                  title="N° Documento"
                  _key="numero_documento"
                  max={maxLengthNDocumento}
                  required={true}
                />
                <MyInput
                  title="Nombre"
                  _key="nombre_propietario"
                  required={true}
                />
                <MyInput title="Dirección" _key="direccion" required={true} />
                <MyInput title="Referencia" _key="referencia" />
                <MyInputNumber title="Teléfono" _key="telefono" max={9} />
                <MyInput title="Email" _key="email" type="email" />
                <MyButton name="Crear" load={loadButton} />
              </form>
            </div>
          </WindowScreen>
        )}
      </div>
    </>
  );
}
