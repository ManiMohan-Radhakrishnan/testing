/* eslint-disable jsx-a11y/anchor-is-valid */
import dayjs from "dayjs";
import ContentLoader from "react-content-loader";
import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import userImg from "../../images/user_1.png";
import sampleNFT from "../../images/post1.png";
import { userActivityApi } from "../../api/methods";
import { currencyFormat, formattedNumber } from "../../utils/common";
import "./_style.scss";

// import { roundDown } from "../../utils/common";
// import ToolTip from "../tooltip";
// import { act } from "react-dom/test-utils";

const UserActivity = () => {
  const { user } = useSelector((state) => state.user.data);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [filterReasons, setFilterResons] = useState([
    { name: "General", value: null, checked: false },
    {
      name: "Withdrawal Requests",
      value: "withdraw_requested",
      checked: false,
    },
    { name: "Deposits", value: "deposit", checked: false },
    {
      name: "Withdrawal Cancellations",
      value: "withdraw_cancelled",
      checked: false,
    },
    { name: "Successful Bid Placements", value: "bid_success", checked: false },
    { name: "Expired Bids", value: "bid_expired", checked: false },
    // { name: "Outdated Bids", value: "bid_outdated", checked: false },
    { name: "Locked Funds", value: "bid_lock", checked: false },
    // { name: "Admin Credit", value: "admin_credit", checked: false },
    {
      name: "Successful NFT Purchases/Sold",
      value: "buy_success",
      checked: false,
    },
    // { name: "Admin Debit", value: "admin_debit", checked: false },
    // { name: "Bids On Your NFTs", value: "bid_received", checked: false },
    // { name: "Cancelled Bids", value: "bid_cancelled", checked: false },
    // { name: "Tournament Win", value: "tournament_win", checked: false },

    {
      name: "Successful Withdrawals",
      value: "withdraw_success",
      checked: false,
    },
    {
      name: "Yield Royalty",
      value: "yield_royalty",
      checked: false,
    },
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    getUserActivities(1, []);
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
      setSelectedIndex(0);
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
      setSelectedIndex(0);

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
    const index = info.findIndex((obj) => obj.value === input);
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
                    <h3 className="wallet-title">Recent Activity </h3>
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
                          {data.map((obj, i) => (
                            <div
                              id={`activity${i}`}
                              // className="post-header active"
                              // className={`post-header ${
                              //   !initLoading ? "active" : ""
                              // }`}
                              className={`post-header ${
                                selectedIndex === i ? "active" : ""
                              }`}
                            >
                              <span className="time-ago hide-mobile">
                                {dayjs(obj?.created_at).format(
                                  " D MMM YYYY hh:mm a"
                                )}
                              </span>
                              <div className="media ">
                                <div className="user-img">
                                  {/* {[
                                    "bid",
                                    "buy",
                                    "upgrade",
                                    "guild",
                                    "tournament_win",
                                  ].includes(obj.activity_type) ? (
                                    <>
                                      <img
                                        src={
                                          obj?.nft_cover_url
                                            ? obj?.nft_cover_url
                                            : userImg
                                        }
                                        alt={user.first_name}
                                      />
                                    </>
                                  ) : (
                                    <>
                                      <img
                                        src={
                                          user?.avatar_url
                                            ? user?.avatar_url
                                            : userImg
                                        }
                                        alt={user.first_name}
                                      />
                                    </>
                                  )} */}
                                  {obj?.img_url ? (
                                    <>
                                      <img
                                        src={obj?.img_url}
                                        alt="notification-icon"
                                      />
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
                                </div>
                                <div className="media-body">
                                  <div className="user-title">
                                    <a>{obj?.title}</a>
                                  </div>
                                  <div>
                                    <p className="notify-p">
                                      {obj?.desc}
                                      <span className="time-ago hide-large">
                                        {dayjs(obj?.created_at).format(
                                          " D MMM YYYY hh:mm a"
                                        )}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          {hasMore ? (
                            <div className="post-header justify-content-center">
                              <span
                                role="button"
                                className="loadmore-btn"
                                onClick={fetchMore}
                              >
                                {loading ? "Loading..." : "Load More"}
                              </span>
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
                        <>
                          <div className="post-header">
                            <div className="media-body">
                              <p className="notify-p text-center">
                                No activity found
                              </p>
                            </div>
                          </div>
                        </>
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

export default UserActivity;
