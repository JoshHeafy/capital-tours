export default function MyButton({ name, load, ...props }) {
  return (
    <button
      className={load ? "my_button_loader" : "my_button"}
      type="submit"
      disabled={load}
      {...props}
    >
      {load ? <div className="load"></div> : name}
    </button>
  );
}
