"use client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API } from "@/library/api";
import { newDataGenerate } from "@/library/functions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import MyInput from "./Inputs/MyInput";
import MyButton from "./buttons/MyButton";
import { v4 as uuidv4 } from "uuid";

export default function Login() {
  const [formId, setFormId] = useState("");
  const router = useRouter();
  const [load, setLoad] = useState(false);

  const login = async (event) => {
    event.preventDefault();
    setLoad(true);
    let response = newDataGenerate(formId);
    if (!response.status) {
      return false;
    }
    let data = response.data;

    try {
      await API("auth/login", { data, method: "PUT", token: false }).then(
        (resp) => {
          if (resp.token) {
            Cookies.set("token", resp.token, {
              // sameSite: "none",
              secure: true, //true in ssl
              expires: 1,
            });

            const dataUser = {
              apellidos: resp.user.apellidos,
              cargo: resp.user.cargo,
              email: resp.user.email,
              id_img: resp.user.id_img,
              nombre: resp.user.nombre,
              username: resp.user.username,
            };
            Cookies.set("data-user", JSON.stringify(dataUser));
            router.push("/admin");
          } else {
            setLoad(false);
          }
        }
      );
    } catch (error) {
      console.error("Algo salio mal", error);
    }
  };

  useEffect(() => {
    setFormId(uuidv4());
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="login">
        <div className="login_body">
          <div className="logo">
            <img src="/img/logo.png" alt="CapitalTours logo" />
          </div>
          <h2>Bienvenido de nuevo, Supervisor!</h2>
          <form className="form" id={formId} onSubmit={login}>
            <h2>Iniciar Sesión</h2>
            <MyInput title="Username" _key="username" required={true} />
            <MyInput
              title="Password"
              _key="password"
              required={true}
              password={true}
            />
            <MyButton name="Iniciar Sesión" load={load} />
          </form>
        </div>
        <div className="login_background"></div>
      </div>
    </>
  );
}
