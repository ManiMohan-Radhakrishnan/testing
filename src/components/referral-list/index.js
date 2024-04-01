import ContentLoader from "react-content-loader";
import React, { useEffect, useState } from "react";
import { Accordion, Card, Dropdown, useAccordionButton } from "react-bootstrap";
import { IoAddOutline } from "react-icons/io5";
import {
  AiOutlineMinus,
  AiFillCheckCircle,
  AiFillLock,
  AiFillUnlock,
} from "react-icons/ai";
import { FaCircle } from "react-icons/fa";
import { RiCheckboxBlankCircleFill } from "react-icons/ri";
// import { RiMailSendLine } from "react-icons/ri";
import { BsFillLockFill, BsFillUnlockFill, BsGiftFill } from "react-icons/bs";
import { BiCaretDown, BiSearch, BiX } from "react-icons/bi";
// import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import useDebounce from "../../hooks/useDebounce";
import Pagination from "../pagination";
import useWindowUtils from "../../hooks/useWindowUtils";
import userImg from "../../images/user_1.png";
import "react-step-progress-bar/styles.css";
import "./style.scss";
import { getReferralUsersList } from "../../api/methods";

// import { referralSendReminder } from "../../api/methods";

const ReferralList = () => {
  // const { user } = useSelector((state) => state.user.data);

  const [key, setKey] = useState("all");
  const [activeId, setActiveId] = useState("0");
  const [searchInput, setsearchInput] = useState("");
  const [loadPage, setLoadPage] = useState(1);
  const [referralUsers, setReferralUsers] = useState([]);
  const [apiFilterList, setApiFilterList] = useState({
    state: "all",
    keyword: searchInput,
    page: loadPage,
  });

  useEffect(() => {
    ReferralUsersList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiFilterList]);
  useEffect(() => {
    setApiFilterList({
      ...apiFilterList,
      state: key,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // const handleSendMail = async (email) => {
  //   try {
  //     const result = await referralSendReminder(email);

  //     if (result?.status === 200) {
  //       setTimeout(() => {
  //         ReferralUsersList();
  //       }, 4000);

  //       toast.success("Reminder sent successfully");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const ReferralUsersList = async () => {
    try {
      const result = await getReferralUsersList(apiFilterList);
      setReferralUsers(result?.data?.data);
      // setReferralUsers([...referralUsers, ...result?.data?.data]);
    } catch (error) {
      console.log(error);
    }
  };
  // const getMoreReferraluser = async () => {
  //   try {
  //     const senddata = { ...apiFilterList };
  //     senddata.page = loadPage + 1;
  //     const result = await getReferralUsersList(senddata);
  //     const loadedData = result?.data?.data;
  //     referralUsers.referrals = [
  //       ...referralUsers.referrals,
  //       ...loadedData.referrals,
  //     ];
  //     referralUsers.next_page = loadedData.next_page;
  //     setReferralUsers({ ...referralUsers });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const getMoreReferraluser = async (pageno) => {
    try {
      const senddata = { ...apiFilterList };
      senddata.page = pageno;
      const result = await getReferralUsersList(senddata);
      // const loadedData = result?.data?.data;
      // referralUsers.referrals = [
      //   ...referralUsers.referrals,
      //   ...loadedData.referrals,
      // ];
      // referralUsers.next_page = loadedData.next_page;
      // setReferralUsers({ ...referralUsers });
      setReferralUsers(result?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };
  useDebounce(() => handleTextSearch(), 500, searchInput);

  const handleTextSearch = () => {
    setApiFilterList({ ...apiFilterList, keyword: searchInput });
  };
  const handleFilter = () => {
    setApiFilterList({ ...apiFilterList, keyword: searchInput });
  };

  const toggleActive = (id) => {
    if (activeId === id) {
      setActiveId(null);
    } else {
      setActiveId(id);
    }
  };

  // const getHours = (time) => {
  //   let diffMs = new Date() - new Date(time);
  //   return Math.floor((diffMs % 86400000) / 3600000);
  // };

  // const getMinutes = (time) => {
  //   let diffMs = new Date() - new Date(time);
  //   return Math.round(((diffMs % 86400000) % 3600000) / 60000);
  // };

  const loadMoreRefer = (pageno) => {
    // if (referralUsers.next_page) {
    setLoadPage(pageno);
    getMoreReferraluser(pageno);
    // }
  };
  const CustomToggle = ({ children, eventKey }) => {
    const decoratedOnClick = useAccordionButton(eventKey, () => {
      toggleActive(eventKey);
    });

    return (
      <span type="button" onClick={decoratedOnClick}>
        {children}
      </span>
    );
  };
  // const progresssPrecentage = (data) => {
  //   if (data?.status === "completed") {
  //     return 100;
  //   } else if (data?.tasks?.prem_nft_buy?.processed) {
  //     return 75;
  //   } else if (data?.tasks?.kyc?.processed) {
  //     return 50;
  //   } else if (data?.tasks?.sign_up?.processed) {
  //     return 25;
  //   } else {
  //     return 0;
  //   }
  // };
  const InProgressIcon = () => (
    <RiCheckboxBlankCircleFill size={25} color={"#d9dbda"} />
    // <div className="inprogress">🌑</div>
  );
  const DropdownToggle = React.forwardRef(({ onClick }, ref) => (
    <div
      className="badge badge-pill text-dark fs-6 border border-dark rounded-pill"
      ref={ref}
      role={"button"}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {(() => {
        if (key === "completed") {
          return "Completed";
        } else if (key === "pending") {
          return "Pending";
        } else {
          return "All";
        }
      })()}

      <BiCaretDown className="ml-2" />
    </div>
  ));
  return (
    <>
      <Accordion defaultActiveKey="0" className="referral-list-section">
        <secttion className="referral-list-section">
          <div className="container-fluid">
            <div className="row">
              {referralUsers?.referrals ? (
                <div className="col-sm-12">
                  <article className="referral-list-block">
                    <div className="header-div">
                      <h1 className="heading">
                        Referrals ({referralUsers?.referrals.length})
                      </h1>
                      <div className="search-block">
                        <span className="status-text">Status</span>
                        <div className="me-2">
                          <Dropdown className="drop_mkplace">
                            <span className="drop_mkplace_btn">
                              <Dropdown.Toggle
                                align="end"
                                drop="end"
                                as={DropdownToggle}
                              >
                                {" "}
                              </Dropdown.Toggle>
                            </span>
                            <Dropdown.Menu align="end">
                              <Dropdown.Item
                                as="button"
                                className={key === "all" ? "active" : ""}
                                onClick={() => setKey("all")}
                              >
                                All
                              </Dropdown.Item>
                              <Dropdown.Item
                                as="button"
                                className={key === "Completed" ? "active" : ""}
                                onClick={() => setKey("completed")}
                              >
                                Completed
                              </Dropdown.Item>
                              <Dropdown.Item
                                as="button"
                                className={key === "Pending" ? "active" : ""}
                                onClick={() => setKey("pending")}
                              >
                                Pending
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                        <div className="filt-flex-search">
                          <input
                            type="text"
                            value={searchInput}
                            className="search-box-add owned"
                            placeholder="Search here"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handleFilter();
                              }
                            }}
                            onChange={(e) => setsearchInput(e.target.value)}
                          />
                          {searchInput?.length > 0 && (
                            <BiX
                              className="close-button"
                              role="button"
                              size={18}
                              onClick={() => {
                                setApiFilterList({
                                  ...apiFilterList,
                                  keyword: "",
                                });
                                setsearchInput("");
                              }}
                            />
                          )}

                          <span
                            role="button"
                            className="search-button"
                            onClick={() => {
                              handleFilter();
                            }}
                          >
                            <BiSearch size={15} />
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="content-body">
                      <div className="flex-table">
                        <div className="flex-table-head">
                          <ul className="flex-table-head-row">
                            <li className="flex-table-column accordion-btn"></li>
                            <li className="flex-table-column">NAME</li>
                            <li className="flex-table-column">EMAIL</li>
                            <li className="flex-table-column">STATUS</li>
                            <li className="flex-table-column">TREASURE BOX</li>
                            {/* <li className="flex-table-column">REWARDS</li> */}

                            {/* <li className="flex-table-column notify-btn"></li> */}
                          </ul>
                        </div>
                        <div className="flex-table-body">
                          {referralUsers?.referrals?.length > 0 &&
                            referralUsers?.referrals.map((data, key) => (
                              <>
                                <div
                                  className={`flex-table-body-row card-view ${
                                    activeId === key && "active-row"
                                  }`}
                                >
                                  {/* Web */}
                                  <ul
                                    className={`flex-table-body-row-one ${
                                      data?.status === "completed"
                                        ? "completed"
                                        : "pending"
                                    }`}
                                  >
                                    <li
                                      className={`flex-table-column accordion-btn `}
                                    >
                                      <CustomToggle eventKey={key}>
                                        {activeId === key ? (
                                          <AiOutlineMinus />
                                        ) : (
                                          <IoAddOutline />
                                        )}
                                      </CustomToggle>
                                    </li>
                                    <li className="flex-table-column">
                                      <div className="user-info">
                                        <img
                                          src={
                                            data?.avatar_url !== null &&
                                            data?.avatar_url
                                              ? data?.avatar_url
                                              : userImg
                                          }
                                          alt="User-Avatar"
                                          height={20}
                                          className="user-avatar"
                                        />{" "}
                                        <span>{data?.first_name}</span>
                                      </div>
                                    </li>
                                    <li className="flex-table-column">
                                      {data?.email}
                                    </li>
                                    <li className="flex-table-column">
                                      <div className="status-info">
                                        <FaCircle
                                          className={`circle-icon ${
                                            data?.status === "completed"
                                              ? "completed"
                                              : "pending"
                                          }`}
                                        />

                                        {data?.status}
                                      </div>
                                    </li>
                                    <li className="flex-table-column">
                                      {data?.treasure_box !== null &&
                                      data?.treasure_box
                                        ? "Unlocked"
                                        : "Locked"}
                                    </li>
                                    {/* <li className="flex-table-column">
                                      {data?.rewards}
                                    </li> */}

                                    {/* <li className="flex-table-column notify-btn">
                                      {(data?.email_send === false &&
                                        data?.status) == "pending" ? (
                                        <>
                                          <span
                                            className="send-link"
                                            onClick={() =>
                                              handleSendMail(data?.email)
                                            }
                                          >
                                            <RiMailSendLine />
                                            Notify
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          {" "}
                                          {data?.status == "pending" && (
                                            <>
                                              <span className="sending-link">
                                                Notify{" "}
                                                {getHours(data.email_send) ===
                                                0 ? (
                                                  <>
                                                    {getMinutes(
                                                      data?.email_send
                                                    )}{" "}
                                                    mins
                                                  </>
                                                ) : (
                                                  <>
                                                    {" "}
                                                    {getHours(
                                                      data.email_send
                                                    )}{" "}
                                                    hrs{" "}
                                                    {getMinutes(
                                                      data?.email_send
                                                    )}{" "}
                                                    mins
                                                  </>
                                                )}{" "}
                                                ago
                                              </span>{" "}
                                            </>
                                          )}
                                        </>
                                      )}
                                    </li> */}
                                  </ul>

                                  {/* Mobile */}
                                  <article
                                    className={`flex-table-body-row-one-card ${
                                      data?.status === "completed"
                                        ? "completed"
                                        : "pending"
                                    }`}
                                  >
                                    <span className="status-info fixed-top-right">
                                      <FaCircle
                                        className={`circle-icon ${
                                          data?.status === "completed"
                                            ? "completed"
                                            : "pending"
                                        }`}
                                      />

                                      {data?.status}
                                    </span>
                                    <div className="flex-table-column">
                                      <div className={` accordion-btn`}>
                                        <CustomToggle eventKey={key}>
                                          {activeId === key ? (
                                            <AiOutlineMinus />
                                          ) : (
                                            <IoAddOutline />
                                          )}
                                        </CustomToggle>
                                      </div>
                                      <div className="user-info">
                                        <img
                                          src={
                                            data?.avatar_url !== null &&
                                            data?.avatar_url
                                              ? data?.avatar_url
                                              : userImg
                                          }
                                          alt="User-Avatar"
                                          height={20}
                                          className="user-avatar"
                                        />{" "}
                                        <span>{data?.first_name}</span>
                                      </div>

                                      <span className="card-email">
                                        {data?.email}
                                      </span>
                                      {/* <span className="card-treasure">
                                        Treasure box
                                        {data?.treasure_box !== null &&
                                        data?.treasure_box ? (
                                          <BsFillUnlockFill className="treasure-icon" />
                                        ) : (
                                          <BsFillLockFill className="treasure-icon" />
                                        )}
                                      </span> */}

                                      <ul className="more-info-list single-line">
                                        <li>
                                          <span className="info-key">
                                            Treasure box
                                          </span>
                                          <span className="info-value">
                                            {data?.treasure_box !== null &&
                                            data?.treasure_box ? (
                                              <BsFillUnlockFill className="treasure-icon" />
                                            ) : (
                                              <BsFillLockFill className="treasure-icon" />
                                            )}
                                          </span>
                                        </li>
                                        {/* <li>
                                          <span className="info-value">
                                            <span className="status-info">
                                              {(data?.email_send === false &&
                                                data?.status) == "pending" ? (
                                                <>
                                                  <span
                                                    className="mail-link"
                                                    onClick={() =>
                                                      handleSendMail(
                                                        data?.email
                                                      )
                                                    }
                                                  >
                                                    <RiMailSendLine />
                                                    Notify
                                                  </span>
                                                </>
                                              ) : (
                                                <>
                                                  {" "}
                                                  <span className="sending-link">
                                                    {" "}
                                                    Notify{" "}
                                                    {getHours(
                                                      data.email_send
                                                    ) === 0 ? (
                                                      <>
                                                        {getMinutes(
                                                          data?.email_send
                                                        )}{" "}
                                                        mins
                                                      </>
                                                    ) : (
                                                      <>
                                                        {" "}
                                                        {getHours(
                                                          data.email_send
                                                        )}{" "}
                                                        hrs
                                                      </>
                                                    )}{" "}
                                                    ago
                                                  </span>{" "}
                                                </>
                                              )}
                                            </span>
                                          </span>
                                        </li> */}
                                      </ul>
                                    </div>
                                  </article>
                                  <Accordion.Collapse
                                    eventKey={key}
                                    className="flex-table-body-row-two"
                                  >
                                    <Card.Body>
                                      <div className="status-head">
                                        <ul className="progress-steps">
                                          <li className="common-div">
                                            <h6>Register</h6>
                                            {data?.tasks?.sign_up ? (
                                              <AiFillCheckCircle
                                                size={23}
                                                color={"#5EC692"}
                                              />
                                            ) : (
                                              <InProgressIcon />
                                            )}
                                          </li>
                                          <li className="common-div">
                                            <h6>KYC</h6>
                                            {data?.tasks?.kyc ? (
                                              <AiFillCheckCircle
                                                size={23}
                                                color={"#5EC692"}
                                              />
                                            ) : (
                                              <>
                                                <InProgressIcon />
                                                <span className="unlock-info">
                                                  Your friend's KYC is pending
                                                </span>
                                              </>
                                            )}
                                          </li>
                                          <li className="common-div">
                                            <h6>RADDX Metaverse NFTs</h6>
                                            {data?.tasks?.drop_buy ? (
                                              <>
                                                <AiFillCheckCircle
                                                  size={23}
                                                  color={"#5EC692"}
                                                />
                                                <div className="progress-box complete">
                                                  <div className="icon-box">
                                                    <AiFillUnlock className="lock-icon" />
                                                  </div>
                                                  <div className="icon-box">
                                                    <BsGiftFill className="treasure-box" />
                                                  </div>
                                                </div>
                                              </>
                                            ) : (
                                              <>
                                                {/* <InProgressIcon /> */}
                                                <div className="progress-box pending">
                                                  <div className="icon-box">
                                                    <AiFillLock className="lock-icon" />
                                                  </div>
                                                  <div className="icon-box">
                                                    <BsGiftFill className="treasure-box" />
                                                  </div>
                                                </div>
                                                {!data?.tasks?.kyc ? (
                                                  <>
                                                    <span className="unlock-info">
                                                      Your friend's drop
                                                      purchase is pending
                                                    </span>
                                                  </>
                                                ) : (
                                                  <>
                                                    {!data?.tasks?.drop_buy ? (
                                                      <>
                                                        <span className="unlock-info">
                                                          Your friend's drop
                                                          purchase is pending
                                                        </span>
                                                      </>
                                                    ) : (
                                                      <></>
                                                    )}
                                                  </>
                                                )}
                                              </>
                                            )}
                                          </li>
                                        </ul>
                                      </div>
                                    </Card.Body>
                                  </Accordion.Collapse>
                                </div>
                              </>
                            ))}
                        </div>
                        {/* Load More */}
                        {/* {referralUsers.next_page && (
                          <div className="d-flex justify-content-center w-100">
                            <button
                              className="btn btn-outline-dark w-50 h-25 text-center rounded-pill mt-2 mb-3"
                              type="button"
                              disabled={moreLoading}
                              onClick={loadMoreRefer}
                            >
                              {moreLoading ? "Loading..." : "Load More"}
                            </button>
                          </div>
                        )} */}
                        {referralUsers?.referrals?.length > 0 && (
                          <div className="user-profile-table-pagination">
                            <Pagination
                              className="pagination-bar"
                              currentPage={loadPage}
                              totalCount={referralUsers?.total}
                              pageSize={10}
                              onPageChange={(pageno) => loadMoreRefer(pageno)}
                            />
                          </div>
                        )}
                        {referralUsers?.referrals.length === 0 && (
                          <span className="no-record-found">
                            No referrals found
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                </div>
              ) : (
                <Loader />
              )}
            </div>
          </div>
        </secttion>
      </Accordion>
    </>
  );
};
const Loader = (props) => {
  const { width } = useWindowUtils();
  const isMin = width <= 476;
  const isMobile = width <= 676;
  const isTab = width <= 991;
  const is1K = width <= 1800;
  const is2K = width <= 2570;
  const is3K = width <= 3000;
  const isDesktop = width <= 1200;
  // const random = Math.random() * (1 - 0.7) + 0.7;
  return (
    <>
      {isMin ? (
        <>
          <ContentLoader
            width={350}
            height={260}
            viewBox="0 0 320 250"
            backgroundColor="#d9d9d9"
            foregroundColor="#ededed"
            {...props}
          >
            <rect x="5" y="5" rx="5" ry="5" width="320" height="240" />
          </ContentLoader>
        </>
      ) : isMobile ? (
        <>
          <ContentLoader
            width={550}
            height={280}
            viewBox="0 0 540 280"
            backgroundColor="#d9d9d9"
            foregroundColor="#ededed"
            {...props}
          >
            <rect x="5" y="5" rx="5" ry="5" width="540" height="270" />
          </ContentLoader>
        </>
      ) : isTab ? (
        <>
          <ContentLoader
            width={900}
            height={260}
            viewBox="0 0 820 250"
            backgroundColor="#d9d9d9"
            foregroundColor="#ededed"
            {...props}
          >
            <rect x="5" y="5" rx="5" ry="5" width="890" height="250" />
          </ContentLoader>
        </>
      ) : isDesktop ? (
        <>
          <ContentLoader
            width={1050}
            height={360}
            viewBox="0 0 1000 350"
            backgroundColor="#d9d9d9"
            foregroundColor="#ededed"
            {...props}
          >
            <rect x="5" y="5" rx="5" ry="5" width="990" height="340" />
          </ContentLoader>
        </>
      ) : is1K ? (
        <>
          <ContentLoader
            width={1600}
            height={450}
            viewBox="0 0 1600 440"
            backgroundColor="#d9d9d9"
            foregroundColor="#ededed"
            {...props}
          >
            <rect x="5" y="30" rx="5" ry="5" width="1580" height="400" />
          </ContentLoader>
        </>
      ) : is2K ? (
        <>
          <ContentLoader
            width={2200}
            height={520}
            viewBox="0 0 2100 540"
            backgroundColor="#d9d9d9"
            foregroundColor="#ededed"
            {...props}
          >
            <rect x="10" y="30" rx="10" ry="10" width="2140" height="480" />
          </ContentLoader>
        </>
      ) : is3K ? (
        <>
          <ContentLoader
            width={3000}
            height={600}
            viewBox="0 0 2960 580"
            backgroundColor="#d9d9d9"
            foregroundColor="#ededed"
            {...props}
          >
            <rect x="40" y="50" rx="5" ry="5" width="2920" height="520" />
          </ContentLoader>
        </>
      ) : null}
    </>
  );
};

export default ReferralList;
