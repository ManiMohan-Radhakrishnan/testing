import axios from "axios";
import { getCookies } from "../utils/cookies";
import { removeCookies } from "./../utils/cookies";

const nftAxios = axios.create({
  baseURL: process.env.REACT_APP_NFT_SERVER_URL,
});

nftAxios.interceptors.request.use(
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

nftAxios.interceptors.response.use(
  (response) => {
    document.body.classList.remove("loading-indicator");
    return response;
  },
  (error) => {
    document.body.classList.remove("loading-indicator");
    if (error?.response?.status === 401) {
      removeCookies();

      if (
        !window.location.href.includes("signin?redirect") &&
        !window.location.href.includes("/password")
      ) {
        window.open("/signin", "_self");
      }
    }
    return Promise.reject(error?.response);
  }
);

export default nftAxios;
