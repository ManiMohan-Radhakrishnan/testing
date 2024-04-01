/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { MdDelete, MdFileCopy } from "react-icons/md";
import CopyToClipboard from "react-copy-to-clipboard";
import Select from "react-select";
import { toast } from "react-toastify";

import {
  deleteWhitelist,
  whitelistedCryptoList,
  whitelistPaymentID,
  whitelistSendOtp,
  whitelistToggle,
  whitelistVerifyOtp,
} from "../../api/methods";

import { whitelistCryptoPopUp } from "../../redux/actions/user_action";
import { user_load_by_token_thunk } from "../../redux/thunk/user_thunk";
import { alphaNumeric, dot } from "../../utils/common";
import { getCookies } from "../../utils/cookies";

import InputOTP from "../input-otp";
import InputText from "../input-text";

import ethereum from "../../images/eth.svg";
import binance from "../../images/binance.svg";
import matic from "../../images/matic.svg";

const images = { binance, ethereum, matic };

const CryptoWhitelist = () => {
  const width = window.innerWidth < 769;
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state);
  const [cryptoList, setCryptoList] = useState([]);
  const [loading, setLoading] = useState({});
  const [switchHandle, setSwitchHandle] = useState(
    user?.data?.user?.whitelist_withdrawal
  );
  const [openAddModal, setOpenAddModal] = useState(
    user.whitelist_crypto_popup || false
  );
  const [showNetworks, setShowNetworks] = useState([]);
  const [clickNetwork, setClickNetworks] = useState("");
  const [limit, setLimit] = useState(2);
  let walletAddress = new Array();
  const [whitelistWalletAdd, setWhitelistWalletAdd] = useState([]);
  const [deleteNetwork, setDeleteNetwork] = useState({});
  const [verifyDetails, setVerifyDetails] = useState({
    passwordVisible: false,
    error: {},
  });
  const [networkTypes, setNetworkTypes] = useState([]);
  const [resendSec, setResendSec] = useState();
  const [modalStep, setModalStep] = useState("step1");
  const [details, setDetails] = useState({
    network:
      user.whitelist_crypto_popup ||
      (networkTypes?.length > 0 ? networkTypes[0]?.value : " "),
    name: "",
    address: "",
    confirmAddress: "",
    otp: "",
    password: "",
    defaultAddress: false,
    error: "",
  });

  useEffect(() => {
    setDetails({
      ...details,
      network:
        user.whitelist_crypto_popup ||
        (networkTypes?.length > 0 ? networkTypes[0]?.value : " "),
    });
  }, [networkTypes]);

  useEffect(() => {
    checkCryptoList("check");
    // getBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeModal = () => {
    dispatch(whitelistCryptoPopUp());
    setResendSec(0);
    setOpenAddModal(!openAddModal);
    setDetails({
      name: "",
      network: networkTypes?.length > 0 ? networkTypes[0]?.value : " ",
      address: "",
      confirmAddress: "",
      otp: "",
      password: "",
      defaultAddress: false,
      error: "",
    });
    setVerifyDetails({
      passwordVisible: false,
      error: {},
    });
  };

  const checkCryptoList = async (type = "check") => {
    try {
      const result = await whitelistedCryptoList();
      setCryptoList(result?.data?.data?.payment_methods);
      setLimit(result?.data?.data?.limit || 2);
      checkNetworkStatus(result?.data?.data?.payment_methods, type);
      if (type === "check") checkNetworkData(result?.data?.data?.networks);
    } catch (error) {
      console.log(error);
    }
  };

  const checkNetworkStatus = (data, type) => {
    let showNetworksArray = new Array();
    let walletAddress = new Array();
    for (let [key, value] of Object.entries(data)) {
      if (value.length > 0) {
        for (let item = 0; item < value.length; item++)
          walletAddress.push(value[item]?.payment_id);
        showNetworksArray.push(key);
      }
    }
    setWhitelistWalletAdd(walletAddress);
    setShowNetworks(showNetworksArray);
    if (
      showNetworksArray.length > 0 &&
      showNetworksArray.length !== showNetworks?.length
    )
      setClickNetworks(showNetworksArray[0] || "");
  };

  const checkNetworkData = (data) => {
    let networks = new Array();
    for (let item of data) {
      networks.push({
        label: item?.display_name,
        value: item?.name,
      });
    }
    setNetworkTypes(networks);
  };

  useEffect(() => {
    const timer =
      resendSec > 0 && setInterval(() => setResendSec(resendSec - 1), 1000);
    return () => clearInterval(timer);
  }, [resendSec]);

  const sendOtp = async () => {
    let sameAddress = cryptoList?.[details?.network].find(
      (obj) => obj?.payment_id === details.address && true
    );
    if (
      details.address !== details.confirmAddress ||
      details?.address.substring(0, 2) !== "0x" ||
      sameAddress
    ) {
      let errorText = "Wallet Addresses do not match.";
      if (details?.address.substring(0, 2) !== "0x")
        errorText = "Wallet address is invalid";
      else if (sameAddress)
        errorText = "This Wallet Address already whitelisted";
      setDetails({ ...details, error: errorText });
      return false;
    } else {
      setDetails({ ...details, error: "" });
    }
    try {
      setLoading({ ...loading, sendOtp: true });
      const result = await whitelistSendOtp({
        source: "web",
        payment_type: "crypto",
        payment_id: details.address,
        crypto_network: details.network,
        crypto_type: "usdt",
        default: details?.defaultAddress,
      });
      setModalStep("step2");
      toast.success("OTP sent successfully");
      setResendSec(60);
      setLoading({ ...loading, sendOtp: false });
    } catch (error) {
      setLoading({ ...loading, sendOtp: false });
      if (error?.data?.error_code === 1002) {
        toast.success(error?.data?.message);
        setModalStep("step2");
        setResendSec(60);
      } else {
        console.log(error);
      }
    }
  };
  const verify = async () => {
    try {
      setLoading({ ...loading, verify: true });
      const result = await whitelistVerifyOtp({
        password: details.password,
        otp: details.otp,
        source: "web",
      });
      createWhiteList();
      setVerifyDetails({
        ...verifyDetails,
        error: {},
      });
    } catch (error) {
      setVerifyDetails({
        ...verifyDetails,
        error: error?.data?.data,
      });
      setLoading({ ...loading, verify: false });
      console.log(error.data.data);
    }
  };
  const createWhiteList = async () => {
    try {
      const result = await whitelistPaymentID({
        payment_type: "crypto",
        payment_id: details.address,
        crypto_network: details.network,
        crypto_type: "usdt",
        default: details?.defaultAddress,
        detail: {
          name: details?.name,
        },
      });
      if (result?.data?.success) {
        setDetails({
          ...details,
          network: result?.data?.data?.crypto_network,
          address: result?.data?.data?.payment_id,
        });
        setModalStep("step3");
        setLoading({ ...loading, verify: false });
        checkCryptoList("create");
      }
    } catch (error) {
      setLoading({ ...loading, verify: false });
      toast.error(error?.data?.message);
      console.log(error);
    }
  };

  const deleteWhiteListAddress = async (slug) => {
    closeModal();
    try {
      const result = await deleteWhitelist(slug);
      if (result?.data?.success) {
        toast.success("Payment Id Deleted Successfully");
        checkCryptoList("delete");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSwitch = async (value) => {
    try {
      const result = await whitelistToggle(user?.data.user?.slug);
      if (result?.data?.data?.whitelist_withdrawal)
        toast.success("Crypto Address Whitelist Enabled");
      else toast.error("Crypto Address Whitelist Disabled.");
      let token = getCookies();
      if (token) {
        dispatch(user_load_by_token_thunk(token));
      }
      setSwitchHandle(result?.data?.data?.whitelist_withdrawal);
    } catch (error) {}
  };

  const crispStyle = {
    control: (prop) => ({
      ...prop,
      padding: ".8rem 0.8rem",
      borderRadius: "0.7rem",
      minHeight: "33px",
      fontSize: "1rem",
      fontWeight: "bolder",
      borderColor: "#000",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#000",
      },
      "&:focus": {
        boxShadow: "none",
        borderColor: "#000",
      },
      "&:active": {
        boxShadow: "none",
        borderColor: "#000",
      },
    }),
    input: (prop) => ({
      ...prop,
      margin: 0,
      padding: 0,
    }),
    valueContainer: (prop) => ({
      ...prop,
      margin: 0,
      padding: 0,
    }),
    singleValue: (styles, { data }) => ({
      ...styles,
      margin: 0,
      padding: 0,
      ...(data.color ? dot(data.color) : {}),
    }),

    dropdownIndicator: (prop) => ({
      ...prop,
      margin: 0,
      padding: "0 3px 0 0",
      color: "#000",
    }),
    indicatorsContainer: (prop) => ({
      ...prop,
      margin: 0,
      padding: 0,
    }),
    clearIndicator: (prop) => ({
      ...prop,
      margin: 0,
      padding: 0,
    }),
    indicatorSeparator: (prop) => ({
      ...prop,
      margin: "3px",
      padding: 0,
    }),
    noOptionsMessage: (prop) => ({
      ...prop,
      padding: 0,
      fontSize: "12px",
    }),
    option: (prop, { isSelected }) => ({
      ...prop,
      padding: "8px",
      fontSize: "1rem",
      backgroundColor: isSelected && "#000",
      fontFamily: "neue_helvetica_medium",
      "&:hover": {
        backgroundColor: !isSelected && "#ddd",
        color: !isSelected && "#000",
      },
      "&:active": {
        backgroundColor: "#ddd",
      },
    }),
    menu: (prop) => ({
      ...prop,
      borderRadius: "3px",
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999, top: base.top - 5 }),
  };

  return (
    <>
      <div className="whiteList-back auth-box">
        <h4 className="settings-card-title">
          Crypto
          <label className="switch">
            <input
              type="checkbox"
              checked={switchHandle}
              onChange={handleSwitch}
            />
            <span className="slider round"></span>
          </label>
        </h4>
        <p>
          {networkTypes?.length * limit !== whitelistWalletAdd?.length
            ? `Add up to ${limit} crypto wallet addresses per network to whitelist it for a seamless withdrawal. You can delete the existing ones to add a new address. `
            : `Crypto wallet addresses whitelisted. You can delete the existing ones to add a new address.`}
        </p>
        {/* whitelist option enable/disable */}
        <div className="whitelist-inside">
          <button
            className="btn btn-dark mx-auto width-correction"
            type="button"
            onClick={() => {
              setModalStep("step1");
              setOpenAddModal(!openAddModal);
            }}
            disabled={
              networkTypes?.length * limit === whitelistWalletAdd?.length
            }
          >
            Add Wallet Address
          </button>
          {showNetworks?.length > 0 && (
            <div className="show-networks-list">
              <div className="show-networks">
                {showNetworks?.map((item, i) => (
                  <>
                    {/* <div
                  className="upi-list"
                  onClick={() => setClickNetworks(item)}
                >
                  {item}
                </div> */}

                    <div
                      role={"button"}
                      className={`crypto-whitelist-pill d-flex ${
                        clickNetwork === item ? "active" : ""
                      }`}
                      key={`filter-pill${i}`}
                      onClick={() => setClickNetworks(item)}
                    >
                      {/* {clickNetwork === item && (
                        <FaCheckCircle
                          color={"white"}
                          size={17}
                          className="me-2"
                        />
                      )} */}
                      {images[item] && (
                        <img
                          className={`${clickNetwork === item ? "active" : ""}`}
                          src={images[item]}
                        />
                      )}

                      <span>
                        {networkTypes?.find((o) => o?.value === item)?.label}
                      </span>
                      {/* {obj.name}{" "}
                  {buyOrders.total_count > 0 && obj.checked && (
                    <>({buyOrders.total_count})</>
                  )} */}
                    </div>
                  </>
                ))}
              </div>
              {cryptoList?.[clickNetwork]?.length > 0 && (
                <>
                  <div className="networks-id-block">
                    {cryptoList?.[clickNetwork]?.map((item, i) => (
                      <>
                        <div key={i} className="networks-id">
                          <div className="address-block">
                            <h6 className="">{item?.detail?.name}</h6>{" "}
                            {item?.default && (
                              <span className="btn btn-sm btn-light rounded-pill kycboxbg success">
                                Default
                              </span>
                            )}
                            {!width ? (
                              <h5>{item.payment_id} </h5>
                            ) : (
                              <>
                                <span className="d-flex">
                                  <h5>
                                    {item.payment_id
                                      .toString()
                                      .substring(0, 6) +
                                      "....." +
                                      item.payment_id
                                        .toString()
                                        .substring(
                                          item.payment_id.length - 6,
                                          item.payment_id.length
                                        )}
                                  </h5>
                                  <CopyToClipboard
                                    role="button"
                                    text={item.payment_id}
                                    onCopy={() => {
                                      toast.success("Copied to Clipboard");
                                    }}
                                  >
                                    <MdFileCopy className="copy-btn" />
                                  </CopyToClipboard>
                                </span>
                              </>
                            )}
                          </div>

                          <MdDelete
                            onClick={() => {
                              setOpenAddModal(true);
                              setModalStep("delete");
                              setDeleteNetwork(item);
                              // deleteWhiteList(item?.slug);
                            }}
                            className="deletebtn"
                          />
                        </div>
                      </>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <Modal
        show={openAddModal}
        //
        className="Modal-alert-mfa upi-modal"
        size="md"
        backdrop="static"
      >
        <Modal.Header onHide={closeModal} closeButton>
          <Modal.Title>
            {modalStep === "step2"
              ? "Add Wallet Address - User Verification"
              : modalStep === "delete"
              ? "Confirmation"
              : "Add Wallet Address"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {(() => {
              if (modalStep === "step1") {
                return (
                  <>
                    <div className="mb-1">
                      <InputText
                        type="text"
                        title="Name"
                        value={details.name}
                        className="wallet-address"
                        placeholder="Ex:Own-Address"
                        lengthValue={12}
                        onChange={(e) => {
                          setDetails({ ...details, name: e.target.value });
                        }}
                      />
                    </div>

                    <div className="mb-1">
                      <label className="input-title">Network</label>
                      <Select
                        options={networkTypes}
                        value={networkTypes?.find(
                          (o) => o.value === details.network
                        )}
                        styles={crispStyle}
                        onChange={(data) => {
                          dispatch(whitelistCryptoPopUp());
                          setDetails({
                            ...details,
                            network: data?.value,
                            error: "",
                          });
                        }}
                      />
                    </div>
                    {cryptoList?.[details?.network]?.length === limit && (
                      <>
                        <div className="err-msg-list">
                          <p className="error-text">
                            Wallet Addresses Limit is Reached
                          </p>
                        </div>
                      </>
                    )}

                    <div className="mb-1">
                      <InputText
                        title="Withdrawal Address"
                        type="text"
                        value={details.address}
                        className="wallet-address"
                        placeholder="0xc896..."
                        lengthValue={42}
                        onChange={(e) => {
                          alphaNumeric(e.target.value) &&
                            setDetails({ ...details, address: e.target.value });
                        }}
                      />
                    </div>
                    <div className="mb-1">
                      <InputText
                        title="Confirm Withdrawal Address"
                        type="text"
                        value={details?.confirmAddress}
                        className="wallet-address"
                        placeholder="0xc896..."
                        lengthValue={42}
                        onChange={(e) => {
                          alphaNumeric(e.target.value) &&
                            setDetails({
                              ...details,
                              confirmAddress: e.target.value,
                            });
                        }}
                      />
                    </div>
                    <div className="mb-1">
                      <div className="err-msg-list">
                        {details?.error && (
                          <p className="error-text">{details?.error}</p>
                        )}
                      </div>
                    </div>
                    <div className="default-checkbox d-flex align-items-center text-center gap-2 mb-1 mt-2">
                      <input
                        type="checkbox"
                        id="default-check"
                        defaultChecked={details.defaultAddress}
                        onChange={() =>
                          setDetails({
                            ...details,
                            defaultAddress: !details?.defaultAddress,
                          })
                        }
                      />
                      <label for="default-check" className="mb-0">
                        Set as default
                      </label>
                    </div>
                    <div className="mb-2">
                      <span>
                        Note: Please add only the addresses that supports -
                        Ethereum ERC-20/Polygon ERC-20/Binance BSC BEP-20, and
                        no other chain/standard.
                      </span>
                    </div>
                    <div className="d-flex justify-content-center">
                      <button
                        className="btn btn-dark mx-auto mb-2 width-correction"
                        type="button"
                        onClick={sendOtp}
                        disabled={
                          details.name?.length === 0 ||
                          details.address?.length < 42 ||
                          details.confirmAddress?.length < 42 ||
                          cryptoList?.[details?.network]?.length === limit
                        }
                      >
                        Submit
                      </button>
                    </div>
                  </>
                );
              } else if (modalStep === "step2") {
                return (
                  <div className="upi-text">
                    {/* <div className="header-alert">
                      <h3>
                        Wallet Address to Added
                        <br />
                        {details?.address}
                      </h3>
                    </div> */}
                    <span className="mb-2">
                      Wallet address to whitelist
                      <br />
                      <strong className="mt-2">{details?.address}</strong>
                    </span>

                    <div className="valid-field mt-2">
                      <div className="password-box">
                        <InputText
                          title="Password"
                          type={
                            verifyDetails.passwordVisible ? "text" : "password"
                          }
                          placeholder="Enter Your Password"
                          onChange={(e) =>
                            setDetails({
                              ...details,
                              password: e.target.value,
                            })
                          }
                          value={details.password}
                        />
                        {/* {!password */}
                        {verifyDetails?.passwordVisible ? (
                          <FaEye
                            role="button"
                            onClick={() =>
                              setVerifyDetails({
                                ...verifyDetails,
                                passwordVisible:
                                  !verifyDetails?.passwordVisible,
                              })
                            }
                            className="eye"
                          />
                        ) : (
                          <FaEyeSlash
                            className="eye"
                            role="button"
                            onClick={() =>
                              setVerifyDetails({
                                ...verifyDetails,
                                passwordVisible:
                                  !verifyDetails?.passwordVisible,
                              })
                            }
                          />
                        )}
                      </div>
                      <div className="err-msg-list">
                        {Object.keys(verifyDetails?.error)?.length > 0 &&
                          !verifyDetails?.error?.password_verified && (
                            <p>Password is invalid</p>
                          )}
                      </div>
                      <div className="otp-box">
                        <h6>OTP</h6>
                        <InputOTP
                          value={details.otp}
                          hideLabel
                          title="Otp"
                          name="OTP"
                          onChange={(e) => setDetails({ ...details, otp: e })}
                        />
                      </div>
                      <div className="err-msg-list">
                        {verifyDetails?.error?.password_verified &&
                          !verifyDetails?.error?.email_otp_verified && (
                            <p className="error-text">OTP is invalid</p>
                          )}
                      </div>

                      <button
                        type="button"
                        className="btn btn-dark width-correction"
                        onClick={verify}
                        disabled={
                          details.otp.length < 6 || details.password === ""
                        }
                      >
                        {loading.verify ? "loading" : "Verify and Add"}
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
                    {/* {error && (
                      <p className="error_text_new text-center disable-errortext">
                        {error}
                      </p>
                    )} */}
                  </div>
                );
              } else if (modalStep === "step3") {
                return (
                  <div className="upi-text">
                    <div className="center-success">
                      <FaCheckCircle
                        color={"green"}
                        size={28}
                        className="me-2"
                      />
                      <h4>Wallet Address Whitelisted.</h4>
                      <h5>
                        <b>
                          {
                            networkTypes?.find(
                              (o) => o.value === details.network
                            ).label
                          }
                        </b>{" "}
                        {details.address}
                      </h5>
                    </div>

                    <button
                      type="button"
                      className="btn btn-dark width-correction"
                      onClick={() => {
                        closeModal();
                        // dispatch(whitelistPopUp(false));
                      }}
                    >
                      OK
                    </button>
                  </div>
                );
              } else if (modalStep === "delete") {
                return (
                  <div className="upi-text">
                    <div className="center-success">
                      {/* <FaCheckCircle
                        color={"green"}
                        size={28}
                        className="me-2"
                      /> */}
                      <h4>
                        Are you sure you want to delete the Wallet Address?
                      </h4>
                      <h5>
                        <b>
                          {
                            networkTypes?.find(
                              (o) => o?.value === deleteNetwork?.crypto_network
                            )?.label
                          }
                        </b>{" "}
                        {!width
                          ? deleteNetwork?.payment_id
                          : deleteNetwork?.payment_id
                              .toString()
                              .substring(0, 6) +
                            "....." +
                            deleteNetwork?.payment_id
                              .toString()
                              .substring(
                                deleteNetwork?.payment_id.length - 6,
                                deleteNetwork?.payment_id.length
                              )}
                      </h5>
                    </div>
                    <div className="btn-block">
                      <button
                        type="button"
                        className="btn btn-dark "
                        onClick={() =>
                          deleteWhiteListAddress(deleteNetwork?.slug)
                        }
                      >
                        YES
                      </button>
                      <button
                        type="button"
                        className="btn btn-dark-secondary "
                        onClick={() => {
                          closeModal();
                          // dispatch(whitelistPopUp(false));
                        }}
                      >
                        NO
                      </button>
                    </div>
                  </div>
                );
              }
            })()}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CryptoWhitelist;
