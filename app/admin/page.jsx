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

export default function adminPage() {
  const {setOpenModalDetail} = useContext(MyContext)
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const [showAside, setShowAside] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [indexPage, setIndexPage] = useState(0);
  const [solicitudesLength, setSolicitudesLength] = useState(0);

  const togglePages = (index) => {
    setIndexPage(index);
    setOpenModalDetail(false);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const toggleMenu = () => {
    setShowAside(!showAside);
  };

  const logout = () => {
    setLoader(true);
    Cookies.remove("token");
    router.push("/");
  };

  const loadSolicitudes = async () => {
    await API("solicitudes/list").then((resp) => {
      if (resp["solicitudes"]) {
        setSolicitudesLength(resp["solicitudes"].length);
      }
    });
  };

  useEffect(() => {
    loadSolicitudes();
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
                <i className="bx bx-spreadsheet" />
                <h3>Comprobantes</h3>
              </a>
              <a
                className={indexPage === 5 ? "active" : ""}
                onClick={() => togglePages(5)}
              >
                <i className="bx bxs-receipt" />
                <h3>Solicitudes</h3>
                <span className="message-count">{solicitudesLength}</span>
              </a>
              <a
                className={indexPage === 6 ? "active" : ""}
                onClick={() => togglePages(6)}
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
            {indexPage === 4 && <ComprobantesPage />}
            {indexPage === 5 && <SolicitudesPage />}
            {indexPage === 6 && <ConfiguracionPage />}
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
                    Hey, <b>Josh</b>
                  </p>
                  <small className="text-muted">Supervisor</small>
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
                <div className="update">
                  <div className="profile-photo">
                    <img src="/images/profile-2.jpg" />
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
                    <img src="/images/profile-3.jpg" />
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
                    <img src="/images/profile-4.jpg" />
                  </div>
                  <div className="message">
                    <p>
                      <b>Alice Hell</b> received his order of Night lion tech
                      GPS drone
                    </p>
                    <small className="text-muted">2 Minutes Ago</small>
                  </div>
                </div>
              </div>
            </div>
            {/* ------------ END OF RECENT UPDATES ------------ */}
            <div className="sales-analytics">
              <h2>Analítica de Suscripciones</h2>
              <div className="item online">
                <div className="icon">
                  <i className="bx bxs-cart" />
                </div>
                <div className="right">
                  <div className="info">
                    <h3>SOLICITUDES ONLINE</h3>
                    <small className="text-muted">Last 24 Hours</small>
                  </div>
                  <h5 className="success">+39%</h5>
                  <h3>20</h3>
                </div>
              </div>
              <div className="item offline">
                <div className="icon">
                  <i className="bx bxs-shopping-bag" />
                </div>
                <div className="right">
                  <div className="info">
                    <h3>SOLICITUDES OFFLINE</h3>
                    <small className="text-muted">Last 24 Hours</small>
                  </div>
                  <h5 className="danger">-17%</h5>
                  <h3>2</h3>
                </div>
              </div>
              <div className="item customers">
                <div className="icon">
                  <i className="bx bxs-user" />
                </div>
                <div className="right">
                  <div className="info">
                    <h3>NUEVAS SUSCRIPCIONES</h3>
                    <small className="text-muted">Last 24 Hours</small>
                  </div>
                  <h5 className="success">+25%</h5>
                  <h3>35</h3>
                </div>
              </div>
              <div className="item add-product" onClick={() => togglePages(1)}>
                <div>
                  <i className="bx bx-plus" />
                  <h3>Nuevo Propietario</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
