/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useRef, useEffect } from "react";
import ContentLoader from "react-content-loader";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

import { Dropdown } from "react-bootstrap";
import { useLocation } from "react-router";

import { BiCaretDown } from "react-icons/bi";

import MyOrderCard from "../my-orders";

import {
  getUpgradesApi,
  userBuyOrdersApi,
  userSellOrdersApi,
  primaryInvoices,
} from "../../api/methods-marketplace";
import UpGradeInvoice from "../upgrade-invoice/index";
import PrimaryInvoice from "../primary-invoice";
import { EVENT_NAMES, invokeTrackEvent } from "../../utils/common";

const MyInvoice = () => {
  const location = useLocation();

  const { page } = useParams();
  const mynft = useRef(null);
  const myProfile = useRef(null);
  const mynft_scroll = () => mynft.current.scrollIntoView();
  const myprofile_scroll = () => myProfile.current.scrollIntoView();
  const state = useSelector((state) => state.user);
  const { user } = state.data;
  const [loading, setLoading] = useState(false);
  const [onlyAuction, setOnlyAuction] = useState(false);
  const [key, setKey] = useState("marketplace");
  const [moreLoading, setMoreLoading] = useState(false);
  const [dropsType, setDropType] = useState("droporder");
  const [marketplaceType, setMarketplaceType] = useState("buyorder");
  const [buyOrders, setBuyOrders] = useState({});
  const [buyOrdersList, setBuyOrdersList] = useState([]);
  const [dropOrders, setDropOrders] = useState({});
  const [dropOrdersList, setDropOrdersList] = useState([]);
  const [sellOrders, setSellOrders] = useState({});
  const [sellOrdersList, setSellOrdersList] = useState([]);
  const [buyOrderPage, setBuyOrderPage] = useState(1);
  const [dropOrderPage, setDropOrderPage] = useState(1);

  const [sellOrderPage, setSellOrderPage] = useState(1);
  const [upGrade, setUpGrade] = useState({});
  const [upGradeList, setUpGradeList] = useState([]);
  const [upGradePage, setUpgradePage] = useState(1);
  const [showAlert, setShowAlert] = useState(false);

  const [apiFilterList, setApiFilterList] = useState(() => ({
    sale_kind: "all",
    nft_collection: [],
    keyword: "",
  }));

  useEffect(() => {
    if (location.hash === "#web") {
      setShowAlert(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlyAuction]);

  useEffect(() => {
    if (page === "mynft") {
      mynft_scroll();
    } else {
      myprofile_scroll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const DropdownToggle = React.forwardRef(({ onClick }, ref) => (
    <div
      role="button"
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      <span className="text-capitalize">
        {(() => {
          if (key === "drops") {
            return "Drops";
          } else {
            return "Marketplace";
          }
        })()}
      </span>
    </div>
  ));

  useEffect(() => {
    invokeTrackEvent(EVENT_NAMES?.INVOICE_VIEWED, {});
    getUserSellOrders(1);
    getUserBuyOrders(1);
    getUpgrades(1);
    getUserDropOrders(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserBuyOrders = async (pageNo, type = "transferred") => {
    try {
      setLoading(true);
      const result = await userBuyOrdersApi(pageNo, type);
      setBuyOrders(result.data.data);
      setBuyOrdersList(result.data.data.orders);
      setLoading(false);

      if (result.data.data.total_count > 0) {
        setKey("buy-orders");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getMoreUserBuyOrders = async (pageNo, type = "transferred") => {
    try {
      setMoreLoading(true);
      const result = await userBuyOrdersApi(pageNo, type);
      setBuyOrders(result.data.data);
      setBuyOrdersList([...buyOrdersList, ...result.data.data.orders]);
      setMoreLoading(false);
    } catch (err) {
      setMoreLoading(false);
    }
  };

  const loadMoreBuyOrders = () => {
    if (buyOrders.next_page) {
      //   const value = filter.buy
      //     .filter((xx) => xx.checked === true)
      //     .map((obj, i) => obj.value);
      //console.log(value);
      const buyFilter = "transferred";
      getMoreUserBuyOrders(buyOrderPage + 1, buyFilter);
      setBuyOrderPage(buyOrderPage + 1);
    }
  };

  const getUserDropOrders = async (pageNo) => {
    try {
      setLoading(true);
      const result = await primaryInvoices(pageNo);
      setDropOrders(result.data.data);
      setDropOrdersList(result.data.data.invoices);
      setLoading(false);

      if (result.data.data.total_count > 0) {
        setKey("drop-orders");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getMoreUserDropOrders = async (pageNo) => {
    try {
      setMoreLoading(true);
      const result = await primaryInvoices(pageNo);
      setDropOrders(result.data.data);
      setDropOrdersList([...dropOrdersList, ...result.data.data.invoices]);
      setMoreLoading(false);
    } catch (err) {
      setMoreLoading(false);
    }
  };

  const loadMoreDropOrders = () => {
    if (dropOrders.next_page) {
      //   const value = filter.buy
      //     .filter((xx) => xx.checked === true)
      //     .map((obj, i) => obj.value);
      //console.log(value);
      // const buyFilter = "transferred";
      getMoreUserDropOrders(dropOrderPage + 1);
      setDropOrderPage(dropOrderPage + 1);
    }
  };

  const getUserSellOrders = async (pageNo, type = "success") => {
    try {
      setLoading(true);
      const result = await userSellOrdersApi(pageNo, type);
      setSellOrders(result.data.data);
      setSellOrdersList(result.data.data.orders);
      setLoading(false);

      if (result.data.data.total_count > 0) {
        setKey("sell-orders");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getMoreUserSellOrders = async (pageNo, type = "success") => {
    try {
      setMoreLoading(true);
      const result = await userSellOrdersApi(pageNo, type);
      setSellOrders(result.data.data);
      setSellOrdersList([...sellOrdersList, ...result.data.data.orders]);
      setMoreLoading(false);
    } catch (err) {
      setMoreLoading(false);
    }
  };
  const loadMoreSellOrders = () => {
    if (sellOrders.next_page) {
      //   const value = filter.sell
      //     .filter((xx) => xx.checked === true)
      //     .map((obj, i) => obj.value);

      const sellFilter = "success";
      getMoreUserSellOrders(sellOrderPage + 1, sellFilter);
      setSellOrderPage(sellOrderPage + 1);
    }
  };

  const getUpgrades = async (pageNo) => {
    try {
      setLoading(true);
      const result = await getUpgradesApi(pageNo);
      setUpGrade(result.data.data);
      setUpGradeList(result.data.data.upgrades);
      setLoading(false);

      if (result.data.data.total_count > 0) {
        setKey("sell-orders");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getMoregetUpgrades = async (pageNo) => {
    try {
      setMoreLoading(true);
      const result = await getUpgradesApi(pageNo);
      setUpGrade(result.data.data);
      setUpGradeList([...upGradeList, ...result.data.data.upgrades]);
      setMoreLoading(false);
    } catch (err) {
      setMoreLoading(false);
    }
  };

  const loadMoreUpgrades = () => {
    if (sellOrders.next_page) {
      const sellFilter = "";
      getMoregetUpgrades(upGradePage + 1, sellFilter);
      setUpgradePage(upGradePage + 1);
    }
  };

  return (
    <>
      {/* <div className="col-md-10"> */}
      <div className="main-content-block profilepage" ref={myProfile}>
        <div className="container-fluid">
          <div className="wallet-user mt-3">
            <div className="row">
              <div className="col-md-12 ">
                <div className="about-heading mynft-heading mb-4">
                  <div className="internal-heading-sec">
                    <h3 className="about-title">My Invoices</h3>
                    <div className="me-2">
                      <Dropdown className="drop_mkplace">
                        <span className="drop_mkplace_btn">
                          <Dropdown.Toggle
                            align="end"
                            drop="end"
                            as={DropdownToggle}
                          >
                            {" "}
                          </Dropdown.Toggle>
                          <BiCaretDown />
                        </span>
                        <Dropdown.Menu align="end">
                          <Dropdown.Item
                            as="button"
                            className={key === "drops" ? "active" : ""}
                            onClick={() => setKey("drops")}
                          >
                            Drops
                          </Dropdown.Item>
                          <Dropdown.Item
                            as="button"
                            className={key === "marketplace" ? "active" : ""}
                            onClick={() => setKey("marketplace")}
                          >
                            Marketplace
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                  {key === "drops" ? (
                    <>
                      {" "}
                      <div className="top-flex-block-pill">
                        <div className="top-flex-block-pill-box">
                          <div
                            role={"button"}
                            className={`rounded-pill ps-3 pe-3 pt-1 pb-1 top-activity-filter-pill ${
                              dropsType === "droporder" ? "active" : ""
                            }`}
                            onClick={() => setDropType("droporder")}
                          >
                            Buy orders
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {" "}
                      <div className="top-flex-block-pill">
                        <div className="top-flex-block-pill-box">
                          <div
                            role={"button"}
                            className={`rounded-pill ps-3 pe-3 pt-1 pb-1 top-activity-filter-pill ${
                              marketplaceType === "buyorder" ? "active" : ""
                            }`}
                            onClick={() => setMarketplaceType("buyorder")}
                          >
                            Buy orders
                          </div>

                          <div
                            role={"button"}
                            className={`rounded-pill ps-3 pe-3 pt-1 pb-1 top-activity-filter-pill ${
                              marketplaceType === "sellorder" ? "active" : ""
                            }`}
                            onClick={() => setMarketplaceType("sellorder")}
                          >
                            Sell orders
                          </div>
                          {/* <div
                              role={"button"}
                              className={`rounded-pill ps-3 pe-3 pt-1 pb-1 top-activity-filter-pill ${
                                marketplaceType === "upgrade" ? "active" : ""
                              }`}
                              onClick={() => setMarketplaceType("upgrade")}
                            >
                              Upgrades
                            </div> */}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* {key === "drops" && (
                <div className="row">
                  <div className="col">
                    <div className="wallet-box mt-0">
                      <div className="media">
                        <div className="media-body">
                          <div className="item-subtitle text-center">
                            Total Super Loot NFTs Bought
                          </div>
                          <div className="item-title text-center">
                            {lootCount?.bundle_count
                              ? lootCount.bundle_count
                              : 0}
                          </div>
                        </div>
                      </div>
                      <div className="media">
                        <div className="media-body">
                          <div className="item-subtitle text-center">
                            Total NFTs You Got{" "}
                            <ToolTip
                              content={
                                "The Super Loot contains either 2 MCL player NFTs or 2 MCL player NFTs and 1 signed bat NFT."
                              }
                              icon={
                                <BsFillQuestionCircleFill
                                  size={16}
                                  className="ms-2 question-icon"
                                />
                              }
                              placement="top"
                            />
                          </div>
                          <div className="item-title text-center">
                            {lootCount?.nfts_count ? lootCount.nfts_count : 0}
                          </div>
                        </div>
                      </div>
                      <div className="media">
                        <div className="media-body">
                          <div className="item-subtitle text-center">
                            Total Treasure Boxes You Got
                          </div>
                          <div className="item-title text-center">
                            {lootCount?.bundle_count
                              ? Math.floor(lootCount.bundle_count / 5)
                              : 0}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {lootCount?.parent_count > 0 && key === "drops" && (
                <div className="row">
                  <div className="col">
                    <div className="wallet-box mt-0">
                      <div className="media">
                        <div className="media-body">
                          <div className="item-subtitle text-center">
                            Total Auction Collections Bought
                          </div>
                          <div className="item-title text-center">
                            {lootCount?.parent_count
                              ? lootCount.parent_count
                              : 0}
                          </div>
                        </div>
                      </div>
                      <div className="media">
                        <div className="media-body">
                          <div className="item-subtitle text-center">
                            Total NFTs You Got{" "}
                            <ToolTip
                              content={
                                "Each auction collection contains 1 Immortal Bat NFT and 2 MCL Player NFTs."
                              }
                              icon={
                                <BsFillQuestionCircleFill
                                  size={16}
                                  className="ms-2 question-icon"
                                />
                              }
                              placement="top"
                            />
                          </div>
                          <div className="item-title text-center">
                            {lootCount?.child_count ? lootCount.child_count : 0}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )} */}
            {loading ? (
              <Loader />
            ) : (
              <div className="myorders-block">
                {key === "drops" ? (
                  <>
                    {dropsType === "droporder" && (
                      <>
                        <PrimaryInvoice
                          list={dropOrdersList}
                          buyOrder
                          IsDownload={true}
                        />

                        {dropOrders.next_page && (
                          <div className="post-header mt-3 mb-3">
                            <div className="media-body">
                              <span
                                className="loadmore-btn"
                                role="button"
                                onClick={loadMoreDropOrders}
                              >
                                {moreLoading ? "Loading..." : "Load More"}
                              </span>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {marketplaceType === "buyorder" && (
                      <>
                        <MyOrderCard
                          list={buyOrdersList}
                          buyOrder
                          IsDownload={true}
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
                    )}

                    {marketplaceType === "sellorder" ? (
                      <>
                        <MyOrderCard list={sellOrdersList} IsDownload={true} />

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
                    ) : marketplaceType === "upgrade" ? (
                      <>
                        <UpGradeInvoice list={upGradeList} />

                        {upGrade.next_page && (
                          <div className="post-header mt-3 mb-3">
                            <div className="media-body">
                              <span
                                className="loadmore-btn"
                                role="button"
                                onClick={loadMoreUpgrades}
                              >
                                {moreLoading ? "Loading..." : "Load More"}
                              </span>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </div>
            )}
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

export default MyInvoice;
