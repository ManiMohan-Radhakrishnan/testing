import React, { useState } from "react";
import { useSelector } from "react-redux";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { openWindowBlank, calculateTimeLeft } from "../../utils/common";
import postOne from "../../images/post1.png";
import NFTStat from "../nft-stat";

import "./style.scss";
import { BsFillTrophyFill } from "react-icons/bs";

const NFTCard = ({
  nft,
  data,
  putOnSale = false,
  marketplace = false,
  onsale = false,
  upgrade = false,
  playerCard = false,
  handleGuildNft,
  guildNftText,
  isAssign,
  guildUserMenuPermissionList,
}) => {
  const { user } = useSelector((state) => state.user.data);
  const [imageloaded, setImageLoaded] = useState(false);
  const { days, hours, minutes, seconds } = calculateTimeLeft(nft.launch_time);

  var rem_text = "";

  if (days > 0) {
    rem_text += days + "d ";
  }
  if (hours > 0) {
    rem_text += hours + "h ";
  }
  if (minutes > 0) {
    rem_text += minutes + "m ";
  }

  return (
    <div className="guildmynft-card-box">
      <div className="block-box user-post jt-card">
        <div className="item-post">
          {nft?.is_on_sale && <span className="onsale-badge">On Sale</span>}
          {nft?.core_statistics?.rank?.value && (
            <span className="nft-type-badge-rank">
              <span className="rank-title">
                <BsFillTrophyFill />{" "}
                {` ${nft?.core_statistics?.rank?.value}/${nft?.core_statistics?.rank?.maximum}`}
              </span>
            </span>
          )}
          <NFTStat statistics={nft?.core_statistics} />
          {nft?.asset_type === "video/mp4" ? (
            <img
              src={nft?.cover_url || nft?.asset_url}
              width="100%"
              alt="nft logo"
              role="button"
              style={imageloaded ? {} : { height: "20rem" }}
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
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
              role="button"
              style={imageloaded ? {} : { height: "20rem" }}
              onLoad={() => setImageLoaded(true)}
              // onClick={() => {
              //   if (putOnSale) {
              //     openWindowBlank(
              //       `${process.env.REACT_APP_MARKETPLACE_URL}/nft-marketplace/details/${nft.slug}`
              //     );
              //   } else {
              //     if (onsale) {
              //       openWindowBlank(
              //         `${process.env.REACT_APP_MARKETPLACE_URL}/order/details/${nft.slug}/${nft?.order_slug}`
              //       );
              //     } else if (marketplace) {
              //       openWindowBlank(
              //         `${process.env.REACT_APP_MARKETPLACE_URL}/nft-marketplace/details/${nft.slug}`
              //       );
              //     } else if (nft?.is_loot) {
              //       openWindowBlank(
              //         `${
              //           nft.celebrity_url
              //             ? nft.celebrity_url
              //             : data.celebrity_url
              //         }/loot/nft/detail/${nft.slug}`
              //       );
              //     } else if (nft?.child) {
              //       openWindowBlank(
              //         `${
              //           nft.celebrity_url
              //             ? nft.celebrity_url
              //             : data.celebrity_url
              //         }/details/child/nft/${nft.slug}`
              //       );
              //     } else {
              //       openWindowBlank(
              //         `${
              //           nft.celebrity_url
              //             ? nft.celebrity_url
              //             : data.celebrity_url
              //         }/details/${nft.slug}`
              //       );
              //     }
              //   }
              // }}
            />
          )}
        </div>

        <div className="item-content">
          <div className="post-title-box">
            <div className="post-title-block">
              {nft?.user_name && (
                <span className="post-user-name">{nft?.user_name}</span>
              )}

              <h6 className="post-title">{nft?.name}</h6>
            </div>
            {/* <span className="nft-type-badge">
              {nft?.nft_type?.toUpperCase()}
            </span> */}
          </div>

          {/* <div className="post-cost pw_we  d-flex  justify-content-between">
            <div className="left-bids"></div>
            <div className="right-bid">
              {nft.quantity && (
                  <>
                    <div className="post-sold-text end">You Own</div>
                    <div className="post-sold-cost end">{nft.quantity}</div>
                  </>
                )}
            </div>
          </div> */}

          <div className="assign-card-button">
            <div className="skew-box-wrapper-history assign-button-container">
              <div className="wrap-history">
                {isAssign ? (
                  guildUserMenuPermissionList?.assign_nft ? (
                    <button
                      className="btn btn-dark"
                      onClick={() => handleGuildNft(nft)}
                    >
                      <span>{guildNftText}</span>
                    </button>
                  ) : (
                    ""
                  )
                ) : guildUserMenuPermissionList?.remove_nft ? (
                  <button
                    className="btn btn-dark"
                    onClick={() => handleGuildNft(nft)}
                  >
                    <span>{guildNftText}</span>
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
