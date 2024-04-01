import React, { useEffect, useState } from "react";
import { Button, Form, Offcanvas } from "react-bootstrap";
import {
  getUTCoinsList,
  utcoinsConvert,
  getJTCoinsGuildUserList,
} from "../../api/methods";
import { MdCompareArrows } from "react-icons/md";
import dogeCoin from "../../images/dogecoin.png";
import { CgArrowsExchangeV } from "react-icons/cg";
import { FaCheckCircle } from "react-icons/fa";
import { BiArrowBack } from "react-icons/bi";
import "./style.scss";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { user_load_by_token_thunk } from "../../redux/thunk/user_thunk";
import { getCookies } from "../../utils/cookies";
import { currencyFormat, blockInvalidChar } from "../../utils/common";
import { BsFillInfoCircleFill } from "react-icons/bs";
import ToolTip from "../tooltip";

const DogeCoinRewards = ({ dogeCoinRewardsPop, setDogeCoinRewardsPop }) => {
  const [convertUSD, setConvertUSD] = useState(false);
  const [popup, setPopup] = useState(false);
  const [dogeCoins, setDogeCoins] = useState([]);
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
      if (dogeCoinRewardsPop) {
        getDogeGuildUser(pageNo);
      }
    } else {
      if (dogeCoinRewardsPop) {
        getDogeCoins(pageNo);
      }
    }
  }, [dogeCoinRewardsPop]);

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
      )} DOGE to do the conversion.`
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
    setDogeCoinRewardsPop(false);
    setConvertUSD(false);
    setSuccess(false);
    setAmount(0);
  };
  const getDogeCoins = async (page) => {
    try {
      console.log("first");
      const result = await getUTCoinsList("DOGE", page);
      setMoreLoading(true);
      setDogeCoins(result?.data?.data?.asserts);
      setMinimumWithdraw(result?.data?.data?.minimum_withdraw);
      console.log(parseFloat(minimumWithdraw), "minimumWithdraw");

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
  const getLoadDogeCoins = async (page) => {
    try {
      const result = await getUTCoinsList("DOGE", page);
      setMoreLoading(true);
      setDogeCoins([...dogeCoins, ...result?.data?.data?.asserts]);
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

  const getDogeGuildUser = async (page) => {
    try {
      console.log("Second");

      const result = await getJTCoinsGuildUserList("DOGE", page);
      setMoreLoading(true);
      setDogeCoins(result?.data?.data?.asserts);
      setMinimumWithdraw(result?.data?.data?.minimum_withdraw);
      setNextPage(result?.data?.data?.next_page);
      setBalance(result.data?.data?.balance);
      setUserPerQty(result?.data?.data);

      setMoreLoading(false);
    } catch (error) {
      setMoreLoading(false);
      console.log(
        "🚀 ~ file: wallet.js ~ line 84 ~ getDogeGuildUser ~ error",
        error
      );
    }
  };

  const getLoadDogeGuildUserCoins = async (page) => {
    try {
      const result = await getJTCoinsGuildUserList("DOGE", page);
      setMoreLoading(true);
      setDogeCoins([...dogeCoins, ...result?.data?.data?.asserts]);
      setNextPage(result?.data?.data?.next_page);
      setBalance(result.data?.data?.balance);
      //setUserPerQty(result?.data?.data);

      setMoreLoading(false);
    } catch (error) {
      setMoreLoading(false);
      console.log(
        "🚀 ~ file: wallet.js ~ line 84 ~ getLoadDogeGuildUserCoins ~ error",
        error
      );
    }
  };

  const loadMore = () => {
    if (user?.guild_user) {
      getLoadDogeGuildUserCoins(pageNo + 1);
    } else {
      getLoadDogeCoins(pageNo + 1);
    }
    setPageNo(pageNo + 1);
  };

  // const utcoinslevel = user?.doge_balance ? user?.doge_balance : 0;

  const handleUTInputChange = (e) => {
    let count = user?.doge_balance ? user?.doge_balance : 0;

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
      const result = await utcoinsConvert("DOGE", coins);

      if (result.data.status) {
        const token = getCookies();
        if (token) {
          dispatch(user_load_by_token_thunk(token));
        }
        setSuccess(true);
        getDogeCoins();

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

  const handleUTtranfericon = () => {
    if (coins) {
      setCoins(convertAmount);
      let newamount = convertAmount * parseFloat(userPerQty.usd_per_qty);
      setAmount(newamount);
    }
  };

  const CloseModal = () => {
    setConvertUSD(false);
    setSuccess(false);
    setAmount(0);
    setDogeCoinRewardsPop(false);
  };

  const fixedDecimalValue = (convertDecimalAmount) => {
    if (convertDecimalAmount) {
      let intFloat = convertDecimalAmount.toString().split(".");
      if (intFloat.length > 1 && intFloat[1].length > 2) {
        return parseFloat(convertDecimalAmount).toFixed(2);
      } else return convertAmount;
    }
  };

  return (
    <>
      <div className="ut-coin-container">
        <Offcanvas
          show={dogeCoinRewardsPop}
          onHide={() => setDogeCoinRewardsPop(!dogeCoinRewardsPop)}
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
                          onClick={() =>
                            setDogeCoinRewardsPop(!dogeCoinRewardsPop)
                          }
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
                              <h5 className="card-title">Available DOGE</h5>
                              <p className="wallet-num">
                                <img
                                  src={dogeCoin}
                                  className="me-2"
                                  width="35px"
                                  height="35px"
                                />
                                {user?.doge_balance}
                              </p>
                            </div>
                            {!user.guild_user ? (
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
                            ) : (
                              <div>
                                <h6 className="jtpoint-info">
                                  DOGE you earned from the tournaments are
                                  credited to the Guild admin account.
                                </h6>
                              </div>
                            )}
                          </div>
                          {dogeCoins.length > 0 ? (
                            <div className="logLists mt-5">
                              <h4>Transactions</h4>
                              {dogeCoins.map((coinslist, i) => (
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
                                      <img src={dogeCoin} />
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
                          onClick={() =>
                            setDogeCoinRewardsPop(!dogeCoinRewardsPop)
                          }
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
                        Convert DOGE to USD
                      </div>
                      <div
                        className="close-button-pop"
                        //onClick={() => setDogeCoinRewardsPop(!dogeCoinRewardsPop)}
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
                                  <div className="convertor-text">DOGE</div>
                                  <div className="convertor-text convertor-text-balance-desk">
                                    <span className="me-2">Balance: </span>
                                    <img
                                      src={dogeCoin}
                                      className="me-2"
                                      width="16px"
                                    />
                                    <span>{user?.doge_balance - coins}</span>
                                  </div>
                                </div>
                                <Form.Group
                                  className="mb-3"
                                  controlId="formBasicEmail"
                                >
                                  <Form.Control
                                    type="number"
                                    className="form-control-lg"
                                    placeholder="Enter DOGE to convert"
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
                                    src={dogeCoin}
                                    className="me-2"
                                    width="16px"
                                  />
                                  <span>{user?.doge_balance - coins}</span>
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
                                    {parseFloat(minimumWithdraw)} DOGE
                                  </span>
                                )}
                              </div>
                              <div className="note-comments">
                                {" "}
                                1 DOGE TO {userPerQty?.usd_per_qty} USD{" "}
                                <ToolTip
                                  icon={
                                    <BsFillInfoCircleFill
                                      size={16}
                                      className="mb-1 check-icon"
                                    />
                                  }
                                  content={
                                    "Conversion rate for information purpose only. Rate during actual conversion may differ."
                                  }
                                  placement="top"
                                />
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
                        // onClick={() => setDogeCoinRewardsPop(!dogeCoinRewardsPop)}
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
                              <span className="key">Available DOGE</span>
                              <span className="value d-flex align-items-center">
                                <img
                                  src={dogeCoin}
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

export default DogeCoinRewards;
