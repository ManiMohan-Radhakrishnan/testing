import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { FiArrowLeft, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import InputOTP from "./../input-otp";
import {
  currencyFormat,
  validateCurrency,
  dot,
  roundDown,
  alphaNumeric,
  // feeCharges,
} from "./../../utils/common";
import { withdrawOTPVerifyApi, withdrawOTPApi } from "../../api/methods";

import "./style.scss";
import { whitelistCryptoPopUp } from "../../redux/actions/user_action";
import { useHistory } from "react-router-dom";

const CryptoDetailsWithdraw = ({
  balanceInfo,
  withdrawFund,
  setWithdrawFund,
  handleWithdrawProcess,
  cryptoList,
  showNetworks,
}) => {
  const feeCharges = balanceInfo?.crypto_fees;
  const { user } = useSelector((state) => state.user.data);
  const [loading, setLoading] = useState(false);
  const [proceed, setProceed] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [network, setNetwork] = useState(showNetworks[0]?.name || "binance");

  const [confirm, setConfirm] = useState({
    status: false,
    otp: "",
    password: "",
    sms_otp: "",
  });

  const [receive, setReceive] = useState(0);
  const [selectCryptoFees, setSelectCryptoFees] = useState({});
  const [passwordStatus, setPasswordStatus] = useState(true);
  const [paymentSlug, setPaymentSlug] = useState("");
  const [selectPaymentNetwork, setSelectPaymentNetwork] = useState();
  const [selectFields, setSelectFields] = useState([]);
  const history = useHistory();
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (
      amount &&
      parseFloat(amount) >= parseFloat(selectCryptoFees?.min) &&
      parseFloat(amount) <= parseFloat(selectCryptoFees?.max)
    ) {
      if (!address) {
        setError("Please provide your crypto wallet address");
        return false;
      }
      if (parseFloat(withdrawFund.balance) >= parseFloat(amount)) {
        if (receive > 0) {
          setError("");
          try {
            setLoading(true);
            await withdrawOTPApi({
              payment_type: withdrawFund.type,
              amount: amount,
              address: address,
              network: network,
            });
            toast.success("OTP sent successfully to your email address");
            setLoading(false);
            setConfirm({ ...confirm, status: true });
          } catch (err) {
            setLoading(false);
            console.log(
              "🚀 ~ file: withdraw.js ~ line 41 ~ handleSubmit ~ err",
              err
            );
            toast.error("An unexpected error occured. Please try again later");
          }
        } else {
          setError("Final amount must be greater than $0.00");
        }
      } else {
        setError("Withdrawal amount greater than wallet balance");
      }
    } else {
      setError(
        `Please enter the amount minimum of ${currencyFormat(
          selectCryptoFees?.min,
          user.currency_name
        )}`
      );
    }
  };

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
    // console.log(
    //   feeCharges,
    //   feeCharges?.find((obj) => obj?.network === network)
    // );
    let selectedFee = feeCharges?.find((obj) => obj?.network === network);
    // console.log(obj, "jadisn");
    setSelectCryptoFees(selectedFee);
  }, [network]);

  const handleVerify = async () => {
    if (confirm.otp.length === 6) {
      if (confirm.password) {
        setLoading(true);

        try {
          await withdrawOTPVerifyApi({
            password: confirm.password,
            email_otp: confirm.otp,
            sms_otp: confirm.m_otp,
          });

          handleWithdrawProcess({
            payment_slug: user?.whitelist_withdrawal ? paymentSlug : "",
            payment_method: "crypto",
            amount: amount,
            address: !user?.whitelist_withdrawal ? address : "",
            network: !user?.whitelist_withdrawal ? network : "",
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
    // if (input) {
    //   if (withdrawFund.fee.fee_type === "percent") {
    //     const data =
    //       parseFloat(input) -
    //       (parseFloat(input) * parseFloat(withdrawFund.fee.fee_value)) / 100;
    //     setReceive(data);
    //   } else {
    //     setReceive(parseFloat(input) - withdrawFund.fee.fee_value);
    //   }
    // } else {
    //   setReceive(0);
    // }

    const net_input = _network ? _network : network;

    const data =
      parseFloat(input) -
      feeCharges.find((obj) => obj.network === net_input).fee;
    if (data > 0) {
      setReceive(roundDown(data, 2));
    } else {
      setReceive(0);
    }
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
  const [networkOptions, setNetworkOptions] = useState([]);

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
                        {currencyFormat(
                          selectCryptoFees?.fee,
                          user.currency_name
                        )}
                        {withdrawFund.fee.fee_type === "percent" && "%"}
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
              onChange={(o) => setConfirm({  ...confirm, m_otp: o })}
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
                  {!passwordStatus ? (
                    <FaEyeSlash
                      role="button"
                      onClick={() => setPasswordStatus(!passwordStatus)}
                      className="eye"
                    />
                  ) : (
                    <FaEye
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
                  className="btn btn-dark w-100 rounded-pill btn-af-pay"
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
                    Max. amount you can withdraw with this payment method.{" "}
                    <a
                      href="https://help.jump.trade/support/solutions/articles/84000375756-why-is-there-a-limit-on-how-much-funds-i-can-withdraw-from-a-particular-payment-method-"
                      target="_blank"
                    >
                      Learn more
                    </a>
                  </div>
                  <div>
                    <div className="cb-balance">
                      {/* {currencyFormat(withdrawFund.balance, user.currency_name)} */}
                      {`$` + roundDown(parseFloat(withdrawFund?.balance), 2)}
                    </div>
                  </div>
                </div>

                {proceed && (
                  <>
                    <div className="mt-3">
                      <div className="mt-3 mb-3">
                        <div className="text-secondary mt-5 ac-step">
                          Step 1
                        </div>
                        <div className="d-flex justify-content-between ac-cc-title">
                          Network
                        </div>
                        <Select
                          options={networkOptions}
                          value={networkOptions?.find(
                            (o) => o.value === network
                          )}
                          styles={crispStyle}
                          onChange={(data) => {
                            setNetwork(data.value);
                            calcCharges(amount, data.value);
                          }}
                        />
                      </div>

                      <div className="text-secondary mt-3 ac-step">Step 2</div>
                      <div className="d-flex justify-content-between ac-cc-title">
                        Withdrawal Amount
                      </div>
                      <div className="sf-amt-container">
                        <div className="af-symbol">$</div>
                        <input
                          type="text"
                          value={amount}
                          className="af-amount"
                          onChange={(e) => {
                            setError("");
                            if (e.target.value && e.target.value.length < 10) {
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
                      </div>

                      <div className="mt-3 mb-3">
                        <div className="text-secondary mt-3 ac-step">
                          Step 3
                        </div>
                        <div className="d-flex justify-content-between ac-cc-title">
                          Withdrawal Address
                        </div>
                        {(() => {
                          if (user?.whitelist_withdrawal) {
                            if (selectPaymentNetwork?.length > 0)
                              return (
                                <Select
                                  options={selectFields}
                                  value={selectFields?.find(
                                    (o) => o?.value === address
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
                            onChangeWalletAddress(e.target.value);
                          }}
                        /> */}
                      </div>
                      {error && (
                        <div className="mb-3">
                          <h6 className="text-danger mb-0">{error}</h6>
                        </div>
                      )}
                      <button
                        // disabled={loading}
                        disabled={loading}
                        type="button"
                        className="btn btn-dark w-100 rounded-pill btn-af-pay mt-2 mb-1"
                        onClick={handleSubmit}
                      >
                        {loading ? "Processing please wait..." : "Submit"}
                      </button>
                      <div className="text-center">
                        <div>
                          <label className="loaded-info">
                            {currencyFormat(
                              selectCryptoFees?.fee,
                              user?.currency_name
                            )}
                            {withdrawFund.fee.fee_type === "percent" && "%"}{" "}
                            Transaction Fee Applies | Final Amount{" "}
                            {currencyFormat(receive, user.currency_name)}
                          </label>
                        </div>
                        <label className="loaded-info">
                          Minimum Withdrawal{" "}
                          {currencyFormat(
                            selectCryptoFees?.min,
                            user.currency_name
                          )}
                          <br />
                          Maximum Withdrawal:
                          {/* No Limit{" "} */}
                          {currencyFormat(
                            selectCryptoFees?.max,
                            user.currency_name
                          )}
                        </label>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
          <div className="mt-4 mb-3 p-3 rounded-3 border ">
            <p className="card-info">
              Please double-check your destination address & network. Please be
              informed that withdrawals to wrong addresses and
              wrong/non-compliant networks (including but not limited to smart
              contract addresses, ICOs and Airdrops) will result in an
              irreversible/irrecoverable loss of funds. Withdrawals cannot be
              cancelled after submission.
            </p>
          </div>

          {!proceed && (
            <button
              type="button"
              className="btn btn-dark w-100 rounded-pill btn-af-pay mb-4"
              onClick={() => {
                setProceed(true);
              }}
            >
              Proceed
            </button>
          )}
        </>
      )}
    </>
  );
};

export default CryptoDetailsWithdraw;
