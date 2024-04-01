// import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import { RampInstantSDK } from "@ramp-network/ramp-instant-sdk";
// import { currencyFormat } from "./../../utils/common";
// import { useSelector } from "react-redux";
// import { FiArrowLeft } from "react-icons/fi";
import "./style.scss";
// import { getRAMPAddress } from "../../api/methods";
// import { rampPurchaseCreate } from "./../../api/methods";

const RampPayment = ({
  setAddFund,
  addFund,
  getTransactionHistory,
  getDepositStat,
}) => {
  // const { user } = useSelector((state) => state.user.data);
  // const [loading, setLoading] = useState(false);
  // const [address, setAddress] = useState();
  // const [symbol, setSymbol] = useState();
  // useEffect(() => {
  //   getRAMPPaymentAddress();
  // }, []);
  // const getRAMPPaymentAddress = async () => {
  //   try {
  //     setLoading(true);
  //     const result = "";
  //     setLoading(false);
  //     setAddress(result.data.data.address);
  //     setSymbol(result.data.data.symbol);
  //   } catch (err) {
  //     setLoading(false);
  //     toast.error("An unexpected error occured. Please try again  later");
  //     console.log(
  //       "🚀 ~ file: index.js ~ line 24 ~ getRAMPPaymentAddress ~ err",
  //       err
  //     );
  //   }
  // };
  // const handlePay = () => {
  //   setLoading(true);
  //   setAddFund({ ...addFund, show: false });
  // getDepositStat();
  //   new RampInstantSDK({
  //     hostAppName: "Jump.Trade",
  //     webhookStatusUrl: `${process.env.REACT_APP_SERVER_URL}/payments/ramp/webhook`,
  //     hostApiKey: process.env.REACT_APP_RAMP_KEY,
  //     hostLogoUrl:
  //       "https://res.cloudinary.com/dba42nusi/image/upload/v1637927967/beyondlife/product_logo_o1gixr.png",
  //     swapAsset: [symbol],
  //     userAddress: address,
  //     variant: "auto",
  //   })
  //     // .on("*", (data) => {
  //     //   // console.log("🚀 ~ file: index.js ~ line 23 ~ .on ~ data", data);
  //     //   setLoading(false);
  //     // })
  //     .on("PURCHASE_CREATED", async (data) => {
  //       const info = data.payload;
  //       const decimal = 10 ** info.purchase.asset.decimals;
  //       const id = info.purchase.id;
  //       const amount = parseFloat(info.purchase.cryptoAmount) / decimal;
  //       try {
  //         await rampPurchaseCreate({
  //           ramp_payment_id: id,
  //           amount,
  //         });
  //         getTransactionHistory(1);
  //       } catch (error) {
  //         console.log("🚀 ~ file: index.js ~ line 68 ~ .on ~ error", error);
  //       }
  //       setLoading(false);
  //     })
  //     .show();
  // };
  // return (
  //   <>
  // <div className="inner-card-details">
  //     <div
  //       className="pay-list-back"
  //       role="button"
  //       onClick={() => setAddFund({ ...addFund, type: "" })}
  //     >
  //       <FiArrowLeft size={25} /> Back
  //     </div>
  //     <div className="bg-white mt-3 p-3 current-balance">
  //       <div className="cb-title">Current Balance</div>
  //       <div>
  //         <div className="cb-balance">
  //           {currencyFormat(user.balance, user.currency_name)}
  //         </div>
  //       </div>
  //     </div>
  //     {address ? (
  //       <button
  //         type="button"
  //         className="btn btn-dark w-100 rounded-pill btn-af-pay mt-5"
  //         onClick={handlePay}
  //         disabled={loading}
  //       >
  //         {loading ? "Please wait..." : "Proceed with Deposit"}
  //       </button>
  //     ) : (
  //       <button
  //         type="button"
  //         className="btn btn-dark w-100 rounded-pill btn-af-pay mt-5"
  //         disabled={true}
  //       >
  //         Please wait...
  //       </button>
  //     )}
  //     <div className="mt-4 mb-4 p-3 rounded-3 border ">
  //       <p className="card-info">
  //         <ol>
  //           <li>
  //             RAMP converts your Fiat payments into its equivalent USDT at
  //             real-time exchange rates. USDT is the ONLY ACCEPTABLE mode of
  //             payment.
  //           </li>
  //           <li>
  //             DO NOT change the wallet address under any circumstances. Please
  //             be informed that the payments made through RAMP are irreversible,
  //             and we do not hold responsibilty for payments made to wrong wallet
  //             addresses.
  //           </li>
  //           <li>
  //             The amount deposited through RAMP is withdrawable ONLY as crypto
  //             money and ONLY in USDT.
  //           </li>
  //           <li>
  //             Your financial institution or payment instrument might have
  //             limits/restrictions on your transaction amount. Please check
  //             before transacting.
  //           </li>
  //           <li>
  //             Please ensure to have international transactions enabled on your
  //             payment instrument.
  //           </li>
  //         </ol>
  //       </p>
  //     </div>
  // </div>
  //   </>
  // );
};

export default RampPayment;
