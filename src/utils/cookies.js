import cookie from "react-cookies";

const cookie_token = "bl_base_user_token";

export const setCookiesByName = (name, input) => {
  const expires = new Date();
  expires.setDate(expires.getDate() + 365);
  const maxAge = 365 * 24 * 60 * 60;
  const path = "/";

  cookie.save(name, input, {
    path,
    expires,
    maxAge,
    domain:
      process.env.REACT_APP_ENVIRONMENT === "local"
        ? "localhost"
        : process.env.REACT_APP_COOKIE_DOMAIN_NAME,
    secure: true,
  });
};

export const setCookies = (input) => {
  const expires = new Date();
  expires.setDate(expires.getDate() + 365);
  const maxAge = 365 * 24 * 60 * 60;
  const path = "/";

  cookie.save(cookie_token, input, {
    path,
    expires,
    maxAge,
    domain:
      process.env.REACT_APP_ENVIRONMENT === "local"
        ? "localhost"
        : process.env.REACT_APP_COOKIE_DOMAIN_NAME,
    secure: true,
  });
};

export const getCookies = () => {
  return cookie.load(cookie_token);
};

export const getSourceCookies = () => {
  return cookie.load("fsz");
};

export const getCookiesByName = (name) => {
  return cookie.load(name);
};

export const removeCookies = () => {
  cookie.remove(cookie_token, {
    path: "/",
    domain: process.env.REACT_APP_COOKIE_DOMAIN_NAME,
  });
};
