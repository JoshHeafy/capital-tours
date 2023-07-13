import { useState } from "react";

const MyInputNumber = ({
  title,
  max,
  onChange,
  disableLabel = false,
  ...props
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (event) => {
    let value = event.target.value;
    value = value.replace(/[^0-9]/g, "");

    if (max && value.length > max) {
      value = value.slice(0, max);
    }

    setInputValue(value);

    const parsedValue = parseInt(value, 10);
    if (!Number.isNaN(parsedValue)) {
      if (typeof onChange === "function") {
        onChange(parsedValue);
      }
    } else {
      if (typeof onChange === "function") {
        onChange("");
      }
    }
  };

  return (
    <div className="inputBox">
      <input
        className={disableLabel ? "disable-label" : ""}
        type="text"
        value={inputValue}
        onChange={handleChange}
        {...props}
      />
      <label>{title}</label>
    </div>
  );
};

export default MyInputNumber;
