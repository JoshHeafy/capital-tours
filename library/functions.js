/**
 * Genera un objeto para ser enviado para su registro a la base de datos
 * @param {String} formId Id del formulario
 * @returns {result} Objeto con los resultados de la operación
 */
import { toast } from "react-toastify";

export function getDataGenerate(formId) {
  // genera un objeto mediante la información del Form y asi el envio de datos sea optima
  let status = true;
  let error = "";
  let data = {};
  let newData = {};
  let form = document.forms.namedItem(formId);
  // let length = form.length;

  function insertData(Name, Value, Type = String) {
    //sirve para crear un nuevo campo en un objeto si el valor dado no cumple con la especificaciones no se creara el nuevo campo
    // Name=> nombre de la nueva key_name a Crear del objeto
    // Value=> el valor que se le asignara a la nueva key
    // Type=> tipo del valor que albergará el nuevo campo
    // Example-1		insertData('n_docu','71970401',String); console.log(myNewObject);===> { n_docu: '71970401' }
    // Example-2		insertData('n_docu','',String); console.log(myNewObject);===> {}

    // let typeDetail = '';
    let newValue;
    switch (Type) {
      case Number:
        newValue = parseFloat(Value);
        if (isNaN(newValue)) {
          newValue = "";
        } else {
          newValue = newValue.toString();
        }
        break;
      case String:
        newValue = Value.trim();
        break;
    }

    newData[Name] = newValue;
  }
  function insertDataRadio(Name, Value, checked = false) {
    if (checked) newData[Name] = Value;
  }
  function insertCheckbox(Name, checked = false, value = 1) {
    if (checked) {
      if (value > 0) newData[Name] = value;
    } else {
      // 	if(value=='on'){
      newData[Name] = 0;
      // 	}else{
      // 		newData[Name]=(value>0)?value:0;
      // 	}
    }
  }
  // for (let i = 0; i < length; i++) {
  let element = form.elements;
  let element_length = element.length;
  for (let y = 0; y < element_length; y++) {
    let key = undefined;
    if (element[y].attributes._key) {
      key = element[y].attributes._key.value;
    }
    if (element[y].type == "radio") {
      insertDataRadio(key, element[y].value, element[y].checked);
    } else if (element[y].type == "checkbox") {
      insertCheckbox(key, element[y].checked, element[y]["true-value"]);
    } else {
      if (key) {
        let type = element[y].attributes.number ? Number : String;
        insertData(key, element[y].value, type);
      }
    }
  }

  data.status = status;
  data.error = error;
  data.data = newData;
  return data;
}

/**
 * Imprime las notificaciones ante una petición Http
 * @param {Object} resp  - Respuesta de la petición
 * @param {Boolean} error - Si la petición falló
 * @param {Boolean} success  - Si la petición fue exitosa y desea mostrar el mensaje de exitoso
 * @param {Function} functionResp - Función que se ejecuta después de la petición
 */
export function launcherNotification(
  resp,
  error = true,
  success = true,
  functionResp = () => {}
) {
  if (error) {
    if (resp.statusCode) {
      if (resp.statusCode == 100) {
        toast.info(`Proceso exitoso!, ${resp["msg"]}`);
      } else if (resp.statusCode === 200) {
        if (success) {
          toast.success(`Proceso exitoso!, ${resp["msg"]}`);
        }
      } else if (resp.statusCode == 201) {
        if (typeof functionResp === "function") functionResp();
      } else if (resp.statusCode == 300) {
        toast.warning(`Verifique la información!, ${resp["msg"]}`);
      } else if (resp.statusCode == 400) {
        toast.error("Ha Ocurrido Un Error Verificar Información!");
      } else {
        toast.error("Ha Ocurrido Un Error Verificar Información!");
      }
    } else {
      toast.error("Ha Ocurrido Un Error!");
    }
  } else {
    if (resp.responseText == undefined) {
      toast.error("Ha Ocurrido Un Error de Servidor");
      toast.error("Ha Ocurrido Un Error de Servidor!");
    } else {
      toast.error("Ha Ocurrido Un Error de Servidor");
    }
  }
}

/**
 * Genera un objeto para ser enviado para su registro a la base de datos
 * @param {String} formId Id del formulario
 * @returns {result} Objeto con los resultados de la operación
 */

/**
 * Genera un objeto para ser enviado para su registro a la base de datos
 * @param {String} formId Id del formulario
 * @returns {result} Objeto con los resultados de la operación
 */
export function newDataGenerate(formId) {
  let status = true;
  let error = "";
  let data = {};
  let newData = {};
  let form = document.forms.namedItem(formId);
  // let length = form.length;
  /**
   * Crear un nuevo key para el objeto
   * @param {String} Name nombre de la nueva key_name a Crear del objeto
   * @param {String} Value valor que se le asignará a la nueva key_name
   * @param {String} Type  tipo de dato que se le asignará a la nueva key_name
   */

  function insertData(Name, Value, Type = String) {
    //sirve para crear un nuevo campo en un objeto si el valor dado no cumple con
    // Example-1		insertData('n_docu','71970401',String); console.log(myNewObject);===> { n_docu: '71970401' }
    // Example-2		insertData('n_docu','',String); console.log(myNewObject);===> {}

    let typeDetail = "";
    let newValue;
    switch (Type) {
      case Number:
        newValue = parseFloat(Value);
        if (isNaN(newValue)) {
          newValue = "";
        } else {
          newValue = newValue.toString();
        }
        break;
      case String:
        newValue = Value.trim();
        break;
    }
    if (newValue === typeDetail) return false;
    // if (Type === Number && isNaN(newValue)) return false;
    newData[Name] = newValue;
  }

  /**
   * Crear un nuevo key para el objeto
   * @param {String} Name nombre de la nueva key_name a Crear del objeto
   * @param {String} Value valor que se le asignará a la nueva key_name
   * @param {String} Type  tipo de dato que se le asignará a la nueva key_name
   */
  function insertDataRadio(Name, Value, checked = false) {
    if (checked) {
      if (Value > 0) newData[Name] = Value;
    }
  }

  /**
   * Crear un nuevo key para el objeto
   * @param {String} Name nombre de la nueva key_name a Crear del objeto
   * @param {String} Value valor que se le asignará a la nueva key_name
   * @param {String} Type  tipo de dato que se le asignará a la nueva key_name
   */
  function insertCheckbox(Name, checked = false, value = 1) {
    if (checked) {
      if (value > 0) newData[Name] = value;
    }
  }

  let element = form.elements;
  let element_length = element.length;
  for (let y = 0; y < element_length; y++) {
    let key = undefined;
    if (element[y].attributes._key) {
      key = element[y].attributes._key.value;
    }
    if (element[y].type == "radio") {
      insertDataRadio(key, element[y].value, element[y].checked);
    } else if (element[y].type == "checkbox") {
      insertCheckbox(key, element[y].checked, element[y]["true-value"]);
    } else {
      if (key) {
        let type = element[y].attributes.number ? Number : String;
        insertData(key, element[y].value, type);
      }
    }

    if (element[y].type != "button") {
      if (element[y].attributes.required) {
        if (element[y].value != "") {
          if (element[y].classList.contains("error"))
            element[y].classList.remove("error");
          if (element[y].classList.contains("warning"))
            element[y].classList.remove("warning");
          if (element[y].classList.contains("info"))
            element[y].classList.remove("info");
          if (!element[y].classList.contains("success"))
            element[y].classList.add("success");
        } else {
          status = false;
          error = "los campos marcado en rojo son obligatorios";
          if (!element[y].classList.contains("error"))
            element[y].classList.add("error");
          if (element[y].classList.contains("warning"))
            element[y].classList.remove("warning");
          if (element[y].classList.contains("info"))
            element[y].classList.remove("info");
          if (element[y].classList.contains("success"))
            element[y].classList.remove("success");
        }
      } else {
        if (element[y].classList.contains("error"))
          element[y].classList.remove("error");
        if (element[y].classList.contains("warning"))
          element[y].classList.remove("warning");
        if (!element[y].classList.contains("info"))
          element[y].classList.add("info");
        if (element[y].classList.contains("success"))
          element[y].classList.remove("success");
      }
    }
  }

  if (!status) {
    // toastr.info(error, "Existen Inconsistencias!")
    toast.info(error);
  }
  if (Object.keys(newData).length <= 0) {
    status = false;
    toast.success("No se encontraron datos para registrar");
    // toastr.success("No se encontraron datos para registrar", "Existen Inconsistencias!")
  }
  data.status = status;
  data.error = error;
  data.data = newData;
  return data;
}

/**
 * Genera un objeto comparando los datos de un formulario con los datos de un objeto
 * @param {String} formId Id del formulario
 * @param {Object} staticData Objeto con los datos que se desea comparar
 * @returns {result} objeto con los resultados de la operación
 */
export function updateDataGenerate(formId, staticData = {}) {
  // genera un objeto mediante la información del Form y asi el envio de datos sea optima
  let status = true;
  let error = "";
  let data = {};
  let newData = {};
  let form = document.forms.namedItem(formId);
  let length = form.length;

  function insertData(Name, Value, Type = String) {
    //sirve para crear un nuevo campo en un objeto si el valor dado no cumple con la especificaciones no se creara el nuevo campo
    // Name=> nombre de la nueva key_name a Crear del objeto
    // Value=> el valor que se le asignara a la nueva key
    // Type=> tipo del valor que albergará el nuevo campo
    // Example-1		insertData('n_docu','71970401',String); console.log(myNewObject);===> { n_docu: '71970401' }
    // Example-2		insertData('n_docu','',String); console.log(myNewObject);===> {}

    let typeDetail = "";
    let newValue;
    switch (Type) {
      case Number:
        newValue = parseFloat(Value);
        if (isNaN(newValue)) {
          newValue = "";
        } else {
          newValue = newValue.toString();
        }
        break;
      case String:
        typeDetail = "";
        newValue = Value.trim();
        break;
    }
    // if (newValue === typeDetail) return false;
    // if (Type === Number && isNaN(newValue)) return false;

    newData[Name] = newValue;
  }
  function insertDataRadio(Name, Value, checked = false) {
    if (checked) newData[Name] = Value;
  }
  function insertCheckbox(Name, checked = false, value = 1) {
    if (checked) {
      // if(value=='on'){
      // 	newData[Name] = 1
      // }else{
      newData[Name] = value > 0 ? value : 1;
      // }
    } else {
      // if(value=='on'){
      newData[Name] = 0;
      // }else{
      // 	newData[Name]=(value>0)?value:0;
      // }
    }
  }
  // for (let i = 0; i < length; i++) {
  let element = form.elements;
  let element_length = element.length;
  for (let y = 0; y < element_length; y++) {
    let key = undefined;
    if (element[y].attributes._key) {
      key = element[y].attributes._key.value;
    }
    if (key) {
      let type = element[y].attributes.number ? Number : String;
      let where = element[y].attributes.and ? true : false;
      let newValue = "";
      if (element[y].type == "checkbox") {
        if (element[y].checked) {
          newValue = element[y]["true-value"] ? element[y]["true-value"] : 1;

          // if(element[y].value=='on'){
          // 	newValue = 1
          // }else{
          // 	newValue =(element[y].value>0)?element[y].value:0;
          // }
        } else {
          newValue = 0;
        }
      } else {
        newValue = element[y].value;
      }

      // if (element[y].type == "select-one") {
      //   console.log(element[y].selectedOptions[0].value);
      // }

      if (newValue != staticData[key] && where == false) {
        if (element[y].type == "radio") {
          insertDataRadio(key, newValue, element[y].checked);
        } else if (element[y].type == "checkbox") {
          insertCheckbox(key, element[y].checked, newValue);
        } else {
          if (key) {
            let type = element[y].attributes.number ? Number : String;
            insertData(key, newValue, type);
          }
        }
      } else if (newValue == staticData[key] && where == true) {
        insertData(key, newValue, type);
      } else if (newValue != staticData[key] && where == true) {
        // console.log(staticData[key],'/',newValue)

        // toastr.error("Se envió información del usuario, por manipular datos del sistema!", 'Error Manipulación de Datos')

        // // toastr["error"]("Se envió información del usuario, por manipular datos del sistema!",'Error Manipulación de Datos' );
        toast.error(
          "Se envió información del usuario, por manipular datos del sistema!"
        );
        status = false;
        return false;
      }
    }
    if (element[y].type != "button") {
      if (element[y].attributes.required) {
        if (element[y].value != "") {
          if (element[y].classList.contains("error"))
            element[y].classList.remove("error");
          if (element[y].classList.contains("warning"))
            element[y].classList.remove("warning");
          if (element[y].classList.contains("info"))
            element[y].classList.remove("info");
          if (!element[y].classList.contains("success"))
            element[y].classList.add("success");
        } else {
          status = false;
          error = "los campos marcado en rojo son obligatorios";
          if (!element[y].classList.contains("error"))
            element[y].classList.add("error");
          if (element[y].classList.contains("warning"))
            element[y].classList.remove("warning");
          if (element[y].classList.contains("info"))
            element[y].classList.remove("info");
          if (element[y].classList.contains("success"))
            element[y].classList.remove("success");
        }
      } else {
        if (element[y].classList.contains("error"))
          element[y].classList.remove("error");
        if (element[y].classList.contains("warning"))
          element[y].classList.remove("warning");
        if (!element[y].classList.contains("info"))
          element[y].classList.add("info");
        if (element[y].classList.contains("success"))
          element[y].classList.remove("success");
      }
    }
  }
  // }

  if (!status) {
    // toastr.warning(error, "Existen Inconsistencias!")

    // // toastr["warning"](error, "Existen Inconsistencias!");
    toast.warning(error);
  }
  // console.log({first:Object.entries(newData).length})
  if (Object.entries(newData).length <= 0) {
    status = false;
    error = "No se detectaron cambios";

    // toastr.warning(error, "Verifique la información!")
    toast.warning(error);
  }
  data.status = status;
  data.error = error;
  data.data = newData;
  return data;
}
