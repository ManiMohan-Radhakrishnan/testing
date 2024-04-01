/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import ContentLoader from "react-content-loader";

import { userActiveBidNFTsApi, userOverBidNFTsApi } from "../../api/methods";
import {
  userActiveBidNFTsApi as userActiveBidMarketplace,
  userOverBidNFTsApi as userOverBidMarketplace,
} from "../../api/methods-marketplace";
import NFTActiveBid from "../nft-activebid";
import NFTOverBid from "../nft-overbid";
import { useSelector } from "react-redux";
import { FaCheckCircle } from "react-icons/fa";
import { EVENT_NAMES, invokeTrackEvent } from "../../utils/common";

const BidActivity = () => {
  const user = useSelector((state) => state.user);

  const [loadingBid, setLoadingBid] = useState(false);
  const [loadingActiveBid, setLoadingActiveBid] = useState(false);
  const [overBidPage, setOverBidPage] = useState(1);
  const [activeBidPage, setActiveBidPage] = useState(1);
  const [activeBidNFTs, setActiveBidNFTs] = useState({});
  const [activeBidNFTsList, setActiveBidNFTsList] = useState([]);
  const [overBidNFTs, setOverBidNFTs] = useState({});
  const [overBidNFTsList, setOverBidNFTsList] = useState([]);
  const [moreLoadingActive, setMoreLoadingActive] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);

  const [loadingBidDrops, setLoadingBidDrops] = useState(false);
  const [loadingActiveBidDrops, setLoadingActiveBidDrops] = useState(false);
  const [activeBidPageDrops, setActiveBidPageDrops] = useState(1);
  const [overBidPageDrops, setOverBidPageDrops] = useState(1);
  const [activeBidNFTsDrops, setActiveBidNFTsDrops] = useState({});
  const [activeBidNFTsListDrops, setActiveBidNFTsListDrops] = useState([]);
  const [overBidNFTsDrops, setOverBidNFTsDrops] = useState({});
  const [overBidNFTsListDrops, setOverBidNFTsListDrops] = useState([]);
  const [moreLoadingActiveDrops, setMoreLoadingActiveDrops] = useState(false);
  const [moreLoadingDrops, setMoreLoadingDrops] = useState(false);

  const [tab, setTab] = useState("marketplace");
  const [dropsType, setDropType] = useState("active-bids");
  const [marketplaceType, setMarketplaceType] = useState("active-bids");

  useEffect(() => {
    getUserActiveBidNFTs();
    getUserOverBidNFTs();
    invokeTrackEvent(EVENT_NAMES?.BIDS_VIEWED, {});
    // getUserActiveBidNFTsDrops();
    // getUserOverBidNFTsDrops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserActiveBidNFTs = async () => {
    try {
      setLoadingActiveBid(true);
      const result = await userActiveBidMarketplace(activeBidPage);
      setActiveBidNFTs(result.data.data ? result.data.data : {});
      const list = result.data.data.bids ? result.data.data.bids : [];

      setActiveBidNFTsList(list);
      setLoadingActiveBid(false);

      if (list.length > 0) {
        setTab("marketplace");
      }
    } catch (error) {
      console.log(error);
      setLoadingActiveBid(false);
    }
  };

  const getMoreUserActiveBidNFTs = async (pageNo) => {
    try {
      setMoreLoadingActive(true);
      const result = await userActiveBidMarketplace(pageNo);
      setActiveBidNFTs(result.data.data);
      setActiveBidNFTsList([...overBidNFTsList, ...result.data.data.bids]);
      setMoreLoadingActive(false);
    } catch (err) {
      setMoreLoadingActive(false);
      console.log(
        "🚀 ~ file: wallet.js ~ line 28 ~ getTransactionHistory ~ err",
        err
      );
    }
  };

  const loadMoreActiveBidNFTs = () => {
    if (activeBidNFTs.next_page) {
      getMoreUserActiveBidNFTs(activeBidPage + 1);
      setActiveBidPage(activeBidPage + 1);
    }
  };

  const getUserOverBidNFTs = async () => {
    try {
      setLoadingBid(true);
      const result = await userOverBidMarketplace(overBidPage);
      setOverBidNFTs(result.data.data ? result.data.data : {});
      const list = result.data.data.bids ? result.data.data.bids : [];

      setOverBidNFTsList(list);
      setLoadingBid(false);

      if (list.length > 0) {
        setTab("marketplace");
      }
    } catch (error) {
      console.log(error);
      setLoadingBid(false);
    }
  };

  const getMoreUserOverBidNFTs = async (pageNo) => {
    try {
      setMoreLoading(true);
      const result = await userOverBidMarketplace(pageNo);
      setOverBidNFTs(result.data.data);
      setOverBidNFTsList([...overBidNFTsList, ...result.data.data.bids]);
      setMoreLoading(false);
    } catch (err) {
      setMoreLoading(false);
      console.log(
        "🚀 ~ file: wallet.js ~ line 28 ~ getTransactionHistory ~ err",
        err
      );
    }
  };

  const loadMoreOverBidNFTs = () => {
    if (overBidNFTs.next_page) {
      getMoreUserOverBidNFTs(overBidPage + 1);
      setOverBidPage(overBidPage + 1);
    }
  };

  // const getUserOverBidNFTsDrops = async () => {
  //   try {
  //     setLoadingBidDrops(true);
  //     const result = await userOverBidNFTsApi(overBidPageDrops);
  //     setOverBidNFTsDrops(result.data.data ? result.data.data : {});
  //     const list = result.data.data.bids ? result.data.data.bids : [];
  //     setOverBidNFTsListDrops(list);
  //     setLoadingBidDrops(false);

  //     if (list.length > 0) {
  //       setTab("drops");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     setLoadingBidDrops(false);
  //   }
  // };

  // const getMoreUserOverBidNFTsDrops = async (pageNo) => {
  //   try {
  //     setMoreLoadingDrops(true);
  //     const result = await userOverBidNFTsApi(pageNo);
  //     setOverBidNFTsDrops(result.data.data);
  //     setOverBidNFTsListDrops([
  //       ...overBidNFTsListDrops,
  //       ...result.data.data.bids,
  //     ]);
  //     setMoreLoadingDrops(false);
  //   } catch (err) {
  //     setMoreLoadingDrops(false);
  //     console.log(
  //       "🚀 ~ file: wallet.js ~ line 28 ~ getTransactionHistory ~ err",
  //       err
  //     );
  //   }
  // };

  // const loadMoreOverBidNFTsDrops = () => {
  //   if (overBidNFTsDrops.next_page) {
  //     getMoreUserOverBidNFTsDrops(overBidPageDrops + 1);
  //     setOverBidPageDrops(overBidPageDrops + 1);
  //   }
  // };

  // const getUserActiveBidNFTsDrops = async () => {
  //   try {
  //     setLoadingActiveBidDrops(true);
  //     const result = await userActiveBidNFTsApi(activeBidPageDrops);
  //     setActiveBidNFTsDrops(result.data.data ? result.data.data : {});
  //     const list = result.data.data.bids ? result.data.data.bids : [];
  //     setActiveBidNFTsListDrops(list);
  //     setLoadingActiveBidDrops(false);

  //     if (list.length > 0) {
  //       setTab("drops");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     setLoadingActiveBidDrops(false);
  //   }
  // };

  // const getMoreActiveOverBidNFTsDrops = async (pageNo) => {
  //   try {
  //     setMoreLoadingActiveDrops(true);
  //     const result = await userActiveBidNFTsApi(pageNo);
  //     setActiveBidNFTsDrops(result.data.data);
  //     setActiveBidNFTsListDrops([
  //       ...activeBidNFTsListDrops,
  //       ...result.data.data.bids,
  //     ]);
  //     setMoreLoadingActiveDrops(false);
  //   } catch (err) {
  //     setMoreLoadingActiveDrops(false);
  //   }
  // };

  // const loadMoreActiveBidNFTsDrops = () => {
  //   if (activeBidNFTsDrops.next_page) {
  //     getMoreActiveOverBidNFTsDrops(activeBidPageDrops + 1);
  //     setActiveBidPageDrops(activeBidPageDrops + 1);
  //   }
  // };

  return (
    <>
      {/* <div className="col-md-10"> */}
      <div className="main-content-block">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="mt-3">
                <div className="row align-items-center">
                  <div className="col-lg-12">
                    <div className="about-heading mb-4">
                      <div>
                        <h3 className="about-title">My Bids</h3>
                      </div>
                      <div>
                        <ul className="nav user-nav">
                          {/* <li className="nav-item">
                            <a
                              className={`nav-link ${
                                tab === "drops" ? "active" : ""
                              }`}
                              aria-current="page"
                              role="button"
                              href="javascript:void(0);"
                              onClick={() => setTab("drops")}
                            >
                              Drops
                            </a>
                          </li> */}

                          {/* <li className="nav-item">
                            <a
                              className={`nav-link ${
                                tab === "marketplace" ? "active" : ""
                              }`}
                              role="button"
                              href="javascript:void(0);"
                              onClick={() => setTab("marketplace")}
                            >
                              Marketplace
                            </a>
                          </li> */}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              {tab === "drops" ? (
                <>
                  <div className="d-flex">
                    <div
                      role={"button"}
                      className={`rounded-pill ps-3 pe-3 mb-3 me-3 pt-1 pb-1 activity-filter-pill ${
                        dropsType === "active-bids" ? "active" : ""
                      }`}
                      onClick={() => setDropType("active-bids")}
                    >
                      {dropsType === "active-bids" && (
                        <FaCheckCircle
                          color={"white"}
                          size={17}
                          className="me-2"
                        />
                      )}
                      Active Bids
                    </div>
                    <div
                      role={"button"}
                      className={`rounded-pill ps-3 pe-3 mb-3 me-3 pt-1 pb-1 activity-filter-pill ${
                        dropsType === "over-bids" ? "active" : ""
                      }`}
                      onClick={() => setDropType("over-bids")}
                    >
                      {dropsType === "over-bids" && (
                        <FaCheckCircle
                          color={"white"}
                          size={17}
                          className="me-2"
                        />
                      )}
                      Outbids
                    </div>
                  </div>
                  {/* {dropsType === "active-bids" ? (
                    <>
                      {loadingBidDrops ? (
                        <Loader />
                      ) : (
                        <div className="row">
                          <NFTActiveBid
                            type={"drops"}
                            nftList={activeBidNFTsListDrops}
                            setNftList={setActiveBidNFTsListDrops}
                            data={activeBidNFTsDrops}
                          />
                        </div>
                      )}
                      {activeBidNFTsDrops.next_page && (
                        <div className="d-flex justify-content-center w-100">
                          <button
                            className="btn btn-outline-dark w-50 h-25 text-center rounded-pill mt-2 mb-3"
                            type="button"
                            disabled={moreLoadingActiveDrops}
                            onClick={loadMoreActiveBidNFTsDrops}
                          >
                            {moreLoadingActiveDrops
                              ? "Loading..."
                              : "Load More"}
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {loadingBidDrops ? (
                        <Loader />
                      ) : (
                        <div className="row">
                          <NFTOverBid
                            type={"drops"}
                            nftList={overBidNFTsListDrops}
                            setNftList={setOverBidNFTsListDrops}
                            data={overBidNFTsDrops}
                          />
                        </div>
                      )}
                      {overBidNFTsDrops.next_page && (
                        <div className="d-flex justify-content-center w-100">
                          <button
                            className="btn btn-outline-dark w-50 h-25 text-center rounded-pill mt-2 mb-3"
                            type="button"
                            disabled={moreLoadingDrops}
                            onClick={loadMoreOverBidNFTsDrops}
                          >
                            {moreLoadingDrops ? "Loading..." : "Load More"}
                          </button>
                        </div>
                      )}
                    </>
                  )} */}
                </>
              ) : (
                <>
                  <div className="d-flex">
                    <div
                      role={"button"}
                      className={`rounded-pill ps-3 pe-3 mb-3 me-3 pt-1 pb-1 activity-filter-pill ${
                        marketplaceType === "active-bids" ? "active" : ""
                      }`}
                      onClick={() => setMarketplaceType("active-bids")}
                    >
                      {marketplaceType === "active-bids" && (
                        <FaCheckCircle
                          color={"white"}
                          size={17}
                          className="me-2"
                        />
                      )}
                      Active Bids
                    </div>
                    <div
                      role={"button"}
                      className={`rounded-pill ps-3 pe-3 mb-3 me-3 pt-1 pb-1 activity-filter-pill ${
                        marketplaceType === "over-bids" ? "active" : ""
                      }`}
                      onClick={() => setMarketplaceType("over-bids")}
                    >
                      {marketplaceType === "over-bids" && (
                        <FaCheckCircle
                          color={"white"}
                          size={17}
                          className="me-2"
                        />
                      )}
                      Outbids
                    </div>
                  </div>

                  {marketplaceType === "active-bids" ? (
                    <>
                      {loadingActiveBid ? (
                        <Loader />
                      ) : (
                        <div className="row">
                          <NFTActiveBid
                            type={"marketplace"}
                            nftList={activeBidNFTsList}
                            setNftList={setActiveBidNFTsList}
                            data={activeBidNFTs}
                          />
                        </div>
                      )}
                      {activeBidNFTs.next_page && (
                        <div className="d-flex justify-content-center w-100">
                          <button
                            className="btn btn-outline-dark w-50 h-25 text-center rounded-pill mt-2 mb-3"
                            type="button"
                            disabled={moreLoadingActive}
                            onClick={loadMoreActiveBidNFTs}
                          >
                            {moreLoadingActive ? "Loading..." : "Load More"}
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {loadingBid ? (
                        <Loader />
                      ) : (
                        <div className="row">
                          <NFTOverBid
                            type={"marketplace"}
                            nftList={overBidNFTsList}
                            setNftList={setOverBidNFTsList}
                            data={overBidNFTs}
                          />
                        </div>
                      )}
                      {overBidNFTs.next_page && (
                        <div className="d-flex justify-content-center w-100">
                          <button
                            className="btn btn-outline-dark w-50 h-25 text-center rounded-pill mt-2 mb-3"
                            type="button"
                            disabled={moreLoading}
                            onClick={loadMoreOverBidNFTs}
                          >
                            {moreLoading ? "Loading..." : "Load More"}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </>
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
    className="mt-3"
    {...props}
  >
    <rect x="0" y="5" rx="5" ry="5" width="900" height="100" />
    <rect x="0" y="120" rx="5" ry="5" width="900" height="100" />
    <rect x="0" y="235" rx="5" ry="5" width="900" height="100" />
  </ContentLoader>
);

export default BidActivity;
