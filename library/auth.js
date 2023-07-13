import Cookies from "js-cookie";

const verifySession = (token) => {
  // const url = "http://192.168.1.13:5000/auth/verify";
  const url = "http://localhost:5000/auth/verify";
  return new Promise((resolve, reject) => {
    fetch(url, {
      headers: {
        "Access-Token": token || "",
      },
    })
      .then((data) => data.json())
      .then((response) => {
        if (response.statusCode === 200) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((error) => {
        Cookies.remove("token");
        resolve(false);
        reject(error);
      });
  });
};

export default verifySession;
