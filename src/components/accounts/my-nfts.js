/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { FaCheckCircle } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { Dropdown } from "react-bootstrap";
import { BiCaretDown, BiSearch, BiX } from "react-icons/bi";

import NFTOwn from "../nft-own";
import NFTFav from "../nft-fav";

import { userFavNFTsApi, userOwnedNFTsApi } from "../../api/methods";

import {
  userFavNFTsApi as userFavMarketplace,
  userOwnedNFTsApi as userOwnedMarketplace,
} from "../../api/methods-marketplace";

import NFTOnsale from "../nft-onsale";

import useDebounce from "../../hooks/useDebounce";
import "./_style.scss";

const MyNFTs = () => {
  const mynft = useRef(null);
  const mynft_scroll = () => mynft.current.scrollIntoView();

  const [key, setKey] = useState("marketplace");

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

  const [moreLoading, setMoreLoading] = useState(false);

  const [ownPageDrop, setOwnPageDrop] = useState(1);
  const [favPageDrop, setFavPageDrop] = useState(1);
  const [ownedNFTsDrop, setOwnedNFTsDrop] = useState({});
  const [ownedNFTsListDrop, setOwnedNFTsListDrop] = useState([]);
  const [favNFTsDrop, setFavNFTsDrop] = useState({});
  const [favNFTsListDrop, setFavNFTsListDrop] = useState([]);
  const [moreLoadingDrop, setMoreLoadingDrop] = useState(false);

  const [dropsType, setDropType] = useState("owned");
  const [marketplaceType, setMarketplaceType] = useState("owned");

  const [filtersApplied, setFiltersApplied] = useState(false);

  const [filter, setFilter] = useState({
    owned: [
      { name: "All", value: "all", checked: false },
      { name: "Listed on sale", value: "onsale", checked: false },
      { name: "Not on sale", value: "not_on_sale", checked: false },
    ],
    nftCollection: [
      {
        name: "Rare",
        value: "RARE",
        checked: false,
      },
      {
        name: "Rookie",
        value: "ROOKIE",
        checked: false,
      },
      {
        name: "Epic",
        value: "EPIC",
        checked: false,
      },
      {
        name: "Legend",
        value: "LEGEND",
        checked: false,
      },
      {
        name: "Super Rare",
        value: "SUPER RARE",
        checked: false,
      },
      {
        name: "Ultra Rare",
        value: "ULTRA RARE",
        checked: false,
      },
      {
        name: "Immortal",
        value: "IMMORTAL",
        checked: false,
      },
      {
        name: "Unique",
        value: "UNIQUE",
        checked: false,
      },
      {
        name: "Premium",
        value: "PREMIUM",
        checked: false,
      },
      {
        name: "Superior",
        value: "SUPERIOR",
        checked: false,
      },
      {
        name: "Standard",
        value: "STANDARD",
        checked: false,
      },
    ],
    level: [
      {
        name: "Level 1",
        value: "1",
        checked: false,
      },
      {
        name: "Level 2",
        value: "2",
        checked: false,
      },
      {
        name: "Level 3",
        value: "3",
        checked: false,
      },
      {
        name: "Level 4",
        value: "4",
        checked: false,
      },
      {
        name: "Level 5",
        value: "5",
        checked: false,
      },
      {
        name: "Level 6",
        value: "6",
        checked: false,
      },
      {
        name: "Level 7",
        value: "7",
        checked: false,
      },
      {
        name: "Level 8",
        value: "8",
        checked: false,
      },
      {
        name: "Level 9",
        value: "9",
        checked: false,
      },
      {
        name: "Level 10",
        value: "10",
        checked: false,
      },
      {
        name: "Level 11",
        value: "11",
        checked: false,
      },
      {
        name: "Level 12",
        value: "12",
        checked: false,
      },
      {
        name: "Level 13",
        value: "13",
        checked: false,
      },
      {
        name: "Level 14",
        value: "14",
        checked: false,
      },
      {
        name: "Level 15",
        value: "15",
        checked: false,
      },
    ],
    category: [
      { name: "Batsman", value: "Batsman", checked: false },
      { name: "Bowler", value: "Bowler", checked: false },
      { name: "Bat", value: "Bat", checked: false },
    ],
  });

  const [apiFilterList, setApiFilterList] = useState(() => ({
    sale_kind: "all",
    nft_collection: [],
    nft_level: [],
    nft_category: [],
    keyword: "",
    filterApplied: false,
  }));

  const [ownedSearch, setOwnedSearch] = useState("");
  const [onsaleSearch, setOnsaleSearch] = useState("");
  const [filteredNFTCount, setFilteredNFTCount] = useState(0);

  const { page } = useParams();
  const state = useSelector((state) => state.user);
  const [nftListLoading, setNftListLoading] = useState(false);
  const [nftListLoadingDrop, setNftListLoadingDrop] = useState(false);
  const [onlyAuction, setOnlyAuction] = useState(false);

  useEffect(() => {
    if (page === "mynft") {
      mynft_scroll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Marketplace
    apiFilterList.filterApplied && getUserOwnedNFTs();
    getUserFavNFTsApi();
    getUserOnSaleNFTs();

    // Drops
    getUserOwnedNFTsDrop();
    getUserFavNFTsApiDrop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlyAuction]);

  useEffect(() => {
    setFiltersApplied(checkIfFiltersArePresent());
    apiFilterList.filterApplied && getUserOwnedNFTs(1);
  }, [apiFilterList]);

  const checkIfFiltersArePresent = () => {
    if (ownedSearch !== "") return true;
    for (let [_, arr] of Object.entries(filter)) {
      for (let { checked } of arr) {
        if (checked) {
          return true;
        }
      }
    }
    return false;
  };

  const getUserOwnedNFTs = async (page) => {
    try {
      setNftListLoading(true);
      const result = await userOwnedMarketplace(page ? page : ownPage, {
        ...apiFilterList,
        sale_kind:
          apiFilterList.sale_kind !== "all" ? apiFilterList.sale_kind : "",
      });
      if (!checkIfFiltersArePresent()) {
        setOwnedNFTCount(result.data.data.total_count);
      } else {
        setFilteredNFTCount(result.data.data.total_count);
      }
      setOwnedNFTs(result.data.data);
      setOwnedNFTsList(result.data.data.nfts);
      setNftListLoading(false);

      if (result.data.data.total_count > 0) {
        setKey("marketplace");
      }
    } catch (error) {
      console.log(error);
      setNftListLoading(false);
    }
  };

  const getMoreUserOwnedNFTs = async (pageNo, type = "all", remove = false) => {
    try {
      const info = { ...filter };
      let nft_collection = [];
      let nft_level = [];
      let nft_category = [];

      info.nftCollection.map((obj) => {
        if (obj?.checked === true) nft_collection.push(obj?.value);
      });
      info.level.map((obj) => {
        if (obj?.checked === true) nft_level.push(obj?.value);
      });
      info.category.map((obj) => {
        if (obj?.checked === true) nft_category.push(obj?.value);
      });
      const filterSearch = {
        sale_kind: type !== "all" ? type : "",
        keyword: !remove ? ownedSearch : "",
        nft_collection,
        nft_level,
        nft_category,
      };
      setMoreLoading(true);
      const result = await userOwnedMarketplace(pageNo, filterSearch);
      setOwnedNFTs(result.data.data);
      setOwnedNFTsList([...ownedNFTsList, ...result.data.data.nfts]);
      setMoreLoading(false);
    } catch (err) {
      setMoreLoading(false);
      console.log(
        "🚀 ~ file: wallet.js ~ line 28 ~ getTransactionHistory ~ err",
        err
      );
    }
  };

  const loadMoreOwnedNFTs = () => {
    if (ownedNFTs.next_page) {
      const value = filter.owned
        .filter((xx) => xx.checked === true)
        .map((obj, i) => obj.value);

      const ownedFilter = value[0] ? value[0] : "";
      getMoreUserOwnedNFTs(ownPage + 1, ownedFilter);
      setOwnPage(ownPage + 1);
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

  const getMoreUserFavNFTs = async (page) => {
    try {
      setMoreLoading(true);
      const result = await userFavMarketplace(page);
      setFavNFTs(result.data.data);
      setFavNFTsList([...favNFTsList, ...result.data.data.nfts]);
      setMoreLoading(false);
    } catch (err) {
      setMoreLoading(false);
      console.log(
        "🚀 ~ file: wallet.js ~ line 28 ~ getTransactionHistory ~ err",
        err
      );
    }
  };

  const loadMoreFavNFTs = () => {
    if (favNFTs.next_page) {
      getMoreUserFavNFTs(favPage + 1);
      setFavPage(favPage + 1);
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

  const getMoreUserOnSaleNFTs = async (page) => {
    try {
      const filter = {
        sale_kind: "onsale",
        keyword: onsaleSearch,
      };
      setMoreLoading(true);
      const result = await userOwnedMarketplace(page, filter);
      setOnSaleNFTs(result.data.data);
      setOnSaleNFTsList([...onSaleNFTsList, ...result.data.data.nfts]);
      setMoreLoading(false);
    } catch (err) {
      setMoreLoading(false);
    }
  };

  const loadMoreOnSaleNFTs = () => {
    if (onSaleNFTs.next_page) {
      getMoreUserOnSaleNFTs(onSalePage + 1);
      setOnSalePage(onSalePage + 1);
    }
  };

  useDebounce(() => handleTextSearch(), 500, ownedSearch);

  const sendSeacrhFilter = (e) => {
    setOwnedSearch(e.target.value);
  };

  const handleTextSearch = (remove = false) => {
    if (marketplaceType === "owned") {
      setApiFilterList((prev) => ({
        ...prev,
        keyword: !remove ? ownedSearch : "",
        filterApplied: true,
      }));
    }
  };

  const [trigger, setTrigger] = useState(false);
  useEffect(() => {
    handleTextSearch();
  }, [trigger]);

  const handleKeyPressEvent = (event) => {
    if (event.key === "Enter") {
      handleTextSearch();
    }
  };

  const handleFilter = (input, type, remove = false) => {
    const info = { ...filter };
    // const filters = { ...apiFilterList };
    let sale_kind = apiFilterList.sale_kind;
    let nft_collection = [];
    let nft_level = [];
    let nft_category = [];

    switch (type) {
      case "owned":
        info.owned = filter.owned.map((obj) => {
          let checked = input?.value
            ? input?.value === obj.value && !obj.checked
            : false;
          if (checked) sale_kind = !remove ? input?.value : "all";
          sale_kind = !remove ? sale_kind : "all";
          return {
            ...obj,
            checked,
          };
        });
        break;
      case "nft_collection":
        info.nftCollection = filter.nftCollection.map((obj) => {
          let checked = input?.value
            ? input?.value === obj?.value
              ? !obj?.checked && !remove
              : obj?.checked
            : obj?.checked;
          return {
            ...obj,
            checked,
          };
        });
        break;
      case "nft_level":
        info.level = filter.level.map((obj) => {
          let checked = input?.value
            ? input?.value === obj?.value
              ? !obj?.checked && !remove
              : obj?.checked
            : obj?.checked;
          return {
            ...obj,
            checked,
          };
        });
        break;
      case "nft_category":
        info.category = filter.category.map((obj) => {
          let checked = input?.value
            ? input?.value === obj?.value
              ? !obj?.checked && !remove
              : obj?.checked
            : obj?.checked;
          return {
            ...obj,
            checked,
          };
        });
        break;
      default:
    }

    info.nftCollection.map((obj) => {
      if (obj?.checked === true) nft_collection.push(obj?.value);
    });
    info.level.map((obj) => {
      if (obj?.checked === true) nft_level.push(obj?.value);
    });
    info.category.map((obj) => {
      if (obj?.checked === true) nft_category.push(obj?.value);
    });
    setFilter({ ...info });
    setOwnPage(1);
    setApiFilterList({
      sale_kind,
      nft_collection,
      nft_level,
      nft_category,
      keyword: ownedSearch,
      filterApplied: true,
    });
  };

  const DropdownToggle = React.forwardRef(({ onClick }, ref) => (
    <div
      role="button"
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      <span className="text-capitalize">
        {(() => {
          if (key === "drops") {
            return "Drops";
          } else {
            return "Marketplace";
          }
        })()}
      </span>
    </div>
  ));

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

  const getMoreUserFavNFTsDrop = async (page) => {
    try {
      setMoreLoadingDrop(true);
      const result = await userFavNFTsApi(page);
      setFavNFTsDrop(result.data.data);
      setFavNFTsListDrop([...favNFTsListDrop, ...result.data.data.nfts]);
      setMoreLoadingDrop(false);
    } catch (err) {
      setMoreLoadingDrop(false);
    }
  };

  const loadMoreFavNFTsDrop = () => {
    if (favNFTsDrop.next_page) {
      getMoreUserFavNFTsDrop(favPageDrop + 1);
      setFavPageDrop(favPageDrop + 1);
    }
  };

  const saleTypeDropdown = React.forwardRef(({ onClick }, ref) => (
    <div
      className="badge badge-pill text-dark fs-6 border border-dark rounded-pill"
      ref={ref}
      role={"button"}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      Sale Type
      <BiCaretDown className="ml-2" />
    </div>
  ));

  const nftCollectionDropDown = React.forwardRef(({ onClick }, ref) => (
    <div
      className="badge badge-pill text-dark fs-6 border border-dark rounded-pill"
      ref={ref}
      role={"button"}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      Category
      <BiCaretDown fill={"#000"} className="ml-2" />
    </div>
  ));

  const nftLevelDropDown = React.forwardRef(({ onClick }, ref) => (
    <div
      className="badge badge-pill text-dark fs-6 border border-dark rounded-pill"
      ref={ref}
      role={"button"}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      Level
      <BiCaretDown fill={"#000"} className="ml-2" />
    </div>
  ));

  const nftCategoryDropDown = React.forwardRef(({ onClick }, ref) => (
    <div
      className="badge badge-pill text-dark fs-6 border border-dark rounded-pill"
      ref={ref}
      role={"button"}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      Role
      <BiCaretDown fill={"#000"} className="ml-2" />
    </div>
  ));
  // newly added filters

  return (
    <div className="main-content-block profilepage">
      <div className="container-fluid">
        <div className="about-user">
          <div className="row">
            <div className="col-md-12 ">
              <div className="about-heading mynft-heading mb-4">
                <div className="internal-heading-sec">
                  <h3 className="about-title">My NFTs</h3>
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
                        <BiCaretDown />
                      </span>
                      <Dropdown.Menu align="end">
                        <>
                          <Dropdown.Item
                            as="button"
                            className={key === "drops" ? "active" : ""}
                            onClick={() => setKey("drops")}
                          >
                            Drops
                          </Dropdown.Item>
                        </>

                        <Dropdown.Item
                          as="button"
                          className={key === "marketplace" ? "active" : ""}
                          onClick={() => setKey("marketplace")}
                        >
                          Marketplace
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
                {key === "drops" ? (
                  <>
                    {" "}
                    <div className="top-flex-block-pill">
                      <div className="top-flex-block-pill-box">
                        <div
                          role={"button"}
                          className={`rounded-pill ps-3 pe-3 pt-1 pb-1 top-activity-filter-pill ${
                            dropsType === "owned" ? "active" : ""
                          }`}
                          onClick={() => setDropType("owned")}
                        >
                          Owned (
                          {ownedNFTsDrop.total_count
                            ? ownedNFTsDrop.total_count
                            : 0}
                          )
                        </div>
                        <div
                          role={"button"}
                          className={`rounded-pill ps-3 pe-3 pt-1 pb-1 top-activity-filter-pill ${
                            dropsType === "favs" ? "active" : ""
                          }`}
                          onClick={() => setDropType("favs")}
                        >
                          Favorites (
                          {favNFTsDrop.total_count
                            ? favNFTsDrop.total_count
                            : 0}
                          )
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {" "}
                    <div className="top-flex-block-pill ">
                      <div className="top-flex-block-pill-box">
                        <>
                          <div
                            role={"button"}
                            className={`rounded-pill ps-3 pe-3 pt-1 pb-1 top-activity-filter-pill ${
                              marketplaceType === "owned" ? "active" : ""
                            }`}
                            onClick={() => setMarketplaceType("owned")}
                          >
                            Owned ({ownedNFTCount ? ownedNFTCount : 0})
                          </div>

                          <div
                            role={"button"}
                            className={`rounded-pill ps-3 pe-3 pt-1 pb-1 top-activity-filter-pill ${
                              marketplaceType === "favs" ? "active" : ""
                            }`}
                            onClick={() => setMarketplaceType("favs")}
                          >
                            Favorites (
                            {favNFTs.total_count ? favNFTs.total_count : 0})
                          </div>

                          {/* <div
                      role={"button"}
                      className={`rounded-pill ps-3 pe-3 pt-1 pb-1 top-activity-filter-pill ${
                        marketplaceType === "rented" ? "active" : ""
                      }`}
                      onClick={() => setMarketplaceType("rented")}
                    >
                      Rented (
                      {rentedNFTs?.total_count
                        ? rentedNFTs?.total_count
                        : 0}
                      )
                    </div> */}
                        </>
                      </div>
                      {marketplaceType === "owned" && (
                        <div className="search-block">
                          <div className="filt-flex-search">
                            <input
                              type="text"
                              value={ownedSearch}
                              className="search-box-add owned"
                              placeholder="Search here"
                              onKeyPress={handleKeyPressEvent}
                              onChange={(e) => sendSeacrhFilter(e)}
                            />{" "}
                            <span
                              role="button"
                              className="search-button"
                              onClick={handleTextSearch}
                            >
                              <BiSearch size={15} />
                            </span>
                            {ownedSearch && (
                              <span
                                role="button"
                                className="search-close-button"
                                onClick={() => {
                                  setOwnedSearch("");
                                  handleTextSearch(true);
                                }}
                              >
                                <AiOutlineClose size={15} />
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div ref={mynft}></div>
          {key === "drops" ? (
            <>
              {dropsType === "owned" ? (
                <>
                  {nftListLoadingDrop ? (
                    <h5 className="text-center mt-3">Loading...</h5>
                  ) : (
                    <NFTOwn nftList={ownedNFTsListDrop} data={ownedNFTsDrop} />
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
              ) : (
                <>
                  <NFTFav nftList={favNFTsListDrop} data={favNFTsDrop} />
                  {favNFTsDrop.next_page && (
                    <div className="d-flex justify-content-center w-100">
                      <button
                        className="btn btn-outline-dark w-50 h-25 text-center rounded-pill mt-2 mb-3"
                        type="button"
                        disabled={moreLoadingDrop}
                        onClick={loadMoreFavNFTsDrop}
                      >
                        {moreLoadingDrop ? "Loading..." : "Load More"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              {marketplaceType === "owned" && (
                <>
                  <div className="d-flex gap-2 p-2">
                    <Dropdown autoClose={["inside", "outside"]}>
                      <Dropdown.Toggle
                        align="start"
                        drop="start"
                        as={saleTypeDropdown}
                      ></Dropdown.Toggle>

                      <Dropdown.Menu align="start">
                        {filter.owned.map((obj, i) => (
                          <Dropdown.Item
                            key={`nft-${obj?.checked}-${i}`}
                            as="button"
                            onClick={() => handleFilter(obj, "owned")}
                          >
                            <FaCheckCircle
                              fill={obj.checked ? "#F47411" : "#ccc"}
                              className="mb-1 me-2"
                              size={17}
                            />{" "}
                            <span>{obj?.name}</span>
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown autoClose={["inside", "outside"]}>
                      <Dropdown.Toggle
                        align="start"
                        drop="start"
                        as={nftCollectionDropDown}
                      ></Dropdown.Toggle>

                      <Dropdown.Menu align="start">
                        {filter.nftCollection.map((obj, i) => (
                          <Dropdown.Item
                            key={`nft-${obj?.checked}-${i}`}
                            as="button"
                            color={"#000"}
                            onClick={() => handleFilter(obj, "nft_collection")}
                          >
                            <FaCheckCircle
                              fill={obj.checked ? "#F47411" : "#ccc"}
                              className="mb-1 me-2"
                              size={17}
                            />
                            <span>{obj?.name}</span>
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown autoClose={["inside", "outside"]}>
                      <Dropdown.Toggle
                        align="start"
                        drop="start"
                        as={nftLevelDropDown}
                      ></Dropdown.Toggle>

                      <Dropdown.Menu align="start">
                        {filter.level.map((obj, i) => (
                          <Dropdown.Item
                            key={`nft-${obj?.checked}-${i}`}
                            as="button"
                            color={"#000"}
                            onClick={() => handleFilter(obj, "nft_level")}
                          >
                            <FaCheckCircle
                              fill={obj.checked ? "#F47411" : "#ccc"}
                              className="mb-1 me-2"
                              size={17}
                            />
                            <span>{obj?.name}</span>
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown autoClose={["inside", "outside"]}>
                      <Dropdown.Toggle
                        align="start"
                        drop="start"
                        as={nftCategoryDropDown}
                      ></Dropdown.Toggle>

                      <Dropdown.Menu align="start">
                        {filter.category.map((obj, i) => (
                          <Dropdown.Item
                            key={`nft-${obj?.checked}-${i}`}
                            as="button"
                            color={"#000"}
                            onClick={() => handleFilter(obj, "nft_category")}
                          >
                            <FaCheckCircle
                              fill={obj.checked ? "#F47411" : "#ccc"}
                              className="mb-1 me-2"
                              size={17}
                            />
                            <span>{obj?.name}</span>
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>

                  {filtersApplied && (
                    <div className="w-100 d-flex gap-2 p-2 mb-3 flex-wrap">
                      {filtersApplied && filteredNFTCount !== 0 && (
                        <div className="d-flex align-items-center text-dark fs-6 fw-bold">
                          {`Filtered NFTs (${filteredNFTCount})`}
                        </div>
                      )}

                      {filter.owned
                        .filter((xx) => xx?.checked === true)
                        .map((obj, i) => (
                          <div
                            key={`filter-pill${i}`}
                            className="badge badge-pill bg-secondary bg-opacity-75 text-dark fs-6 rounded-pill text-white bg-hover-dark"
                          >
                            {obj?.name}
                            <BiX
                              role="button"
                              size={18}
                              onClick={() => handleFilter(obj, "owned", true)}
                            />
                          </div>
                        ))}
                      {filter.nftCollection
                        .filter((xx) => xx?.checked === true)
                        .map((obj, i) => (
                          <div
                            key={`filter-pill${i}`}
                            role={"button"}
                            className="badge badge-pill bg-secondary bg-opacity-75 text-dark fs-6 rounded-pill text-white bg-hover-dark"
                          >
                            {obj?.name}
                            <BiX
                              role="button"
                              size={18}
                              onClick={() =>
                                handleFilter(obj, "nft_collection", true)
                              }
                            />
                          </div>
                        ))}
                      {filter.level
                        .filter((xx) => xx?.checked === true)
                        .map((obj, i) => (
                          <div
                            key={`filter-pill${i}`}
                            role={"button"}
                            className="badge badge-pill bg-secondary bg-opacity-75 text-dark fs-6 rounded-pill text-white bg-hover-dark"
                          >
                            {obj?.name}
                            <BiX
                              role="button"
                              size={18}
                              onClick={() =>
                                handleFilter(obj, "nft_level", true)
                              }
                            />
                          </div>
                        ))}
                      {filter.category
                        .filter((xx) => xx?.checked === true)
                        .map((obj, i) => (
                          <div
                            key={`filter-pill${i}`}
                            role={"button"}
                            className="badge badge-pill bg-secondary bg-opacity-75 text-dark fs-6 rounded-pill text-white bg-hover-dark"
                          >
                            {obj?.name}
                            <BiX
                              role="button"
                              size={18}
                              onClick={() =>
                                handleFilter(obj, "nft_category", true)
                              }
                            />
                          </div>
                        ))}
                    </div>
                  )}
                </>
              )}
              {/* {marketplaceType === "owned" && (
            <div className="flex-block-pill">
              {filter.owned.map((obj, i) => (
                <div
                  key={`filter-pill-${i}`}
                  role={"button"}
                  className={`rounded-pill ps-3 pe-3 mb-3 me-3 pt-1 pb-1 activity-filter-pill ${
                    obj.checked ? "active" : ""
                  }`}
                  onClick={() => handleOwnedFilterType(obj.value)}
                >
                  {obj.checked && (
                    <FaCheckCircle
                      color={"white"}
                      size={17}
                      className="me-2"
                    />
                  )}
                  {obj.name}{" "}
                </div>
              ))}
            </div>
          )} */}
              {marketplaceType === "owned" ? (
                <>
                  {nftListLoading ? (
                    <h5 className="text-center mt-3">Loading...</h5>
                  ) : (
                    <NFTOwn
                      nftList={ownedNFTsList}
                      data={ownedNFTs}
                      putOnSale={true}
                      isLive={state.marketLive}
                      filtersApplied={filtersApplied}
                      trigger={trigger}
                      setTrigger={setTrigger}
                    />
                  )}

                  {ownedNFTs.next_page && (
                    <div className="d-flex justify-content-center w-100">
                      <button
                        className="btn btn-outline-dark w-50 h-25 text-center rounded-pill mt-2 mb-3"
                        type="button"
                        disabled={moreLoading}
                        onClick={loadMoreOwnedNFTs}
                      >
                        {moreLoading ? "Loading..." : "Load More"}
                      </button>
                    </div>
                  )}
                </>
              ) : marketplaceType === "favs" ? (
                <>
                  <NFTFav nftList={favNFTsList} data={favNFTs} marketplace />
                  {favNFTs.next_page && (
                    <div className="d-flex justify-content-center w-100">
                      <button
                        className="btn btn-outline-dark w-50 h-25 text-center rounded-pill mt-2 mb-3"
                        type="button"
                        disabled={moreLoading}
                        onClick={loadMoreFavNFTs}
                      >
                        {moreLoading ? "Loading..." : "Load More"}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                // : marketplaceType === "rented" ? (
                //   <>
                //     <NFTRented
                //       nftList={rentedNFTsList}
                //       data={rentedNFTs}
                //       marketplace
                //     />
                //     {rentedNFTs.next_page && (
                //       <div className="d-flex justify-content-center w-100">
                //         <button
                //           className="btn btn-outline-dark w-50 h-25 text-center rounded-pill mt-2 mb-3"
                //           type="button"
                //           disabled={moreLoading}
                //           onClick={loadMoreRentedNFTs}
                //         >
                //           {moreLoading ? "Loading..." : "Load More"}
                //         </button>
                //       </div>
                //     )}
                //   </>
                // )
                <>
                  <NFTOnsale
                    nftList={onSaleNFTsList}
                    data={onSaleNFTs}
                    marketplace
                  />
                  {onSaleNFTs.next_page && (
                    <div className="d-flex justify-content-center w-100">
                      <button
                        className="btn btn-outline-dark w-50 h-25 text-center rounded-pill mt-2 mb-3"
                        type="button"
                        disabled={moreLoading}
                        onClick={loadMoreOnSaleNFTs}
                      >
                        {moreLoading ? "Loading..." : "Load More"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyNFTs;
