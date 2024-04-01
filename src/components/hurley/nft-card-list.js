import { useEffect, useState } from "react";
import postOne from "../../images/post1.png";
import { openWindowBlank } from "../../utils/common";
import Stats from "./stats";
import { AiOutlineDollarCircle } from "react-icons/ai";
import NFTCounter from "../nft-counter";
import { DEFAULT_REVENUE_SHARE } from "../../utils/common";
import "./styles.scss";
import { BsFillTrophyFill } from "react-icons/bs";
import FusorPopup from "../accounts/fusor-popup";
import { useSelector } from "react-redux";
import { OverlayTrigger, Popover } from "react-bootstrap";

const NFTCardList = ({
  nft,
  selected,
  setSelected,
  setSelectedAll,
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
  reloadData = () => {},
  fusor = false,
  Reload = () => {},
}) => {
  const [imageloaded, setImageLoaded] = useState(false);
  const [restrictRevoke, setRestrictRevoke] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [fusorNftPopup, setFusorNftPopup] = useState(false);
  const [fusorSlug, setFusorSlug] = useState("");

  const role = nft?.core_statistics?.role?.value || "";
  const { user } = useSelector((state) => state.user.data);

  const handleChange = (slug) => {
    if (selected?.includes(slug)) {
      setSelected(selected?.filter((i) => i !== slug));
      setSelectedAll(false);
    } else {
      setSelected([...selected, slug]);
    }
  };

  // useEffect(() => {
  //   if (rented && nft?.rental_revoke_time) {
  //     setRestrictRevoke(
  //       new Date().getTime() <= new Date(nft?.rental_revoke_time).getTime()
  //     );
  //     setShowTimer(true);
  //   }
  // }, [nft]);

  // const handleEndEvent = () => {
  //   reloadData();
  //   setRestrictRevoke(false);
  // };

  const roleValues = ["Shot", "Fusor", "Fielder"];

  // const kycPopOver = () => (
  //   <Popover>
  //     <Popover.Body>
  //       <p className="password-terms">
  //         <>Please complete your user verification to proceed</>
  //       </p>
  //     </Popover.Body>
  //   </Popover>
  // );

  return (
    <div className="mynft-card-item" key={nft?.slug}>
      {/* {showTimer && restrictRevoke && rented && role !== "Shot" && (
        <h6 className="timer-section">
          <span>Revoke in</span>
          <NFTCounter
            customClass="revoke-timer"
            time={nft?.rental_revoke_time}
            handleEndEvent={handleEndEvent}
          />
        </h6>
      )} */}
      {!hideCheckbox &&
        (!nft?.allow_rent || (rented && !restrictRevoke)) &&
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
                : postOne
            }
            width="100%"
            alt="nft image"
            role="button"
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
            <span className="rank-title">
              <BsFillTrophyFill />{" "}
              {` ${nft?.core_statistics?.rank?.value}/${nft?.core_statistics?.rank?.maximum}`}
            </span>
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

          <Stats statistics={nft?.core_statistics} />

          <div className="flex-box-info">
            {!roleValues.includes(role) && nft?.revenue_share && (
              <h6 className="shareinfo">
                <AiOutlineDollarCircle />
                {parseFloat(nft?.revenue_share) === 0
                  ? DEFAULT_REVENUE_SHARE
                  : `${parseFloat(nft?.revenue_share)}% revenue share`}
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
          </div>

          {/* {fusor && !nft?.is_on_sale && (
            <>
              {user?.kyc_status !== "success" ? (
                <OverlayTrigger
                  trigger={["click"]}
                  rootClose={true}
                  placement="top"
                  overlay={kycPopOver()}
                >
                  <button className="fusor-btn btn">Fuse</button>
                </OverlayTrigger>
              ) : (
                <button
                  onClick={() => {
                    setFusorNftPopup(true);
                    setFusorSlug(nft?.slug);
                  }}
                  className="fusor-btn btn"
                >
                  Fuse
                </button>
              )}
            </>
          )} */}
        </div>
        {/* {fusorNftPopup && fusorSlug && (
          <FusorPopup
            setFusorNftPopup={setFusorNftPopup}
            fusorNftPopup={fusorNftPopup}
            fusorSlug={fusorSlug}
            fusorDetails={nft}
            Reload={Reload}
          />
        )} */}
      </div>
    </div>
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
        disabled={!nft?.put_on_sale || nft?.is_on_sale}
        checked={selected?.includes(nft?.slug)}
        onChange={() => handleChange(nft?.slug)}
      />
      <span className="checked-img"></span>
    </label>
  );
};
