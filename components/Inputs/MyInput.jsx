const MyInput = ({ title, required, password = false, ...props }) => {
  return (
    <div className="inputBox">
      <input
        type={password ? "password" : "text"}
        required={required}
        {...props}
      />
      <label>{title}</label>
    </div>
  );
};

export default MyInput;
