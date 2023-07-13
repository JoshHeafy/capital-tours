import { useContext, useEffect, useState } from "react";
import MyInputNumber from "./Inputs/MyInputNumber";
import { MyContext } from "@/context/MyContext";
const MyTable = ({
  data = [], //Lista de datos traidos de la API
  titulos = [], //Es las cabeceras que deseas poner en la tabla
  campos = [], //Son las claves traidas de la API
  filtro = "", //Es el campo de la tabla por el cual se hara el filtro
  detalle = false, //Mostrar la ventama de detalle y editar
  apiProp = "", //Es el parametro que va en la consulta de api si es que la tiene
  color = false,
  detalleName = "Ver Detalles",
}) => {
  const [filterValue, setFilterValue] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const { setOpenModalDetail, setApiProp } = useContext(MyContext);

  useEffect(() => {
    if (filtro.length > 0) {
      const filtered = data.filter((dat) => {
        return dat[filtro].includes(filterValue);
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [data, filtro, filterValue]);

  return (
    <>
      {filtro.length > 0 && (
        <div className="filtro">
          <h5>Filtrar por: </h5>
          <MyInputNumber
            value={filterValue}
            title={filtro.toUpperCase()}
            max={11}
            onChange={(value) => setFilterValue(value)}
          />
        </div>
      )}
      <table className="my_table">
        <thead className="head_table">
          <tr>
            {titulos.map((titulo, index) => (
              <th key={index}>{titulo}</th>
            ))}
            {detalle && <th />}
          </tr>
        </thead>
        <tbody className="body_table">
          {filteredData.map((dat, i) => (
            <tr key={i}>
              {campos.map((campo, index) => (
                <td key={index}>
                  {color && index === campos.length - 1 ? (
                    <span
                      className="color-table"
                      style={{
                        background:
                          typeof dat[campo] === "string"
                            ? dat[campo]
                            : dat[campo] === 0
                            ? "#ff7782"
                            : "#41f1b6",
                      }}
                    ></span>
                  ) : (
                    dat[campo]
                  )}
                </td>
              ))}
              {detalle && (
                <td
                  onClick={() => {
                    setApiProp(dat[apiProp]);
                    setOpenModalDetail(true);
                  }}
                  className="success editable"
                >
                  {detalleName}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default MyTable;
