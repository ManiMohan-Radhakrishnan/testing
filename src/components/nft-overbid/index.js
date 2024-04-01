/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { useSelector } from "react-redux";

import postOne from "../../images/post1.png";

import { currencyFormat, openWindowBlank } from "../../utils/common";
import nonftfound from "../../images/nonftfound.svg";
import { MdInfo } from "react-icons/md";
import { CgClose } from "react-icons/cg";
import "./style.scss";

const NFTOverBid = ({ nftList, setNftList, type = "drops" }) => {
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
              key={`nft-over-bid-${i}`}
            >
              <div className="outbid-status mt-3 mb-5" key={`nft-over-${i}`}>
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
                    {/* {nft.celebrity_name && <p>{nft.celebrity_name}</p>}
                    <h6 className="post-title">{nft.nft_name}</h6> */}
                    {/* <p className="mt-2">
                      {nft?.core_statistics?.role &&
                      nft?.core_statistics?.role === "Bat"
                        ? "Meta Cricket League Signed Bat"
                        : nft?.core_statistics?.role &&
                          nft?.core_statistics?.role !== "Bat"
                        ? "Meta Cricket League Player"
                        : " Meta Cricket League Collection"}
                    </p> */}
                    <div className="post-title-box">
                      <h6 className="post-title">{nft?.nft_name}</h6>
                      {/* {nft.nft_type && (
                        <span className="nft-type-badge">
                          {nft.nft_type.toUpperCase()}
                        </span>
                      )} */}
                    </div>
                    {/* <p className="post-description">
                      {nft?.core_statistics?.category}
                    </p> */}
                    <div className="post-cost">
                      <div className="post-sold">
                        <div className="post-sold-text">Current Bid</div>
                        <div className="post-sold-cost">
                          {currencyFormat(nft.current_bid, user.currency_name)}
                        </div>
                      </div>
                      <div className="outbid-ending">
                        <div className="post-sold-text">Your Bid</div>
                        <div className="post-sold-cost">
                          {currencyFormat(nft.your_bid, user.currency_name)}
                        </div>
                      </div>
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
                    <p> Don't let this chance slip away! </p>
                    <h6 className="post-title">
                      Your Bidding Is No Longer The Highest! Try Bidding Higher
                      To Beat Your Outbidder!
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
              View the history of your latest outbids on NFTs you've bid on
            </h4>
          </div>
        </div>
      )}
    </>
  );
};

export default NFTOverBid;
