import ToolTip from "../../tooltip";
import Wrapper from "../../wrapper";
import guardian_logo from "../../../images/jump-trade/guardianLinkLogo.png";
import { openWindowBlank, validateNumber } from "../../../utils/common";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { otpNumberVerify, sendNumberOtp } from "../../../api/methods";
import InputPhone from "../../input-phone";
import { toast } from "react-toastify";
import InputOTP from "../../input-otp";
import { setCookies } from "../../../utils/cookies";
import { user_load_by_token_thunk } from "../../../redux/thunk/user_thunk";
import CheckLoginType from "../checkLoginType";
import LoginNavComponent from "../login-nav-component";
import { Link } from "react-router-dom";
import GoogleLogin from "../../social-login/google-login";

const LoginWithNumber = ({ currentPage, setcurrentPage }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [otpValue, setOTPValue] = useState("");
  const [reLoading, setReLoading] = useState(false);

  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendOTP, setResendOTP] = useState(true);
  const [navigate, setNavigate] = useState(false);
  const [countDown, setCountDown] = useState(0);
  const [runTimer, setRunTimer] = useState(false);

  const [login, setLogin] = useState({
    phone_no: "",
    phone_code: "",
  });
  const [error, setError] = useState("");
  const [validation, setValidation] = useState({
    number: false,
    valid_number: false,
  });

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

  const handleChangeEvent = (number, dialCode) => {
    setError(null);
    setLogin({
      ...login,
      phone_no: number?.trim(),
      phone_code: dialCode?.countryCode,
    });
    if (number) {
      setValidation({ ...validation, number: false });
    } else {
      setValidation({ ...validation, number: true });
    }
  };

  const handleKeyPressEvent = (event) => {
    if (event.key === "Enter") {
      //   handleLogin();
    }
  };

  const checkValidation = () => {
    let c_validation = { ...validation };

    if (!login.phone_no) {
      c_validation = { ...c_validation, number: true };
    } else {
      if (validateNumber(login.phone_no) && login.phone_no.length === 12) {
        c_validation = { ...c_validation, valid_number: false };
      } else {
        c_validation = { ...c_validation, valid_number: true };
      }
    }
    setValidation(c_validation);
    if (!c_validation.number && !c_validation.valid_number) {
      return true;
    } else {
      return false;
    }
  };

  const handleSendOTP = async () => {
    if (checkValidation()) {
      try {
        setReLoading(true);
        await sendNumberOtp(login);
        setResendOTP(false);
        setRunTimer(true);
        setReLoading(false);
        setOtpSuccess(true);
        toast.success(
          "Your confirmation number has been sent to your registered number"
        );
      } catch (error) {
        setReLoading(false);

        if (error?.data?.message === "email otp locked") {
          toast.error(
            "Account lock for security reasons, please login again after 10 mins"
          );

          setOTPValue("");
          setError(null);
          setLogin({ number: "", phone_code: "" });
        } else {
          toast.error(error?.data.message);
        }

        console.log(
          "🚀 ~ file: index.js ~ line 196 ~ handleResendEmail ~ error",
          error
        );
      }
    }
  };

  const handleVerifyOTP = async () => {
    setError(null);
    if (otpValue.length === 6) {
      try {
        setVerifyLoading(true);
        const result = await otpNumberVerify({
          phone_no: login?.phone_no,
          sms_otp: otpValue,
        });
        setVerifyLoading(false);
        if (result?.status === 200) {
          setOTPValue("");
          setCookies(result.data.data.token);
          setNavigate(true);
          dispatch(user_load_by_token_thunk(result.data.data.token));
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

  let seconds = countDown ? String(countDown % 60).padStart(2, 0) : null;
  let minutes = countDown
    ? String(Math.floor(countDown / 60)).padStart(2, 0)
    : null;

  const ConfirmError = () => {
    return reLoading ? (
      <p className="error_text text-center text-dark">Sending email...</p>
    ) : (
      <p className="error_text text-center">
        You need to verify your account first.{" "}
        <a href="#" onClick={handleSendOTP}>
          Click here
        </a>{" "}
        to resend the confirmation email.
      </p>
    );
  };

  return (
    <Wrapper>
      {otpSuccess ? (
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
                    onClick={() => {
                      setOtpSuccess(false);
                      setLogin({ phone_no: "", phone_code: "" });
                    }}
                  >
                    {" "}
                    Change{" "}
                  </a>
                </div>
              </div>
              <p className="font-bold text_font_size">+{login?.phone_no}</p>
            </>
            <div className="form-group mb-3">
              <InputOTP onChange={(e) => setOTPValue(e)} value={otpValue} />
            </div>
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
                      onClick={handleSendOTP}
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
          </div>
        </div>
      ) : (
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
            {/* <CheckLoginType
              currentPage={currentPage}
              setcurrentPage={setcurrentPage}
            /> */}

            <div className="form-group mb-3">
              <InputPhone
                title={"Mobile Number"}
                required={validation.number}
                name="email"
                onChange={(number, phone_code) =>
                  handleChangeEvent(number, phone_code)
                }
                onKeyPress={handleKeyPressEvent}
                value={login.phone_no}
              />
            </div>
            {validation.valid_number && (
              <p className="error_text">Please enter a valid number</p>
            )}

            <div className="form-group mb-2">
              <button
                type="button"
                className="btn btn-dark w-100"
                onClick={handleSendOTP}
                disabled={user.loading}
              >
                {reLoading ? "Loading..." : "Request OTP"}
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
      )}
    </Wrapper>
  );
};
export default LoginWithNumber;
