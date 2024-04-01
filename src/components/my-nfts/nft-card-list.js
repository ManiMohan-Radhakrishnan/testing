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
import { Offcanvas, OverlayTrigger, Popover } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  batBurnApi,
  batBurnRequestCancel,
  nftDetailApi,
} from "../../api/methods-marketplace";
import BurnNFTDetail from "../accounts/burn-bat-nft-popup";
import successAnim from "../../images/jump-trade/json/Tick.json";
import Lottie from "lottie-react";
import { whitelistedCryptoList, withdrawBalanceApi } from "../../api/methods";

const NFTCardList = ({
  nft,
  selected,
  setSelected,
  setSelectedAll,
  hideCheckbox = false,
  allTab = false,
  saleTab = false,
  rented = false,
  burnBatRequestCreated = false,
  burnBatRequestCancel = false,
  setSlug,
  setDetailPop,
  myRentedNft = false,
  setMyRentedRevokePop,
  hideMenus = false,
  navigation = false,
  reloadData = () => {},
  fusor = false,
  Reload = () => {},
  cryptoList = [],
  networks = [],
  withdrawBalanceList = {},
}) => {
  const [imageloaded, setImageLoaded] = useState(false);
  const [restrictRevoke, setRestrictRevoke] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [fusorNftPopup, setFusorNftPopup] = useState(false);
  const [fusorSlug, setFusorSlug] = useState("");

  const role = nft?.core_statistics?.role?.value || "";
  const { user } = useSelector((state) => state.user.data);
  const [showEdit, setShowEdit] = useState(false);
  const [burnBatDetails, setBurnBatDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState("");
  const [modalType, setModalType] = useState("");

  // const [cryptoList, setCryptoList] = useState([]);
  // const [networks, setNetworks] = useState([]);
  // const [withdrawBalanceList, setWithdrawBalanceList] = useState();

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
    // handleNFTDetails(nft?.slug);
  }, [nft]);

  // useEffect(() => {
  //   if (burnBatRequestCreated) {
  //     checkCryptoList();
  //     getBalance();
  //   }
  // }, []);

  const handleEndEvent = () => {
    reloadData();
    setRestrictRevoke(false);
  };

  const roleValues = ["Shot", "Fusor", "Fielder", "Ball"];

  const handleNFTDetails = async (slug) => {
    try {
      console.log(slug, "slug");
      const result = await nftDetailApi({ nft_slug: slug });
      let response = result?.data?.data?.nft;
      setDetails(response);
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  const kycPopOver = () => (
    <Popover>
      <Popover.Body>
        <p className="password-terms">
          <>Please complete your user verification to proceed</>
        </p>
      </Popover.Body>
    </Popover>
  );

  // const checkCryptoList = async () => {
  //   try {
  //     const result = await whitelistedCryptoList();
  //     setCryptoList(result?.data?.data?.payment_methods);
  //     if (result?.data?.data?.hasOwnProperty("networks"));
  //     setNetworks(result?.data?.data?.networks);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const getBalance = async () => {
  //   try {
  //     const result = await withdrawBalanceApi();
  //     console.log(result);
  //     setWithdrawBalanceList(result?.data?.data);
  //   } catch (error) {
  //     setWithdrawBalanceList("error");
  //     console.log(
  //       "🚀 ~ file: wallet.js ~ line 130 ~ handleWithdraw ~ error",
  //       error
  //     );
  //   }
  // };

  return (
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
        !roleValues.includes(role) && (
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

          <Stats
            statistics={nft?.core_statistics}
            category={nft?.core_statistics?.role?.value}
          />

          <div className="flex-box-info">
            {!burnBatRequestCreated && !burnBatRequestCancel && (
              <>
                {" "}
                {!roleValues.includes(role) && nft?.revenue_share && (
                  <h6 className="shareinfo">
                    <AiOutlineDollarCircle />
                    {parseFloat(nft?.revenue_share) === 0
                      ? DEFAULT_REVENUE_SHARE
                      : `${parseFloat(nft?.revenue_share)}% revenue share`}
                  </h6>
                )}
              </>
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
              } else if (burnBatRequestCreated) {
                return (
                  <>
                    {/* {details && (
                      <h6 className="shareinfo asset-value">
                        {details?.asset_quantity || "-"}{" "}
                        <b>({`$ ${details?.asset_value || "-"}`})</b>
                      </h6>
                    )} */}
                    {!nft?.burn_requested && (
                      <>
                        {" "}
                        <button
                          type="button"
                          // onClick={() => handleBurnInitiate(nft?.slug)}
                          // disabled={loading}
                          onClick={() => {
                            handleNFTDetails(nft?.slug);
                            setShowEdit(true);
                            setBurnBatDetails(nft);
                            // setTimeout(() => {
                            //   setLoading(true);
                            // }, 500);
                          }}
                          className={`request-btn`}
                        >
                          Initiate Burn Request{" "}
                        </button>
                      </>
                    )}
                  </>
                );
              } else if (burnBatRequestCancel) {
                return (
                  <>
                    {/* {details && (
                      <h6 className="shareinfo asset-value">
                        {details?.asset_quantity}{" "}
                        <b>({`$ ${details?.asset_value}`})</b>
                      </h6>
                    )} */}
                    {nft?.burn_requested && (
                      <button
                        disabled={loading}
                        type="button"
                        onClick={() => {
                          // handleBurnRequestedCancel(nft?.slug);
                          setModalType("confirm");
                        }}
                        className={`request-cancel-btn`}
                      >
                        Cancel Request
                      </button>
                    )}
                  </>
                );
              }
            })()}
          </div>

          {fusor && !nft?.is_on_sale && (
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
          )}
        </div>

        {fusorNftPopup && fusorSlug && (
          <FusorPopup
            setFusorNftPopup={setFusorNftPopup}
            fusorNftPopup={fusorNftPopup}
            fusorSlug={fusorSlug}
            fusorDetails={nft}
            Reload={Reload}
          />
        )}
        {showEdit && (
          <BurnNFTDetail
            cryptoList={cryptoList}
            networkList={networks}
            showEdit={showEdit}
            burnBatDetails={burnBatDetails}
            setShowEdit={setShowEdit}
            Reload={Reload}
            details={details}
            balanceInfo={withdrawBalanceList}
          />
        )}
        {modalType === "confirm" && (
          <Modal
            type={modalType}
            setModalType={setModalType}
            burnBatDetails={nft}
            // Reload={Reload}
          />
        )}
        {modalType === "success" && (
          <Modal type={modalType} setModalType={setModalType} Reload={Reload} />
        )}
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
        // disabled={!nft?.put_on_sale}
        checked={selected?.includes(nft?.slug)}
        onChange={() => handleChange(nft?.slug)}
      />
      <span className="checked-img"></span>
    </label>
  );
};

const Modal = ({
  type = "",
  setModalType,
  burnBatDetails,
  Reload = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  // const [message, setMsg] = useState();

  const handleBurnRequestedCancel = async (slug) => {
    try {
      setLoading(true);
      // setMsg("");
      const result = await batBurnRequestCancel(slug);
      // toast.success(result?.data?.data?.response?.message);
      // setMsg(result?.data?.data?.response?.message);
      Reload();
      setModalType("success");
      // setLoading(false);
    } catch (error) {
      setLoading(false);
      // setMsg(error.response?.data?.message);
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <>
      <div className="popup-secondary">
        {type == "confirm" && (
          <div className="confirm-modal modal-box">
            {/* <BiX onClick={() => setModalType("")} /> */}
            <h5>Are you sure to cancel the burn registration?</h5>
            <div className="btn-block">
              <button
                className="btn btn-dark border-btn"
                onClick={() => setModalType("")}
              >
                No
              </button>
              <button
                className="btn btn-dark"
                onClick={() => {
                  handleBurnRequestedCancel(burnBatDetails?.slug);
                }}
              >
                Yes
              </button>
            </div>
          </div>
        )}
        {type == "success" && (
          <div className="success-modal modal-box">
            <Lottie animationData={successAnim} className={"lotti-icon"} />
            {/* <h5>{message}</h5> */}
            <h5>NFT Burn Request Cancelled Successfully!</h5>

            <div className="btn-block">
              <button
                className="btn btn-dark"
                onClick={() => {
                  setModalType("");
                  Reload();
                }}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
