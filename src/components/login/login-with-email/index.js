/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Link, useLocation } from "react-router-dom";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

import guardian_logo from "../../../images/jump-trade/guardianLinkLogo.png";

import InputText from "../../input-text";
import ToolTip from "../../tooltip";
import Wrapper from "../../wrapper";
import InputOTP from "../../input-otp";
import {
  user_load_by_token_thunk,
  user_login_reset_thunk,
  user_login_thunk,
} from "../../../redux/thunk/user_thunk";
import {
  openWindowBlank,
  passwordLength,
  validateEmail,
} from "../../../utils/common";
import { useQuery } from "../../../hooks/url-params";
import { getCookies, setCookies } from "../../../utils/cookies";
import LoginNavComponent from "../login-nav-component";
import {
  resendConfirmationApi,
  resendOtpApi,
  verifyOtpApi,
  verifyGoogleOtpApi,
} from "../../../api/methods";

import GoogleLogin from "../../social-login/google-login";
import FacebookLogin from "../../social-login/facebook-login";

import "./../style.scss";

const LoginWithEmailComponent = ({ currentPage, setcurrentPage }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const history = useHistory();
  const location = useLocation();
  const query = useQuery(location.search);
  const redirect = query.get("redirect");
  const email = query.get("email");
  const [googleOTP, setGoogleOTP] = useState(false);
  const [password, setPassword] = useState(true);
  const [captcha, setCaptcha] = useState(false);
  const [navigate, setNavigate] = useState(false);
  const [error, setError] = useState();
  const [otp, setOTP] = useState(false);
  const [otpValue, setOTPValue] = useState("");
  const [reLoading, setReLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [alreadyExist, setAlreadyExist] = useState("");
  const [key, setKey] = useState("");

  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const [validation, setValidation] = useState({
    email: false,
    valid_email: false,
    password: false,
    valid_password: false,
    captcha: false,
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
    if (email) {
      setLogin({ ...login, email: decodeURIComponent(email.trim()) });
      setAlreadyExist(
        "We noticed that your email is already associated with a GuardianLink ID. Please proceed with your login credentials."
      );
      history.replace("/signin");
    }
  }, [email]);

  useEffect(() => {
    if (!(user.login && getCookies())) {
      dispatch(user_login_reset_thunk());
    }
  }, []);

  const handleLogin = () => {
    setError(null);
    if (checkValidation()) {
      // dispatch(user_login_thunk(login, setError, setOTP));
      dispatch(user_login_thunk(login, setError, setOTP, setGoogleOTP, setKey));
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

    if (!login.password) {
      c_validation = { ...c_validation, password: true };
    } else {
      if (login.password.length >= passwordLength) {
        c_validation = { ...c_validation, valid_password: false };
      } else {
        c_validation = { ...c_validation, valid_password: true };
      }
    }

    if (captcha) {
      c_validation = { ...c_validation, captcha: false };
    } else {
      c_validation = { ...c_validation, captcha: true };
    }

    if (process.env.REACT_APP_ENVIRONMENT === "local") {
      c_validation = { ...c_validation, captcha: false };
    }

    setValidation(c_validation);
    if (
      !c_validation.email &&
      !c_validation.password &&
      !c_validation.valid_email &&
      !c_validation.valid_password &&
      !c_validation.captcha
    ) {
      return true;
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
      await resendConfirmationApi(login.email);
      setReLoading(false);
      toast.success(
        "The email containing your One-Time Password to Confirm your Account has been sent to your registered email"
      );
    } catch (error) {
      setReLoading(false);
      toast.error("An unexpected error occured. Please try again  later");

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

  const handleVerifyOTP = async () => {
    setError(null);
    if (otpValue.length === 6) {
      try {
        setVerifyLoading(true);
        if (otp) {
          const result = await verifyOtpApi(login.email, otpValue);

          // dispatch(user_login_thunk(login, setError, setOTP));

          setCookies(result.data.data.token);
          setVerifyLoading(false);
          setNavigate(true);
          dispatch(user_load_by_token_thunk(result.data.data.token));
        } else {
          //google auth api based call
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
        }
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
      setError("Please enter the 6-digit-code from your Authenticator App.");
    }
  };
  const handleResendOTP = async () => {
    if (login.email) {
      try {
        setReLoading(true);
        await resendOtpApi(login.email);
        setReLoading(false);
        toast.success(
          "Your confirmation email has been sent to your registered email address"
        );
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
          toast.error("An unexpected error occured. Please try again  later");
        }

        console.log(
          "🚀 ~ file: index.js ~ line 196 ~ handleResendEmail ~ error",
          error
        );
      }
    }
  };

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
              <LoginNavComponent
                currentPage={currentPage}
                setcurrentPage={setcurrentPage}
              />
              {otp ? (
                <>
                  <h4>Verify Your Email</h4>
                  <p>We have sent an OTP to your email address.</p>
                </>
              ) : (
                <h4 className="google_2fa_info">
                  Enter 6-digit-code from your Google Authenticator App
                </h4>
              )}
              {/* <h4>Verify Your Email</h4> */}
              {/* <p>We have sent an OTP to your email address.</p> */}
              <div className="form-group mb-3">
                <InputOTP onChange={(e) => setOTPValue(e)} value={otpValue} />
              </div>
              {validation.valid_email && (
                <p className="error_text">Please enter a valid email address</p>
              )}

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
                    <>{verifyLoading ? "Verifying..." : "Verify"}</>
                  )}
                </button>
                {error && <p className="error_text text-center">{error}</p>}
              </div>
              {otp && (
                <p>
                  {reLoading ? (
                    "Sending email..."
                  ) : (
                    <>
                      <a href="#" onClick={handleResendOTP}>
                        Click here
                      </a>{" "}
                      to resend the OTP to your email.
                    </>
                  )}
                </p>
              )}
              {/* <p className="mb-4">
                Please{" "}
                <a
                  href="#"
                  onClick={() => {
                    setGoogleOTP(false);
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

              {/* <p className="mb-4 text-secondary">
                Don't forget to check your Spam/Bulk folder too.
              </p> */}
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
                    onClick={() => setcurrentPage("emailotp")}
                    className="text_right_nav"
                  >
                    Use OTP
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
              <div className="form-group mb-3 float-icon">
                <InputText
                  title={"Password"}
                  required={validation.password}
                  type={password ? "password" : "text"}
                  name="password"
                  onChange={handleChangeEvent}
                  value={login.password}
                  onKeyPress={handleKeyPressEvent}
                />
                {!password ? (
                  <FaEyeSlash
                    role="button"
                    onClick={() => setPassword(!password)}
                    className="eye"
                  />
                ) : (
                  <FaEye
                    className="eye"
                    role="button"
                    onClick={() => setPassword(!password)}
                  />
                )}
              </div>
              {validation.valid_password && (
                <p className="error_text">Password not long enough</p>
              )}
              <div className="form-group mb-3">
                <ReCAPTCHA
                  className="recaptcha_box"
                  sitekey={process.env.REACT_APP_CAPTCHA_KEY}
                  onChange={(value) => {
                    console.log("Captcha value:", value);
                    setCaptcha(true);
                  }}
                />
                {validation.captcha && (
                  <p className="error_text">
                    Please verify the CAPTCHA to proceed
                  </p>
                )}
              </div>
              <p className="mt-3 ">
                <span className="terms-text-reg">
                  By Proceeding Further & Clicking on 'Sign In' You Agree to
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
              <div className="form-group mb-2">
                <button
                  type="button"
                  className="btn btn-dark w-100"
                  onClick={handleLogin}
                  disabled={user.loading}
                >
                  {user.loading ? "Loading..." : "Sign In"}
                </button>
                {(() => {
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

              <div className="form-group bl_forgot mb-2 text-center">
                <p className="mb-4">
                  <Link to="/forgot-password">{"Forgot Password"}</Link>
                </p>

                <div className="social-login-block">
                  <h5 className="social_OR">or</h5>
                  <p className="login-with-heading">Sign In with</p>
                  <div className="social-login-btn-block">
                    <GoogleLogin />
                    {/* <FacebookLogin /> */}
                  </div>
                </div>

                <p>
                  <span>Don't have an account? </span>
                  <Link to="/signup" className="bold-font">
                    Sign Up
                  </Link>
                </p>
              </div>
              {/* <p className="etc_text mb-0">
                <a
                  href={process.env.REACT_APP_GUARDIAN_HELP_URL}
                  target="_blank"
                >
                  Why do you need a GuardianLink account?
                </a>
              </p> */}
            </div>
          </div>
        </Wrapper>
      )}
    </>
  );
};

export default LoginWithEmailComponent;
