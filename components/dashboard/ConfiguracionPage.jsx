import { useEffect, useState } from "react";
import MyInput from "../Inputs/MyInput";
import { parse, v4 as uuidv4 } from "uuid";
import MyButton from "../buttons/MyButton";
import { ToastContainer, toast } from "react-toastify";
import { newDataGenerate, updateDataGenerate } from "@/library/functions";
import { API } from "@/library/api";
import Cookies from "js-cookie";

export default function ConfiguracionPage() {
  const idFormUser = "id_" + uuidv4();
  const idFormDataUser = "id_" + uuidv4();
  const [editableUser, setEditableUser] = useState(false);
  const [editableNombre, setEditableNombre] = useState(false);
  const [editableApellidos, setEditableApellidos] = useState(false);
  const [editableEmail, setEditableEmail] = useState(false);
  const [editablePassword, setEditablePassword] = useState(false);

  const [passwords_user, setPasswords_user] = useState({
    old: "",
    password: "",
    password2: "",
  });

  const [disableBtnUser, setDisableBtnUser] = useState(false);
  const [loadBtnUser, setLoadBtnUser] = useState(false);

  const [dataUser, setDataUser] = useState({
    username: "",
    nombre: "",
    apellidos: "",
    email: "",
  });

  const [dataUserChange, setDataUserChange] = useState({
    username: "",
    nombre: "",
    apellidos: "",
    email: "",
  });

  const handlePasswordUser = async (e) => {
    e.preventDefault();
    if (passwords_user.password === passwords_user.password2) {
      setLoadBtnUser(true);
      let result = newDataGenerate(idFormUser);
      if (!result.status) {
        return false;
      }
      let data = result.data;
      try {
        await API("auth/change-pass-user", { data, method: "POST" })
          .then((resp) => {
            if (resp.password) {
              setLoadBtnUser(false);
              setDisableBtnUser(true);
              setEditablePassword(false);
              setPasswords_user({
                ...passwords_user,
                old: "",
                password: "",
                password2: "",
              });
              toast.success("Su contraseña de inicio de sesión ha cambiado!");
            } else {
              setPasswords_user({ ...passwords_user, old: "" });
              setLoadBtnUser(false);
            }
          })
          .catch((resp) => {
            setLoadBtnUser(false);
            setPasswords_user({ ...passwords_user, old: "" });
            toast.warning(resp.msg);
          });
      } catch (error) {
        setPasswords_user({ ...passwords_user, old: "" });
        setLoadBtnUser(false);
      }
    } else {
      toast.warning("Las contraseñas no coinciden!");
      setLoadBtnUser(false);
    }
  };

  const updateUser = async (e) => {
    e.preventDefault();
    var result = updateDataGenerate(idFormDataUser, dataUser);
    if (result.status) {
      await API("auth/update-user", {
        data: result.data,
        method: "PUT",
      }).then((resp) => {
        if (resp !== {}) {
          toast.success("Actualización satisfactoria!");
        }
        getDataUser();
        setEditableUser(false);
        setEditableNombre(false);
        setEditableApellidos(false);
        setEditableEmail(false);
      });
    } else {
      getDataUser();
      setEditableUser(false);
      setEditableNombre(false);
      setEditableApellidos(false);
      setEditableEmail(false);
    }
  };

  const getDataUser = async () => {
    await API("auth/info-user").then((resp) => {
      if (resp.user) {
        const dataUserTmp = resp.user;
        setDataUser({
          ...dataUser,
          username: dataUserTmp.username,
          nombre: dataUserTmp.nombre,
          apellidos: dataUserTmp.apellidos,
          email: dataUserTmp.email,
        });
        setDataUserChange({
          ...dataUserChange,
          username: dataUserTmp.username,
          nombre: dataUserTmp.nombre,
          apellidos: dataUserTmp.apellidos,
          email: dataUserTmp.email,
        });
      }
    });
  };

  useEffect(() => {
    getDataUser();
  }, []);

  return (
    <>
      <ToastContainer limit={3} />
      <div className="pages configuracion">
        <h2>CONFIGURACIÓN</h2>
        <div className="body_config">
          <form id={idFormDataUser} onSubmit={updateUser}>
            <div className="item">
              {!editableUser ? (
                <div className="item_left">
                  <h5>USERNAME:</h5>
                  <p>{dataUser.username}</p>
                </div>
              ) : (
                <MyInput
                  title="Username"
                  _key="username"
                  value={dataUserChange.username}
                  onChange={(e) =>
                    setDataUserChange({
                      ...dataUserChange,
                      username: e.target.value,
                    })
                  }
                />
              )}
              <div className="item_right">
                <a
                  className="success editable"
                  onClick={() => setEditableUser(!editableUser)}
                >
                  {!editableUser ? "Editar" : "Cancelar"}
                </a>
              </div>
            </div>
            <div className="item">
              {!editableNombre ? (
                <div className="item_left">
                  <h5>NOMBRE:</h5>
                  <p>{dataUser.nombre}</p>
                </div>
              ) : (
                <MyInput
                  title="Nombre"
                  _key="nombre"
                  value={dataUserChange.nombre}
                  onChange={(e) =>
                    setDataUserChange({
                      ...dataUserChange,
                      nombre: e.target.value,
                    })
                  }
                />
              )}
              <div className="item_right">
                <a
                  className="success editable"
                  onClick={() => setEditableNombre(!editableNombre)}
                >
                  {!editableNombre ? "Editar" : "Cancelar"}
                </a>
              </div>
            </div>
            <div className="item">
              {!editableApellidos ? (
                <div className="item_left">
                  <h5>APELLIDOS:</h5>
                  <p>{dataUser.apellidos}</p>
                </div>
              ) : (
                <MyInput
                  title="Apellidos"
                  _key="apellidos"
                  value={dataUserChange.apellidos}
                  onChange={(e) =>
                    setDataUserChange({
                      ...dataUserChange,
                      apellidos: e.target.value,
                    })
                  }
                />
              )}
              <div className="item_right">
                <a
                  className="success editable"
                  onClick={() => setEditableApellidos(!editableApellidos)}
                >
                  {!editableApellidos ? "Editar" : "Cancelar"}
                </a>
              </div>
            </div>
            <div className="item">
              {!editableEmail ? (
                <div className="item_left">
                  <h5>EMAIL:</h5>
                  <p>{dataUser.email}</p>
                </div>
              ) : (
                <MyInput
                  title="Email"
                  _key="email"
                  value={dataUserChange.email}
                  onChange={(e) =>
                    setDataUserChange({
                      ...dataUserChange,
                      email: e.target.value,
                    })
                  }
                />
              )}
              <div className="item_right">
                <a
                  className="success editable"
                  onClick={() => setEditableEmail(!editableEmail)}
                >
                  {!editableEmail ? "Editar" : "Cancelar"}
                </a>
              </div>
            </div>
          </form>
          <h5>SEGURIDAD:</h5>
          <div className="item">
            <a
              className="success editable"
              onClick={() => setEditablePassword(!editablePassword)}
            >
              {!editablePassword ? "Editar Contraseña" : "Cancelar"}
            </a>
            {editablePassword && (
              <form id={idFormUser} onSubmit={handlePasswordUser}>
                <MyInput
                  title="Contraseña Antigua"
                  value={passwords_user.old}
                  _key="password_old"
                  password={true}
                  required={true}
                  onChange={(e) =>
                    setPasswords_user({
                      ...passwords_user,
                      old: e.target.value,
                    })
                  }
                />
                <MyInput
                  title="Contraseña Nueva"
                  value={passwords_user.password}
                  _key="password"
                  password={true}
                  required={true}
                  onChange={(e) =>
                    setPasswords_user({
                      ...passwords_user,
                      password: e.target.value,
                    })
                  }
                />
                <MyInput
                  title="Confirmar Contraseña"
                  value={passwords_user.password2}
                  password={true}
                  required={true}
                  onChange={(e) =>
                    setPasswords_user({
                      ...passwords_user,
                      password2: e.target.value,
                    })
                  }
                />
                {passwords_user.old !== "" &&
                  passwords_user.password !== "" &&
                  passwords_user.password2 !== "" && (
                    <MyButton
                      name="Cambiar contraseña"
                      load={loadBtnUser}
                      disabled={disableBtnUser}
                    />
                  )}
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
