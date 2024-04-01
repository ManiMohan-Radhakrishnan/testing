/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { useSelector } from "react-redux";

import postOne from "../../images/post1.png";

import { currencyFormat, openWindowBlank } from "../../utils/common";
import nonftfound from "../../images/nonftfound.svg";
import ToolTip from "../tooltip";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { MdInfo } from "react-icons/md";
import { CgClose } from "react-icons/cg";
import "./style.scss";

const NFTActiveBid = ({ nftList, setNftList, type = "drops" }) => {
  const { user } = useSelector((state) => state.user.data);

  const handleToggle = (input, index) => {
    const info = [...nftList];
    // const index = info.findIndex((obj) => obj.slug === input.slug);
    info[index] = { ...info[index], info_open: !info[index]?.info_open };

    setNftList(info);
  };

  return (
    <>
      {nftList.length > 0 ? (
        <>
          {nftList.map((nft, i) => (
            <div
              className="col-12 col-sm-6 col-lg-4 col-xl-3"
              key={`nft-active-bid-${i}`}
            >
              <div className="outbid-status mt-3 mb-5" key={`nft-active-${i}`}>
                <div className="outbid-post-image">
                  <img
                    src={
                      nft?.asset_url
                        ? nft?.asset_url
                        : nft?.image_url
                        ? nft?.image_url
                        : postOne
                    }
                    width="100%"
                    alt="nft logo"
                    role={"button"}
                    onClick={() => {
                      if (type === "marketplace" && !nft?.drops_nft) {
                        openWindowBlank(
                          `${process.env.REACT_APP_MARKETPLACE_URL}/order/details/${nft.slug}/${nft.order_slug}`
                        );
                      } else {
                        openWindowBlank(
                          // `${nft?.celebrity_url}/details/${nft?.slug}`
                          `${process.env.REACT_APP_BALL_NFT_URL}/details/${nft.slug}`
                        );
                      }
                    }}
                  />
                </div>
                <div className="outbid-post-detail">
                  <div className="outbid-info">
                    <MdInfo
                      onClick={() => handleToggle(nft, i)}
                      className="info-icon"
                    />
                    {/* {nft.celebrity_name && <p>{nft.celebrity_name}</p>} */}
                    {/* <p className="mt-2">
                      {nft?.core_statistics?.role &&
                      nft?.core_statistics?.role === "Bat"
                        ? "Meta Cricket League Signed Bat"
                        : nft?.core_statistics?.role &&
                          nft?.core_statistics?.role !== "Bat"
                        ? "Meta Cricket League Player"
                        : " Meta Cricket League Collection"}
                    </p> */}
                    <h6 className="post-title">{nft?.name}</h6>
                    {/* <p className="post-description">
                      {nft?.core_statistics?.category}
                    </p> */}
                    <div className="post-cost">
                      <div className="post-sold">
                        <div className="post-sold-text">Your Bid</div>
                        <div className="post-sold-cost">
                          {currencyFormat(nft.amount, user.currency_name)}
                        </div>
                      </div>
                      {type === "marketplace" && !nft?.drops_nft && (
                        <div className="outbid-ending">
                          <div className="post-sold-text">Service Fee</div>
                          <div className="post-sold-cost">
                            {parseFloat(nft.service_fee)}%{" "}
                            <ToolTip
                              icon={
                                <BsFillQuestionCircleFill
                                  size={16}
                                  className="mb-1 check-icon"
                                />
                              }
                              content={
                                "The service fee includes gas fee and the platform fee."
                              }
                              placement="top"
                            />
                          </div>
                        </div>
                      )}
                      {/* <div className="post-auction">
                      <div className="post-sold-text">End of Auction</div>
                      <div className="post-sold-cost">
                        <NFTCounter
                          time={nft.nft_auction_end_time}
                          timeClass="counter-time"
                        />
                      </div>
                    </div> */}
                    </div>
                  </div>
                  <div
                    className={`outbid-auction-status negative_bg ${
                      nft?.info_open ? "active" : "inactive"
                    }`}
                  >
                    {/*  */}
                    <CgClose
                      onClick={() => handleToggle(nft, i)}
                      className="close-icon"
                    />
                    <p> Congratulations! </p>
                    <h6 className="post-title">
                      Right now, you are the top bidder for this NFT! Wishing
                      you the very best to win it!
                    </h6>
                    {/* <a
                    role="button"
                    className="theme-btn claim-btn"
                    onClick={() =>
                      window.open(
                        `${nft.celebrity_url}/details/${nft.slug}`,
                        "_blank"
                      )
                    }
                  >
                    Yes! I'll Bid Higher!
                  </a> */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="nonft_found">
          <div className="nodata-card">
            <img src={nonftfound} height="90" alt="" />
            <h4>
              View the history of your latest active bids on NFTs you've bid on
            </h4>
          </div>
        </div>
      )}
    </>
  );
};

export default NFTActiveBid;
