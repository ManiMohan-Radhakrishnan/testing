import { useSelector } from "react-redux";
import { HiExternalLink } from "react-icons/hi";

import { userBalanceDetailFormat } from "../../../utils/common";
import { getUserBalanceInfo } from "../../../redux/reducers/user_reducer";

import dogeCoin from "../../../images/dogecoin.png";
import { useHistory } from "react-router";

const GlWalletCard = () => {
  const history = useHistory();

  const user = useSelector((state) => state.user);

  const balances = useSelector(getUserBalanceInfo);
  const zeroBalancePlaceHolder = `- -`;

  const locked_fiat_balance = user?.data?.user?.locked;

  const jt_balance = user?.data?.user?.jump_points_balance;

  const locked_jt_balance = user?.data?.user?.jump_points_locked;

  const locked_doge_balance = user?.data?.user?.doge_locked;

  const reward_balance_locked = user?.data?.user?.reward_point_locked || 0;

  const total_balance = Number(balances.usd) + Number(locked_fiat_balance);

  const total_jt = Number(balances.jump_point) + Number(locked_jt_balance);

  const total_doge = Number(balances.doge) + Number(locked_doge_balance);

  const total_rewards =
    Number(balances.reward_point) + Number(reward_balance_locked);

  const fiat_balance =
    total_balance > 0
      ? `$${userBalanceDetailFormat(total_balance)}`
      : zeroBalancePlaceHolder;
  const jump_point_balance =
    total_jt > 0
      ? `${userBalanceDetailFormat(total_jt)} JT`
      : zeroBalancePlaceHolder;
  const doge_balance =
    total_doge > 0 ? (
      <>
        {`${userBalanceDetailFormat(total_doge)}`}
        <img className="points-icon" src={dogeCoin} />
      </>
    ) : (
      zeroBalancePlaceHolder
    );
  const reward_point_balance =
    total_rewards > 0
      ? `$${userBalanceDetailFormat(total_rewards)}`
      : zeroBalancePlaceHolder;

  return (
    <article className="grid-card">
      <div className="card-box wallet-card">
        <div className="card-header">
          <h4>GuardianLink Wallet </h4>
          <a onClick={() => history.push("/accounts/wallet")}>
            View More <HiExternalLink />
          </a>
        </div>
        <div className="card-body">
          <ul className="wallet-grid-container">
            <li>
              <h6>Fiat Balance</h6>
              <h2>{fiat_balance}</h2>
            </li>
            <li>
              <h6>JT Points Balance</h6>
              <h2>{jump_point_balance}</h2>
            </li>
            <li>
              <h6>DOGE Balance</h6>
              <h2>{doge_balance}</h2>
            </li>
            <li>
              <h6>Cash Rewards</h6>
              <h2>{reward_point_balance}</h2>
            </li>
          </ul>
        </div>
      </div>
    </article>
  );
};

export default GlWalletCard;
