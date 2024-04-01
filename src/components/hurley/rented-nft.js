import { useEffect, useRef, useState } from "react";
import { Offcanvas, Popover, OverlayTrigger } from "react-bootstrap";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import {
  userOwnedNFTsApi,
  getNFTRentDetails,
  getNFTUserRevenues,
  revokeRental,
} from "../../api/methods-marketplace";
import { IoMdClose } from "react-icons/io";
import { BsArrowLeft } from "react-icons/bs";
import { SlBriefcase } from "react-icons/sl";

import FilterSection from "../filter-section";
import NFTCardList from "./nft-card-list";
import NoRecord from "./no-record";

import NFTimage from "../../images/jump-trade/collection-1.gif";
import userImage from "../../images/user_1.png";
import utCoin from "../../images/coin.png";
import Lottie from "lottie-react";
import successAnim from "../../images/jump-trade/json/Tick.json";
import Stats from "./stats";
import BulkRent from "./bulk-rent";
import Accordion from "react-bootstrap/Accordion";
import Table from "react-bootstrap/Table";

import "./styles.scss";
import { GAMES } from "../../utils/game-config";

const RentedNFT = ({ setActiveTab, setCount, hideMenus }) => {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selectedAll, setSelectedAll] = useState(false);
  const [loading, setLoading] = useState(false);

  const [slug, setSlug] = useState("");

  const [modalType, setModalType] = useState("");
  const [detailPop, setDetailPop] = useState(false);
  const [nextPage, setNextPage] = useState(false);
  const [page, setPage] = useState(1);
  const [filteredNFTCount, setFilteredNftCount] = useState(0);
  const rentalFilterRef = useRef({});
  const [selectAllDisabled, setSelectAllDisabled] = useState(false);

  const [isBulkRental, setIsBulkRental] = useState(false);
  const [disableRevoke, setDisableRevoke] = useState(false);
  const [checkRevokeTime, setCheckRevokeTime] = useState(false);

  useEffect(() => {
    getList({ page });
  }, []);

  const getList = async ({
    page,
    filters = null,
    load = false,
    filterArePresent = false,
  }) => {
    if (filters) {
      rentalFilterRef.current = filters;
    }
    try {
      setLoading(true);
      const result = await userOwnedNFTsApi(page, {
        ...rentalFilterRef.current,
        game_names: [GAMES.HURLEY],
        allow_rent: true,
      });
      if (load) {
        setList([...list, ...result?.data?.data?.nfts]);
      } else {
        setList(result?.data?.data?.nfts);
      }

      if (filterArePresent)
        setFilteredNftCount(result?.data?.data?.total_count);
      else setCount(result?.data?.data?.total_count);

      setNextPage(result?.data?.data?.next_page);
      setIsBulkRental(result?.data?.data?.bulk_rental ? true : false);
      handleTournament(result?.data?.data?.tournament);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (list) timerRevokeCheck();
  }, [list]);

  const handleFilter = ({
    page,
    filters,
    disabledStatus = false,
    filterArePresent,
  }) => {
    setSelectedAll(false);
    setSelected([]);
    setSelectAllDisabled(disabledStatus);
    getList({ page, filters, filterArePresent });
  };

  const loadMore = () => {
    getList({ page: page + 1, load: true, filterArePresent: true });
    setPage(page + 1);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(list?.map((nft) => nft?.slug));
      setSelectedAll(true);
    } else {
      setSelected([]);
      setSelectedAll(false);
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

  const handleRevokeRental = async () => {
    try {
      const result = await revokeRental({
        owned: true,
        selected_all: selectedAll && list?.length === selected?.length,
        nft_slugs:
          selectedAll && list?.length === selected?.length ? [] : selected,
      });
      toast.success(result?.data?.message);
      if (result?.status === 200) {
        getList({ page });
      }
      setDetailPop(false);
      setModalType("");
      setActiveTab(0);
    } catch (error) {
      toast.error(error?.response?.data?.message);
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

  const timerRevokeCheck = () => {
    for (let i = 0; i < list?.length; i++) {
      if (
        !checkRevokeTime &&
        new Date(list[i].rental_revoke_time).getTime() > new Date().getTime()
      ) {
        setCheckRevokeTime(true);
      }
    }
  };

  return (
    <>
      <FilterSection
        rentedFilterMethod={handleFilter}
        filteredNFTCount={filteredNFTCount}
        rentedFilter
      />
      <div className="available-nft">
        {isBulkRental ? (
          <BulkRent refreshData={getList} />
        ) : (
          <>
            {!loading ? (
              <>
                {list?.length > 0 ? (
                  <>
                    <div className="select-header mb-2">
                      {selected?.length > 0 && (
                        <span>
                          <strong>
                            Selected NFTs :{" "}
                            {selectedAll ? "All" : selected?.length}
                          </strong>
                        </span>
                      )}

                      {!selectAllDisabled && !checkRevokeTime && (
                        <>
                          <SelectAll
                            list={list}
                            selected={selected}
                            handleSelectAll={handleSelectAll}
                            setSelectedAll={setSelectedAll}
                            disabledStatus={selectAllDisabled}
                          />
                        </>
                      )}
                    </div>
                    <div className="mynft-card-list">
                      {list?.map((nft, i) => (
                        <NFTCardList
                          nft={nft}
                          key={i}
                          setSelected={setSelected}
                          setSelectedAll={setSelectedAll}
                          selected={selected}
                          rented
                          setSlug={setSlug}
                          setDetailPop={setDetailPop}
                          reloadData={() => getList({ page })}
                        />
                      ))}
                    </div>
                    {!selectedAll && (
                      <>
                        {nextPage && (
                          <div className="d-flex justify-content-center w-100">
                            <button
                              className="btn btn-outline-dark text-center rounded-pill mt-5 mb-3 loadmore-btn"
                              type="button"
                              disabled={loading}
                              onClick={loadMore}
                            >
                              {loading ? "Loading..." : "Load More"}
                            </button>
                          </div>
                        )}
                      </>
                    )}
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
          </>
        )}

        {!isBulkRental && list?.length > 0 && (
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
                  Remove From Rental
                </button>
              </OverlayTrigger>
            ) : (
              <button
                className="btn btn-dark"
                type="button"
                disabled={selected?.length === 0}
                onClick={() => setModalType("confirm")}
              >
                Remove From Rental
              </button>
            )}
          </div>
        )}

        {detailPop && (
          <NFTDetail
            slug={slug}
            detailPop={detailPop}
            setDetailPop={setDetailPop}
            setSelected={setSelected}
            setSelectedAll={setSelectedAll}
            handleRevokeRental={handleRevokeRental}
            disableRevoke={disableRevoke}
            popover={popover}
          />
        )}

        {modalType === "confirm" && (
          <Modal
            type={modalType}
            setModalType={setModalType}
            handleRevokeRental={handleRevokeRental}
          />
        )}
      </div>
    </>
  );
};

export default RentedNFT;

const SelectAll = ({
  list,
  selected,
  handleSelectAll,
  setSelectedAll,
  disabledStatus,
}) => {
  if (selected.length === list.length) {
    setSelectedAll(true);
  }
  return (
    <label className="d-flex align-items-center ms-auto">
      <input
        type="checkbox"
        checked={selected?.length === list?.length}
        disabled={disabledStatus}
        onChange={handleSelectAll}
      />
      <span className="checked-img"></span>
      &nbsp; Select All
    </label>
  );
};

const NFTDetail = ({
  slug,
  setSelected,
  setSelectedAll,
  detailPop,
  setDetailPop,
  handleRevokeRental,
  disableRevoke = false,
  popover,
}) => {
  const [tournamentData, setTournamentData] = useState([]);
  const [detail, setDetail] = useState({});
  const [coreStats, setCoreStats] = useState({});
  const [detailLoading, setDetailLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(false);
  const [moreloading, setMoreLoading] = useState(false);

  const getDetails = async ({ load = false, page, moreLoad = false }) => {
    try {
      moreLoad ? setMoreLoading(true) : setDetailLoading(true);
      const result = await getNFTRentDetails(slug, page);
      setDetail(result?.data?.data);
      if (load) {
        setTournamentData([
          ...tournamentData,
          ...result?.data?.data?.tournaments,
        ]);
      } else {
        setTournamentData(result?.data?.data?.tournaments);
      }

      setSelected([slug]);
      setCoreStats({
        level: { value: String(result?.data?.data?.level) },
        role: { value: result?.data?.data?.role },
        category: { value: result?.data?.data?.category },
        dominant_hand: { value: result?.data?.data?.dominant_hand },
      });
      setNextPage(result?.data?.data?.next_page);
      moreLoad ? setMoreLoading(false) : setDetailLoading(false);
    } catch (error) {
      moreLoad ? setMoreLoading(false) : setDetailLoading(false);
      console.log(error);
    }
  };

  const loadMore = async () => {
    getDetails({ page: page + 1, load: true, moreLoad: true });
    setPage(page + 1);
  };

  useEffect(() => {
    if (slug) {
      getDetails({ load: false, page: 1 });
    }
  }, [slug]);

  const handleClose = () => {
    setDetailPop(!detailPop);
    setSelected([]);
    setSelectedAll(false);
  };

  return (
    <Offcanvas
      show={detailPop}
      onHide={() => setDetailPop(!detailPop)}
      placement="end"
      className="popup-wrapper-canvas-utcoin"
      backdrop={"true"}
    >
      <Offcanvas.Body className="rental-body-container">
        {detailLoading ? (
          <div className="rental-loading-box">
            <div className="spinner-border" role="status"></div>
            <h6>NFT Loading ...</h6>
          </div>
        ) : (
          <>
            <div className="rental-nft-details">
              <div className="rental-head-content">
                <div className="rental-title" onClick={handleClose}>
                  <h2>
                    {" "}
                    Rental History
                    <BsArrowLeft
                      onClick={handleClose}
                      className="cancel-btn back-btn"
                    />
                    <IoMdClose
                      onClick={handleClose}
                      className="cancel-btn close-btn"
                    />
                  </h2>
                </div>
              </div>

              <div className="rental-body-content">
                <div className="user-detail-header">
                  <div className="mynft-card-list ">
                    <div className="mynft-card-rental">
                      <div className="content-block">
                        <div className="image-box">
                          <img
                            src={
                              detail?.image_url ? detail?.image_url : NFTimage
                            }
                          />
                        </div>
                        <div className="content-box">
                          <h6 className="nft-name">{detail?.nft_name}</h6>
                          {coreStats?.level?.value && (
                            <Stats statistics={coreStats} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="revenue-made">
                    <SlBriefcase /> Revenue earned :{" "}
                    <span>
                      <img src={utCoin} className="coin-ico" />{" "}
                      {detail?.total_points}
                    </span>
                  </div>
                  <div className="transaction-history-box">
                    <TransactionHistory tournaments={tournamentData} />
                    {moreloading ? (
                      <div className="more-load-txt">More Loading...</div>
                    ) : (
                      <>
                        {nextPage && (
                          <>
                            <div className="transaction-history-pagination">
                              <button
                                className="btn btn-dark"
                                type="button"
                                onClick={loadMore}
                              >
                                Load More
                              </button>
                            </div>
                          </>
                        )}
                      </>
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
                    Remove From Rental
                  </button>
                </OverlayTrigger>
              ) : (
                <button
                  className="btn btn-dark"
                  type="button"
                  onClick={handleRevokeRental}
                >
                  Remove From Rental
                </button>
              )}
              <p className="hint">
                * You cannot revoke NFTs for 5 mins before and 15 mins after a
                tournament.
              </p>
            </div>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

const Modal = ({ type = "", setModalType, handleRevokeRental }) => {
  return (
    <>
      <div className="popup-secondary">
        {type == "confirm" && (
          <div className="confirm-modal modal-box">
            <h5>Do you want to remove the selected NFTs from rental?</h5>
            <div className="btn-block">
              <button
                className="btn btn-dark border-btn"
                onClick={() => setModalType("")}
              >
                No
              </button>
              <button className="btn btn-dark" onClick={handleRevokeRental}>
                Yes
              </button>
            </div>
          </div>
        )}
        {type == "success" && (
          <div className="success-modal modal-box">
            <Lottie animationData={successAnim} className={"lotti-icon"} />
            <h5>{`NFT(s) revoked successfully`}</h5>
            <div className="btn-block">
              <button
                className="btn btn-dark"
                onClick={() => {
                  setModalType("");
                }}
              >
                View NFTs
              </button>
            </div>
            {/* <a href="javascript:void(0);" className="btn-link">
              Continue to rent NFTs
            </a> */}
          </div>
        )}
      </div>
    </>
  );
};

const TransactionHistory = ({ tournaments = [] }) => {
  return (
    <>
      {tournaments?.length > 0 ? (
        <>
          <Table hover>
            <thead>
              <tr>
                <th>Tournament </th>
                <th>User </th>
              </tr>
            </thead>
            <tbody>
              {tournaments?.map((tournament, i) => (
                <tr>
                  <td>
                    <div className="tournament-block">
                      <h4>{tournament?.name}</h4>
                      {tournament?.rented_on && (
                        <h5>
                          {dayjs(tournament?.rented_on).format("DD MMM YYYY")}
                        </h5>
                      )}
                    </div>
                  </td>
                  <td>
                    {tournament?.users?.map((user, i) => (
                      <div className="user-block">
                        <img
                          src={user?.avatar_url ? user.avatar_url : userImage}
                          className="user-img"
                        />
                        <div className="user-info">
                          {user?.active && (
                            <span className="user-status">Active</span>
                          )}
                          <h4>{user?.user_name}</h4>

                          <div className="revenue-block">
                            <img
                              src={utCoin}
                              alt="jt-coin"
                              className="jt-image"
                              height="20"
                              width="20"
                            />
                            <h5>{tournament?.total_points}</h5>
                          </div>
                        </div>
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {/* <Accordion>
              {tournaments?.map((tournament, i) => (
                <Accordion.Item key={`accordion-${i}`} eventKey={i}>
                  <Accordion.Header>
                    <div className="transaction-nft-header">
                      <div className="left-side">
                        <h4>{tournament?.name}</h4>
                        {tournament?.rented_on && (
                          <h5>
                            {dayjs(tournament?.rented_on).format("DD MMM YYYY")}
                          </h5>
                        )}
                      </div>
                      <div className="right-side">
                        <div className="coin-group">
                          <img
                            src={utCoin}
                            alt="jt-coin"
                            className="jt-image"
                            height="20"
                            width="20"
                          />
                          <span>{tournament?.total_points}</span>
                        </div>
                      </div>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    <ul className="transaction-nft-user-list">
                      {tournament?.users?.map((user, i) => (
                        <li className="transaction-nft-user-items" key={i}>
                          <div className="left-side">
                            <img
                              src={
                                user?.avatar_url ? user.avatar_url : userImage
                              }
                              className="user-img"
                            />
                            <div className="name-block">
                              <h4>{user?.user_name}</h4>
                              {user?.active && (
                                <span className="user-status">Active</span>
                              )}
                            </div>
                          </div>
                          <div className="right-side">
                            <div className="coin-group">
                              <img src={utCoin} height="20" width="20" />
                              <span>{user?.point}</span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion> */}
        </>
      ) : (
        <Accordion>
          <Accordion.Item eventKey="0" className="no-transaction-records">
            <SlBriefcase />
            No records found!
          </Accordion.Item>
        </Accordion>
      )}
    </>
  );
};
