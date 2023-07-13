import { MyContext } from "@/context/MyContext";
import { useContext } from "react";

const WindowScreen = ({ children, title, size }) => {
  const { setOpenModalDetail, setOpenModalCreate } = useContext(MyContext);
  return (
    <div className="block-windows">
      <div className="container-windows">
        <section
          className="form-windows"
          style={{ width: `${size}%`, height: `${size}%` }}
        >
          <div className="form-windows__title">
            <p className="title__text">{title}</p>
            <i
              onClick={() => {
                setOpenModalDetail(false);
                setOpenModalCreate(false);
              }}
              className="bx bxs-x-circle title__icon"
            ></i>
          </div>
          <slot></slot>
          <div className="control-windows">{children}</div>
        </section>
      </div>
    </div>
  );
};

export default WindowScreen;
