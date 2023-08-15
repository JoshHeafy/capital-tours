export default function MyButtonIcon({
  name,
  load,
  icon = "bx bxs-hand-up",
  ...props
}) {
  return (
    <button
      className={load ? "my_button_loader" : "my_button"}
      type="submit"
      disabled={load}
      {...props}
    >
      {load ? (
        <div className="load"></div>
      ) : (
        <>
          <i className={icon} /> {name}
        </>
      )}
    </button>
  );
}
