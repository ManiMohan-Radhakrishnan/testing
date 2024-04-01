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
import CheckLoginType from "../checkLoginType";

const LoginWithEmailOtpComponent = ({ currentPage, setcurrentPage }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const history = useHistory();
  const location = useLocation();
  const query = useQuery(location.search);
  const redirect = query.get("redirect");
  const email = query.get("email");
  const withOtp = query.get("with");

  const [navigate, setNavigate] = useState(false);
  const [error, setError] = useState();
  const [otp, setOTP] = useState(false);
  const [otpValue, setOTPValue] = useState("");
  const [reLoading, setReLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [alreadyExist, setAlreadyExist] = useState("");
  const [resendOTP, setResendOTP] = useState(true);

  const [countDown, setCountDown] = useState(0);
  const [runTimer, setRunTimer] = useState(false);
  const [key, setKey] = useState("");
  const [googleOTP, setGoogleOTP] = useState(false);
  const [login, setLogin] = useState({
    email: "",
  });

  const [validation, setValidation] = useState({
    email: false,
    valid_email: false,
  });

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
    if (email && !withOtp) {
      setLogin({ ...login, email: email.trim() });
      setAlreadyExist(
        "We noticed that your email is already associated with a GuardianLink ID. Please proceed with your login credentials."
      );
      history.push("/signin");
    } else if (email && withOtp) {
      setLogin({ ...login, email: email.trim() });
      handleLoginWithOTP(email.trim());
    }
  }, [email]);

  useEffect(() => {
    if (!(user.login && getCookies())) {
      dispatch(user_login_reset_thunk());
    }
  }, []);

  useEffect(() => {
    let timerId;
    if (runTimer) {
      setCountDown(60 * 1);

      timerId = setInterval(() => {
        setCountDown((countDown) => countDown - 1);
      }, 1000);
    } else {
      clearInterval(timerId);
      setResendOTP(true);
    }

    return () => clearInterval(timerId);
  }, [runTimer]);

  useEffect(() => {
    if (countDown < 0 && runTimer) {
      setRunTimer(false);
      setCountDown(0);
    }
  }, [countDown, runTimer]);

  const handleLogin = () => {
    setError(null);
    if (checkValidation()) {
      dispatch(user_login_with_email_thunk(login, setError, setOTP));
      setResendOTP(false);
      setRunTimer(true);
    }
  };

  const handleLoginWithOTP = (email) => {
    setError(null);
    if (validateEmail(email)) {
      dispatch(user_login_with_email_thunk({ email }, setError, setOTP));
      setResendOTP(false);
      setRunTimer(true);
    }
  };

  const checkValidation = () => {
    let c_validation = { ...validation };

    if (!login.email) {
      c_validation = { ...c_validation, email: true };
    } else {
      if (validateEmail(login.email)) {
        c_validation = { ...c_validation, valid_email: false };
      } else {
        c_validation = { ...c_validation, valid_email: true };
      }
    }

    setValidation(c_validation);
    if (!c_validation.email) {
      if (validateEmail(login.email)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const handleChangeEvent = (e) => {
    setError(null);
    setLogin({ ...login, [e.target.name]: e.target.value.trim() });
    if (e.target.value) {
      setValidation({ ...validation, [e.target.name]: false });
    } else {
      setValidation({ ...validation, [e.target.name]: true });
    }
  };

  const handleKeyPressEvent = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  const handleResendEmail = async () => {
    try {
      setReLoading(true);
      await ResendEmailOtp(login, true);
      setReLoading(false);
      toast.success(
        "The email containing your One-Time Password to Confirm your Account has been sent to your registered email"
      );
    } catch (error) {
      setReLoading(false);
      toast.error("Please try again later....");

      console.log(
        "🚀 ~ file: index.js ~ line 196 ~ handleResendEmail ~ error",
        error
      );
    }
  };

  const ConfirmError = () => {
    return reLoading ? (
      <p className="error_text text-center text-dark">Sending email...</p>
    ) : (
      <p className="error_text text-center">
        You need to verify your account first.{" "}
        <a href="#" onClick={handleResendEmail}>
          Click here
        </a>{" "}
        to resend the confirmation email.
      </p>
    );
  };

  const handleVerifyAuthOTP = async () => {
    setError(null);
    if (otpValue.length === 6) {
      try {
        setVerifyLoading(true);
        const payload = {
          otp_code: otpValue,
          secret_key: key,
          email: login.email,
        };

        const result = await verifyGoogleOtpApi(payload);
        setCookies(result.data.data.token);
        setVerifyLoading(false);
        setNavigate(true);
        dispatch(user_load_by_token_thunk(result.data.data.token));
        // dispatch(user_login_google_otp_action());
        // return false
        // dispatch(user_login_thunk(login, setError, setOTP));
        //  dispatch(user_login_thunk(login, setError, setOTP, setGoogleOTP, setKey));
        // setCookies(result.data.data.token);
        // setVerifyLoading(false);
        // setNavigate(true);
        //  dispatch(user_load_by_token_thunk(result.data.data.token));
      } catch (error) {
        setVerifyLoading(false);
        setError(
          "It seems you have entered the wrong code. Please check the number(s) you have entered."
        );
        console.log(
          "🚀 ~ file: index.js ~ line 172 ~ handleVerifyOTP ~ error",
          error
        );
      }
    } else {
      setError("Please enter the 6-digit-code from your Authenticator App");
    }
  };

  const handleVerifyOTP = async () => {
    setError(null);
    if (otpValue.length === 6) {
      try {
        setVerifyLoading(true);

        const result = await LoginWithOtp({
          email: login.email,
          otp: otpValue,
        });
        setVerifyLoading(false);

        if (result?.status === 200) {
          if (result.data.data.gauth) {
            setKey(result.data.data.secret_key);
            setOTPValue("");
            setOTP(false);
            setGoogleOTP(true);
            setVerifyLoading(false);
            dispatch(user_enable_mfa_auth_success(result.data));
          } else {
            setOTPValue("");
            setOTP(false);

            // dispatch(user_login_thunk(login, setError, setOTP));
            setCookies(result.data.data.token);

            setNavigate(true);
            dispatch(user_load_by_token_thunk(result.data.data.token));
          }
        }
        // return false;
      } catch (error) {
        setVerifyLoading(false);
        setError(
          "It seems you have entered the wrong code. Please check the number(s) you have entered."
        );
        console.log(
          "🚀 ~ file: index.js ~ line 172 ~ handleVerifyOTP ~ error",
          error
        );
      }
    } else {
      setError("Please enter the full OTP received through your email.");
    }
  };

  const Onchange = async () => {
    setOTP(false);
    setError("");
    setOTPValue("");
  };
  const handleResendOTP = async () => {
    if (login.email) {
      try {
        setReLoading(true);
        await resendOtpApi(login.email, true);
        setReLoading(false);
        toast.success(
          "Your confirmation email has been sent to your registered email address"
        );
        setResendOTP(false);
        setRunTimer(true);
      } catch (error) {
        setReLoading(false);

        if (error?.data?.message === "email otp locked") {
          toast.error(
            "Account lock for security reasons, please login again after 10 mins"
          );

          setOTP(false);
          setOTPValue("");
          setError(null);
          setLogin({ email: "", password: "" });
        } else {
          toast.error(error?.data?.message);
        }

        console.log(
          "🚀 ~ file: index.js ~ line 196 ~ handleResendEmail ~ error",
          error
        );
      }
    }
  };

  let seconds = countDown ? String(countDown % 60).padStart(2, 0) : null;
  let minutes = countDown
    ? String(Math.floor(countDown / 60)).padStart(2, 0)
    : null;

  return (
    <>
      {otp || googleOTP ? (
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
              <h4 className="text-center font-weight-bold">Sign In</h4>
              <LoginNavComponent
                currentPage={currentPage}
                setcurrentPage={setcurrentPage}
              />
              {otp ? (
                <>
                  <div className="row">
                    <div className="col-8 col-sm-8 col-md-8">
                      <p className="text_font_size mb-0">
                        {" "}
                        Please enter the OTP sent to
                      </p>
                    </div>
                    <div className="col-4 col-sm-4 col-md-4">
                      <a
                        href="#"
                        className="text_right_change_email"
                        onClick={() => Onchange()}
                      >
                        {" "}
                        Change{" "}
                      </a>
                    </div>
                  </div>
                  <p className="font-bold text_font_size">{login?.email}</p>
                </>
              ) : (
                <h4 className="google_2fa_info">
                  Enter 6-digit-code from your Google Authenticator App
                </h4>
              )}

              <div className="form-group mb-3">
                <InputOTP onChange={(e) => setOTPValue(e)} value={otpValue} />
              </div>

              {validation.valid_email && (
                <p className="error_text">Please enter a valid email address</p>
              )}
              {otp ? (
                <p className="mt-3 ">
                  <span className="terms-text-reg">
                    By Proceeding Further & Clicking on 'Continue' Agree to
                    Jump.trade's{" "}
                    <a
                      className="terms-link"
                      href={process.env.REACT_APP_TERMS_URL}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Terms & Conditions.
                    </a>
                  </span>
                </p>
              ) : (
                <>
                  <div className="form-group mb-2">
                    <button
                      type="button"
                      className="btn btn-dark w-100"
                      onClick={handleVerifyAuthOTP}
                      disabled={verifyLoading || navigate}
                    >
                      {navigate ? (
                        "Verified Successfully, please wait..."
                      ) : (
                        <>{verifyLoading ? "Verifying..." : "Verify"}</>
                      )}
                    </button>
                    {error && <p className="error_text text-center">{error}</p>}
                  </div>
                </>
              )}
              {otp ? (
                <div className="form-group mb-2">
                  <button
                    type="button"
                    className="btn btn-dark w-100"
                    onClick={handleVerifyOTP}
                    disabled={verifyLoading || navigate}
                  >
                    {navigate ? (
                      "Verified Successfully, please wait..."
                    ) : (
                      <>{verifyLoading ? "Verifying..." : "Continue"}</>
                    )}
                  </button>
                  {error && <p className="error_text text-center">{error}</p>}
                </div>
              ) : (
                <>
                  {/* <p className="mb-4">
                  Please{" "}
                  <a
                    href="#"
                    onClick={() => {
                      // setGoogleOTP(false);
                      setOTP(false);
                      setOTPValue("");
                      setError(null);
                      setLogin({ email: "", password: "" });
                    }}
                  >
                    {" "}
                    click here{" "}
                  </a>{" "}
                  to login again.
                </p> */}
                </>
              )}
              {otp ? (
                <p className="resendContet text-center">
                  {resendOTP ? "" : "Please wait  "}
                  {resendOTP ? (
                    reLoading ? (
                      "Sending email..."
                    ) : (
                      <>
                        {" "}
                        Didn't receive?{" "}
                        <a
                          href="#"
                          className="text_right_resend_email"
                          onClick={handleResendOTP}
                        >
                          Resend OTP
                        </a>{" "}
                      </>
                    )
                  ) : (
                    <>
                      {minutes && seconds && (
                        <>
                          {" "}
                          {minutes}:{seconds}
                        </>
                      )}
                    </>
                  )}
                </p>
              ) : (
                <></>
              )}
            </div>
          </div>
        </Wrapper>
      ) : (
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
              <h4 className="text-center font-weight-bold">Sign In</h4>
              <LoginNavComponent
                currentPage={currentPage}
                setcurrentPage={setcurrentPage}
              />

              <div className="form-group mb-3">
                {/* <div className="">
                  <a
                  href="#"
                  onClick={() => setcurrentPage("email")}
                    className="text_right_nav"
                  >
                    Use Email
                  </a>
                </div> */}
                <InputText
                  title={"Email Address"}
                  required={validation.email}
                  name="email"
                  onChange={handleChangeEvent}
                  onKeyPress={handleKeyPressEvent}
                  value={login.email}
                />
              </div>
              {validation.valid_email && (
                <p className="error_text">Please enter a valid email address</p>
              )}
              {alreadyExist && <p className="text-secondary">{alreadyExist}</p>}

              <div className="form-group mb-2">
                <button
                  type="button"
                  className="btn btn-dark w-100"
                  onClick={handleLogin}
                  disabled={user.loading}
                >
                  {user.loading ? "Loading..." : "Request OTP"}
                </button>
                {error &&
                  (() => {
                    if (error === "confirm-email") {
                      return <ConfirmError />;
                    } else if (error === "login-locked") {
                      return (
                        <p className="error_text text-center">
                          Your login has been disabled because we detected a
                          suspicions activity on your account.{" "}
                          <a href="https://help.jump.trade/en/support/solutions/articles/84000345960-why-is-my-login-disabled-">
                            Learn more
                          </a>
                        </p>
                      );
                    } else {
                      return <p className="error_text text-center">{error}</p>;
                    }
                  })()}
              </div>
              {/* <div className="form-group bl_forgot mt-2 text-center">
                <CheckLoginType
                  currentPage={currentPage}
                  setcurrentPage={setcurrentPage}
                />
              </div> */}

              <div className="social-login-block">
                <h5 className="social_OR">or</h5>
                <p className="login-with-heading">Sign In with</p>
                <div className="social-login-btn-block">
                  <GoogleLogin />
                  {/* <FacebookLogin /> */}
                </div>
              </div>

              <div className="form-group bl_forgot text-center">
                <p className="mb-1">
                  <span>Don't have an account? </span>
                  <Link to="/signup" className="bold-font">
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </Wrapper>
      )}
    </>
  );
};

export default LoginWithEmailOtpComponent;
