import React, { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import { cashfreeSandbox, cashfreeProd } from "cashfree-dropjs";

import { useSelector } from "react-redux";
import { FiArrowLeft } from "react-icons/fi";

import {
  cashfreeCreateOrder,
  cashfreeOrderStatus,
  xena,
} from "./../../api/methods";
import { currencyFormat, validateCurrency } from "./../../utils/common";

import "./style.scss";
import { getCookiesByName } from "../../utils/cookies";

const CashFreePayment = ({
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
  const [show, setShow] = useState(false);
  const [amount, setAmount] = useState("");

  const handleClose = () => {
    setShow(false);
    setLoading(false);
  };

  const handlePayment = async (e) => {
    if (
      amount &&
      parseFloat(amount) >=
        parseFloat(process.env.REACT_APP_CASHFREE_MIN_FUND) &&
      parseFloat(amount) <= parseFloat(process.env.REACT_APP_CASHFREE_MAX_FUND)
    ) {
      setError(null);
      try {
        setLoading(true);
        const result = await cashfreeCreateOrder(amount);
        console.log(
          "🚀 ~ file: index.js ~ line 39 ~ handlePayment ~ result",
          result
        );
        setShow(true);
        renderDropin(result.data.data.order_token);
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
          process.env.REACT_APP_CASHFREE_MIN_FUND,
          user.currency_name
        )} and maximum of ${currencyFormat(
          process.env.REACT_APP_CASHFREE_MAX_FUND,
          user.currency_name
        )} to fund your GuardianLink wallet`
      );
    }
  };

  const callbackSuccess = async (data) => {
    if (data.order && data.order.status === "PAID") {
      try {
        setShow(false);
        await cashfreeOrderStatus(data.order.orderId);

        toast.success("Funds Were Added To Your Wallet Successfully");

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
            payment_type: "cashfree",
            is_datas_present: "true",
          });
        } else {
          xena({
            uid: user?.slug,
            event_name: "deposit",
            ftd: isFirstDeposit ? 1 : 0,
            deposit_amt: amount,
            payment_type: "cashfree",
            is_datas_present: "false",
          });
        }

        setAddFund({ ...addFund, show: false });
        setPageNo(1);
        getDepositStat();

        getTransactionHistory(1);
      } catch (error) {
        setLoading(false);
        toast.error("An unexpected error occured. Please try again ");

        console.log(
          "🚀 ~ file: index.js ~ line 73 ~ callbackSuccess ~ error",
          error
        );
      }
    }
  };
  const callbackFailure = (data) => {
    console.log("🚀 ~ file: App.js ~ line 50 ~ callbackFailure ~ data", data);
    if (data.order.status === "ACTIVE") {
      toast.error(
        "Please note that your payment was declined. We suggest that you check your credentials and try again."
      );
    } else {
      setShow(false);
      setLoading(false);
      toast.error(
        "Please note that your payment was declined. We suggest that you check your credentials and try again."
      );
    }
  };

  const renderDropin = (orderToken) => {
    let parent = document.getElementById("drop_in_container");
    parent.innerHTML = "";
    let cashfree;
    if (process.env.REACT_APP_CASHFREE_PROD === "true") {
      cashfree = new cashfreeProd.Cashfree();
    } else {
      cashfree = new cashfreeSandbox.Cashfree();
    }

    cashfree.initialiseDropin(parent, {
      orderToken,
      onSuccess: callbackSuccess,
      onFailure: callbackFailure,
      components: ["upi", "card", "order-details", "netbanking"],
      style: { color: "#000" },
    });
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
                    } else {
                      if (e.target.value.indexOf(".") !== -1) {
                        const str = e.target.value;
                        setAmount(str.substring(0, str.length - 1));
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

            <label className="loaded-info">
              You need to fund your GuardianLink wallet with a minimum of $
              {process.env.REACT_APP_CASHFREE_MIN_FUND}.
            </label>
          </div>
          {/* <div className="mt-4 mb-4 p-3 rounded-3 border ">
          <p className="card-info">
            When you make a fiat payment in INR, you transact with Appstars
            Applications Pvt. Ltd.
          </p>
        </div> */}
        </>
        <Modal show={show} onHide={handleClose} size={"lg"}>
          <Modal.Header closeButton>
            <Modal.Title>Cashfree Payment Gateway</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="dropin-parent" id="drop_in_container"></div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default CashFreePayment;
