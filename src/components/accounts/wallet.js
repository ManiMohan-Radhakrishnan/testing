/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import {
  Alert,
  Modal,
  Dropdown,
  Popover,
  OverlayTrigger,
} from "react-bootstrap";
import { useLocation } from "react-router";
import { toast } from "react-toastify";
import { FaFilter } from "react-icons/fa";
import { BiRefresh } from "react-icons/bi";
import { BsInfoCircleFill } from "react-icons/bs";
import { useDispatch } from "react-redux";

import {
  fetchPaymentHistory,
  withdrawBalanceApi,
  withdrawRequestApi,
  withdrawCancelApi,
  fetchFractoAchStatusApi,
  getUserTreasureBalance,
  paymentStatusApi,
  getUserRewardBalance,
  moveTreasureBalance,
  moveRedeem,
  whitelistedUpiList,
  whitelistedCryptoList,
  getUserReferralSummary,
  offlinePaymentsCancel,
} from "./../../api/methods";
import { userActivityYieldsApi } from "../../api/methods-marketplace";
import { user_load_by_token_thunk } from "../../redux/thunk/user_thunk";
import { getCookies } from "../../utils/cookies";
import { useQuery } from "../../hooks/url-params";

import CardDetails from "./../card-details";
import CryptoDetails from "./../crypto-details";
import FractoCryptoDetails from "../fracto-crypto-details";
import AddFundWrapper from "./../add-fund-wrapper";
import IppoPayment from "./../ippo-payment";
import PaymentMethodList from "./../payment-method-list";
import ACHPayment from "./../ach-transfer";
import RampPayment from "./../ramp-payment";
import CardDetailsFracto from "./../card-details-fracto";
import CardDetailsWithdraw from "../card-details/withdraw";
import CryptoDetailsWithdraw from "../crypto-details/withdraw";
import FractoCryptoWithdraw from "../fracto-crypto-details/withdraw";
import ToolTip from "../tooltip/index";
import CashFreePayment from "../cashfree-payment/index";
import ACHWithdraw from "../ach-transfer/withdraw";
import IppoPaymentWithdraw from "../ippo-payment/withdraw";
import CashFreeWithdraw from "../cashfree-payment/withdraw";
import CardDetailsWithdrawFracto from "../card-details-fracto/withdraw";
import TradeWithdraw from "../trade-withdraw";
import PaymentMethodListWithdraw from "../payment-method-list/withdraw";

import {
  currencyFormat,
  EVENT_NAMES,
  invokeTrackEvent,
} from "../../utils/common";

import utCoin from "../../images/coin.png";
import dogeCoin from "../../images/dogecoin.png";

import { ReactComponent as DepositIcon } from "./../../images/deposit-icon.svg";
import { ReactComponent as WithdrawIcon } from "./../../images/withdraw-icon.svg";
import RewardWallet from "./reward-wallet-old";
import UtCoinRewards from "../utcoins-rewards";
import RewardsActivityPop from "../rewards-activity-pop";
import TransakPayment from "../transak-payment";
import BitbnsPayment from "../bit-bns";
import InAppWithdraw from "../in-app-withdraw";
import DogeCoinsRewards from "../dogecoins-rewards";
import WalletDashboard from "./wallet-dashboard/wallet-dashboard";
import RewardsHistoryPop from "../rewards-history-pop";
import OnmetaPayment from "../onmeta-payment";
import UpiPayment from "../upi-payment";

import "./style.scss";
import { useHistory } from "react-router-dom";

const Wallet = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const query = useQuery(location.search);
  const depositModal = query?.get("type");
  const [UtCoinRewardsPop, setUtCoinRewardsPop] = useState(
    query?.get("jtpopup") || false
  );
  const [dogeCoinRewardsPop, setDogeCoinRewardsPop] = useState(false);
  const [rewardsPop, setRewardsPop] = useState(false);
  const [rewardsHistoryPop, setRewardsHistoryPop] = useState(false);

  const [withDraw, setWithDraw] = useState(false);

  const [addFund, setAddFund] = useState({
    show: false,
    type: "",
  });

  const [tranType, setTranType] = useState("trans");

  const [withdrawFund, setWithdrawFund] = useState({
    show: false,
    type: "",
    balance: 0,
    fee: {},
  });

  const [showLocked, setShowLocked] = useState();

  const [showAlert, setShowAlert] = useState(false);
  const [rLoading, setRLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [tranList, setTranList] = useState();
  const [tranListy, setTranListy] = useState();
  const [withdrawBalanceList, setWithdrawBalanceList] = useState();
  const [historyList, setHistoryList] = useState([]);
  const [historyListy, setHistoryListy] = useState([]);

  const [loading, setLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);

  const [loadingy, setLoadingy] = useState(false);
  const [moreLoadingy, setMoreLoadingy] = useState(false);
  const [pageNoy, setPageNoy] = useState(1);

  const [treasureBalance, setTreasureBalance] = useState(0);
  const [rewardBalance, setRewardBalance] = useState(0);

  const [mLoading, setMLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [redeemconfirm, setRedeemConfirm] = useState(false);
  const [redeemLoading, setReedemLoading] = useState(false);

  const { user } = useSelector((state) => state.user.data);

  const [isFirstDeposit, setIsFirstDeposit] = useState(false);
  const [upiList, setUpiList] = useState([]);
  const [cryptoList, setCryptoList] = useState([]);
  const [networks, setNetworks] = useState([]);
  const [summary, setSummary] = useState();
  const [withDrawTitle, setWithDrawTitle] = useState("Gl_wallet");
  const callIt = query.get("callit");
  const IswithDraw = query.get("withdraw");
  const Isdeposit = query.get("deposit");
  const IsType = query.get("depositType");
  const Ispath = query.get("path");

  useEffect(() => {
    invokeTrackEvent(EVENT_NAMES?.GUARDIANLINK_WALLET_VIEWED, {
      "Fiat Balance":
        user?.balance >= 0
          ? parseFloat(user?.balance) + parseFloat(user?.locked)
          : null,
      "Available Funds": user?.balance >= 0 ? parseFloat(user?.balance) : null,
      "Funds on Hold": user?.locked >= 0 ? parseFloat(user?.locked) : null,
      "JT Points Balance":
        user?.jump_points_balance >= 0
          ? parseFloat(user?.jump_points_balance) +
            parseFloat(user?.jump_points_locked)
          : null,
      "Available JT Points":
        user?.jump_points_balance >= 0
          ? parseFloat(user?.jump_points_balance)
          : null,
      "JT Points on Hold":
        user?.jump_points_locked >= 0
          ? parseFloat(user?.jump_points_locked)
          : null,
      "Available DOGE":
        user?.doge_balance >= 0 ? parseFloat(user?.doge_balance) : null,
      "DOGE on Hold":
        user?.doge_locked >= 0 ? parseFloat(user?.doge_locked) : null,
      "Reward Value":
        user?.assert_balances?.reward_point >= 0
          ? parseFloat(user?.assert_balances?.reward_point)
          : null,
      "Reward Hold":
        user?.reward_point_locked >= 0
          ? parseFloat(user?.reward_point_locked)
          : null,
    });

    let depositType = query.get("depositType");
    checkUpiList();
    checkCryptoList();
    checkRewardSummary();
    getTransactionHistory(pageNo);
    getYieldHistory(pageNoy);
    // getUserTreasureFunds();
    getUserReward();
    if (location.hash === "#web") {
      setShowAlert(true);
    }
    depositType &&
      setAddFund({
        show: true,
        type: depositType,
      });
    callIt &&
      Isdeposit &&
      setAddFund({
        show: true,
        type: "",
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkUpiList = async () => {
    try {
      const result = await whitelistedUpiList();
      setUpiList(result?.data?.data?.payment_methods);
    } catch (error) {
      console.log(error);
    }
  };

  const checkCryptoList = async () => {
    try {
      const result = await whitelistedCryptoList();
      setCryptoList(result?.data?.data?.payment_methods);
      if (result?.data?.data?.hasOwnProperty("networks"));
      setNetworks(result?.data?.data?.networks);
    } catch (error) {
      console.log(error);
    }
  };

  const checkRewardSummary = async () => {
    try {
      const result = await getUserReferralSummary();
      setSummary(result?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserTreasureFunds = async () => {
    try {
      const result = await getUserTreasureBalance();
      setTreasureBalance(result.data.data.balance);
    } catch (error) {
      console.log(
        "🚀 ~ file: wallet.js ~ line 84 ~ getUserTreasureFunds ~ error",
        error
      );
    }
  };

  const getUserReward = async () => {
    try {
      const result = await getUserRewardBalance();
      setRewardBalance(result.data.data.user_rewards[0]);
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
      setTranList(result.data.data);
      if (page === 1) {
        setHistoryList([...result.data.data.nfts]);

        // XENA Marketing isFirstDeposit
        const successDeposits = result?.data?.data?.nfts?.filter(
          (x) => x.state === "Success"
        );
        if (successDeposits?.length === 0) setIsFirstDeposit(true);
        else setIsFirstDeposit(false);
      } else {
        setHistoryList([...historyList, ...result.data.data.nfts]);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(
        "🚀 ~ file: wallet.js ~ line 28 ~ getTransactionHistory ~ err",
        err
      );
    }
  };

  const getMoreTransactionHistory = async (page, _filter = "") => {
    try {
      setMoreLoading(true);
      const result = await fetchPaymentHistory(page, _filter);
      setTranList(result.data.data);
      setHistoryList([...historyList, ...result.data.data.nfts]);
      setMoreLoading(false);
    } catch (err) {
      setMoreLoading(false);
      console.log(
        "🚀 ~ file: wallet.js ~ line 28 ~ getTransactionHistory ~ err",
        err
      );
    }
  };

  const loadMore = () => {
    if (tranList.next_page) {
      getMoreTransactionHistory(pageNo + 1, filter);
      setPageNo(pageNo + 1);
    }
  };

  const getYieldHistory = async (page) => {
    try {
      setLoadingy(true);
      const result = await userActivityYieldsApi(page);
      setTranListy(result.data.data);
      if (page === 1) {
        setHistoryListy([...result.data.data.nfts]);
      } else {
        setHistoryListy([...historyList, ...result.data.data.nfts]);
      }
      setLoadingy(false);
    } catch (err) {
      setLoadingy(false);
      console.log(
        "🚀 ~ file: wallet.js ~ line 28 ~ getYieldHistory ~ err",
        err
      );
    }
  };

  const getMoreYieldHistory = async (page) => {
    try {
      setMoreLoadingy(true);
      const result = await userActivityYieldsApi(page);
      setTranListy(result.data.data);
      setHistoryListy([...historyList, ...result.data.data.nfts]);
      setMoreLoadingy(false);
    } catch (err) {
      setMoreLoadingy(false);
      console.log(
        "🚀 ~ file: wallet.js ~ line 28 ~ getTransactionHistory ~ err",
        err
      );
    }
  };

  const loadMoreYield = () => {
    if (tranListy.next_page) {
      getMoreYieldHistory(pageNoy + 1);
      setPageNo(pageNoy + 1);
    }
  };

  const getPayTitle = () => {
    if (addFund.type === "stripe") {
      return "with Stripe";
    } else if (addFund.type === "crypto") {
      return "with Crypto (only USDT/USDC)";
    } else if (addFund.type === "fracto") {
      return "with Credit Card";
    } else if (addFund.type === "ach") {
      return "with ACH Transfer";
    } else if (addFund.type === "ippo") {
      return "Pay with UPI";
    } else if (addFund.type === "cashfree") {
      return "Pay with Cashfree";
    } else if (addFund.type === "transak") {
      return "with Transak";
    } else if (addFund.type === "upi") {
      return "Pay with UPI Payment";
    } else {
      return "";
    }
  };

  const getWithdrawTitle = () => {
    if (withdrawFund.type === "stripe") {
      return "with Stripe";
    } else if (withdrawFund.type === "crypto") {
      return "with Crypto (Only USDT)";
    } else if (withdrawFund.type === "ippo") {
      return "with UPI";
    } else {
      return "";
    }
  };

  const getDepositStatus = () => {
    if (IsType === "category") {
      if (callIt === "y") {
        window.open(`https://${Ispath}/wallet`);
      }
    } else if (IsType === "events") {
      if (callIt === "y") {
        window.open(`${process.env.REACT_APP_CALLIT_BASE_URL}`);
      }
    }
  };

  const handleDepositAlert = () => {
    // if (callIt === "y") {
    //   setTimeout(() => {
    //     window.open(`${process.env.REACT_APP_CALLIT_BASE_URL}`);
    //   }, 2000);
    // }
    if (IsType === "category") {
      if (callIt === "y") {
        setTimeout(() => {
          window.open(`https://${Ispath}/wallet`);
        }, 2000);
      }
    } else if (IsType === "events") {
      if (callIt === "y") {
        setTimeout(() => {
          window.open(`${process.env.REACT_APP_CALLIT_BASE_URL}`);
        }, 2000);
      }
    }
  };

  const handleWithdrawProcess = async ({
    payment_slug,
    amount,
    payment_method,
    address,
    network,
    trade_withdraw_details = null,
    _setError,
    _setLoading,
    _setSuccess,
    wallet_type = "common",
  }) => {
    try {
      _setError(null);
      _setLoading(true);
      await withdrawRequestApi({
        payment_slug: payment_slug,
        payment_type: payment_method,
        amount: amount,
        address: address,
        network: network,
        trade_withdraw_details: trade_withdraw_details,
        wallet_type,
      });
      _setLoading(false);

      setPageNo(1);
      getTransactionHistory(1);
      getBalance();
      _setSuccess(true);
    } catch (err) {
      _setLoading(false);
      console.log("🚀 ~ file: withdraw.js ~ line 39 ~ handleSubmit ~ err", err);
      toast.error("An unexpected error occured. Please try again  later");
    }
  };

  const handleWithdraw = async () => {
    try {
      const result = await paymentStatusApi("withdraw");

      if (result.data.data.allow_withdraw) {
        getBalance();
      } else {
        const token = getCookies();
        if (token) dispatch(user_load_by_token_thunk(token));
        setShowLocked("withdraw");
      }
      setWithdrawFund({ ...withdrawFund, show: true, type: "" });
    } catch (error) {
      console.log(
        "🚀 ~ file: wallet.js ~ line 371 ~ handleDeposit ~ error",
        error
      );
    }
  };

  const getBalance = async () => {
    try {
      const result = await withdrawBalanceApi();
      setWithdrawBalanceList(result?.data?.data);
    } catch (error) {
      setWithdrawBalanceList("error");
      console.log(
        "🚀 ~ file: wallet.js ~ line 130 ~ handleWithdraw ~ error",
        error
      );
    }
  };

  const handleRefresh = async (txid) => {
    if (!rLoading) {
      try {
        setRLoading(true);
        const result = await fetchFractoAchStatusApi(txid);
        setRLoading(false);

        const info = [...historyList];
        const index = info.findIndex((xx) => xx.txid === txid);

        info[index] = { ...info[index], state: result.data.data.status };

        setHistoryList(info);
        toast.success("Status updated successfully");
      } catch (error) {
        setRLoading(false);

        console.log(
          "🚀 ~ file: wallet.js ~ line 197 ~ handleRefresh ~ error",
          error
        );
      }
    }
  };

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const loadingCancel = (input, slug) => {
    let info = [...historyList];
    const index = info.findIndex((obj) => obj.slug === slug);
    info[index] = { ...info[index], loading: input };
    setHistoryList(info);
  };

  const handleCancelWithdraw = async (slug) => {
    try {
      loadingCancel(true, slug);
      await withdrawCancelApi(slug);
      await sleep(1000);
      setPageNo(1);
      getTransactionHistory(1);
      loadingCancel(false, slug);

      toast.success("Cancellation of Withdrawal Successful");
    } catch (err) {
      loadingCancel(false, slug);

      console.log(
        "🚀 ~ file: wallet.js ~ line 178 ~ handleCancelWithdraw ~ err",
        err
      );
      toast.error("An unexpected error occured. Please try again  later");
    }
  };

  const handleOffLineCancelWithdraw = async (slug) => {
    try {
      loadingCancel(true, slug);
      await offlinePaymentsCancel(slug);
      await sleep(1000);
      setPageNo(1);
      getTransactionHistory(1);
      loadingCancel(false, slug);

      toast.success("Deposit request cancelled successfully.");
    } catch (err) {
      loadingCancel(false, slug);

      console.log(
        "🚀 ~ file: wallet.js ~ line 178 ~ handleOffLineCancelWithdraw ~ err",
        err
      );
      toast.error("An unexpected error occured. Please try again  later");
    }
  };

  const handleMoveBalance = async () => {
    setConfirm(false);
    try {
      setMLoading(true);

      const result = await moveTreasureBalance();
      console.log(
        "🚀 ~ file: wallet.js ~ line 281 ~ handleMoveBalance ~ result",
        result
      );
      getUserTreasureFunds();
      getTransactionHistory(1);

      toast.success("Treasure funds added to main balance successfully");
      setMLoading(false);
    } catch (error) {
      setMLoading(false);
      console.log(
        "🚀 ~ file: wallet.js ~ line 279 ~ handleMoveBalance ~ error",
        error
      );
    }
  };
  const handleReedem = async () => {
    try {
      setReedemLoading(true);
      const result = await moveRedeem(rewardBalance?.slug);
      getUserReward();
      getTransactionHistory(1);

      setReedemLoading(false);
      setRedeemConfirm(false);

      const token = getCookies();
      if (token) dispatch(user_load_by_token_thunk(token));

      toast.success(
        "Your Reward Balance Has Been Successfully Added To Your Available Funds"
      );
    } catch (error) {
      setReedemLoading(false);
      console.log(
        "🚀 ~ file: wallet.js ~ line 279 ~ moveRedeem ~ error",
        error
      );
    }
  };

  const FilterToggle = React.forwardRef(({ onClick }, ref) => (
    <div
      role="button"
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      <FaFilter role="button" color="white" size={20} />{" "}
      <span className="text-capitalize">
        {(() => {
          if (filter === "withdraws") {
            return "Withdrawals";
          } else if (filter === "deposits") {
            return "Deposits";
          } else {
            return "All";
          }
        })()}
      </span>
    </div>
  ));

  const handleFilterChange = (input) => {
    setFilter(input);
    setPageNo(1);
    getTransactionHistory(1, input);
  };

  const popover = (balance, kyc, locked = false, type) => (
    <Popover>
      <Popover.Body>
        <p className="password-terms mb-0">
          {(() => {
            if (kyc) {
              return "Please complete your user verification to proceed";
            } else if (balance) {
              return "Balance should be greater than $0.00";
            } else if (locked) {
              return type === "deposit"
                ? "Your deposits have been disabled as our systems detected an unusual activity on your account. "
                : "Your withdrawals have been disabled because of possible malicious activity on your account. ";
            }
          })()}

          {locked && (
            <a
              href={
                type === "deposit"
                  ? "https://help.jump.trade/en/support/solutions/articles/84000345961-why-am-i-not-able-to-make-deposits-to-my-wallet-"
                  : "https://help.jump.trade/en/support/solutions/articles/84000345963-why-is-withdrawal-of-funds-disabled-in-my-wallet-"
              }
            >
              Learn more.
            </a>
          )}
        </p>
      </Popover.Body>
    </Popover>
  );

  const handleDeposit = useCallback(async () => {
    try {
      const result = await paymentStatusApi("deposit");

      if (!result.data.data.allow_deposit) {
        const token = getCookies();
        if (token) dispatch(user_load_by_token_thunk(token));
        setShowLocked("deposit");
      }
      setAddFund({ ...addFund, show: true, type: "" });
    } catch (error) {
      console.log(
        "🚀 ~ file: wallet.js ~ line 371 ~ handleDeposit ~ error",
        error
      );
    }
  }, []);

  useEffect(() => {
    if (depositModal === "deposit") {
      setAddFund({ ...addFund, show: true, type: "" });
    }
  }, []);

  const typeClose = () => {
    if (depositModal === "deposit") {
      history.replace("/accounts/wallet");
    }
  };

  return (
    <>
      <div className="main-content-block">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 ipad-col-9.5">
              <div className="row">
                <div className="col-md-12">
                  <div className="wallet-user mt-3">
                    <div className="row align-items-center">
                      <div className="col-lg-12">
                        <div className="username_flex_box">
                          <h3 className="wallet-title">GuardianLink Wallet</h3>
                          <div className="deposit_funds">
                            {user.deposit_locked ? (
                              <OverlayTrigger
                                trigger={["click"]}
                                rootClose={true}
                                placement="bottom"
                                overlay={popover(false, false, true, "deposit")}
                              >
                                <button type="button" className="theme-btn">
                                  <DepositIcon />
                                  <span>Deposit</span>
                                </button>
                              </OverlayTrigger>
                            ) : (
                              <button
                                type="button"
                                className="theme-btn"
                                onClick={handleDeposit}
                              >
                                <DepositIcon />
                                <span>Deposit</span>
                              </button>
                            )}

                            {!parseFloat(user.balance) > 0 ||
                            !["success", "aml_failed"].includes(
                              user.kyc_status
                            ) ||
                            user.withdraw_locked ? (
                              <OverlayTrigger
                                trigger={["click"]}
                                rootClose={true}
                                placement="bottom"
                                overlay={popover(
                                  !parseFloat(user.balance) > 0,
                                  !["success", "aml_failed"].includes(
                                    user.kyc_status
                                  ),
                                  user.withdraw_locked,
                                  "withdraw"
                                )}
                              >
                                <button
                                  type="button"
                                  className="theme-btn filled-btn"
                                >
                                  <WithdrawIcon />
                                  <span>Withdraw</span>
                                </button>
                              </OverlayTrigger>
                            ) : (
                              <button
                                type="button"
                                className="theme-btn filled-btn"
                                onClick={handleWithdraw}
                              >
                                <WithdrawIcon />
                                <span>Withdraw</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Alert
                    className="bg-white shadow bordered-2"
                    variant="dark"
                    show={showAlert}
                    onClose={() => setShowAlert(false)}
                    dismissible
                  >
                    <Alert.Heading>Welcome To Jump.Trade Drops!</Alert.Heading>
                    <p>
                      Add Balance To Your Wallet To Get Quick & Easy Access To
                      The Drops During The Launch!
                    </p>
                  </Alert>
                  <div className="wallet-referral mt-3">
                    <div className="row g-3">
                      <div className="col-12">
                        <WalletDashboard
                          handleDeposit={handleDeposit}
                          setRewardsPop={setRewardsPop}
                          setRewardsHistoryPop={setRewardsHistoryPop}
                          setUtCoinRewardsPop={setUtCoinRewardsPop}
                          setDogeCoinRewardsPop={setDogeCoinRewardsPop}
                          rewardsPop={rewardsPop}
                          UtCoinRewardsPop={UtCoinRewardsPop}
                          dogeCoinRewardsPop={dogeCoinRewardsPop}
                          getSummary={summary}
                        />
                      </div>
                    </div>
                  </div>

                  {/* <div className="wallet-referral mt-3">
                    <div className="row g-3">
                      <div className="col-12">
                        <div className="wallet--block">
                          <div className="wallet--box walletgreen">
                            <p>Available Funds</p>
                            <p className="wallet-num">
                              {currencyFormat(user.balance, user.currency_name)}
                            </p>
                          </div>

                          <div className="wallet--box">
                            <p>Funds on Hold</p>
                            <p className="wallet-num">
                              {" "}
                              {currencyFormat(user.locked, user.currency_name)}
                            </p>
                          </div>

                          <div
                            className="wallet--box"
                            // onClick={() =>
                            //   setUtCoinRewardsPop(!UtCoinRewardsPop)
                            // }
                          >
                            <p>JT Points</p>
                            <p className="wallet-num d-flex align-items-center justify-content-center">
                              <img className="me-2" src={utCoin} />
                              {user.jump_points_balance}
                            </p>

                            <div className="jt-size">
                              (JT on Hold : {user?.jump_points_locked})
                            </div>

                            <a
                              className="view-log mt-3 mb-3"
                              onClick={() =>
                                setUtCoinRewardsPop(!UtCoinRewardsPop)
                              }
                            >
                              <span>View Log</span> <MdKeyboardArrowRight />
                            </a>
                          </div>

                          <div
                            className="wallet--box"
                            onClick={() =>
                              setDogeCoinRewardsPop(!dogeCoinRewardsPop)
                            }
                          >
                            <p>DOGE</p>
                            <p className="wallet-num d-flex align-items-center justify-content-center">
                              <img className="me-2" src={dogeCoin} />
                              {user.doge_balance}
                            </p>

                            <a
                              className="view-log mt-3 mb-3"
                              onClick={() =>
                                setDogeCoinRewardsPop(!dogeCoinRewardsPop)
                              }
                            >
                              <span>View Log</span> <MdKeyboardArrowRight />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}

                  <RewardsActivityPop
                    user={user}
                    rewardsPop={rewardsPop}
                    setRewardsPop={setRewardsPop}
                    setWithDraw={setWithDraw}
                    withDraw={withDraw}
                    withdrawFund={withdrawFund}
                    setWithdrawFund={setWithdrawFund}
                  />

                  {rewardsHistoryPop ? (
                    <RewardsHistoryPop
                      rewardsHistoryPop={rewardsHistoryPop}
                      setRewardsHistoryPop={setRewardsHistoryPop}
                    />
                  ) : (
                    <></>
                  )}
                  {UtCoinRewardsPop && (
                    <UtCoinRewards
                      user={user}
                      utCoinRewardsPop={UtCoinRewardsPop}
                      setUtCoinRewardsPop={setUtCoinRewardsPop}
                      setWithDraw={setWithDraw}
                      withDraw={withDraw}
                      withdrawFund={withdrawFund}
                      setWithdrawFund={setWithdrawFund}
                    />
                  )}

                  <DogeCoinsRewards
                    user={user}
                    dogeCoinRewardsPop={dogeCoinRewardsPop}
                    setDogeCoinRewardsPop={setDogeCoinRewardsPop}
                  />
                  {/* <RewardWallet /> */}
                </div>
              </div>
              <div className="transaction-history-table-block mt-3">
                <div className="user-transaction-history">
                  <h4
                    role="button"
                    onClick={() => setTranType("trans")}
                    className={`transaction-history-title ${
                      tranType === "trans" ? "active" : ""
                    }`}
                  >
                    Transaction History
                  </h4>
                  <h4
                    role="button"
                    // onClick={() => setTranType("yeild")}
                    className={`transaction-history-title ${
                      tranType !== "trans" ? "active" : ""
                    }`}
                  >
                    Yield History
                  </h4>
                </div>
                <div className="transaction-history-table">
                  {tranType === "trans" ? (
                    <>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="transaction-history-title tx-history p-2">
                            Total Transactions: {tranList?.total}
                          </h6>
                        </div>
                        <div className="me-2">
                          <Dropdown>
                            <Dropdown.Toggle
                              align="end"
                              drop="end"
                              as={FilterToggle}
                            ></Dropdown.Toggle>

                            <Dropdown.Menu align="end">
                              <Dropdown.Item
                                as="button"
                                className={filter === "" ? "active" : ""}
                                onClick={() => handleFilterChange("")}
                              >
                                All
                              </Dropdown.Item>
                              <Dropdown.Item
                                as="button"
                                className={
                                  filter === "deposits" ? "active" : ""
                                }
                                onClick={() => handleFilterChange("deposits")}
                              >
                                Deposits
                              </Dropdown.Item>
                              <Dropdown.Item
                                as="button"
                                className={
                                  filter === "withdraws" ? "active" : ""
                                }
                                onClick={() => handleFilterChange("withdraws")}
                              >
                                Withdrawals
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>

                      <div className="table-content-block">
                        {loading ? (
                          <div className="p-5 text-center">Loading...</div>
                        ) : (
                          <>
                            {historyList.length > 0 ? (
                              <table
                                id="example"
                                className="display theme-table"
                                style={{ width: "100%" }}
                              >
                                <thead>
                                  <tr>
                                    <th>#</th>
                                    <th>Amount</th>
                                    {/* <th>Wallet Type</th> */}
                                    <th>Type</th>
                                    <th>Transaction</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Transaction ID</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {historyList.map((obj, i) => (
                                    <tr key={`tran-row-${i}`}>
                                      <td>{i + 1}</td>
                                      <td>
                                        {currencyFormat(
                                          obj.amount,
                                          user.currency_name
                                        )}
                                      </td>
                                      {/* <td className="payment-content">
                                        {obj?.play_wallet
                                          ? "play wallet"
                                          : "GL Wallet"}
                                      </td> */}
                                      <td>
                                        {(() => {
                                          if (
                                            obj.payment_method === "Ippopay"
                                          ) {
                                            return "UPI";
                                          } else if (
                                            obj.payment_method === "Trade"
                                          ) {
                                            if (
                                              obj.trade_withdraw_type === "bank"
                                            ) {
                                              return "Trade - Bank";
                                            } else if (
                                              obj.trade_withdraw_type === "upi"
                                            ) {
                                              return "Trade - UPI";
                                            } else if (
                                              obj.trade_withdraw_type ===
                                              "crypto"
                                            ) {
                                              return "Trade - Crypto";
                                            }
                                          } else {
                                            return obj.payment_method;
                                          }
                                        })()}
                                      </td>
                                      <td>{obj.payment_type}</td>
                                      <td>
                                        {dayjs(obj.created_at).format(
                                          "DD MMM YYYY hh:mma"
                                        )}
                                      </td>
                                      <td
                                        className={
                                          obj.state === "Success"
                                            ? "text-success"
                                            : obj.state === "Pending" ||
                                              obj.state === "OfflinePending"
                                            ? "text-warning"
                                            : obj.state ===
                                              "VerificationPending"
                                            ? "text-info"
                                            : "text-danger"
                                        }
                                      >
                                        {obj.state === "VerificationPending" ? (
                                          <>
                                            <ToolTip
                                              placement={"top"}
                                              icon={
                                                <BiRefresh
                                                  onClick={() =>
                                                    handleRefresh(obj.txid)
                                                  }
                                                  className={`reload-icon ${
                                                    rLoading && "fa-spin"
                                                  }`}
                                                />
                                              }
                                              content={"Check Status"}
                                            />{" "}
                                            Verification Pending
                                          </>
                                        ) : obj.state == "OfflinePending" ? (
                                          "Pending"
                                        ) : (
                                          obj.state
                                        )}
                                      </td>
                                      <td>
                                        {(() => {
                                          if (
                                            obj.payment_type === "Credit" &&
                                            !obj.state === "OfflinePending"
                                          )
                                            return (
                                              <span
                                                className="transID"
                                                data-toggle="tooltip"
                                                data-placement="top"
                                                title={obj.txid}
                                              >
                                                {" "}
                                                {obj.txid}{" "}
                                              </span>
                                            );
                                          else {
                                            if (obj.state === "Requested")
                                              return (
                                                <span
                                                  className="transID"
                                                  data-toggle="tooltip"
                                                  data-placement="top"
                                                  title={obj.txid}
                                                >
                                                  <button
                                                    className="btn btn-outline-dark btn-sm rounded-pill ps-4 pe-4"
                                                    type="button"
                                                    disabled={obj.loading}
                                                    onClick={() =>
                                                      handleCancelWithdraw(
                                                        obj.slug
                                                      )
                                                    }
                                                  >
                                                    {obj.loading
                                                      ? "Processing..."
                                                      : "Cancel Request"}
                                                  </button>
                                                </span>
                                              );
                                            if (obj.state === "OfflinePending")
                                              return (
                                                <span
                                                  className="transID"
                                                  data-toggle="tooltip"
                                                  data-placement="top"
                                                  title={obj.txid}
                                                >
                                                  {obj?.txid}
                                                  {/* <button
                                                    className="btn btn-outline-dark btn-sm rounded-pill ps-4 pe-4"
                                                    type="button"
                                                    disabled={obj.loading}
                                                    onClick={() =>
                                                      handleOffLineCancelWithdraw(
                                                        obj.slug
                                                      )
                                                    }
                                                  >
                                                    {obj.loading
                                                      ? "Processing..."
                                                      : "Cancel Request"}
                                                  </button> */}
                                                </span>
                                              );
                                            else
                                              return (
                                                <span
                                                  className="transID"
                                                  data-toggle="tooltip"
                                                  data-placement="top"
                                                  title={obj.txid}
                                                >
                                                  {" "}
                                                  {obj.txid}{" "}
                                                </span>
                                              );
                                          }
                                        })()}
                                      </td>
                                    </tr>
                                  ))}

                                  {tranList.next_page && (
                                    <tr>
                                      <td colSpan="7" className="text-center">
                                        <span
                                          className="loadmore-btn"
                                          onClick={loadMore}
                                          disabled={moreLoading}
                                        >
                                          {moreLoading
                                            ? "Loading..."
                                            : "Load More"}
                                        </span>
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            ) : (
                              <span className="no-record-found">
                                No records found
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="transaction-history-title tx-history p-2">
                            Total Yields: {tranListy?.total}
                          </h6>
                        </div>
                      </div>

                      <div className="">
                        {loadingy ? (
                          <div className="p-5 text-center">Loading...</div>
                        ) : (
                          <>
                            {historyListy.map((obj, i) => (
                              <div className="row yield-history">
                                <div className="col-md-2">
                                  <img src={obj.asset_url} />
                                </div>
                                <div className="col-md-3">
                                  <div
                                    className="sale-nft-title link"
                                    role={"button"}
                                    onClick={() =>
                                      window.open(
                                        `${process.env.REACT_APP_MARKETPLACE_URL}/details/${obj.nft_slug}`,
                                        "_blank"
                                      )
                                    }
                                  >
                                    {obj.name}
                                  </div>
                                  <div className="sale-nft-date">
                                    {dayjs(obj.created_at).format(
                                      "DD MMM YYYY hh:mma"
                                    )}
                                  </div>
                                </div>
                                <div className="col-md-3">
                                  <div className="sale-nft-title">
                                    {obj.yield_nft_name}
                                  </div>
                                  <div className="sale-nft-date">Yield NFT</div>
                                </div>
                                <div className="col-md-3">
                                  <div className="sale-nft-date">
                                    Sale Amount:{" "}
                                    {currencyFormat(obj.total_amount, "USD")}
                                  </div>
                                  <div className="sale-nft-date">
                                    Royalty: {obj.royalties}%
                                  </div>
                                  <div className="sale-nft-date">
                                    Yield Percentage: {obj.yield_percent}%{" "}
                                    <ToolTip
                                      placement={"top"}
                                      icon={<BsInfoCircleFill />}
                                      content={
                                        "Your yield is calculated as a percentage of the royalty. The yield percentage varies depending on the property of your NFT."
                                      }
                                    />
                                  </div>
                                  <div className="sale-nft-title">
                                    Yield Amount:{" "}
                                    {currencyFormat(obj.yield_amount, "USD")}
                                  </div>
                                </div>
                              </div>
                            ))}
                            {tranListy.next_page && (
                              <span
                                className="loadmore-btn"
                                onClick={loadMoreYield}
                                disabled={moreLoadingy}
                              >
                                {moreLoadingy ? "Loading..." : "Load More"}
                              </span>
                            )}

                            <span className="no-record-found">
                              No records found
                            </span>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        dialogClassName="modal-right full-height"
        show={addFund.show}
        size="lg"
        onHide={() => {
          getDepositStatus();

          setAddFund({ ...addFund, show: false });
          setPageNo(1);
          getTransactionHistory(1);
          depositModal && typeClose();
        }}
        backdrop={"static"}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Deposit Funds to My GuardianLink Wallet {getPayTitle()}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="card-modal">
          <AddFundWrapper>
            {showLocked === "deposit" ? (
              <div className="mt-4 mb-4 locked-text">
                Your deposits have been disabled as our systems detected an
                unusual activity on your account.{" "}
                <a
                  href={
                    "https://help.jump.trade/en/support/solutions/articles/84000345961-why-am-i-not-able-to-make-deposits-to-my-wallet-"
                  }
                >
                  Learn more.
                </a>
              </div>
            ) : (
              <>
                {!addFund.type && (
                  <PaymentMethodList
                    handleSelectedPay={(data) => {
                      setAddFund({ ...addFund, type: data });
                      invokeTrackEvent(EVENT_NAMES?.WALLET_DEPOSIT_INITIATED, {
                        payment_method: data,
                      });
                    }}
                  />
                )}

                {(() => {
                  if (addFund.type === "stripe") {
                    return (
                      <CardDetails
                        addFund={addFund}
                        setAddFund={setAddFund}
                        setPageNo={setPageNo}
                        getTransactionHistory={getTransactionHistory}
                        getDepositStat={handleDepositAlert}
                      />
                    );
                  }

                  if (addFund.type === "fracto") {
                    return user.kyc_status !== "success" ? (
                      <>Please complete your user verification to proceed</>
                    ) : (
                      <CardDetailsFracto
                        addFund={addFund}
                        setAddFund={setAddFund}
                        setPageNo={setPageNo}
                        getTransactionHistory={getTransactionHistory}
                        isFirstDeposit={isFirstDeposit}
                        getDepositStat={handleDepositAlert}
                      />
                    );
                  }
                  // if (addFund.type === "fracto") {
                  //   return (
                  //     <CardDetailsFracto
                  //       addFund={addFund}
                  //       setAddFund={setAddFund}
                  //       setPageNo={setPageNo}
                  //       getTransactionHistory={getTransactionHistory}
                  //     />
                  //   );
                  // }
                  if (addFund.type === "crypto") {
                    return (
                      <CryptoDetails
                        addFund={addFund}
                        setAddFund={setAddFund}
                      />
                    );
                  }

                  if (addFund.type === "ramp") {
                    return (
                      <RampPayment
                        addFund={addFund}
                        setAddFund={setAddFund}
                        getTransactionHistory={getTransactionHistory}
                        getDepositStat={handleDepositAlert}
                      />
                    );
                  }
                  if (addFund.type === "ach") {
                    return (
                      <ACHPayment
                        addFund={addFund}
                        setAddFund={setAddFund}
                        setPageNo={setPageNo}
                        getTransactionHistory={getTransactionHistory}
                        getDepositStat={handleDepositAlert}
                      />
                    );
                  }
                  if (addFund.type === "cashfree") {
                    return (
                      <CashFreePayment
                        addFund={addFund}
                        setAddFund={setAddFund}
                        setPageNo={setPageNo}
                        getTransactionHistory={getTransactionHistory}
                        isFirstDeposit={isFirstDeposit}
                        getDepositStat={handleDepositAlert}
                      />
                    );
                  }

                  if (addFund.type === "ippo") {
                    return (
                      <IppoPayment
                        addFund={addFund}
                        setAddFund={setAddFund}
                        setPageNo={setPageNo}
                        getTransactionHistory={getTransactionHistory}
                        isFirstDeposit={isFirstDeposit}
                        getDepositStat={handleDepositAlert}
                      />
                    );
                  }

                  if (addFund.type === "fracto_crypto") {
                    return (
                      <FractoCryptoDetails
                        addFund={addFund}
                        setAddFund={setAddFund}
                        setPageNo={setPageNo}
                        getTransactionHistory={getTransactionHistory}
                        isFirstDeposit={isFirstDeposit}
                        getDepositStat={handleDepositAlert}
                      />
                    );
                  }

                  if (addFund.type === "transak") {
                    return (
                      <TransakPayment
                        addFund={addFund}
                        setAddFund={setAddFund}
                        isCallIt={callIt}
                      />
                    );
                  }
                  if (addFund.type === "bitbns") {
                    return (
                      <BitbnsPayment
                        addFund={addFund}
                        setAddFund={setAddFund}
                      />
                    );
                  }
                  if (addFund.type === "onmeta") {
                    return (
                      <OnmetaPayment
                        addFund={addFund}
                        setAddFund={setAddFund}
                      />
                    );
                  }

                  if (addFund.type === "upi") {
                    return (
                      <UpiPayment
                        addFund={addFund}
                        setAddFund={setAddFund}
                        getDepositStat={handleDepositAlert}
                      />
                    );
                  }
                })()}
              </>
            )}
          </AddFundWrapper>
        </Modal.Body>
      </Modal>

      <Modal
        dialogClassName="modal-right full-height"
        show={withdrawFund.show}
        size="lg"
        onHide={() => {
          setWithdrawFund({ ...withdrawFund, show: false });
          setPageNo(1);
          getTransactionHistory(1);
        }}
        backdrop={"static"}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {withDrawTitle === "Gl_wallet"
              ? `Withdraw Funds from My GuardianLink Wallet ${getWithdrawTitle()}`
              : `Withdraw Funds from My Play Wallet`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="card-modal">
          <AddFundWrapper>
            {showLocked === "withdraw" ? (
              <div className="mt-4 mb-4 locked-text">
                Your withdrawals have been disabled because of possible
                malicious activity on your account.{" "}
                <a
                  href={
                    "https://help.jump.trade/en/support/solutions/articles/84000345963-why-is-withdrawal-of-funds-disabled-in-my-wallet-"
                  }
                >
                  Learn more.
                </a>
              </div>
            ) : (
              <>
                {!withdrawFund.type && (
                  <>
                    {withdrawBalanceList === "error" ? (
                      <div className="withdraw-error">
                        Unable to fetch withdrawal balance, please{" "}
                        <a
                          href={process.env.REACT_APP_HELP_URL}
                          target="_blank"
                        >
                          contact support
                        </a>{" "}
                        for further assitance
                      </div>
                    ) : (
                      <PaymentMethodListWithdraw
                        setWithDrawTitle={setWithDrawTitle}
                        balanceInfo={withdrawBalanceList}
                        upiUsers={upiList}
                        crypto={cryptoList}
                        network={networks}
                        withdraw={withdrawFund}
                        WithdrawFund={setWithdrawFund}
                        handleWithdraw={handleWithdrawProcess}
                        handleSelectedPay={(type, balance, fee) => {
                          setWithdrawFund({
                            ...withdrawFund,
                            type,
                            balance,
                            fee,
                          });
                          invokeTrackEvent(
                            EVENT_NAMES?.WALLET_WITHDRAW_INITIATED,
                            {
                              payment_method: type,
                              balance: balance ? parseFloat(balance) : null,
                              fees: fee,
                            }
                          );
                        }}
                      />
                    )}
                  </>
                )}

                {(() => {
                  if (withdrawFund.type === "stripe") {
                    return (
                      <CardDetailsWithdraw
                        withdrawFund={withdrawFund}
                        setWithdrawFund={setWithdrawFund}
                        handleWithdrawProcess={handleWithdrawProcess}
                      />
                    );
                  }

                  if (withdrawFund.type === "fracto_card") {
                    return (
                      <CardDetailsWithdrawFracto
                        withdrawFund={withdrawFund}
                        setWithdrawFund={setWithdrawFund}
                        handleWithdrawProcess={handleWithdrawProcess}
                      />
                    );
                  }

                  if (withdrawFund.type === "fracto_crypto") {
                    return (
                      <FractoCryptoWithdraw
                        withdrawFund={withdrawFund}
                        setWithdrawFund={setWithdrawFund}
                        handleWithdrawProcess={handleWithdrawProcess}
                        cryptoList={cryptoList}
                        showNetworks={networks}
                      />
                    );
                  }

                  if (withdrawFund.type === "fracto_ach") {
                    return (
                      <ACHWithdraw
                        withdrawFund={withdrawFund}
                        setWithdrawFund={setWithdrawFund}
                        handleWithdrawProcess={handleWithdrawProcess}
                      />
                    );
                  }

                  if (withdrawFund.type === "crypto") {
                    return (
                      <CryptoDetailsWithdraw
                        balanceInfo={withdrawBalanceList}
                        withdrawFund={withdrawFund}
                        setWithdrawFund={setWithdrawFund}
                        handleWithdrawProcess={handleWithdrawProcess}
                        cryptoList={cryptoList}
                        showNetworks={networks}
                      />
                    );
                  }

                  if (withdrawFund.type === "cashfree") {
                    return (
                      <CashFreeWithdraw
                        withdrawFund={withdrawFund}
                        setWithdrawFund={setWithdrawFund}
                        handleWithdrawProcess={handleWithdrawProcess}
                        upiList={upiList}
                      />
                    );
                  }

                  if (withdrawFund.type === "ippo") {
                    return (
                      <IppoPaymentWithdraw
                        withdrawFund={withdrawFund}
                        setWithdrawFund={setWithdrawFund}
                        handleWithdrawProcess={handleWithdrawProcess}
                        upiList={upiList}
                      />
                    );
                  }

                  if (withdrawFund.type === "trade") {
                    return (
                      <TradeWithdraw
                        balanceInfo={withdrawBalanceList}
                        withdrawFund={withdrawFund}
                        setWithdrawFund={setWithdrawFund}
                        handleWithdrawProcess={handleWithdrawProcess}
                        upiList={upiList}
                        cryptoList={cryptoList}
                        showNetworks={networks}
                      />
                    );
                  }

                  if (withdrawFund.type === "inapp_purchase") {
                    return (
                      <InAppWithdraw
                        balanceInfo={withdrawBalanceList}
                        withdrawFund={withdrawFund}
                        setWithdrawFund={setWithdrawFund}
                        handleWithdrawProcess={handleWithdrawProcess}
                        upiList={upiList}
                        cryptoList={cryptoList}
                        showNetworks={networks}
                      />
                    );
                  }

                  return null;
                })()}
              </>
            )}
          </AddFundWrapper>
        </Modal.Body>
      </Modal>

      <Modal
        show={confirm}
        size="md"
        onHide={() => {
          setConfirm(false);
        }}
        backdrop={"static"}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm your treasure funds transfer</Modal.Title>
        </Modal.Header>
        <Modal.Body className="card-modal">
          <div className="treasure-move">
            By tranferring the Treasure Balance to your Available Funds, you're
            converting all your coin(s)/shares to USDT. The process is
            irreversible and you won't gain/lose because of price fluctiations.
          </div>
          <div className="text-end mt-4">
            <button
              type="button"
              className="btn btn-sm btn-dark-outline border rounded-pill ps-3 pe-3 me-2 mb-2"
              onClick={() => setConfirm(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-sm btn-dark rounded-pill ps-3 pe-3 mb-2"
              onClick={handleMoveBalance}
            >
              {mLoading ? "Moving funds..." : "Proceed"}
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={redeemconfirm}
        size="md"
        onHide={() => {
          setRedeemConfirm(false);
        }}
        backdrop={"static"}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Reward-Redeem</Modal.Title>
        </Modal.Header>
        <Modal.Body className="card-modal">
          <div className="treasure-move">
            By clicking ‘Confirm’, you agree to the Reward Balance being
            transferred to your main wallet. The transfer is irreversible.{" "}
            <small>
              {" "}
              <a
                className="terms-link"
                href={process.env.REACT_APP_TERMS_URL}
                target="_blank"
                rel="noreferrer"
              >
                T&C Apply.
              </a>
            </small>
          </div>
          <div className="text-end mt-4">
            <button
              type="button"
              className="btn btn-sm btn-dark-outline border rounded-pill ps-3 pe-3 me-2 mb-2"
              onClick={() => setRedeemConfirm(false)}
            >
              Cancel
            </button>
            <button
              disabled={redeemLoading}
              type="button"
              className="btn btn-sm btn-dark rounded-pill ps-3 pe-3 mb-2"
              onClick={handleReedem}
            >
              {redeemLoading ? "Processing..." : "Confirm"}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Wallet;
