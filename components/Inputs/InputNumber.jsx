const InputNumber = ({
  title,
  keyProp,
  value,
  disabled = false,
  required = false,
  max,
  onChange,
}) => {
  const handleChange = (event) => {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/[^0-9]/g, ""); // Elimina cualquier carácter que no sea un número
    const truncatedValue = numericValue.slice(0, max); // Limita la longitud al número máximo de dígitos
    onChange(truncatedValue); // Llama a la función onChange con el valor numérico truncado
  };

  return (
    <div className="form-floating">
      <input
        className="form-control"
        type="number"
        key={keyProp}
        value={value}
        placeholder={title}
        disabled={disabled}
        onChange={handleChange}
        required={required}
        pattern="[0-9]*" // Acepta solo números
        maxLength={max} // Limita la longitud al número máximo de dígitos
      />
      <label>{title}</label>
    </div>
  );
};

export default InputNumber;
