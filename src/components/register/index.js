/* eslint-disable jsx-a11y/anchor-is-valid */
import ReCAPTCHA from "react-google-recaptcha";
import mixpanel from "mixpanel-browser";
import ReactPixel from "react-facebook-pixel";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useLocation } from "react-router-dom";
import { useRouteMatch } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import Wrapper from "../wrapper";
import WrapperChakra from "../wrapper-chakra";
import InputText from "../input-text";
import InputPhone from "./../input-phone";
import ToolTip from "../tooltip";
import guardian_logo from "../../images/jump-trade/guardianLinkLogo.png";

import {
  getCookies,
  getCookiesByName,
  getSourceCookies,
} from "../../utils/cookies";
import { registerApi, trackIP, xena } from "./../../api/methods";

import {
  validateEmail,
  validatePassword,
  validateName,
  validInternationalPhone,
  validateNameReplace,
  openWindowBlank,
  invokeTrackEvent,
  EVENT_NAMES,
} from "./../../utils/common";
import { useQuery } from "../../hooks/url-params";

import GoogleLogin from "../social-login/google-login";
import FacebookLogin from "../social-login/facebook-login";

import "./style.scss";

const RegisterComponent = ({ show_success = false }) => {
  // const history = useHistory();

  const { fsz, guild_source } = useRouteMatch().params;
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState("in");

  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [captcha, setCaptcha] = useState(false);
  const [password, setPassword] = useState(true);
  const [error, setError] = useState("");
  // const [couponError, setCouponError] = useState("");
  const [referralError, setReferralError] = useState("");
  const [phonenumberError, setPhoneNumberError] = useState("");

  // const [invitecode, setInviteCode] = useState(false);

  const [register, setRegister] = useState({
    //name: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_no: "",
    phone_code: "",
    accepted_terms_and_condition: true,
    // coupon: "",
    invite_code: "",
  });
  const [checked, setChecked] = useState(false);

  const [validation, setValidation] = useState({
    // name: false,
    //valid_name: false,
    first_name: false,
    valid_first_name: false,
    last_name: false,
    valid_last_name: false,
    email: false,
    valid_email: false,
    password: false,
    valid_password: false,
    phone_no: false,
    valid_phone_no: false,
    captcha: false,
    accepted_terms_and_condition: false,
    // coupon: false,
    // valid_coupon: false,
    invite_code: false,
    valid_invite_code: false,
  });
  const location = useLocation();
  const query = useQuery(location.search);
  const common_source = "jump";

  useEffect(() => {
    getLocationDetails();
    if (process.env.REACT_APP_MARKETING_SCRIPT === "enabled") {
      ReactPixel.init(process.env.REACT_APP_META_PIXEL_ID);
      ReactPixel.pageView();
      ReactPixel.track("Lead");
    }
  }, []);

  useEffect(() => {
    const invite_code = query.get("referralcode")
      ? query.get("referralcode")
      : "";
    // setInviteCode(invite_code);

    // const coupon = query.get("promocode") ? query.get("promocode") : "";
    // if (coupon) {
    if (invite_code || getCookiesByName("referralcode")) {
      setChecked(true);
      setRegister({
        ...register,
        // coupon: coupon,
        invite_code: invite_code || getCookiesByName("referralcode"),
      });
    }
    const token = getCookies();
    if (token) {
      return window.open("/accounts/profile", "_self");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLocationDetails = async () => {
    try {
      const result = await trackIP();

      const ip_code = result.data?.country_code;

      if (ip_code) {
        setCountry(ip_code.toLowerCase());
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: index.js ~ line 70 ~ getLocationDetails ~ error",
        error
      );
    }
  };

  const handleChangeEvent = (e) => {
    if (e.target.value) {
      if (e.target.name === "name") {
        if (validateName(e.target.value)) {
          setRegister({
            ...register,
            [e.target.name]: validateNameReplace(e.target.value),
          });
          setValidation({ ...validation, [e.target.name]: false });
        }
      } else if (e.target.name === "email") {
        setRegister({ ...register, [e.target.name]: e.target.value.trim() });
        setValidation({ ...validation, [e.target.name]: false });
      } else {
        setRegister({ ...register, [e.target.name]: e.target.value });
        setValidation({ ...validation, [e.target.name]: false });
      }
    } else {
      setRegister({ ...register, [e.target.name]: e.target.value });
      setValidation({ ...validation, [e.target.name]: true });
    }
  };

  const checkValidation = () => {
    let c_validation = { ...validation };
    // if (!register.name) {
    //   c_validation = { ...c_validation, name: true };
    // } else {
    //   if (validateName(register.name)) {
    //     c_validation = { ...c_validation, valid_name: false };
    //   } else {
    //     c_validation = { ...c_validation, valid_name: true };
    //   }
    // }

    if (!register.first_name) {
      c_validation = { ...c_validation, first_name: true };
    } else {
      if (validateName(register.first_name)) {
        c_validation = { ...c_validation, valid_first_name: false };
      } else {
        c_validation = { ...c_validation, valid_first_name: true };
      }
    }

    if (!register.last_name) {
      c_validation = { ...c_validation, last_name: true };
    } else {
      if (validateName(register.last_name)) {
        c_validation = { ...c_validation, valid_last_name: false };
      } else {
        c_validation = { ...c_validation, valid_last_name: true };
      }
    }
    if (!register.email) {
      c_validation = { ...c_validation, email: true };
    } else {
      if (validateEmail(register.email)) {
        c_validation = { ...c_validation, valid_email: false };
      } else {
        c_validation = { ...c_validation, valid_email: true };
      }
    }
    if (!register.password) {
      c_validation = { ...c_validation, password: true };
    } else {
      if (validatePassword(register.password)) {
        c_validation = { ...c_validation, valid_password: false };
      } else {
        c_validation = { ...c_validation, valid_password: true };
      }
    }
    if (!register.phone_no) {
      c_validation = { ...c_validation, phone_no: true };
    } else {
      if (validInternationalPhone(register.phone_no, register.phone_code)) {
        c_validation = { ...c_validation, valid_phone_no: false };
      } else {
        c_validation = { ...c_validation, valid_phone_no: true };
      }
    }
    if (!register.accepted_terms_and_condition) {
      c_validation = { ...c_validation, accepted_terms_and_condition: true };
    }

    // if (checked && !register.coupon) {
    //   c_validation = { ...c_validation, coupon: true };
    // } else {
    //   c_validation = { ...c_validation, valid_coupon: false };
    // }

    if (checked && !register.invite_code) {
      c_validation = { ...c_validation, invite_code: true };
    } else {
      c_validation = { ...c_validation, valid_invite_code: false };
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
      // !c_validation.name &&
      // !c_validation.valid_name &&
      !c_validation.first_name &&
      !c_validation.valid_first_name &&
      !c_validation.last_name &&
      !c_validation.valid_last_name &&
      !c_validation.email &&
      !c_validation.password &&
      !c_validation.phone_no &&
      !c_validation.valid_email &&
      !c_validation.valid_phone_no &&
      !c_validation.valid_password &&
      !c_validation.accepted_terms_and_condition &&
      // !c_validation.coupon &&
      // !c_validation.valid_coupon &&
      !c_validation.invite_code &&
      !c_validation.valid_invite_code &&
      !c_validation.captcha
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleSignUp = async () => {
    if (checkValidation()) {
      try {
        setLoading(true);

        let apiInput = { ...register };

        // if (!checked) {
        //   apiInput = { ...register, coupon: null };
        // }

        if (!checked) {
          apiInput = { ...register, invite_code: null };
        }

        const c_source = fsz ? fsz : getSourceCookies();
        const c_guild_source = guild_source
          ? guild_source
          : getCookiesByName("guild_source");

        if (
          c_source &&
          c_source !== undefined &&
          c_source !== "undefined" &&
          c_guild_source &&
          c_guild_source !== undefined &&
          c_guild_source !== "undefined"
        ) {
          apiInput = {
            ...register,
            fsz: c_source,
            guild_source: c_guild_source,
            source: common_source,
          };
        } else if (
          c_source &&
          c_source !== undefined &&
          c_source !== "undefined"
        ) {
          apiInput = { ...register, fsz: c_source, source: common_source };
        } else if (
          c_guild_source &&
          c_guild_source !== undefined &&
          c_guild_source !== "undefined"
        ) {
          apiInput = {
            ...register,
            guild_source: c_guild_source,
            source: common_source,
          };
        }
        // const phone_number = getMobileNumber(
        //   user?.data?.user?.phone_no || "",
        //   user?.data?.user?.phone_code || ""
        // );

        const result = await registerApi(apiInput);

        if (result.status === 201) {
          invokeTrackEvent(EVENT_NAMES?.USER_SIGN_UP, {
            "First Name": register?.first_name,
            "Last Name": register?.last_name,
            email: register?.email,
            Phone: `+${register?.phone_no}`,
          });
          // setRegisterSuccess(true);
          // XENA Marketing Registration Endpoint
          if (getCookiesByName("aid")) {
            const response = await xena({
              code: 10033,
              uid: result?.data?.data?.user_id,
              aid: getCookiesByName("aid"),
              campaign: getCookiesByName("campaign"),
              source: getCookiesByName("source"),
              vid: getCookiesByName("vid"),
              click_id: getCookiesByName("click_id"),
              event_name: "registration",
            });
            if (process.env.REACT_APP_MARKETING_SCRIPT === "enabled") {
              mixpanel.track("Sign up");
            }
            response.status === 200 && window.open("/signup/success", "_self");
          } else {
            if (process.env.REACT_APP_MARKETING_SCRIPT === "enabled") {
              mixpanel.track("Sign up");
            }
            window.open("/signup/success", "_self");
          }
        }
      } catch (err) {
        setLoading(false);
        console.log(err);
        if (err?.status === 422) {
          //  if (err?.data?.error_code === 0) {
          //    if (register.email) {
          //      window.open(
          //        `/signin?email=${encodeURIComponent(register.email)}`,
          //        "_self"
          //      );
          //    } else {
          //      setError(
          //        "This Email is already associated with a GuardianLink ID. Please Login or use a different email to register."
          //      );
          //    }
          //  }
          if (err?.data?.error_code === 0) {
            if (err?.data?.message === "Email has already been taken") {
              if (register.email) {
                window.open(
                  `/signin?email=${encodeURIComponent(register.email)}`,
                  "_self"
                );
              } else {
                setError(
                  "This Email is already associated with a GuardianLink ID. Please Login or use a different email to register."
                );
              }
            } else {
              setPhoneNumberError("Phone number has already been taken");
            }
          }

          // if (err?.data?.error_code === 1) {
          //   setCouponError("You have entered an invaild coupon code");
          // }
          if (err?.data?.error_code === 2) {
            setReferralError("You have entered an invaild referral/promo code");
          }
          if (err?.data?.error_code === 3)
            setPhoneNumberError("Phone number has already been taken");
        } else {
          toast.error("An unexpected error occured. Please try again ");
          console.log(
            "🚀 ~ file: index.js ~ line 106 ~ handleSignUp ~ err",
            err
          );
        }
      }

      setLoading(false);
    }
  };

  const handleKeyPressEvent = (event) => {
    if (event.key === "Enter") {
      handleSignUp();
    }
  };

  const RegisterLogics = () => {
    return (
      <>
        {show_success ? (
          <div className="bl_form_box">
            <div className="log_top">
              <div className="login_logos">
                <a>
                  {" "}
                  <ToolTip
                    icon={
                      <img
                        src={guardian_logo}
                        alt="Guardian-Logo"
                        role="button"
                        onClick={() =>
                          openWindowBlank(process.env.REACT_APP_GUARDIAN_URL)
                        }
                      />
                    }
                    content={
                      <>
                        Your GuardianLink ID gives access to all NFT drops,
                        marketplaces, & other platforms powered by GuardianLink.
                      </>
                    }
                    placement="top"
                  />
                </a>
              </div>
            </div>
            <div className="form-cntnt-box">
              <h4>Welcome to Jump.trade! </h4>
              <p>
                You're just a step away from accessing a world of unique NFTs!
              </p>

              <p className="mb-4">
                Please <Link to="/signin"> login </Link> to continue{" "}
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
                        alt="Guardian-Logo"
                        role="button"
                        onClick={() =>
                          openWindowBlank(process.env.REACT_APP_GUARDIAN_URL)
                        }
                      />
                    }
                    content={
                      <>
                        Your GuardianLink ID gives access to all NFT drops,
                        marketplaces, & other platforms powered by GuardianLink.
                      </>
                    }
                    placement="top"
                  />
                </a>
              </div>
            </div>
            <div className="form-cntnt-box">
              <p className="text-center etc_text">
                You are one step away from Joining our Meta world!
              </p>
              {/* <div className="form-group mb-3">
                <InputText
                  title={"Name"}
                  name="name"
                  value={register.name}
                  required={validation.name}
                  onKeyPress={handleKeyPressEvent}
                  onChange={handleChangeEvent}
                />
                {validation.valid_name && (
                  <p className="error_text">Please enter a valid name</p>
                )}
              </div> */}
              <div className="form-group mb-3">
                <InputText
                  title={"First Name"}
                  name="first_name"
                  value={register.first_name}
                  required={validation.first_name}
                  onKeyPress={handleKeyPressEvent}
                  onChange={handleChangeEvent}
                />
                {validation.valid_first_name && (
                  <p className="error_text">Please enter a valid first name</p>
                )}
              </div>
              <div className="form-group mb-3">
                <InputText
                  title={"Last Name"}
                  name="last_name"
                  value={register.last_name}
                  required={validation.last_name}
                  onKeyPress={handleKeyPressEvent}
                  onChange={handleChangeEvent}
                />
                {validation.valid_last_name && (
                  <p className="error_text">Please enter a valid last name</p>
                )}
              </div>
              <div className="form-group mb-3">
                <InputText
                  title={"Email Address"}
                  name="email"
                  required={validation.email}
                  value={register.email}
                  onKeyPress={handleKeyPressEvent}
                  onChange={handleChangeEvent}
                />
                {validation.valid_email && (
                  <p className="error_text">
                    Please enter a valid email address
                  </p>
                )}
                {error && <p className="error_text">{error}</p>}
              </div>

              <div className="form-group mb-3 float-icon">
                <InputText
                  title={"Password"}
                  type={password ? "password" : "text"}
                  name="password"
                  required={validation.password}
                  value={register.password}
                  onKeyPress={handleKeyPressEvent}
                  onChange={handleChangeEvent}
                  isPop
                  popText="Your password should have a minimum of 6 characters, and should
              include an uppercase letter and a number."
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
                <p className="error_text">
                  Your password does not comply with our password policy.
                </p>
              )}
              <div className="form-group mb-3">
                <InputPhone
                  title={"Mobile"}
                  defaultCountry={country}
                  value={register.phone_no}
                  required={validation.phone_no}
                  onEnterKeyPress={handleSignUp}
                  onChange={(e, c_code) => {
                    setRegister({
                      ...register,
                      phone_no: e,
                      phone_code: c_code.countryCode.toUpperCase(),
                    });
                    setPhoneNumberError("");
                    setValidation({ ...validation, phone_no: !e });
                  }}
                />
                {validation.valid_phone_no && (
                  <p className="error_text">
                    Please enter a valid mobile number
                  </p>
                )}
                {phonenumberError && (
                  <p className="error_text">{phonenumberError}</p>
                )}
              </div>
              {/* <div className="form-group mb-3">
                <input
                  type="checkbox"
                  role={"button"}
                  checked={checked}
                  onChange={() => setChecked(!checked)}
                />{" "}
                I have a coupon code{" "}
              </div>
              {checked && (
                <div className="form-group mb-3">
                  <InputText
                    title={"Coupon Code"}
                    type="text"
                    value={register.coupon}
                    required={validation.coupon}
                    onKeyPress={handleKeyPressEvent}
                    onChange={(e) => {
                      setRegister({
                        ...register,
                        coupon: e.target.value,
                      });
                      if (e) {
                        setValidation({ ...validation, coupon: false });
                      } else {
                        setValidation({ ...validation, coupon: true });
                      }
                    }}
                  />
                  {validation.valid_coupon && (
                    <p className="error_text">
                      Please enter a valid coupon code
                    </p>
                  )}
                  {couponError && <p className="error_text">{couponError}</p>}
                </div>
              )} */}

              <div className="form-group mb-3">
                <input
                  type="checkbox"
                  role={"button"}
                  checked={checked}
                  onChange={() => setChecked(!checked)}
                />{" "}
                I have a Referral/Promo Code{" "}
              </div>
              {checked && (
                <div className="form-group mb-3">
                  <InputText
                    title={"Referral/Promo Code"}
                    type="text"
                    // disabled={invitecode}
                    value={register.invite_code}
                    required={validation.invite_code}
                    onKeyPress={handleKeyPressEvent}
                    onChange={(e) => {
                      setRegister({
                        ...register,
                        invite_code: e.target.value.trim(),
                      });
                      if (e) {
                        setValidation({ ...validation, invite_code: false });
                      } else {
                        setValidation({ ...validation, invite_code: true });
                      }
                    }}
                  />
                  {validation.valid_invite_code && (
                    <p className="error_text">
                      Please enter a valid Referral/Promo Code
                    </p>
                  )}
                  {referralError && (
                    <p className="error_text">{referralError}</p>
                  )}
                </div>
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
                  By Proceeding Further & Clicking on 'Submit' You Agree to
                  Jump.trade's{" "}
                  <a
                    className="terms-link"
                    href={process.env.REACT_APP_TERMS_URL}
                    target="_blank"
                  >
                    Terms & Conditions.
                  </a>
                </span>
              </p>
              <div className="form-group mb-2">
                <button
                  disabled={loading}
                  type="button"
                  className="btn btn-dark w-100"
                  onClick={handleSignUp}
                >
                  {loading ? "Loading..." : "Submit"}
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

              <div className="form-group bl_forgot mb-2">
                <p className="text-center">
                  <span>Already have a GuardianLink ID? </span>
                  <Link to="/signin" className="bold-font">
                    Sign In
                  </Link>
                </p>
              </div>
              {/* <p className="etc_text">
                {" "}
                <a
                  href={process.env.REACT_APP_GUARDIAN_HELP_URL}
                  target="_blank"
                >
                  {" "}
                  Why do you need a GuardianLink account?{" "}
                </a>{" "}
              </p> */}
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <Wrapper>{RegisterLogics()}</Wrapper>
    </>
  );
};

export default RegisterComponent;
