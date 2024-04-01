/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import ContentLoader from "react-content-loader";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { userActivityApi } from "../../api/methods";
import userImg from "../../images/user_1.png";
import sampleNFT from "../../images/post1.png";
import { currencyFormat } from "../../utils/common";
import { FaCheckCircle } from "react-icons/fa";
import ToolTip from "../tooltip";
import "./_style.scss";
import { act } from "react-dom/test-utils";

const IndiggActivity = () => {
  const { user } = useSelector((state) => state.user.data);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [filterReasons, setFilterResons] = useState([
    {
      name: "Assigned",
      value: "guild_assigned",
      checked: true,
    },
    {
      name: "Revoked",
      value: "guild_revoked",
      checked: true,
    },
    // {
    //   name: "Withdrawal Requests",
    //   value: "withdraw_requested",
    //   checked: false,
    // },
    // { name: "Deposits", value: "deposit", checked: false },
    // {
    //   name: "Withdrawal Cancellations",
    //   value: "withdraw_cancelled",
    //   checked: false,
    // },
    // { name: "Successful Bid Placements", value: "bid_success", checked: false },
    // { name: "Expired Bids", value: "bid_expired", checked: false },
    // // { name: "Outdated Bids", value: "bid_outdated", checked: false },
    // { name: "Locked Funds", value: "bid_lock", checked: false },
    // // { name: "Admin Credit", value: "admin_credit", checked: false },
    // {
    //   name: "Successful NFT Purchases/Sold",
    //   value: "buy_success",
    //   checked: false,
    // },
    // // { name: "Admin Debit", value: "admin_debit", checked: false },
    // // { name: "Bids On Your NFTs", value: "bid_received", checked: false },
    // // { name: "Cancelled Bids", value: "bid_cancelled", checked: false },
    // {
    //   name: "Successful Withdrawals",
    //   value: "withdraw_success",
    //   checked: false,
    // },
    // {
    //   name: "Yield Royalty",
    //   value: "yield_royalty",
    //   checked: false,
    // },
  ]);

  useEffect(() => {
    getUserActivities(1, filterReasons);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserActivities = async (pgNo, filters) => {
    const filter_strings = filters
      .filter((obj) => obj.checked)
      .map((obj) => obj.value);

    try {
      setInitLoading(true);

      const result = await userActivityApi(pgNo ? pgNo : page, filter_strings);
      setData(result.data.data.nfts);
      setHasMore(result.data.data.next_page);
      setPage((page) => page + 1);
      setInitLoading(false);
    } catch (error) {
      setInitLoading(false);
      toast.error("An unexpected error occured. Please try again  later");
    }
  };

  const fetchMore = () => {
    fetchMoreList(page, filterReasons);
  };

  const fetchMoreList = async (pgNo, filters) => {
    try {
      if (!hasMore) {
        return;
      }

      const filter_strings = filters
        .filter((obj) => obj.checked)
        .map((obj) => obj.value);

      setPage((page) => page + 1);
      setLoading(true);
      const result = await userActivityApi(pgNo ? pgNo : page, filter_strings);
      setData([...data, ...result.data.data.nfts]);
      setHasMore(result.data.data.next_page);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("An unexpected error occured. Please try again  later");
    }
  };

  const handleFilterClick = (input) => {
    const info = [...filterReasons];
    const filter_strings = filterReasons
      .filter((obj) => obj.checked)
      .map((obj) => obj.value);

    const index = info.findIndex((obj) => obj.value === input);

    const Check_filter_strings = filterReasons
      .filter((obj) => obj.checked)
      .map((obj) => obj.value == input);
    console.log(Check_filter_strings, "Check_filter_strings");

    if (filter_strings.length == 1 && Check_filter_strings[0]) {
      return false;
    }

    info[index] = { ...info[index], checked: !info[index].checked };

    setFilterResons(info);

    getUserActivities(1, info);
  };

  return (
    <>
      {/* <div className="col-md-10"> */}
      <div className="main-content-block">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="wallet-user mt-3">
                <div className="row align-items-center">
                  <div className="col-lg-7">
                    <h3 className="wallet-title">Guild Activities </h3>
                  </div>
                </div>
              </div>
              <div className="bid-activity">
                <div className="banner-content">
                  <div className="media">
                    <div className="media-body">
                      {/* <div className="dropdown user-meta">
                      <span className="bid_filter">Filter By </span>
                      <button
                        className="btn btn-secondary dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton1"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <span> Most Recent</span>
                      </button>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuButton1"
                      >
                        <li>
                          <a className="dropdown-item" href="#">
                            Action
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            Another action
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            Something else here
                          </a>
                        </li>
                      </ul>
                    </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              {initLoading ? (
                <ActivityList />
              ) : (
                <div className="row">
                  <div className="col-12 col-lg-4 order-lg-2 ">
                    <div className="d-flex flex-wrap filter-activity-box">
                      <h3 className="mb-2">Filters</h3>
                      <hr className="w-100" />
                      {filterReasons.map((obj, i) => (
                        <div
                          role={"button"}
                          className={`rounded-pill ps-3 pe-3 text-size mb-3 me-3 pt-1 pb-1 activity-filter-pill ${
                            obj.checked ? "active" : ""
                          }`}
                          key={`filter-pill${i}`}
                          onClick={() => handleFilterClick(obj.value)}
                        >
                          {obj.checked && (
                            <FaCheckCircle
                              color={"white"}
                              size={17}
                              className="me-2"
                            />
                          )}

                          {obj.name}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-12 col-lg-8 order-lg-1">
                    <div className="activity-notification">
                      {data.length > 0 ? (
                        <>
                          {data.map((activity, i) => {
                            if (
                              ["guild_rent"].includes(activity.activity_type)
                            ) {
                              return (
                                <div
                                  id={`activity${i}`}
                                  className="post-header"
                                >
                                  <span className="time-ago hide-mobile">
                                    {dayjs(activity?.created_at).format(
                                      " D MMM YYYY hh:mm a"
                                    )}
                                  </span>
                                  <div className="media">
                                    <div className="user-img">
                                      {["guild_rent"].includes(
                                        activity.activity_type
                                      ) ? (
                                        <img
                                          src={
                                            activity.nft_cover_url
                                              ? activity.nft_cover_url
                                              : sampleNFT
                                          }
                                          // src={
                                          //   user.avatar_url
                                          //     ? user.avatar_url
                                          //     : userImg
                                          // }
                                          alt={activity.nft_name}
                                        />
                                      ) : (
                                        <img
                                          src={
                                            user?.avatar_url
                                              ? user?.avatar_url
                                              : userImg
                                          }
                                          alt={user.first_name}
                                        />
                                      )}
                                    </div>
                                    <div className="media-body">
                                      <div className="user-title">
                                        <a href="javascript:void(0);">
                                          {(() => {
                                            if (
                                              activity.activity_type === "login"
                                            ) {
                                              return "You've Successfully Signed In!";
                                            } else if (
                                              activity.activity_type ===
                                              "logout"
                                            ) {
                                              return "You've Successfully Signed Out";
                                            } else if (
                                              activity.activity_type === "guild"
                                            ) {
                                              return activity.title;
                                            } else if (
                                              activity.activity_type === "yield"
                                            ) {
                                              return "Your NFT Has Generated Fresh Yields!";
                                            } else if (
                                              activity.activity_type ===
                                              "deposit"
                                            ) {
                                              return "You've Successfully Deposited Your Funds!";
                                            } else if (
                                              activity.activity_type ===
                                              "reward"
                                            ) {
                                              return activity.title;
                                            } else if (
                                              activity.activity_type ===
                                              "upgrade"
                                            ) {
                                              return "You've Successfully Upgraded your NFT!";
                                            } else if (
                                              activity.activity_type ===
                                              "tournament_win"
                                            ) {
                                              return activity.title;
                                            } else if (
                                              activity.activity_type ===
                                              "conversion"
                                            ) {
                                              return activity.title;
                                            } else if (
                                              activity.activity_type === "bid"
                                            ) {
                                              if (
                                                activity.reason === "bid_lock"
                                              ) {
                                                return "Your Bid Has Locked Your Funds!";
                                              } else if (
                                                activity.reason ===
                                                  "bid_expired" ||
                                                activity.reason === "bid_closed"
                                              ) {
                                                return "Your Bid Has Expired!";
                                              } else if (
                                                activity.reason ===
                                                "bid_outdated"
                                              ) {
                                                return "Your Bid Is Outdated!";
                                              } else if (
                                                activity.reason ===
                                                "bid_success"
                                              ) {
                                                if (
                                                  activity.payment_type ===
                                                  "debit"
                                                ) {
                                                  return "Congrats! Your Bid Has Won!";
                                                } else {
                                                  return "Congrats! You've Succesfully Sold Your NFT!";
                                                }
                                              } else if (
                                                activity.reason ===
                                                "bid_received"
                                              ) {
                                                return "Your NFT Has Got a Bid!";
                                              } else if (
                                                activity.reason ===
                                                "bid_cancelled"
                                              ) {
                                                return "Your Bid Has Cancelled!";
                                              }
                                            } else if (
                                              activity.activity_type === "buy"
                                            ) {
                                              if (
                                                activity.payment_type ===
                                                "debit"
                                              ) {
                                                return "Congrats! You've Successfully Purchased Your NFT!";
                                              } else {
                                                return "Congrats! You've Successfully Sold Your NFT!";
                                              }
                                            } else if (
                                              activity.activity_type ===
                                              "withdraw"
                                            ) {
                                              if (
                                                activity.reason ===
                                                "withdraw_requested"
                                              ) {
                                                return "You've Placed A Withdrawal Request!";
                                              } else if (
                                                activity.reason ===
                                                "withdraw_cancelled"
                                              ) {
                                                return "You've Cancelled Your Withdrawal Request!";
                                              } else if (
                                                activity.reason ===
                                                "withdraw_success"
                                              ) {
                                                return "You've Successfully Withdrawn Your Funds!";
                                              }
                                            } else if (
                                              activity.activity_type ===
                                                "guild_rent" &&
                                              activity.reason ==
                                                "guild_assigned"
                                            ) {
                                              return "NFT Assigned";
                                            } else if (
                                              activity.activity_type ===
                                                "guild_rent" &&
                                              activity.reason == "guild_revoked"
                                            ) {
                                              return "NFT Revoked";
                                            }
                                          })()}
                                        </a>
                                      </div>
                                      {(() => {
                                        if (
                                          activity.activity_type ===
                                          "guild_rent"
                                        ) {
                                          return (
                                            <p className="notify-p">
                                              {activity?.reason ==
                                                "guild_assigned" && (
                                                <>
                                                  {activity?.seller_name} has
                                                  assigned {activity?.nft_name}{" "}
                                                  to {activity?.buyer_name}
                                                </>
                                              )}
                                              {activity?.reason ==
                                                "guild_revoked" && (
                                                <>
                                                  {activity?.seller_name} has
                                                  revoked {activity?.nft_name}{" "}
                                                  from {activity?.buyer_name}
                                                </>
                                              )}
                                              <span className="time-ago hide-large">
                                                {dayjs(
                                                  activity.created_at
                                                ).format(" D MMM YYYY hh:mm a")}
                                              </span>
                                            </p>
                                          );
                                        }
                                      })()}
                                      {(() => {
                                        if (
                                          activity.activity_type === "login"
                                        ) {
                                          return (
                                            <p className="notify-p">
                                              You've successfully signed in
                                              <span className="time-ago">
                                                {dayjs(
                                                  activity.created_at
                                                ).format(" D MMM YYYY hh:mm a")}
                                              </span>
                                            </p>
                                          );
                                        } else if (
                                          activity.activity_type ===
                                          "guild_rent"
                                        ) {
                                          <p className="notify-p">
                                            <>
                                              <span className="time-ago">
                                                {dayjs(
                                                  activity.created_at
                                                ).format("D MMM YYYY hh:mm a")}
                                              </span>
                                            </>
                                          </p>;
                                        } else if (
                                          activity.activity_type === "yield"
                                        ) {
                                          return (
                                            <p className="notify-p">
                                              Congrats! Your NFT has been
                                              featured on other NFTs and has
                                              generated revenue during their
                                              trades! Yielded amount is{" "}
                                              <b>
                                                {currencyFormat(
                                                  activity.total_amount,
                                                  "USD"
                                                )}{" "}
                                              </b>
                                              from <b>{activity.nft_name}</b>
                                              <span className="time-ago">
                                                {dayjs(
                                                  activity.created_at
                                                ).format(" D MMM YYYY hh:mm a")}
                                              </span>
                                            </p>
                                          );
                                        } else if (
                                          activity.activity_type === "deposit"
                                        ) {
                                          return (
                                            <p className="notify-p">
                                              Your Deposit of{" "}
                                              <b>
                                                {currencyFormat(
                                                  Math.round(activity.amount),
                                                  "USD"
                                                )}
                                              </b>{" "}
                                              was successful. The fund is
                                              credited to your wallet.
                                              <span className="time-ago">
                                                {dayjs(
                                                  activity.created_at
                                                ).format("D MMM YYYY hh:mm a")}
                                              </span>
                                            </p>
                                          );
                                        } else if (
                                          activity.activity_type === "reward"
                                        ) {
                                          return (
                                            <p className="notify-p">
                                              {activity?.desc}
                                              <span className="time-ago">
                                                {dayjs(
                                                  activity.created_at
                                                ).format("D MMM YYYY hh:mm a")}
                                              </span>
                                            </p>
                                          );
                                        } else if (
                                          activity.activity_type === "guild"
                                        ) {
                                          return (
                                            <p className="notify-p">
                                              {activity?.desc}
                                              <span className="time-ago">
                                                {dayjs(
                                                  activity.created_at
                                                ).format("D MMM YYYY hh:mm a")}
                                              </span>
                                            </p>
                                          );
                                        } else if (
                                          activity.activity_type === "upgrade"
                                        ) {
                                          return (
                                            <p className="notify-p">
                                              {(() => {
                                                if (
                                                  activity.reason ===
                                                  "upgrade_success"
                                                ) {
                                                  return (
                                                    <>
                                                      Your NFT{" "}
                                                      <b>
                                                        {
                                                          activity.celebrity_name
                                                        }
                                                        's {activity.nft_name}{" "}
                                                      </b>{" "}
                                                      is upgraded successfully
                                                      to the next level
                                                      <span className="time-ago">
                                                        {dayjs(
                                                          activity.created_at
                                                        ).format(
                                                          "D MMM YYYY hh:mm a"
                                                        )}
                                                      </span>
                                                    </>
                                                  );
                                                }
                                              })()}
                                            </p>
                                          );
                                        } else if (
                                          activity.activity_type ===
                                          "conversion"
                                        ) {
                                          return (
                                            <p className="notify-p">
                                              <>
                                                {activity.desc}
                                                <span className="time-ago">
                                                  {dayjs(
                                                    activity.created_at
                                                  ).format(
                                                    "D MMM YYYY hh:mm a"
                                                  )}
                                                </span>
                                              </>
                                            </p>
                                          );
                                        } else if (
                                          activity.activity_type ===
                                          "tournament_win"
                                        ) {
                                          return (
                                            <p className="notify-p">
                                              <>
                                                {activity.desc}
                                                <span className="time-ago">
                                                  {dayjs(
                                                    activity.created_at
                                                  ).format(
                                                    "D MMM YYYY hh:mm a"
                                                  )}
                                                </span>
                                              </>
                                            </p>
                                          );
                                        } else if (
                                          activity.activity_type === "bid"
                                        ) {
                                          return (
                                            <p className="notify-p">
                                              {(() => {
                                                if (
                                                  activity.reason === "bid_lock"
                                                ) {
                                                  return (
                                                    <>
                                                      <b>
                                                        <u>
                                                          <ToolTip
                                                            icon={currencyFormat(
                                                              Math.round(
                                                                activity.amount
                                                              ),
                                                              "USD"
                                                            )}
                                                            content={`Service Fee: ${currencyFormat(
                                                              activity.service_fee,
                                                              "USD"
                                                            )}${
                                                              activity.artist_fee
                                                                ? `, Artist Fee: ${currencyFormat(
                                                                    activity.artist_fee,
                                                                    "USD"
                                                                  )}`
                                                                : ""
                                                            }
                                                          
                                                          ${
                                                            (user?.apply_buy_tds ||
                                                              user?.apply_sale_tds) &&
                                                            activity.tds_fee
                                                              ? `, TDS Fee: ${currencyFormat(
                                                                  activity.tds_fee,
                                                                  "USD"
                                                                )}`
                                                              : ""
                                                          }, \n Total: ${currencyFormat(
                                                              activity.total_amount,
                                                              "USD"
                                                            )}`}
                                                            placement={"top"}
                                                          />
                                                        </u>
                                                      </b>{" "}
                                                      has been locked because
                                                      your bid was successfully
                                                      placed for{" "}
                                                      <b>
                                                        {
                                                          activity.celebrity_name
                                                        }
                                                        's {activity.nft_name}
                                                      </b>{" "}
                                                      from{" "}
                                                      <b>
                                                        {activity.seller_name}
                                                      </b>
                                                      . All the locked funds can
                                                      be viewed in the 'Funds on
                                                      hold' section of your
                                                      wallet.
                                                      <span className="time-ago">
                                                        {dayjs(
                                                          activity.created_at
                                                        ).format(
                                                          "D MMM YYYY hh:mm a"
                                                        )}
                                                      </span>
                                                    </>
                                                  );
                                                } else if (
                                                  activity.reason ===
                                                  "bid_closed"
                                                ) {
                                                  return (
                                                    <>
                                                      Your bid of{" "}
                                                      <b>
                                                        <u>
                                                          <ToolTip
                                                            icon={currencyFormat(
                                                              Math.round(
                                                                activity.amount
                                                              ),
                                                              "USD"
                                                            )}
                                                            content={`Service Fee: ${currencyFormat(
                                                              activity.service_fee,
                                                              "USD"
                                                            )}${
                                                              activity.artist_fee
                                                                ? `, Artist Fee: ${currencyFormat(
                                                                    activity.artist_fee,
                                                                    "USD"
                                                                  )}`
                                                                : ""
                                                            }${
                                                              (user?.apply_buy_tds ||
                                                                user?.apply_sale_tds) &&
                                                              activity.tds_fee
                                                                ? `, TDS Fee: ${currencyFormat(
                                                                    activity.tds_fee,
                                                                    "USD"
                                                                  )}`
                                                                : ""
                                                            }, \n Total: ${currencyFormat(
                                                              activity.total_amount,
                                                              "USD"
                                                            )}`}
                                                            placement={"top"}
                                                          />
                                                        </u>
                                                      </b>{" "}
                                                      on{" "}
                                                      <b>
                                                        {
                                                          activity.celebrity_name
                                                        }
                                                        's {activity.nft_name}{" "}
                                                      </b>{" "}
                                                      from{" "}
                                                      <b>
                                                        {activity.seller_name}
                                                      </b>{" "}
                                                      has expired because the
                                                      seller cancelled the sale
                                                      of the NFT. Your locked
                                                      bid amount will be
                                                      returned to your available
                                                      wallet balance.
                                                      <span className="time-ago">
                                                        {dayjs(
                                                          activity.created_at
                                                        ).format(
                                                          "D MMM YYYY hh:mm a"
                                                        )}
                                                      </span>
                                                    </>
                                                  );
                                                } else if (
                                                  activity.reason ===
                                                  "bid_expired"
                                                ) {
                                                  return (
                                                    <>
                                                      Your bid of{" "}
                                                      <b>
                                                        <u>
                                                          <ToolTip
                                                            icon={currencyFormat(
                                                              Math.round(
                                                                activity.amount
                                                              ),
                                                              "USD"
                                                            )}
                                                            content={`Service Fee: ${currencyFormat(
                                                              activity.service_fee,
                                                              "USD"
                                                            )}${
                                                              activity.artist_fee
                                                                ? `, Artist Fee: ${currencyFormat(
                                                                    activity.artist_fee,
                                                                    "USD"
                                                                  )}`
                                                                : ""
                                                            }${
                                                              (user?.apply_buy_tds ||
                                                                user?.apply_sale_tds) &&
                                                              activity.tds_fee
                                                                ? `, TDS Fee: ${currencyFormat(
                                                                    activity.tds_fee,
                                                                    "USD"
                                                                  )}`
                                                                : ""
                                                            }, \n Total: ${currencyFormat(
                                                              activity.total_amount,
                                                              "USD"
                                                            )}`}
                                                            placement={"top"}
                                                          />
                                                        </u>
                                                      </b>{" "}
                                                      on{" "}
                                                      <b>
                                                        {
                                                          activity.celebrity_name
                                                        }
                                                        's {activity.nft_name}{" "}
                                                      </b>{" "}
                                                      from{" "}
                                                      <b>
                                                        {activity.seller_name}
                                                      </b>{" "}
                                                      has expired because
                                                      someone's bidding higher
                                                      than you. Your locked bid
                                                      amount will be returned to
                                                      your available wallet
                                                      balance.
                                                      <span className="time-ago">
                                                        {dayjs(
                                                          activity.created_at
                                                        ).format(
                                                          "D MMM YYYY hh:mm a"
                                                        )}
                                                      </span>
                                                    </>
                                                  );
                                                } else if (
                                                  activity.reason ===
                                                  "bid_outdated"
                                                ) {
                                                  return (
                                                    <>
                                                      Your bid of{" "}
                                                      <b>
                                                        <u>
                                                          <ToolTip
                                                            icon={currencyFormat(
                                                              Math.round(
                                                                activity.amount
                                                              ),
                                                              "USD"
                                                            )}
                                                            content={`Service Fee: ${currencyFormat(
                                                              activity.service_fee,
                                                              "USD"
                                                            )}${
                                                              activity.artist_fee
                                                                ? `, Artist Fee: ${currencyFormat(
                                                                    activity.artist_fee,
                                                                    "USD"
                                                                  )}`
                                                                : ""
                                                            }${
                                                              (user?.apply_buy_tds ||
                                                                user?.apply_sale_tds) &&
                                                              activity.tds_fee
                                                                ? `, TDS Fee: ${currencyFormat(
                                                                    activity.tds_fee,
                                                                    "USD"
                                                                  )}`
                                                                : ""
                                                            }, \n Total: ${currencyFormat(
                                                              activity.total_amount,
                                                              "USD"
                                                            )}`}
                                                            placement={"top"}
                                                          />
                                                        </u>
                                                      </b>{" "}
                                                      on{" "}
                                                      <b>
                                                        {
                                                          activity.celebrity_name
                                                        }
                                                        's {activity.nft_name}
                                                      </b>{" "}
                                                      from{" "}
                                                      <b>
                                                        {activity.seller_name}
                                                      </b>{" "}
                                                      has expired because the
                                                      seller did not acknolwlege
                                                      your bid within 7 days.
                                                      Your locked bid amount
                                                      will be returned to your
                                                      available wallet balance.
                                                      Your bid was outdated for{" "}
                                                      <span className="time-ago">
                                                        {dayjs(
                                                          activity.created_at
                                                        ).format(
                                                          "D MMM YYYY hh:mm a"
                                                        )}
                                                      </span>
                                                    </>
                                                  );
                                                } else if (
                                                  activity.reason ===
                                                  "bid_cancelled"
                                                ) {
                                                  return (
                                                    <>
                                                      Your bid of{" "}
                                                      <b>
                                                        <u>
                                                          <ToolTip
                                                            icon={currencyFormat(
                                                              Math.round(
                                                                activity.amount
                                                              ),
                                                              "USD"
                                                            )}
                                                            content={`Service Fee: ${currencyFormat(
                                                              activity.service_fee,
                                                              "USD"
                                                            )}${
                                                              activity.artist_fee
                                                                ? `, Artist Fee: ${currencyFormat(
                                                                    activity.artist_fee,
                                                                    "USD"
                                                                  )}`
                                                                : ""
                                                            }${
                                                              (user?.apply_buy_tds ||
                                                                user?.apply_sale_tds) &&
                                                              activity.tds_fee
                                                                ? `, TDS Fee: ${currencyFormat(
                                                                    activity.tds_fee,
                                                                    "USD"
                                                                  )}`
                                                                : ""
                                                            }, \n Total: ${currencyFormat(
                                                              activity.total_amount,
                                                              "USD"
                                                            )}`}
                                                            placement={"top"}
                                                          />
                                                        </u>
                                                      </b>{" "}
                                                      on{" "}
                                                      <b>
                                                        {
                                                          activity.celebrity_name
                                                        }
                                                        's {activity.nft_name}{" "}
                                                      </b>{" "}
                                                      from{" "}
                                                      <b>
                                                        {activity.seller_name}
                                                      </b>{" "}
                                                      has cancelled
                                                      successfully.
                                                      <span className="time-ago">
                                                        {dayjs(
                                                          activity.created_at
                                                        ).format(
                                                          "D MMM YYYY hh:mm a"
                                                        )}
                                                      </span>
                                                    </>
                                                  );
                                                } else if (
                                                  activity.reason ===
                                                  "bid_success"
                                                ) {
                                                  return (
                                                    <>
                                                      {activity.payment_type ===
                                                      "debit" ? (
                                                        <>
                                                          Congratulations! Your
                                                          bid of{" "}
                                                          <b>
                                                            <u>
                                                              <ToolTip
                                                                icon={currencyFormat(
                                                                  Math.round(
                                                                    activity.amount
                                                                  ),
                                                                  "USD"
                                                                )}
                                                                content={`Service Fee: ${currencyFormat(
                                                                  activity.service_fee,
                                                                  "USD"
                                                                )}${
                                                                  activity.artist_fee
                                                                    ? `, Artist Fee: ${currencyFormat(
                                                                        activity.artist_fee,
                                                                        "USD"
                                                                      )}`
                                                                    : ""
                                                                }${
                                                                  (user?.apply_buy_tds ||
                                                                    user?.apply_sale_tds) &&
                                                                  activity.tds_fee
                                                                    ? `, TDS Fee: ${currencyFormat(
                                                                        activity.tds_fee,
                                                                        "USD"
                                                                      )}`
                                                                    : ""
                                                                }, \n Total: ${currencyFormat(
                                                                  activity.total_amount,
                                                                  "USD"
                                                                )}`}
                                                                placement={
                                                                  "top"
                                                                }
                                                              />
                                                            </u>
                                                          </b>{" "}
                                                          on the NFT{" "}
                                                          <b>
                                                            {
                                                              activity.celebrity_name
                                                            }
                                                            's{" "}
                                                            {activity.nft_name}
                                                          </b>{" "}
                                                          from{" "}
                                                          <b>
                                                            {
                                                              activity.seller_name
                                                            }
                                                          </b>{" "}
                                                          has qualified to be
                                                          the highest! You've
                                                          won for yourself a
                                                          prized NFT.
                                                          <span className="time-ago">
                                                            {dayjs(
                                                              activity.created_at
                                                            ).format(
                                                              "D MMM YYYY hh:mm a"
                                                            )}
                                                          </span>
                                                        </>
                                                      ) : (
                                                        <>
                                                          Congratulations!
                                                          You've successfully
                                                          sold your NFT{" "}
                                                          <b>
                                                            {" "}
                                                            {
                                                              activity.celebrity_name
                                                            }
                                                            's{" "}
                                                            {activity.nft_name}
                                                          </b>{" "}
                                                          for{" "}
                                                          <b>
                                                            {" "}
                                                            <u>
                                                              <ToolTip
                                                                icon={currencyFormat(
                                                                  Math.round(
                                                                    activity.amount
                                                                  ),
                                                                  "USD"
                                                                )}
                                                                content={`Service Fee: ${currencyFormat(
                                                                  activity.service_fee,
                                                                  "USD"
                                                                )}${
                                                                  activity.artist_fee
                                                                    ? `, Artist Fee: ${currencyFormat(
                                                                        activity.artist_fee,
                                                                        "USD"
                                                                      )}`
                                                                    : ""
                                                                }${
                                                                  (user?.apply_buy_tds ||
                                                                    user?.apply_sale_tds) &&
                                                                  activity.tds_fee
                                                                    ? `, TDS Fee: ${currencyFormat(
                                                                        activity.tds_fee,
                                                                        "USD"
                                                                      )}`
                                                                    : ""
                                                                } ,\n Total: ${currencyFormat(
                                                                  activity.total_amount,
                                                                  "USD"
                                                                )}`}
                                                                placement={
                                                                  "top"
                                                                }
                                                              />
                                                            </u>
                                                          </b>{" "}
                                                          to{" "}
                                                          <b>
                                                            {
                                                              activity.buyer_name
                                                            }
                                                          </b>
                                                          ! Your NFT will soon
                                                          be transferred to the
                                                          new owner.
                                                          <span className="time-ago">
                                                            {dayjs(
                                                              activity.created_at
                                                            ).format(
                                                              "D MMM YYYY hh:mm a"
                                                            )}
                                                          </span>
                                                        </>
                                                      )}
                                                    </>
                                                  );
                                                } else if (
                                                  activity.reason ===
                                                  "bid_received"
                                                ) {
                                                  return (
                                                    <>
                                                      Your{" "}
                                                      <b>{activity.nft_name}</b>{" "}
                                                      from the collection{" "}
                                                      <b>
                                                        {
                                                          activity.celebrity_name
                                                        }
                                                      </b>{" "}
                                                      has received a bid of{" "}
                                                      <b>
                                                        {" "}
                                                        {currencyFormat(
                                                          Math.round(
                                                            activity.amount
                                                          ),
                                                          "USD"
                                                        )}
                                                      </b>{" "}
                                                      from{" "}
                                                      <b>
                                                        {activity.buyer_name}
                                                      </b>
                                                      <span className="time-ago">
                                                        {dayjs(
                                                          activity.created_at
                                                        ).format(
                                                          "D MMM YYYY hh:mm a"
                                                        )}
                                                      </span>
                                                    </>
                                                  );
                                                }
                                              })()}
                                            </p>
                                          );
                                        } else if (
                                          activity.activity_type === "buy"
                                        ) {
                                          return (
                                            <p className="notify-p">
                                              {activity.payment_type ===
                                              "debit" ? (
                                                <>
                                                  {dayjs(
                                                    activity.created_at
                                                  ).format("D MMM YYYY") ===
                                                  "22 Apr 2022" ? (
                                                    `Congrats On Your NFT Purchase. You've purchased the Super Loot of Meta Cricket League!`
                                                  ) : (
                                                    <>
                                                      Congrats On Your NFT
                                                      Purchase. You've purchased
                                                      the NFT{" "}
                                                      <b>
                                                        {
                                                          activity.celebrity_name
                                                        }
                                                        's {activity.nft_name}{" "}
                                                      </b>{" "}
                                                      from{" "}
                                                      <b>
                                                        {activity.seller_name}
                                                      </b>{" "}
                                                      for{" "}
                                                      <b>
                                                        {" "}
                                                        <u>
                                                          <ToolTip
                                                            icon={currencyFormat(
                                                              Math.round(
                                                                activity.amount
                                                              ),
                                                              "USD"
                                                            )}
                                                            content={`Service Fee: ${currencyFormat(
                                                              activity.service_fee,
                                                              "USD"
                                                            )}${
                                                              activity.artist_fee
                                                                ? `, Artist Fee: ${currencyFormat(
                                                                    activity.artist_fee,
                                                                    "USD"
                                                                  )}`
                                                                : ""
                                                            }${
                                                              (user?.apply_buy_tds ||
                                                                user?.apply_sale_tds) &&
                                                              activity.tds_fee
                                                                ? `, TDS Fee: ${currencyFormat(
                                                                    activity.tds_fee,
                                                                    "USD"
                                                                  )}`
                                                                : ""
                                                            }, \n Total: ${currencyFormat(
                                                              activity.total_amount,
                                                              "USD"
                                                            )}`}
                                                            placement={"top"}
                                                          />
                                                        </u>
                                                      </b>
                                                    </>
                                                  )}
                                                  <span className="time-ago">
                                                    {dayjs(
                                                      activity.created_at
                                                    ).format(
                                                      "D MMM YYYY hh:mm a"
                                                    )}
                                                  </span>
                                                </>
                                              ) : (
                                                <>
                                                  Congrats On Your NFT Sale.
                                                  You've sold the NFT{" "}
                                                  <b>
                                                    {activity.celebrity_name}
                                                    's {activity.nft_name}{" "}
                                                  </b>{" "}
                                                  to{" "}
                                                  <b>{activity.buyer_name}</b>{" "}
                                                  for{" "}
                                                  <b>
                                                    {" "}
                                                    <u>
                                                      <ToolTip
                                                        icon={currencyFormat(
                                                          Math.round(
                                                            activity.amount
                                                          ),
                                                          "USD"
                                                        )}
                                                        content={`Service Fee: ${currencyFormat(
                                                          activity.service_fee,
                                                          "USD"
                                                        )}${
                                                          activity.artist_fee
                                                            ? `, Artist Fee: ${currencyFormat(
                                                                activity.artist_fee,
                                                                "USD"
                                                              )}`
                                                            : ""
                                                        }${
                                                          (user?.apply_buy_tds ||
                                                            user?.apply_sale_tds) &&
                                                          activity.tds_fee
                                                            ? `, TDS Fee: ${currencyFormat(
                                                                activity.tds_fee,
                                                                "USD"
                                                              )}`
                                                            : ""
                                                        } \n Total: ${currencyFormat(
                                                          activity.total_amount,
                                                          "USD"
                                                        )}`}
                                                        placement={"top"}
                                                      />
                                                    </u>
                                                  </b>
                                                  <span className="time-ago">
                                                    {dayjs(
                                                      activity.created_at
                                                    ).format(
                                                      "D MMM YYYY hh:mm a"
                                                    )}
                                                  </span>
                                                </>
                                              )}
                                            </p>
                                          );
                                        } else if (
                                          activity.activity_type === "withdraw"
                                        ) {
                                          return (
                                            <p className="notify-p">
                                              {(() => {
                                                if (
                                                  activity.reason ===
                                                  "withdraw_requested"
                                                ) {
                                                  return (
                                                    <>
                                                      We've received a request
                                                      to withdraw{" "}
                                                      <b>
                                                        {currencyFormat(
                                                          Math.round(
                                                            activity.amount
                                                          ),
                                                          "USD"
                                                        )}
                                                      </b>{" "}
                                                      from your wallet
                                                    </>
                                                  );
                                                } else if (
                                                  activity.reason ===
                                                  "withdraw_cancelled"
                                                ) {
                                                  return (
                                                    <>
                                                      We've received a request
                                                      to cancel your withdrawal
                                                      request of{" "}
                                                      <b>
                                                        {currencyFormat(
                                                          Math.round(
                                                            activity.amount
                                                          ),
                                                          "USD"
                                                        )}
                                                      </b>{" "}
                                                      from your wallet
                                                    </>
                                                  );
                                                } else if (
                                                  activity.reason ===
                                                  "withdraw_success"
                                                ) {
                                                  return (
                                                    <>
                                                      You've successfully
                                                      withdrawn{" "}
                                                      <b>
                                                        {currencyFormat(
                                                          Math.round(
                                                            activity.amount
                                                          ),
                                                          "USD"
                                                        )}
                                                      </b>{" "}
                                                      from your wallet. Your
                                                      funds will be returned to
                                                      the payment instrument
                                                      they were deposited from.
                                                    </>
                                                  );
                                                }
                                              })()}
                                              <span className="time-ago">
                                                {dayjs(
                                                  activity.created_at
                                                ).format("D MMM YYYY hh:mm a")}
                                              </span>
                                            </p>
                                          );
                                        }
                                      })()}
                                    </div>
                                  </div>
                                  {/* {(activity.activity_type === "bid" ||
                          activity.activity_type === "buy") && (
                          <div className="viwe-nft">
                            <a
                              className="theme-btn outlin-btn"
                              href={`${activity.celebrity_domain}/details/${activity.nft_id}`}
                              target="_self"
                            >
                              View NFT
                            </a>
                          </div>
                        )} */}
                                </div>
                              );
                            } else return null;
                          })}

                          {hasMore ? (
                            <div className="post-header">
                              <div className="media-body">
                                <span
                                  role="button"
                                  className="loadmore-btn"
                                  onClick={fetchMore}
                                >
                                  {loading ? "Loading..." : "Load More"}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="post-header">
                              <div className="media-body">
                                <p className="notify-p text-center">
                                  You've reached the end of the list
                                </p>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="post-header">
                          <div className="media-body">
                            <p className="notify-p text-center">
                              No activity found
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ActivityList = (props) => (
  <ContentLoader
    viewBox="0 0 900 400"
    width={"100%"}
    height={"100%"}
    backgroundColor="#f5f5f5"
    foregroundColor="#dbdbdb"
    className="mt-3"
    {...props}
  >
    <circle cx="25" cy="20" r="18" />
    <rect x="55" y="5" rx="5" ry="5" width="700" height="30" />
    <circle cx="25" cy="70" r="18" />
    <rect x="55" y="55" rx="5" ry="5" width="700" height="30" />
    <circle cx="25" cy="120" r="18" />
    <rect x="55" y="105" rx="5" ry="5" width="700" height="30" />
    <circle cx="25" cy="170" r="18" />
    <rect x="55" y="155" rx="5" ry="5" width="700" height="30" />
    <circle cx="25" cy="220" r="18" />
    <rect x="55" y="205" rx="5" ry="5" width="700" height="30" />
    <circle cx="25" cy="270" r="18" />
    <rect x="55" y="255" rx="5" ry="5" width="700" height="30" />
    <circle cx="25" cy="320" r="18" />
    <rect x="55" y="305" rx="5" ry="5" width="700" height="30" />
    <circle cx="25" cy="370" r="18" />
    <rect x="55" y="355" rx="5" ry="5" width="700" height="30" />
  </ContentLoader>
);

export default IndiggActivity;
