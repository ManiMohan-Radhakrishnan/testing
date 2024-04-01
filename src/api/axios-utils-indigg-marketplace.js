import axios from "axios";
import { getCookies,removeCookies } from "../utils/cookies";
const indiggMarketplaceAxios = axios.create({
    baseURL: process.env.REACT_APP_MARKETPLACE_API_URL,
  });

  indiggMarketplaceAxios.interceptors.request.use(
    function (config) {
      document.body.classList.add("loading-indicator");
      const auth_token = getCookies();
      if (auth_token) config.headers.Authorization = auth_token;
      return config;
    },
    function (error) {
      document.body.classList.remove("loading-indicator");
      return Promise.reject(error);
    }
  );

  indiggMarketplaceAxios.interceptors.response.use(
    (response) => {
      document.body.classList.remove("loading-indicator");
  
      return response;
    },
    (error) => {
      document.body.classList.remove("loading-indicator");
      if (error?.response.status === 401) {
        removeCookies();
        // toast.warn("Session expired, signin again");
      }
      return Promise.reject(error);
    }
  );

  
export default indiggMarketplaceAxios;