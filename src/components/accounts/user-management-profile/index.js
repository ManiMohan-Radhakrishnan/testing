import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { AiOutlineEye, AiOutlineClose } from "react-icons/ai";
import { Dropdown } from "react-bootstrap";
import { BiCaretDown, BiLoaderAlt, BiSearch } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";

import PaginationUserProfile from "../../pagination";
import TwofaPopup from "../../twofa-popup-indigg";
import NFTStat from "../../nft-stat";
import utCoin from "../../../images/coin.png";
import dogeCoin from "../../../images/dogecoin.png";
import userImg from "../../../images/user_1.png";
import "./style.scss";
import {
  guildUserList,
  guildUserListDropAssert,
  guildUserDetail,
  guildSubAdminTable,
  RemoveRoleApi,
  getUserNftListApi,
  getServerTimeApi,
} from "../../../api/methods";
import { currencyFormat } from "../../../utils/common";
import { revokeNftapi } from "../../../api/methods-indigg-marketplace";
import GuildNFTCounter from "../../guild-nft-counter";

const UserManagementProfile = ({ guildUserMenuPermissionList }) => {
  const PageSize = 50;
  const emailSearchParam = {
    page: 1,
    size: PageSize,
    assert_slug: "",
    search: "",
  };
  const SubPageSize = 20;
  const subAdminTableProp = {
    page: 1,
    size: SubPageSize,
    search: "",
  };
  const initialtablestate = {
    users: [
      {
        email: "",
        slug: "",
        points_in_usd: "",
        kyc_status: "",
        has_guild_role: "",
      },
    ],
  };
  const initialSubAdminTableState = {
    users: [
      {
        email: "",
        full_name: "",
      },
    ],
  };

  // state
  const [userdetailpop, setUserdetailpop] = useState(false);
  const [tempuserdetail, setTempuserdetail] = useState([]);
  const [emailSearchData, setEmailSearchData] = useState(emailSearchParam);
  const [subadminSearchData, setSubAdminSearchData] =
    useState(subAdminTableProp);
  const [tabledata, setTabledata] = useState(initialtablestate);
  const [subAdminTableData, setSubAdminTableData] = useState(
    initialSubAdminTableState
  );
  const [assertdata, setAssertData] = useState({});
  const [rLoading, setRLoading] = useState(false);
  const [udloading, setUdloading] = useState(false);
  const [subAdminLoader, setSubAdminLoader] = useState(false);
  const [selectedTable, setSelectedTable] = useState("userProfileTable");

  // dropdown toggle
  const [key, setKey] = useState("all");
  // pagination
  const [usercurrentPage, setUserCurrentPage] = useState(1);
  const [userAdminCurrentPage, setUserAdminCurrentPage] = useState(1);
  const [subAdminCurrentPage, setSubAdminCurrentPage] = useState(1);
  const [totalcountuserprofilenew, setTotalcountuserprofilenew] = useState(0);
  const [totalSubAdminTableTotal, setTotalSubAdminTableTotal] = useState(0);
  const [totalPageCount, setTotalPageCount] = useState(0);

  //Two Factor Popup
  const [showTwoFactorPopUp, setShowTwoFactorPopUp] = useState(false);
  const [guildUserDetails, setGuildUserDetails] = useState("");

  //remove sub-admin popup
  const [showRemoveSubAdminPopUp, setShowRemoveSubAdminPopUp] = useState(false);
  const [subAdminUserSlug, setSubAdminUserSlug] = useState("");
  const [removeSubAdminbuttonDisable, setRemoveSubAdminbuttonDisable] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [userNftList, setUserNftList] = useState([]);

  const [isCancelShow, setIsCancelShow] = useState(false);
  const [assignedNFTDetails, setAssignedNFTDetails] = useState({});
  const [isCancelButtonDisable, setIsCancelButtonDisable] = useState(false);
  const [selectedNft, setSelectedNft] = useState({});
  const [authpop, setAuthpop] = useState(false);
  const [serverTime, setServerTime] = useState();
  const [yesLoading, setYesLoading] = useState(false);
  const [userpop, setUserpop] = useState(false);
  const [revokeDisableButton, setRevokeDisableButton] = useState(true);
  const [nftEndDate, setNftEndDate] = useState();
  const [nftstartDate, setNftstartDate] = useState();

  const [userDetailsData, setUserDetailsData] = useState({});

  useEffect(() => {
    getServerTime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // use effect
  useEffect(() => {
    getuserprofiledata(emailSearchData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailSearchData]);
  useEffect(() => {
    getuserlistdropassert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const ReloadData = () => {
    getuserprofiledata(emailSearchData);
    getSubAdminTableApi(subadminSearchData);
  };

  const getSubAdminTableApi = async (subadPageNo) => {
    try {
      setSubAdminLoader(true);
      const result = await guildSubAdminTable(subadPageNo);
      setSubAdminTableData(result?.data?.data);
      setTotalSubAdminTableTotal(result?.data?.data?.total);
      setSubAdminLoader(false);
      setUserAdminCurrentPage(1);
    } catch (error) {
      console.log(
        "🚀 ~ file: index.js ~ line 121 ~ getSubAdminTableApi ~ error",
        error
      );
    }
  };
  const getUserDetailApi = async (userslug) => {
    try {
      setUdloading(true);
      const result = await guildUserDetail(userslug?.slug);
      setTempuserdetail(result?.data?.data?.user);
      setUserdetailpop(!userdetailpop);

      setUdloading(false);
    } catch (error) {
      console.log(
        "🚀 ~ file: index.js ~ line 133 ~ getUserDetailApi ~ error",
        error
      );
    }
  };
  const getuserprofiledata = async (pageno) => {
    try {
      setRLoading(true);
      const result = await guildUserList(pageno);
      const userprofiledata = result?.data?.data;
      setTabledata(userprofiledata);
      setTotalcountuserprofilenew(userprofiledata?.total);
      setRLoading(false);

      let totalPageCountTemp =
        parseInt(totalPageCount) + parseInt(userprofiledata?.users?.length);
      setTotalPageCount(totalPageCountTemp);
    } catch (error) {
      console.log(
        "🚀 ~ file: index.js ~ line 149 ~ getuserprofiledata ~ error",
        error
      );
      setRLoading(false);
    }
  };

  const getUserNftList = async (userSlug) => {
    try {
      // setRLoading(true);
      const result = await getUserNftListApi(userSlug?.slug);
      setUserNftList(result?.data?.data);
    } catch (error) {
      console.log(
        "🚀 ~ file: index.js ~ line 149 ~ getuserprofiledata ~ error",
        error
      );
      // setRLoading(false);a
    }
  };

  const getuserlistdropassert = async () => {
    try {
      const result = await guildUserListDropAssert();
      setAssertData(result?.data?.data?.asserts);
      setUserCurrentPage(1);
    } catch (error) {
      console.log(
        "🚀 ~ file: index.js ~ line 160 ~ getuserlistdropassert ~ error",
        error
      );
    }
  };
  // pagination method
  const handleuserprofilepage = (pageno) => {
    setUserCurrentPage(pageno);
    setEmailSearchData({
      ...emailSearchData,
      page: pageno,
    });
  };
  const handleSubAminPage = (pageno) => {
    setSubAdminCurrentPage(pageno);
    setSubAdminSearchData({
      ...subadminSearchData,
      page: pageno,
    });
  };

  const sendUserSeacrhFilter = (e) => {
    setEmailSearchData({
      ...emailSearchData,
      search: e.target.value,
      page: 1,
    });
    setUserCurrentPage(1);
  };

  const handleTextUserSearch = (remove = false) => {
    if (remove) {
      setEmailSearchData({
        ...emailSearchData,
        search: "",
        page: 1,
      });
      setUserCurrentPage(1);
    }
  };
  const handleUserSearchKeyPressEvent = (event) => {
    if (event.key === "Enter") {
      handleTextUserSearch();
    }
  };

  const sendSubAdminSeacrhFilter = (e) => {
    setSubAdminSearchData({
      ...subadminSearchData,
      search: e.target.value,
      page: 1,
    });
    setSubAdminCurrentPage(1);
  };

  const handleTextSubAdminSearch = (remove = false) => {
    if (remove) {
      setSubAdminSearchData({
        ...subadminSearchData,
        search: "",
        page: 1,
      });
      setSubAdminCurrentPage(1);
    }
  };
  const handleSubAdminSearchKeyPressEvent = (event) => {
    if (event.key === "Enter") {
      handleTextSubAdminSearch();
    }
  };

  //dropdown method
  const DropdownToggle = React.forwardRef(({ onClick }, ref) => (
    <div
      role="button"
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      className="bg-white border badge badge-pill text-dark fs-6 border-dark rounded-pill gap-4"
    >
      <span className="text-capitalize ">{key}</span>
      <BiCaretDown fill={"#000"} className="ml-2" />
    </div>
  ));
  const selectdropdate = (selected) => {
    setKey(selected);
    setEmailSearchData({
      ...emailSearchData,
      page: 1,
      assert_slug: assertdata[selected],
    });
    setUserCurrentPage(1);
  };

  const handleMakeAdminPop = (obj) => {
    setGuildUserDetails(obj);
    if (!obj?.has_guild_role) {
      setShowTwoFactorPopUp(true);
    } else {
      setShowRemoveSubAdminPopUp(true);
      setSubAdminUserSlug(obj?.slug);
    }
  };

  const handleRemoveSubadmin = async () => {
    if (subAdminUserSlug) {
      try {
        setRemoveSubAdminbuttonDisable(true);
        const result = await RemoveRoleApi({ id: subAdminUserSlug });
        if (result?.data?.success) {
          toast.success(result?.data?.message);
          setShowRemoveSubAdminPopUp(false);
          setRemoveSubAdminbuttonDisable(false);
          getuserprofiledata(emailSearchData);
          getSubAdminTableApi(subadminSearchData);
        }
      } catch (error) {
        console.log(
          "🚀 ~ file: index.js ~ line 276 ~ handleRemoveSubadmin ~ error",
          error
        );
        toast.error(error?.data?.message);
        setShowRemoveSubAdminPopUp(true);
        setRemoveSubAdminbuttonDisable(false);
      }
    }
  };

  const getViewData = (obj) => {
    getUserDetailApi(obj);
    getUserNftList(obj);
    setUserDetailsData(obj);
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

  const HandleRevokeNft = async (nft) => {
    setYesLoading(false);
    setSelectedNft(nft);
    getServerTime();

    if (nft?.start_time && nft?.end_time) {
      setNftEndDate(nft?.end_time);
      setNftstartDate(nft?.start_time);
    }
    setRevokeDisableButton(false);
    setUserpop(!userpop);
    setUserdetailpop(false);
  };

  const ReloadNFTData = () => {
    setSelectedNft({});
    setIsCancelShow(false);
    getUserDetailApi(userDetailsData);
    getUserNftList(userDetailsData);
  };
  const HandleRevokeNftSub = async () => {
    setRevokeDisableButton(true);
    setYesLoading(true);
    try {
      const result = await revokeNftapi(selectedNft?.slug);

      if (result?.data?.status) {
        toast.success("NFT has been revoked successfully");
        setAuthpop(!authpop);
        ReloadNFTData();
      }
    } catch (err) {
      setRevokeDisableButton(false);
      setYesLoading(false);
      console.log(err.data);
      toast.error("Something went wrong!");

      console.log(
        "🚀 ~ file: wallet.js ~ line 28 ~ getTransactionHistory ~ err",
        err
      );
    }
  };

  const AssignNFtUserCancel = () => {
    setIsCancelShow(false);
    setUserdetailpop(true);
  };

  const HandleRevokeSub = async () => {
    setRevokeDisableButton(true);
    setUserpop(!userpop);
    setAuthpop(!authpop);
    setIsCancelShow(true);
  };

  return (
    <div className="main-content-block container-fluid">
      <div className="row">
        <div className="col-md-12">
          <div className="about-user">
            <div className="user-profile-section">
              <div className="mb-4 about-heading mynft-heading">
                <div className="internal-heading-sec guild-heading-sec">
                  <h3 className="about-title">Guild Scholars</h3>{" "}
                </div>
                <div className="top-flex-block-pill">
                  <div className="top-flex-block-pill-box">
                    <>
                      <div
                        className={`rounded-pill ps-3 pe-3 pt-1 pb-1 top-activity-filter-pill ${
                          selectedTable === "userProfileTable" ? "active" : ""
                        }`}
                        onClick={() => setSelectedTable("userProfileTable")}
                      >
                        Scholars List
                        {totalcountuserprofilenew
                          ? " (" + totalcountuserprofilenew + ")"
                          : ""}
                      </div>
                    </>
                  </div>
                  <div className="py-2 search-block">
                    {selectedTable === "userProfileTable" ? (
                      <div className="filt-flex-search ">
                        <input
                          type="text"
                          value={emailSearchData?.search}
                          className="search-box-add guild"
                          placeholder={`Search Scholars`}
                          onKeyPress={handleUserSearchKeyPressEvent}
                          onChange={(e) => sendUserSeacrhFilter(e)}
                        />{" "}
                        <span
                          role="button"
                          className="search-button"
                          onClick={() => handleTextUserSearch}
                        >
                          <BiSearch size={15} />
                        </span>
                        {emailSearchData?.search && (
                          <span
                            role="button"
                            className="search-close-button"
                            onClick={() => {
                              handleTextUserSearch(true);
                            }}
                          >
                            <AiOutlineClose size={15} />
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="filt-flex-search ">
                        <input
                          type="text"
                          value={subadminSearchData?.search}
                          className="search-box-add guild"
                          placeholder={`Search Sub-Admins`}
                          onKeyPress={handleSubAdminSearchKeyPressEvent}
                          onChange={(e) => sendSubAdminSeacrhFilter(e)}
                        />{" "}
                        <span
                          role="button"
                          className="search-button"
                          onClick={() => handleTextSubAdminSearch}
                        >
                          <BiSearch size={15} />
                        </span>
                        {subadminSearchData?.search && (
                          <span
                            role="button"
                            className="search-close-button"
                            onClick={() => {
                              handleTextSubAdminSearch(true);
                            }}
                          >
                            <AiOutlineClose size={15} />
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <></>
              {selectedTable === "userProfileTable" ? (
                <>
                  <div className="user-profile-table-section">
                    <div className="userprofile-filter-dropdown gap-2">
                      Scholar Earnings in:
                      <Dropdown autoClose={["inside", "outside"]}>
                        <Dropdown.Toggle
                          align="start"
                          drop="start"
                          as={DropdownToggle}
                        ></Dropdown.Toggle>

                        <Dropdown.Menu align="start">
                          <Dropdown.Item
                            as="button"
                            onClick={() => selectdropdate("all")}
                          >
                            <FaCheckCircle
                              fill={key === "all" ? "#F47411" : "#898989"}
                              className="mb-1 me-2"
                              size={17}
                            />
                            All
                          </Dropdown.Item>
                          {assertdata &&
                            Object.keys(assertdata).map((data, index) => (
                              <Dropdown.Item
                                as="button"
                                onClick={() => selectdropdate(data)}
                                key={index}
                              >
                                <FaCheckCircle
                                  fill={key === data ? "#F47411" : "#898989"}
                                  className="mb-1 me-2"
                                  size={17}
                                />
                                {data}
                              </Dropdown.Item>
                            ))}
                          {/* //))} */}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                    <div className="user-profile-table-section-block">
                      {!rLoading ? (
                        tabledata?.total > 0 ? (
                          <table className="w-100 user-profile-table ms">
                            <thead>
                              <tr>
                                <th className="slno">SR NO</th>
                                <th>Email ID </th>
                                <th className="table-text-center">
                                  USD EARNINGS
                                </th>
                                <th className="table-text-center">VIEW</th>

                                {(() => {
                                  if (
                                    guildUserMenuPermissionList?.remove_role ||
                                    guildUserMenuPermissionList?.assign_role
                                  ) {
                                    return (
                                      <th className="table-text-right">
                                        ACTIONS
                                      </th>
                                    );
                                  }
                                })()}
                              </tr>
                            </thead>
                            <tbody>
                              {tabledata?.users?.map((obj, index) => {
                                return (
                                  <tr key={index}>
                                    <td>
                                      {(parseInt(usercurrentPage) - 1) *
                                        PageSize +
                                        (index + 1)}
                                    </td>
                                    <td>{obj?.email}</td>
                                    <td className="table-text-center">
                                      {obj?.points_in_usd ? (
                                        <>
                                          {currencyFormat(
                                            obj?.points_in_usd,
                                            "USD"
                                          )}
                                        </>
                                      ) : (
                                        <h6>{"-"}</h6>
                                      )}
                                    </td>
                                    <td className="table-text-center">
                                      <div
                                        className="action-eye"
                                        onClick={() => {
                                          getViewData(obj);
                                        }}
                                      >
                                        <AiOutlineEye />
                                      </div>
                                    </td>
                                    {(() => {
                                      if (
                                        guildUserMenuPermissionList?.remove_role ||
                                        guildUserMenuPermissionList?.assign_role
                                      ) {
                                        return (
                                          <td className="table-text-right">
                                            <div className="button-section">
                                              {obj?.has_guild_role ? (
                                                guildUserMenuPermissionList?.remove_role ? (
                                                  <button
                                                    className={
                                                      "revokesubbutton"
                                                    }
                                                    onClick={() =>
                                                      handleMakeAdminPop(obj)
                                                    }
                                                  >
                                                    {"Remove Role"}
                                                  </button>
                                                ) : (
                                                  ""
                                                )
                                              ) : guildUserMenuPermissionList?.assign_role ? (
                                                <button
                                                  className={"makesubbutton"}
                                                  onClick={() =>
                                                    handleMakeAdminPop(obj)
                                                  }
                                                >
                                                  {"Assign Role"}
                                                </button>
                                              ) : (
                                                ""
                                              )}
                                            </div>
                                          </td>
                                        );
                                      }
                                    })()}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        ) : (
                          <p className="loading-text">No Scholar Found!</p>
                        )
                      ) : (
                        <div className="display-f">
                          <p className="loading-text">Loading</p>
                          <span className="dot-flashing"></span>{" "}
                        </div>
                      )}
                    </div>
                  </div>
                  ;
                  {tabledata?.total ? (
                    <div className="user-profile-table-pagination">
                      <PaginationUserProfile
                        className="pagination-bar"
                        currentPage={usercurrentPage}
                        totalCount={totalcountuserprofilenew}
                        pageSize={PageSize}
                        onPageChange={(page) => handleuserprofilepage(page)}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  {/* User Detail pop up */}
                  {udloading ? (
                    <div className="loader-userdetail-area">
                      {" "}
                      <BiLoaderAlt
                        className="fa fa-spin loader-userdetail "
                        size={40}
                      />{" "}
                    </div>
                  ) : (
                    <Modal
                      show={userdetailpop}
                      onHide={() => setUserdetailpop(!userdetailpop)}
                      backdrop="static"
                      className={`user-detail-modal-popup nft-card-show`}
                      size="lg"
                    >
                      <Modal.Header
                        closeButton={() => setUserdetailpop(!userdetailpop)}
                        className="user-detail-heading-popup"
                      >
                        <div className="user-profile-detail-heading-popup">
                          USER DETAILS
                        </div>
                      </Modal.Header>
                      <Modal.Body className="user-detail-body-popup">
                        <>
                          <div className="row">
                            <div className="py-2 user-email-section col d-flex align-items-start justify-content-start flex-column">
                              <div className="user-profile-email user-profile-detail-value">
                                <img
                                  className="user-image"
                                  src={userImg}
                                  alt="user-icon"
                                />
                                <div className="name-group">
                                  <h4>{tempuserdetail?.email}</h4>
                                  <h6>{tempuserdetail?.full_name}</h6>
                                  <h6 className={`kyc-block`}>
                                    <span
                                      className={`kyc-status ${tempuserdetail?.kyc_status}`}
                                    >
                                      KYC -{" "}
                                      {!tempuserdetail?.kyc_status
                                        ? "NOT INITIATED"
                                        : tempuserdetail?.kyc_status}
                                    </span>
                                    {/* </h6>
                                    <h6 className={`kyc-block`}> */}
                                    {tempuserdetail?.role_name && (
                                      <>
                                        <span className={`kyc-status`}>
                                          Role - {tempuserdetail?.role_name}
                                        </span>
                                      </>
                                    )}{" "}
                                  </h6>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="user-more-info-block">
                            <div className="grouped-info-box">
                              <h6>Earnings</h6>
                              <ul>
                                {tempuserdetail?.game_reward_points &&
                                  Object.keys(
                                    tempuserdetail?.game_reward_points
                                  )?.length > 0 &&
                                  Object.keys(
                                    tempuserdetail?.game_reward_points
                                  )?.map((tudata, tuindex) => (
                                    <>
                                      <li key={tuindex}>
                                        <h5>
                                          {tudata === "DOGE" ? (
                                            <img src={dogeCoin} />
                                          ) : (
                                            <img src={utCoin} />
                                          )}
                                          {tudata}
                                        </h5>
                                        <div className="value-group">
                                          <h4 className="count">
                                            {
                                              tempuserdetail
                                                ?.game_reward_points?.[tudata]
                                                ?.qty
                                            }
                                          </h4>
                                          {tempuserdetail?.game_reward_points?.[
                                            tudata
                                          ]?.qty_in_usd > 0 && (
                                            <h6 className="coin-usd-detail">
                                              {tudata === "DOGE" && "~"}
                                              USD{" "}
                                              {
                                                tempuserdetail
                                                  ?.game_reward_points?.[tudata]
                                                  ?.qty_in_usd
                                              }
                                            </h6>
                                          )}
                                        </div>
                                      </li>
                                    </>
                                  ))}
                              </ul>
                            </div>
                            <div className="grouped-info-box">
                              <h6>NFTs</h6>
                              <ul>
                                <li>
                                  <h5> Assigned</h5>
                                  <h4 className="count">
                                    {userNftList?.total_assigned}
                                  </h4>
                                </li>
                                <li>
                                  <h5>Revoked</h5>
                                  <h4 className="count">
                                    {userNftList?.total_revoked}
                                  </h4>
                                </li>
                              </ul>
                            </div>
                          </div>
                          {userNftList?.nfts?.length > 0 ? (
                            <>
                              <div className="user-nft-list-block">
                                {userNftList?.nfts?.map((item, index) => {
                                  return (
                                    <article
                                      className="user-nft-list-items"
                                      key={index}
                                    >
                                      <div className="image-boxs">
                                        {item?.asset_type === "video/mp4" ? (
                                          // <video
                                          //   className="user-image"
                                          //   src={item?.asset_url}
                                          //   controls={false}
                                          //   playsInline
                                          //   autoPlay
                                          //   muted
                                          //   loop
                                          // ></video>
                                          <img
                                            className="user-image"
                                            src={item?.cover_url}
                                            alt="bat-image"
                                          />
                                        ) : (
                                          <img
                                            className="user-image"
                                            src={item?.asset_url}
                                            alt={item?.asset_url}
                                          />
                                        )}
                                      </div>
                                      <h6>{item?.name}</h6>
                                      <NFTStat
                                        statistics={item?.core_statistics}
                                      />
                                      {guildUserMenuPermissionList?.remove_nft && (
                                        <button
                                          className="btn btn-dark revoke-btn"
                                          onClick={() => HandleRevokeNft(item)}
                                        >
                                          <span>Revoke</span>
                                        </button>
                                      )}
                                    </article>
                                  );
                                })}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="user-nft-list-nodata">
                                <h6>No NFT assigned</h6>
                              </div>
                            </>
                          )}
                        </>
                      </Modal.Body>
                      <Modal.Footer>
                        <div className="d-flex justify-content-center user-profile-detail-value text-center">
                          {tempuserdetail?.has_guild_role ? (
                            guildUserMenuPermissionList?.remove_role ? (
                              <button
                                className="btn btn-dark rounded-pill"
                                onClick={() => {
                                  handleMakeAdminPop(tempuserdetail);
                                  setUserdetailpop(false);
                                }}
                              >
                                {" "}
                                Remove Role{" "}
                              </button>
                            ) : (
                              ""
                            )
                          ) : guildUserMenuPermissionList?.assign_role ? (
                            <button
                              className="btn btn-dark rounded-pill"
                              onClick={() => {
                                handleMakeAdminPop(tempuserdetail);
                                setUserdetailpop(false);
                              }}
                            >
                              {" "}
                              Assign Role{" "}
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                      </Modal.Footer>
                    </Modal>
                  )}
                  {showTwoFactorPopUp && (
                    <TwofaPopup
                      IsShow={showTwoFactorPopUp}
                      setShow={setShowTwoFactorPopUp}
                      twoFactorUserData={guildUserDetails}
                      ReloadData={ReloadData}
                      guildUserMenuPermissionList={guildUserMenuPermissionList}
                    />
                  )}
                  {/* /* Remove Sub-admin Popup*/}
                  <Modal
                    backdrop="static"
                    show={showRemoveSubAdminPopUp}
                    onHide={() =>
                      setShowRemoveSubAdminPopUp(!showRemoveSubAdminPopUp)
                    }
                    className="user-profile-auth-modal-popup"
                    size="md"
                  >
                    <Modal.Header className="user-profile-auth-modal-header">
                      <Modal.Title>Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="user-profile-auth-modal-body">
                      <>
                        <h4>
                          Are you sure want to <span>Remove</span> user as an
                          <span> {guildUserDetails?.role_name}</span>
                        </h4>
                        <div className="d-flex align-items-center justify-content-evenly w-75">
                          {guildUserMenuPermissionList?.remove_role ? (
                            <button
                              className=" btn btn-dark"
                              onClick={() => handleRemoveSubadmin()}
                              disabled={removeSubAdminbuttonDisable}
                            >
                              {removeSubAdminbuttonDisable
                                ? "Loading..."
                                : "YES"}
                            </button>
                          ) : (
                            ""
                          )}
                          <button
                            className="btn btn-dark-secondary"
                            disabled={removeSubAdminbuttonDisable}
                            onClick={() => setShowRemoveSubAdminPopUp(false)}
                          >
                            NO
                          </button>
                        </div>
                      </>
                    </Modal.Body>
                  </Modal>
                </>
              ) : (
                ""
              )}

              <Modal
                backdrop="static"
                className={`assign-auth-popup-modal revoke-purpose`}
                show={userpop}
                onHide={() => {
                  setUserpop(!userpop);
                  getUserDetailApi(userDetailsData);
                  getUserNftList(userDetailsData);
                }}
              >
                <Modal.Header
                  closeButton={() => {
                    setUserpop(!userpop);
                    getUserDetailApi(userDetailsData);
                    getUserNftList(userDetailsData);
                  }}
                >
                  <>
                    <div className="modal-title h4">
                      Revoke NFT from Scholar{" "}
                    </div>
                  </>
                </Modal.Header>
                <Modal.Body className={`assign-auth-popup-modal-body`}>
                  <div className="user-section py-2">
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
                  </div>

                  <div className="assign-section-auth">
                    <div className="asign-confirm-info-block">
                      {userDetailsData?.email && (
                        // <div className="asign-confirm-info-block">
                        <div className="asign-confirm-info-box">
                          <h6>Assigned to :</h6>
                          <h5 className="w-100 text-bold">
                            {userDetailsData?.email}
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
                </Modal.Body>
                <Modal.Footer>
                  <div className="user-assign-button">
                    <div className="user-assign-button-section d-flex align-items-center justify-content-center">
                      {guildUserMenuPermissionList?.remove_nft ? (
                        <button
                          // className="revoke-user-button"
                          className="btn btn-dark mb-3"
                          onClick={() => HandleRevokeSub()}
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
                    </div>
                    <h5 className="text-center w-100">
                      Are you sure you want to revoke this NFT?
                    </h5>
                    <div className="option-button d-flex pb-4">
                      <button
                        className="btn btn-dark"
                        disabled={yesLoading}
                        onClick={() => HandleRevokeNftSub()}
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
                  </Modal.Body>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementProfile;
