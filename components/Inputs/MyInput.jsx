const MyInput = ({
  title,
  required,
  password = false,
  disableLabel = false,
  ...props
}) => {
  return (
    <div className="inputBox">
      <input
        className={disableLabel ? "disable-label" : ""}
        type={password ? "password" : "text"}
        required={required}
        {...props}
        
      />
      <label>{title}</label>
    </div>
  );
};

export default MyInput;
