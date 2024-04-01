import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { useDispatch, useSelector } from "react-redux";
import {
  user_disable_mfa,
  user_enable_mfa_auth_success,
  user_disable_mfa_auth_success,
  user_enable_mfa,
} from "../../redux/actions/user_action";
import {
  user_disable_mfa_thunk,
  user_mfa_thunk,
} from "../../redux/thunk/user_thunk";
import {
  enableMfaApi,
  verifyGoogleOtpApi,
  disableMfaApi,
  mfaDetailsApi,
} from "../../api/methods";
import OtpInput from "react-otp-input";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import AuthenticationIcon from "../../images/authicon.svg";
import "./style.scss";
import Alert from "react-bootstrap/Alert";
import { FaLessThanEqual } from "react-icons/fa";

export default function MfaOption(props) {
  const [error, setError] = useState(null);
  const [otpValue, setOtpValue] = useState("");
  const [showQr, setShowQr] = useState(false);
  const [invalidCode, setInvalidCode] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [show, setShow] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [isChecked, setIsChecked] = useState(true);

  const handleClose = () => setShow(false);
  // console.log(isChecked, 'isChecked')
  const [showdisable, setShowdisable] = useState(false);
  const handleClosedisable = () => setShowdisable(false);
  // const handleShow = () => setShow(true);

  const [showAlert, setShowAlert] = useState(false);
  const [noError, setNoError] = useState(true);

  useEffect(() => {
    handelcheckMfaStatus();
  }, []);

  const handelcheckMfaStatus = async () => {
    try {
      const result = await mfaDetailsApi();
      if (!result?.data?.data?.enabled) dispatch(user_enable_mfa(result.data));
      else dispatch(user_disable_mfa(result.data));
    } catch {
      ///toast.success("Authentication has been Enabled Sucessfully");
    }
  };

  const handleOnChange = () => {
    setIsChecked(!isChecked);
  };

  const handleDisableMfa = (e) => {
    e.preventDefault();
    setShowdisable(true);
    // dispatch(user_disable_mfa_thunk());
  };
  // console.log(showdisable)
  const handleMfa = (e) => {
    e.preventDefault();
    user.mfaEnabled
      ? handleDisableMfa(e)
      : dispatch(user_mfa_thunk(setShowQr, setQrValue));
    user.mfaEnabled ? setShow(false) : setShow(true);
  };

  const handleVerifyAlert = () => {
    handleClosedAlert(false);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };
  const handleClosedAlert = () => {
    setShowAlert(false);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError(null);
    if (otpValue.length === 6) {
      try {
        setVerifyLoading(true);
        //google auth api based call
        const payload = { otp_code: otpValue };

        if (showdisable) {
          setVerifyLoading(false);
          dispatch(
            user_disable_mfa_thunk(
              payload,
              setShowMessage,
              setError,
              setShowdisable
            )
          );

          if (!showdisable) {
            setOtpValue("");
          }
          // dispatch(user_disable_mfa_auth_success());
        } else {
          const result = await enableMfaApi(payload);
          setVerifyLoading(false);
          dispatch(user_enable_mfa_auth_success(result.data));
          setOtpValue("");
          ///toast.success("Authentication has been Enabled Sucessfully");

          setShowAlert(true);
          setShowMessage(true);
        }
      } catch (error) {
        setVerifyLoading(false);
        setInvalidCode(true);
        setError(
          "It seems you have entered the wrong Code. Please check the number(s) you have entered."
        );
      }
    } else {
      setError("Please enter the Code");
    }
  };

  return (
    <div className="bl_form_box_new">
      {user.mfaEnabled ? (
        <h6>Authenticator app has been set up successfully</h6>
      ) : (
        ""
      )}

      <button
        className="btn btn-dark mx-auto width-correction"
        onClick={(e) => handleMfa(e)}
      >
        {user.mfaEnabled ? "Disable MFA" : "Enable MFA"}
      </button>
      {showQr && !user.mfaEnabled && (
        <>
          <div className="overall-content">
            {/* <h5>
							Scan the QR code using your authenticator app and entire the
							password below
						</h5> */}

            <div className="qr-verify">
              <Modal
                show={show}
                onHide={handleClose}
                className="Modal-enable multiauth-modal"
              >
                <Modal.Header closeButton>
                  <Modal.Title>MULTI-FACTOR AUTHENTICATION</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="auth-content">
                    <h5>
                      Instead of waiting for text messages, get verification
                      codes from an authenticator app. It works even if your
                      phone is offline.
                    </h5>
                    <p>
                      First, download Google Authenticator from the{" "}
                      <a
                        href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
                        className="qerXTe"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        Google Play Store
                      </a>{" "}
                      or the{" "}
                      <a
                        href="https://apps.apple.com/us/app/google-authenticator/id388497605"
                        className="qerXTe"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        iOS App Store
                      </a>
                    </p>
                  </div>
                  <div>
                    {showQr && qrValue && (
                      <div className="qr_code_new">
                        <h5>Set up authenticator app</h5>
                        <ul>
                          <li> In the Google Authenticator app, tap the +</li>
                          <li>Choose Scan a QR code </li>
                        </ul>

                        <div className="QRCode-verify">
                          <QRCode value={qrValue} size={200} />
                          <div className="athcode-cont">
                            <div className="verify-content">
                              <h5>
                                Enter the 6-digit code that you see in the app{" "}
                              </h5>
                            </div>

                            <div className="otp-input">
                              <OtpInput
                                value={otpValue}
                                onChange={(e) => setOtpValue(e)}
                                numInputs={6}
                                isInputNum={true}
                                separator={"-"}
                              />
                            </div>
                            {/* <div className="checkbox">
														<input
															type="checkbox"
															className="check"
															// id="topping"
															// name="topping"
															// value="Paneer"
															checked={isChecked}
															onChange={handleOnChange}
														/>{'  '}
														Multi-Factor Authentication enabled for
														Jump.trade website
														Jump.trade mobile apps
														Note: Multi-Factor Authentication is not applicable for MCL Game App
														You will now be signed out of all the devices and need to login again.
													</div> */}
                            <div className="form-group-mfa mb-2">
                              <button
                                type="button"
                                className="btn btn-dark  mx-auto"
                                onClick={(e) => handleVerifyOTP(e)}
                                disabled={!verifyLoading && !isChecked}
                              >
                                <>{verifyLoading ? "Verifying..." : "Verify"}</>
                              </button>
                            </div>

                            {error && (
                              <p className="error_text_new text-center verify-errortext">
                                {error}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Modal.Body>
              </Modal>
            </div>
          </div>
        </>
      )}

      <Modal
        show={showdisable}
        onHide={handleClosedisable}
        className="Modal-Disable-mfa"
      >
        <Modal.Header closeButton>
          <Modal.Title>MULTI-FACTOR AUTHENTICATION</Modal.Title>
        </Modal.Header>
        <div className="header-diable mt-4 ">
          <h5>Enter Your Authentication Code</h5>
        </div>

        <div className="otp-input">
          <OtpInput
            value={otpValue}
            onChange={(e) => setOtpValue(e)}
            numInputs={6}
            isInputNum={true}
            separator={"-"}
          />
        </div>
        <div className="form-group-mfa mb-4">
          <button
            type="button"
            className="btn btn-dark mx-auto"
            onClick={(e) => handleVerifyOTP(e)}
            disabled={verifyLoading}
          >
            <>{verifyLoading ? "Verifying..." : "Verify"}</>
          </button>
        </div>
        {error && (
          <p className="error_text_new text-center disable-errortext">
            {error}
          </p>
        )}
      </Modal>

      {/* <Alert variant="success">
				<Alert.Heading>Multi-Factor Authentication enabled for</Alert.Heading>
				<p>
					1)Jump.trade website<br />
					2)Jump.trade mobile apps

				</p>
				<hr />
				<p className="mb-0">
					Note: Multi-Factor Authentication is not applicable for MCL Game App
					You will now be signed out of all the devices and need to login again.
				</p>

				<div className="form-group-mfa mb-2">
					<button
						type="button"
						className="btn btn-dark"
						onClick={(e) => handleVerifyOTP(e)}
						disabled={verifyLoading}>
						<>{verifyLoading ? "Verifying..." : "Okay"}</>
					</button>
				</div>
			</Alert> */}

      <Modal
        show={showMessage}
        onHide={handleClosedAlert}
        className="Modal-alert-mfa"
        size="sm"
      >
        <Modal.Header closeButton>
          <Modal.Title>MULTI-FACTOR AUTHENTICATION</Modal.Title>
        </Modal.Header>
        <div className="header-alert mx-auto mt-4">
          <div className="header-block">
            <div className="auth-icon">
              <img
                src={AuthenticationIcon}
                alt="AuthenticationIcon"
                className="auth-icon-image"
                width={30}
                height={30}
              />
            </div>
            <div>
              <h5>
                {user.mfaEnabled ? (
                  <>Multi-Factor Authentication enabled for</>
                ) : (
                  <>Multi-Factor Authentication disabled for</>
                )}
              </h5>
              <p>
                - Jump.trade website <br />- Jump.trade mobile apps
              </p>
            </div>
          </div>

          {user.mfaEnabled ? (
            <>
              <p className="mb-0 alert-text-enable">
                {/* Note: Multi-Factor Authentication is not applicable for MCL Game App */}
                <span className="text-bold">
                  Note: Multi-Factor Authentication is not applicable for MCL
                  Game App.
                </span>
              </p>
            </>
          ) : (
            ""
          )}
          <p className="mb-0 alert-text">
            {/* Note: Multi-Factor Authentication is not applicable for MCL Game App */}
            <span className="text-danger">
              You have been logged out of Jump.trade and MCL game from all
              devices. Please log in again to continue.
            </span>
          </p>
          <br />
        </div>
        <div className="form-group-mfa mb-4">
          <button
            type="button"
            className="btn btn-dark mx-auto"
            onClick={(e) => handleVerifyAlert(e)}
            disabled={!isChecked}
          >
            <>{"OK"}</>
          </button>
        </div>
        {error && (
          <p className="error_text_new text-center disable-errortext">
            {error}
          </p>
        )}
      </Modal>
    </div>
  );
}
