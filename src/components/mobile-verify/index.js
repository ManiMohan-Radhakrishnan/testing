import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FiPhone } from "react-icons/fi";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";

import { profileUpdateApi } from "../../api/methods";
import {
  send_sms_otp_for_mobileVerify_thunk,
  user_load_by_token_thunk,
  verify_sms_mobileVerify_thunk,
} from "../../redux/thunk/user_thunk";
import {
  mobileNumVerifyModal,
  mobilNumAddModal,
} from "../../redux/actions/user_action";

import {
  getMobileNumber,
  validateInternationalPhoneV2,
  mobnumValidation,
} from "../../utils/common";
import { getCookies } from "../../utils/cookies";

import InputPhone from "../input-phone";
import InputOTP from "../input-otp";

import Tick from "../../images/verified.svg";

import "./style.scss";

const MobileVerify = () => {
  const user = useSelector((state) => state?.user?.data?.user);

  const globalValue = useSelector((state) => state?.user);

  const phone_number = getMobileNumber(
    user?.phone_no || "",
    user?.phone_code || ""
  );

  const dispatch = useDispatch();
  const [mobileDetails, setMobileDetails] = useState({
    phone_no: user?.phone_no || "",
    phone_code: user?.phone_code || "",
    phone_no_format: null,
    phone_no_dial_code: "",
    formatted_phone_no: "",
  });

  const [mobileValidation, setMobileValidation] = useState({
    phone_no: false,
    valid_phone_no: false,
    ind_valid_phone_no: false,
  });
  const [resendHide, setResendHide] = useState(true);
  const [verifyModalStatus, setVerifyModalStatus] = useState(false);
  const [show, setShow] = useState(
    (verifyModalStatus && globalValue?.mobile_num_verify) || false
  );
  const [otp, setOtp] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [error, setError] = useState("");
  const [numberChange, setNumberChange] = useState(false);
  const [alertPopup, setAlertPopup] = useState(false);

  const [addNumber, setAddNumber] = useState(
    globalValue?.mobile_num_add || false
  );

  const [loading, setLoading] = useState(false);

  const [seconds, setSeconds] = useState(59);

  useEffect(() => {
    if (show) {
      const interval = setInterval(() => {
        if (seconds > 0) setSeconds(seconds - 1);
        else clearInterval(interval);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [seconds, show]);

  const resendOTP = () => {
    setSeconds(59);
    handleUpdate({ verify: true });
  };

  const checkValidation = () => {
    let validation = { ...mobileValidation };

    let mobNumCountry = getMobileNumber(
      mobileDetails?.phone_no,
      mobileDetails?.phone_code
    );

    let nationalNumber = mobNumCountry[0]?.number?.nationalNumber;

    if (!mobileDetails?.phone_no) {
      validation = { ...validation, phone_no: true };
    } else {
      if (
        mobileDetails?.phone_no.charAt(2) === "0" &&
        mobileDetails?.phone_code === "IN"
      ) {
        validation = { ...validation, ind_valid_phone_no: true };
      } else {
        validation = { ...validation, ind_valid_phone_no: false };
      }
      if (mobNumCountry[0]?.number?.country === "IN") {
        if (
          validateInternationalPhoneV2(mobileDetails) &&
          mobnumValidation(nationalNumber)
        ) {
          validation = { ...validation, valid_phone_no: false };
        } else {
          validation = { ...validation, valid_phone_no: true };
        }
      } else {
        if (validateInternationalPhoneV2(mobileDetails)) {
          validation = { ...validation, valid_phone_no: false };
        } else {
          validation = { ...validation, valid_phone_no: true };
        }
      }
    }

    setMobileValidation(validation);
    if (
      !validation?.phone_no &&
      !validation?.valid_phone_no &&
      !validation?.ind_valid_phone_no
    ) {
      return true;
    } else {
      return false;
    }
  };

  const dispatchCallback = (result) => {
    if (result?.status === 200) {
      setShow(true);
      setOtp(true);
      setVerifyModalStatus(true);
      toast.success(result?.data?.data?.message);
      setNumberChange(false);
      setError("");
      dispatch(mobileNumVerifyModal(false));
      setLoading(false);
    } else {
      setVerifyModalStatus(false);
      dispatch(mobileNumVerifyModal(false));
      if (result?.status === 422) {
        if (result?.data?.error_code === 423) {
          setAlertPopup(true);
        }
      }

      if (result?.data?.message === "OTP is invalid")
        setError(result?.data?.message);
      if (
        result?.data?.message ===
        "OTP retry limit reached. Please try again after sometime."
      )
        setResendHide(false);

      toast.error(result?.data?.message);
      setLoading(false);
    }
  };

  const handleUpdate = ({ change = false, verify = false }) => {
    let request = {
      phone_no: user?.phone_no,
      phone_code: mobileDetails?.phone_code,
      change_phone_no: mobileDetails?.phone_no,
    };
    let mobData = {
      phone_no: mobileDetails?.phone_no,
      phone_code: mobileDetails?.phone_code,
    };

    if (change) {
      if (checkValidation()) {
        setLoading(true);
        dispatch(
          send_sms_otp_for_mobileVerify_thunk({
            data: change ? request : mobData,
            callback: dispatchCallback,
          })
        );
      }
    }
    if (verify) {
      dispatch(
        send_sms_otp_for_mobileVerify_thunk({
          data: change ? request : mobData,
          callback: dispatchCallback,
        })
      );
    }
  };

  const verifySmsCallback = (response) => {
    if (response?.status === 200) {
      toast.success(response?.data?.message);
      setOtpValue("");
      setShow(false);
      setError("");
      setAlertPopup(false);
    } else {
      setError(response?.data?.message);
    }
  };

  const handleVerifyOtp = () => {
    if (otpValue.length === 6) {
      setError("");
      dispatch(
        verify_sms_mobileVerify_thunk({
          data: {
            phone_no: user?.phone_no,
            sms_otp: otpValue,
          },
          callback: verifySmsCallback,
          setError,
        })
      );
    } else {
      setError("Please enter valid OTP value");
    }
  };

  const handleMobileNum = async () => {
    if (checkValidation()) {
      try {
        let updateData = {
          user: {
            phone_no: mobileDetails?.phone_no,
            phone_code: mobileDetails?.phone_code,
            user_profile_attributes: {
              desc: "",
              website: "",
              social_links: {
                facebook: "",
                telegram: "",
                instagram: "",
                twitter: "",
              },
            },
          },
        };
        const response = await profileUpdateApi({
          data: updateData,
          slug: user?.slug,
        });

        if (response?.status === 200) {
          const token = getCookies();
          dispatch(user_load_by_token_thunk(token));
          setAddNumber(false);
          setError("");
          let mobData = {
            phone_no: mobileDetails?.phone_no,
            phone_code: mobileDetails?.phone_code,
          };
          dispatch(mobilNumAddModal(false));
          dispatch(
            send_sms_otp_for_mobileVerify_thunk({
              data: mobData,
              callback: dispatchCallback,
            })
          );
        }
      } catch (err) {
        console.log("err", err?.data?.message);
        setError(err?.data?.message);
      }
    }
  };

  useEffect(() => {
    globalValue?.mobile_num_verify && handleUpdate({ verify: true });
  }, []);

  return (
    <>
      <ol className="numeric-order">
        <li>To get personalised notifications and important updates.</li>
        <li>
          Sign In using Mobile number and OTP{" "}
          <span style={{ color: "#de6f00" }}>
            <i>(coming soon)</i>
          </span>
          .
        </li>
      </ol>
      {user?.phone_no ? (
        <>
          <h5>
            <span>
              <FiPhone />
              {`+${phone_number[0]?.number?.countryCallingCode}`}&nbsp;
              {phone_number[0]?.number?.nationalNumber}
            </span>
            {user?.phone_verified ? (
              <span className="verify-pill">
                <img src={Tick} alt="" className="verify-img" />
                {"  "}
                <span className="text-color">Verified</span>
              </span>
            ) : (
              <button
                onClick={() => handleUpdate({ verify: true })}
                className="verify-btn"
              >
                Verify
              </button>
            )}

            {alertPopup && !user?.phone_verified && (
              <span
                className="ms-auto enter-otp-btn"
                onClick={() => {
                  setShow(true);
                  setOtp(true);
                }}
              >
                Enter OTP
              </span>
            )}
          </h5>

          <div className="bl_form_box_new">
            <button
              className="btn btn-dark mx-auto width-correction"
              onClick={() => {
                setNumberChange(true);
                setMobileDetails({ ...mobileDetails, phone_no: "" });
              }}
            >
              Change Mobile Number
            </button>
          </div>
        </>
      ) : (
        <div className="bl_form_box_new">
          <button
            className="btn btn-dark mx-auto width-correction"
            onClick={() => setAddNumber(true)}
          >
            Add Mobile Number
          </button>
        </div>
      )}

      <Modal
        show={show}
        backDrop="static"
        onHide={() => {
          setShow(false);
          setOtpValue("");
          setOtp(false);
          setError("");
          setSeconds(59);
          dispatch(mobileNumVerifyModal(false));
          setAlertPopup(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Verify Mobile Number</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!loading ? (
            <>
              {otp && (
                <>
                  <p className="mb-0">
                    We have sent an OTP to your mobile number{" "}
                    <span className="user-phone">{`+${
                      show ? mobileDetails?.phone_no : user?.phone_no
                    }`}</span>
                  </p>
                  <InputOTP onChange={(e) => setOtpValue(e)} value={otpValue} />
                  {error && <p className="error-text text-center">{error}</p>}

                  <button
                    className="btn btn-dark mx-auto mt-3 width-correction"
                    disabled={otpValue.length < 6}
                    onClick={handleVerifyOtp}
                  >
                    Verify
                  </button>
                  {/* <p>Please Resend OTP in {`00:${counter}`} </p> */}
                  {resendHide && (
                    <>
                      {" "}
                      <div className="countdown-text">
                        {seconds > 0 ? (
                          <p>
                            Please wait{" "}
                            {seconds < 10 ? `00:0${seconds}` : `00:${seconds}`}
                          </p>
                        ) : (
                          <p>Didn't recieve OTP?</p>
                        )}
                        {seconds === 0 && (
                          <a href="#" onClick={resendOTP}>
                            Resend
                          </a>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          ) : (
            <div className="loading-txt">Loading...</div>
          )}
        </Modal.Body>
      </Modal>
      <Modal
        show={addNumber}
        backDrop="static"
        onHide={() => {
          setAddNumber(false);
          setMobileDetails("");
          setMobileValidation({
            ...mobileValidation,
            valid_phone_no: false,
            phone_no: false,
            ind_valid_phone_no: false,
          });
          setError("");
          dispatch(mobilNumAddModal(false));
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Mobile Number</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputPhone
            title={`Mobile Number`}
            required={mobileValidation?.phone_no}
            onChange={(e, c_code, _, formatedValue) => {
              let { format, dialCode, countryCode } = c_code;

              setMobileDetails({
                ...mobileDetails,
                phone_no: e,
                phone_code: countryCode.toUpperCase(),
                phone_no_format: format,
                phone_no_dial_code: dialCode,
                formatted_phone_no: formatedValue,
              });
              if (e) {
                setMobileValidation({ ...mobileValidation, phone_no: false });
              } else {
                setMobileValidation({ ...mobileValidation, phone_no: true });
              }
            }}
          />
          {mobileValidation?.valid_phone_no && (
            <p className="error-text">Please enter a valid mobile number</p>
          )}
          {mobileValidation?.ind_valid_phone_no && (
            <p className="error-text">Please enter a valid mobile number</p>
          )}
          {error && <p className="error-text">{error}</p>}
          <button
            className="btn btn-dark mx-auto mt-3 width-correction"
            onClick={handleMobileNum}
          >
            Add
          </button>
        </Modal.Body>
      </Modal>
      <Modal
        show={numberChange}
        backDrop="static"
        onHide={() => {
          setNumberChange(false);
          setMobileDetails({ ...mobileDetails, phone_no: user?.phone_no });
          setMobileValidation({
            ...mobileValidation,
            valid_phone_no: false,
            phone_no: false,
            ind_valid_phone_no: false,
          });
          setSeconds(59);
          setError("");
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Mobile Number</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputPhone
            title={`Mobile Number`}
            value={mobileDetails?.phone_no}
            required={mobileValidation?.phone_no}
            onChange={(e, c_code, _, formatedValue) => {
              let { format, dialCode, countryCode } = c_code;
              setMobileDetails({
                ...mobileDetails,
                phone_no: e,
                phone_code: countryCode.toUpperCase(),
                phone_no_format: format,
                phone_no_dial_code: dialCode,
                formatted_phone_no: formatedValue,
              });
              if (e) {
                setMobileValidation({ ...mobileValidation, phone_no: false });
              } else {
                setMobileValidation({ ...mobileValidation, phone_no: true });
              }
            }}
          />
          {mobileValidation?.valid_phone_no && (
            <p className="error-text">Please enter a valid mobile number</p>
          )}
          {mobileValidation?.ind_valid_phone_no && (
            <p className="error-text">Please enter a valid mobile number</p>
          )}
          {/* {error && <p className="error-text">{error}</p>} */}
          <button
            onClick={() => handleUpdate({ change: true })}
            className="btn btn-dark mx-auto mt-3 width-correction"
          >
            Change And Verify
          </button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MobileVerify;
