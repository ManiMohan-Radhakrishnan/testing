/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import ContentLoader from "react-content-loader";

import { userClaimNFTsApi } from "../../api/methods";
import NFTClaim from "../nft-claim";

const ClaimNFT = () => {
  const [loadingClaim, setLoadingClaim] = useState(false);
  const [claimPage, setClaimPage] = useState(1);
  const [claimNFTs, setClaimNFTs] = useState({});
  const [claimNFTsList, setClaimNFTsList] = useState([]);
  const [moreLoading, setMoreLoading] = useState(false);

  useEffect(() => {
    getUserClaimNFTs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserClaimNFTs = async () => {
    try {
      setLoadingClaim(true);
      const result = await userClaimNFTsApi(claimPage);
      setClaimNFTs(result.data.data ? result.data.data : {});
      setClaimNFTsList(result.data.data.nfts ? result.data.data.nfts : []);
      setLoadingClaim(false);
    } catch (error) {
      console.log(error);
      setLoadingClaim(false);
    }
  };

  const loadMoreClaimNFTs = () => {
    if (claimNFTs.next_page) {
      getMoreUserClaimNFTs(claimPage + 1);
      setClaimPage(claimPage + 1);
    }
  };

  const getMoreUserClaimNFTs = async (pageNo) => {
    try {
      setMoreLoading(true);
      const result = await userClaimNFTsApi(pageNo);
      setClaimNFTs(result.data.data);
      setClaimNFTsList([...claimNFTsList, ...result.data.data.nfts]);
      setMoreLoading(false);
    } catch (err) {
      setMoreLoading(false);
      console.log(
        "🚀 ~ file: wallet.js ~ line 28 ~ getTransactionHistory ~ err",
        err
      );
    }
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
                    <h3 className="wallet-title">Claim NFTs</h3>
                  </div>
                </div>
              </div>
              <div className="bid-activity">
                <div className="banner-content">
                  <div className="media">
                    <div className="media-body">
                      {/* <h4 className="transaction-history-title">Total Bids</h4> */}
                      <div>
                        {/* <ul className="nav user-nav">
                        <li className="nav-item">
                          {console.log("sss", overBidNFTs?.total_count)}
                          <a
                            className={`nav-link ${
                              key === "overbid" ? "active" : ""
                            }`}
                            role="button"
                            href="#"
                            onClick={() => setKey("overbid")}
                          >
                            Overbid (
                            {overBidNFTs?.total_count
                              ? overBidNFTs?.total_count
                              : 0}
                            )
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className={`nav-link ${
                              key === "claim" ? "active" : ""
                            }`}
                            aria-current="page"
                            role="button"
                            href="#"
                            onClick={() => setKey("claim")}
                          >
                            Claim (
                            {claimNFTs.total_count ? claimNFTs.total_count : 0})
                          </a>
                        </li>
                      </ul> */}
                      </div>
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
                            Something else here.
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
              <>
                {loadingClaim ? (
                  <Loader />
                ) : (
                  <NFTClaim
                    nftList={claimNFTsList}
                    data={claimNFTs}
                    setClaimNFTsList={setClaimNFTsList}
                  />
                )}
                {claimNFTs.next_page && (
                  <div className="d-flex justify-content-center w-100">
                    <button
                      className="btn btn-outline-dark w-50 h-25 text-center rounded-pill mt-2 mb-3"
                      type="button"
                      disabled={moreLoading}
                      onClick={loadMoreClaimNFTs}
                    >
                      {moreLoading ? "Loading..." : "Load More"}
                    </button>
                  </div>
                )}
              </>
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

export default ClaimNFT;
