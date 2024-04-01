import { useEffect, useState } from "react";
import { Offcanvas, Popover, OverlayTrigger } from "react-bootstrap";
import {
  getNFTRentDetails,
  nftDetailApi,
  revokeRental,
  userRentedNFTsApi,
} from "../../api/methods-marketplace";
import UserRentedNftCard from "../my-nfts/user-rented-nft-card";
import NoRecord from "../my-nfts/no-record";
import { BsArrowLeft } from "react-icons/bs";
import { IoClose, IoMdClose } from "react-icons/io";
import Lottie from "lottie-react";
import { toast } from "react-toastify";
import { SlBriefcase } from "react-icons/sl";
import Stats from "../my-nfts/stats";
import successAnim from "../../images/jump-trade/json/Tick.json";
import "./styles.scss";

const UserRentedNFT = ({ hideMenus }) => {
  const [list, setList] = useState([]);
  const [nftInfo, setNftInfo] = useState({});
  const [selected, setSelected] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState("");

  const [selectedAll, setSelectedAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rentalPop, setRentalPop] = useState(false);

  const [modalType, setModalType] = useState("");
  const [disableRevoke, setDisableRevoke] = useState(false);

  useEffect(() => {
    getList(1);
  }, []);

  const getList = async (page = 1) => {
    try {
      setLoading(true);
      setSelected([]);
      const result = await userRentedNFTsApi(page, {});
      setList(result?.data?.data?.nfts);
      handleTournament(result?.data?.data?.tournament);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const nftDetails = async (slug) => {
    try {
      setLoading(true);
      const result = await nftDetailApi({ nft_slug: slug });
      setNftInfo(result?.data?.data?.nft);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(
        list?.map((nft) => {
          if (nft?.core_statistics?.role?.value !== "Shot") return nft?.slug;
        })
      );
      setSelectedAll(true);
    } else {
      setSelectedAll(false);
      setSelected([]);
    }
  };

  const handleTournament = (tournament) => {
    if (tournament?.game_type === "glc") {
      const currentTime = new Date().getTime();
      const startTime = new Date(tournament?.start_time).getTime();
      const endTime = new Date(tournament?.end_time).getTime();

      if (currentTime >= startTime && currentTime <= endTime) {
        setDisableRevoke(true);
      } else {
        setDisableRevoke(false);
      }
    }
  };

  const popover = () => (
    <Popover>
      <Popover.Body>
        <p className="password-terms">
          Tournament is in progress, you can't revoke NFT's from rental at the
          moment
        </p>
      </Popover.Body>
    </Popover>
  );

  let showSelectAllButton = list?.find((obj, i) => {
    if (new Date(obj.rental_revoke_time).getTime() < new Date().getTime()) {
      return true;
    }
  });

  return (
    <div className="my-rented-nft">
      {!loading ? (
        <>
          {list?.length > 0 ? (
            <>
              <div className="mb-4 select-header">
                {selected?.length > 0 && (
                  <span>
                    <strong>
                      Selected NFTs :{" "}
                      {selectedAll || selected?.length === list?.length
                        ? "All"
                        : selected?.length}
                    </strong>
                  </span>
                )}
                {showSelectAllButton && (
                  <SelectAll
                    list={list}
                    selected={selected}
                    handleSelectAll={handleSelectAll}
                  />
                )}
              </div>
              <div className="mynft-card-list">
                {list?.map((nft, i) => (
                  <UserRentedNftCard
                    nft={nft}
                    key={i}
                    setSelected={setSelected}
                    setSelectedAll={setSelectedAll}
                    selected={selected.filter((x) => x !== undefined)}
                    setMyRentedRevokePop={(value, slug) => {
                      nftDetails(slug);
                      setRentalPop(value);
                      setSelected([]);
                    }}
                    handleTimeEndEvent={getList}
                  />
                ))}
              </div>
            </>
          ) : (
            <NoRecord />
          )}
        </>
      ) : (
        <div className="norecord-found">
          <h5>Loading...</h5>
        </div>
      )}

      {list?.length > 0 && (
        <div className={`btn-fixed ${hideMenus ? "hiddenMenu" : ""}`}>
          {disableRevoke ? (
            <OverlayTrigger
              trigger={["click"]}
              rootClose={true}
              placement="top"
              overlay={popover()}
            >
              <button
                className="btn btn-dark"
                type="button"
                disabled={selected?.length === 0}
              >
                Return NFTs
              </button>
            </OverlayTrigger>
          ) : (
            <button
              className="btn btn-dark"
              type="button"
              disabled={selected?.length === 0}
              onClick={() => setModalType("confirm")}
            >
              Return NFTs
            </button>
          )}
        </div>
      )}
      <RevokeRental
        list={list}
        nftInfo={nftInfo}
        selected={selected}
        selectedAll={selectedAll}
        rentalPop={rentalPop}
        setRentalPop={setRentalPop}
        modalType={modalType}
        setModalType={setModalType}
        setRefreshData={getList}
        disableRevoke={disableRevoke}
        popover={popover}
      />

      {modalType === "confirm" && (
        <Modal
          type={modalType}
          selected={selected}
          selectedAll={list?.length === selected?.length}
          setModalType={setModalType}
        />
      )}
      {modalType === "success" && (
        <Modal
          type={modalType}
          selected={selected}
          selectedAll={selectedAll}
          setModalType={setModalType}
          setRentalPop={setRentalPop}
          setRefreshData={getList}
        />
      )}
    </div>
  );
};

export default UserRentedNFT;

const SelectAll = ({ list, selected, handleSelectAll }) => {
  return (
    <label className="d-flex align-items-center ms-auto">
      <input
        type="checkbox"
        checked={selected?.length === list?.length}
        onChange={handleSelectAll}
      />{" "}
      <span className="checked-img"></span>
      &nbsp; Select All
    </label>
  );
};
const playerStyle = [
  { type: "LH", value: "Left Hand" },
  { type: "RH", value: "Right Hand" },
  { type: "LA", value: "Left Arm" },
  { type: "RA", value: "Right Arm" },
];

const RevokeRental = ({
  nftInfo,
  list,
  selected,
  selectedAll,
  rentalPop,
  setRentalPop,
  modalType,
  setModalType,
  setRefreshData,
  disableRevoke = false,
  popover,
}) => {
  return (
    <Offcanvas
      show={rentalPop}
      onHide={() => setRentalPop(!rentalPop)}
      placement="end"
      className="popup-wrapper-canvas-utcoin rental-canvas-popup"
      backdrop={"true"}
    >
      <Offcanvas.Body className="rental-body-container">
        <div className="rental-nft-details">
          <div className="rental-head-content">
            <div className="rental-title">
              <h2>
                Borrowed NFTs selected to return
                <BsArrowLeft
                  onClick={() => setRentalPop(!rentalPop)}
                  className="cancel-btn back-btn"
                />
                <IoMdClose
                  onClick={() => setRentalPop(!rentalPop)}
                  className="cancel-btn close-btn"
                />
              </h2>

              <h6>
                {selected?.length > 0 && (
                  <span>
                    <strong>Selected NFTs : {selected?.length}</strong>
                  </span>
                )}
              </h6>
            </div>
          </div>
          <div className="rental-body-content">
            <div className="user-detail-header">
              <div className="mynft-card-list">
                <div className="mynft-card-rented">
                  <div className="content-block">
                    <div className="image-box">
                      <img
                        alt="nft-image"
                        src={
                          nftInfo?.asset_type?.includes("video")
                            ? nftInfo?.cover_url
                            : nftInfo?.asset_url
                        }
                      />
                      <Stats
                        statistics={nftInfo?.core_statistics}
                        className="vertical-align"
                      />
                    </div>
                    <div className="content-box">
                      <h6 className="nft-name">{nftInfo?.name}</h6>
                      <div className="nft-hint-info">
                        {nftInfo?.core_statistics?.role?.value !== "Bat" && (
                          <h6 className="level-pill">
                            Level {nftInfo?.core_statistics?.level?.value}
                          </h6>
                        )}
                        {/* {nftInfo?.core_statistics?.role?.value === "Bat" && (
                          <h6 className="level-pill">
                            {nftInfo?.core_statistics?.bat_type?.value}
                          </h6>
                        )} */}
                        {nftInfo?.revenue_share && (
                          <h6>
                            <SlBriefcase /> {parseFloat(nftInfo?.revenue_share)}
                            % revenue share
                          </h6>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {nftInfo?.statistics?.length > 0 && (
                  <div className="content-box">
                    <h2>
                      Player Stats (
                      {
                        playerStyle?.find(
                          (obj) =>
                            obj?.type ===
                            nftInfo?.core_statistics?.dominant_hand?.value
                        )?.value
                      }
                      )
                    </h2>
                    {/* <p>All level 1 players have same stats</p> */}

                    <ul className="nft-stats">
                      {nftInfo?.statistics?.map((data, key) => (
                        <li key={key}>
                          <span className="key">{data?.name}</span>
                          <span className="value">
                            {data?.value}/{data?.maximum}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {nftInfo?.core_statistics?.role?.value === "Bat" && (
                  <div className="content-box">
                    <h2>{"Bat Stats"}</h2>
                    <BatStats stats={nftInfo} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="sticky-bottom-box">
          {disableRevoke ? (
            <OverlayTrigger
              trigger={["click"]}
              rootClose={true}
              placement="top"
              overlay={popover()}
            >
              <button className="btn btn-dark" type="button">
                Return NFT
              </button>
            </OverlayTrigger>
          ) : (
            <button
              className="btn btn-dark"
              type="button"
              onClick={() => setModalType("confirm")}
            >
              Return NFT
            </button>
          )}
          <p className="hint">
            * You cannot return borrowed NFTs for 5 mins before and 15 mins
            after a tournament.
          </p>
        </div>
        {modalType === "confirm" && (
          <Modal
            type={modalType}
            selected={[nftInfo?.slug]}
            setModalType={setModalType}
          />
        )}
        {modalType === "success" && (
          <Modal
            type={modalType}
            setModalType={setModalType}
            setRentalPop={setRentalPop}
            setRefreshData={setRefreshData}
          />
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

const BatStats = ({ stats }) => {
  return (
    <ul className="nft-stats">
      <li>
        <span className="key">Six Distance</span>
        <span className="value">
          {stats?.core_statistics?.six_distance?.value}
        </span>
      </li>
      <li>
        <span className="key">2X Power</span>
        <span className="value">
          {stats?.core_statistics?.twox_power?.value}
        </span>
      </li>
      <li>
        <span className="key">Negative Runs</span>
        <span className="value">
          {stats?.core_statistics?.negative_runs?.value}
        </span>
      </li>
    </ul>
  );
};
const Modal = ({
  type = "",
  setModalType,
  selected,
  selectedAll = false,
  setRentalPop,
  setRefreshData,
  // handleRevokeRental,
}) => {
  const handleSubmit = async () => {
    try {
      await revokeRental({
        owned: false,
        selected_all: selectedAll,
        nft_slugs: selectedAll ? [] : selected,
      });
      setModalType("success");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <>
      <div className="popup-secondary">
        {type == "confirm" && (
          <div className="confirm-modal modal-box">
            {/* close icon */}
            <h5>Do you want to return the selected NFTs?</h5>
            <div className="btn-block">
              <button
                className="btn btn-dark border-btn"
                onClick={() => setModalType("")}
              >
                No
              </button>
              <button className="btn btn-dark" onClick={handleSubmit}>
                Yes
              </button>
            </div>
          </div>
        )}
        {type == "success" && (
          <div className="success-modal modal-box">
            <Lottie animationData={successAnim} className={"lotti-icon"} />
            <h5>{`NFT(s) Returned successfully`}</h5>
            <div className="btn-block">
              <button
                className="btn btn-dark"
                onClick={() => {
                  setModalType("");
                  setRentalPop(false);
                  setRefreshData();
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
