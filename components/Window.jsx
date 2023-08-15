import { MyContext } from "@/context/MyContext";
import { useContext } from "react";

const WindowScreen = ({ children, title, width = 50, height = 50 }) => {
  const { setOpenModal, setOpenModal1, setOpenModal2, setOpenModal3 } =
    useContext(MyContext);
  return (
    <div className="block-windows">
      <div className="container-windows">
        <section
          className="form-windows"
          style={{ width: `${width}%`, height: `${height}%` }}
        >
          <div className="form-windows__title">
            <p className="title__text">{title}</p>
            <i
              onClick={() => {
                setOpenModal(false);
                setOpenModal1(false);
                setOpenModal2(false);
                setOpenModal3(false);
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
