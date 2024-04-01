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

const RewardCardOld = ({ reward, userRewardBalanceList, handleEndTimer }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(false);

  useEffect(() => {
    getServerTime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getServerTime = async () => {
    try {
      const result = await getServerTimeApi();
      setTime(result.data.data.time);
    } catch (error) {
      console.log(
        "🚀 ~ file: reward-card.js ~ line 21 ~ getServerTime ~ error",
        error
      );
    }
  };

  const handleRedeem = async () => {
    try {
      setLoading(true);
      const result = await moveRedeem(reward?.slug);
      if (result.data.success) {
        getUserReward();
        userRewardBalanceList();
        getTransactionHistory(1);
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

  const getUserReward = async () => {
    try {
      const result = await getUserRewardBalance();
    } catch (error) {
      console.log(
        "🚀 ~ file: wallet.js ~ line 84 ~ getUserRewardBalance ~ error",
        error
      );
    }
  };

  const getTransactionHistory = async (page, _filter = "") => {
    try {
      setLoading(true);
      const result = await fetchPaymentHistory(page, _filter);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(
        "🚀 ~ file: wallet.js ~ line 28 ~ getTransactionHistory ~ err",
        err
      );
    }
  };
  return (
    <>
      <article className="item-box">
        <div className="content-block">
          <div className="progress-block">
            {reward?.assert_type === "nft" ? (
              <>
                <img
                  src={reward?.nft_image}
                  alt="Reward"
                  style={{
                    borderRadius: "50%",
                    width: "3rem",
                    height: "3rem",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />
              </>
            ) : (
              <>
                {/* <CircularProgressbar
                  value={reward?.achieved}
                  maxValue={reward?.target}
                  text={
                    reward?.achieved >= reward?.target
                      ? ''
                      : `${reward?.achieved}/${reward?.target}`
                  }
                  styles={buildStyles({
                    textColor: 'black',
                    pathColor: 'black',
                  })}
                />
                {reward?.achieved >= reward?.target && (
                  <span className="tickmark"></span>
                )} */}
                <img
                  src={tesla}
                  alt="Reward-Box"
                  style={{
                    borderRadius: "50%",
                    width: "3rem",
                    height: "3rem",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />
              </>
            )}
          </div>
          <div className="content-box">
            <h5>{reward?.code}</h5>

            {reward?.description && <p>{reward?.description}</p>}
          </div>
        </div>

        {reward?.assert_type === "nft" ? (
          <>
            <div className="btn-block">
              <button
                className="filled-btn"
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
              {!reward?.is_redeemed &&
                reward?.expire_at &&
                !reward?.is_expired && (
                  <p>
                    {" "}
                    Expires in
                    <NFTCounter
                      timeClass="expire-time"
                      intervalClass="expire-interval"
                      invervalGapClass="expire-interval-space"
                      time={reward?.expire_at}
                      handleEndEvent={handleEndTimer}
                    />
                  </p>
                )}
              <button
                className="filled-btn"
                disabled={
                  reward?.is_redeemed ||
                  reward?.achieved < reward?.target ||
                  reward?.is_expired
                }
                onClick={handleRedeem}
              >
                {reward?.is_redeemed
                  ? "Redeemed"
                  : loading
                  ? "Loading..."
                  : reward?.is_expired
                  ? "Expired"
                  : "Redeem"}{" "}
                {!reward?.is_expired && currencyFormat(reward?.balance, "USD")}
              </button>
              {reward?.assert_type === "nft" ? (
                <>
                  <h1 className="price1">1 NFT</h1>
                </>
              ) : (
                <>
                  <h1 className="price1">
                    {reward?.qty} {reward?.name?.toString().toUpperCase()}
                  </h1>
                </>
              )}
            </div>
          </>
        )}

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

export default RewardCardOld;
