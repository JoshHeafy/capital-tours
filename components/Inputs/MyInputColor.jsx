import { useState } from "react";

const MyInputColor = ({ title = "Color", icon = "", ...props }) => {
  const [colorIcon, setColorIcon] = useState("");

  const handleColorChange = (e) => {
    setColorIcon(e.target.value);
  };

  return (
    <div className="inputColor">
      <label>{title}</label>
      <i className={icon} style={{ color: colorIcon }}></i>
      
      {/* Dropdown (select) con colores */}
      <select
        value={colorIcon}
        onChange={handleColorChange}
        {...props}
      >
        <option value="">Selecciona un color</option>
        <option value="red">Rojo</option>
        <option value="black">Negro</option>
        <option value="blue">Azul</option>
        <option value="yellow">Amarillo</option>
        <option value="white">Blanco</option>
        <option value="gray">Gris</option>
        <option value="green">Verde</option>
        <option value="orange">Naranja</option>
        <option value="silver">Plata</option>
        <option value="purple">Morado</option>
        <option value="brown">Marrón</option>
      </select>

      {/* Input oculto para enviar el valor seleccionado */}
      <input
        type="hidden"
        name={props.name}
        value={colorIcon}
        {...props}
      />
    </div>
  );
};

export default MyInputColor;
