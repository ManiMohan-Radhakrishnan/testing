import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import InputText from "../input-text";
import Wrapper from "../wrapper";
import { useQuery } from "./../../hooks/url-params";
import { validatePassword } from "./../../utils/common";
import { resetPasswordApi } from "../../api/methods";
import { user_logout_thunk } from "../../redux/thunk/user_thunk";

import guardian_logo from "../../images/jump-trade/guardianLinkLogo.png";

import { openWindowBlank } from "./../../utils/common";

import "./style.scss";

const ChangePassword = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const query = useQuery(location.search);
  const resetPasswordToken = query.get("reset_password_token");

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validation, setValidation] = useState({
    password: false,
    password_confirmation: false,
  });
  const [input, setInput] = useState({
    reset_password_token: resetPasswordToken,
    password: false,
    valid_password: false,
    password_confirmation: false,
    valid_password_confirmation: false,
  });

  const [password, setPassword] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState(true);

  useEffect(() => {
    dispatch(user_logout_thunk());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const TokenExpiredMessage = () => {
    return (
      <>
        <p className="error_text text-center">
          Your password reset token has expired. We have this expiry limit in
          the interest of your account security! <br />
          <br /> You can re-attempt to reset your password by{" "}
          <Link to="/forgot-password">clicking here.</Link>
        </p>
      </>
    );
  };

  const handleSubmit = async () => {
    if (checkValidation()) {
      try {
        setLoading(true);
        const result = await resetPasswordApi(input);

        setLoading(false);
        if (result.status === 200) {
          setSuccess(true);
        }
      } catch (err) {
        if (err?.status === 422) {
          // toast.error("Reset password token expired, please try again");
          setError("token-expired");
        } else {
          toast.error("An unexpected error occured. Please try again ");
          console.log(
            "🚀 ~ file: index.js ~ line 106 ~ handleSignUp ~ err",
            err
          );
        }

        setLoading(false);
      }
    }
  };

  const checkValidation = () => {
    let c_validation = { ...validation };

    if (!input.password) {
      c_validation = { ...c_validation, password: true };
    } else {
      if (validatePassword(input.password)) {
        c_validation = { ...c_validation, valid_password: false };
      } else {
        c_validation = { ...c_validation, valid_password: true };
      }
    }
    if (!input.password_confirmation) {
      c_validation = { ...c_validation, password_confirmation: true };
    } else {
      if (input.password === input.password_confirmation) {
        c_validation = { ...c_validation, valid_password_confirmation: false };
      } else {
        c_validation = { ...c_validation, valid_password_confirmation: true };
      }
    }

    setValidation(c_validation);
    if (
      !c_validation.password &&
      !c_validation.password_confirmation &&
      !c_validation.valid_password &&
      !c_validation.valid_password_confirmation
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleChangeEvent = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    if (e.target.value) {
      setValidation({
        ...validation,
        [e.target.name]: false,
        [`valid_${e.target.name}`]: false,
      });
    } else {
      setValidation({
        ...validation,
        [e.target.name]: true,
        [`valid_${e.target.name}`]: false,
      });
    }
  };

  const handleKeyPressEvent = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <>
      <Wrapper>
        {success ? (
          <div className="bl_form_box">
            <div className="log_top">
              <div className="login_logos">
                <a>
                  <img
                    src={guardian_logo}
                    role="button"
                    onClick={() =>
                      openWindowBlank(process.env.REACT_APP_GUARDIAN_URL)
                    }
                  />
                </a>
              </div>
            </div>
            <div className="form-cntnt-box">
              <h4>Password Changed Successfully</h4>
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
                  <img
                    src={guardian_logo}
                    role="button"
                    onClick={() =>
                      openWindowBlank(process.env.REACT_APP_GUARDIAN_URL)
                    }
                  />
                </a>
              </div>
            </div>
            <div className="form-cntnt-box">
              <h4> Change Password</h4>
              <div className="form-group mb-2 float-icon">
                <InputText
                  title="New Password"
                  type={password ? "password" : "text"}
                  required={validation.password}
                  name="password"
                  onChange={handleChangeEvent}
                  onKeyPress={handleKeyPressEvent}
                  isPop
                  popText="Your password should have a minimum of 6 characters, and should
                include an uppercase letter and a number."
                />
                {!password ? (
                  <FaEyeSlash
                    role="button"
                    className="eye"
                    onClick={() => setPassword(!password)}
                  />
                ) : (
                  <FaEye
                    role="button"
                    className="eye"
                    onClick={() => setPassword(!password)}
                  />
                )}
              </div>
              {validation.valid_password && (
                <p className="error_text my-1">
                  Your password does not comply with our password policy.
                </p>
              )}
              <div className="form-group mb-2 float-icon">
                <InputText
                  title="Confirm New Password"
                  type={confirmPassword ? "password" : "text"}
                  required={validation.password_confirmation}
                  name="password_confirmation"
                  onChange={handleChangeEvent}
                  onKeyPress={handleKeyPressEvent}
                />
                {!confirmPassword ? (
                  <FaEyeSlash
                    role="button"
                    className="eye"
                    onClick={() => setConfirmPassword(!confirmPassword)}
                  />
                ) : (
                  <FaEye
                    role="button"
                    className="eye"
                    onClick={() => setConfirmPassword(!confirmPassword)}
                  />
                )}
              </div>
              {validation.valid_password_confirmation && (
                <p className="error_text my-1">Password doesn't match</p>
              )}
              <div className="form-group mb-2">
                <button
                  disabled={loading}
                  type="button"
                  className="btn btn-dark w-100"
                  onClick={handleSubmit}
                >
                  Change password
                </button>
                {(() => {
                  if (error === "token-expired") {
                    return <TokenExpiredMessage />;
                  } else {
                    return <p className="error_text text-center">{error}</p>;
                  }
                })()}
                {/* <button className="bl_btn bl_btn_border">Cancel</button> */}
              </div>
            </div>
          </div>
        )}
      </Wrapper>
    </>
  );
};

export default ChangePassword;
