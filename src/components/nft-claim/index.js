/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useHistory } from "react-router";

import { claimNFTApi } from "../../api/methods";
import { currencyFormat, openWindowBlank } from "../../utils/common";
import postOne from "../../images/post1.png";
import nonftfound from "../../images/nonftfound.svg";

const NFTClaim = ({ nftList, setClaimNFTsList, data }) => {
  const history = useHistory();
  const { user } = useSelector((state) => state.user.data);
  const [buttonIndex, setButtonIndex] = useState([]);

  const handleClaim = async (index, nftSlug) => {
    try {
      const result = await claimNFTApi({
        nft_slug: nftSlug,
        celebrity_slug: data.celebrity_slug,
      });
      if (result.data.success) {
        setButtonIndex([...buttonIndex, index]);
        // if (index > -1) {
        //   nftList.splice(index, 1);
        //   setClaimNFTsList([...nftList]);
        // }
        toast.success(
          "Your NFT claim is being processed and it will take 7 days to complete."
        );
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      {nftList.length > 0 ? (
        <>
          {nftList.map((nft, i) => (
            <div className="bid-status mt-3 mb-5" key={`status${i}`}>
              <div className="bid-post-image">
                <img
                  src={
                    nft?.asset_url
                      ? nft?.asset_url
                      : nft?.image_url
                      ? nft?.image_url
                      : postOne
                  }
                  role="button"
                  onClick={() => {
                    if (nft.is_loot) {
                      openWindowBlank(
                        `${
                          nft.celebrity_url
                            ? nft.celebrity_url
                            : data.celebrity_url
                        }/loot/nft/detail/${nft.slug}`
                      );
                    } else {
                      openWindowBlank(
                        `${
                          nft.celebrity_url
                            ? nft.celebrity_url
                            : data.celebrity_url
                        }/details/${nft.slug}`
                      );
                    }
                  }}
                  width="100%"
                  alt="nft logo"
                />
              </div>
              <div className="bid-post-detail">
                <div className="bid-detail">
                  <p>
                    {nft.category_name} |{" "}
                    {nft.celebrity_name
                      ? nft.celebrity_name
                      : data.celebrity_name}
                  </p>
                  <div className="post-title-box">
                    <h6 className="post-title">{nft.nft_name}</h6>
                    {/* {nft.nft_type && (
                      <span className="nft-type-badge">
                        {nft.nft_type.toUpperCase()}
                      </span>
                    )} */}
                  </div>

                  {/* {nft.claim_status === "claim requested" && (
                    <span className="claim-status text-black">
                      <b className="text-black">Claim Status :</b> Your NFT
                      claim is being processed and it will take 7 days to
                      complete.
                    </span>
                  )} */}

                  <div className="post-cost">
                    <div className="post-sold">
                      <div className="post-sold-text">
                        {(() => {
                          if (nft.is_loot) {
                            return "Price";
                          } else if (nft.nft_type === "erc721") {
                            return "Final Bid";
                          } else {
                            return "Price";
                          }
                        })()}
                      </div>
                      <div className="post-sold-cost">
                        {nft.nft_type === "erc721"
                          ? currencyFormat(nft.top_bid, user.currency_name)
                          : currencyFormat(nft.buy_amount, user.currency_name)}
                      </div>
                    </div>
                    {/* <div className="post-auction">
                      <div className="post-sold-text">End of Auction</div>
                      <div className="post-sold-cost">
                        {dayjs(nft.nft_auction_end_time).format("DD. MM. YYYY")}
                      </div>
                    </div> */}
                    {nft.quantity && (
                      <div className="post-auction">
                        <div className="post-sold-text">You Own</div>
                        <div className="post-sold-cost">{nft.quantity}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="auction-status positive_bg">
                  {/* <p>Welcome to the Elite Club! </p> */}
                  <p className="post-title">
                    Your NFT will now be automatically claimed after minting.
                  </p>
                  <h6 className="post-title">
                    You Can Now Be A Proud Owner of A Unique & Rare NFT!
                  </h6>
                  {/* {(() => {
                    if (user.kyc_status === "success") {
                      return (
                        <button
                          type="button"
                          className="theme-btn claim-btn"
                          onClick={() => handleClaim(i, nft.slug)}
                          disabled={buttonIndex.includes(i) || !nft.can_claim}
                        >
                          {(() => {
                            if (buttonIndex.includes(i)) {
                              return "Claim Requested";
                            } else if (nft.claim_status === "claim") {
                              return "Claim It Right Now!";
                            } else if (nft.claim_status === "claim requested") {
                              return "Claim Requested";
                            } else if (nft.claim_status === "token transfer") {
                              return "Claimed Successfully";
                            }
                          })()}
                        </button>
                      );
                    } else if (user.kyc_status === "pending") {
                      return (
                        <button
                          type="button"
                          className="theme-btn claim-btn"
                          onClick={() => history.push("/accounts/profile")}
                        >
                          Your KYC verification is pending!
                        </button>
                      );
                    } else {
                      return (
                        <button
                          type="button"
                          className="theme-btn claim-btn"
                          onClick={() => history.push("/accounts/profile")}
                        >
                          Please complete your KYC
                        </button>
                      );
                    }
                  })()} */}
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
              You have not bought any NFTs yet! The NFTs you purchased will be
              available in this section.
            </h4>
          </div>
        </div>
      )}
    </>
  );
};

export default NFTClaim;
