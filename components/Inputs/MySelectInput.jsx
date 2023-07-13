export default function MySelectInput({
  title,
  values = [],
  value = "",
  name = "",
//   _key = "",
  disabled = false,
  password = false,
  ...props
}) {
  return (
    <div className={disabled ? "selectBox disabled" : "selectBox"}>
      <label className="title-selectBox">{title}</label>
      <select disabled={disabled} {...props}>
        {values.map((value, index) => (
          <option
            key={index}
            // _key={_key}
            value={value[value]}
            selected={index === 0 && true}
          >
            {value[name]}
          </option>
        ))}
      </select>
    </div>
  );
}
