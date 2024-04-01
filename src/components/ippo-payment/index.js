import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Ippopay } from "react-ippopay";
import { useSelector } from "react-redux";
import { FiArrowLeft } from "react-icons/fi";

import { ippoUpdateOrder, xena } from "../../api/methods";
import { ippoCreateOrder } from "./../../api/methods";
import { currencyFormat, validateCurrency } from "./../../utils/common";
import { getCookiesByName } from "../../utils/cookies";

import "./style.scss";

const IppoPayment = ({
  setAddFund,
  addFund,
  setPageNo,
  getTransactionHistory,
  isFirstDeposit,
  getDepositStat,
}) => {
  const { user } = useSelector((state) => state.user.data);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  // const [fetchLoading, setFetchLoading] = useState(false);
  const [amount, setAmount] = useState("");
  // const [loadedAmount, setLoadedAmount] = useState(0);

  // const [percentage, setPercentage] = useState(0);

  const [ippo, setIppo] = useState({
    ippopayOpen: false,
    order_id: "",
    public_key: process.env.REACT_APP_IPPO_KEY,
  });

  useEffect(() => {
    window.addEventListener("message", ippopayHandler);
    localStorage.setItem("success-msg", "false");
    // fetchDeflationPercentage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const fetchDeflationPercentage = async () => {
  //   try {
  //     setFetchLoading(true);
  //     const result = await getDeflationPercentage();
  //     setFetchLoading(false);
  //     setPercentage(result.data.data.percentage);
  //   } catch (err) {
  //     setFetchLoading(false);
  //     console.log(
  //       "🚀 ~ file: index.js ~ line 36 ~ fetchDeflationPercentage ~ err",
  //       err
  //     );
  //   }
  // };

  const ippopayHandler = (e) => {
    if (e.data.status === "success") {
      console.log("success", e.data);
      setIppo({ ...ippo, ippopayOpen: false });
      getPaymentStatus(e.data);
    }
    if (e.data.status === "failure") {
      console.log("failure", e.data);
      setIppo({ ...ippo, ippopayOpen: false });
      getPaymentStatus(e.data);
    }
  };

  const ippopayOpen = (order_id) => {
    setIppo({ ...ippo, ippopayOpen: true, order_id });
  };

  const getPaymentStatus = async (input) => {
    try {
      const result = await ippoUpdateOrder(input.order_id);

      if (localStorage.getItem("success-msg") === "false") {
        localStorage.setItem("success-msg", "true");

        if (result.data.message === "Payment pending") {
          toast.info(
            "Your Payment Is Pending. The Status Of the Payment Will Be Updated In The Transaction Shortly"
          );
        } else if (
          result.data.message === "Funds were added to your wallet successfully"
        ) {
          toast.success("Funds were added to your wallet successfully");

          // XENA Marketing Deposit Endpoint
          if (getCookiesByName("aid")) {
            xena({
              code: 10033,
              uid: user?.slug,
              aid: getCookiesByName("aid") || "",
              campaign: getCookiesByName("campaign") || "",
              source: getCookiesByName("source") || "",
              vid: getCookiesByName("vid") || "",
              click_id: getCookiesByName("click_id") || "",
              event_name: "deposit",
              ftd: isFirstDeposit ? 1 : 0,
              deposit_amt: amount,
              txid: input?.order_id,
              payment_type: "ippopay",
              is_datas_present: "true",
            });
          } else {
            xena({
              uid: user?.slug,
              event_name: "deposit",
              ftd: isFirstDeposit ? 1 : 0,
              deposit_amt: amount,
              txid: input?.order_id,
              payment_type: "ippopay",
              is_datas_present: "false",
            });
          }
        } else {
          toast.info(result.data.message);
        }
        setAddFund({ ...addFund, show: false });
        getDepositStat();

        setPageNo(1);
        getTransactionHistory(1);

        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error(
        "Something went wrong, dont worry if amount got deducted, please contact support for help"
      );
      console.log(
        "🚀 ~ file: index.js ~ line 55 ~ getPaymentStatus ~ error",
        error
      );
    }
  };

  const handlePayment = async (e) => {
    if (
      amount &&
      parseFloat(amount) >= parseFloat(process.env.REACT_APP_IPPO_MIN_FUND) &&
      parseFloat(amount) <= parseFloat(process.env.REACT_APP_IPPO_MAX_FUND)
    ) {
      setError(null);
      try {
        setLoading(true);
        const result = await ippoCreateOrder(amount);

        ippopayOpen(result.data.data.order_id);
      } catch (error) {
        setLoading(false);
        console.log(
          "🚀 ~ file: index.js ~ line 42 ~ handlePayment ~ error",
          error
        );
      }
    } else {
      setError(
        `Please enter the amount minimum of ${currencyFormat(
          process.env.REACT_APP_IPPO_MIN_FUND,
          user.currency_name
        )} and maximum of ${currencyFormat(
          process.env.REACT_APP_IPPO_MAX_FUND,
          user.currency_name
        )} to fund your GuardianLink wallet`
      );
    }
  };

  const calcLoadedAmount = (input) => {
    // const data =
    //   parseFloat(input) - (parseFloat(input) * parseFloat(percentage)) / 100;
    // setLoadedAmount(data);
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

        <>
          <div className="mt-3 mb-3">
            <div className="d-flex justify-content-between ac-cc-title">
              Payment Amount
            </div>

            <div className="sf-amt-container">
              <div className="af-symbol">$</div>
              <input
                type="text"
                disabled={loading}
                value={amount}
                className="af-amount"
                onChange={(e) => {
                  setError("");
                  if (e.target.value) {
                    if (validateCurrency(e.target.value)) {
                      setAmount(e.target.value);
                      calcLoadedAmount(e.target.value);
                    } else {
                      if (e.target.value.indexOf(".") !== -1) {
                        const str = e.target.value;
                        setAmount(str.substring(0, str.length - 1));
                        calcLoadedAmount(e.target.value);
                      } else {
                        setAmount("");
                      }
                    }
                  } else {
                    setAmount("");
                  }
                }}
              />
            </div>
            {/* {!isNaN(loadedAmount) && loadedAmount > 0 && (
            <label className="loaded-info">
              Your account will be loaded with{" "}
              {currencyFormat(loadedAmount, user.currency_name)}
            </label>
          )} */}
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
              onClick={handlePayment}
            >
              {loading ? "Processing please wait..." : "Pay"}
            </button>

            {/* {!fetchLoading ? (
            <label className="loaded-info">
              Deflation percentage is {percentage.toFixed(2)}%
            </label>
          ) : (
            <label className="loaded-info">
              Loading deflation percentage...
            </label>
          )} */}
            <label className="loaded-info">
              You need to fund your GuardianLink wallet with a minimum of $
              {process.env.REACT_APP_IPPO_MIN_FUND}.
            </label>
          </div>
          {/* <div className="mt-4 mb-4 p-3 rounded-3 border ">
          <p className="card-info">
            When you make a fiat payment in INR with UPI, you transact with
            Appstars Applications Pvt. Ltd.
          </p>
        </div> */}
        </>
        <div>
          <Ippopay
            ippopayOpen={ippo.ippopayOpen}
            ippopayClose={true}
            order_id={ippo.order_id}
            public_key={ippo.public_key}
          />
        </div>
      </div>
    </>
  );
};

export default IppoPayment;
