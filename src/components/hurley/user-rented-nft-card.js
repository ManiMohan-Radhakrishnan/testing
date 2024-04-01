import { useEffect, useState } from "react";
import postOne from "../../images/post1.png";
import Stats from "./stats";
import { AiOutlineDollarCircle } from "react-icons/ai";
import NFTCounter from "../nft-counter";
import "./styles.scss";
import { DEFAULT_REVENUE_SHARE } from "../../utils/common";
import { BsFillTrophyFill } from "react-icons/bs";

const UserRentedNftCard = ({
  nft,
  selected,
  setSelected,
  setSelectedAll,
  allTab = false,
  setMyRentedRevokePop,
  handleTimeEndEvent,
}) => {
  const [imageloaded, setImageLoaded] = useState(false);
  const [restrictRevoke, setRestrictRevoke] = useState(false);
  const [showTimer, setShowTimer] = useState(false);

  const role = nft?.core_statistics?.role?.value || "";

  const handleChange = (slug) => {
    if (selected?.includes(slug)) {
      setSelected(selected?.filter((i) => i !== slug));
      setSelectedAll(false);
    } else {
      setSelected([...selected, slug]);
    }
  };

  useEffect(() => {
    if (nft?.rental_revoke_time) {
      setRestrictRevoke(
        new Date().getTime() <= new Date(nft?.rental_revoke_time).getTime()
      );
      setShowTimer(true);
    }
  }, [nft]);

  const handleEndEvent = () => {
    handleTimeEndEvent();
    setRestrictRevoke(false);
  };

  return (
    <div
      className={`mynft-card-item ${
        showTimer && restrictRevoke && "not-active"
      }`}
      key={nft?.slug}>
      {showTimer && restrictRevoke && role !== "Shot" && (
        <h6 className="timer-section">
          <span>Return in</span>
          <NFTCounter
            customClass="revoke-timer"
            time={nft?.rental_revoke_time}
            handleEndEvent={handleEndEvent}
          />
        </h6>
      )}
      {!restrictRevoke && role !== "Shot" && (
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
                : postOne
            }
            width="100%"
            alt="nft image"
            role="button"
            style={imageloaded ? {} : { height: "20rem" }}
            onLoad={() => setImageLoaded(true)}
            onClick={() => {
              showTimer && restrictRevoke
                ? setMyRentedRevokePop(false)
                : setMyRentedRevokePop(true, nft?.slug);
            }}
          />
        </div>

        <div className="content-box">
          {nft?.core_statistics?.rank?.value && (
            <span className="rank-title">
              <BsFillTrophyFill />{" "}
              {` ${nft?.core_statistics?.rank?.value}/${nft?.core_statistics?.rank?.maximum}`}
            </span>
          )}
          <h6 className="nft-name">{nft?.name}</h6>
          <Stats statistics={nft?.core_statistics} />
          <div className="flex-box-info">
            {nft?.revenue_share && (
              <h6 className="shareinfo">
                <AiOutlineDollarCircle />
                {parseFloat(nft?.revenue_share) === 0
                  ? DEFAULT_REVENUE_SHARE
                  : `${parseFloat(nft?.revenue_share)}% revenue share`}
                {/* {DEFAULT_REVENUE_SHARE} */}
              </h6>
            )}

            {/* {nft?.state === "rented" && <h6 className="listed-info">Rented</h6>} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRentedNftCard;

const Checkbox = ({ nft, selected, handleChange, className }) => {
  return (
    <label
      htmlFor={`nftSelect${nft?.slug}`}
      className={`${className}`}
      key={nft?.slug}>
      <input
        id={`nftSelect${nft?.slug}`}
        type="checkbox"
        checked={selected?.includes(nft?.slug)}
        onChange={() => handleChange(nft?.slug)}
      />
      <span className="checked-img"></span>
    </label>
  );
};
