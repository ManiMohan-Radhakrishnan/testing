import { BsFillInfoCircleFill } from "react-icons/bs";
import React, { useState, useEffect } from "react";
import { Dropdown, FormControl, Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { BiSearch } from "react-icons/bi";
import { MdDateRange } from "react-icons/md";
import { AiFillCaretDown } from "react-icons/ai";
import ToolTip from "../tooltip";

import NFTOwn from "../nft-guild-own";
import GuildNFTCounter from "../guild-nft-counter";
import { pendingListDate, capitalizeFirstLetter } from "../../utils/common";

import userImg from "../../images/user_1.png";

import {
  assignNftapi,
  revokeNftapi,
  cancelNftapi,
} from "../../api/methods-indigg-marketplace";
import { getUserListApi, guildUserDetail } from "../../api/methods";
import { getServerTimeApi } from "../../api/methods";
import { getPendingAssigneeList } from "../../api/methods-marketplace";

import "react-datepicker/dist/react-datepicker.css";
import "./style.scss";

const GuildNfts = ({
  selectedguild,

  assignGuildNFTsList,
  assignGuildNFTs,
  moreLoadingAssign,
  loadMoreAssignGuildNFTs,
  getUserAssignGuildNFTs,
  filtersAssignApplied,
  assignGuildNftListLoading,

  unAssignGuildNFTsList,
  unAssignGuildNFTs,
  moreLoadingUnAssign,
  loadMoreUnAssignGuildNFTs,
  getUserUnAssignGuildNFTs,
  filtersUnAssignApplied,
  unAssignGuildNftListLoading,
  guildUserMenuPermissionList,
}) => {
  const { user } = useSelector((state) => state.user.data);

  const [assignPop, setAssignPop] = useState(false);
  const [assignDate, setAssignDate] = useState(false);

  const [userpop, setUserpop] = useState(false);
  const [userstate, setUserstate] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [authpop, setAuthpop] = useState(false);
  const [disableInput, setDisableInput] = useState(true);
  const [selectedNft, setSelectedNft] = useState({});
  const [assignDisableButton, setAssignDisableButton] = useState(true);
  const [revokeDisableButton, setRevokeDisableButton] = useState(true);

  const [yesLoading, setYesLoading] = useState(false);
  const [error, setError] = useState("");

  const [serverTime, setServerTime] = useState();
  const [nftEndDate, setNftEndDate] = useState();
  const [nftstartDate, setNftstartDate] = useState();
  const [minsixmon, setMinsixmon] = useState(new Date());

  const [userList, setUserList] = useState();
  const [selectedUserEmail, setSelectedUserEmail] = useState("Select Scholar");
  const [selectedUserSlug, setSelectedUserSlug] = useState("");
  const [userdetail, setUserdetail] = useState("");
  const [UserLoading, setUserLoading] = useState(false);
  const [isTimedPeriod, setIsTimedPeriod] = useState(false);
  const [pendingList, setPendingList] = useState([]);

  const [isCancelShow, setIsCancelShow] = useState(false);
  const [assignedNFTDetails, setAssignedNFTDetails] = useState({});
  const [isCancelButtonDisable, setIsCancelButtonDisable] = useState(false);

  useEffect(() => {
    getServerTime();
    getUserList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    getUserDetailData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUserSlug, selectedUserEmail]);

  const getUserDetailData = async () => {
    try {
      if (selectedUserSlug) {
        setUserLoading(true);
        let result;
        if (selectedUserSlug) {
          result = await guildUserDetail(selectedUserSlug);
        }

        setUserdetail(result?.data?.data?.user);
        setUserLoading(false);
        setDisableInput(false);
        setAssignDisableButton(false);
      }
    } catch (error) {
      setUserLoading(false);
      console.log(
        "🚀 ~ file: index.js ~ line 133 ~ getUserDetailApi ~ error",
        error
      );
    }
  };

  const getServerTime = async () => {
    try {
      const result = await getServerTimeApi();
      setServerTime(result.data.data.time);
    } catch (error) {
      console.log(
        "🚀 ~ file: index.js ~ line 87 ~ getServerTime ~ error",
        error
      );
    }
  };

  const HandleReset = () => {
    setDisableInput(true);
    setAssignDisableButton(true);
    setError("");
    setStartDate("");
    setEndDate("");
    setSelectedNft("");
    setYesLoading(false);
    setMinsixmon("");
    setAssignDate(false);
    setSelectedUserEmail("Select Scholar");
    setUserdetail({});
    setIsTimedPeriod(false);
  };
  const handleAssignnft = (nft) => {
    setAssignDisableButton(true);
    HandleReset();
    setSelectedNft(nft);
    setUserpop(!userpop);
    setUserstate(true);
    getPendingList(nft?.slug);
  };

  const AssignNFtUserCancel = () => {
    HandleReset();
    setAuthpop(!authpop);
  };

  const handleRevokenft = async (nft) => {
    setYesLoading(false);
    setSelectedNft(nft);

    if (nft?.start_time && nft?.end_time) {
      setNftEndDate(nft?.end_time);
      setNftstartDate(nft?.start_time);
    }

    setRevokeDisableButton(false);

    setUserpop(!userpop);
    setUserstate(false);
  };

  const handleassignsub = () => {
    setYesLoading(false);
    setError("");
    setAssignPop(false);

    if (!startDate && isTimedPeriod) {
      setError("Please Select Start Date");
      return false;
    }
    if (!endDate && isTimedPeriod) {
      setError("Please Select End Date");
      return false;
    }

    if (isTimedPeriod) {
      if (
        new Date(startDate) <= new Date(endDate) ||
        new Date(endDate) >= new Date(startDate)
      ) {
        setError("");
        // set date error validation true
      } else {
        setError("Please Select Valid Start Date and End Data");
        return false;
      }
    }

    setUserpop(!userpop);
    setAuthpop(!authpop);
  };

  const handlerevokesub = async () => {
    setRevokeDisableButton(true);
    setUserpop(!userpop);
    setAuthpop(!authpop);
  };

  const handleRevokenftSub = async () => {
    setRevokeDisableButton(true);
    setYesLoading(true);
    try {
      const result = await revokeNftapi(selectedNft?.slug);

      if (result?.data?.status) {
        toast.success("NFT has been revoked successfully");
        HandleReset();
        setAuthpop(!authpop);
        setTimeout(() => {
          getUserAssignGuildNFTs(1);
          getUserUnAssignGuildNFTs(1);
        }, 500);
      }
    } catch (err) {
      setRevokeDisableButton(false);
      setYesLoading(false);
      console.log(err.data);
      toast.error("Something went wrong!");
      // setMoreLoading(false);
      console.log(
        "🚀 ~ file: wallet.js ~ line 28 ~ getTransactionHistory ~ err",
        err
      );
    }
  };

  const AssignNFtUser = async () => {
    try {
      let start_time = "";
      let end_time = "";

      if (isTimedPeriod) {
        var today = new Date();
        var startisToday = today.toDateString() == startDate?.toDateString();
        var EndisToday = today.toDateString() == endDate?.toDateString();

        if (startisToday) {
          start_time = new Date().toISOString();
        } else {
          start_time = dayjs(startDate).format("YYYY-MM-DD") + "T00:00:00.00Z";
        }
        if (EndisToday) {
          end_time = dayjs().format("YYYY-MM-DD") + "T23:59:59Z";
        } else {
          end_time = dayjs(endDate).format("YYYY-MM-DD") + "T23:59:59Z";
        }
      }
      let AssignData = {
        guild_rent: {
          user_slug: selectedUserSlug, //  whom to assign
          timed_period: isTimedPeriod,
          start_time: start_time,
          end_time: end_time,
        },
      };

      setYesLoading(true);
      const result = await assignNftapi(selectedNft.slug, AssignData);
      if (result.data.status) {
        toast.success("NFT Assigned Successfully");
        HandleReset();
        setAuthpop(!authpop);
        setTimeout(() => {
          getUserAssignGuildNFTs(1);
          getUserUnAssignGuildNFTs(1);
          getServerTime();
        }, 500);
      }
      return false;
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
      setYesLoading(false);
    }
  };

  const handlestartDatechange = (date) => {
    setStartDate(date);
    var limitDate = new Date(date);
    var finalDate = new Date(limitDate.setMonth(limitDate.getMonth() + 6));
    setMinsixmon(finalDate);
  };

  const getUserList = async () => {
    try {
      const result = await getUserListApi();
      setUserList(result?.data?.data?.users);
    } catch (error) {
      console.log(
        "🚀 ~ file: index.js ~ line 87 ~ getServerTime ~ error",
        error
      );
    }
  };

  const getPendingList = async (slug) => {
    try {
      const response = await getPendingAssigneeList(slug);
      setPendingList(response?.data?.data?.guild_rents || []);
    } catch (err) {
      console.log("err", err);
    }
  };

  const handleCancelNFT = (details) => {
    console.log(details, "select Cancel NFT");
    setAssignedNFTDetails({});
    setAssignedNFTDetails(details);
    setIsCancelShow(true);
    setUserpop(!userpop);
  };
  const handleCancelConfirmNFT = async () => {
    try {
      setIsCancelButtonDisable(true);
      const result = await cancelNftapi(assignedNFTDetails?.slug);
      if (result.data.status) {
        toast.success("NFT Cancelled Successfully");
        setIsCancelButtonDisable(false);
        setUserpop(!userpop);
        setIsCancelShow(false);
        getPendingList(selectedNft.slug);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
      setIsCancelButtonDisable(false);
    }
  };
  const handleCancelConfirmNFTNo = () => {
    setUserpop(!userpop);
    setIsCancelShow(false);
    setAssignedNFTDetails({});
  };

  const CustomMenu = React.forwardRef(({ children, style, className }, ref) => {
    const [value, setValue] = useState("");
    return (
      <div ref={ref} className={className}>
        <span className="category-search-block">
          <FormControl
            autoFocus
            className="category-search"
            placeholder="Search Scholar"
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
          <BiSearch className="category-search-icon" size={15} />
        </span>
        <ul className="list-unstyled scroll-fixed">
          {React.Children.toArray(children).filter(
            (child) =>
              !value ||
              child.props.children
                .toLowerCase()
                .includes(value.toLocaleLowerCase())
          )}
        </ul>
      </div>
    );
  });

  const UserDropdown = React.forwardRef(({ onClick }, ref) => (
    <div
      className="filter-search form-control d-flex align-items-center justify-content-between"
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {selectedUserEmail} <AiFillCaretDown className="dropdown-arrow-icon" />
    </div>
  ));

  return (
    <>
      <div>
        <div className="guild-class-assigned pt-4 pb-4">
          {selectedguild === "assigned" ? (
            <>
              {assignGuildNftListLoading ? (
                <div className="display-f">
                  <p className="loading-text">Loading</p>
                  <span className="dot-flashing"></span>
                </div>
              ) : (
                <>
                  <NFTOwn
                    nftList={assignGuildNFTsList}
                    data={assignGuildNFTs}
                    handleGuildNft={handleRevokenft}
                    guildNftText={"Revoke"}
                    filtersApplied={filtersAssignApplied}
                    isAssign={false}
                    guildUserMenuPermissionList={guildUserMenuPermissionList}
                  />
                </>
              )}
              {assignGuildNFTs.next_page && (
                <div className="d-flex justify-content-center w-100 pt-4">
                  <button
                    className="btn btn-outline-dark w-50 h-25 text-center rounded-pill mt-2 mb-3"
                    type="button"
                    disabled={moreLoadingAssign}
                    onClick={loadMoreAssignGuildNFTs}
                  >
                    {moreLoadingAssign ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              {unAssignGuildNftListLoading ? (
                <div className="display-f">
                  <p className="loading-text">Loading</p>
                  <span className="dot-flashing"></span>
                </div>
              ) : (
                <>
                  <NFTOwn
                    nftList={unAssignGuildNFTsList}
                    data={unAssignGuildNFTs}
                    handleGuildNft={handleAssignnft}
                    guildNftText="Assign"
                    filtersApplied={filtersUnAssignApplied}
                    isAssign={true}
                    guildUserMenuPermissionList={guildUserMenuPermissionList}
                  />
                  {unAssignGuildNFTs.next_page && (
                    <div className="d-flex justify-content-center w-100 pt-4">
                      <button
                        className="btn btn-outline-dark w-50 h-25 text-center rounded-pill mt-2 mb-3"
                        type="button"
                        disabled={moreLoadingUnAssign}
                        onClick={loadMoreUnAssignGuildNFTs}
                      >
                        {moreLoadingUnAssign ? "Loading..." : "Load More"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {/* assign modal content */}

        <Modal
          backdrop="static"
          className={` ${
            userstate
              ? " assign-modal-popup assign-purpose"
              : "assign-auth-popup-modal revoke-purpose  "
          } `}
          show={userpop}
          onHide={() => {
            setUserpop(!userpop);
            setSelectedUserSlug("");
            setIsTimedPeriod(false);
            setSelectedUserEmail("");
          }}
        >
          <Modal.Header
            closeButton={() => {
              setUserpop(!userpop);
              setSelectedUserSlug("");
              setIsTimedPeriod(false);
              setSelectedUserEmail("");
            }}
            className={` ${userstate ? "" : "assign-auth-popup-modal-header"} `}
          >
            {userstate ? (
              <>
                <h6 className="assign-modal-header">Assign NFT to Scholar</h6>
              </>
            ) : (
              <>
                <div className="modal-title h4">Revoke NFT from Scholar </div>
              </>
            )}
          </Modal.Header>
          <Modal.Body
            className={` ${
              userstate ? " assign-modal-body" : "assign-auth-popup-modal-body"
            } `}
          >
            {/* {console.log(selectedNft)} */}

            <div className="user-section py-2">
              <div className="assign-popup-header">
                <img src={selectedNft.asset_url} />
                {/* <h2>{selectedNft.name}</h2> */}
                <div className="assign-popup-title">
                  {selectedNft && (
                    <>
                      <h4>{selectedNft?.name?.split("#")[0]}</h4>
                      <h5>
                        {"#"}
                        {selectedNft?.name?.split("#")[1]}
                      </h5>
                    </>
                  )}
                </div>
              </div>
              {userstate ? (
                <>
                  <div className="assign-modal-email-section d-flex w-100  justify-content-start flex-column">
                    {pendingList.length > 0 && (
                      <>
                        <h6 className="text-bold mt-3">
                          Other Scholar(s) NFT assigned to :
                        </h6>

                        <div className="pending-card-list">
                          {pendingList.map((list, i) => (
                            <article key={i} className="pending-card">
                              <div className="name-block">
                                <h4>{list?.assigned_to?.user_name}</h4>
                                <h6>{capitalizeFirstLetter(list?.state)}</h6>
                              </div>
                              <div>
                                <h5>
                                  <span>
                                    <MdDateRange />{" "}
                                  </span>
                                  {pendingListDate(list?.start_time)} to{" "}
                                  {pendingListDate(list?.end_time)}
                                </h5>
                              </div>
                              <button
                                className="cancel-btn"
                                onClick={() => handleCancelNFT(list)}
                              >
                                Cancel{" "}
                              </button>
                              {/* <h5></h5> */}
                            </article>
                          ))}
                        </div>
                      </>
                    )}

                    <div className="d-flex flex-row w-100 align-center">
                      <div className="w-100 me-2">
                        <div className="text-bold">Assign NFT to Scholar</div>
                        <Dropdown className="assign-modal-dropdown">
                          <Dropdown.Toggle
                            align="start"
                            drop="start"
                            as={UserDropdown}
                            className="assign-modal-dropdown-placeholder"
                          ></Dropdown.Toggle>
                          <Dropdown.Menu
                            align="start"
                            as={CustomMenu}
                            className="assign-modal-dropdown-menu"
                          >
                            {userList &&
                              Object.keys(userList)?.length > 0 &&
                              Object.keys(userList)?.map(
                                (useremail, roleIndex) => (
                                  <Dropdown.Item
                                    key={`category${roleIndex}`}
                                    as="button"
                                    onClick={(e) => {
                                      //console.log(userList, "e data");
                                      // setTwofaverifydata({
                                      //   ...twofaverifydata,
                                      //   role_id: roleList[roleData],
                                      // });
                                      setSelectedUserEmail("");
                                      setSelectedUserEmail(useremail);
                                      setSelectedUserSlug(userList[useremail]);
                                      // getUserDetailData();
                                    }}
                                  >
                                    {useremail}
                                  </Dropdown.Item>
                                )
                              )}
                          </Dropdown.Menu>
                        </Dropdown>
                        {/* {validation?.valid_email && (
                            <p className="error_text">
                              Please enter a valid email address
                            </p>
                          )} */}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                ""
              )}
            </div>

            {userstate ? (
              userdetail?.game_reward_points ? (
                <div className="mt-2 user-stat py-2">
                  <h6 className="text-bold">Scholar Stats</h6>
                  {UserLoading ? (
                    <div className="display-f">
                      <p className="loading-text">Loading</p>
                      <span className="dot-flashing"></span>
                    </div>
                  ) : (
                    <>
                      <div className="stat-section">
                        {userdetail?.game_reward_points &&
                          Object.keys(userdetail?.game_reward_points)?.length >
                            0 &&
                          Object.keys(userdetail?.game_reward_points).map(
                            (key, index) => (
                              <div className="stat-jt-point" key={index}>
                                <div className="user-stat-content-color">
                                  {userdetail?.game_reward_points?.[key]?.qty}
                                </div>
                                <div>{key} Earned</div>
                              </div>
                            )
                          )}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                ""
              )
            ) : (
              ""
            )}
            {userstate ? (
              userdetail?.game_reward_points ? (
                <div className="mt-2 user-time-section py-2">
                  <h6 className="text-bold">
                    <input
                      className="form-check-input view-check p-2"
                      id="flexCheckDefault"
                      type="checkbox"
                      checked={isTimedPeriod}
                      onChange={(e) => setIsTimedPeriod(e?.target?.checked)}
                    />{" "}
                    <label for="flexCheckDefault">Time Duration</label>{" "}
                    <ToolTip
                      icon={
                        <>
                          <BsFillInfoCircleFill />
                        </>
                      }
                      content={`NFT will be assigned perpetually if the time duration is not selected`}
                      placement={"right"}
                    />{" "}
                  </h6>
                </div>
              ) : (
                ""
              )
            ) : (
              ""
            )}

            {/* <div className="timing-section mt-2"> */}
            {userstate ? (
              userdetail?.game_reward_points ? (
                isTimedPeriod ? (
                  <>
                    <div
                      className="d-flex align-items-start justify-content-start gap-3
                      py-2 mt-0"
                    >
                      <div className="start-date-section d-flex flex-column">
                        <h6 className="text-bold">Start date</h6>
                        <div>
                          {" "}
                          <DatePicker
                            selected={startDate}
                            className="form-control"
                            minDate={new Date()}
                            maxDate={endDate ? new Date(endDate) : ""}
                            onChange={(date) => handlestartDatechange(date)}
                            disabled={disableInput || !isTimedPeriod}
                            dateFormat={"dd/MM/yyyy"}
                            required={true}
                            todayButton={true}
                            placeholderText={"Enter Start Date"}
                          />
                        </div>
                      </div>
                      <div className="mt-4 d-flex align-items-center justify-content-center h-100">
                        <h6 className="mt-4">to</h6>
                      </div>
                      <div className="end-date-section d-flex flex-column">
                        <h6 className="text-bold">End date</h6>
                        <div>
                          {" "}
                          <DatePicker
                            className="form-control"
                            selected={endDate}
                            minDate={
                              startDate ? new Date(startDate) : new Date()
                            }
                            maxDate={new Date(minsixmon)}
                            onChange={(date) => setEndDate(date)}
                            disabled={disableInput || !isTimedPeriod}
                            dateFormat={"dd/MM/yyyy"}
                            required={true}
                            placeholderText={"Enter End Date"}
                          />
                        </div>
                      </div>
                    </div>
                    <p className="error_text">{error}</p>
                  </>
                ) : (
                  ""
                )
              ) : (
                ""
              )
            ) : (
              <>
                <div className="assign-section-auth ">
                  <div className="asign-confirm-info-block">
                    {selectedNft?.user_email && (
                      // <div className="asign-confirm-info-block">
                      <div className="asign-confirm-info-box">
                        <h6>Assigned to :</h6>
                        <h5 className="w-100 text-bold">
                          {selectedNft?.user_email}
                        </h5>
                      </div>
                      // </div>
                    )}
                    {selectedNft?.start_time && selectedNft?.end_time ? (
                      nftstartDate > serverTime ? (
                        <>
                          <h6>Start date :</h6>
                          <h5 className="w-100 text-bold">
                            {dayjs(nftstartDate).format("DD MMM YYYY ")}
                          </h5>
                        </>
                      ) : (
                        <div className="asign-confirm-info-box">
                          <h6>Time remaining : </h6>
                          <div className="timing-section">
                            <GuildNFTCounter
                              time={new Date(nftEndDate)}
                              cTime={serverTime}
                              guildnft
                            />
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="asign-confirm-info-box">
                        <h6>Time Duration :</h6>
                        <h5 className="w-100 text-bold">Perpetually</h5>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
            {/* </div> */}
          </Modal.Body>
          <Modal.Footer>
            <div className="user-assign-button">
              <div className="user-assign-button-section d-flex align-items-center justify-content-center">
                {userstate ? (
                  guildUserMenuPermissionList?.assign_nft ? (
                    <button
                      className="btn btn-dark"
                      onClick={() => handleassignsub()}
                      disabled={assignDisableButton}
                    >
                      Assign
                    </button>
                  ) : (
                    ""
                  )
                ) : guildUserMenuPermissionList?.remove_nft ? (
                  <button
                    // className="revoke-user-button"
                    className="btn btn-dark mb-3"
                    onClick={() => handlerevokesub()}
                    disabled={revokeDisableButton}
                  >
                    Revoke
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
          </Modal.Footer>
        </Modal>

        {/* auth modal content */}
        <div className="auth-content">
          <Modal
            backdrop="static"
            className="assign-auth-popup-modal"
            show={authpop}
            onHide={() => {
              setAuthpop(!authpop);
              AssignNFtUserCancel();
            }}
            size={selectedguild === "unassigned" ? "" : "md"}
          >
            <Modal.Header className="assign-auth-popup-modal-header d-flex flex-column">
              <Modal.Title>Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body className="assign-auth-popup-modal-body">
              {selectedguild === "unassigned" ? (
                <div className="assign-section-auth ">
                  <div className="assign-popup-header">
                    <img src={selectedNft.asset_url} />
                    <div className="assign-popup-title">
                      {selectedNft && (
                        <>
                          <h4>{selectedNft?.name?.split("#")[0]}</h4>
                          <h5>
                            {"#"}
                            {selectedNft?.name?.split("#")[1]}
                          </h5>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="asign-confirm-info-block">
                    <div className="asign-confirm-info-box">
                      <h6> Assign NFT to scholar:</h6>
                      <h5 className="w-100 text-bold">{selectedUserEmail}</h5>
                    </div>

                    {isTimedPeriod ? (
                      <>
                        <div className="asign-confirm-info-box">
                          <h6>Assign duration :</h6>
                          <h5 className="w-100 text-bold">
                            {pendingListDate(startDate)} to{" "}
                            {pendingListDate(endDate)}
                          </h5>
                        </div>
                      </>
                    ) : (
                      <div className="asign-confirm-info-box">
                        <h6>Assign duration:</h6>
                        <h5 className="w-100 text-bold">Perpetually</h5>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                ""
              )}

              <h5 className="text-center w-100">
                {selectedguild === "unassigned"
                  ? "Are you sure you want to assign this NFT?"
                  : "Are you sure you want to revoke this NFT?"}
              </h5>

              {selectedguild === "unassigned" ? (
                <>
                  <div className="option-button d-flex pb-4">
                    <button
                      className="btn btn-dark"
                      disabled={yesLoading}
                      onClick={() => AssignNFtUser()}
                    >
                      {yesLoading ? "Loading" : "YES"}
                    </button>
                    <button
                      className="btn btn-dark-secondary"
                      disabled={yesLoading}
                      onClick={() => AssignNFtUserCancel()}
                    >
                      NO
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="option-button d-flex pb-4">
                    <button
                      className="btn btn-dark"
                      disabled={yesLoading}
                      onClick={() => handleRevokenftSub()}
                    >
                      {yesLoading ? "Loading" : "YES"}
                    </button>
                    <button
                      className="btn btn-dark-secondary"
                      disabled={yesLoading}
                      onClick={() => AssignNFtUserCancel()}
                    >
                      NO
                    </button>
                  </div>
                </>
              )}
            </Modal.Body>
          </Modal>
        </div>

        <div className="auth-content">
          <Modal
            backdrop="static"
            show={isCancelShow}
            onHide={() => setIsCancelShow(!isCancelShow)}
            className="assign-auth-popup-modal"
            size="md"
          >
            <Modal.Header className="assign-auth-popup-modal-header d-flex flex-column">
              <Modal.Title>Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body className="assign-auth-popup-modal-body">
              <div className="assign-section-auth ">
                <div className="assign-popup-header">
                  <img src={selectedNft.asset_url} />
                  <div className="assign-popup-title">
                    {selectedNft && (
                      <>
                        <h4>{selectedNft?.name?.split("#")[0]}</h4>
                        <h5>
                          {"#"}
                          {selectedNft?.name?.split("#")[1]}
                        </h5>
                      </>
                    )}
                  </div>
                </div>

                {/* <div className="asign-confirm-info-block">
                  <div className="asign-confirm-info-box">
                    <h6> Assigned to :</h6>
                    <h5 className="w-100 text-bold">{selectedUserEmail}</h5>
                  </div>

                  {isTimedPeriod ? (
                    <>
                      <div className="asign-confirm-info-box">
                        <h6> Time Period</h6>
                        <h5 className="w-100 text-bold">
                          {pendingListDate(startDate)} to{" "}
                          {pendingListDate(endDate)}
                        </h5>
                      </div>
                    </>
                  ) : (
                    <div className="asign-confirm-info-box">
                      <h6> Time Period</h6>
                      <h5 className="w-100 text-bold">Unlimited</h5>
                    </div>
                  )}
                </div> */}
              </div>
              <h5 className="text-center w-100">
                Are you sure want to Cancel?
              </h5>
              <div className="option-button d-flex pb-4">
                <button
                  className="btn btn-dark"
                  onClick={() => handleCancelConfirmNFT()}
                  disabled={isCancelButtonDisable}
                >
                  {isCancelButtonDisable ? "Loading..." : "YES"}
                </button>
                <button
                  className="btn btn-dark-secondary"
                  disabled={isCancelButtonDisable}
                  onClick={() => handleCancelConfirmNFTNo()}
                >
                  NO
                </button>
              </div>
            </Modal.Body>
          </Modal>
        </div>

        {/* <Modal
          backdrop="static"
          show={isCancelShow}
          onHide={() => setIsCancelShow(!isCancelShow)}
          className="user-profile-auth-modal-popup"
          size="md"
        >
          <Modal.Header className="user-profile-auth-modal-header">
            <Modal.Title>Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body className="user-profile-auth-modal-body modal-body">
            <>
              <div className="assign-popup-header">
                <img src={selectedNft.asset_url} />
               
                <div className="assign-popup-title">
                  {selectedNft && (
                    <>
                      <h4>{selectedNft?.name?.split("#")[0]}</h4>
                      <h5>
                        {"#"}
                        {selectedNft?.name?.split("#")[1]}
                      </h5>
                    </>
                  )}
                </div>
              </div>

              <h4>
                Are you sure want to Cancel?
                
              </h4>
              <div className="d-flex align-items-center justify-content-evenly w-75">
                <button
                  className=" btn btn-dark"
                  onClick={() => handleCancelConfirmNFT()}
                  disabled={isCancelButtonDisable}
                >
                  {isCancelButtonDisable ? "Loading..." : "YES"}
                </button>

                <button
                  className="btn btn-dark-secondary"
                  disabled={isCancelButtonDisable}
                  onClick={() => handleCancelConfirmNFTNo()}
                >
                  NO
                </button>
              </div>
            </>
          </Modal.Body>
        </Modal> */}
      </div>
    </>
  );
};

export default GuildNfts;
