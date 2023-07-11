"use client";

import ConductoresPage from "@/components/dashboard/ConductoresPage";
import ConfiguracionPage from "@/components/dashboard/ConfiguracionPage";
import FaqPage from "@/components/dashboard/FaqPage";
import InicioPage from "@/components/dashboard/InicioPage";
import PropietariosPage from "@/components/dashboard/PropietariosPage";
import VehiculosPage from "@/components/dashboard/VehiculosPage";
import { useState } from "react";

export default function adminPage() {
  const [activePage, setActivePage] = useState(1);

  return (
    <div className="container_admin">
      <div className="sidebar_section">
        <div className="top_section">
          <div className="card_admin">
            <div className="user_image">
              <img src="/img/user.png" alt="user" />
            </div>
            <div className="user_name">
              <h4>Manolo Rojas</h4>
              <p>Supervisor</p>
            </div>
          </div>
        </div>
        <div className="body_section">
          <div className="card_admin">
            <ul>
              <li
                className={activePage === 1 ? "active" : ""}
                onClick={() => setActivePage(1)}
              >
                <i className="bx bx-home" />
                <a>Inicio</a>
              </li>
              <li
                className={activePage === 2 ? "active" : ""}
                onClick={() => setActivePage(2)}
              >
                <i className="bx bxs-car-garage" />
                <a>Vehículos</a>
              </li>
              <li
                className={activePage === 3 ? "active" : ""}
                onClick={() => setActivePage(3)}
              >
                <i className="bx bxs-user-rectangle" />
                <a>Propietarios</a>
              </li>
              <li
                className={activePage === 4 ? "active" : ""}
                onClick={() => setActivePage(4)}
              >
                <i className="bx bx-user" />
                <a>Conductores</a>
              </li>
              <hr className="divider" />
              <li
                className={activePage === 5 ? "active" : ""}
                onClick={() => setActivePage(5)}
              >
                <i className="bx bxs-cog" />
                <a>Configuración</a>
              </li>
              <li
                className={activePage === 6 ? "active" : ""}
                onClick={() => setActivePage(6)}
              >
                <i className="bx bx-cog" />
                <a>FAQ</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="pages_section">
        <div className="top_pages">
          <div className="card_admin"></div>
        </div>
        <div className="body_pages">
          <div className="card_admin">
            {activePage === 1 && <InicioPage />}
            {activePage === 2 && <VehiculosPage />}
            {activePage === 3 && <PropietariosPage />}
            {activePage === 4 && <ConductoresPage />}
            {activePage === 5 && <ConfiguracionPage />}
            {activePage === 6 && <FaqPage />}
          </div>
        </div>
      </div>
    </div>
  );
}
