import React, { useEffect, useState } from "react";
import { Button, Form, Offcanvas } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { MdCompareArrows } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { BiArrowBack } from "react-icons/bi";
import { CgArrowsExchangeV } from "react-icons/cg";
import { toast } from "react-toastify";
import dayjs from "dayjs";

import {
  getUTCoinsList,
  utcoinsConvert,
  getJTCoinsGuildUserList,
} from "../../api/methods";
import { user_load_by_token_thunk } from "../../redux/thunk/user_thunk";

import { getCookies } from "../../utils/cookies";
import {
  currencyFormat,
  blockInvalidChar,
  formattedNumber,
  userBalanceDetailFormat,
} from "../../utils/common";

import utCoin from "../../images/coin.png";

import "./style.scss";

const UtCoinRewards = ({ utCoinRewardsPop, setUtCoinRewardsPop }) => {
  const [convertUSD, setConvertUSD] = useState(false);
  const [utCoins, setUTCoins] = useState([]);
  const [balance, setBalance] = useState([]);
  const [userPerQty, setUserPerQty] = useState(0);
  const [convertAmount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [coins, setCoins] = useState();
  const [success, setSuccess] = useState(false);
  const [showRequire, setShowRequire] = useState(false);
  const { user } = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
  const [pageNo, setPageNo] = useState(1);
  const [moreLoading, setMoreLoading] = useState(false);
  const [nextPage, setNextPage] = useState(false);
  const [minimumWithdraw, setMinimumWithdraw] = useState([]);

  const isDisabled = false;

  useEffect(() => {
    if (user?.guild_user) {
      if (utCoinRewardsPop) {
        getJTGuildUser(pageNo);
      }
    } else {
      if (utCoinRewardsPop) {
        getUTCoins(pageNo);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [utCoinRewardsPop]);

  const handleSuccess = () => {
    setConvertUSD(true);
    setAmount();
    setCoins("");
    // setError(true);
  };

  const handleError = () => {
    toast.error(
      `You need a minimum of ${parseFloat(
        minimumWithdraw
      )} JT Points to do the conversion.`
    );
  };

  const handleCanvertError = () => {
    toast.error("You do not have permission to initiate this action.");
  };
  const handleBack = () => {
    setConvertUSD(false);
    setAmount(0);
    setCoins("");
  };
  const handleGoBack = () => {
    setUtCoinRewardsPop(false);
    setConvertUSD(false);
    setSuccess(false);
    setAmount(0);
  };
  const getUTCoins = async (page) => {
    try {
      const result = await getUTCoinsList("jump_point", page);
      setMoreLoading(true);
      setUTCoins(result?.data?.data?.asserts);
      setMinimumWithdraw(result?.data?.data?.minimum_withdraw);
      setNextPage(result?.data?.data?.next_page);
      setBalance(result.data?.data?.balance);
      setUserPerQty(result?.data?.data);

      setMoreLoading(false);
    } catch (error) {
      setMoreLoading(false);
      console.log(
        "🚀 ~ file: wallet.js ~ line 84 ~ getUTCoinsList ~ error",
        error
      );
    }
  };
  const getLoadUTCoins = async (page) => {
    try {
      const result = await getUTCoinsList("jump_point", page);
      setMoreLoading(true);
      setUTCoins([...utCoins, ...result?.data?.data?.asserts]);
      setNextPage(result?.data?.data?.next_page);
      setBalance(result.data?.data?.balance);

      setMoreLoading(false);
    } catch (error) {
      setMoreLoading(false);
      console.log(
        "🚀 ~ file: wallet.js ~ line 84 ~ getUTCoinsList ~ error",
        error
      );
    }
  };

  const getJTGuildUser = async (page) => {
    try {
      const result = await getJTCoinsGuildUserList("jump_point", page);
      setMoreLoading(true);
      setUTCoins(result?.data?.data?.asserts);
      setMinimumWithdraw(result?.data?.data?.minimum_withdraw);
      setNextPage(result?.data?.data?.next_page);
      setBalance(result.data?.data?.balance);
      setUserPerQty(result?.data?.data);

      setMoreLoading(false);
    } catch (error) {
      setMoreLoading(false);
      console.log(
        "🚀 ~ file: wallet.js ~ line 84 ~ getJTGuildUser ~ error",
        error
      );
    }
  };

  const getLoadJTGuildUserCoins = async (page) => {
    try {
      const result = await getJTCoinsGuildUserList("jump_point", page);
      setMoreLoading(true);
      setUTCoins([...utCoins, ...result?.data?.data?.asserts]);
      setNextPage(result?.data?.data?.next_page);
      setBalance(result.data?.data?.balance);
      //setUserPerQty(result?.data?.data);

      setMoreLoading(false);
    } catch (error) {
      setMoreLoading(false);
      console.log(
        "🚀 ~ file: wallet.js ~ line 84 ~ getLoadJTGuildUserCoins ~ error",
        error
      );
    }
  };

  const loadMore = () => {
    if (user?.guild_user) {
      getLoadJTGuildUserCoins(pageNo + 1);
    } else {
      getLoadUTCoins(pageNo + 1);
    }
    setPageNo(pageNo + 1);
  };

  // const utcoinslevel = user?.jump_points_balance ? user?.jump_points_balance : 0;

  const handleUTInputChange = (e) => {
    let count = user?.jump_points_balance ? user?.jump_points_balance : 0;

    if (e.target.value) {
      if (
        parseFloat(e.target.value) <= parseFloat(count) &&
        e.target.value !== 0
      ) {
        var CurrentValue = e.target.value;
        let cleanNum =
          CurrentValue.indexOf(".") >= 0
            ? CurrentValue.substr(0, CurrentValue.indexOf(".")) +
              CurrentValue.substr(CurrentValue.indexOf("."), 3)
            : CurrentValue;
        // console.log(cleanNum)
        if (cleanNum < parseFloat(minimumWithdraw)) setShowRequire(true);
        else setShowRequire(false);
        setCoins(cleanNum);
        let amount = cleanNum * parseFloat(userPerQty.usd_per_qty);
        setAmount(amount);
      }
    } else {
      setShowRequire(false);
      setCoins("");
      setAmount("");
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    // if (validateNumber(coins) && coins < parseFloat(userPerQty.balance)) {
    //   if (coins) {
    try {
      setLoading(true);
      const result = await utcoinsConvert("jump_point", coins);

      if (result.data.status) {
        const token = getCookies();
        if (token) {
          dispatch(user_load_by_token_thunk(token));
        }
        setSuccess(true);
        getUTCoins();

        // toast.success("Successfully Converted");
      } else {
        setSuccess(false);

        toast.error("Cancel Converted");
      }

      setCoins("");
      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.log(
        "🚀 ~ file: index.js ~ line 46 ~ handleSendNewsLetter ~ error",
        error
      );
    }
  };

  // const handleUTtranfericon = () => {
  //   if (coins) {
  //     setCoins(convertAmount);
  //     let newamount = convertAmount * parseFloat(userPerQty.usd_per_qty);
  //     setAmount(newamount);
  //   }
  // };

  const CloseModal = () => {
    setConvertUSD(false);
    setSuccess(false);
    setAmount(0);
    setUtCoinRewardsPop(false);
  };

  const fixedDecimalValue = (convertDecimalAmount) => {
    if (convertDecimalAmount) {
      let intFloat = convertDecimalAmount.toString().split(".");
      if (intFloat.length > 1 && intFloat[1].length > 2) {
        return parseFloat(formattedNumber(convertDecimalAmount, 2));
      } else return convertAmount;
    }
  };

  return (
    <>
      <div className="ut-coin-container">
        <Offcanvas
          show={utCoinRewardsPop}
          onHide={() => setUtCoinRewardsPop(!utCoinRewardsPop)}
          placement="end"
          // className="w-100 w-md-50 w-lg-42"

          className="popup-wrapper-canvas-utcoin"
          backdrop={true}
        >
          <Offcanvas.Body className="p-0 pop-body-containers">
            <>
              <div className="pop-nft-details">
                {!convertUSD ? (
                  // <>
                  !success ? (
                    <>
                      <div className="pop-head-content">
                        <div className="pop-bid-title">Activity Log</div>
                        <div
                          className="close-button-pop"
                          onClick={() => setUtCoinRewardsPop(!utCoinRewardsPop)}
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
                              <h5 className="card-title">
                                Available JT Points
                              </h5>
                              <p className="wallet-num d-flex flex-column align-items-center">
                                <span>
                                  <img
                                    src={utCoin}
                                    alt="utCoin"
                                    className="me-2"
                                    width="30px"
                                    height="30px"
                                  />
                                  {userBalanceDetailFormat(
                                    user?.jump_points_balance
                                  )}
                                </span>
                                <span className="fs-5">
                                  ({user?.jump_points_balance} JT)
                                </span>
                              </p>
                            </div>
                            <>
                              {!isDisabled ? (
                                <>
                                  {balance >= parseFloat(minimumWithdraw) ? (
                                    <>
                                      {user.can_convert_jt &&
                                      parseFloat(minimumWithdraw) ? (
                                        <a onClick={handleSuccess}>
                                          <div
                                            className="card-footer text-muted convert-button"
                                            onClick={handleSuccess}
                                          >
                                            <MdCompareArrows className="me-2" />
                                            Convert to USD
                                          </div>
                                        </a>
                                      ) : (
                                        <>
                                          <a>
                                            <div
                                              className="card-footer text-muted convert-button"
                                              onClick={handleCanvertError}
                                            >
                                              <MdCompareArrows className="me-2" />
                                              Convert to USD
                                            </div>
                                          </a>
                                        </>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      <a>
                                        <div
                                          className="card-footer text-muted convert-button"
                                          onClick={handleError}
                                        >
                                          <MdCompareArrows className="me-2" />
                                          Convert to USD
                                        </div>
                                      </a>
                                    </>
                                  )}
                                </>
                              ) : (
                                <>
                                  {" "}
                                  <a>
                                    <div
                                      className="card-footer  text-muted disabled-button"
                                      // onClick={handleError}
                                    >
                                      <MdCompareArrows className="me-2" />
                                      Convert to USD
                                    </div>
                                  </a>
                                  <p className="temporary-disabled">
                                    Temporary Disabled
                                  </p>
                                </>
                              )}
                            </>
                          </div>
                          {utCoins.length > 0 ? (
                            <div className="logLists mt-5">
                              <h4>Transactions</h4>
                              {utCoins.map((coinslist, i) => (
                                <div className="d-flex single-log-lists">
                                  <div className="flex-grow-1 py-4">
                                    <h1>{coinslist?.title}</h1>
                                    <p>{coinslist?.description}</p>
                                    <p className="log-lists-dt">
                                      {dayjs(coinslist?.created_at).format(
                                        "MMM D, YYYY hh:mm A"
                                      )}
                                    </p>
                                  </div>
                                  <div className="p-3">
                                    <p
                                      className={
                                        coinslist?.balance < 0
                                          ? "reward-value"
                                          : "reward-value-pos"
                                      }
                                    >
                                      {coinslist?.balance > 0
                                        ? `${`+${coinslist?.balance}`}`
                                        : coinslist?.balance}
                                      <img alt="utCoin" src={utCoin} />
                                    </p>
                                  </div>
                                </div>
                              ))}
                              {nextPage && (
                                <button
                                  className="btn btn-sm d-flex justify-content-center align-items-center mx-auto mt-5 rounded-pill btn-dark"
                                  onClick={loadMore}
                                  disabled={moreLoading}
                                >
                                  {moreLoading ? "Loading..." : "Load more"}
                                </button>
                              )}
                              {/*  */}
                            </div>
                          ) : (
                            <span className="no-record-found">
                              No records found
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="pop-head-content">
                        <div className="pop-bid-title">Activity Error</div>
                        <div
                          className="close-button-pop"
                          onClick={() => setUtCoinRewardsPop(!utCoinRewardsPop)}
                        >
                          <img
                            alt="close"
                            src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e"
                          ></img>
                        </div>
                      </div>
                    </>
                  )
                ) : // </>
                !success ? (
                  <>
                    <div className="pop-head-content">
                      <div className="pop-bid-title">
                        <a className="me-2 text-dark" onClick={handleBack}>
                          <BiArrowBack />
                        </a>
                        Convert JT Points to USD
                      </div>
                      <div
                        className="close-button-pop"
                        //onClick={() => setUtCoinRewardsPop(!utCoinRewardsPop)}
                        onClick={CloseModal}
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
                      {/* <div className="error-float-container">
                        {user?.jump_points_balance &&
                          user?.jump_points_balance <=
                            parseFloat(
                              minimumWithdraw
                            ) && <ErrorText type="lowutcoins" />}
                      </div> */}
                      <div className="activity-log convert-log p-5">
                        <div className="card text-center">
                          <div className="card-body">
                            <Form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleUpdate();
                                return false;
                              }}
                            >
                              <div className="from-ut-coin">
                                <div className="d-flex justify-content-between bd-highlight mb-2  text-bold">
                                  <div className="convertor-text">
                                    JT Points
                                  </div>
                                  <div className="convertor-text convertor-text-balance-desk">
                                    <span className="me-2">Balance: </span>
                                    <img
                                      src={utCoin}
                                      alt="utCoin"
                                      className="me-2"
                                      width="16px"
                                    />
                                    <span>
                                      {user?.jump_points_balance - coins}
                                    </span>
                                  </div>
                                </div>
                                <Form.Group
                                  className="mb-3"
                                  controlId="formBasicEmail"
                                >
                                  <Form.Control
                                    type="number"
                                    className="form-control-lg"
                                    placeholder="Enter coin to convert"
                                    required="Enter MAX value"
                                    disabled={loading}
                                    value={coins}
                                    onChange={handleUTInputChange}
                                    onKeyDown={blockInvalidChar}
                                  />

                                  <div className="ut-convert-btn">
                                    <Button
                                      className="btn btn-dark w-100"
                                      onClick={handleUpdate}
                                      disabled={
                                        coins < parseFloat(minimumWithdraw) ||
                                        !coins
                                      }
                                    >
                                      Convert
                                    </Button>
                                  </div>
                                </Form.Group>
                                <div className="convertor-text convertor-text-balance-mobile">
                                  <span className="me-2">Balance: </span>
                                  <img
                                    src={utCoin}
                                    alt="utCoin"
                                    className="me-2"
                                    width="16px"
                                  />
                                  <span>
                                    {user?.jump_points_balance - coins}
                                  </span>
                                </div>
                              </div>
                              <div
                                className="d-inline-flex convertor-icon"
                                // onClick={handleUTtranfericon}
                              >
                                <CgArrowsExchangeV />
                              </div>
                              <div className="from-ut-coin to-ut-coin mt-4">
                                <div className="d-flex justify-content-between bd-highlight mb-2 text-bold">
                                  <div className="convertor-text">To USD</div>
                                  <div className="convertor-text convertor-desk">
                                    Balance:{" "}
                                    <span>
                                      {"   "}
                                      {currencyFormat(
                                        parseFloat(user.balance) +
                                          parseFloat(convertAmount || 0),
                                        user.currency_name
                                      )}
                                    </span>
                                  </div>
                                </div>
                                <p className="convert-value">
                                  {fixedDecimalValue(convertAmount)}
                                </p>
                                <div className="convertor-text convertor-text-mobile text-bold">
                                  Balance:{" "}
                                  <span>
                                    {"   "}
                                    {currencyFormat(
                                      parseFloat(user.balance) +
                                        parseFloat(convertAmount),
                                      user.currency_name
                                    )}
                                  </span>
                                </div>
                              </div>
                              <div>
                                {" "}
                                {showRequire && (
                                  <span
                                    className="note-comments"
                                    style={{ color: "red" }}
                                  >
                                    Please enter a minimum of{" "}
                                    {parseFloat(minimumWithdraw)} JT Points
                                  </span>
                                )}
                              </div>
                              <div className="note-comments">
                                {" "}
                                1 JT POINTS TO {userPerQty?.usd_per_qty} USD
                              </div>
                            </Form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="pop-head-content">
                      <div className="pop-bid-title">
                        Converted Successfully
                      </div>
                      <div
                        className="close-button-pop"
                        // onClick={() => setUtCoinRewardsPop(!utCoinRewardsPop)}
                        onClick={CloseModal}
                      >
                        <img
                          alt="close"
                          src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e"
                        ></img>
                      </div>
                    </div>{" "}
                    <div className={`pop-bid-progress`}>
                      <div className="progress-complete"></div>
                    </div>
                    <div className="pop-body-content success-ut-pop">
                      <div className="success-log p-5">
                        <div className="pop-sale-ut-details">
                          <div className="sucess-title">
                            <FaCheckCircle color={"#23bf61"} size={60} />

                            <div className="message mt-3">
                              Converted Successfully
                            </div>
                          </div>
                        </div>
                        <div className="confirm-content-block">
                          <ul className="confirm-content-list">
                            <li>
                              <span className="key">Available Balance </span>
                              <span className="value">
                                {" "}
                                {currencyFormat(
                                  user.balance,
                                  user.currency_name
                                )}
                              </span>
                            </li>
                            <li>
                              <span className="key">Available JT Points</span>
                              <span className="value d-flex align-items-center">
                                <img
                                  src={utCoin}
                                  alt="utCoin"
                                  width="16px"
                                  className="me-2"
                                />
                                {userPerQty?.balance}
                              </span>
                            </li>
                            <li>
                              <span className="key">Converted Amount</span>
                              <span className="value">
                                $ {fixedDecimalValue(convertAmount)}
                              </span>
                            </li>
                            {/* <li>
                            <span className="key">Auction Starting Date</span>
                            <span className="value">Right after listing</span>
                          </li> */}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="sticky-bottom-fix px-5">
                      <div className="ut-cards">
                        {/* available cards */}
                        <div className="ut-convert-btn">
                          <Button
                            className="btn btn-dark w-100"
                            onClick={handleGoBack}
                          >
                            Okay
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </>
  );
};

export default UtCoinRewards;
