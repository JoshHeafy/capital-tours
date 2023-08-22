import Cookies from "js-cookie";

const verifySession = (token) => {
  // const base_url = 'http://localhost:5000';
  const base_url = "https://api-capital-tours.onrender.com";
  const url = `${base_url}/auth/verify`;
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
