import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Facebook from "react-facebook-login/dist/facebook-login-render-props";
import { useQuery } from "../../../hooks/url-params";
import { getCookies, setCookies } from "../../../utils/cookies";
import { socialLogin } from "../../../api/methods";
import { user_load_by_token_thunk } from "../../../redux/thunk/user_thunk";
import facebook from "../../../images/facebook.svg";

import "../style.scss";

const FacebookLogin = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const history = useHistory();
  const location = useLocation();
  const query = useQuery(location.search);
  const redirect = query.get("redirect");

  const responseFacebook = async (response) => {
    if (user?.login && getCookies()) {
      if (redirect) {
        window.open(redirect, "_self");
      } else {
        history.push("/account/profile");
      }
    } else {
      handleSignIn(response);
    }
  };

  const handleSignIn = async (response) => {
    try {
      if (response) {
        const token = `Bearer ${
          response.accessToken ? response.accessToken : ""
        }`;
        const result = await socialLogin({
          provider: "facebook",
          token,
          email: response?.email,
        });

        if (result?.data?.data?.token) {
          dispatch(user_load_by_token_thunk(result?.data?.data?.token));
          setCookies(result?.data?.data?.token);
          history.push("/account/profile");
        }
      } else {
        toast.error("An unexpected error occured. Please try again  later");
      }
    } catch (error) {
      toast.error("An unexpected error occured. Please try again  later");
      console.log("~ responseFacebook ~ error", error);
    }
  };

  return (
    <div className="social-login-btn-box">
      <Facebook
        appId={process.env.REACT_APP_FACEBOOK_CLIENT_ID}
        autoLoad={false}
        fields="name,email,picture"
        callback={responseFacebook}
        render={(renderProps) => (
          <button
            onClick={renderProps.onClick}
            className="login-with-btn"
            type="button"
          >
            <img
              onClick={renderProps.onClick}
              src={facebook}
              alt="facebook-img"
            />
          </button>
        )}
        cookiePolicy={"single_host_origin"}
      />
    </div>
  );
};

export default FacebookLogin;
