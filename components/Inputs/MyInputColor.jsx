import { useEffect, useState } from "react";

const MyInputColor = ({ title = "Color", icon = "", ...props }) => {
  const [colorIcon, setColorIcon] = useState("");

  return (
    <div className="inputColor">
      <label>{title}</label>
      <i className={icon} style={{ color: colorIcon }}></i>
      <input
        type="color"
        onChange={(e) => {
          setColorIcon(e.target.value);
        }}
        {...props}
      />
    </div>
  );
};

export default MyInputColor;
