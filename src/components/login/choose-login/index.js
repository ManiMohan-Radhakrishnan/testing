/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
//import ReCAPTCHA from "react-google-recaptcha";
import { Link, useLocation } from "react-router-dom";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
//import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  user_disable_mfa,
  user_enable_mfa_auth_success,
  user_disable_mfa_auth_success,
} from "../../../redux/actions/user_action";
import guardian_logo from "../../../images/jump-trade/guardianLinkLogo.png";

import InputText from "../../input-text";
import ToolTip from "../../tooltip";
import Wrapper from "../../wrapper";
import InputOTP from "./../../input-otp";
import {
  user_load_by_token_thunk,
  user_login_reset_thunk,
  user_login_with_email_thunk,
  user_login_thunk,
} from "./../../../redux/thunk/user_thunk";
import { openWindowBlank, validateEmail } from "./../../../utils/common";
import { useQuery } from "./../../../hooks/url-params";
import { getCookies, setCookies } from "../../../utils/cookies";

import LoginNavComponent from "../login-nav-component";
//import NFTCounter from "../../nft-counter";
import {
  resendOtpApi,
  LoginWithOtp,
  ResendEmailOtp,
  verifyGoogleOtpApi,
} from "./../../../api/methods";

import GoogleLogin from "../../social-login/google-login";
import FacebookLogin from "../../social-login/facebook-login";

import "./../style.scss";

const ChooseLogin = ({ currentPage, setcurrentPage }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const history = useHistory();
  const location = useLocation();
  const query = useQuery(location.search);
  const redirect = query.get("redirect");

  const [navigate, setNavigate] = useState(false);

  useEffect(() => {
    if (user.login && getCookies()) {
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
      <Wrapper>
        <div className="bl_form_box">
          <div className="log_top">
            <div className="login_logos">
              <a>
                {" "}
                <ToolTip
                  icon={
                    <img
                      src={guardian_logo}
                      role="button"
                      onClick={() =>
                        openWindowBlank(process.env.REACT_APP_GUARDIAN_URL)
                      }
                    />
                  }
                  content={
                    <>
                      Your GuardianLink ID gives access to all NFT drops,
                      marketplaces, &amp; other platforms powered by
                      GuardianLink.
                    </>
                  }
                  placement="top"
                />{" "}
              </a>
            </div>
          </div>
          <div className="form-cntnt-box">
            <p className="text-center">Please Sign In to your acoount with</p>
            <div className="form-group mb-4">
              <button
                type="button"
                onClick={() => setcurrentPage("emailotp")}
                className="btn btn-dark w-100"
              >
                Email Address
              </button>
            </div>
            <div className="form-group mb-4">
              <button
                type="button"
                onClick={() => setcurrentPage("number")}
                className="btn btn-dark w-100"
              >
                Mobile Number
              </button>
            </div>

            <div className="social-login-block">
              <h5 className="social_OR">or</h5>
              <p className="login-with-heading">Sign In with</p>
              <div className="social-login-btn-block">
                <GoogleLogin />
                {/* <FacebookLogin /> */}
              </div>
            </div>
            <div className="form-group bl_forgot mb-2 text-center">
              <p>
                <span>Don't have an account? </span>
                <Link to="/signup" className="bold-font">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  );
};

export default ChooseLogin;
