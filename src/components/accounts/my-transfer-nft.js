/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router";

import { userOwnedNFTsApi as userOwnedMarketplace } from "../../api/methods-marketplace";

import "./_style.scss";
import NFTOwnTransferCard from "../nft-own-transfer-card";

const MyTransferNFT = () => {
  const drop = useRef(null);
  const mynft_scroll = () => drop.current.scrollIntoView();

  const [key, setKey] = useState("drops");

  const [ownPageDrop, setOwnPageDrop] = useState(1);
  const [ownedNFTsDrop, setOwnedNFTsDrop] = useState({});
  const [ownedNFTsListDrop, setOwnedNFTsListDrop] = useState([]);
  const [moreLoadingDrop, setMoreLoadingDrop] = useState(false);

  const [dropsType, setDropType] = useState("owned");

  const { page } = useParams();
  const [nftListLoadingDrop, setNftListLoadingDrop] = useState(false);

  useEffect(() => {
    if (page === "drop") {
      mynft_scroll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Drops
    getUserOwnedNFTsDrop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserOwnedNFTsDrop = async () => {
    try {
      setNftListLoadingDrop(true);
      let nfts = [];
      const result = await userOwnedMarketplace(ownPageDrop, {
        sale_kind: "",
        only_drop_nft: true,
      });
      nfts = result?.data?.data?.nfts?.filter((obj) => obj?.can_transfer);
      setOwnedNFTsListDrop(nfts);
      // setOwnedNFTsDrop(nfts.length);
      setNftListLoadingDrop(false);
    } catch (error) {
      setNftListLoadingDrop(false);
    }
  };

  const getMoreUserOwnedNFTsDrop = async (pageNo) => {
    try {
      setMoreLoadingDrop(true);
      let nfts = [];

      const result = await userOwnedMarketplace(pageNo, {
        sale_kind: "",
        only_drop_nft: true,
      });
      nfts = result?.data?.data?.nfts?.filter((obj) => obj?.can_transfer);
      // setOwnedNFTsDrop(canTransferCount);
      setOwnedNFTsListDrop([...ownedNFTsListDrop, ...nfts]);
      setMoreLoadingDrop(false);
    } catch (err) {
      setMoreLoadingDrop(false);
    }
  };

  const loadMoreOwnedNFTsDrop = () => {
    if (ownedNFTsDrop.next_page) {
      getMoreUserOwnedNFTsDrop(ownPageDrop + 1);
      setOwnPageDrop(ownPageDrop + 1);
    }
  };

  return (
    <div className="main-content-block profilepage">
      <div className="container-fluid">
        <div className="about-user">
          <div className="row">
            <div className="col-md-12 ">
              <div className="about-heading mynft-heading mb-4 mt-4">
                <div className="internal-heading-sec">
                  <h3 className="about-title">Transfer NFTs</h3>
                </div>
                {/* {key === "drops" ? (
                  <>
                    {" "}
                    <div className="top-flex-block-pill">
                      <div className="top-flex-block-pill-box">
                        <div
                          role={"button"}
                          className={`rounded-pill ps-3 pe-3 pt-1 pb-1 top-activity-filter-pill ${
                            dropsType === "owned" ? "active" : ""
                          }`}
                          onClick={() => setDropType("owned")}
                        >
                          Owned
                          (
                          {ownedNFTsDrop.total_count
                            ? ownedNFTsDrop.total_count
                            : 0}
                          )
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )} */}
              </div>
            </div>
          </div>

          <div ref={drop}></div>
          {key === "drops" ? (
            <>
              {dropsType === "owned" ? (
                <>
                  {nftListLoadingDrop ? (
                    <h5 className="text-center mt-3">Loading...</h5>
                  ) : (
                    <NFTOwnTransferCard
                      nftList={ownedNFTsListDrop}
                      data={ownedNFTsDrop}
                      transfer
                    />
                  )}

                  {ownedNFTsDrop.next_page && (
                    <div className="d-flex justify-content-center w-100">
                      <button
                        className="btn btn-outline-dark w-50 h-25 text-center rounded-pill mt-2 mb-3"
                        type="button"
                        disabled={moreLoadingDrop}
                        onClick={loadMoreOwnedNFTsDrop}
                      >
                        {moreLoadingDrop ? "Loading..." : "Load More"}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTransferNFT;
