import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

import { getCookies, setCookies } from "../../../utils/cookies";
import { useQuery } from "./../../../hooks/url-params";
import { socialLogin } from "../../../api/methods";
import google from "../../../images/google.svg";
import { user_load_by_token_thunk } from "../../../redux/thunk/user_thunk";

import "../style.scss";

function ReactGoogleLogin() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const location = useLocation();
  const history = useHistory();
  const query = useQuery(location.search);
  const redirect = query.get("redirect");

  const responseGoogle = async (response) => {
    if (user?.login && getCookies()) {
      if (redirect) {
        window.open(redirect, "_self");
      } else {
        history.push("/account/profile");
      }
    } else {
      if (response.access_token) {
        const token_type = response.token_type ? response.token_type : "";
        const access_token = response.access_token ? response.access_token : "";
        const token = `${token_type} ${access_token}`;
        await handleSignIn(token);
      } else if (response.credential)
        await handleSignIn(`Bearer ${response.credential}`);
    }
  };

  const handleSignIn = async (token) => {
    try {
      const signData = await socialLogin({
        provider: "google",
        token,
      });
      if (signData?.data?.data?.token) {
        dispatch(user_load_by_token_thunk(signData?.data?.data?.token));
        setCookies(signData.data.data.token);
        history.push("/account/profile");
      }
    } catch (error) {
      toast.error("An unexpected error occured. Please try again  later");

      console.log(
        "🚀 ~ file: index.js ~ line 92 ~ responseGoogle ~ error",
        error
      );
    }
  };

  const login = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    uxMode: "popup",
  });

  const handleClick = () => {
    login();
  };

  return (
    <>
      <div className="social-login-btn-box">
        <button
          onClick={() => handleClick()}
          className="login-with-btn"
          type="button"
        >
          <img src={google}></img>
        </button>
      </div>
    </>
  );
}

const GoogleLogin = () => {
  const client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  return (
    <GoogleOAuthProvider clientId={client_id} className="signup_button">
      <ReactGoogleLogin />
    </GoogleOAuthProvider>
  );
};
export default GoogleLogin;
