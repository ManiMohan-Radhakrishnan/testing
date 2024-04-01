import { useSelector } from "react-redux";
import utCoin from "../../../images/coin.png";
import dogeCoin from "../../../images/dogecoin.png";
import RewardWallet from "../reward-wallet";
import WalletDashboardChart from "../wallet-dashboard-chart/WalletDashboard";
import WalletJTDashboardChart from "../wallet-dashboard-chart/WalletJTDashboard";

import "./wallet.scss";
import { currencyFormat } from "../../../utils/common";
import tesla from "../../../images/jump-trade/eth1.png";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useState } from "react";
import FormattedNumber from "../../FormattedNumber";

const WalletDashboard = ({
  handleDeposit,
  setRewardsPop,
  setRewardsHistoryPop,
  setUtCoinRewardsPop,
  setDogeCoinRewardsPop,
  rewardsPop,
  UtCoinRewardsPop,
  dogeCoinRewardsPop,
  getSummary,
}) => {
  const user = useSelector((state) => state.user);
  const [totalRewardsAmount, setTotalRewardsAmount] = useState(0);

  const fiat_balance = user?.data?.user?.balance;
  const locked_fiat_balance = user?.data?.user?.locked;

  const jt_balance = user?.data?.user?.jump_points_balance;
  const locked_jt_balance = user?.data?.user?.jump_points_locked;

  const doge_balance = user?.data?.user?.doge_balance;
  const locked_doge_balance = user?.data?.user?.doge_locked;

  const reward_balance = user?.data?.user?.assert_balances?.reward_point || 0;
  const reward_balance_locked = user?.data?.user?.reward_point_locked || 0;

  let AvailableFunds = {
    total_amount: parseFloat(fiat_balance) + parseFloat(locked_fiat_balance),
    labels: ["Available Funds", "Funds on Hold"],
    chartColors: ["#A3DF5D", "#5E951D"],
    data: [fiat_balance, locked_fiat_balance],
  };

  let AvailableJTFunds = {
    total_amount: parseFloat(jt_balance) + parseFloat(locked_jt_balance),
    labels: ["JT Points", "JT on Hold"],
    chartColors: ["#EFBF6C", "#A2782E"],
    data: [jt_balance, locked_jt_balance],
  };

  return (
    <>
      <section className="wallet-grid-container">
        <article className="wallet-grid-availfund">
          <div className="wallet-grid-header">
            <h4>Fiat Balance</h4>
          </div>
          <div className="wallet-grid-body">
            <div className="wallet-grid-chart-box">
              <WalletDashboardChart
                ChartData={AvailableFunds}
                handleDeposit={handleDeposit}
              />
            </div>
            <div className="wallet-info-list">
              <ul className="gl_fund">
                <li>
                  <div className="wallet-info-box avail_fund">
                    <h6>Available Funds</h6>
                    <FormattedNumber
                      value={fiat_balance}
                      prefix="$"
                      hasDescription
                    />
                  </div>
                </li>
                <li>
                  <div className="wallet-info-box hold_fund">
                    <h6>Funds on Hold</h6>
                    <FormattedNumber
                      value={locked_fiat_balance}
                      prefix="$"
                      hasDescription
                    />
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </article>
        <article className="wallet-grid-jtfund">
          <div className="wallet-grid-header">
            <h4>
              JT Points Balance{" "}
              <span
                className="logbtn"
                onClick={() => {
                  setUtCoinRewardsPop(!UtCoinRewardsPop);
                }}
              >
                Logs <MdKeyboardArrowRight />
              </span>
            </h4>
          </div>
          <div className="wallet-grid-body">
            <div className="wallet-grid-chart-box jtpoint-chart-box">
              {" "}
              <WalletJTDashboardChart ChartData={AvailableJTFunds} />
            </div>
            <div className="wallet-info-list">
              <ul className="jt_fund">
                <li>
                  <div className="wallet-info-box avail_fund">
                    <h6>Available JT Points</h6>
                    <FormattedNumber
                      value={jt_balance}
                      suffix={" JT"}
                      icon={<img className="points-icon" src={utCoin} />}
                      hasDescription
                    />
                  </div>
                </li>
                <li>
                  <div className="wallet-info-box hold_fund">
                    <h6>JT Points on Hold</h6>
                    <FormattedNumber
                      value={locked_jt_balance}
                      suffix={" JT"}
                      icon={<img className="points-icon" src={utCoin} />}
                      hasDescription
                    />
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </article>
        <article className="wallet-grid-doge">
          <div className="wallet-grid-header">
            <h4>
              DOGE Balance
              <span
                className="logbtn"
                onClick={() => setDogeCoinRewardsPop(!dogeCoinRewardsPop)}
              >
                Logs <MdKeyboardArrowRight />
              </span>
            </h4>
          </div>
          <div className="wallet-grid-body"></div>
          <div className="wallet-info-list">
            <ul className="doge_fund">
              <li>
                <div className="wallet-info-box">
                  <h6>Available DOGE</h6>
                  {doge_balance > 0 ? (
                    <h4>
                      {doge_balance}{" "}
                      <img className="points-icon" src={dogeCoin} />
                    </h4>
                  ) : (
                    <h4>--</h4>
                  )}
                </div>
              </li>
              <li>
                <div className="wallet-info-box">
                  <h6>DOGE on Hold</h6>
                  {locked_doge_balance > 0 ? (
                    <h4>
                      {locked_doge_balance}{" "}
                      <img className="points-icon" src={dogeCoin} />
                    </h4>
                  ) : (
                    <h4>--</h4>
                  )}
                </div>
              </li>
            </ul>
          </div>
        </article>
        <article className="wallet-grid-rewards">
          <div className="wallet-grid-header">
            <h4>
              Cash Rewards
              <span
                className="logbtn"
                onClick={() => setRewardsPop(!rewardsPop)}
              >
                Logs <MdKeyboardArrowRight />
              </span>
            </h4>
          </div>
          <div className="wallet-grid-body">
            <div className="reward-total-value">
              <img src={tesla} className="total-reward-img" />
              <div>
                <h3>
                  <span className="key-total">Total Value</span>
                  {/* <span className="value-total d-flex gap-1">
                  <FormattedNumber
                    value={reward_balance}
                    prefix=""
                    blankPlaceholder="0"
                  /> */}
                  <span className="d-flex fs-6">
                    <FormattedNumber
                      value={reward_balance}
                      prefix="($"
                      suffix=")"
                      blankPlaceholder="$0.00"
                      description={`($${reward_balance})`}
                      hasDescription
                    />
                    {/* </span> */}
                  </span>
                </h3>
              </div>
              <div className="p-4">
                <h3>
                  <span className="key-total">Rewards on Hold</span>
                  <span className="d-flex fs-6">
                    <FormattedNumber
                      value={reward_balance_locked}
                      prefix="($"
                      suffix=")"
                      blankPlaceholder="$0.00"
                      description={`($${reward_balance_locked})`}
                      hasDescription
                    />
                  </span>
                </h3>
              </div>
            </div>

            <div className="wallet-grid-reward-table">
              <RewardWallet
                setTotalRewardsAmount={setTotalRewardsAmount}
                setRewardsHistoryPop={setRewardsHistoryPop}
                setRewardsPop={setRewardsPop}
                rewardsPop={rewardsPop}
              />
            </div>
          </div>
        </article>
      </section>
    </>
  );
};

export default WalletDashboard;
