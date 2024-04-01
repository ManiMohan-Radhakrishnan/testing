import React, { useEffect, useState } from "react";
import { Navbar, Nav, Dropdown, Container } from "react-bootstrap";
import { useHistory } from "react-router";
import { useLocation } from "react-router";
import { BiBell, BiHelpCircle } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import { FaDiscord } from "react-icons/fa";
import { CgMenuRight } from "react-icons/cg";
import { VscChromeClose } from "react-icons/vsc";
import dayjs from "dayjs";

import {
  user_load_by_token_thunk,
  user_logout_thunk,
  market_live_thunk,
  market_live_off_thunk,
  get_cart_list_thunk,
} from "../../redux/thunk/user_thunk";

import { accountDetail } from "../../api/actioncable-methods";
import { getNotificationApi, readNotificationApi } from "./../../api/methods";
import { getTransferNftMenu } from "../../api/methods-marketplace";

import {
  currencyFormat,
  formattedNumber,
  openWindow,
  openWindowBlank,
  roundDown,
  withoutRound,
} from "./../../utils/common";
import { getCookies } from "../../utils/cookies";

import NFTCounter from "../nft-counter";

import cartIcon from "../../images/jump-trade/cart_icon.svg";
import userImg from "../../images/user_1.png";
import depositIcon from "../../images/noti/deposit.svg";
import bidIcon from "../../images/bid.svg";
import buyIcon from "../../images/buy.svg";
import outbidIcon from "../../images/outbid.svg";
import moneyWithdraw from "../../images/noti/withdraw-icon.svg";
// import JumpTradeLogo from "../../images/jump-trade/jump-trade-logo.svg";
import JumpTradeLogo from "../../images/jump-trade/jump-trade.svg";

import "./style.scss";
import useWindowUtils from "../../hooks/useWindowUtils";
import { useQuery } from "../../hooks/url-params";

const Header3 = ({ hideOptions = false }) => {
  const market_start_date = "Jul 13, 2022 11:30:00";

  const [market_time, set_market_time] = useState();
  const [showTransferNftMenu, setShowTransferNftMenu] = useState(false);

  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const query = useQuery(location.search);
  const fsz = query.get("fsz");
  const state = useSelector((state) => state);

  const [notiLoading, setNotiLoading] = useState(false);
  const [npage, setNPage] = useState(1);
  const [notification, setNotification] = useState();
  // const [notiRead, setNotiRead] = useState(false);

  const { user, cart } = state;
  const slug = user?.data?.user?.slug;
  const userCart = cart?.data ? cart?.data : null;
  const { width } = useWindowUtils();

  const isMin = width < 767;

  // console.log(user?.marketLive, "mrk");

  const timeFunction = (check = false) => {
    var offset = new Date().getTimezoneOffset();

    var market_start_date_utc = new Date(market_start_date);
    market_start_date_utc.setMinutes(
      market_start_date_utc.getMinutes() - offset
    );

    var s_time = new Date();

    if (check) s_time.setSeconds(s_time.getSeconds() + 2);

    if (new Date(market_start_date_utc) < s_time) {
      // set_market_started(true);
      // setIsLive(true);
      dispatch(market_live_thunk());
    } else {
      set_market_time(market_start_date_utc);
      dispatch(market_live_off_thunk());
    }
  };

  const handleTransferNftMenu = async () => {
    try {
      const result = await getTransferNftMenu();
      setShowTransferNftMenu(result?.data?.data?.drops_available);
    } catch (err) {
      console.log("err", err?.response?.data?.data?.message);
    }
  };

  useEffect(() => {
    handleTransferNftMenu();
    timeFunction(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheck = () => {
    timeFunction(true);
  };

  useEffect(() => {
    accountDetail(slug, () => {
      dispatch(user_load_by_token_thunk(getCookies()));
    });
    // handleGetNotification(npage);
    dispatch(get_cart_list_thunk());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const handleChangeLang = () => {
  //   const u_lang = lang === "en" ? "hi" : "en";
  //   setLanguage(u_lang);
  // dispatch(change_lang_action(u_lang));
  // };

  const handleGetNotification = async (input) => {
    try {
      setNotiLoading(true);
      const result = await getNotificationApi(input);
      setNotiLoading(false);
      if (input === 1) {
        setNotification(result.data.data);
        // if (result.data.data.total > 0) {
        //   setNotiRead(result.data.data.notifications_read);
        // }
      } else {
        setNotification({
          ...notification,
          notifications: [
            ...notification.notifications,
            ...result.data.data.notifications,
          ],
          next_page: result.data.data.next_page,
        });
      }
    } catch (error) {
      setNotiLoading(false);

      console.log(
        "🚀 ~ file: index.js ~ line 49 ~ handleGetNotification ~ error",
        error
      );
    }
  };

  const readNotification = async () => {
    try {
      const result = await readNotificationApi();
    } catch (error) {
      console.log(
        "🚀 ~ file: index.js ~ line 61 ~ readNotification ~ error",
        error
      );
    }
  };

  const DropToggle = React.forwardRef(({ onClick }, ref) => {
    return (
      <Nav.Link
        role={"button"}
        id="drop_outer"
        ref={ref}
        onMouseOver={(e) => {
          e.preventDefault();
          onClick(e);
        }}
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
      >
        <span className="blink_contest">
          Drops
          <span className="new-badge">new</span>
        </span>
      </Nav.Link>
    );
  });

  const SpinAndWinToggle = React.forwardRef(({ onClick }, ref) => {
    return (
      <Nav.Link
        id="drop_outer"
        role={"button"}
        ref={ref}
        onMouseOver={(e) => {
          e.preventDefault();
          onClick(e);
        }}
        onClick={(e) => {
          e.preventDefault();
          window.open(
            `${process.env.REACT_APP_MARKETPLACE_URL}/nft-marketplace/spin-contest`,
            "_blank"
          );
        }}
      >
        <span className="pre-btn">{`Spin & Win`}</span>
        {/* <span className="new-badge">new</span> */}
      </Nav.Link>
    );
  });

  const UserToggleComponent = React.forwardRef(({ onClick }, ref) => (
    <UserComponent
      user={state.user.data.user}
      sref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    />
  ));

  const NotificationToggleComponent = React.forwardRef(({ onClick }, ref) => {
    return (
      <div
        // className={`header-hide-mobile`}
        ref={ref}
        role="button"
        onClick={(e) => {
          e.preventDefault();
          onClick(e);

          if (!notification) {
            // setNotiRead(true);
            handleGetNotification(npage);
          }
        }}
      >
        <BiBell size={25} color={"white"} />

        {/* {!notiRead && (
          <>
            <span className="nofi-color"> </span>
          </>
        )} */}
      </div>
    );
  });

  const NotiCard = ({ data }) => {
    const handleNotiClick = () => {
      if (data.reason === "deposit") {
        history.push("/accounts/wallet");
      }
    };

    return (
      <div className="noti-message" role="button" onClick={handleNotiClick}>
        {/* {(() => {
          if (data.activity_type === "deposit") {
            return <img src={depositIcon} alt="notification-icon" />;
          } else if (data.activity_type === "withdraw") {
            return <img src={moneyWithdraw} alt="notification-icon" />;
          } else if (data?.nft_cover_url) {
            return <img src={data?.nft_cover_url} alt="notification-icon" />;
          } else {
            return <img src={buyIcon} alt="notification-icon" />;
          }
        })()} */}
        {data?.img_url ? (
          <>
            <img src={data?.img_url} alt="notification-icon" />
          </>
        ) : (
          <>
            {" "}
            <img
              src="https://cdn.guardianlink.io/product-hotspot/images/log-in-new.png"
              alt="notification-icon"
            />
          </>
        )}
        {/* {(() => {
          if (data.activity_type === "deposit") {
            return <img src={depositIcon} alt="notification icon" />;
          } else if (
            data.activity_type === "reward" ||
            data.activity_type === "ownership_credit" ||
            data.activity_type === "buy"
          ) {
            return <img src={buyIcon} alt="notification icon" />;
          } else if (data.activity_type === "bid") {
            if (data.reason === "bid_lock" || data.reason === "bid_success") {
              return <img src={bidIcon} alt="notification icon" />;
            } else if (
              data.reason === "bid_expired" ||
              data.reason === "bid_closed" ||
              data.reason === "bid_outdated" ||
              data.reason === "bid_cancelled" ||
              data.reason === "bid_received"
            ) {
              return <img src={outbidIcon} alt="notification icon" />;
            }
          } else if (data.activity_type === "withdraw") {
            return <img src={moneyWithdraw} alt="notification icon" />;
          } else {
            return "";
          }
        })()} */}
        <div className="noti-message-content">
          <>
            <div className="title">{data.title}</div>
            <div className="desc text-secondary">{data.desc}</div>
            <div className="noti-time">
              {dayjs(data.created_at).format("DD MMM YYYY hh:mma")}
            </div>
          </>
          {/* {(() => {
            if (data.activity_type === "deposit") {
              return (
                <>
                  <div className="title">Deposit Successful</div>
                  <div className="desc text-secondary">
                    Your payment of{" "}
                    {currencyFormat(formattedNumber(data?.amount, 2), "USD")}{" "}
                    was successfully processed to your wallet! Happy NFT buying
                  </div>
                  <div className="noti-time">
                    {dayjs(data.created_at).format("DD MMM YYYY hh:mma")}
                  </div>
                </>
              );
            } else if (data.activity_type === "reward") {
              return (
                <>
                  <div className="title">{data.title}</div>
                  <div className="desc text-secondary">{data.desc}</div>
                  <div className="noti-time">
                    {dayjs(data.created_at).format("DD MMM YYYY hh:mma")}
                  </div>
                </>
              );
              } else if (data.activity_type === "reward") {
                return (
                  <>
                    <div className="title">{data.title}</div>
                    <div className="desc text-secondary">{data.desc}</div>
                    <div className="noti-time">
                      {dayjs(data.created_at).format("DD MMM YYYY hh:mma")}
                    </div>
                  </>
                );
              } else if (data.activity_type === "reward") {
                return (
                  <>
                    <div className="title">{data.title}</div>
                    <div className="desc text-secondary">{data.desc}</div>
                    <div className="noti-time">
                      {dayjs(data.created_at).format("DD MMM YYYY hh:mma")}
                    </div>
                  </>
                );
            } else if (data.activity_type === "ownership_credit") {
              return (
                <>
                  <div className="title">{data.title}</div>
                  <div className="desc text-secondary">{data.desc}</div>
                  <div className="noti-time">
                    {dayjs(data.created_at).format("DD MMM YYYY hh:mma")}
                  </div>
                </>
              );
            } else if (data.activity_type === "bid") {
              return (
                <>
                  {(() => {
                    if (data.reason === "bid_lock") {
                      return (
                        <>
                          <div className="title">Bid Locked</div>
                          <div className="desc text-secondary">
                            <>
                              Your bid of{" "}
                              <b>
                                {currencyFormat(
                                  formattedNumber(data?.amount, 2),
                                  "USD"
                                )}
                              </b>{" "}
                              is locked for{" "}
                              <b>
                                {data.celebrity_name}
                                's {data.nft_name}
                              </b>{" "}
                              from <b>{data.buyer_name}</b>{" "}
                            </>
                          </div>
                          <div className="noti-time">
                            {dayjs(data.created_at).format(
                              "DD MMM YYYY hh:mma"
                            )}
                          </div>
                        </>
                      );
                    } else if (
                      data.reason === "bid_expired" ||
                      data.reason === "bid_closed"
                    ) {
                      return (
                        <>
                          <div className="title">Bid Expired</div>
                          <div className="desc text-secondary">
                            <>
                              Your bid{" "}
                              <b>
                                {currencyFormat(
                                  formattedNumber(data?.amount, 2),
                                  "USD"
                                )}
                              </b>{" "}
                              was expired for{" "}
                              <b>
                                {data.celebrity_name}
                                's {data.nft_name}
                              </b>{" "}
                              from <b>{data.seller_name}</b>
                            </>
                          </div>
                          <div className="noti-time">
                            {dayjs(data.created_at).format(
                              "DD MMM YYYY hh:mma"
                            )}
                          </div>
                        </>
                      );
                    } else if (data.reason === "bid_outdated") {
                      return (
                        <>
                          <div className="title">Bid Outdated</div>
                          <div className="desc text-secondary">
                            <>
                              Your bid{" "}
                              <b>
                                {currencyFormat(
                                  formattedNumber(data?.amount, 2),
                                  "USD"
                                )}
                              </b>{" "}
                              was outdated for{" "}
                              <b>
                                {data.celebrity_name}
                                's {data.nft_name}
                              </b>{" "}
                              from <b>{data.buyer_name}</b>
                            </>
                          </div>
                          <div className="noti-time">
                            {dayjs(data.created_at).format(
                              "DD MMM YYYY hh:mma"
                            )}
                          </div>
                        </>
                      );
                    } else if (data.reason === "bid_cancelled") {
                      return (
                        <>
                          <div className="title">Bid Cancelled</div>
                          <div className="desc text-secondary">
                            <>
                              Your bid{" "}
                              <b>
                                {currencyFormat(
                                  formattedNumber(data?.amount, 2),
                                  "USD"
                                )}
                              </b>{" "}
                              was cancelled for{" "}
                              <b>
                                {data.celebrity_name}
                                's {data.nft_name}
                              </b>{" "}
                              by <b>{data.seller_name}</b>
                            </>
                          </div>
                          <div className="noti-time">
                            {dayjs(data.created_at).format(
                              "DD MMM YYYY hh:mma"
                            )}
                          </div>
                        </>
                      );
                    } else if (data.reason === "bid_success") {
                      return (
                        <>
                          {data.payment_type === "debit" ? (
                            <>
                              <div className="title">Bid Successfull</div>
                              <div className="desc text-secondary">
                                <>
                                  Your bid{" "}
                                  <b>
                                    {" "}
                                    {currencyFormat(
                                      formattedNumber(data?.amount, 2),
                                      "USD"
                                    )}
                                  </b>{" "}
                                  was successful for{" "}
                                  <b>
                                    {" "}
                                    {data.celebrity_name}
                                    's {data.nft_name}
                                  </b>{" "}
                                  from <b>{data.buyer_name}</b>
                                </>
                              </div>
                              <div className="noti-time">
                                {dayjs(data.created_at).format(
                                  "DD MMM YYYY hh:mma"
                                )}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="title">Bid Successfull</div>
                              <div className="desc text-secondary">
                                <>
                                  Your{" "}
                                  <b>
                                    {data.celebrity_name}
                                    's {data.nft_name}
                                  </b>{" "}
                                  was sold for{" "}
                                  <b>
                                    {currencyFormat(
                                      formattedNumber(data?.amount, 2),
                                      "USD"
                                    )}
                                  </b>{" "}
                                  to <b>{data.buyer_name}</b>
                                </>
                              </div>
                              <div className="noti-time">
                                {dayjs(data.created_at).format(
                                  "DD MMM YYYY hh:mma"
                                )}
                              </div>
                            </>
                          )}
                        </>
                      );
                    } else if (data.reason === "bid_received") {
                      return (
                        <>
                          <div className="title">Bid Received</div>
                          <div className="desc text-secondary">
                            <>
                              You received{" "}
                              <b>
                                {" "}
                                {currencyFormat(
                                  formattedNumber(data?.amount, 2),
                                  "USD"
                                )}
                              </b>{" "}
                              bid for{" "}
                              <b>
                                {data.celebrity_name}
                                's {data.nft_name}
                              </b>{" "}
                              from <b>{data.buyer_name}</b>
                            </>
                          </div>
                          <div className="noti-time">
                            {dayjs(data.created_at).format(
                              "DD MMM YYYY hh:mma"
                            )}
                          </div>
                        </>
                      );
                    }
                  })()}
                </>
              );
            } else if (data.activity_type === "buy") {
              return (
                <>
                  {data.payment_type === "debit" ? (
                    <>
                      <div className="title">You Bought</div>
                      <div className="desc text-secondary">
                        <>
                          {dayjs(data.created_at).format("D MMM YYYY") ===
                          "22 Apr 2022" ? (
                            `Congratulations! You've successfully bought the Super Loot of Meta Cricket League!`
                          ) : (
                            <>
                              <b>
                                {data.celebrity_name}
                                's NFT{" "}
                              </b>
                              from <b>{data.seller_name}</b> for{" "}
                              <b>
                                {" "}
                                {currencyFormat(
                                  formattedNumber(data?.amount, 2),
                                  "USD"
                                )}
                              </b>{" "}
                            </>
                          )}
                        </>
                      </div>
                      <div className="noti-time">
                        {dayjs(data.created_at).format("DD MMM YYYY hh:mma")}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="title">You Sold</div>
                      <div className="desc text-secondary">
                        <>
                          You sold <b>{data.celebrity_name}'s NFT</b> to{" "}
                          <b>{data.buyer_name}</b> for{" "}
                          <b>
                            {" "}
                            {currencyFormat(
                              formattedNumber(data?.amount, 2),
                              "USD"
                            )}
                          </b>
                        </>
                      </div>
                      <div className="noti-time">
                        {dayjs(data.created_at).format("DD MMM YYYY hh:mma")}
                      </div>
                    </>
                  )}
                </>
              );
            } else if (data.activity_type === "withdraw") {
              return (
                <>
                  <div className="title">Withdraw</div>
                  <div className="desc text-secondary">
                    <>
                      {(() => {
                        if (data.reason === "withdraw_requested") {
                          return (
                            <>
                              {" "}
                              You <b>requested a withdraw</b> of{" "}
                              <b>
                                {currencyFormat(
                                  formattedNumber(data?.amount, 2),
                                  "USD"
                                )}
                              </b>{" "}
                            </>
                          );
                        } else if (data.reason === "withdraw_cancelled") {
                          return (
                            <>
                              You <b>cancelled a withdraw request</b> of{" "}
                              <b>
                                {currencyFormat(
                                  formattedNumber(data?.amount, 2),
                                  "USD"
                                )}
                              </b>
                            </>
                          );
                        } else if (data.reason === "withdraw_success") {
                          return (
                            <>
                              You <b>withdraw request</b> of{" "}
                              <b>
                                {currencyFormat(
                                  formattedNumber(data?.amount, 2),
                                  "USD"
                                )}
                              </b>{" "}
                              was <b>successful</b>
                            </>
                          );
                        }
                      })()}
                    </>
                  </div>
                  <div className="noti-time">
                    {dayjs(data.created_at).format("DD MMM YYYY hh:mma")}
                  </div>
                </>
              );
            }
          })()} */}
        </div>
      </div>
    );
  };

  return (
    <>
      <div style={{ display: "none" }}>
        {market_time && (
          <NFTCounter time={market_time} handleEndEvent={handleCheck} />
        )}
      </div>
      <Navbar bg="dark" expand="md" sticky="top" variant="dark">
        <Container fluid>
          <Navbar.Brand role="button" className="head-title bl_logo">
            {/* Jump.trade
            <div
              className="sub-head-title header-powereby"
              role="button"
              onClick={() => openWindow(process.env.REACT_APP_GUARDIAN_URL)}
            >
              Powered by GuardianLink
            </div> */}
            <img
              className="brand-logo"
              src={JumpTradeLogo}
              onClick={() =>
                window.open(process.env.REACT_APP_WEBSITE_URL, "_self")
              }
              role="button"
            />
            {/* <a
              class="guardian-link-brand"
              href="https://www.guardianlink.io/"
              target="_blank"
            >
              <span>|</span> A GuardianLink Brand
            </a> */}
          </Navbar.Brand>
          {!hideOptions && (
            <>
              <Nav className="d-flex me-0 ms-auto">
                {user.login ? (
                  <>
                    {/* <Nav.Link className="css-5cmxo2 me-3" id="drop_outer">
                      <div
                        className="pre-btn text-lower"
                        role="button"
                        onClick={() =>
                          window.open("https://pro.jump.trade/", "_blank")
                        }
                      >
                        d'Marketplace
                      </div>
                    </Nav.Link> */}

                    <Dropdown autoClose={["inside", "outside"]}>
                      <Dropdown.Toggle
                        align="start"
                        drop="start"
                        as={DropToggle}
                      ></Dropdown.Toggle>

                      <Dropdown.Menu align="end">
                        <Dropdown.Item
                          as="button"
                          onClick={() =>
                            window.open(
                              `${process.env.REACT_APP_MARKETPLACE_URL}/drop/tornado/tornado-pass`,
                              "_blank"
                            )
                          }
                        >
                          <span className="blink_contest">
                            Tornado Master NFTs{" "}
                            <span className="new-badge">new</span>
                          </span>
                        </Dropdown.Item>
                        <Dropdown.Item
                          as="button"
                          onClick={() =>
                            window.open(
                              `${process.env.REACT_APP_BALL_NFT_URL}`,
                              "_blank"
                            )
                          }
                        >
                          <span
                          // className="blink_contest"
                          >
                            MCL BALL NFTs
                            {/* <span className="new-badge">new</span> */}
                          </span>
                        </Dropdown.Item>
                        <Dropdown.Item
                          as="button"
                          onClick={() =>
                            window.open(
                              `${
                                process.env.REACT_APP_MARKETPLACE_URL
                              }/drop/free-mcl-mega-pass${
                                fsz ? `?fsz=${fsz}` : ""
                              }`,
                              "_blank"
                            )
                          }
                        >
                          <span
                          // className="blink_contest"
                          >
                            MCL Mega Pass
                            {/* <span className="new-badge">new</span> */}
                          </span>
                        </Dropdown.Item>
                        <Dropdown.Item
                          as="button"
                          onClick={() =>
                            window.open(
                              `${process.env.REACT_APP_HURLEY_URL}`,
                              "_blank"
                            )
                          }
                        >
                          HURLEY NFTs
                        </Dropdown.Item>
                        <Dropdown.Item
                          as="button"
                          onClick={() =>
                            window.open(
                              `${
                                process.env.REACT_APP_MARKETPLACE_URL
                              }/drop/mcl-founder-pass${
                                fsz ? `?fsz=${fsz}` : ""
                              }`,
                              "_blank"
                            )
                          }
                        >
                          MCL Founder Pass
                        </Dropdown.Item>
                        {/* <Dropdown.Item
                          as="button"
                          onClick={() =>
                            window.open(
                              `${process.env.REACT_APP_HURLEY_URL}`,
                              "_blank"
                            )
                          }
                        >
                          <span className="blink_contest">
                            HURLEY NFTs
                            <span className="new-badge">new</span>
                          </span>
                        </Dropdown.Item> */}

                        <Dropdown.Item
                          as="button"
                          onClick={() =>
                            window.open(
                              `${process.env.REACT_APP_MARKETPLACE_URL}/drop/mcl-fusor-nfts`,
                              "_blank"
                            )
                          }
                        >
                          <span
                          // className="blink_contest"
                          >
                            MCL Fusor NFTs
                            {/* <span className="new-badge">new</span> */}
                          </span>
                        </Dropdown.Item>
                        <Dropdown.Item
                          as="button"
                          onClick={() =>
                            window.open(
                              `${process.env.REACT_APP_RADDX_URL}`,
                              "_blank"
                            )
                          }
                        >
                          <span
                          // className="blink_contest"
                          >
                            RADDX Metaverse NFTs
                            {/* <span className="new-badge">new</span> */}
                          </span>
                        </Dropdown.Item>
                        {/* <Dropdown.Item
                          as="button"
                          onClick={() =>
                            window.open(
                              `${process.env.REACT_APP_MARKETPLACE_URL}/drop/free-mcl-pass`,
                              "_blank"
                            )
                          }
                        >
                          <span className="">
                            MCL Play Pass
                            <span className="new-badge">new</span>
                          </span>
                        </Dropdown.Item> */}
                        <Dropdown.Item
                          as="button"
                          onClick={() =>
                            window.open(
                              `${process.env.REACT_APP_MARKETPLACE_URL}/drop/mcl-shot-nfts`,
                              "_blank"
                            )
                          }
                        >
                          <span>
                            MCL Signature Shots{" "}
                            {/* <span className="new-badge">new</span> */}
                          </span>
                        </Dropdown.Item>
                        <Dropdown.Item
                          as="button"
                          onClick={() =>
                            window.open(
                              `${process.env.REACT_APP_MARKETPLACE_URL}/drop/crypto-bat-nfts`,
                              "_blank"
                            )
                          }
                        >
                          Crypto Bat NFTs
                        </Dropdown.Item>

                        {/* <Dropdown.Item
                          as="button"
                          onClick={() =>
                            window.open(
                              `${process.env.REACT_APP_MARKETPLACE_URL}/drop/play-pass`,
                              "_blank"
                            )
                          }
                        >
                          MCL Play Pass
                        </Dropdown.Item> */}
                      </Dropdown.Menu>
                    </Dropdown>
                    <Nav.Link className="css-5cmxo2 me-3" id="drop_outer">
                      <div
                        className="pre-btn text-lower"
                        role="button"
                        onClick={() =>
                          window.open(
                            `${process.env.REACT_APP_CALL_IT_EVENTS_URL}/events`,
                            "_blank"
                          )
                        }
                      >
                        <span className="blink_contest">
                          Callit <span className="new-badge">new</span>
                        </span>
                      </div>
                    </Nav.Link>
                    {/* <Nav.Link className="css-5cmxo2 me-3" id="drop_outer">
                      <div
                        className="sub-head-title"
                        role="button"
                        onClick={() =>
                          openWindow(
                            `${process.env.REACT_APP_DROP_URL}`,
                            "_blank"
                          )
                        }
                      >
                        Drop
                      </div>
                    </Nav.Link> */}
                    <Nav.Link className="css-5cmxo2 me-3" id="drop_outer">
                      <div
                        onClick={() =>
                          openWindow(
                            `${process.env.REACT_APP_MARKETPLACE_URL}/nft-rental`,
                            "_blank"
                          )
                        }
                      >
                        <span className="beta-container">
                          <span className="beta-tag">Beta</span>
                          Rental
                        </span>
                      </div>
                    </Nav.Link>
                    {/* <Nav.Link className="css-5cmxo2 me-3" id="drop_outer">
                      <div
                        className="sub-head-title"
                        role="button"
                        onClick={() => {
                          if (user?.marketLive) {
                            openWindow(
                              `${process.env.REACT_APP_MARKETPLACE_URL}/tournaments`,
                              "_blank"
                            );
                          }
                        }}
                      >
                        <span className="blink_contest">
                          Tournaments
                          <span className="new-badge">new</span>
                        </span>
                      </div>
                    </Nav.Link> */}
                    {/* <Nav.Link className="css-5cmxo2 me-3" id="drop_outer">
                      <div
                        className="pre-btn"
                        onClick={() =>
                          openWindow(
                            `${process.env.REACT_APP_MARKETPLACE_URL}/nft-marketplace/spin-contest`,
                            "_blank"
                          )
                        }
                      >
                        Spin &amp; Win
                      </div>
                    </Nav.Link> */}
                    {/* <Dropdown
                      autoClose={["inside", "outside"]}
                      className="me-0"
                    >
                      <Dropdown.Toggle
                        align="start"
                        drop="start"
                        as={SpinAndWinToggle}
                      ></Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          as="button"
                          onClick={() =>
                            window.open(
                              `${process.env.REACT_APP_MARKETPLACE_URL}/referral-program`,
                              "_blank"
                            )
                          }
                        >
                          <span className={"beta-container"}>Refer & Earn</span>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown> */}
                    {/* <Nav.Link className="css-5cmxo2 me-3" id="drop_outer">
                      <div
                        className="sub-head-title"
                        role="button"
                        onClick={() => {
                          if (user?.marketLive) {
                            openWindow(
                              `${process.env.REACT_APP_MARKETPLACE_URL}/referral-program`,
                              "_blank"
                            );
                          }
                        }}
                      >
                        <span className="beta-container">
                          Refer & Earn
                          <span className="new-badge">new</span>
                        </span>
                      </div>
                    </Nav.Link> */}
                    <Nav.Link className="css-5cmxo2 me-3" id="drop_outer">
                      <div
                        className="theme-btn"
                        onClick={() =>
                          openWindow(
                            `${process.env.REACT_APP_MARKETPLACE_URL}/nft-marketplace`,
                            "_blank"
                          )
                        }
                      >
                        Explore Market
                      </div>
                    </Nav.Link>
                    {/* <Nav.Link className="css-5cmxo2 me-3" id="drop_outer">
                      <div
                        className="sub-head-title"
                        role="button"
                        onClick={() =>
                          history.push("/accounts/refer-earn-instruction")
                        }
                      >
                        <span className="beta-container">Refer-Earn</span>
                      </div>
                    </Nav.Link> */}
                    {/* <Nav.Link className="css-5cmxo2 me-3" id="drop_outer">
                      <div
                        className="sub-head-title"
                        role="button"
                        onClick={() =>
                          openWindow(
                            `
                            ${process.env.REACT_APP_MARKETPLACE_URL}/nft-marketplace/contest`,
                            "_blank"
                          )
                        }
                      >
                        <span className="beta-container">CONTEST</span>
                      </div>
                    </Nav.Link>{" "}
                    */}
                    {/* <Nav.Link
                      href="#home"
                      className="help_ic header-hide-mobile"
                    >
                      <BiHelpCircle
                        size={25}
                        role="button"
                        onClick={() =>
                          openWindowBlank(process.env.REACT_APP_HELP_URL)
                        }
                      />
                    </Nav.Link> */}
                    <Dropdown
                      autoClose={["inside", "outside"]}
                      onToggle={(e) => {
                        if (e) {
                          if (!notification) {
                            readNotification();
                          }
                          // setNotiRead(false);
                        }
                      }}
                    >
                      <Dropdown.Toggle
                        align="start"
                        drop="start"
                        as={NotificationToggleComponent}
                      ></Dropdown.Toggle>

                      <Dropdown.Menu align="end" className="noti-container">
                        <div className="noti-header">
                          <BiBell size={25} color={"white"} /> Notifications
                        </div>
                        <div className="noti-content">
                          {/* <div className="sub-header">Today</div> */}
                          {notification?.notifications.length > 0 ? (
                            <>
                              {notification?.notifications.map((o, i) => (
                                <Dropdown.Item key={`noti${i}`}>
                                  <NotiCard data={o} />
                                </Dropdown.Item>
                              ))}
                              {notiLoading && (
                                <div className="noti-load-more text-secondary">
                                  Loading...
                                </div>
                              )}
                              {notification?.next_page ? (
                                <div
                                  className="noti-load-more text-secondary"
                                  role="button"
                                  onClick={() => {
                                    setNPage(npage + 1);
                                    handleGetNotification(npage + 1);
                                  }}
                                >
                                  See More
                                </div>
                              ) : (
                                <div className="noti-load-more text-secondary">
                                  You have reached the end
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="noti-load-more text-secondary">
                              No notifications found
                            </div>
                          )}
                        </div>
                      </Dropdown.Menu>
                    </Dropdown>
                    <Nav.Link
                      href={`${process.env.REACT_APP_MARKETPLACE_URL}/#cart`}
                      className="cart_ic position-relative "
                      // header-hide-mobile
                      target={"_self"}
                    >
                      <img src={cartIcon} height={20} />
                      {parseInt(userCart?.total_count) > 0 && (
                        <span className="badge cart-count rounded-pill bg-danger position-absolute">
                          {userCart?.total_count}
                        </span>
                      )}
                    </Nav.Link>
                    <Dropdown className="header-menu-block">
                      <Dropdown.Toggle
                        align="start"
                        drop="start"
                        as={UserToggleComponent}
                      ></Dropdown.Toggle>

                      <Dropdown.Menu
                        align="end"
                        className="myprofille-drop-down"
                      >
                        <UserComponent user={state.user.data.user} />
                        {isMin ? (
                          <>
                            <Dropdown.Item
                              as="button"
                              onClick={() => history.push("/accounts/profile")}
                            >
                              My Profile
                            </Dropdown.Item>
                            <Dropdown.Item
                              as="button"
                              onClick={() => history.push("/accounts/mynft")}
                            >
                              My NFTs
                            </Dropdown.Item>
                            {showTransferNftMenu && (
                              <Dropdown.Item
                                as="button"
                                onClick={() =>
                                  history.push("/accounts/transfer-nft")
                                }
                              >
                                Transfer NFT
                              </Dropdown.Item>
                            )}
                            <Dropdown.Item
                              as="button"
                              onClick={() =>
                                history.push("/accounts/rented-nft")
                              }
                            >
                              My Borrowed NFTs
                              <i className="newbadge blink_me">new</i>
                            </Dropdown.Item>
                            <Dropdown.Item
                              as="button"
                              onClick={() => history.push("/accounts/my-cards")}
                            >
                              My Cards
                            </Dropdown.Item>
                            <Dropdown.Item
                              as="button"
                              onClick={() => history.push("/accounts/referral")}
                            >
                              Referral
                            </Dropdown.Item>
                            <Dropdown.Item
                              as="button"
                              onClick={() => history.push("/accounts/wallet")}
                            >
                              GuardianLink Wallet
                            </Dropdown.Item>
                            <Dropdown.Item
                              as="button"
                              onClick={() =>
                                history.push("/accounts/my-orders")
                              }
                            >
                              My Orders
                            </Dropdown.Item>
                            <Dropdown.Item
                              as="button"
                              onClick={() =>
                                history.push("/accounts/myinvoice")
                              }
                            >
                              My Invoices
                            </Dropdown.Item>
                            <Dropdown.Item
                              as="button"
                              onClick={() =>
                                history.push("/accounts/bid-activity")
                              }
                            >
                              My Bids
                            </Dropdown.Item>
                            <Dropdown.Item
                              as="button"
                              onClick={() =>
                                history.push("/accounts/pre-orders")
                              }
                            >
                              Pre Book
                            </Dropdown.Item>
                            <Dropdown.Item
                              as="button"
                              onClick={() =>
                                history.push("/accounts/game-pass")
                              }
                            >
                              Game Pass
                            </Dropdown.Item>
                            <Dropdown.Item
                              as="button"
                              onClick={() =>
                                history.push("/accounts/limit-orders")
                              }
                            >
                              Limit Orders
                              {/* <i className="newbadge blink_me">new</i> */}
                            </Dropdown.Item>
                            <Dropdown.Item
                              as="button"
                              onClick={() =>
                                history.push("/accounts/spin-wheel")
                              }
                            >
                              Spin the Wheel
                            </Dropdown.Item>
                            <Dropdown.Item
                              as="button"
                              onClick={() => history.push("/accounts/settings")}
                            >
                              Security Settings
                            </Dropdown.Item>
                            <Dropdown.Item
                              as="button"
                              onClick={() =>
                                history.push("/accounts/whitelist")
                              }
                            >
                              Whitelist Payment
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                              as="button"
                              onClick={() =>
                                window.open(
                                  process.env.REACT_APP_HELP_URL,
                                  "_blank"
                                )
                              }
                            >
                              Help Center
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                              as="button"
                              onClick={() => {
                                dispatch(user_logout_thunk());
                                window?.webengage.user.logout();
                              }}
                            >
                              Sign Out
                            </Dropdown.Item>
                          </>
                        ) : (
                          <>
                            <Dropdown.Item
                              as="button"
                              onClick={() => history.push("/accounts/profile")}
                            >
                              My Profile
                            </Dropdown.Item>

                            <Dropdown.Item
                              as="button"
                              onClick={() => history.push("/accounts/wallet")}
                            >
                              GuardianLink Wallet
                            </Dropdown.Item>

                            <Dropdown.Item
                              as="button"
                              onClick={() =>
                                history.push("/accounts/my-orders")
                              }
                            >
                              My Orders
                            </Dropdown.Item>
                            <Dropdown.Item
                              as="button"
                              onClick={() =>
                                history.push("/accounts/user-activity")
                              }
                            >
                              Activity
                            </Dropdown.Item>

                            <Dropdown.Item
                              as="button"
                              onClick={() =>
                                history.push("/accounts/spin-wheel")
                              }
                            >
                              Spin the Wheel
                            </Dropdown.Item>
                            <Dropdown.Item
                              as="button"
                              onClick={() => history.push("/accounts/settings")}
                            >
                              Security Settings
                            </Dropdown.Item>

                            <Dropdown.Divider />

                            <Dropdown.Divider />
                            <Dropdown.Item
                              as="button"
                              onClick={() => {
                                dispatch(user_logout_thunk());
                                // window?.webengage.user.logout();
                              }}
                            >
                              Sign Out
                            </Dropdown.Item>
                          </>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                  </>
                ) : (
                  <>
                    <Nav.Link href={`/signin`} target="_self">
                      Sign In
                    </Nav.Link>
                    <Nav.Link href={`/signup`} target="_self">
                      Sign Up
                    </Nav.Link>
                  </>
                )}
                <Nav.Link
                  className="discord_ic header-hide-mobile"
                  href={`https://discord.gg/guardianlink`}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  <FaDiscord size={25} />
                </Nav.Link>
              </Nav>
              <Dropdown
                autoClose={["inside", "outside"]}
                onToggle={(e) => {
                  // if (e) {
                  //   readNotification();
                  //   setNotiRead(false);
                  // }
                }}
              >
                <Dropdown.Toggle
                  align="start"
                  drop="start"
                  as={HeaderMobileMenuIcon}
                ></Dropdown.Toggle>

                <Dropdown.Menu align="end" className="side-menu">
                  <Dropdown.Item
                    drop="start"
                    as={HeaderMobileMenuCloseIcon}
                  ></Dropdown.Item>
                  <Dropdown.Item
                    onClick={() =>
                      window.open("https://pro.jump.trade/", "_blank")
                    }
                  >
                    <span className={"blink_contest"}>
                      d'Marketplace
                      <span className="new-badge">new</span>
                    </span>
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="show_mobile"
                    onClick={() =>
                      window.open(
                        `${process.env.REACT_APP_CALL_IT_EVENTS_URL}/events`,
                        "_blank"
                      )
                    }
                  >
                    <span className={"blink_contest"}>
                      Callit <span className="new-badge">new</span>
                    </span>
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="show_mobile"
                    href={`${process.env.REACT_APP_MARKETPLACE_URL}/drop/tornado/tornado-pass`}
                  >
                    <span className={"blink_contest"}>
                      Tornado Master NFTs <span className="new-badge">new</span>
                    </span>
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="show_mobile"
                    href={`${process.env.REACT_APP_BALL_NFT_URL}`}
                  >
                    <span
                    // className={"blink_contest"}
                    >
                      MCL BALL NFTs
                      {/* <span className="new-badge">new</span> */}
                    </span>
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="show_mobile"
                    href={`${
                      process.env.REACT_APP_MARKETPLACE_URL
                    }/drop/free-mcl-mega-pass${fsz ? `?fsz=${fsz}` : ""}`}
                  >
                    <span
                    // className={"blink_contest"}
                    >
                      MCL Mega Pass
                      {/* <span className="new-badge">new</span> */}
                    </span>
                  </Dropdown.Item>

                  <Dropdown.Item
                    className="show_mobile"
                    href={`${process.env.REACT_APP_HURLEY_URL}`}
                  >
                    HURLEY NFTs
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="show_mobile"
                    href={`${
                      process.env.REACT_APP_MARKETPLACE_URL
                    }/drop/mcl-founder-pass${fsz ? `?fsz=${fsz}` : ""}`}
                  >
                    MCL Founder Pass
                  </Dropdown.Item>

                  <Dropdown.Item
                    className="show_mobile"
                    href={`${process.env.REACT_APP_MARKETPLACE_URL}/drop/mcl-fusor-nfts`}
                  >
                    <span
                    // className={"blink_contest"}
                    >
                      MCL Fusor NFTs
                      {/* <span className="new-badge">new</span> */}
                    </span>
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="show_mobile"
                    onClick={() =>
                      window.open(
                        `${process.env.REACT_APP_RADDX_URL}`,
                        "_blank"
                      )
                    }
                  >
                    <span
                    // className={"blink_contest"}
                    >
                      RADDX Metaverse NFTs Drop
                      {/* <span className="new-badge">new</span> */}
                    </span>
                  </Dropdown.Item>
                  {/* <Dropdown.Item
                    href={`${process.env.REACT_APP_WEBSITE_URL}/mcl`}
                    target={"_blank"}
                  >
                    Drop
                  </Dropdown.Item>

                  <Dropdown.Item
                    href={process.env.REACT_APP_MARKETPLACE_URL}
                    target="_blank"
                  >
                    <span className="beta-container">
                      <span className="beta-tag">Beta</span>
                      Marketplace
                    </span>
                  </Dropdown.Item>
                  <Dropdown.Item
                    href={`${process.env.REACT_APP_MARKETPLACE_URL}/creator-application`}
                    target="_blank"
                  >
                    Creator
                  </Dropdown.Item> */}
                  {/* <Dropdown autoClose={["inside", "outside"]} className="me-0">
                    <Dropdown.Toggle
                      align="start"
                      drop="start"
                      as={DropToggle}
                    ></Dropdown.Toggle>

                    <Dropdown.Menu align="end">
                      <Dropdown.Item
                        as="button"
                        onClick={() =>
                          window.open(
                            `${process.env.REACT_APP_MCL_URL}`,
                            "_blank"
                          )
                        }
                      >
                        Meta Cricket League NFTs
                      </Dropdown.Item>
                      {/* <Dropdown.Item
                        as="button"
                        onClick={() =>
                          window.open(
                            `${process.env.REACT_APP_CHELSEA_URL}`,
                            "_blank"
                          )
                        }
                      >
                        Chelsea Memorabilia NFTs
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown> */}
                  {/*
                  <Dropdown.Item
                    href={`${process.env.REACT_APP_MARKETPLACE_URL}/drop/free-mcl-pass`}
                  >
                    <span className={""}>
                      MCL Play Pass Drop
                      <span className="new-badge">new</span>
                    </span>
                  </Dropdown.Item> */}
                  <Dropdown.Item
                    className="show_mobile"
                    href={`${process.env.REACT_APP_MARKETPLACE_URL}/drop/mcl-shot-nfts`}
                  >
                    <span>
                      MCL Signature Shots Drop
                      {/* <span className="new-badge">new</span> */}
                    </span>
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="show_mobile"
                    href={`${process.env.REACT_APP_MARKETPLACE_URL}/drop/crypto-bat-nfts`}
                  >
                    <span>
                      Crypto Bat NFTs Drop{" "}
                      {/* <span className="new-badge">new</span> */}
                    </span>
                  </Dropdown.Item>

                  <Dropdown.Item
                    href={`${process.env.REACT_APP_MARKETPLACE_URL}/tournaments`}
                    target="_blank"
                  >
                    <span className="blink_contest">
                      Tournaments <span className="new-badge">new</span>
                    </span>
                  </Dropdown.Item>
                  {/* <Dropdown.Item
                    href={`${process.env.REACT_APP_MARKETPLACE_URL}/nft-marketplace/spin-contest`}
                  >
                    <span className={"blink_contest"}>Spin &amp; Win</span>
                  </Dropdown.Item> */}
                  <Dropdown.Item
                    href={`${process.env.REACT_APP_MARKETPLACE_URL}/referral-program`}
                    target="_blank"
                  >
                    <span className="beta-container">
                      Refer & Earn
                      {/* <span className="new-badge">new</span> */}
                    </span>
                  </Dropdown.Item>
                  <Dropdown.Item
                    href={`${process.env.REACT_APP_HELP_URL}`}
                    target="_blank"
                  >
                    <span className="beta-container">Need Help ?</span>
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="show_mobile"
                    href={`${process.env.REACT_APP_MARKETPLACE_URL}/nft-marketplace`}
                    target="_blank"
                  >
                    <span className="theme-btn">Explore Market</span>
                  </Dropdown.Item>
                  {/* <Dropdown.Item
                    href={`${process.env.REACT_APP_MARKETPLACE_URL}/nft-marketplace/contest`}
                    target="_blank"
                  >
                    <span>Contest</span>
                  </Dropdown.Item> */}
                </Dropdown.Menu>
              </Dropdown>
            </>
          )}
        </Container>
      </Navbar>
    </>
  );
};

const UserComponent = ({ user, onClick = () => {}, sref }) => (
  <div
    // className={`header-user-details ${user?.og_user === true ? "og-user" : ""}`}
    className={`header-user-details`}
    onClick={onClick}
    ref={sref}
  >
    <div className="user-image-block">
      <img
        className="user-image"
        src={user.avatar_url ? user.avatar_url : userImg}
        alt="user-icon"
      />
    </div>

    <div className="user-name">
      {currencyFormat(withoutRound(user.balance), user.currency_name)}
    </div>
  </div>
);

const HeaderMobileMenuIcon = React.forwardRef(({ onClick }, ref) => {
  return (
    <div
      className="header-hide-mobile menu-icon"
      ref={ref}
      role="button"
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      <CgMenuRight size={25} color={"white"} />
    </div>
  );
});

const HeaderMobileMenuCloseIcon = React.forwardRef(({ onClick }, ref) => {
  return (
    <div
      className="close-icon"
      ref={ref}
      role="button"
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      <VscChromeClose size={25} color={"white"} />
    </div>
  );
});

export default Header3;
