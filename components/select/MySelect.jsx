const MySelect = ({ title = "", options = [], _key = "", ...props }) => {
  return (
    <div className="select_container">
      {title.length > 0 && <label>{title}</label>}
      <div className="select_options">
        <select _key={_key} {...props}>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default MySelect;
