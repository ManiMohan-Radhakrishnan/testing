/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import ContentLoader from "react-content-loader";
import { FaCheckCircle } from "react-icons/fa";

import {
  userBuyOrdersApi,
  userSellOrdersApi,
  getUpgradesApi,
} from "../../api/methods-marketplace";
import { EVENT_NAMES, invokeTrackEvent } from "../../utils/common";
import MyOrderCard from "../my-orders";

const MyOrders = () => {
  const [type, setType] = useState("");
  const [buyOrders, setBuyOrders] = useState({});
  const [buyOrdersList, setBuyOrdersList] = useState([]);
  const [sellOrders, setSellOrders] = useState({});
  const [sellOrdersList, setSellOrdersList] = useState([]);
  const [buyOrderPage, setBuyOrderPage] = useState(1);
  const [sellOrderPage, setSellOrderPage] = useState(1);

  const [upgradeOrders, setUpgradeOrders] = useState({});
  const [upgradeOrdersList, setUpgradeOrdersList] = useState([]);
  const [upgradeOrderPage, setUpgradeOrderPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);
  const [key, setKey] = useState("buy-orders");

  const [filter, setFilter] = useState({
    sell: [
      { name: "Onsale", value: "onsale", checked: true },
      { name: "Success", value: "success", checked: false },
      { name: "Cancelled", value: "cancelled", checked: false },
    ],
    buy: [
      { name: "Transferred", value: "transferred", checked: true },
      { name: "Pending", value: "pending", checked: false },
      { name: "Expired", value: "expired", checked: false },
    ],
  });

  useEffect(() => {
    invokeTrackEvent(EVENT_NAMES?.MY_ORDERS_VIEWED, {
      orderType: key,
      status:
        key == "buy-orders"
          ? "Transferred"
          : key == "sell-orders"
          ? "Onsale"
          : null,
      total_count:
        key === "buy-orders"
          ? parseInt(buyOrders?.total_count)
          : key === "sell-orders"
          ? parseInt(sellOrders?.total_count)
          : null,
      moreOrderClick: null,
    });
  }, [key]);

  const getUserBuyOrders = async (
    pageNo,
    type = "transferred",
    filterApply = false,
    initial = false
  ) => {
    try {
      setLoading(true);
      setType(type);
      const result = await userBuyOrdersApi(pageNo, type);
      if (filterApply && result.data.data.total_count !== 0)
        invokeTrackEvent(EVENT_NAMES?.MY_ORDERS_VIEWED, {
          orderType: "buy",
          status: type,
          total_count: parseInt(result.data.data?.total_count),
          moreOrderClick: null,
        });
      setBuyOrders(result.data.data);
      setBuyOrdersList(result.data.data.orders);
      setLoading(false);
      if (initial) {
        if (result?.data?.data?.total_count === 0) {
          setKey("sell-orders");
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getMoreUserBuyOrders = async (pageNo, type = "transferred") => {
    try {
      setMoreLoading(true);
      setType(type);
      const result = await userBuyOrdersApi(pageNo, type);
      invokeTrackEvent(EVENT_NAMES?.MY_ORDERS_VIEWED, {
        orderType: "buy",
        status: type,
        moreOrderClick: pageNo,
        total_count: parseInt(result.data.data?.total_count),
      });
      setBuyOrders(result.data.data);
      setBuyOrdersList([...buyOrdersList, ...result.data.data.orders]);
      setMoreLoading(false);
    } catch (err) {
      setMoreLoading(false);
    }
  };

  const loadMoreBuyOrders = () => {
    if (buyOrders.next_page) {
      const value = filter.buy
        .filter((xx) => xx.checked === true)
        .map((obj, i) => obj.value);
      const buyFilter = value[0] ? value[0] : "";
      getMoreUserBuyOrders(buyOrderPage + 1, buyFilter);
      setBuyOrderPage(buyOrderPage + 1);
    }
  };

  const getUserSellOrders = async (
    pageNo,
    type = "onsale",
    filterApply = false
  ) => {
    try {
      setLoading(true);
      setType(type);
      const result = await userSellOrdersApi(pageNo, type);
      if (filterApply)
        invokeTrackEvent(EVENT_NAMES?.MY_ORDERS_VIEWED, {
          orderType: "sellOrders",
          status: type,
          total_count: parseInt(result.data.data?.total_count),
          moreOrderClick: null,
        });
      setSellOrders(result.data.data);
      setSellOrdersList(result.data.data.orders);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getMoreUserSellOrders = async (pageNo, type = "onsale") => {
    try {
      setType(type);
      setMoreLoading(true);
      const result = await userSellOrdersApi(pageNo, type);
      invokeTrackEvent(EVENT_NAMES?.MY_ORDERS_VIEWED, {
        orderType: "sale",
        status: type,
        moreOrderClick: pageNo,
        total_count: parseInt(result.data.data?.total_count),
      });
      setSellOrders(result.data.data);
      setSellOrdersList([...sellOrdersList, ...result.data.data.orders]);
      setMoreLoading(false);
    } catch (err) {
      setMoreLoading(false);
    }
  };

  const loadMoreSellOrders = () => {
    if (sellOrders.next_page) {
      const value = filter.sell
        .filter((xx) => xx.checked === true)
        .map((obj, i) => obj.value);
      const sellFilter = value[0] ? value[0] : "";
      getMoreUserSellOrders(sellOrderPage + 1, sellFilter);
      setSellOrderPage(sellOrderPage + 1);
    }
  };

  const getUserUpgradeOrders = async (pageNo) => {
    try {
      setLoading(true);
      const result = await getUpgradesApi(pageNo);
      setUpgradeOrders(result.data.data);
      setUpgradeOrdersList(result.data.data.upgrades);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getMoreUserUpgradeOrders = async (pageNo) => {
    try {
      setMoreLoading(true);
      const result = await getUpgradesApi(pageNo);
      setUpgradeOrders(result.data.data);
      setUpgradeOrdersList([
        ...upgradeOrdersList,
        ...result.data.data.upgrades,
      ]);
      setMoreLoading(false);
    } catch (err) {
      setMoreLoading(false);
    }
  };

  const loadMoreUpgradeOrders = () => {
    if (upgradeOrders.next_page) {
      const value = filter.sell
        .filter((xx) => xx.checked === true)
        .map((obj, i) => obj.value);
      const sellFilter = value[0] ? value[0] : "";
      getMoreUserUpgradeOrders(upgradeOrderPage + 1, sellFilter);
      setUpgradeOrderPage(upgradeOrderPage + 1);
    }
  };

  const handleSellFilterType = (input) => {
    const info = { ...filter };
    info.sell = filter.sell.map((obj) => ({
      ...obj,
      checked: input ? input === obj.value : false,
    }));
    setFilter(info);
    setSellOrderPage(1);
    getUserSellOrders(1, input, true);
  };

  const handleBuyFilterType = (input) => {
    const info = { ...filter };
    info.buy = filter.buy.map((obj) => ({
      ...obj,
      checked: input ? input === obj.value : false,
    }));
    setFilter(info);
    setBuyOrderPage(1);
    getUserBuyOrders(1, input, true);
  };

  useEffect(async () => {
    await getUserBuyOrders(1, undefined, undefined, true);
    await getUserSellOrders(1);
    getUserUpgradeOrders(1);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* <div className="col-md-10"> */}
      <div className="main-content-block">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="wallet-user mt-3">
                <div className="row align-items-center">
                  <div className="col-lg-12">
                    <div className="about-heading">
                      <h3 className="about-title">My Orders</h3>
                      <div>
                        <ul className="nav user-nav">
                          <li className="nav-item">
                            <a
                              className={`nav-link ${
                                key === "buy-orders" ? "active" : ""
                              }`}
                              aria-current="page"
                              role="button"
                              onClick={() => setKey("buy-orders")}
                            >
                              Buy Orders
                            </a>
                          </li>

                          <li className="nav-item">
                            <a
                              className={`nav-link ${
                                key === "sell-orders" ? "active" : ""
                              }`}
                              role="button"
                              onClick={() => setKey("sell-orders")}
                            >
                              Sell Orders
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className={`nav-link ${
                                key === "upgrade-orders" ? "active" : ""
                              }`}
                              role="button"
                              onClick={() => setKey("upgrade-orders")}
                            >
                              Upgrade
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex mb-3 flex-wrap">
              {(() => {
                if (key === "sell-orders") {
                  return (
                    <>
                      {filter.sell.map((obj, i) => (
                        <div
                          role={"button"}
                          className={`rounded-pill ps-3 pe-3 mb-3 me-3 pt-1 pb-1 activity-filter-pill ${
                            obj.checked ? "active" : ""
                          }`}
                          key={`filter-pill${i}`}
                          onClick={() => handleSellFilterType(obj.value)}
                        >
                          {obj.checked && (
                            <FaCheckCircle
                              color={"white"}
                              size={17}
                              className="me-2"
                            />
                          )}
                          {obj.name}{" "}
                          {sellOrders.total_count > 0 && obj.checked && (
                            <>({sellOrders.total_count})</>
                          )}
                        </div>
                      ))}
                    </>
                  );
                } else if (key === "buy-orders") {
                  return (
                    <>
                      {filter.buy.map((obj, i) => (
                        <div
                          role={"button"}
                          className={`rounded-pill ps-3 pe-3 mb-3 me-3 pt-1 pb-1 activity-filter-pill ${
                            obj.checked ? "active" : ""
                          }`}
                          key={`filter-pill${i}`}
                          onClick={() => handleBuyFilterType(obj.value)}
                        >
                          {obj.checked && (
                            <FaCheckCircle
                              color={"white"}
                              size={17}
                              className="me-2"
                            />
                          )}
                          {obj.name}{" "}
                          {buyOrders.total_count > 0 && obj.checked && (
                            <>({buyOrders.total_count})</>
                          )}
                        </div>
                      ))}
                    </>
                  );
                } else {
                  return <></>;
                }
              })()}
            </div>
            <div className="col-md-12">
              {loading ? (
                <Loader />
              ) : (
                <div className="myorders-block">
                  {(() => {
                    if (key === "buy-orders") {
                      return (
                        <>
                          <MyOrderCard
                            list={buyOrdersList}
                            buyOrder
                            statusType={type}
                            buyType
                          />

                          {buyOrders.next_page && (
                            <div className="post-header mt-3 mb-3">
                              <div className="media-body">
                                <span
                                  className="loadmore-btn"
                                  role="button"
                                  onClick={loadMoreBuyOrders}
                                >
                                  {moreLoading ? "Loading..." : "Load More"}
                                </span>
                              </div>
                            </div>
                          )}
                        </>
                      );
                    } else if (key === "sell-orders") {
                      return (
                        <>
                          <MyOrderCard
                            list={sellOrdersList}
                            statusType={type}
                          />

                          {sellOrders.next_page && (
                            <div className="post-header mt-3 mb-3">
                              <div className="media-body">
                                <span
                                  className="loadmore-btn"
                                  role="button"
                                  onClick={loadMoreSellOrders}
                                >
                                  {moreLoading ? "Loading..." : "Load More"}
                                </span>
                              </div>
                            </div>
                          )}
                        </>
                      );
                    } else {
                      return (
                        <>
                          <MyOrderCard
                            list={upgradeOrdersList}
                            upgradeOrder={true}
                            type={key}
                            statusType={type}
                          />

                          {upgradeOrders.next_page && (
                            <div className="post-header mt-3 mb-3">
                              <div className="media-body">
                                <span
                                  className="loadmore-btn"
                                  role="button"
                                  onClick={loadMoreUpgradeOrders}
                                >
                                  {moreLoading ? "Loading..." : "Load More"}
                                </span>
                              </div>
                            </div>
                          )}
                        </>
                      );
                    }
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Loader = (props) => (
  <ContentLoader
    viewBox="0 0 900 400"
    width={"100%"}
    height={"100%"}
    backgroundColor="#f5f5f5"
    foregroundColor="#dbdbdb"
    className="mt-0"
    {...props}
  >
    <rect x="0" y="5" rx="5" ry="5" width="900" height="100" />
    <rect x="0" y="120" rx="5" ry="5" width="900" height="100" />
    <rect x="0" y="235" rx="5" ry="5" width="900" height="100" />
  </ContentLoader>
);

export default MyOrders;
