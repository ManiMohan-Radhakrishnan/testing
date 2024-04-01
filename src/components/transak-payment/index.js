import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FiArrowLeft } from "react-icons/fi";
import { currencyFormat } from "../../utils/common";
import transakSDK from "@transak/transak-sdk";

import "./style.scss";
import { toast } from "react-toastify";

const TransakPayment = ({ setAddFund, addFund, isCallIt }) => {
  const { user } = useSelector((state) => state.user.data);
  const [loading, setLoading] = useState(false);

  const settings = {
    apiKey: process.env.REACT_APP_TRANSAK_KEY, // Your API Key
    environment: process.env.REACT_APP_TRANSAK_ENVIRONMENT, // STAGING/PRODUCTION
    widgetHeight: "600px",
    widgetWidth: "100%",
    defaultCryptoCurrency: "[USDT,USDC]", // Example 'ETH'
    cryptoCurrencyList: "USDT,USDC",
    networks: "ethereum,polygon,bsc",
    walletAddress: user?.crypto_address, // Your customer's wallet address
    themeColor: "17724d", // App theme color
    fiatCurrency: "", // If you want to limit fiat selection eg 'USD'
    exchangeScreenTitle: "Jump.trade",
    hideMenu: true,
    partnerCustomerId: user?.slug,
    isFeeCalculationHidden: true,
    redirectURL: window.location.href,
  };

  const openTransak = () => {
    setAddFund(!addFund);
    const transak = new transakSDK(settings);

    transak.init();

    // To get all the events
    transak.on(transak.ALL_EVENTS, (data) => {
      console.log(data);
    });

    // This will trigger when the user closed the widget
    transak.on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, (eventData) => {
      console.log(eventData);
      transak.close();
      isCallIt &&
        setTimeout(() => {
          window.location.reload();
        }, 500);
    });

    transak.on(transak.EVENTS.TRANSAK_ORDER_FAILED, (eventData) => {
      console.log(eventData);
      toast.error("Payment failed. Please try again.");
      transak.close();
    });

    // This will trigger when the user marks payment is made.
    transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
      console.log(orderData);
      toast.success("Payment initiated.");
      transak.close();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
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

        <div className="mt-5 mb-4 qr-terms border p-4 rounded-3">
          When you make payments using Transak, your payment is processed in
          equivalent USD, and you transact with Guardian Blockchain Labs Pte
          Ltd.
        </div>

        <>
          <div className="mt-3 mb-4 text-center">
            <button
              disabled={loading}
              type="button"
              className="btn btn-dark w-100 rounded-pill btn-af-pay"
              onClick={openTransak}
            >
              {loading ? "Processing please wait..." : "Deposit"}
            </button>
          </div>
        </>
      </div>
    </>
  );
};

export default TransakPayment;
