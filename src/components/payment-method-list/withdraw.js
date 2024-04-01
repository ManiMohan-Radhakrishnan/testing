import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { getGameTotalbalance } from "../../api/methods";

import PlayWallet from "../play-wallet";

import usdt from "../../images/usdt.svg";
import stripe from "../../images/stripe.svg";
import fracto from "../../images/fracto.svg";
import upi from "../../images/upi.svg";
import cashfree from "../../images/cashfree.svg";
import trade from "../../images/trade.svg";
import inApp1 from "../../images/inapp1.png";

import "./style.scss";

const PaymentMethodListWithdraw = ({
  balanceInfo,
  handleSelectedPay,
  upiUsers,
  crypto,
  network,
  withdraw,
  WithdrawFund,
  handleWithdraw,
  setWithDrawTitle,
}) => {
  const user = useSelector((state) => state.user);
  const [key, setKey] = useState("withdraw");
  const [playWalletInfo, setPlaywalletInfo] = useState(null);

  const playwalletBalance = async () => {
    try {
      const result = await getGameTotalbalance();
      setPlaywalletInfo(result?.data?.data || {});
    } catch (err) {
      console.log(err?.data?.message);
    }
  };

  useEffect(() => {
    if (key === "playwallet" && !playWalletInfo) playwalletBalance();
  }, [key]);

  return (
    <>
      <div className="myplay-wallet">
        <div className="top-flex-block-pill">
          <div className="top-flex-block-pill-box">
            <div
              role={"button"}
              className={`rounded-pill top-activity-filter-pill ${
                key === "withdraw" ? "active" : ""
              }`}
              onClick={() => {
                setKey("withdraw");
                setWithDrawTitle("Gl_wallet");
              }}
            >
              My GuardianLink Wallet
            </div>
            <div
              role={"button"}
              className={`rounded-pill top-activity-filter-pill ${
                key === "playwallet" ? "active" : ""
              }`}
              onClick={() => {
                setKey("playwallet");
                setWithDrawTitle("play_wallet");
              }}
            >
              My Play Wallet
              {/* <i className="newbadge "> Disabled </i> */}
            </div>
          </div>
        </div>
      </div>
      {key === "withdraw" ? (
        <>
          <PayCardWith
            method={"crypto"}
            title={"Crypto (Only USDT)"}
            balance={balanceInfo?.balance?.crypto}
            fee={balanceInfo?.fees.find((obj) => obj.category === "crypto")}
            desc="Available Balance"
            image={usdt}
            onClick={handleSelectedPay}
          />
          {/* <PayCardWith
            method={"fracto_crypto"}
            title={"Fracto Crypto"}
            balance={balanceInfo?.balance?.fracto_crypto}
            fee={balanceInfo?.fees.find(
              (obj) => obj.category === "fracto_crypto"
            )}
            desc="Available Balance"
            image={fracto}
            onClick={handleSelectedPay}
          /> */}
          {/* <PayCardWith
            method={"stripe"}
            title={"Stripe"}
            balance={balanceInfo?.balance?.stripe}
            desc="Available Balance"
            image={stripe}
            fee={balanceInfo?.fees.find((obj) => obj.category === "stripe")}
            onClick={handleSelectedPay}
          /> */}
          <PayCardWith
            method={"fracto_card"}
            title={"Fracto Card"}
            balance={balanceInfo?.balance?.fracto_card}
            desc="Available Balance"
            image={fracto}
            fee={balanceInfo?.fees.find(
              (obj) => obj.category === "fracto_card"
            )}
            onClick={handleSelectedPay}
          />
          <PayCardWith
            method={"fracto_ach"}
            title={"Fracto ACH"}
            balance={balanceInfo?.balance?.fracto_ach}
            desc="Available Balance"
            image={fracto}
            fee={balanceInfo?.fees.find((obj) => obj.category === "fracto_ach")}
            onClick={handleSelectedPay}
          />
          <PayCardWith
            method={"cashfree"}
            title={"UPI/Card/NetBanking"}
            balance={balanceInfo?.balance?.cashfree}
            desc="Available Balance"
            image={cashfree}
            fee={balanceInfo?.fees.find((obj) => obj.category === "cashfree")}
            onClick={handleSelectedPay}
          />
          <PayCardWith
            method={"ippo"}
            title={"UPI"}
            balance={balanceInfo?.balance?.ippopay}
            desc="Available Balance"
            image={upi}
            fee={balanceInfo?.fees.find((obj) => obj.category === "ippopay")}
            onClick={handleSelectedPay}
          />

          <PayCardWith
            method={"trade"}
            title={"Trade"}
            balance={balanceInfo?.balance?.trade}
            desc="Available Balance"
            image={trade}
            fee={balanceInfo?.fees}
            onClick={handleSelectedPay}
          />
          <PayCardWith
            method={"inapp_purchase"}
            title={"In-App Purchase"}
            balance={balanceInfo?.balance?.inapp_purchase}
            desc="Available Balance"
            image={inApp1}
            fee={balanceInfo?.fees}
            onClick={handleSelectedPay}
          />
        </>
      ) : (
        <>
          <PlayWallet
            upiListUser={upiUsers}
            cryptoList={crypto}
            withdrawFund={withdraw}
            setWithdrawFund={WithdrawFund}
            networkList={network}
            balanceInfo={balanceInfo}
            handleWithdrawProcess={handleWithdraw}
            data={playWalletInfo}
          />
        </>
      )}
    </>
  );
};

export default PaymentMethodListWithdraw;

const PayCardWith = ({
  method,
  title,
  fee,
  desc,
  image,
  balance,
  onClick,
  disabled = false,
}) => {
  const { user } = useSelector((state) => state.user.data);

  return (
    <div className="col-md-6">
      <div
        className="pay-list-card d-flex justify-content-center align-items-center"
        role="button"
        // style={disabled ? { backgroundColor: "#f2f2f2" } : {}}
        style={
          disabled || (balance !== 0 && balance !== undefined)
            ? { backgroundColor: "#F2F2F2" }
            : { opacity: "0.4", pointerEvents: "none" }
        }
        onClick={() => {
          !disabled &&
            balance !== 0 &&
            balance !== undefined &&
            onClick(method, balance, fee);
        }}
      >
        <div className="paymentCard">
          {/* <img src={image} alt={title} /> */}
          <img src={image} />
          <div className="pay-list-title mt-4">{title}</div>
        </div>
        {/* <div className="icon-block">
          <img src={image} alt={title} />
        </div>
        <div className="first">
          <div className="pay-list-title">{title}</div>
          <div className="pay-list-desc">{desc}</div>
          <div className="pay-list-balance">
            {balance !== null && balance !== undefined
              ? currencyFormat(balance, user.currency_name)
              : "Fetching balance..."}
          </div>
        </div>
        <div style={{ width: "70px", textAlign: "right" }}>
          {!disabled ? <FiArrowRight size={30} /> : "Currently Disabled"}
        </div> */}
      </div>
    </div>
  );
};
