import { useRef } from "react";

const MyInputPlaca = ({
  title,
  onChange,
  value,
  disableLabel = false,
  ...props
}) => {
  const inputRef = useRef(null);

  const handleInputChange = (event) => {
    let inputValue = event.target.value;

    inputValue = inputValue.replace(/[^A-Za-z0-9]/g, "");

    if (inputValue.length > 3) {
      inputValue = inputValue.slice(0, 3) + "-" + inputValue.slice(3, 7);
    }

    if (typeof onChange === "function") {
      onChange(inputValue);
    }
    if (inputValue.length === 7) {
      inputRef.current.blur();
    }
  };

  const handleClearInput = () => {
    if (typeof onChange === "function") {
      onChange("");
    }
    inputRef.current.focus();
  };

  return (
    <div className="inputBox">
      <input
        className={disableLabel ? "disable-label" : ""}
        type="text"
        value={value}
        onChange={handleInputChange}
        maxLength={7}
        ref={inputRef}
        {...props}
      />
      <label>{title}</label>
    </div>
  );
};

export default MyInputPlaca;
