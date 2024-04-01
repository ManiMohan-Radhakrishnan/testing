/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useHistory } from "react-router";
import {
  FaCamera,
  FaCheck,
  FaImage,
  FaTimes,
  FaTrash,
  FaUserCheck,
  FaCheckCircle,
  FaUserLock,
} from "react-icons/fa";
import { AiOutlineClose, AiOutlineInfoCircle } from "react-icons/ai";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import ToggleButton from "react-toggle-button";
import { MdEdit } from "react-icons/md";
import {
  Dropdown,
  Modal,
  Alert,
  ButtonGroup,
  ToggleButton as CustomToggle,
} from "react-bootstrap";
import { useLocation } from "react-router";
import Select from "react-select";

import InputTextArea from "../input-textarea";
import userImg from "../../images/user_1.png";
import faImg from "../../images/facebook-1@2x.jpg";
import inImg from "../../images/instagram-1@2x.jpg";
import teImg from "../../images/telegram@2x.jpg";
import twImg from "../../images/twitter@2x.jpg";
import ToolTip from "../tooltip";
import InputText from "../input-text";
import NFTPlayNft from "../nft-play-nft";
import InputPhone from "../input-phone";
import NFTFav from "../nft-fav";
import {
  BiCaretDown,
  BiCheck,
  BiLoaderAlt,
  BiSearch,
  BiX,
} from "react-icons/bi";
import {
  crispStyle,
  validateGSTIN,
  validateName,
  validateNameReplace,
  validateNumber,
  validatePAN,
  validateURL,
  validInternationalPhone,
} from "../../utils/common";

import {
  kycApi,
  profileUpdateApi,
  removeImage,
  privateNFTApi,
  kycExistingUserApi,
  getUserKycDetails,
  userFavNFTsApi,
  userOwnedNFTsApi,
} from "../../api/methods";

import {
  userFavNFTsApi as userFavMarketplace,
  userOwnedNFTsApi as userOwnedMarketplace,
} from "../../api/methods-marketplace";
import countries from "../../utils/countries.json";

import { updateBanner } from "../../api/methods";
import { updateAvatar } from "./../../api/methods";
import { toast } from "react-toastify";
import { user_load_by_token_thunk } from "../../redux/thunk/user_thunk";
import { getCookies } from "../../utils/cookies";
import { getTotalOwn } from "../../api/methods-nft";
import NFTOnsale from "../nft-onsale";

import "./_style.scss";
import { useQuery } from "../../hooks/url-params";
import useDebounce from "../../hooks/useDebounce";

const PlayNFTs = () => {
  const location = useLocation();

  const dispatch = useDispatch();
  const { page } = useParams();
  const query = useQuery(location.search);
  const mynft = useRef(null);
  const myProfile = useRef(null);
  const mynft_scroll = () => mynft.current.scrollIntoView();
  const myprofile_scroll = () => myProfile.current.scrollIntoView();
  const state = useSelector((state) => state.user);
  const { user } = state.data;
  const [nftListLoadingDrop, setNftListLoadingDrop] = useState(false);

  const [onlyAuction, setOnlyAuction] = useState(false);

  // const handleRemoveBannerShow = () => setShow(true);

  const [key, setKey] = useState("drops");

  const [ownPage, setOwnPage] = useState(1);
  const [favPage, setFavPage] = useState(1);
  const [onSalePage, setOnSalePage] = useState(1);
  const [ownedNFTs, setOwnedNFTs] = useState({});
  const [ownedNFTCount, setOwnedNFTCount] = useState(0);
  const [ownedNFTsList, setOwnedNFTsList] = useState([]);
  const [favNFTs, setFavNFTs] = useState({});
  const [favNFTsList, setFavNFTsList] = useState([]);
  const [onSaleNFTs, setOnSaleNFTs] = useState({});
  const [onSaleNFTsList, setOnSaleNFTsList] = useState([]);

  const [ownPageDrop, setOwnPageDrop] = useState(1);
  const [favPageDrop, setFavPageDrop] = useState(1);
  const [ownedNFTsDrop, setOwnedNFTsDrop] = useState({});
  const [ownedNFTsListDrop, setOwnedNFTsListDrop] = useState([]);
  const [favNFTsDrop, setFavNFTsDrop] = useState({});
  const [favNFTsListDrop, setFavNFTsListDrop] = useState([]);
  const [moreLoadingDrop, setMoreLoadingDrop] = useState(false);

  const [dropsType, setDropType] = useState("owned");
  const [marketplaceType, setMarketplaceType] = useState("owned");

  const [apiFilterList, setApiFilterList] = useState(() => ({
    sale_kind: "all",
    nft_collection: [],
    nft_level: [],
    keyword: "",
  }));

  const [ownedSearch, setOwnedSearch] = useState("");
  const [onsaleSearch, setOnsaleSearch] = useState("");
  const [filteredNFTCount, setFilteredNFTCount] = useState(0);

  useEffect(() => {
    // Marketplace
    getUserOwnedNFTs();
    getUserFavNFTsApi();
    getUserOnSaleNFTs();

    // Drops
    getUserOwnedNFTsDrop();
    getUserFavNFTsApiDrop();

    // getLootNFTCount();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlyAuction]);

  useEffect(() => {
    if (page === "mynft") {
      mynft_scroll();
    } else {
      myprofile_scroll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getUserOwnedNFTs(1);
  }, [apiFilterList]);
  // For Marketplace

  const getUserOwnedNFTs = async (page) => {
    try {
      const result = await userOwnedMarketplace(page ? page : ownPage, {
        ...apiFilterList,
        sale_kind:
          apiFilterList.sale_kind !== "all" ? apiFilterList.sale_kind : "",
      });

      setOwnedNFTs(result.data.data);
      setOwnedNFTsList(result.data.data.nfts);

      if (result.data.data.total_count > 0) {
        setKey("marketplace");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserFavNFTsApi = async () => {
    try {
      const result = await userFavMarketplace(ownPage);
      setFavNFTs(result.data.data ? result.data.data : {});
      setFavNFTsList(result.data.data.nfts);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserOnSaleNFTs = async () => {
    try {
      const filter = {
        sale_kind: "onsale",
        keyword: onsaleSearch,
      };
      const result = await userOwnedMarketplace(onSalePage, filter);
      setOnSaleNFTs(result.data.data);
      setOnSaleNFTsList(result.data.data.nfts);
    } catch (error) {
      console.log(error);
    }
  };

  useDebounce(() => handleTextSearch(), 500, ownedSearch);

  const handleTextSearch = (remove = false) => {
    if (marketplaceType === "owned") {
      // const value = filter.owned
      //   .filter((xx) => xx.checked === true)
      //   .map((obj, i) => obj.value);
      // const ownedFilter = value[0] ? value[0] : "";
      // getUserOwnedNFTs(1, ownedFilter, remove);
      setApiFilterList((prev) => ({
        ...prev,
        keyword: !remove ? ownedSearch : "",
      }));
    }
  };

  // const handleOwnedFilterType = (input) => {
  //   const info = { ...filter };
  //   info.owned = filter.owned.map((obj) => ({
  //     ...obj,
  //     checked: input ? input === obj.value : false,
  //   }));
  //   setFilter(info);
  //   setOwnPage(1);
  //   getUserOwnedNFTs(1, input);
  // };

  //For Drops

  const getUserOwnedNFTsDrop = async () => {
    try {
      setNftListLoadingDrop(true);
      const result = await userOwnedNFTsApi(ownPageDrop, onlyAuction);
      setOwnedNFTsDrop(result.data.data);
      setOwnedNFTsListDrop(result.data.data.nfts);
      setNftListLoadingDrop(false);
      if (result.data.data.total_count > 0) {
        setKey("drops");
      }
    } catch (error) {
      setNftListLoadingDrop(false);
    }
  };

  const getMoreUserOwnedNFTsDrop = async (pageNo) => {
    try {
      setMoreLoadingDrop(true);
      const result = await userOwnedNFTsApi(pageNo, onlyAuction);
      setOwnedNFTsDrop(result.data.data);
      setOwnedNFTsListDrop([...ownedNFTsListDrop, ...result.data.data.nfts]);
      setMoreLoadingDrop(false);
    } catch (err) {
      setMoreLoadingDrop(false);
    }
  };

  const loadMoreOwnedNFTsDrop = () => {
    if (ownedNFTsDrop.next_page) {
      getMoreUserOwnedNFTsDrop(ownPageDrop + 1);
      setOwnPageDrop(ownPageDrop + 1);
    }
  };

  const getUserFavNFTsApiDrop = async () => {
    try {
      const result = await userFavNFTsApi(ownPageDrop);
      setFavNFTsDrop(result.data.data ? result.data.data : {});
      setFavNFTsListDrop(result.data.data.nfts);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* <div className="col-md-10"> */}
      <div className="main-content-block profilepage" ref={myProfile}>
        <div className="container-fluid">
          <div className="about-user">
            <div className="row">
              <div className="col-md-12 ">
                <div className="about-heading mynft-heading mb-4">
                  <div className="internal-heading-sec">
                    <h3 className="about-title">Play NFTs</h3>
                  </div>

                  <>
                    {" "}
                    <div className="top-flex-block-pill">
                      <div className="top-flex-block-pill-box">
                        <div
                          role={"button"}
                          className={`rounded-pill ps-3 pe-3 pt-1 pb-1 top-activity-filter-pill ${
                            dropsType === "active" ? "active" : ""
                          }`}
                          onClick={() => setDropType("active")}
                        >
                          Active
                        </div>

                        <div
                          role={"button"}
                          className={`rounded-pill ps-3 pe-3 pt-1 pb-1 top-activity-filter-pill ${
                            dropsType === "upComing" ? "active" : ""
                          }`}
                          onClick={() => setDropType("upComing")}
                        >
                          UpComing
                        </div>

                        <div
                          role={"button"}
                          className={`rounded-pill ps-3 pe-3 pt-1 pb-1 top-activity-filter-pill ${
                            dropsType === "expried" ? "active" : ""
                          }`}
                          onClick={() => setDropType("expried")}
                        >
                          Expried
                        </div>
                      </div>
                    </div>
                  </>
                </div>
              </div>
            </div>

            <>
              {/* owned */}
              {dropsType === "active" && (
                <>
                  {nftListLoadingDrop ? (
                    <h5 className="text-center mt-3">Loading...</h5>
                  ) : (
                    <NFTPlayNft />
                  )}

                  {ownedNFTsDrop.next_page && (
                    <div className="d-flex justify-content-center w-100">
                      <button
                        className="btn btn-outline-dark w-50 h-25 text-center rounded-pill mt-2 mb-3"
                        type="button"
                        disabled={moreLoadingDrop}
                        onClick={loadMoreOwnedNFTsDrop}
                      >
                        {moreLoadingDrop ? "Loading..." : "Load More"}
                      </button>
                    </div>
                  )}
                </>
              )}
              {/* upComing */}
              {dropsType === "upComing" && (
                <>
                  {nftListLoadingDrop ? (
                    <h5 className="text-center mt-3">Loading...</h5>
                  ) : (
                    <NFTPlayNft />
                  )}

                  {ownedNFTsDrop.next_page && (
                    <div className="d-flex justify-content-center w-100">
                      <button
                        className="btn btn-outline-dark w-50 h-25 text-center rounded-pill mt-2 mb-3"
                        type="button"
                        disabled={moreLoadingDrop}
                        onClick={loadMoreOwnedNFTsDrop}
                      >
                        {moreLoadingDrop ? "Loading..." : "Load More"}
                      </button>
                    </div>
                  )}
                </>
              )}
              {/* expried */}
              {dropsType === "expried" && (
                <>
                  {nftListLoadingDrop ? (
                    <h5 className="text-center mt-3">Loading...</h5>
                  ) : (
                    <NFTPlayNft />
                  )}

                  {ownedNFTsDrop.next_page && (
                    <div className="d-flex justify-content-center w-100">
                      <button
                        className="btn btn-outline-dark w-50 h-25 text-center rounded-pill mt-2 mb-3"
                        type="button"
                        disabled={moreLoadingDrop}
                        onClick={loadMoreOwnedNFTsDrop}
                      >
                        {moreLoadingDrop ? "Loading..." : "Load More"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayNFTs;
