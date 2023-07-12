"use client";

import ConductoresPage from "@/components/dashboard/ConductoresPage";
import InicioPage from "@/components/dashboard/InicioPage";
import { useState } from "react";

export default function adminPage() {
  const [showAside, setShowAside] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [indexPage, setIndexPage] = useState(0);

  const togglePages = (index) => {
    setIndexPage(index);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const toggleMenu = () => {
    setShowAside(!showAside);
  };

  return (
    <div className={darkMode ? "dashboard dark-theme-variables" : "dashboard"}>
      <div className="container">
        <aside className={showAside ? "active-aside" : ""}>
          <div className="top">
            <div className="logo">
              <img src="/images/logo.png" />
              <h2>
                Capital<span className="danger">Tours</span>
              </h2>
            </div>
            <div className="close" id="close-btn" onClick={() => toggleMenu()}>
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
              <h3>Customers</h3>
            </a>
            <a
              className={indexPage === 2 ? "active" : ""}
              onClick={() => togglePages(2)}
            >
              <i className="bx bxs-receipt" />
              <h3>Orders</h3>
            </a>
            <a
              className={indexPage === 3 ? "active" : ""}
              onClick={() => togglePages(3)}
            >
              <i className="bx bx-stats" />
              <h3>Analytics</h3>
            </a>
            <a
              className={indexPage === 4 ? "active" : ""}
              onClick={() => togglePages(4)}
            >
              <i className="bx bx-message-dots" />
              <h3>Messages</h3>
              <span className="message-count">26</span>
            </a>
            <a
              className={indexPage === 5 ? "active" : ""}
              onClick={() => togglePages(5)}
            >
              <i className="bx bx-purchase-tag-alt" />
              <h3>Producs</h3>
            </a>
            <a
              className={indexPage === 6 ? "active" : ""}
              onClick={() => togglePages(6)}
            >
              <i className="bx bx-spreadsheet" />
              <h3>Reports</h3>
            </a>
            <a
              className={indexPage === 7 ? "active" : ""}
              onClick={() => togglePages(7)}
            >
              <i className="bx bx-cog" />
              <h3>Settings</h3>
            </a>
            <a
              className={indexPage === 8 ? "active" : ""}
              onClick={() => togglePages(8)}
            >
              <i className="bx bx-plus" />
              <h3>Add Product</h3>
            </a>
            <a>
              <i className="bx bx-log-out" />
              <h3>Logout</h3>
            </a>
          </div>
        </aside>
        {/* ------------------------- END OF ASIDE ------------------------- */}
        <div>
          {indexPage === 0 && <InicioPage />}
          {indexPage === 1 && <ConductoresPage />}
        </div>
        {/* ------------ END OF MAIN ------------ */}
        <div className="right">
          <div className="top">
            <button id="menu-btn" onClick={() => toggleMenu()}>
              <i className="bx bx-menu" />
            </button>
            <div className="theme-toggler" onClick={() => toggleTheme()}>
              <i className={!darkMode ? "bx bxs-sun active" : "bx bxs-sun"} />
              <i className={darkMode ? "bx bxs-moon active" : "bx bxs-moon"} />
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
                    <b>Mike Tyson</b> received his order of Night lion tech GPS
                    drone
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
                    <b>Mike Tyson</b> received his order of Night lion tech GPS
                    drone
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
                    <b>Mike Tyson</b> received his order of Night lion tech GPS
                    drone
                  </p>
                  <small className="text-muted">2 Minutes Ago</small>
                </div>
              </div>
            </div>
          </div>
          {/* ------------ END OF RECENT UPDATES ------------ */}
          <div className="sales-analytics">
            <h2>Sales Analytics</h2>
            <div className="item online">
              <div className="icon">
                <i className="bx bxs-cart" />
              </div>
              <div className="right">
                <div className="info">
                  <h3>ONLINE ORDERS</h3>
                  <small className="text-muted">Last 24 Hours</small>
                </div>
                <h5 className="success">+39%</h5>
                <h3>3849</h3>
              </div>
            </div>
            <div className="item offline">
              <div className="icon">
                <i className="bx bxs-shopping-bag" />
              </div>
              <div className="right">
                <div className="info">
                  <h3>OFFLINE ORDERS</h3>
                  <small className="text-muted">Last 24 Hours</small>
                </div>
                <h5 className="danger">-17%</h5>
                <h3>1100</h3>
              </div>
            </div>
            <div className="item customers">
              <div className="icon">
                <i className="bx bxs-user" />
              </div>
              <div className="right">
                <div className="info">
                  <h3>NEW CUSTOMERS</h3>
                  <small className="text-muted">Last 24 Hours</small>
                </div>
                <h5 className="success">+25%</h5>
                <h3>849</h3>
              </div>
            </div>
            <div className="item add-product">
              <div>
                <i className="bx bx-plus" />
                <h3>Add Product</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
