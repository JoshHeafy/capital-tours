import { API } from "@/library/api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyInput from "../Inputs/MyInput";
import { toCapitalice } from "@/library/functions";
import Boleta from "../Boleta";
import MyButton from "../buttons/MyButton";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ComprobantesPage() {
  const refBoleta = useRef(null);
  const [numeroFlota, setNumeroFlota] = useState(0);
  const [comprobantes, setComprobantes] = useState([]);
  const [showBoleta, setShowBoleta] = useState(false);
  const [comprobanteDetail, setComprobanteDetail] = useState({});

  const getComprobantes = async (numero_flota) => {
    await API(`comprobantes/info-to-admin/${numero_flota}`).then((res) => {
      if (res["comprobantes_detail"]) {
        setComprobantes(res["comprobantes_detail"]);
      }
    });
  };

  const downloadPDF = () => {
    const input = refBoleta.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "px", [485, 400]);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save("boleta.pdf");
    });
  };

  return (
    <>
      <ToastContainer />
      <div className="pages comprobantes">
        <h2>COMPROBANTES</h2>
        <div className="table">
          <div className="filtro">
            <h5>Ingrese número de flota:</h5>
            <div className="autocomplete">
              <MyInput
                title="Número de Flota"
                value={numeroFlota}
                required={true}
                onChange={(e) => {
                  setNumeroFlota(e.target.value);
                  setComprobantes([]);
                  setShowBoleta(false);
                }}
              />
            </div>
            <MyButton
              name="Buscar"
              onClick={() => {
                getComprobantes(numeroFlota);
              }}
            />
          </div>
          {comprobantes.length > 0 && (
            <table className="my_table">
              <thead className="head_table">
                <tr>
                  <th>N° Comprobante</th>
                  <th>N° Doc</th>
                  <th>Tipo</th>
                  <th>Fecha Pago</th>
                  <th />
                </tr>
              </thead>
              <tbody className="body_table">
                {comprobantes.map((comp, i) => (
                  <tr key={i}>
                    <td>{`${comp.numero_serie}-${comp.numero_comprobante}`}</td>
                    <td>{comp.numero_documento}</td>
                    <td>Efectivo</td>
                    <td>{comp.fecha}</td>
                    <td
                      className="success editable"
                      onClick={() => {
                        setComprobanteDetail(comprobantes[i]);
                        setShowBoleta(true);
                      }}
                    >
                      Ver detalle
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {showBoleta && (
          <>
            <Boleta
              refBoleta={refBoleta}
              numero_comprobante={`${comprobanteDetail.numero_serie}-${comprobanteDetail.numero_comprobante}`}
              cliente={toCapitalice(comprobanteDetail.cliente)}
              fecha={comprobanteDetail.fecha}
              numero_placa={comprobanteDetail.numero_placa}
              descuento={comprobanteDetail.descuento}
              importe={comprobanteDetail.importe}
              total={comprobanteDetail.importe - comprobanteDetail.descuento}
              numero_documento={comprobanteDetail.numero_documento}
              periodo={comprobanteDetail.periodo}
            />
            <MyButton name="Imprimir" onClick={() => downloadPDF()} />
          </>
        )}
      </div>
    </>
  );
}
