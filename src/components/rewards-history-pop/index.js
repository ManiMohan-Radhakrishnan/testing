import { useEffect, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { useSelector } from "react-redux";

import { getUserRewardBalanceList } from "../../api/methods";
import { currencyFormat } from "../../utils/common";
import FormattedNumber from "../FormattedNumber";

import "./style.scss";

const RewardsHistoryPop = ({ rewardsHistoryPop, setRewardsHistoryPop }) => {
  const { user } = useSelector((state) => state.user.data);
  const [loading, setLoading] = useState(true);
  const [redeemedRewards, setRedeemedRewards] = useState([]);

  useEffect(() => {
    getRewardsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getRewardsList = async () => {
    try {
      const result = await getUserRewardBalanceList();
      const { user_rewards = [] } = result?.data?.data;
      const redeemed_rewards = user_rewards.filter(
        (reward) => reward?.is_redeemed || reward?.is_expired
      );
      setRedeemedRewards(redeemed_rewards);
    } catch (error) {
      console.log("Error in fetching rewards history", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="ut-coin-container">
        <Offcanvas
          show={rewardsHistoryPop}
          onHide={() => setRewardsHistoryPop(!rewardsHistoryPop)}
          placement="end"
          className="popup-wrapper-canvas-utcoin"
          backdrop={true}
        >
          <Offcanvas.Body className="p-0 pop-body-containers">
            <div className="pop-nft-details">
              <div className="pop-head-content">
                <div className="pop-bid-title">Rewards History</div>
                <div
                  className="close-button-pop"
                  onClick={() => setRewardsHistoryPop(!rewardsHistoryPop)}
                >
                  <img
                    alt="close"
                    src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e"
                  ></img>
                </div>
              </div>
              <div className={`pop-bid-progress`}>
                <div className="progress-complete"></div>
              </div>
              <div className="pop-body-content">
                <div className="activity-log p-5">
                  <div className="card text-center">
                    <div className="card-body">
                      <h5 className="card-title">Rewards Balance</h5>
                      <p className="wallet-num d-flex gap-2 justify-content-center w-100">
                        <FormattedNumber
                          value={user?.assert_balances?.reward_point}
                          prefix=""
                          blankPlaceholder="0"
                          hasDescription
                          description=""
                        />
                        <span className="d-flex fs-6">
                          (
                          <FormattedNumber
                            value={user?.assert_balances?.reward_point}
                            prefix="$"
                            blankPlaceholder="$0.00"
                            hasDescription
                          />
                          )
                        </span>
                      </p>
                    </div>
                  </div>
                  {!loading ? (
                    <>
                      {redeemedRewards.length > 0 ? (
                        <div className="logLists mt-5">
                          {redeemedRewards.map((reward) => (
                            <RewardHistoryCard reward={reward} />
                          ))}
                        </div>
                      ) : (
                        <span className="no-record-found">
                          No Rewards History Exists
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="no-record-found">
                      Loading Rewards History...
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </>
  );
};

const RewardHistoryCard = ({ reward = {} }) => {
  let { is_redeemed, is_expired, code = "", description = "", qty } = reward;
  let status_message = is_redeemed ? "Redeemed" : is_expired ? "Expired" : "";

  return (
    <div className="d-flex single-log-lists">
      <div className="flex-grow-1 py-4">
        {code && <h1>{code}</h1>}
        {description && <p>{description}</p>}
        {status_message && (
          <p className={is_redeemed ? "redeemed" : ""}>{status_message}</p>
        )}
      </div>
      <div className="p-3">
        <p className={is_redeemed ? "reward-value-pos" : "reward-value"}>
          {/* {`${is_redeemed ? "+" : ""}${qty}`} */}
          {qty - parseInt(qty) === 0.0 ? parseInt(qty) : qty}
        </p>
      </div>
    </div>
  );
};

export default RewardsHistoryPop;
