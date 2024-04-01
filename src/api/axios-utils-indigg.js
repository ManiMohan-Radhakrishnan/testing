import axios from "axios";
import { getCookies } from "../utils/cookies";
const indiggAxios = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
  });

  indiggAxios.interceptors.request.use(
    function (config) {
    //document.body.classList.add("loading-indicator");
      const auth_token = getCookies();
      if (auth_token) config.headers.Authorization = auth_token;
      return config;
    },
    function (error) {
      //document.body.classList.remove("loading-indicator");
      return Promise.reject(error);
    }
  );



  
export default indiggAxios;