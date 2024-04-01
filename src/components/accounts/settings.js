import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";

import { changePasswordApi } from "../../api/methods";
import InputText from "./../input-text";
import { validatePassword } from "./../../utils/common";
import MfaOption from "../mfa-option/index";
import MobileVerify from "../mobile-verify";
import AuthenticationIcon from "../../images/authicon.svg";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [password, setPassword] = useState(true);
  const [updatePassword, setUpdatePassword] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState(true);

  const [error, setError] = useState(false);
  const [data, setData] = useState({
    // current_password: "",
    password: "",
    password_confirmation: "",
  });

  const [validation, setValidation] = useState({
    // current_password: false,
    password: false,
    password_confirmation: false,
  });

  const handleClosedAlert = () => {
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleChangeEvent = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    if (e.target.value) {
      setValidation({ ...validation, [e.target.name]: false });
    } else {
      setValidation({ ...validation, [e.target.name]: true });
    }
  };

  const handleChangePassword = async () => {
    if (checkValidation()) {
      const { password, password_confirmation } = data;

      if (password === password_confirmation) {
        if (validatePassword(password)) {
          try {
            setError(null);
            setLoading(true);

            const result = await changePasswordApi(data);
            if (result.status === 200) {
              ///toast.success("Password Updated Successfully");
              setShowMessage(true);
              setData({
                current_password: "",
                password: "",
                password_confirmation: "",
              });
            }
          } catch (err) {
            setLoading(false);

            if (err?.status === 422) {
              setError(
                "The Current Password Is Invalid. Please Create A New Password Compliant With Our Password Policy. "
              );
            } else {
              toast.error("An unexpected error occured. Please try again ");
              console.log(
                "🚀 ~ file: index.js ~ line 106 ~ handleSignUp ~ err",
                err
              );
            }
          }

          setLoading(false);
        } else {
          setError("Your password does not comply with our password policy.");
        }
      } else {
        setError("Passwords do not match");
      }
    }
  };

  const checkValidation = () => {
    let c_validation = { ...validation };

    // if (!data.current_password) {
    //   c_validation = { ...c_validation, current_password: true };
    // }
    if (!data.password) {
      c_validation = { ...c_validation, password: true };
    }
    if (!data.password_confirmation) {
      c_validation = { ...c_validation, password_confirmation: true };
    }

    setValidation(c_validation);
    if (
      // !c_validation.current_password &&
      !c_validation.password &&
      !c_validation.password_confirmation
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      {/* <div className="col-md-10"> */}
      <div className={`main-content-block  container-fluid`}>
        <div className="row">
          <div className="col-md-12">
            <div className="wallet-user mt-3">
              <div className="row align-items-center">
                <div className="col-lg-7">
                  <h3 className="wallet-title">Security Settings </h3>{" "}
                </div>
              </div>
            </div>
            <div className="change-pass-setting">
              <div className="settings-with-password auth-box">
                <h4 className="settings-card-title">
                  Multi-Factor Authentication
                </h4>{" "}
                {/* Multi factor option enable/disable */}
                <div className="auth">
                  <p>
                    Use the authenticator app to get verification codes at no
                    charge, even when your phone is offline. Available for
                    Android and iPhone.
                  </p>
                </div>
                <MfaOption />
              </div>
              <div className="settings-with-mobilenumber auth-box">
                <h4 className="settings-card-title">
                  Mobile Number Verification
                </h4>{" "}
                <MobileVerify />
              </div>
              <div className="Password-content">
                <h4 className="settings-card-title">Change Password</h4>{" "}
                <div className="user-settings">
                  <div className="passwordChange">
                    <div className="mb-3">
                      <div className="row align-items-center">
                        {/* <div className="col-md-12 field-pass float-icon">
                          <InputText
                            title="Current Password"
                            type={password ? "password" : "text"}
                            required={validation.current_password}
                            name="current_password"
                            placeholder="Enter Current Password"
                            onChange={handleChangeEvent}
                            value={data.current_password}
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
                        </div> */}
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="row align-items-center">
                        <div className="col-md-12 field-pass float-icon">
                          <InputText
                            title="Set New Password"
                            type={updatePassword ? "password" : "text"}
                            required={validation.password}
                            name="password"
                            onChange={handleChangeEvent}
                            value={data.password}
                            placeholder="Enter New Password"
                            isPop
                            popText="Your password should have a minimum of 6 characters, and should
                        include an uppercase letter and a number."
                          />
                          {!updatePassword ? (
                            <FaEyeSlash
                              role="button"
                              className="eye"
                              onClick={() => setUpdatePassword(!updatePassword)}
                            />
                          ) : (
                            <FaEye
                              role="button"
                              className="eye"
                              onClick={() => setUpdatePassword(!updatePassword)}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="row align-items-center">
                        <div className="col-md-12 field-pass float-icon">
                          <InputText
                            title="Re-Enter New Password"
                            type={confirmPassword ? "password" : "text"}
                            required={validation.password_confirmation}
                            name="password_confirmation"
                            onChange={handleChangeEvent}
                            placeholder="Re-Enter New Password"
                            value={data.password_confirmation}
                          />
                          {!confirmPassword ? (
                            <FaEyeSlash
                              role="button"
                              className="eye"
                              onClick={() =>
                                setConfirmPassword(!confirmPassword)
                              }
                            />
                          ) : (
                            <FaEye
                              role="button"
                              className="eye"
                              onClick={() =>
                                setConfirmPassword(!confirmPassword)
                              }
                            />
                          )}
                        </div>
                      </div>
                      <div className="mt-4 text-center">
                        {error && (
                          <div className="text-danger mb-2 w-55 ">{error}</div>
                        )}
                        <button
                          className="btn btn-dark mx-auto width-correction"
                          type="button"
                          onClick={handleChangePassword}
                          disabled={loading}
                        >
                          {loading ? "Loading..." : "Change Password"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal
          show={showMessage}
          onHide={handleClosedAlert}
          className="Modal-alert-mfa"
          size="md"
        >
          <Modal.Header closeButton>
            <Modal.Title>Change Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="header-alert">
              <p className="d-flex w-100 flex-column align-items-center justify-content-center">
                {"  "}
                {/* {user.mfaEnabled ? ( */}
                <div className="auth-icon">
                  <img
                    src={AuthenticationIcon}
                    alt="AuthenticationIcon"
                    className="auth-icon-image"
                    width={30}
                    height={30}
                  />
                </div>
                <span className="update-text">Password Updated!</span>
              </p>

              <p className="mb-0 alert-text">
                <span className="text-danger">
                  You have been logged out of Jump.trade and MCL game from all
                  devices. Please log in again to continue.
                </span>
              </p>
              <br />
            </div>
            <div className="form-group-mfa mb-2">
              <button
                type="button"
                className="btn btn-dark"
                onClick={(e) => handleClosedAlert()}
              >
                <>{"OK"}</>
              </button>
            </div>
            {error && (
              <p className="error_text_new text-center disable-errortext">
                {error}
              </p>
            )}
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default Settings;
