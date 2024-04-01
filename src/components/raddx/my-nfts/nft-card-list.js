import { useEffect, useState } from "react";
import { AiOutlineDollarCircle } from "react-icons/ai";

import NFTCounter from "../../nft-counter";

import Stats from "./stats";
import {
  currencyFormat,
  openWindowBlank,
  validateCurrency,
  validateCurrencyBundleNft,
} from "../../../utils/common";
import { DEFAULT_REVENUE_SHARE } from "../../../utils/common";

import images from "../../../utils/raddx-images.json";

import "./styles.scss";

const NFTCardList = ({
  nft,
  selected,
  setSelected,
  setSelectedAll,
  showInput = false,
  hideStats = false,
  hideCheckbox = false,
  allTab = false,
  saleTab = false,
  rented = false,
  setSlug,
  setDetailPop,
  myRentedNft = false,
  setMyRentedRevokePop,
  hideMenus = false,
  navigation = false,
  handleNftPriceChange = () => {},
  nftPrices = {},
}) => {
  const [imageloaded, setImageLoaded] = useState(false);
  const [restrictRevoke, setRestrictRevoke] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [error, setError] = useState("");

  const role = nft?.core_statistics?.role?.value || "";
  const isBundle = nft?.order_details?.bundle_id ? true : false;

  const handleChange = (slug) => {
    if (selected?.includes(slug)) {
      setSelected(selected?.filter((i) => i !== slug));
      setSelectedAll(false);
    } else {
      setSelected([...selected, slug]);
    }
  };

  useEffect(() => {
    if (rented && nft?.rental_revoke_time) {
      setRestrictRevoke(
        new Date().getTime() <= new Date(nft?.rental_revoke_time).getTime()
      );
      setShowTimer(true);
    }
  }, [nft]);

  const handleEndEvent = () => {
    setRestrictRevoke(false);
  };

  // const handleInputChange = (e) => {
  //   handleNftPriceChange(nft?.slug, e.target.value);
  // };

  const handleBundleBuyChange = (e) => {
    // if (process.env.REACT_APP_AMOUNT_MAX_LENGTH < parseFloat(e.target.value)) {
    if (
      e.target.value &&
      e.target.value.length <= process.env.REACT_APP_AMOUNT_MAX_LENGTH &&
      !isNaN(e.target.value)
    ) {
      if (validateCurrencyBundleNft(e.target.value)) {
        handleNftPriceChange(nft?.slug, e.target.value);
      }
    } else {
      handleNftPriceChange(nft?.slug, "");
    }
    // } else {
    //   setError("error-bid");
    // }
  };

  return (
    <>
      <div className="mynft-card-item" key={nft?.slug}>
        {showTimer && restrictRevoke && rented && role !== "Shot" && (
          <h6 className="timer-section">
            <span>Revoke in</span>
            <NFTCounter
              customClass="revoke-timer"
              time={nft?.rental_revoke_time}
              handleEndEvent={handleEndEvent}
            />
          </h6>
        )}
        {!hideCheckbox &&
          (!nft?.allow_rent || (rented && !restrictRevoke)) &&
          role !== "Shot" &&
          !nft?.is_on_sale && (
            <Checkbox
              className="rent-nft-card-select"
              allTab={allTab}
              nft={nft}
              selected={selected}
              handleChange={handleChange}
            />
          )}
        <div className="content-block">
          <div className="image-box">
            <img
              src={
                nft?.asset_url
                  ? nft?.asset_url
                  : nft?.image_url
                  ? nft?.image_url
                  : images?.sample_image_gif
              }
              width="100%"
              alt="nft image"
              role={!hideMenus ? "button" : ""}
              style={imageloaded ? {} : { height: "20rem" }}
              onLoad={() => setImageLoaded(true)}
              onClick={() => {
                if (rented) {
                  setSlug(nft?.slug);
                  setDetailPop(true);
                } else if (myRentedNft) {
                  setMyRentedRevokePop(true, nft?.slug);
                } else {
                  if (hideMenus) {
                    return;
                  } else {
                    openWindowBlank(
                      `${process.env.REACT_APP_MARKETPLACE_URL}/nft-marketplace/details/${nft.slug}`
                    );
                  }
                }
              }}
            />
          </div>

          <div className="content-box">
            {nft?.core_statistics?.rank?.value && (
              <span className="rank-title">{`Rank ${nft?.core_statistics?.rank?.value}/${nft?.core_statistics?.rank?.maximum}`}</span>
            )}
            <h6
              className="nft-name"
              onClick={() =>
                !hideMenus &&
                navigation &&
                openWindowBlank(
                  `${process.env.REACT_APP_MARKETPLACE_URL}/nft-marketplace/details/${nft.slug}`
                )
              }
            >
              {nft?.name}
            </h6>

            {!hideStats && (
              <Stats
                statistics={nft?.core_statistics}
                className={"raddx-bundle-list"}
              />
            )}

            <div className="flex-box-info">
              {nft?.core_statistics?.role?.value !== "Shot" &&
                nft?.revenue_share && (
                  <h6 className="shareinfo">
                    <AiOutlineDollarCircle />
                    {/* {parseFloat(nft?.revenue_share) === 0
                    ? DEFAULT_REVENUE_SHARE
                    : `${parseFloat(nft?.revenue_share)}% revenue share`} */}
                    {DEFAULT_REVENUE_SHARE}
                  </h6>
                )}

              {(() => {
                if (allTab) {
                  return (
                    <>
                      {nft?.core_statistics?.role?.value === "Shot" ? (
                        <>
                          {" "}
                          {nft?.is_on_sale && (
                            <h6 className="listed-info">Listed For Sale</h6>
                          )}
                        </>
                      ) : (
                        <>
                          {nft?.allow_rent && nft?.is_on_sale ? (
                            <h6 className="listed-info">
                              {nft?.state === "rented"
                                ? "Listed For Sale / Borrowed"
                                : "Listed For Sale / Renting Out"}
                            </h6>
                          ) : nft?.allow_rent ? (
                            <h6 className="listed-info">
                              {nft?.state === "rented"
                                ? "Borrowed"
                                : "Listed For Renting Out"}
                            </h6>
                          ) : (
                            nft?.is_on_sale && (
                              <h6 className="listed-info">Listed For Sale</h6>
                            )
                          )}
                        </>
                      )}
                    </>
                  );
                } else if (saleTab) {
                  return (
                    nft?.is_on_sale && (
                      <h6 className="listed-info">Listed For Sale</h6>
                    )
                  );
                } else if (rented) {
                  return (
                    <>
                      {nft?.allow_rent && (
                        <h6 className="listed-info">
                          {nft?.state === "rented"
                            ? "Borrowed"
                            : "Listed For Renting Out"}
                        </h6>
                      )}
                    </>
                  );
                }
              })()}
              {isBundle && <h6 className="bundle-info">Bundle</h6>}
            </div>
          </div>
          {showInput && (
            <div className={`bundle-input-block`}>
              {(() => {
                let roleValue = nft?.core_statistics?.role?.value;
                if (roleValue === "Land") {
                  return (
                    <>
                      {nftPrices[nft?.slug] >=
                      process.env.REACT_APP_MAX_AMOUNT_LAND ? (
                        <></>
                      ) : (
                        <label>
                          Set Price{" "}
                          <span className={`text-red`}>
                            Min.{" "}
                            {currencyFormat(
                              process.env.REACT_APP_MAX_AMOUNT_LAND,
                              "USD"
                            )}
                          </span>
                        </label>
                      )}
                    </>
                  );
                } else if (roleValue === "Building") {
                  return (
                    <>
                      {nftPrices[nft?.slug] >=
                      process.env.REACT_APP_MAX_AMOUNT_LAND ? (
                        <></>
                      ) : (
                        <label>
                          Set Price{" "}
                          <span className={`text-red`}>
                            Min.{" "}
                            {currencyFormat(
                              process.env.REACT_APP_MAX_AMOUNT_BUILDING,
                              "USD"
                            )}
                          </span>
                        </label>
                      )}
                    </>
                  );
                }
              })()}
              <div className="input-currency-box">
                <span className={"sale-currency"}>$</span>
                <input
                  value={nftPrices[nft?.slug]}
                  // value={erc721Sale.buyAmount}
                  className={`nft-price ${error}`}
                  placeholder="0"
                  // onChange={handleInputChange}
                  onChange={handleBundleBuyChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NFTCardList;

const Checkbox = ({ nft, selected, handleChange, className }) => {
  return (
    <label
      htmlFor={`nftSelect${nft?.slug}`}
      className={`${className}`}
      key={nft?.slug}
    >
      <input
        id={`nftSelect${nft?.slug}`}
        type="checkbox"
        disabled={nft?.is_on_sale || !nft?.put_on_sale}
        checked={selected?.includes(nft?.slug)}
        onChange={() => handleChange(nft?.slug)}
      />
      <span className="checked-img"></span>
    </label>
  );
};
