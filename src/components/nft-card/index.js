import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { OverlayTrigger, Popover, Modal } from "react-bootstrap";
import { openWindowBlank, calculateTimeLeft } from "../../utils/common";
import postOne from "../../images/post1.png";
import NFTStat from "../nft-stat";
import { promoteNFT, allowOrRevokeRental } from "../../api/methods-marketplace";
import { toast } from "react-toastify";
import ToolTip from "../tooltip/index";

import "./style.scss";
import { BiHelpCircle } from "react-icons/bi";
import { BsFillTrophyFill } from "react-icons/bs";

const NFTCard = ({
  nft,
  data,
  putOnSale = false,
  marketplace = false,
  onsale = false,
  upgrade = false,
  playerCard = false,
  isLive = false,
  trigger,
  setTrigger,
  owned = false,
}) => {
  const { user } = useSelector((state) => state.user.data);
  const { days, hours, minutes, seconds } = calculateTimeLeft(nft?.launch_time);
  const [imageloaded, setImageLoaded] = useState(false);

  const [timer, setTimer] = useState();
  const [selectedNFT, setSelectedNFT] = useState();
  const [loading, setLoading] = useState(false);
  const [confirmPopupInfo, setConfirmPopupInfo] = useState({});
  const [allowRental, setAllowRental] = useState(!nft?.allow_rent);

  const role = nft?.core_statistics?.role?.value || "";

  useEffect(() => {
    handleCheckTimer();
  }, []);

  const handleCheckTimer = () => {
    const { days, hours, minutes, seconds } = calculateTimeLeft(
      nft?.launch_time
    );
    setTimer({ days, hours, minutes, seconds });
  };

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

  // Timer
  const popover = () => (
    <Popover>
      <Popover.Body>
        <p className="password-terms">
          Your NFT will be available to be listed for sale in <b>{rem_text}</b>
        </p>
      </Popover.Body>
    </Popover>
  );

  const handleConfirm = (input, popupInfo = {}) => {
    setConfirmPopupInfo(popupInfo);
    setSelectedNFT(input);
  };

  const handlePopConfirm = async () => {
    try {
      setLoading(true);
      const result = await promoteNFT(selectedNFT);
      handleConfirm("", {});
      toast.success("NFT Allowed for Yield Successfully");
      setTrigger(!trigger);
    } catch (err) {
      console.log("handlePopConfirm", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleRental = async () => {
    try {
      setLoading(true);
      const result = await allowOrRevokeRental(nft?.slug, allowRental);
      if (result?.status === 200) {
        // toast.success(
        //   `NFT ${
        //     !nft?.allow_rent ? "Allowed for" : "Revoked from"
        //   }  Rental Successfully`
        // );
        setAllowRental(!allowRental);
        result?.data?.message && toast.success(result?.data?.message);
      } else {
        toast.error("Something went wrong. Please try again after sometime.");
      }
    } catch (err) {
      console.log(`${allowRental ? "allowRental" : "revokeRental"}`, err);
    } finally {
      handleConfirm("", {});
      setLoading(false);
    }
  };

  const yieldPopupInfo = {
    title: "Confirmation",
    description: `By confirming, you consent to opt-in your NFT for the yield generation program.`,
    confirmAction: handlePopConfirm,
    show: true,
  };

  const rentPopupInfo = {
    title: "Confirmation",
    description: `By confirming, you consent to opt-in your NFT for rental.`,
    confirmAction: toggleRental,
    show: true,
  };

  const revokeRentPopupInfo = {
    title: "Confirmation",
    description: `By confirming, you consent to opt-out your NFT from rental.`,
    confirmAction: toggleRental,
    show: true,
  };

  const kycPopOver = () => (
    <Popover>
      <Popover.Body>
        <p className="password-terms">
          <>
            {user?.kyc_status !== "success"
              ? "Please complete your user verification process to be eligible for listing NFTs for sale."
              : "You do not have permission to initiate this action."}
          </>
        </p>
      </Popover.Body>
    </Popover>
  );

  return (
    <div className="mynft-card-box">
      <div className="block-box user-post jt-card">
        <div className="item-post">
          {nft?.core_statistics?.rank?.value && (
            <span className="nft-type-badge-rank">
              <span className="rank-title">
                <BsFillTrophyFill />{" "}
                {` ${nft?.core_statistics?.rank?.value}/${nft?.core_statistics?.rank?.maximum}`}
              </span>
            </span>
          )}

          <NFTStat statistics={nft?.core_statistics} />
          <img
            src={
              nft?.asset_url
                ? nft?.asset_url
                : nft?.image_url
                ? nft?.image_url
                : postOne
            }
            width="100%"
            alt="nft logo "
            role="button"
            style={imageloaded ? {} : { height: "20rem" }}
            onLoad={() => setImageLoaded(true)}
            onClick={() => {
              if (putOnSale) {
                openWindowBlank(
                  `${process.env.REACT_APP_MARKETPLACE_URL}/nft-marketplace/details/${nft.slug}`
                );
              } else {
                if (onsale) {
                  openWindowBlank(
                    `${process.env.REACT_APP_MARKETPLACE_URL}/order/details/${nft.slug}/${nft?.order_slug}`
                  );
                } else if (marketplace) {
                  openWindowBlank(
                    `${process.env.REACT_APP_MARKETPLACE_URL}/nft-marketplace/details/${nft.slug}`
                  );
                } else if (nft?.is_loot) {
                  openWindowBlank(
                    `${
                      nft.celebrity_url ? nft.celebrity_url : data.celebrity_url
                    }/loot/nft/detail/${nft.slug}`
                  );
                } else if (nft?.child) {
                  openWindowBlank(
                    `${
                      nft.celebrity_url ? nft.celebrity_url : data.celebrity_url
                    }/details/child/nft/${nft.slug}`
                  );
                } else {
                  openWindowBlank(
                    `${
                      nft.celebrity_url ? nft.celebrity_url : data.celebrity_url
                    }/details/${nft.slug}`
                  );
                }
              }
            }}
          />
        </div>

        <div className="item-content">
          <div className="post-title-box">
            {/* {user?.slug !== nft?.player_slug && (
              <span className="nft-type-badge-rank rented">
                <span className="rank-title">Rented</span>
              </span>
            )} */}

            <h6 className="post-title">
              {owned &&
                role &&
                role !== "Shot" &&
                user?.slug !== nft?.player_slug && (
                  <span className="rented">
                    <span className="rank-title">Rented</span>
                  </span>
                )}
              {nft?.name}
            </h6>

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
          {putOnSale && (
            <>
              {user?.kyc_status !== "success" || !nft?.put_on_sale ? (
                <OverlayTrigger
                  trigger={["click"]}
                  rootClose={true}
                  placement="top"
                  overlay={kycPopOver()}
                >
                  <button
                    type="button"
                    className={`btn ${
                      !nft.is_on_sale ? "theme-btn" : "theme-btn theme-btn-sec"
                    }`}
                  >
                    List for sale
                  </button>
                </OverlayTrigger>
              ) : days === 0 &&
                hours === 0 &&
                minutes === 0 &&
                seconds < 0.2 ? (
                <>
                  {/* className={` ${
                      (nft?.can_promote || nft?.promoted) &&
                      "nft-card-btn-block"
                    }`} */}
                  <div
                  // className={` ${
                  //   role && role !== "Shot" && "nft-card-btn-block"
                  // }`}
                  >
                    <button
                      type="button"
                      className={`btn ${
                        !nft.is_on_sale
                          ? "theme-btn"
                          : "theme-btn theme-btn-sec"
                      }`}
                      onClick={() => {
                        openWindowBlank(
                          `${process.env.REACT_APP_MARKETPLACE_URL}/nft-marketplace/details/${nft.slug}`
                        );
                      }}
                    >
                      {!nft.is_on_sale ? "List for sale" : "Listed on sale"}
                    </button>

                    {/* {role && role !== "Shot" && (
                      <>
                        {allowRental ? (
                          <button
                            type="button"
                            className={`btn theme-btn`}
                            onClick={() =>
                              handleConfirm(nft?.slug, rentPopupInfo)
                            }
                          >
                            {"Allow Rental"}
                          </button>
                        ) : (
                          <button
                            type="button"
                            className={`btn theme-btn theme-btn-sec`}
                            onClick={() =>
                              handleConfirm(nft?.slug, revokeRentPopupInfo)
                            }
                          >
                            {"Revoke Rental"}
                          </button>
                        )}
                      </>
                    )} */}

                    {/* TEMPORARY */}
                    {/* {nft?.can_promote ? (
                      <button
                        type="button"
                        disabled={nft?.promoted}
                        onClick={() => handleConfirm(nft?.slug, yieldPopupInfo)}
                        style={{
                          whiteSpace: "nowrap",
                        }}
                        className={`btn ${
                          !nft.is_on_sale
                            ? "theme-btn"
                            : "theme-btn theme-btn-sec"
                        } `}
                      >
                        {nft?.promoted ? (
                          "Allowed Yield!"
                        ) : (
                          <ToolTip
                            icon={`Allow Yield?`}
                            placement="top"
                            content="You can use your NFTs for yield generation."
                          />
                        )}{" "}
                      </button>
                    ) : (
                      nft?.promoted && (
                        <button
                          type="button"
                          disabled={nft?.promoted}
                          style={{
                            whiteSpace: "nowrap",
                          }}
                          className={`btn ${
                            !nft.is_on_sale
                              ? "theme-btn"
                              : "theme-btn theme-btn-sec"
                          } `}
                        >
                          Allowed Yield!
                        </button>
                      )
                    )} */}
                  </div>
                </>
              ) : (
                <OverlayTrigger
                  trigger={["click"]}
                  rootClose={true}
                  placement="top"
                  overlay={popover()}
                >
                  <button
                    type="button"
                    className={`btn ${
                      !nft.is_on_sale
                        ? "theme-btn"
                        : "theme-btn rounded-bordered"
                    }`}
                  >
                    List for sale
                  </button>
                </OverlayTrigger>
              )}
            </>
          )}
        </div>
      </div>

      {/* <Modal show={show} className="yeild-confirm-popup">
        <Modal.Header>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            By confirming, you consent to opt-in your NFT for the yield
            generation program.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-dark-secondary"
            onClick={() => set_show(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            className="btn btn-dark "
            onClick={handlePopConfirm}
          >
            {loading ? "Confirming..." : "Confirm"}
          </button>
        </Modal.Footer>
      </Modal> */}
      <Modal show={confirmPopupInfo?.show} className="yeild-confirm-popup">
        <Modal.Header>
          <Modal.Title>{confirmPopupInfo?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{confirmPopupInfo?.description}</p>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-dark-secondary"
            onClick={() => handleConfirm("", {})}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            className="btn btn-dark"
            onClick={confirmPopupInfo?.confirmAction}
          >
            {loading ? "Confirming..." : "Confirm"}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NFTCard;
