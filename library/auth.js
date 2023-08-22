import Cookies from "js-cookie";

const verifySession = (token) => {
  const base_url = process.env.NEXT_PUBLIC_URL_API;
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
