/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  user_load_by_token_thunk,
  user_login_reset_thunk,
  user_login_thunk,
} from "./../../redux/thunk/user_thunk";

import { useQuery } from "./../../hooks/url-params";
import { getCookies, setCookies } from "../../utils/cookies";

import Loginwithemail from "./login-with-email";
import Loginemailotp from "./login-mail-otp";
import ChooseLogin from "./choose-login";
import LoginWithNumber from "./login-with-num";
import { getMobileNumber } from "../../utils/common";

const LoginComponent = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const history = useHistory();
  const location = useLocation();
  const query = useQuery(location.search);
  const redirect = query.get("redirect");
  const [captcha, setCaptcha] = useState(false);

  const [currentPage, setcurrentPage] = useState("emailotp");

  const [validation, setValidation] = useState({
    email: false,
    valid_email: false,
    password: false,
    valid_password: false,
    captcha: false,
  });
  const phone_number = getMobileNumber(
    user?.data?.user?.phone_no || "",
    user?.data?.user?.phone_code || ""
  );

  useEffect(() => {
    if (user.login && getCookies()) {
      // window?.webengage?.user.login(user?.data?.user.slug);
      // window?.webengage?.user.setAttribute("we_email", user?.data?.user.email);
      // window?.webengage?.user.setAttribute(
      //   "we_first_name",
      //   user?.data?.user.first_name
      // );
      // window?.webengage?.user.setAttribute(
      //   "we_last_name",
      //   user?.data?.user?.last_name
      // );
      // window?.webengage.user.setAttribute(
      //   "we_phone",
      //   `+${
      //     phone_number[0]?.number?.countryCallingCode +
      //     "" +
      //     phone_number[0]?.number?.nationalNumber
      //   }`
      // );
      // window?.webengage.user.setAttribute(
      //   "Wallet Balance",
      //   parseFloat(user?.data?.user?.balance)
      // );

      if (redirect) {
        window.open(redirect, "_self");
      } else {
        if (location.state?.from) {
          history.push(location.state?.from.pathname);
        } else {
          // window.open(`${process.env.REACT_APP_MARKETPLACE_URL}`, "_self");
          history.push("/accounts/profile");
        }
      }
    }
  }, [user, history, location.state?.from, redirect]);

  useEffect(() => {
    if (!(user.login && getCookies())) {
      dispatch(user_login_reset_thunk());
    }
  }, []);

  return (
    <>
      {currentPage == "email" ? (
        <Loginwithemail
          currentPage={currentPage}
          setcurrentPage={setcurrentPage}
        />
      ) : currentPage == "emailotp" ? (
        <Loginemailotp
          currentPage={currentPage}
          setcurrentPage={setcurrentPage}
        />
      ) : currentPage == "number" ? (
        <>
          <LoginWithNumber
            currentPage={currentPage}
            setcurrentPage={setcurrentPage}
          />
        </>
      ) : (
        <>{/* <ChooseLogin setcurrentPage={setcurrentPage} /> */}</>
      )}
    </>
  );
  // };
};

export default LoginComponent;
