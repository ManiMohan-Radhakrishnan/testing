import axios from "axios";

import { getCookies } from "../utils/cookies";
import { removeCookies } from "./../utils/cookies";

const marketplaceAxios = axios.create({
  baseURL: process.env.REACT_APP_MARKETPLACE_API_URL,
});

marketplaceAxios.interceptors.request.use(
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

marketplaceAxios.interceptors.response.use(
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

export default marketplaceAxios;
