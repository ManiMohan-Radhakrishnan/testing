import React, { useState, useEffect } from "react";
import { Dropdown, FormControl, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { validateEmail } from "../../utils/common";
// import InputText from "../input-text";
import userImg from "../../images/user_1.png";
import { AiFillCaretDown } from "react-icons/ai";
import {
  sendEmailAssignOtpApi,
  resenEmaildAssignOtpApi,
  AssignRoleApi,
  getRoles,
} from "../../api/methods";

import InputOTP from "../input-otp";

import "./style.scss";
import { BiSearch } from "react-icons/bi";

const TwofaPopup = ({
  IsShow,
  setShow,
  twoFactorUserData,
  ReloadData,
  guildUserMenuPermissionList,
}) => {
  const [roleList, setRoleList] = useState({});
  const initial2fa = {
    id: twoFactorUserData?.slug,
    otp: "",
    role_id: "",
  };

  const [validation, setValidation] = useState({
    email: false,
    valid_email: false,
    existing_role: false,
    valid_otp: false,
    otp: false,
  });

  useEffect(() => {
    guildRoles();
  }, []);

  const guildRoles = async () => {
    try {
      const result = await getRoles();
      setRoleList(result?.data?.data?.guild_roles);
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };
  const [runTimer, setRunTimer] = useState(false);
  const [countDown, setCountDown] = useState(0);
  const [twofaverifydata, setTwofaverifydata] = useState(initial2fa);

  const [inputDisabled, setInputDisabled] = useState(true);
  const [otpSending, setOtpSending] = useState(false);
  const [makeSubAdminButton, setMakeSubAdminButton] = useState(false);
  const [userRole, setUserRole] = useState("Select Role");
  const [isSend, setIsSend] = useState(false);

  // 2fa verification email id
  const handleemailotp = async () => {
    if (verifyEmail()) {
      try {
        const result = await sendEmailAssignOtpApi();
        toast.success("OTP has been Sent");
        setInputDisabled(false);
        setRunTimer(true);
        setIsSend(true);
      } catch (error) {
        setInputDisabled(true);
        setRunTimer(false);
        setOtpSending(false);
        toast.error(error?.data?.message);
      }
    } else {
      return false;
    }
  };

  const MakeAuthvalidation = () => {
    let c_validation = { ...validation };
    if (!twofaverifydata?.otp) {
      c_validation = { ...c_validation, otp: true, valid_otp: false };
    } else {
      if (twofaverifydata?.otp?.length != 6) {
        c_validation = { ...c_validation, otp: false, valid_otp: true };
      } else {
        c_validation = { ...c_validation, otp: false, valid_otp: false };
      }
    }
    if (!twofaverifydata?.role_id) {
      c_validation = { ...c_validation, existing_role: true };
    } else {
      c_validation = { ...c_validation, existing_role: false };
    }
    console.log(twofaverifydata, "twofaverifydata");
    // console.log(twofaverifydata?.role_id);
    console.log(c_validation, "c_validation");
    setValidation(c_validation);
    if (
      c_validation.otp ||
      c_validation.existing_role ||
      c_validation.valid_otp
    ) {
      return false;
    }
    return true;
  };
  // handle fucntionality
  const handleMakeSubadmin = async () => {
    if (MakeAuthvalidation()) {
      try {
        setMakeSubAdminButton(true);
        // console.log(twofaverifydata, "twofaverifydata");

        const result = await AssignRoleApi(twofaverifydata);
        // console.log(result, "result");
        setMakeSubAdminButton(false);
        // const result = "";
        if (result?.data?.success) {
          toast.success("Role Assigned Successfully ");
          setShow(false);
          setMakeSubAdminButton(false);
          setIsSend(false);
          ReloadData();
        }
      } catch (error) {
        toast.error(error?.data?.message);
        setMakeSubAdminButton(false);
      }
    }
  };

  useEffect(() => {
    let timerId;
    if (runTimer) {
      setCountDown(60 * 1);

      timerId = setInterval(() => {
        setCountDown((countDown) => countDown - 1);
      }, 1000);
    } else {
      clearInterval(timerId);
      // setResendOTP(true);
    }

    return () => clearInterval(timerId);
  }, [runTimer]);

  useEffect(() => {
    if (countDown < 0 && runTimer) {
      setRunTimer(false);
      setCountDown(0);
    }
  }, [countDown, runTimer]);

  const verifyEmail = () => {
    let c_validation = { ...validation };
    if (!twoFactorUserData?.email) {
      c_validation = { ...c_validation, email: true };
    } else {
      if (validateEmail(twoFactorUserData?.email)) {
        c_validation = { ...c_validation, valid_email: false };
      } else {
        c_validation = { ...c_validation, valid_email: true };
      }
    }
    setValidation(c_validation);
    if (!c_validation.email && !c_validation.valid_email) {
      return true;
    } else {
      return false;
    }
  };

  // const resendOTPInput = () => {
  //   if (!runTimer && !inputDisabled) {
  //     return false;
  //     //return true;
  //   } else {
  //     return true;
  //   }
  // };
  const resendOTP = async () => {
    if (verifyEmail()) {
      try {
        const result = await resenEmaildAssignOtpApi();
        console.log(result, "result");
        if (result?.data?.success) {
          toast.success("OTP has been resent");
          setInputDisabled(false);
          setRunTimer(true);
        }
      } catch (error) {
        setInputDisabled(true);
        setRunTimer(false);
        setOtpSending(false);
        toast.error(error?.data?.message);
      }
    } else {
      return false;
    }
  };

  let seconds = countDown ? String(countDown % 60).padStart(2, 0) : null;
  let minutes = countDown
    ? String(Math.floor(countDown / 60)).padStart(2, 0)
    : null;

  const RoleDropdown = React.forwardRef(({ onClick }, ref) => (
    <div
      className="filter-drop-btn d-flex justify-content-between align-items-center"
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {userRole} <AiFillCaretDown className="dropdown-arrow-icon" />
    </div>
  ));
  const CustomMenu = React.forwardRef(({ children, style, className }, ref) => {
    const [value, setValue] = useState("");
    return (
      <div ref={ref} className={className}>
        <span className="filter-search-block">
          <FormControl
            autoFocus
            className="filter-search"
            placeholder="Search Role"
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
          <BiSearch className="filter-search-icon" size={15} />
        </span>
        <ul className="list-unstyled scroll-fixed">
          {React.Children.toArray(children).filter(
            (child) =>
              !value ||
              child.props.children
                .toLowerCase()
                .includes(value.toLocaleLowerCase())
          )}
        </ul>
      </div>
    );
  });

  return (
    <div className="guilduser-profile-section">
      {/* 2fa verification modal */}
      <Modal
        className="twofa-modal-content"
        show={IsShow}
        backdrop="static"
        onHide={() => {
          setShow(false);
          setIsSend(true);
        }}
      >
        <Modal.Header
          className="twofa-modal-header"
          closeButton={runTimer || otpSending ? false : true}
        >
          <>
            <div>Assign Role</div>
          </>
        </Modal.Header>
        <Modal.Body className="twofa-modal-body">
          <>
            <div className="enter-otp-section mb-3">
              <div>
                <h6>
                  {/* <button
                    className="m-2 text-center twofa-modal-heading-text resend-otp"
                    disabled={resendOTPInput()}
                    onClick={() => resendOTP()}
                  >
                    {" "}
                    Resend OTP
                  </button> */}
                </h6>
                <div className="user-mail-section">
                  {/* <div className="d-flex align-items-center flex-row">
                    <InputText
                      // title={"ENTER EMAIL ID"}
                      // placeholder={"Enter Email"}
                      className="w-100 twofa-modal-search disabled"
                      name="email"
                      required={validation?.email}
                      value={twoFactorUserData?.email}
                    />
                  </div> */}
                  <div className="row">
                    <div className="p-2 user-email-section col d-flex align-items-start justify-content-start flex-column">
                      <div className="user-profile-email user-profile-detail-value">
                        <img
                          className="user-image"
                          src={userImg}
                          alt="user-icon"
                        />
                        <div className="name-group">
                          <h4>{twoFactorUserData?.email}</h4>
                          <h6>{twoFactorUserData?.full_name}</h6>
                          <h5 className="name-info">
                            Selected The User Mail ID to assign NFTs
                          </h5>
                          {/* <p>(Enter The User Mail ID to assign NFTs *)</p> */}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="enter-role-section">
                    <h5>Select Role</h5>
                    <Dropdown className="twofa-modal-dropdown">
                      <Dropdown.Toggle
                        align="start"
                        drop="start"
                        as={RoleDropdown}
                        className="twofa-modal-dropdown-placeholder"
                      ></Dropdown.Toggle>
                      <Dropdown.Menu
                        align="start"
                        as={CustomMenu}
                        className="twofa-modal-dropdown-menu"
                      >
                        {roleList &&
                          Object.keys(roleList)?.length > 0 &&
                          Object.keys(roleList)?.map((roleData, roleIndex) => (
                            <Dropdown.Item
                              key={`category${roleIndex}`}
                              as="button"
                              onClick={(e) => {
                                setTwofaverifydata({
                                  ...twofaverifydata,
                                  role_id: roleList[roleData],
                                });
                                setUserRole(roleData);
                              }}
                            >
                              {roleData}
                            </Dropdown.Item>
                          ))}
                      </Dropdown.Menu>
                    </Dropdown>
                    {validation?.existing_role && (
                      <p className="error_text">Please select a role</p>
                    )}
                  </div>
                </div>
              </div>
              {isSend ? (
                <>
                  <h5 className="mb-0">Enter OTP</h5>
                  <h6 className="twofa-modal-enter-otp">
                    {" "}
                    please enter the OTP sent to your registered email address
                  </h6>

                  <div className="d-flex align-items-start justify-content-start ">
                    <InputOTP
                      value={twofaverifydata.otp}
                      onChange={(o) =>
                        setTwofaverifydata({ ...twofaverifydata, otp: o })
                      }
                      hideLabel
                      disabled={inputDisabled}
                    />
                  </div>
                  {validation?.otp && (
                    <p className="error_text">Please enter the OTP</p>
                  )}
                  {validation?.valid_otp && (
                    <p className="error_text">Please enter the valid OTP</p>
                  )}
                  {runTimer ? (
                    <div className="p-2 d-flex justify-content-between">
                      {minutes && seconds && (
                        <>
                          <div className="twofa-modal-greyedout">
                            Please wait{" "}
                            <b>
                              {minutes}:{seconds}....
                            </b>
                          </div>
                        </>
                      )}
                      <div></div>
                    </div>
                  ) : guildUserMenuPermissionList?.resend_otp ? (
                    <button
                      disabled={runTimer || otpSending}
                      onClick={() => resendOTP()}
                      className="twofa-modal-sent-otp"
                    >
                      {otpSending ? "Sending" : "Resend OTP"}
                    </button>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                ""
              )}
              {/* <p><p/> */}
              {/* <div className="d-flex"> */}

              {/* </div> */}
            </div>

            {isSend ? (
              guildUserMenuPermissionList?.assign_role ? (
                <div className="p-2 verification-section-save d-flex align-items-center justify-content-center mt-2 mb-2">
                  <button
                    disabled={inputDisabled || makeSubAdminButton}
                    onClick={() => handleMakeSubadmin()}
                    className="btn btn-dark rounded-pill px-4 w-50"
                  >
                    {makeSubAdminButton ? "Verifing Please wait..." : "Assign"}
                  </button>
                </div>
              ) : (
                ""
              )
            ) : guildUserMenuPermissionList?.send_otp ? (
              <>
                <div className="p-2 verification-section-save d-flex align-items-center justify-content-center flex-column mt-2 mb-2">
                  <button
                    className="btn btn-dark rounded-pill px-4 w-50"
                    disabled={
                      runTimer || otpSending || twofaverifydata?.role_id === ""
                    }
                    onClick={() => handleemailotp()}
                  >
                    {otpSending ? "Sending" : "Send OTP"}
                  </button>
                  <h5 className="otp-info pt-2">
                    OTP should be sent to your registered email address.
                  </h5>
                </div>
              </>
            ) : (
              ""
            )}
          </>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TwofaPopup;
