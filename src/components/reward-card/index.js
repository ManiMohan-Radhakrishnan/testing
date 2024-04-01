import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
// import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { toast } from "react-toastify";
import { currencyFormat } from "../../utils/common";
import {
  fetchPaymentHistory,
  getUserRewardBalance,
  moveRedeem,
  getServerTimeApi,
} from "../../api/methods";
import NFTCounter from "../nft-counter";
import "react-circular-progressbar/dist/styles.css";
import "./style.scss";
import { getCookies } from "../../utils/cookies";
import { user_load_by_token_thunk } from "../../redux/thunk/user_thunk";
import tesla from "../../images/jump-trade/eth1.png";

const RewardCard = ({
  reward,
  userRewardBalanceList,
  handleEndTimer,
  currentTime,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const showCounter =
    !reward?.is_redeemed && reward?.expire_at && !reward?.is_expired;

  const handleRedeem = async () => {
    try {
      setLoading(true);
      const result = await moveRedeem(reward?.slug);
      if (result.data.success) {
        // getUserReward();
        userRewardBalanceList();
        // getTransactionHistory(1);
        const token = getCookies();
        if (token) dispatch(user_load_by_token_thunk(token));

        toast.success(
          "Your Reward Balance Has Been Successfully Added To Your Available Funds"
        );
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // const getUserReward = async () => {
  //   try {
  //     const result = await getUserRewardBalance();
  //   } catch (error) {
  //     console.log(
  //       "🚀 ~ file: wallet.js ~ line 84 ~ getUserRewardBalance ~ error",
  //       error
  //     );
  //   }
  // };

  // const getTransactionHistory = async (page, _filter = "") => {
  //   try {
  //     setLoading(true);
  //     const result = await fetchPaymentHistory(page, _filter);
  //     setLoading(false);
  //   } catch (err) {
  //     setLoading(false);
  //     console.log(
  //       "🚀 ~ file: wallet.js ~ line 28 ~ getTransactionHistory ~ err",
  //       err
  //     );
  //   }
  // };
  return (
    <>
      <article className="item-box">
        <div className="content-block">
          <div className="progress-block">
            {reward?.assert_type === "nft" ? (
              <>
                <img src={reward?.image} alt="Reward" />
              </>
            ) : (
              <>
                <img src={tesla} alt="Reward-Box" />
              </>
            )}
          </div>
          <div className="content-box">
            <div className="content-box-contents">
              <h5>{reward?.code}</h5>
            </div>
            {/* {reward?.description && <p>{reward?.description}</p>} */}
            <div className="content-box-footer">
              {showCounter && (
                <div className="timer-block">
                  <h6 className="mb-2">Expires in</h6>
                  <NFTCounter
                    timeClass="expire-time"
                    intervalClass="expire-interval"
                    invervalGapClass="expire-interval-space"
                    cTime={currentTime}
                    time={reward?.expire_at}
                    handleEndEvent={handleEndTimer}
                  />
                </div>
              )}
              {reward?.assert_type === "nft" ? (
                <>
                  <div className="btn-block">
                    <button
                      className="filled-btn mb-1"
                      disabled={
                        reward?.is_redeemed || reward?.achieved < reward?.target
                      }
                      onClick={handleRedeem}
                    >
                      {reward?.is_redeemed
                        ? "Redeemed"
                        : loading
                        ? "Loading..."
                        : "Redeem"}{" "}
                      1 NFT
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="btn-block">
                    {" "}
                    <button
                      className="filled-btn mb-1"
                      disabled={
                        reward?.is_redeemed ||
                        reward?.achieved < reward?.target ||
                        reward?.is_expired
                      }
                      onClick={handleRedeem}
                    >
                      {/* {reward?.is_redeemed
                      ? "Redeemed"
                      : loading
                      ? "Loading..."
                      : reward?.is_expired
                      ? "Expired"
                      : "Redeem"}{" "} */}
                      {`Redeem ${currencyFormat(reward?.value, "USD")}`}
                      {/* {!reward?.is_expired && currencyFormat(reward?.balance, "USD")} */}
                    </button>
                    {reward?.assert_type === "nft" ? (
                      <>
                        <h1 className="price1">1 NFT</h1>
                      </>
                    ) : (
                      // <h1 className="price1">{currencyFormat(reward?.qty)}</h1>
                      <h1 className="price1">
                        {reward?.qty} {reward?.name?.toString().toUpperCase()}
                      </h1>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* {reward?.assert_type === 'nft' ? (
          <>
            <div className="">
              <h1 className="price1">1 NFT</h1>
            </div>
          </>
        ) : (
          <>
            <div className="">
              <h1 className="price1">
                {reward?.name} {reward?.qty}
              </h1>
            </div>
          </>
        )} */}
      </article>
    </>
  );
};

export default RewardCard;
