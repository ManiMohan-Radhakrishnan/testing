import React, { useEffect, useState } from "react";
import Select from "react-select";
import { FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import { withdrawOTPApi, withdrawOTPVerifyApi } from "../../api/methods";
import {
  whitelistCryptoPopUp,
  whitelistPopUp,
} from "../../redux/actions/user_action";
import {
  currencyFormat,
  validateCurrency,
  roundDown,
  dot,
  alphaNumeric,
} from "./../../utils/common";

import InputOTP from "../input-otp";
import ToolTip from "../tooltip";

import "./style.scss";

const PlayWallet = ({
  upiListUser,
  cryptoList,
  setWithdrawFund,
  networkList,
  balanceInfo,
  handleWithdrawProcess,
  data = {},
}) => {
  const jumpPoint = data?.wallet?.jump_point?.amount;
  const jumpPointsInamount = data?.wallet?.jump_point?.amount_in_usd;
  const amountInUsd = data?.wallet?.usd?.amount;
  const feeCharges = balanceInfo?.crypto_fees;

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state?.user?.data);

  const history = useHistory();
  const [payMethod, setPayMethod] = useState("upi");
  const [address, setAddress] = useState("");
  const [network, setNetwork] = useState(networkList[0]?.name || "binance");
  const [networkOptions, setNetworkOptions] = useState([]);
  const [selectPaymentNetwork, setSelectPaymentNetwork] = useState();
  const [paymentSlug, setPaymentSlug] = useState("");
  const [selectFields, setSelectFields] = useState([]);
  const [success, setSuccess] = useState(false);
  const [receive, setReceive] = useState(0);
  const [passwordStatus, setPasswordStatus] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [walletValidation, setWalletValidation] = useState("");

  const [confirm, setConfirm] = useState({
    status: false,
    otp: "",
    password: "",
    m_otp: "",
  });

  const [fees, setFees] = useState({
    currency: "$",
    category: "",
    fee_type: "percent",
    fee_value: "0.0",
    min_amount: "0",
    max_amount: "0",
  });

  const upiId = upiListUser[0]?.payment_id || "";

  const upiMaxAmount = balanceInfo?.fees?.find(
    (obj) => obj.category === "trade_upi"
  ).max_amount;

  useEffect(() => {
    checkNetworkData();
  }, [networkList]);

  useEffect(() => {
    if (user?.whitelist_withdrawal) {
      if (cryptoList?.[network]?.length > 0) {
        let pushItems = [];
        setSelectPaymentNetwork(cryptoList?.[network]);
        setAddress(cryptoList?.[network][0]?.payment_id);
        setPaymentSlug(cryptoList?.[network][0]?.slug);
        cryptoList?.[network].map((item) => {
          let modifyData = {
            ...item,
            label:
              item?.detail?.name +
              " - " +
              item?.payment_id?.toString()?.substring(0, 5) +
              "....." +
              item?.payment_id
                ?.toString()
                .substring(
                  item?.payment_id?.length - 5,
                  item?.payment_id?.length
                ),
            value: item?.payment_id,
            slug: item?.slug,
          };
          pushItems.push(modifyData);
        });
        setSelectFields(pushItems);
      } else {
        setSelectPaymentNetwork([]);
      }
    }
  }, [network]);

  useEffect(() => {
    if (payMethod) {
      if (payMethod === "crypto") {
        const find_fee = balanceInfo.fees.find(
          (obj) => obj.category === "trade_crypto"
        );

        // setFees({
        //   ...find_fee,
        //   min_amount: feeCharges[0].min,
        //   fee_type: "flat",
        // });
      } else if (payMethod === "upi") {
        const find_fee = balanceInfo?.fees?.find(
          (obj) => obj.category === "trade_upi"
        );

        setFees(find_fee);
      }
    }
  }, [payMethod]);

  const handleSubmit = () => {
    const paymentTest =
      payMethod === "upi"
        ? parseFloat(amount) >= data?.min_withdrawal &&
          parseFloat(amount) <= parseFloat(fees?.max_amount)
        : parseFloat(amount) >= parseFloat(fees?.min_amount) &&
          parseFloat(amount) <= parseFloat(fees?.max_amount);
    const paymentError =
      payMethod === "upi" ? data?.min_withdrawal : fees?.min_amount;
    if (payMethod) {
      if (payMethod === "crypto") {
        if (!address) {
          setError("Please provide your crypto wallet address");
          return false;
        }
      }
      if (amount) {
        if (payMethod === "upi") {
          if (!upiId || !upiListUser[0]?.upi_verified) {
            setError("Please whitelist your UPI ID");
            return false;
          }
        }
      }

      if (amount && paymentTest) {
        if (parseFloat(data?.total_amount) >= parseFloat(amount)) {
          if (receive > 0) {
            setError("");
            if (payMethod === "crypto" && address?.substring(0, 2) === "0x") {
              withdrawProcess();
              setWalletValidation("");
            } else {
              payMethod === "crypto" &&
                setWalletValidation("Wallet address is invalid");
            }
            if (payMethod === "upi") {
              withdrawProcess();
            }
          } else {
            setError("Final amount must be greater than $0.00");
          }
        } else {
          setError("Withdrawal amount greater than wallet balance");
        }
      } else {
        setError(
          payMethod === "upi"
            ? `Please enter the amount minimum of ${currencyFormat(
                paymentError,
                user?.currency_name
              )} and maximum of ${currencyFormat(
                fees?.max_amount,
                user?.currency_name
              )} to withdraw from your wallet`
            : `Please enter the amount minimum of ${currencyFormat(
                paymentError,
                user?.currency_name
              )}`
        );
      }
    } else {
      setError("Please choose your withdrawal method");
    }
  };

  const withdrawProcess = async () => {
    try {
      setLoading(true);
      await withdrawOTPApi({ amount: amount });
      toast.success("OTP sent successfully to your email address");
      setLoading(false);
      setConfirm({ ...confirm, status: true });
    } catch (err) {
      setLoading(false);
      toast.error("An unexpected error occured. Please try again  later");
    }
  };

  const handleVerify = async () => {
    if (confirm?.otp?.length === 6) {
      if (confirm?.password) {
        setLoading(true);
        let trade_withdraw_details = {};

        if (payMethod === "crypto") {
          trade_withdraw_details = {
            type: payMethod,
            crypto: { network: network, address: address },
          };
        } else if (payMethod === "upi") {
          trade_withdraw_details = {
            type: payMethod,
            upi: { upi_id: upiId },
          };
        }

        try {
          await withdrawOTPVerifyApi({
            password: confirm?.password,
            email_otp: confirm?.otp,
            sms_otp: confirm?.m_otp,
          });

          handleWithdrawProcess({
            payment_slug:
              payMethod === "upi"
                ? upiListUser[0]?.slug
                : payMethod === "crypto" && user?.whitelist_withdrawal
                ? paymentSlug
                : "",
            payment_method: "trade",
            amount: amount,
            address: address,
            network:
              payMethod === "crypto" && !user?.whitelist_withdrawal
                ? network
                : "",
            trade_withdraw_details,
            wallet_type: "play",
            _setError: setError,
            _setLoading: setLoading,
            _setSuccess: setSuccess,
          });
        } catch (err) {
          setLoading(false);

          const result = err?.data?.data;
          let errText = "",
            are = false;
          if (!result?.email_otp_verified) {
            errText += "Email OTP";
          }
          if (!result?.password_verified) {
            if (errText) are = true;
            errText += `${errText && ", "}Password`;
          }
          if (!result?.sms_otp_verified) {
            if (errText) are = true;
            errText += `${errText && ", "}SMS OTP`;
          }

          setError(`${errText} ${are ? "are" : "is"} invalid`);
        }
      } else {
        setError("Enter Your Password");
      }
    } else {
      setError("Enter OTP received on your email");
    }
  };

  const calcCharges = (input, _network) => {
    const net_input = _network ? _network : network;

    const find_charge = feeCharges?.find((obj) => obj.network === net_input);

    if (input) {
      if (payMethod === "crypto") {
        const data = parseFloat(input) - find_charge.fee;

        if (data > 0) {
          setReceive(roundDown(data, 2));
        } else {
          setReceive(0);
        }
      } else {
        if (fees?.fee_type === "percent") {
          const data =
            parseFloat(input) -
            (parseFloat(input) * parseFloat(fees.fee_value)) / 100;

          if (data > 0) {
            setReceive(roundDown(data, 2));
          } else {
            setReceive(0);
          }
        } else {
          const data = parseFloat(input) - fees?.fee_value;

          if (data > 0) {
            setReceive(roundDown(data, 2));
          } else {
            setReceive(0);
          }
        }
      }
    } else {
      setReceive(0);
    }

    setFees({
      ...fees,
      min_amount: find_charge?.play_min,
      max_amount: payMethod === "crypto" ? find_charge?.max : upiMaxAmount,
    });
  };

  const checkNetworkData = () => {
    let networks = new Array();

    for (let item of networkList) {
      networks.push({
        label: `${item?.display_name} -${currencyFormat(
          feeCharges?.find((obj) => obj?.network === item?.name)?.fee,
          user.currency_name
        )} Fee / Transaction`,
        value: item?.name,
      });
    }
    setNetwork(networks?.length > 0 ? networks[0]?.value : []);
    setNetworkOptions(networks);
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
      {success ? (
        <>
          <div className="inner-card-details">
            <div className="success-card mt-4 ">
              <FaCheckCircle size={50} color={"green"} />
              <div>
                Your withdrawal request has been initiated, and it should
                reflect in your payment method in 2 to 3 working days.
              </div>
            </div>
            <button
              type="button"
              className="btn btn-dark w-100 rounded-pill btn-af-pay mt-3 mb-4"
              onClick={() => setWithdrawFund({ show: false })}
            >
              Okay
            </button>
          </div>
        </>
      ) : (
        <>
          {confirm?.status ? (
            <>
              <div className="inner-card-details">
                <div
                  className="pay-list-back"
                  role="button"
                  onClick={() => {
                    setConfirm(false);
                    setError("");
                  }}
                >
                  <FiArrowLeft size={25} /> Back
                </div>

                <div className="mt-3">
                  <div className="d-flex justify-content-between ac-cc-title mb-2">
                    Summary
                  </div>
                  <div className="withdraw-summary">
                    <div className="row">
                      <div className="col text-end">Withdrawal Amount:</div>
                      <div className="col-3">
                        {currencyFormat(amount, user.currency_name)}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col text-end">Service Fee:</div>
                      <div className="col-3">
                        {payMethod && payMethod === "crypto" ? (
                          <>
                            {currencyFormat(
                              feeCharges?.find((obj) => obj.network === network)
                                .fee,
                              user.currency_name
                            )}
                            {fees.fee_type === "percent" && "%"}
                          </>
                        ) : (
                          <>
                            {fees.fee_type === "percent"
                              ? fees.fee_value
                              : currencyFormat(
                                  fees.fee_value,
                                  user.currency_name
                                )}
                            {fees.fee_type === "percent" && "%"}
                          </>
                        )}
                      </div>
                    </div>
                    <hr />
                    <div className="row final">
                      <div className="col text-end">
                        Amount you will receive:
                      </div>
                      <div className="col-3">
                        {" "}
                        {currencyFormat(receive, user.currency_name)}
                      </div>
                    </div>
                  </div>
                </div>

                <hr />

                <div className="mt-3">
                  <div className="d-flex justify-content-between ac-cc-title mb-2">
                    Email OTP
                  </div>
                  <InputOTP
                    value={confirm.otp}
                    onChange={(o) => setConfirm({ ...confirm, otp: o })}
                    hideLabel
                  />
                </div>

                <div className="mt-3 mb-3 float-icons">
                  <div className="d-flex justify-content-between ac-cc-title mb-2">
                    Password
                  </div>
                  <input
                    type={passwordStatus ? "password" : "text"}
                    value={confirm.password}
                    className="wallet-password"
                    maxLength={42}
                    onChange={(e) => {
                      setConfirm({
                        ...confirm,
                        password: e.target.value,
                      });
                    }}
                  />
                  {!passwordStatus ? (
                    <FaEyeSlash
                      onClick={() => setPasswordStatus(!passwordStatus)}
                      role="button"
                      className="eye"
                    />
                  ) : (
                    <FaEye
                      onClick={() => setPasswordStatus(!passwordStatus)}
                      role="button"
                      className="eye"
                    />
                  )}
                </div>
                {error && (
                  <div className="mb-3">
                    <h6 className="text-danger mb-0">{error}</h6>
                  </div>
                )}

                <button
                  disabled={loading}
                  type="button"
                  className="btn btn-dark w-100 rounded-pill btn-af-pay mb-"
                  onClick={handleVerify}
                >
                  {loading ? "Processing please wait..." : "Withdraw"}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="myplay-wallet-card">
                <div className="inner-card-details">
                  <div className="row">
                    <div className="col-sm-8 offset-sm-2">
                      <div className="wallet--box">
                        <p>Available JT Points</p>
                        <p className="wallet-num d-flex align-items-center justify-content-center">
                          <img
                            className="me-2"
                            src="/static/media/coin.2340c872.png"
                          ></img>{" "}
                          {jumpPoint ? parseInt(jumpPoint) : 0}
                        </p>
                        <div className="jt-size">
                          {jumpPointsInamount > 0 ? (
                            <>${roundDown(jumpPointsInamount, 2)}</>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* <div className="col-md-6">
                      <div className="wallet--box">
                        <p>Available USD Funds</p>
                        <p className="wallet-num">
                          {" "}
                          {currencyFormat(amountInUsd, user?.currency_name)}
                        </p>
                      </div>
                    </div> */}
                  </div>
                  <div className="row">
                    <div className="col-sm-8 offset-sm-2 col-12">
                      <div className="mt-3 mb-3">
                        <div className="text-secondary mt-5 ac-step">
                          Step 1
                        </div>
                        <div className="d-flex justify-content-between ac-cc-title">
                          Choose Your Withdrawal Method
                        </div>
                        <div className="d-flex mt-2 mb-4">
                          <div
                            className={`w-mode ${
                              payMethod === "crypto" ? "active" : ""
                            }`}
                            role={"button"}
                            onClick={() => {
                              setPayMethod("crypto");
                              setError("");
                              setAmount("");
                              calcCharges("");
                            }}
                          >
                            <div className="title">Crypto</div>
                            <div>
                              <FaCheckCircle
                                color={payMethod === "crypto" ? "#fff" : "#ccc"}
                                className="mb-1 me-2"
                                size={17}
                              />
                            </div>
                          </div>

                          <div
                            className={`w-mode ${
                              payMethod === "upi" ? "active" : ""
                            }`}
                            role={"button"}
                            onClick={() => {
                              setPayMethod("upi");
                              setAmount("");
                              setError("");
                              calcCharges("");
                            }}
                          >
                            <div className="title">UPI</div>
                            <div>
                              <FaCheckCircle
                                color={payMethod === "upi" ? "#fff" : "#ccc"}
                                className="mb-1 me-2"
                                size={17}
                              />
                            </div>
                          </div>
                        </div>
                        {payMethod === "crypto" && (
                          <>
                            <div>
                              <div className="d-flex justify-content-between ac-cc-title">
                                Network
                              </div>
                              <Select
                                options={networkOptions}
                                value={networkOptions.find(
                                  (o) => o?.value === network
                                )}
                                styles={crispStyle}
                                onChange={(data) => {
                                  setAddress("");
                                  setNetwork(data.value);
                                  calcCharges(amount, data.value);
                                }}
                              />
                            </div>

                            <div className="mt-3 mb-3">
                              <div className="d-flex justify-content-between ac-cc-title">
                                Withdrawal Address
                              </div>
                              {(() => {
                                if (user?.whitelist_withdrawal) {
                                  if (selectPaymentNetwork?.length > 0)
                                    return (
                                      <Select
                                        options={selectFields}
                                        value={selectFields.find(
                                          (o) => o.value === address
                                        )}
                                        styles={crispStyle}
                                        onChange={(data) => {
                                          setAddress(data?.value);
                                          setPaymentSlug(data?.slug);
                                        }}
                                      />
                                    );
                                  else {
                                    return (
                                      <>
                                        {/* <div
                                          onClick={() => {
                                            dispatch(
                                              whitelistCryptoPopUp(network)
                                            );
                                            history.push("/accounts/whitelist");
                                          }}
                                          role="button"
                                          className="d-flex"
                                        >
                                          <h5>
                                            Please Whitelist your Crypto ID
                                          </h5>
                                          <FiArrowRight size={25} />
                                        </div> */}
                                        <div className={"pre-btn"}>
                                          <p
                                            className="bank-details-input wait-msg d-flex align-items-center justify-content-between"
                                            onClick={() => {
                                              dispatch(
                                                whitelistCryptoPopUp(network)
                                              );
                                              history.push(
                                                "/accounts/whitelist"
                                              );
                                            }}
                                          >
                                            Please Whitelist your Wallet Address{" "}
                                            <FiArrowRight size={25} />
                                          </p>
                                        </div>
                                      </>
                                    );
                                  }
                                } else {
                                  return (
                                    <input
                                      type="text"
                                      value={address}
                                      className="wallet-address"
                                      placeholder="0xc896..."
                                      maxLength={42}
                                      onChange={(e) => {
                                        alphaNumeric(e.target.value) &&
                                          setAddress(e.target.value);
                                      }}
                                    />
                                  );
                                }
                              })()}
                            </div>
                            {walletValidation && (
                              <div className="mb-3">
                                <h6 className="text-danger mb-0">
                                  {walletValidation}
                                </h6>
                              </div>
                            )}
                          </>
                        )}

                        {payMethod === "upi" && (
                          <>
                            <div className="mt-3 mb-3">
                              <div className="d-flex justify-content-between ac-cc-title">
                                UPI ID
                              </div>
                              {upiListUser.length === 0 ||
                              !upiListUser[0]?.upi_verified ? (
                                <div className={"pre-btn"}>
                                  <p
                                    className="bank-details-input wait-msg d-flex align-items-center justify-content-between"
                                    onClick={() => {
                                      dispatch(whitelistPopUp(true));
                                      history.push("/accounts/whitelist");
                                    }}
                                  >
                                    Please whitelist your UPI ID{" "}
                                    <FiArrowRight size={25} />
                                  </p>
                                </div>
                              ) : (
                                <input
                                  type="text"
                                  value={upiListUser[0]?.payment_id}
                                  className="bank-details-input upi-disable"
                                />
                              )}
                            </div>
                          </>
                        )}
                        <div className="text-secondary mt-5 ac-step">
                          Step 2
                        </div>
                        <div className="d-flex justify-content-between ac-cc-title">
                          Withdrawal Amount
                        </div>
                        <div className="sf-amt-container">
                          <div className="af-symbol">$</div>
                          {!payMethod ? (
                            <ToolTip
                              icon={
                                <input
                                  type="text"
                                  value={amount}
                                  className="af-amount"
                                  onChange={(e) => {
                                    setError("");
                                    if (
                                      e.target.value &&
                                      e.target.value.length < 7
                                    ) {
                                      if (validateCurrency(e.target.value)) {
                                        setAmount(e.target.value);
                                        calcCharges(e.target.value);
                                      } else {
                                        if (
                                          e.target.value.indexOf(".") !== -1
                                        ) {
                                          const str = e.target.value;
                                          setAmount(
                                            str.substring(0, str.length - 1)
                                          );
                                          calcCharges(
                                            str.substring(0, str.length - 1)
                                          );
                                        } else {
                                          setAmount("");
                                          calcCharges("");
                                        }
                                      }
                                    } else {
                                      setAmount("");
                                      calcCharges("");
                                    }
                                  }}
                                />
                              }
                              placement={"top"}
                              content={"Please Choose Your Withdrawal Method"}
                            />
                          ) : (
                            <input
                              type="text"
                              value={amount}
                              className="af-amount"
                              onChange={(e) => {
                                setError("");
                                if (
                                  e.target.value &&
                                  e.target.value.length < 7
                                ) {
                                  if (validateCurrency(e.target.value)) {
                                    setAmount(e.target.value);
                                    calcCharges(e.target.value);
                                  } else {
                                    if (e.target.value.indexOf(".") !== -1) {
                                      const str = e.target.value;
                                      setAmount(
                                        str.substring(0, str.length - 1)
                                      );
                                      calcCharges(
                                        str.substring(0, str.length - 1)
                                      );
                                    } else {
                                      setAmount("");
                                      calcCharges("");
                                    }
                                  }
                                } else {
                                  setAmount("");
                                  calcCharges("");
                                }
                              }}
                            />
                          )}
                        </div>
                      </div>

                      {error && (
                        <div className="mb-3">
                          <h6 className="text-danger mb-0">{error}</h6>
                        </div>
                      )}
                      <div className="mb-4 text-center">
                        <button
                          disabled={loading}
                          type="button"
                          className="btn btn-dark w-100 rounded-pill btn-af-pay"
                          onClick={handleSubmit}
                        >
                          {loading ? "Processing please wait..." : "Submit"}
                        </button>

                        {payMethod && payMethod === "crypto" ? (
                          <>
                            <div>
                              <label className="loaded-info">
                                {currencyFormat(
                                  feeCharges?.find(
                                    (obj) => obj?.network === network
                                  )?.fee,
                                  user.currency_name
                                )}
                                {fees.fee_type === "percent" && "%"}
                                Transaction Fee Applies | Final Amount{" "}
                                {currencyFormat(receive, user.currency_name)}
                              </label>
                            </div>
                            <label className="loaded-info">
                              Minimum Withdrawal{" "}
                              {currencyFormat(
                                fees?.min_amount,
                                user.currency_name
                              )}
                              <br />
                              Maximum Withdrawal: No Limit{" "}
                            </label>
                          </>
                        ) : (
                          <>
                            <div>
                              <label className="loaded-info">
                                {fees?.fee_type === "percent"
                                  ? fees?.fee_value
                                  : currencyFormat(
                                      fees?.fee_value,
                                      user.currency_name
                                    )}
                                {fees?.fee_type === "percent" && "%"}
                                Transaction Fee Applies | Final Amount{" "}
                                {currencyFormat(receive, user.currency_name)}
                              </label>
                            </div>
                            <label className="loaded-info">
                              Minimum Withdrawal{" "}
                              {currencyFormat(
                                data?.min_withdrawal,
                                user.currency_name
                              )}
                              <br />
                              Maximum Withdrawal{" "}
                              {currencyFormat(
                                fees?.max_amount,
                                user.currency_name
                              )}
                            </label>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default PlayWallet;
