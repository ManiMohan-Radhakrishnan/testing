import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";

import {
  addUserAccountCoupon,
  getUserCashbackBalanceList,
  getUserRewardBalanceList,
} from "../../api/methods";

import RewardCard from "../reward-card";
import couponImg from "../../images/jump-trade/coupon.png";
import InputText from "../input-text";
import RewardCardOld from "../reward-card-old";

const RewardWallet = () => {
  const key = "reward";
  const [coupon, setCoupon] = useState("");
  const [error, setError] = useState("");
  const [rewardBalanceList, setRewardBalanceList] = useState([]);
  const [cashbackBalanceList, setCashbackBalanceList] = useState([]);
  const [totalRewards, setTotalRewards] = useState(0);
  const [unClaimedCash, setUnClaimedCash] = useState(0);
  const [unClaimedReward, setUnClaimedReward] = useState(0);
  const [loading, setLoading] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponShow, setCouponShow] = useState(false);

  useEffect(() => {
    userCashbackBalanceList();
    userRewardBalanceList();
  }, []);

  const userRewardBalanceList = async () => {
    try {
      setLoading(true);
      const result = await getUserRewardBalanceList();
      setTotalRewards(result.data.data.total);
      setUnClaimedReward(result.data.data.unclaimed);
      setRewardBalanceList(result.data.data.user_rewards);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const userCashbackBalanceList = async () => {
    try {
      setLoading(true);
      const result = await getUserCashbackBalanceList();
      setTotalRewards(result.data.data.total);
      setUnClaimedCash(result.data.data.unclaimed);
      setCashbackBalanceList(result.data.data.user_rewards);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
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

  const handleEndTimer = () => userRewardBalanceList();

  return (
    <>
      <section className="reward-wallet-block-old">
        <div className="reward-block">
          <div className="reward-heading-box">
            <h3 className="title">Total Rewards</h3>
            <h1 className="price">
              ${totalRewards}
              {/* <span>0.000345 ETH </span> */}
            </h1>
          </div>
          {/* <div className="reward-button-box">
            <button
              className="outline-btn"
              // onClick={() => setCouponShow(!couponShow)}
            >
              Redeem
            </button>
          </div> */}
        </div>

        <div className="redeem-table-block">
          {key === "cashback" ? (
            cashbackBalanceList.length > 0 ? (
              cashbackBalanceList.map((reward, i) => (
                <RewardCardOld
                  reward={reward}
                  key={`cashback-${i}`}
                  rewardBalanceList={rewardBalanceList}
                  handleEndTimer={handleEndTimer}
                />
              ))
            ) : (
              <span className="no-record-found">No records found</span>
            )
          ) : rewardBalanceList.length > 0 ? (
            rewardBalanceList.map((reward, i) => (
              <RewardCardOld
                reward={reward}
                key={`reward-${i}`}
                userRewardBalanceList={userRewardBalanceList}
                handleEndTimer={handleEndTimer}
              />
            ))
          ) : (
            <span className="no-record-found">No records found</span>
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
        {/* <Modal.Header >
          <Modal.Title id="contained-modal-title-vcenter">
            Apply Coupon
          </Modal.Title>
        </Modal.Header> */}
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
