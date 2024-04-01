import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Select from "react-select";

import { withdrawOTPVerifyApi, withdrawOTPApi } from "../../api/methods";
import {
  currencyFormat,
  validateCurrency,
  // feeCharges,
  roundDown,
  dot,
  alphaNumeric,
} from "../../utils/common";
import {
  whitelistCryptoPopUp,
  whitelistPopUp,
} from "../../redux/actions/user_action";

import InputOTP from "../input-otp";
import ToolTip from "../tooltip/index";

import "./style.scss";

const InAppWithdraw = ({
  balanceInfo,
  withdrawFund,
  setWithdrawFund,
  handleWithdrawProcess,
  upiList,
  cryptoList,
  showNetworks,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const feeCharges = balanceInfo?.crypto_fees;
  const { user } = useSelector((state) => state.user.data);
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [click, setClick] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    bank_name: "",
    account_holder_name: "",
    account_number: "",
    code_type: "",
    code_value: "",
    swift: "",
  });
  const [upiId, setUpiId] = useState(upiList[0]?.payment_id || "");

  const [confirm, setConfirm] = useState({
    status: false,
    otp: "",
    password: "",
    m_otp: "",
  });
  const [amount, setAmount] = useState("");
  const [receive, setReceive] = useState(0);
  const [payMethod, setPayMethod] = useState("upi");
  const [network, setNetwork] = useState(showNetworks[0]?.name || "binance");

  const [fees, setFees] = useState({
    currency: "$",
    category: "",
    fee_type: "percent",
    fee_value: "0.0",
    min_amount: "0",
    max_amount: "0",
  });
  const [passwordStatus, setPasswordStatus] = useState(true);
  const [paymentSlug, setPaymentSlug] = useState("");
  const [selectPaymentNetwork, setSelectPaymentNetwork] = useState();
  const [selectFields, setSelectFields] = useState([]);

  useEffect(() => {
    if (payMethod) {
      if (payMethod === "bank") {
        const find_fee = balanceInfo.fees.find(
          (obj) => obj.category === "inapp_purchase_bank"
        );

        setFees(find_fee);
      } else if (payMethod === "crypto") {
        const find_fee = feeCharges?.find((obj) => obj?.network === network);

        setFees({
          ...find_fee,
          max_amount: find_fee?.max,
          min_amount: find_fee?.min,
          fee_value: find_fee?.fee,
          fee_type: "flat",
        });
      } else if (payMethod === "upi") {
        const find_fee = balanceInfo.fees.find(
          (obj) => obj.category === "inapp_purchase_upi"
        );

        setFees(find_fee);
      }
    }
  }, [payMethod]);

  useEffect(() => {
    checkNetworkData();
  }, [showNetworks]);

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

  const handleSubmit = () => {
    if (payMethod) {
      if (payMethod === "crypto") {
        if (!address) {
          setError("Please provide your crypto wallet address");
          return false;
        }
      }

      if (payMethod === "bank") {
        if (!bankDetails.bank_name) {
          setError("Please provide your bank name");
          return false;
        }

        if (!bankDetails.account_holder_name) {
          setError("Please provide your account holder name");
          return false;
        }

        if (!bankDetails.account_number) {
          setError("Please provide your account number");
          return false;
        }

        if (!bankDetails.code_type) {
          setError("Please select your bank identification code");
          return false;
        }

        if (!bankDetails.code_value) {
          setError(
            `Please provide your ${
              codeTypeOptions.find((o) => o.value === bankDetails.code_type)
                .label
            }`
          );
          return false;
        }

        // if (!bankDetails.code_value && !bankDetails.swift) {
        //   setError("Please provide your IFSC or SWIFT Code");
        //   return false;
        // }
      }

      if (payMethod === "upi") {
        if (!upiId || !upiList[0]?.upi_verified) {
          setClick(true);
          let myInterval = setInterval(() => {
            setClick(false);
            clearInterval(myInterval);
          }, 5000);
          setError("Please whitelist your UPI ID");
          return false;
        }
      }

      if (
        amount &&
        parseFloat(amount) >= parseFloat(fees.min_amount) &&
        parseFloat(amount) <= parseFloat(fees.max_amount)
      ) {
        if (parseFloat(withdrawFund.balance) >= parseFloat(amount)) {
          if (receive > 0) {
            setError("");
            withdrawProcess();
          } else {
            setError("Final amount must be greater than $0.00");
          }
        } else {
          setError("Withdrawal amount greater than wallet balance");
        }
      } else {
        if (payMethod === "crypto") {
          setError(
            `Please enter the amount minimum of ${currencyFormat(
              fees.min_amount,
              user.currency_name
            )}`
          );
        } else {
          setError(
            `Please enter the amount minimum of ${currencyFormat(
              fees.min_amount,
              user.currency_name
            )} and maximum of ${currencyFormat(
              fees.max_amount,
              user.currency_name
            )} to withdraw from your wallet`
          );
        }
      }
    } else {
      setError("Please choose your withdrawal method");
    }
  };

  const withdrawProcess = async () => {
    try {
      setLoading(true);
      await withdrawOTPApi({
        amount: amount,
      });
      toast.success("OTP sent successfully to your email address");
      setLoading(false);
      setConfirm({ ...confirm, status: true });
    } catch (err) {
      setLoading(false);
      console.log("🚀 ~ file: withdraw.js ~ line 41 ~ handleSubmit ~ err", err);
      toast.error("An unexpected error occured. Please try again  later");
    }
  };

  const handleVerify = async () => {
    if (confirm.otp.length === 6) {
      if (confirm.password) {
        setLoading(true);

        let trade_withdraw_details = {};

        if (payMethod === "crypto") {
          trade_withdraw_details = {
            type: payMethod,
            crypto: { network: network, address: address },
          };
        } else if (payMethod === "bank") {
          trade_withdraw_details = {
            type: payMethod,
            bank_account: bankDetails,
          };
        } else if (payMethod === "upi") {
          trade_withdraw_details = {
            type: payMethod,
            upi: { upi_id: upiId },
          };
        }

        try {
          await withdrawOTPVerifyApi({
            password: confirm.password,
            email_otp: confirm.otp,
            sms_otp: confirm.m_otp,
          });

          handleWithdrawProcess({
            payment_slug:
              payMethod === "upi"
                ? upiList[0]?.slug
                : payMethod === "crypto" && user?.whitelist_withdrawal
                ? paymentSlug
                : "",
            payment_method: "inapp_purchase",
            amount: amount,
            address: address,
            network:
              payMethod === "crypto" && !user?.whitelist_withdrawal
                ? network
                : "",
            trade_withdraw_details,
            _setError: setError,
            _setLoading: setLoading,
            _setSuccess: setSuccess,
          });
        } catch (err) {
          setLoading(false);
          console.log(
            "🚀 ~ file: withdraw.js ~ line 59 ~ handleVerify ~ err",
            err
          );
          const result = err.data.data;
          let errText = "",
            are = false;
          if (!result.email_otp_verified) {
            errText += "Email OTP";
          }
          if (!result.password_verified) {
            if (errText) are = true;
            errText += `${errText && ", "}Password`;
          }
          if (!result.sms_otp_verified) {
            if (errText) are = true;
            errText += `${errText && ", "}SMS OTP`;
          }

          setError(`${errText} ${are ? "are" : "is"} invalid`);
        }
      } else {
        setError("Enter your Password");
      }
    } else {
      setError("Enter OTP received on your email");
    }
  };

  const calcCharges = (input, _network) => {
    const net_input = _network ? _network : network;

    const find_charge = feeCharges.find((obj) => obj.network === net_input);

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
            (parseFloat(input) * parseFloat(fees?.fee_value)) / 100;

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

    setFees({ ...fees, min_amount: find_charge.min });
  };

  const [networkOptions, setNetworkOptions] = useState([]);

  // const networkOptions = [
  //   {
  //     label: `Binance(BSC) - ${currencyFormat(
  //       feeCharges?.find((obj) => obj.network === "binance").fee,
  //       user.currency_name
  //     )} Fee / Transaction`,
  //     value: "binance",
  //   },
  //   {
  //     label: `Polygon(Matic) - ${currencyFormat(
  //       feeCharges?.find((obj) => obj.network === "matic").fee,
  //       user.currency_name
  //     )} Fee / Transaction`,
  //     value: "matic",
  //   },
  //   {
  //     label: `Ethereum - ${currencyFormat(
  //       feeCharges?.find((obj) => obj.network === "ethereum").fee,
  //       user.currency_name
  //     )} Fee / Transaction`,
  //     value: "ethereum",
  //   },
  // ];

  const checkNetworkData = () => {
    let networks = new Array();

    for (let item of showNetworks) {
      networks.push({
        label: `${item?.display_name} -${currencyFormat(
          feeCharges?.find((obj) => obj?.network === item.name)?.fee,
          user.currency_name
        )} Fee / Transaction`,
        value: item?.name,
      });
    }
    setNetwork(networks?.length > 0 ? networks[0]?.value : []);
    setNetworkOptions(networks);
  };

  const codeTypeOptions = [
    {
      label: `IFSC`,
      value: "ifsc",
    },
    {
      label: `ABA`,
      value: "aba",
    },
    {
      label: `IBAN`,
      value: "iban",
    },
    {
      label: `Routing Number`,
      value: "routing_number",
    },
  ];

  return (
    <>
      {success ? (
        <>
          <div className="inner-card-details">
            <div className="success-card mt-4 ">
              <FiCheckCircle size={50} color={"green"} />
              <div>
                Your withdrawal request has been initiated, and it should
                reflect in your payment method in 2 to 3 working days.
              </div>
            </div>
            <button
              type="button"
              className="btn btn-dark w-100 rounded-pill btn-af-pay mt-3 mb-4"
              onClick={() => {
                if (parseFloat(user?.balance) > 0) {
                  setWithdrawFund({ ...withdrawFund, type: "" });
                } else {
                  setWithdrawFund({ ...withdrawFund, show: false });
                }
              }}
            >
              Okay
            </button>
          </div>
        </>
      ) : (
        <>
          {confirm.status ? (
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
                              feeCharges.find((obj) => obj.network === network)
                                .fee,
                              user.currency_name
                            )}
                            {fees?.fee_type === "percent" && "%"}
                          </>
                        ) : (
                          <>
                            {fees?.fee_type === "percent"
                              ? fees?.fee_value
                              : currencyFormat(
                                  fees?.fee_value,
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

                {/* <div className="mt-3">
            <div className="d-flex justify-content-between ac-cc-title mb-2">
              SMS OTP
            </div>
            <InputOTP
              value={confirm.m_otp}
              onChange={(o) => setConfirm({ ...confirm, m_otp: o })}
              hideLabel
            />
          </div> */}

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
                      setConfirm({ ...confirm, password: e.target.value });
                    }}
                  />
                  {passwordStatus ? (
                    <FaEye
                      role="button"
                      onClick={() => setPasswordStatus(!passwordStatus)}
                      className="eye"
                    />
                  ) : (
                    <FaEyeSlash
                      role="button"
                      onClick={() => setPasswordStatus(!passwordStatus)}
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
              <div className="inner-card-details">
                <div
                  className="pay-list-back"
                  role="button"
                  onClick={() => setWithdrawFund({ ...withdrawFund, type: "" })}
                >
                  <FiArrowLeft size={25} /> Back
                </div>
                <div className="bg-white mt-3 p-3 current-balance">
                  <div className="cb-title">
                    Available In-App Purchase Balance
                  </div>
                  <div>
                    <div className="cb-balance">
                      {/* {currencyFormat(withdrawFund.balance, user.currency_name)} */}
                      {`$` + roundDown(parseFloat(withdrawFund?.balance), 2)}
                    </div>
                  </div>
                </div>

                <div className="mt-3 mb-3">
                  <div className="text-secondary mt-5 ac-step">Step 1</div>
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
                    {/* <div
                      className={`w-mode ${
                        payMethod === "bank" ? "active" : ""
                      }`}
                      role={"button"}
                      onClick={() => {
                        setPayMethod("bank");
                        setAmount("");
                        setError("");
                        calcCharges("");
                      }}
                    >
                      <div className="title">Bank</div>
                      <div>
                        <FaCheckCircle
                          color={payMethod === "bank" ? "#fff" : "#ccc"}
                          className="mb-1 me-2"
                          size={17}
                        />
                      </div>
                    </div> */}
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
                    <p className="crypto-text">(Only USDT)</p>
                  )}

                  {payMethod === "crypto" && (
                    <>
                      <div>
                        <div className="d-flex justify-content-between ac-cc-title">
                          Network
                        </div>
                        <Select
                          options={networkOptions}
                          value={networkOptions?.find(
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
                                    // setAddress("");
                                    setAddress(data?.value);
                                    setPaymentSlug(data?.slug);
                                    // setNetwork(data.value);
                                    // calcCharges(amount, data.value);
                                  }}
                                />
                              );
                            else {
                              return (
                                <>
                                  <div className="pre-btn">
                                    <p
                                      className="bank-details-input wait-msg d-flex align-items-center justify-content-between"
                                      onClick={() => {
                                        dispatch(whitelistCryptoPopUp(network));
                                        history.push("/accounts/whitelist");
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
                        {/* <input
                          type="text"
                          value={address}
                          className="wallet-address"
                          placeholder="0xc896..."
                          maxLength={42}
                          onChange={(e) => {
                            alphaNumeric(e.target.value) &&
                              setAddress(e.target.value);
                          }}
                        /> */}
                      </div>
                    </>
                  )}

                  {payMethod === "bank" && (
                    <>
                      <div className="mt-3 mb-3">
                        <div className="d-flex justify-content-between ac-cc-title">
                          Bank Name
                        </div>
                        <input
                          type="text"
                          value={bankDetails.bank_name}
                          className="bank-details-input"
                          onChange={(e) => {
                            setBankDetails({
                              ...bankDetails,
                              bank_name: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div className="mt-3 mb-3">
                        <div className="d-flex justify-content-between ac-cc-title">
                          Account Holder Name
                        </div>
                        <input
                          type="text"
                          value={bankDetails.account_holder_name}
                          className="bank-details-input"
                          onChange={(e) => {
                            setBankDetails({
                              ...bankDetails,
                              account_holder_name: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div className="mt-3 mb-3">
                        <div className="d-flex justify-content-between ac-cc-title">
                          Account Number
                        </div>
                        <input
                          type="text"
                          value={bankDetails.account_number}
                          className="bank-details-input"
                          onChange={(e) => {
                            setBankDetails({
                              ...bankDetails,
                              account_number: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div>
                        <div className="d-flex justify-content-between ac-cc-title">
                          Bank Identification Code
                        </div>
                        <Select
                          options={codeTypeOptions}
                          value={codeTypeOptions.find(
                            (o) => o.value === bankDetails.code_type
                          )}
                          styles={crispStyle}
                          onChange={(data) => {
                            setBankDetails({
                              ...bankDetails,
                              code_type: data.value,
                            });
                          }}
                        />
                      </div>

                      {bankDetails.code_type && (
                        <div className="mt-3 mb-3">
                          <div className="d-flex justify-content-between ac-cc-title">
                            {
                              codeTypeOptions?.find(
                                (o) => o?.value === bankDetails.code_type
                              ).label
                            }
                          </div>
                          <input
                            type="text"
                            value={bankDetails.code_value}
                            className="bank-details-input"
                            onChange={(e) => {
                              setBankDetails({
                                ...bankDetails,
                                code_value: e.target.value,
                              });
                            }}
                          />
                        </div>
                      )}

                      <div className="mt-3 mb-3">
                        <div className="d-flex justify-content-between ac-cc-title">
                          SWIFT Code{" "}
                          <span className="text-end optional">(optional)</span>
                        </div>
                        <input
                          type="text"
                          value={bankDetails.swift}
                          className="bank-details-input"
                          onChange={(e) => {
                            setBankDetails({
                              ...bankDetails,
                              swift: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </>
                  )}

                  {payMethod === "upi" && (
                    <>
                      <div className="mt-3 mb-3">
                        <div className="d-flex justify-content-between ac-cc-title">
                          UPI ID
                        </div>
                        {upiList.length === 0 || !upiList[0]?.upi_verified ? (
                          <div className={click && "pre-btn"}>
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
                            value={upiList[0]?.payment_id}
                            className="bank-details-input upi-disable"
                          />
                        )}
                      </div>
                    </>
                  )}

                  <div className="text-secondary mt-5 ac-step">Step 2</div>
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
                              if (e.target.value && e.target.value.length < 7) {
                                if (validateCurrency(e.target.value)) {
                                  setAmount(e.target.value);
                                  calcCharges(e.target.value);
                                } else {
                                  if (e.target.value.indexOf(".") !== -1) {
                                    const str = e.target.value;
                                    setAmount(str.substring(0, str.length - 1));
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
                          if (e.target.value && e.target.value.length < 7) {
                            if (validateCurrency(e.target.value)) {
                              setAmount(e.target.value);
                              calcCharges(e.target.value);
                            } else {
                              if (e.target.value.indexOf(".") !== -1) {
                                const str = e.target.value;
                                setAmount(str.substring(0, str.length - 1));
                                calcCharges(str.substring(0, str.length - 1));
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
                            feeCharges?.find((obj) => obj?.network === network)
                              ?.fee,
                            user.currency_name
                          )}
                          {fees.fee_type === "percent" && "%"} Transaction Fee
                          Applies | Final Amount{" "}
                          {currencyFormat(receive, user.currency_name)}
                        </label>
                      </div>
                      <label className="loaded-info">
                        Minimum Withdrawal{" "}
                        {currencyFormat(fees.min_amount, user.currency_name)}
                        <br />
                        Maximum Withdrawal:
                        {currencyFormat(
                          fees?.max_amount,
                          user.currency_name
                        )}{" "}
                        {/* {currencyFormat(fees.max_amount, user.currency_name)} */}
                      </label>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="loaded-info">
                          {fees?.fee_type === "percent"
                            ? fees.fee_value
                            : currencyFormat(
                                fees?.fee_value,
                                user?.currency_name
                              )}
                          {fees?.fee_type === "percent" && "%"} Transaction Fee
                          Applies | Final Amount{" "}
                          {currencyFormat(receive, user.currency_name)}
                        </label>
                      </div>
                      <label className="loaded-info">
                        Minimum Withdrawal{" "}
                        {currencyFormat(fees?.min_amount, user?.currency_name)}
                        <br />
                        Maximum Withdrawal{" "}
                        {currencyFormat(fees?.max_amount, user?.currency_name)}
                      </label>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default InAppWithdraw;
