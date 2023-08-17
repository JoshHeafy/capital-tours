import Cookies from "js-cookie";

const verifySession = (token) => {
  const url = "https://api-capital-tours.onrender.com/auth/verify";
  // const url = "http://localhost:5000/auth/verify";
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
          Cookies.remove("data-user");
        }
      })
      .catch((error) => {
        Cookies.remove("token");
        Cookies.remove("data-user");
        resolve(false);
        reject(error);
      });
  });
};

export default verifySession;
