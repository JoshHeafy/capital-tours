"use client";
import { API } from "@/library/api";
import { useEffect, useState } from "react";
import DonutChart from "../analytics/DonutChart";
import { ToastContainer } from "react-toastify";

export default function InicioPage() {
  const [dataAnalytics, setDataAnalytics] = useState({
    ingresos: {
      faltante: 50,
      total: 100,
    },
    pagos: {
      faltante: 30,
      total: 100,
    },
    suscripciones: {
      faltante: 20,
      total: 100,
    },
  });
  const [dateValue, setDateValue] = useState("");
  const [dateAnalytics, setDateAnalytics] = useState("");
  const [lastDateInfo, setLastDateInfo] = useState("Last 24 Hours");

  const loadDateNow = () => {
    // String format
    var hoyStr = new Date();
    var fechaHoyStr =
      ("0" + hoyStr.getDate()).slice(-2) +
      "/" +
      ("0" + (hoyStr.getMonth() + 1)).slice(-2) +
      "/" +
      hoyStr.getFullYear();
    getAnalytics(fechaHoyStr);

    // Input Format
    var hoy = new Date();
    var fechaHoy =
      hoy.getFullYear() +
      "-" +
      ("0" + (hoy.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + hoy.getDate()).slice(-2);
    setDateValue(fechaHoy);
  };
  // DONUTCHARTDATA
  const [chrIngresosData, setChrIngresosData] = useState({
    labels: ["Ingresos", "Por cumplir"],
    datasets: [
      {
        data: [100, 50],
        backgroundColor: ["#4CE5B1", "#ff7782"],
        hoverBackgroundColor: ["#276579"],
      },
    ],
  });

  const [chrPagosData, setChrPagosData] = useState({
    labels: ["Pagos", "Por cumplir"],
    datasets: [
      {
        data: [100, 30],
        backgroundColor: ["#4CE5B1", "#ff7782"],
        hoverBackgroundColor: ["#276579"],
      },
    ],
  });

  const [chrSuscripcionesData, setChrSuscripcionesData] = useState({
    labels: ["Suscripciones", "Por cumplir"],
    datasets: [
      {
        data: [100, 20],
        backgroundColor: ["#4CE5B1", "#ff7782"],
        hoverBackgroundColor: ["#276579"],
      },
    ],
  });

  const [suscripciones, setSuscripciones] = useState([]);

  const getSuscripciones = async () => {
    await API("inscripciones/list-last").then((res) => {
      if (res["inscripciones"]) {
        setSuscripciones(res["inscripciones"]);
      }
    });
  };

  const getAnalytics = async (date) => {
    await API("analytics/dashboard", {
      data: { date: date },
      method: "POST",
    }).then((res) => {
      if (res["ingresos"]) {
        const ing = res.ingresos;
        const pag = res.pagos;
        const sus = res.suscripciones;
        setChrIngresosData((prevData) => ({
          ...prevData,
          datasets: [
            {
              ...prevData.datasets[0],
              data: [ing.total, ing.faltante],
            },
          ],
        }));
        setChrPagosData((prevData) => ({
          ...prevData,
          datasets: [
            {
              ...prevData.datasets[0],
              data: [pag.total, pag.faltante],
            },
          ],
        }));
        setChrSuscripcionesData((prevData) => ({
          ...prevData,
          datasets: [
            {
              ...prevData.datasets[0],
              data: [sus.total, sus.faltante],
            },
          ],
        }));

        setDataAnalytics(res);
      }
    });
  };

  useEffect(() => {
    loadDateNow();
    getSuscripciones();
  }, []);

  useEffect(() => {
    if (dateAnalytics) {
      getAnalytics(dateAnalytics);
    }
  }, [dateAnalytics]);

  return (
    <>
      <ToastContainer />
      <div className="main">
        <h1>Dashboard</h1>
        <div className="date">
          <input
            type="date"
            value={dateValue}
            onChange={(e) => {
              var fecha = new Date(e.target.value + "T00:00:00");
              var options = {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              };
              var formatoCambiado = fecha.toLocaleDateString("es-PE", options);
              setDateAnalytics(formatoCambiado);
              setLastDateInfo(formatoCambiado);
              setDateValue(e.target.value);
            }}
          />
        </div>
        <div className="insights">
          <div className="sales">
            <i className="bx bx-bar-chart-square" />
            <div className="middle">
              <div className="left">
                <h3>Total Suscripciones</h3>
                <h1>{dataAnalytics.suscripciones.total}</h1>
              </div>
              <DonutChart data={chrSuscripcionesData} />
            </div>
            <small className="text-muted">{lastDateInfo}</small>
          </div>
          {/* ------------ END OF SALES ------------ */}
          <div className="expenses">
            <i className="bx bx-bar-chart-square" />
            <div className="middle">
              <div className="left">
                <h3>Total Pagos</h3>
                <h1>{dataAnalytics.pagos.total}</h1>
              </div>
              <DonutChart data={chrPagosData} />
            </div>
            <small className="text-muted">{lastDateInfo}</small>
          </div>
          {/* ------------ END OF EXPENSES ------------ */}
          <div className="income">
            <i className="bx bx-bar-chart-square" />
            <div className="middle">
              <div className="left">
                <h3>Total Ingresos</h3>
                <h1>S/.{dataAnalytics.ingresos.total}</h1>
              </div>
              <DonutChart data={chrIngresosData} />
            </div>
            <small className="text-muted">{lastDateInfo}</small>
          </div>
          {/* ------------ END OF INCOME ------------ */}
        </div>
        {/* ------------ END OF INSIGHTS ------------ */}
        <div className="recent-orders">
          <h2>Suscripciones Recientes</h2>
          <table className="my_table">
            <thead className="head_table">
              <tr>
                <th>N° Flota</th>
                <th>N° Doc</th>
                <th>N° Placa</th>
                <th>Fecha Inicio</th>
                <th>Estado</th>
                <th />
                <th />
              </tr>
            </thead>
            <tbody className="body_table">
              {suscripciones.map((suscripcion, i) => (
                <tr key={i}>
                  <td>{suscripcion.numero_flota}</td>
                  <td>{suscripcion.numero_documento}</td>
                  <td>{suscripcion.numero_placa}</td>
                  <td>{suscripcion.fecha_inicio}</td>
                  {suscripcion.estado === 0 ? (
                    <td className="danger">Inactivo</td>
                  ) : (
                    <td className="success">Activo</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
