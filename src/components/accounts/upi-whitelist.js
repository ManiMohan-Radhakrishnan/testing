import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";

import {
  reverifyWhitelistPaymentID,
  upiIdVerify,
  whitelistedUpiList,
  whitelistPaymentID,
  whitelistSendOtp,
  whitelistVerifyOtp,
} from "../../api/methods";
import {
  getPanMismatch,
  getPanName,
  getPanNameValid,
  getUpiId,
  getUpiIdDisabled,
  getUpiIdUserName,
  getUpiIdValid,
  whitelistPopUp,
} from "../../redux/actions/user_action";
import { validateUpi } from "./../../utils/common";

import InputText from "./../input-text";
import InputOTP from "../input-otp";

import UPIIcon from "../../images/jump-trade/imgs/upi-icon.svg";
import Tick from "../../images/verified.svg";

const UPIWhitelist = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state);

  const kycStatus = user?.data?.user?.kyc_status;

  const kycCountry = user?.data?.user?.kyc_country_code;

  const [loading, setLoading] = useState(false);
  const [upiListLoad, setUpiListLoad] = useState(false);
  const [sendOtpLoad, setSendOtpLoad] = useState(false);
  const [upiList, setUpiList] = useState([]);

  const [upiIdValid, setUpiIdValid] = useState(false);

  const [panMisMatchError, setPanMisMatchError] = useState("");
  const [inputDisabled, setInputDisabled] = useState(false);

  const [panNameValid, setPanNameValid] = useState(false);
  const [panName, setPanName] = useState("");
  const [userUpiName, setUserUpiName] = useState("");

  const [upiVerifyLoading, setUpiVerifyLoading] = useState(false);

  const [openVerifyModal, setOpenVerifyModal] = useState(false);
  const [upi, setUpi] = useState("");
  const [showVerify, setShowVerify] = useState(false);

  const [resendSec, setResendSec] = useState(0);
  const [validUpiEnter, setValidUpiEnter] = useState(false);
  const [verifyDetails, setVerifyDetails] = useState({
    otp: "",
    password: "",
    error: { otp_verified: true, password_verified: true },
    loading: false,
  });
  const [createSuccess, setCreateSuccess] = useState(false);

  const [password, setPassword] = useState(false);

  useEffect(() => {
    if (!openVerifyModal) {
      setUpi("");
      setValidUpiEnter(false);
      setVerifyDetails({
        otp: "",
        password: "",
        error: { otp_verified: true, password_verified: true },
        loading: false,
      });
      setCreateSuccess(false);
      setResendSec(0);
    }
  }, [openVerifyModal]);

  useEffect(() => {
    const timer =
      resendSec > 0 && setInterval(() => setResendSec(resendSec - 1), 1000);
    return () => clearInterval(timer);
  }, [resendSec]);

  useEffect(() => {
    checkUpiList();
    if (!upiList[0]?.upi_verified) {
      setOpenVerifyModal(false);
    } else {
      setOpenVerifyModal(user?.whitelist_popup);
    }
  }, []);

  const checkUpiList = async () => {
    try {
      setUpiListLoad(true);
      const result = await whitelistedUpiList();
      setUpiList(result?.data?.data?.payment_methods);
      setUpiListLoad(false);
    } catch (error) {
      console.log(error);
      setUpiListLoad(false);
    }
  };

  const upiVerify = async () => {
    let upiIdValue = { vpa: upi };
    try {
      setUpiVerifyLoading(true);
      const result = await upiIdVerify(upiIdValue);
      if (result?.data?.status === 200) {
        setUserUpiName(result?.data?.data?.name);
        dispatch(getUpiIdUserName(result?.data?.data?.name));
        dispatch(getUpiId(upi));
        if (result?.data?.data?.name) {
          setUpiIdValid(true);
          setInputDisabled(true);
          dispatch(getUpiIdValid(true));
          setShowVerify(true);
          setPanNameValid(false);
          dispatch(getPanNameValid(false));
          setPanMisMatchError("");
          dispatch(getPanMismatch(""));
          dispatch(getUpiIdDisabled(true));
        }
        if (result?.data?.data.name && result?.data?.data?.valid === false) {
          setPanName(result?.data?.data?.pan_name);
          dispatch(getPanName(result?.data?.data?.pan_name));
          setPanNameValid(true);
          dispatch(getPanNameValid(true));
          setInputDisabled(true);
          setUpiIdValid(false);
          dispatch(getUpiIdValid(false));
          setPanMisMatchError(result?.data?.message);
          dispatch(getPanMismatch(result?.data?.message));
        }
      }
      toast.error(result?.data?.data?.message);
      setUpiVerifyLoading(false);
    } catch (err) {
      setUpiVerifyLoading(false);
      toast.error(err?.data?.message);
    }
  };

  const sendOtp = async () => {
    setVerifyDetails({
      ...verifyDetails,
      otp: "",
    });
    try {
      setSendOtpLoad(true);
      const result = await whitelistSendOtp({
        source: "web",
        payment_type: "upi",
        payment_id: upi,
        default: true,
      });
      setVerifyDetails({
        ...verifyDetails,
        otp: "",
        error: { otp_verified: true, password_verified: true },
      });
      toast.success("OTP sent successfully");
      setResendSec(60);
      setValidUpiEnter(true);
      setSendOtpLoad(false);
    } catch (error) {
      setSendOtpLoad(false);
      if (error?.data?.error_code === 1002) {
        toast.success(error?.data?.message);
        setValidUpiEnter(true);
        setResendSec(60);
      } else {
        console.log(error);
      }
    }
  };
  const verify = async () => {
    try {
      setVerifyDetails({ ...verifyDetails, loading: true });
      const result = await whitelistVerifyOtp({
        password: verifyDetails.password,
        otp: verifyDetails.otp,
        source: "web",
      });

      if (upiList?.length === 0) {
        createWhiteList();
      } else {
        setVerifyDetails({
          ...verifyDetails,
          loading: false,
        });
        setCreateSuccess(true);
        checkUpiList();
      }

      setVerifyDetails({
        ...verifyDetails,
        error: { otp_verified: true, password_verified: true },
      });
    } catch (error) {
      setVerifyDetails({
        ...verifyDetails,
        loading: false,
        error: error?.data?.data,
      });
      console.log(error.data.data);
    }
  };
  const createWhiteList = async () => {
    try {
      const result = await whitelistPaymentID({
        payment_type: "upi",
        payment_id: upi,
        default: true,
      });
      if (result?.data?.success) {
        setUpi(result?.data?.data?.payment_id);
        setVerifyDetails({
          ...verifyDetails,
          loading: false,
        });
        setCreateSuccess(true);
        checkUpiList();
      }
    } catch (error) {
      toast.error(error?.data?.message);
      console.log(error);
    }
  };

  useEffect(() => {
    if (upi?.length > 0) {
      if (user?.panNameValid) {
        setInputDisabled(true);
        setUpiIdValid(false);
        dispatch(getUpiIdValid(false));
        setShowVerify(true);
      } else {
        if (upi !== user?.upi_id) {
          setInputDisabled(false);
          setUpiIdValid(false);
          dispatch(getUpiIdValid(false));
          setShowVerify(false);
        }
      }
    }

    if (upi?.length > 0 && user?.upi_user_name) {
      if (upi === user?.upi_id) {
        if (user?.panNameValid) {
          setUpiIdValid(false);
          dispatch(getUpiIdValid(false));
          setShowVerify(true);
          setInputDisabled(true);
        } else {
          setUpiIdValid(true);
          dispatch(getUpiIdValid(true));
          setShowVerify(true);
          setInputDisabled(true);
        }
      }
    }
    if (upi?.length > 0 && user?.panNameValid) {
      if (upi !== user?.upi_id) {
        setUpi(user?.upi_id);
      }
    }
  }, [upi]);

  const handleReverify = () => {
    setOpenVerifyModal(true);
    setPanNameValid(user?.panNameValid);
    setPanMisMatchError(user?.panMismatchError);
    setUserUpiName(user?.upi_user_name);
    setPanName(user?.userPanName);
    if (user?.panNameValid) {
      setUpi(user?.upi_id);
    } else {
      setUpi(upiList[0]?.payment_id);
      dispatch(getUpiId(upiList[0]?.payment_id));
    }
  };

  const popover = () => (
    <Popover>
      <Popover.Body>
        <p className="password-terms mb-0">
          Available only for users verified as Indian.
        </p>
      </Popover.Body>
    </Popover>
  );

  const key = "upi_verified";

  const exists = upiList.some((obj) => obj.hasOwnProperty(key));

  return (
    <>
      <div className="whiteList-back auth-box">
        <h4 className="settings-card-title">UPI </h4>
        <p>
          {upiList?.length === 0
            ? `Add your UPI ID to whitelist it for a seamless withdrawal. `
            : `UPI ID whitelisted. `}
          Please contact our support team to update or delete the whitelisted
          UPI ID.
        </p>
        <p className="note-txt">
          <b>Note:</b> The name on the UPI ID entered should match the name on
          the PAN provided during the KYC process.
        </p>

        {/* whitelist option enable/disable */}
        <div
          className={`whitelist-inside ${
            upiList?.length > 0 &&
            !upiList[0]?.upi_verified &&
            "flex-responsive"
          }`}
        >
          {upiList?.length === 0 && !upiListLoad ? (
            <>
              {kycStatus !== "success" || kycCountry !== "IN" ? (
                <OverlayTrigger
                  trigger={["click"]}
                  rootClose={true}
                  placement="top"
                  overlay={popover()}
                >
                  <button
                    className="btn btn-dark mx-auto width-correction"
                    type="button"
                  >
                    Add UPI ID
                  </button>
                </OverlayTrigger>
              ) : (
                <button
                  className="btn btn-dark mx-auto width-correction"
                  type="button"
                  onClick={() => {
                    dispatch(whitelistPopUp(false));
                    setUpi(user?.upi_id);
                    setOpenVerifyModal(true);
                    setPanNameValid(user?.panNameValid);
                    setPanMisMatchError(user?.panMismatchError);
                    setUserUpiName(user?.upi_user_name);
                    setPanName(user?.userPanName);
                    // setInputDisabled(user?.upiIdDisabledMode);
                  }}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Add UPI ID"}
                </button>
              )}
            </>
          ) : (
            <>
              {upiList.map((item, i) => (
                <>
                  <div className="upi-list">
                    <img src={UPIIcon} alt="UPIIcon" /> {item.payment_id}{" "}
                  </div>
                  <div>
                    {exists && (
                      <>
                        {!item?.upi_verified && (
                          <button
                            className="btn btn-dark mx-auto width-correction"
                            type="button"
                            onClick={handleReverify}
                          >
                            Reverify
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </>
              ))}
            </>
          )}
        </div>
      </div>

      <Modal
        show={openVerifyModal}
        className="Modal-alert-mfa upi-modal"
        size="md"
        backdrop="static"
      >
        <Modal.Header
          onHide={() => {
            setOpenVerifyModal(false);
            dispatch(whitelistPopUp(false));
          }}
          closeButton
        >
          <Modal.Title>Add UPI ID</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!validUpiEnter ? (
            <div className="upi-text">
              <div className="upi-input-box">
                {upiList?.length > 0 && !upiList[0]?.upi_verified ? (
                  <>
                    <InputText
                      title="UPI ID"
                      type="name"
                      name="UPI ID"
                      placeholder="Enter Your UPI ID"
                      value={upi}
                      disabled
                    />
                    {upiIdValid && <img src={Tick} className="tick-img" />}
                  </>
                ) : (
                  <>
                    <InputText
                      title="UPI ID"
                      type="name"
                      name="UPI ID"
                      placeholder="Enter Your UPI ID"
                      onChange={(e) => {
                        let value = e.target.value.trim().toLowerCase();
                        setUpi(value);
                      }}
                      value={upi}
                      disabled={inputDisabled ? inputDisabled : false}
                    />

                    {upiIdValid && <img src={Tick} className="tick-img" />}
                  </>
                )}
              </div>

              {upiIdValid && (
                <h5 className="upivalid-name">
                  Name: <b>{`${user?.upi_user_name}`}</b>
                </h5>
              )}

              {panMisMatchError && (
                <div className="mt-3">
                  <h6>{panMisMatchError}</h6>
                  <h6>
                    <span>Name on UPI ID - </span>
                    <span>
                      <b>{userUpiName}</b>
                    </span>
                  </h6>
                  <h6>
                    <span>Name on PAN - </span>
                    <span>
                      <b>{panName}</b>
                    </span>
                  </h6>
                </div>
              )}

              {panNameValid && (
                <h6>
                  Please reach out to the support team for any further queries.
                </h6>
              )}

              {!showVerify ? (
                <button
                  className="btn btn-dark submit-button mx-auto mt-3 width-correction"
                  type="button"
                  onClick={upiVerify}
                  disabled={
                    upi?.length === 0 || upiVerifyLoading || !validateUpi(upi)
                  }
                >
                  {sendOtpLoad ? "Loading" : "VERIFY"}
                </button>
              ) : (
                !panNameValid && (
                  <button
                    className="btn btn-dark submit-button mx-auto mt-3 width-correction"
                    type="button"
                    onClick={sendOtp}
                    disabled={sendOtpLoad}
                  >
                    {sendOtpLoad ? "Loading" : "SUBMIT"}
                  </button>
                )
              )}
            </div>
          ) : (
            <>
              {!createSuccess ? (
                <div className="upi-text">
                  <div className="header-alert">
                    <h4>User Verification</h4>
                  </div>
                  <div className="valid-field">
                    <div className="password-box">
                      <InputText
                        title="Password"
                        type={password ? "text" : "password"}
                        name="UPI"
                        placeholder="Enter Your Password"
                        onChange={(e) =>
                          setVerifyDetails({
                            ...verifyDetails,
                            password: e.target.value,
                          })
                        }
                        value={verifyDetails.password}
                      />
                      {!password ? (
                        <FaEye
                          role="button"
                          onClick={() => setPassword(!password)}
                          className="eye"
                        />
                      ) : (
                        <FaEyeSlash
                          className="eye"
                          role="button"
                          onClick={() => setPassword(!password)}
                        />
                      )}
                    </div>
                    <div className="err-msg-list">
                      {!verifyDetails?.error?.password_verified && (
                        <p>Password is invalid</p>
                      )}
                    </div>
                    <div className="otp-box">
                      <h6>OTP</h6>
                      <InputOTP
                        value={verifyDetails.otp}
                        hideLabel
                        title="Otp"
                        name="OTP"
                        onChange={(e) =>
                          setVerifyDetails({ ...verifyDetails, otp: e })
                        }
                      />
                    </div>
                    <div className="err-msg-list">
                      {verifyDetails?.error?.password_verified &&
                        !verifyDetails?.error?.otp_verified && (
                          <p className="error-text">OTP is invalid</p>
                        )}
                    </div>

                    <button
                      type="button"
                      className="btn btn-dark mx-auto mt-3 mb-2 width-correction"
                      onClick={verify}
                      disabled={
                        verifyDetails.otp.length < 6 ||
                        verifyDetails.loading ||
                        verifyDetails.password === ""
                      }
                    >
                      {verifyDetails.loading ? "loading" : "Verify and add"}
                    </button>
                    {/* <button
                        type="button"
                        className="btn btn-dark resend"
                        onClick={sendOtp}
                        disabled={resendSec !== 0}
                      >
                        Resend {resendSec === 0 ? " " : `(${resendSec})`}
                      </button> */}
                    <p className="resendContet text-center">
                      {resendSec === 0 ? (
                        <>
                          {" "}
                          Didn't receive?{" "}
                          <a
                            href="#"
                            className="text_right_resend_email"
                            onClick={sendOtp}
                          >
                            Resend OTP
                          </a>{" "}
                        </>
                      ) : (
                        <>Please wait {resendSec}s</>
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="upi-text">
                  <div className="center-success">
                    <FaCheckCircle color={"green"} size={28} className="me-2" />
                    <h4>UPI ID Whitelisted.</h4>
                    <h5>{upi}</h5>
                  </div>

                  <button
                    type="button"
                    className="btn btn-dark mx-auto mb-3  mt-2 width-correction"
                    onClick={() => {
                      setOpenVerifyModal(false);
                      dispatch(whitelistPopUp(false));
                    }}
                  >
                    OK
                  </button>
                </div>
              )}
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UPIWhitelist;
