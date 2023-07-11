import Cookies from "js-cookie";

const verifySession = (token) => {
  return new Promise((resolve, reject) => {
    fetch('http://192.168.0.202:5000/auth/verify', {
      headers: {
        "Access-Token": token || ''
      }
    }).then((data) => data.json())
      .then((response) => {
        if (response.statusCode === 200) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((error) => {
        Cookies.remove('token');
        resolve(false);
        reject(error);
      });
  });
};

export default verifySession;
