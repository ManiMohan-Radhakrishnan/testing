import React from "react";
import { FiArrowRight } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import usdt from "../../images/usdt.svg";
import stripe from "../../images/stripe.svg";
import upi from "../../images/upi.svg";
import ramp from "../../images/ramp.svg";
import cashfree from "../../images/cashfree.svg";
import fracto from "../../images/fracto.svg";
import ach from "../../images/bank-transfer.svg";
import transak from "../../images/transak.svg";
import bitbns from "../../images/bitbns.svg";
import bitbnsNew from "../../images/bitbnsnew.svg";
import onmeta from "../../images/onmeta.png";
import Onramp from "../../images/onramp-zero-fee.png";

import "./style.scss";

const PaymentMethodList = ({ handleSelectedPay }) => {
  const { user } = useSelector((state) => state.user.data);

  const fractoEnabledCountries = ["UK", "US", "IN", "PK", "BA", "SL"];

  const list = fractoEnabledCountries.includes(user?.kyc_country_code);

  return (
    <>
      <PayCard
        method={"crypto"}
        title={" Crypto (USDT/USDC)"}
        desc={
          "Preferred Currency - USDT | 24*7 Available | No Limits In Transaction Amount"
        }
        image={usdt}
        onClick={handleSelectedPay}
      />
      <PayCard
        method={"upi"}
        title={" UPI Payment"}
        desc={"UPI Payment | 24*7 Available | No Limits In Transaction Amount"}
        image={upi}
        onClick={handleSelectedPay}
      />
      <PayCard
        method={"onmeta"}
        title={"UPI to Crypto"}
        desc={"24*7 Available | Limits* In Transaction Subject To Bank Rules"}
        image={onmeta}
        onClick={handleSelectedPay}
      />
      <PayCard
        method={"bitbns"}
        title={"UPI to Crypto"}
        desc={"24*7 Available | Limits* In Transaction Subject To Bank Rules"}
        image={Onramp}
        onClick={handleSelectedPay}
      />
      {/* <PayCard
        method={"fracto_crypto"}
        title={" Crypto"}
        desc={
          "Support Popular Cryptocurrencies | 24*7 Available | No Limits In Transaction Amount"
        }
        image={fracto}
        onClick={handleSelectedPay}
      /> */}
      {/* <PayCard
        method={"ramp"}
        title={" RAMP"}
        desc={
          "24*7 Available | No Limits* In Transaction Amount | Safe and Secure"
        }
        image={ramp}
        onClick={handleSelectedPay}
      /> */}
      {fractoEnabledCountries.includes(user?.kyc_country_code) && (
        <PayCard
          method={"fracto"}
          title={" Credit/Debit Card"}
          desc={
            "24*7 Available | Limits* In Transaction Amount | Safe and Secure"
          }
          image={fracto}
          onClick={user.kyc_status !== "success" ? () => {} : handleSelectedPay}
          // onClick={handleSelectedPay}
          kyc={user.kyc_status !== "success"}
          // disabled={!list}
          disabled={true}
          countryCode={user?.kyc_country_code}
        />
      )}

      <PayCard
        method={"ach"}
        title={" ACH Transfer"}
        desc={
          "24*7 Available | Limits* In Transaction Amount | Safe and Secure"
        }
        image={fracto}
        onClick={handleSelectedPay}
      />
      {/* <PayCard
        method={"stripe"}
        title={" Stripe"}
        desc={"24*7 Available | Limits* In Transaction Subject To Bank Rules"}
        image={stripe}
        onClick={handleSelectedPay}
      /> */}
      {/* <PayCard
        method={"cashfree"}
        title={" UPI/Card/NetBanking"}
        desc={"24*7 Available | Limits* In Transaction Subject To Bank Rules"}
        image={cashfree}
        onClick={handleSelectedPay}
      /> */}
      <PayCard
        method={"transak"}
        title={"Fiat On-Ramp"}
        desc={"24*7 Available | Limits* In Transaction Subject To Bank Rules"}
        image={transak}
        onClick={handleSelectedPay}
      />
      {/* <PayCard
        method={"ippo"}
        title={"UPI"}
        desc={"24*7 Available | Limits* In Transaction Subject To Bank Rules"}
        image={upi}
        onClick={handleSelectedPay}
        disabled
      /> */}
    </>
  );
};

export default PaymentMethodList;

const PayCard = ({
  method,
  title,
  desc,
  image,
  success,
  onClick,
  disabled = false,
  kyc = false,
  countryCode = "",
}) => {
  const history = useHistory();
  const FractoCardEnabledCountries = ["US", "UK", "IN ", "PK", "BA", "SL"];

  return (
    <div className={`col-md-6 ${kyc && "position-relative"}`}>
      <div
        className={`pay-list-card text-center ${kyc && "fade-light"} 
        ${disabled && "disabled-method"}
        `}
        style={disabled ? { backgroundColor: "#f2f2f2" } : {}}
        role="button"
        onClick={() => !disabled && onClick(method)}
      >
        <div className="paymentCard">
          {/* <img src={image} alt={title} /> */}
          <img src={image} />
          <div className="pay-list-title mt-4">{title}</div>
        </div>

        {/* <div className="icon-block">
        <img src={image} alt={title} />
      </div> */}

        {/* {!kyc && (
        <div style={{ width: "50px", textAlign: "right" }}>
          {!disabled ? <FiArrowRight size={30} /> : "Coming soon"}
        </div>
      )} */}
        {/* {!kyc && ( */}
        <div className="disabled-color">{!disabled ? "" : "(Disabled)"}</div>
        {/* )} */}
      </div>
      <div className="first kyc-wrzpper">
        {/* <div className="pay-list-title">{title}</div>
        <div className="pay-list-desc">{desc}</div> */}

        {FractoCardEnabledCountries?.toString().includes(countryCode) && (
          <>
            {kyc && (
              <small
                className="text-danger kyc-text"
                onClick={() =>
                  history.push("/accounts/profile?wayToCome=fracto")
                }
              >
                Complete your user verification
              </small>
            )}
          </>
        )}
      </div>
    </div>
  );
};
