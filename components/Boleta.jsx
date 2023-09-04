export default function Boleta({
  refBoleta,
  numero_flota,
  numero_documento,
  numero_placa,
  periodo,
  fecha,
  importe,
  descuento,
  total,
  cliente,
  numero_comprobante,
}) {
  return (
    <div ref={refBoleta} className="boleta">
      <div className="empresa">
        <img className="logo" src="/img/logo.png" alt="Logo de New Capital" />
        <p>Capital Tours</p>
      </div>
      <h1 className="titulo">Boleta de Pago</h1>
      <p>
        <strong>N° Comprobante:</strong> {numero_comprobante}
      </p>
      <p>
        <strong>Cliente:</strong> {cliente}
      </p>
      <p>
        <strong>Fecha:</strong> {fecha}
      </p>
      <p>
        <strong>Periodo:</strong> {periodo}
      </p>
      <p>
        <strong>Número de Flota:</strong> {numero_flota}
      </p>
      <p>
        <strong>Número de Documento:</strong> {numero_documento}
      </p>
      <p>
        <strong>Número de Placa:</strong> {numero_placa}
      </p>
      <p>
        <strong>Importe:</strong> S/. {importe}
      </p>
      <p>
        <strong>Descuento:</strong> S/. {descuento}
      </p>
      <p className="total">
        <strong>Total:</strong> S/. {total}
      </p>
      <p className="footer">Gracias por su pago.</p>
    </div>
  );
}
