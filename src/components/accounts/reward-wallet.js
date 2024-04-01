import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";

import {
  addUserAccountCoupon,
  getServerTimeApi,
  getUserCashbackBalanceList,
  getUserRewardBalance,
} from "../../api/methods";

import RewardCard from "../reward-card";
import InputText from "../input-text";

import couponImg from "../../images/jump-trade/coupon.png";

const RewardWallet = ({ setRewardsHistoryPop, setTotalRewardsAmount }) => {
  const key = "reward";
  const [coupon, setCoupon] = useState("");
  const [error, setError] = useState("");
  const [rewardBalanceList, setRewardBalanceList] = useState([]);
  const [cashbackBalanceList, setCashbackBalanceList] = useState([]);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponShow, setCouponShow] = useState(false);
  const [time, setTime] = useState(false);

  useEffect(() => {
    userCashbackBalanceList();
    userRewardBalanceList();
    getServerTime();
  }, []);

  const getServerTime = async () => {
    try {
      const result = await getServerTimeApi();
      setTime(result.data.data.time);
    } catch (error) {
      console.log("Error in fetching server time", error);
    }
  };

  const userRewardBalanceList = async () => {
    try {
      const result = await getUserRewardBalance();
      setTotalRewardsAmount(result.data.data.total);
      setRewardBalanceList(result.data.data.user_rewards);
    } catch (error) {
      console.log(error);
    }
  };

  const userCashbackBalanceList = async () => {
    try {
      const result = await getUserCashbackBalanceList();
      setCashbackBalanceList(result.data.data.user_rewards);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCouponSubmit = async () => {
    try {
      setCouponLoading(true);
      setError("");
      const result = await addUserAccountCoupon(coupon);
      setCouponLoading(false);
      setCouponShow(false);
      setCoupon("");
      toast.success("Coupon code applied successfully");
    } catch (error) {
      console.log(error);
      setCouponLoading(false);
      if (error.data.status === 406) {
        setError("Please enter valid coupon code");
      }
    }
  };

  const handleEndTimer = () => setTimeout(userRewardBalanceList, 4000);
  const toggleRewardsHistory = () => setRewardsHistoryPop((x) => !x);

  return (
    <>
      <section className="reward-wallet-block ">
        {rewardBalanceList.length > 0 ? (
          <div className="w-100 d-flex justify-content-between align-items-center mb-3 px-2">
            <h4 className="m-0 fs-5 text-black">Unclaimed Rewards</h4>
            <button
              className="dark-filled-btn mb-1"
              onClick={toggleRewardsHistory}
            >
              Rewards History
            </button>
          </div>
        ) : (
          <></>
        )}
        <div className="redeem-table-block">
          {key === "cashback" ? (
            cashbackBalanceList.length > 0 ? (
              cashbackBalanceList.map((reward, i) => (
                <RewardCard
                  reward={reward}
                  key={`cashback-${i}`}
                  rewardBalanceList={rewardBalanceList}
                  handleEndTimer={handleEndTimer}
                  currentTime={time}
                />
              ))
            ) : (
              <span className="no-record-found">No records found</span>
            )
          ) : rewardBalanceList.length > 0 ? (
            rewardBalanceList.map((reward, i) => (
              <RewardCard
                reward={reward}
                key={reward?.slug || `reward-${i}`}
                userRewardBalanceList={userRewardBalanceList}
                handleEndTimer={handleEndTimer}
                currentTime={time}
              />
            ))
          ) : (
            <>
              <span className="no-record-found">No Unclaimed Rewards</span>
              <button
                className="dark-filled-btn mb-1"
                onClick={toggleRewardsHistory}
              >
                Rewards History
              </button>
            </>
          )}
        </div>
      </section>

      <Modal
        show={couponShow}
        onHide={() => setCouponShow(!couponShow)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="couponPopup"
      >
        <Modal.Body closeButton>
          <div className="img-block">
            <img
              src={couponImg}
              className="img-thumbnail coupon-image"
              alt={"coupon image"}
            />
            <div className="coupon-modal-content">
              <h4 className="">Activate Reward</h4>
              <p className="">
                Apply coupon and activate reward get $10 on buying 5 NFT from
                Jump.trade
              </p>
              <div className="input-block">
                <InputText
                  placeholder="Enter coupon code"
                  name="coupon"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                />
                {error && <p className="text-danger">{error}</p>}
              </div>

              <div className="btn-block">
                <button
                  className="filled-btn"
                  onClick={handleCouponSubmit}
                  disabled={!coupon}
                >
                  {couponLoading ? "Loading..." : "Activate"}
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default RewardWallet;
