import React, { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useSelector } from "react-redux";
import QRCode from "react-qr-code";

import CopyToClipboardComponent from "./../copy-to-clipboard";
import {
  alphaNumeric,
  currencyFormat,
  isNumber,
  validateCurrencyUpiPayment,
  validateNumber,
  validateUpi,
} from "./../../utils/common";
import {
  offlinePaymentsConvert,
  offlinePaymentsDetails,
  offlinePaymentsSubmit,
} from "../../api/methods";

import "./style.scss";
import InputText from "../input-text";
import { toast } from "react-toastify";
import ToolTip from "../tooltip";
import { BsFillQuestionCircleFill, BsFillInfoCircleFill } from "react-icons/bs";
import { useQuery } from "../../hooks/url-params";
import { useLocation } from "react-router-dom";

const UpiPayment = ({ addFund, setAddFund, getDepositStat }) => {
  const location = useLocation();
  const query = useQuery(location.search);
  const { user } = useSelector((state) => state.user.data);
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const [refresh, setRefresh] = useState(false);
  const [paymentdetail, setPaymentDetail] = useState([]);
  const [paymentApproxUsd, setPaymentApproxUsd] = useState([]);

  const [checked, setChecked] = useState(false);
  const callIt = query.get("callit");
  const IsType = query.get("depositType");
  const Ispath = query.get("path");

  const [upiPayment, setUpiPayment] = useState({
    amount: "",
    trans_id: "",
    upi_id: "",
  });

  const [validation, setValidation] = useState({
    amount: false,
    valid_amount: false,
    trans_id: false,
    valid_trans_id: false,
    upi_id: false,
    valid_upi_id: false,
  });
  useEffect(() => {
    getOfflinePaymentsDetails();
  }, []);
  useEffect(() => {
    let myInterval = 0;
    if (refresh) {
      myInterval = setInterval(() => {
        setSeconds(seconds - 1);
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else {
          setRefresh(false);
        }
      }, 1000);
    } else {
      setSeconds(30);
    }

    return () => {
      clearInterval(myInterval);
    };
  }, [seconds, refresh]);

  const checkValidation = () => {
    let c_validation = { ...validation };

    // if (!upiPayment.amount) {
    //   c_validation = { ...c_validation, amount: true };
    // } else {
    //   c_validation = { ...c_validation, valid_amount: false };
    // }

    if (checked && !upiPayment.amount) {
      c_validation = { ...c_validation, amount: true };
    } else {
      if (validateCurrencyUpiPayment(upiPayment.amount)) {
        c_validation = { ...c_validation, valid_amount: false };
      } else {
        c_validation = { ...c_validation, valid_amount: true };
      }
    }

    if (checked && !upiPayment.upi_id) {
      c_validation = { ...c_validation, upi_id: true };
    } else {
      if (validateUpi(upiPayment.upi_id)) {
        c_validation = { ...c_validation, valid_upi_id: false };
      } else {
        c_validation = { ...c_validation, valid_upi_id: true };
      }
    }

    if (checked && !upiPayment.trans_id) {
      c_validation = { ...c_validation, trans_id: true };
    } else {
      if (upiPayment?.trans_id?.length < 12) {
        c_validation = { ...c_validation, valid_trans_id: true };
      } else {
        c_validation = { ...c_validation, valid_trans_id: false };
      }
    }

    setValidation(c_validation);
    if (
      !c_validation.trans_id &&
      !c_validation.valid_trans_id &&
      !c_validation.upi_id &&
      !c_validation.valid_upi_id &&
      !c_validation.trans_id &&
      !c_validation.valid_trans_id
    ) {
      return true;
    } else {
      return false;
    }
  };

  const getOfflinePaymentsDetails = async () => {
    try {
      setLoading(true);
      const result = await offlinePaymentsDetails();
      setPaymentDetail(result?.data?.data);

      setLoading(false);
    } catch (error) {
      console.log(
        "🚀 ~ file: index.js ~ line 133 ~ offlinePaymentsDetails ~ error",
        error
      );
    }
  };
  const handlePaymentCovert = async (e) => {
    try {
      const result = await offlinePaymentsConvert(e);
      setPaymentApproxUsd(result?.data?.data);
    } catch (error) {
      setLoading(false);
      console.log(
        "🚀 ~ file: index.js ~ line 42 ~ offlinePaymentsConvert ~ error",
        error
      );
    }
  };

  const handlePayment = async (e) => {
    if (checkValidation()) {
      try {
        setLoading(true);
        let apiInput = { ...upiPayment };
        apiInput.txid = apiInput?.trans_id;
        // const amount =  apiInput?.amount;
        // const trans_id = apiInput?.amount;
        // const upi_id = apiInput?.amount;

        const result = await offlinePaymentsSubmit(apiInput);
        if (result.status === 200) {
          setAddFund({ ...addFund, show: false });
          getDepositStat();

          toast.success("UPI deposit details submitted for processing.");

          if (IsType === "category") {
            if (callIt === "y") {
              setTimeout(() => {
                window.open(`https://${Ispath}/wallet`);
              }, 2000);
            }
          } else if (IsType === "events") {
            if (callIt === "y") {
              setTimeout(() => {
                if (callIt === "y") {
                  window.open(
                    `${process.env.REACT_APP_CALLIT_BASE_URL}`,
                    "_self"
                  );
                } else {
                  window.location.reload();
                }
              }, 500);
            }
          }
        }
      } catch (error) {
        setLoading(false);
        if (error?.data?.status === 422) {
          toast.error(error?.data?.message);
        }
        console.log(
          "🚀 ~ file: index.js ~ line 42 ~ handlePayment ~ error",
          error
        );
      }
    }
  };

  return (
    <>
      <div className="inner-card-details">
        <div
          className="pay-list-back"
          role="button"
          onClick={() => setAddFund({ ...addFund, type: "" })}
        >
          <FiArrowLeft size={25} /> Back
        </div>

        <div className="bg-white mt-3 p-3 current-balance">
          <div className="cb-title">Current Balance</div>
          <div>
            <div className="cb-balance">
              {currencyFormat(user.balance, user.currency_name)}
            </div>
          </div>
        </div>

        <div className="mt-3">
          <>
            <>
              <div className="d-flex justify-content-between ac-cc-title">
                <h6 className="scan-text">
                  Scan Code <br />
                  <span>
                    ( No. of UPI deposits allowed per day:{" "}
                    {paymentdetail?.max_tx}, Remaining : {paymentdetail?.rem_tx}
                    ){" "}
                  </span>
                </h6>{" "}
              </div>
              <>
                <div className="text-center mt-4">
                  {paymentdetail?.link && (
                    <QRCode value={paymentdetail?.link} width="100%" />
                  )}
                </div>
              </>

              <div className="mt-4 mb-3">
                <CopyToClipboardComponent copyText={paymentdetail?.upi_id} />
              </div>

              <div className="form-group mb-3 flex-input-grp">
                <div className="inr-input">
                  <InputText
                    type="number"
                    title={"Amount (INR) "}
                    value={upiPayment?.amount}
                    required={validation.amount}
                    className="af-amount"
                    placeholder="Amount"
                    maxLength="7"
                    onKeyPress={(e) => {
                      if (e.keyCode) {
                        return null;
                      }
                    }}
                    upiPayment
                    onChange={(e) => {
                      if (
                        e?.target?.value &&
                        e?.target?.value <= paymentdetail?.max_deposit
                      ) {
                        if (validateNumber(e.target.value)) {
                          setUpiPayment({
                            ...upiPayment,
                            amount: e?.target?.value.trim(),
                          });
                          handlePaymentCovert(e.target?.value);

                          if (e?.target?.value) {
                            setValidation({ ...validation, amount: false });
                          } else {
                            setValidation({ ...validation, amount: true });
                          }
                        }
                      } else {
                        setUpiPayment({
                          ...upiPayment,
                          amount: "",
                        });
                        handlePaymentCovert(0);
                      }
                    }}
                  />
                </div>
                <div className="bg-white current-balance">
                  <div className="cb-balance">
                    ~{currencyFormat(paymentApproxUsd?.approx_usd)}
                    <ToolTip
                      content={
                        "Approx value. Conversion rate subject to change"
                      }
                      icon={
                        <BsFillInfoCircleFill
                          size={16}
                          className="ms-2 question-icon"
                        />
                      }
                      placement="top"
                    />
                  </div>
                </div>
              </div>
              <div className="form-group mb-3">
                {" "}
                <label className="input-title">
                  {" "}
                  After paying in UPI app, submit the details to process the
                  payment.
                </label>{" "}
              </div>
              <div className="form-group mb-3">
                <InputText
                  type="text"
                  title={"UPI Transaction Id"}
                  value={upiPayment?.trans_id}
                  required={validation.trans_id}
                  className="af-amount"
                  placeholder="UPI Transaction Id"
                  // onKeyPress={handleKeyPressEvent}
                  onChange={(e) => {
                    if (
                      (e.target.value.length <= 12 &&
                        validateNumber(e.target.value)) ||
                      e.target.value === ""
                    ) {
                      setUpiPayment({
                        ...upiPayment,
                        trans_id: e.target.value.trim(),
                      });
                    }
                    if (e) {
                      setValidation({ ...validation, trans_id: false });
                    } else {
                      setValidation({ ...validation, trans_id: true });
                    }
                  }}
                />
                {validation?.valid_trans_id && (
                  <p className="error_text">
                    Please enter 12-digit UPI transaction ID
                  </p>
                )}
              </div>
              <div className="form-group mb-3">
                <InputText
                  type="text"
                  title={"Your UPI ID"}
                  value={upiPayment?.upi_id}
                  required={validation.upi_id}
                  className="af-amount"
                  placeholder="Your UPI ID"
                  // onKeyPress={handleKeyPressEvent}
                  onChange={(e) => {
                    setUpiPayment({
                      ...upiPayment,
                      upi_id: e.target.value.trim(),
                    });
                    if (e) {
                      setValidation({ ...validation, upi_id: false });
                    } else {
                      setValidation({ ...validation, upi_id: true });
                    }
                  }}
                />
                {validation.valid_upi_id && (
                  <p className="error_text">Please enter a valid UPI ID</p>
                )}
              </div>

              <div className="form-group mb-3">
                <input
                  type="checkbox"
                  role={"button"}
                  checked={checked}
                  onChange={() => setChecked(!checked)}
                />{" "}
                <label className="input-title">I have made the payment</label>{" "}
              </div>

              {checked && (
                <>
                  {/* <div className="form-group mb-3 flex-input-grp">
                    <div className="inr-input">
                      <InputText
                        type="text"
                        title={"Amount"}
                        value={upiPayment?.amount}
                        required={validation.amount}
                        className="af-amount"
                        placeholder="Amount"
                        maxLength="7"
                        onKeyPress={(e) => {
                          console.log(e.keyCode, "eveng");
                          if (e.keyCode) {
                            return null;
                          }
                        }}
                        onChange={(e) => {
                          if (
                            e?.target?.value &&
                            e?.target?.value <= paymentdetail?.max_deposit
                          ) {
                            if (validateCurrencyUpiPayment(e.target.value)) {
                              setUpiPayment({
                                ...upiPayment,
                                amount: e?.target?.value.trim(),
                              });
                              handlePaymentCovert(e.target?.value);
                              if (e?.target?.value) {
                                setValidation({ ...validation, amount: false });
                              } else {
                                setValidation({ ...validation, amount: true });
                              }
                            }
                          } else {
                            setUpiPayment({
                              ...upiPayment,
                              amount: "",
                            });
                            // if (validateCurrencyUpiPayment(e.target.value)) {
                            handlePaymentCovert(0);
                            // }
                          }
                        }}
                      />
                    </div>
                    <div className="bg-white current-balance">
                      <div className="cb-balance">
                        {currencyFormat(paymentApproxUsd?.approx_usd)}
                      </div>
                    </div>
                  </div> */}
                  {/* <div className="form-group mb-3">
                    <InputText
                      type="text"
                      title={"Transcation Id"}
                      value={upiPayment?.trans_id}
                      required={validation.trans_id}
                      className="af-amount"
                      placeholder="Transaction Id"
                      // onKeyPress={handleKeyPressEvent}
                      onChange={(e) => {
                        setUpiPayment({
                          ...upiPayment,
                          trans_id: e.target.value.trim(),
                        });
                        if (e) {
                          setValidation({ ...validation, trans_id: false });
                        } else {
                          setValidation({ ...validation, trans_id: true });
                        }
                      }}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <InputText
                      type="text"
                      title={"UPI ID"}
                      value={upiPayment?.upi_id}
                      required={validation.upi_id}
                      className="af-amount"
                      placeholder="UPI ID"
                      // onKeyPress={handleKeyPressEvent}
                      onChange={(e) => {
                        setUpiPayment({
                          ...upiPayment,
                          upi_id: e.target.value.trim(),
                        });
                        if (e) {
                          setValidation({ ...validation, upi_id: false });
                        } else {
                          setValidation({ ...validation, upi_id: true });
                        }
                      }}
                    />
                    {validation.valid_upi_id && (
                      <p className="error_text">Please enter a valid UPI ID</p>
                    )}
                  </div> */}
                  <button
                    // disabled={
                    //   upiPayment?.upi_id.length === 0 ||
                    //   !validateUpi(upiPayment?.upi_id)
                    // }
                    disabled={loading}
                    type="button"
                    className="btn btn-dark mt-4 mb-2 mx-auto"
                    onClick={handlePayment}
                  >
                    {!loading ? "Submit" : "Loading"}
                  </button>
                </>
              )}

              {/* <div className="form-group mb-3 flex-input-grp">
                <div className="inr-input">
                  <InputText
                    type="text"
                    title={"Amount"}
                    value={upiPayment?.amount}
                    required={validation.amount}
                    className="af-amount"
                    placeholder="Amount"
                    maxLength="7"
                    onKeyPress={(e) => {
                      console.log(e.keyCode, "eveng");
                      if (e.keyCode) {
                        return null;
                      }
                    }}
                    onChange={(e) => {
                      if (
                        e?.target?.value &&
                        e?.target?.value <= paymentdetail?.max_deposit
                      ) {
                        if (validateCurrencyUpiPayment(e.target.value)) {
                          setUpiPayment({
                            ...upiPayment,
                            amount: e?.target?.value.trim(),
                          });
                          handlePaymentCovert(e.target?.value);
                          if (e?.target?.value) {
                            setValidation({ ...validation, amount: false });
                          } else {
                            setValidation({ ...validation, amount: true });
                          }
                        }
                      } else {
                        setUpiPayment({
                          ...upiPayment,
                          amount: "",
                        });
                        // if (validateCurrencyUpiPayment(e.target.value)) {
                        handlePaymentCovert(0);
                        // }
                      }
                    }}
                  />
                </div>
                <div className="bg-white current-balance">
                  <div className="cb-balance">
                    {currencyFormat(paymentApproxUsd?.approx_usd)}
                  </div>
                </div>
              </div> */}

              {/* <div className="form-group mb-3">
                <InputText
                  type="text"
                  title={"Transcation Id"}
                  value={upiPayment?.trans_id}
                  required={validation.trans_id}
                  className="af-amount"
                  placeholder="Transaction Id"
                  // onKeyPress={handleKeyPressEvent}
                  onChange={(e) => {
                    setUpiPayment({
                      ...upiPayment,
                      trans_id: e.target.value.trim(),
                    });
                    if (e) {
                      setValidation({ ...validation, trans_id: false });
                    } else {
                      setValidation({ ...validation, trans_id: true });
                    }
                  }}
                />
              </div> */}

              {/* <div className="form-group mb-3">
                <InputText
                  type="text"
                  title={"UPI ID"}
                  value={upiPayment?.upi_id}
                  required={validation.upi_id}
                  className="af-amount"
                  placeholder="UPI ID"
                  // onKeyPress={handleKeyPressEvent}
                  onChange={(e) => {
                    setUpiPayment({
                      ...upiPayment,
                      upi_id: e.target.value.trim(),
                    });
                    if (e) {
                      setValidation({ ...validation, upi_id: false });
                    } else {
                      setValidation({ ...validation, upi_id: true });
                    }
                  }}
                />
                {validation.valid_upi_id && (
                  <p className="error_text">Please enter a valid UPI ID</p>
                )}
              </div> */}
            </>
          </>
        </div>
      </div>
    </>
  );
};

export default UpiPayment;
