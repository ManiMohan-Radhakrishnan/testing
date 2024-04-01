/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useRef, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { Dropdown, ToggleButton as CustomToggle } from "react-bootstrap";
import { BiCaretDown, BiSearch, BiX } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";

import {
  userUnAssignGuildNFTsApi,
  userAssignGuildNFTsApi,
} from "../../api/methods-marketplace";

import GuildNfts from "../guild-nfts";

import useDebounce from "../../hooks/useDebounce";

import "./_style.scss";

const MclNfts = ({ guildUserMenuPermissionList }) => {
  const mynft = useRef(null);

  ///Guild User Tabs
  const [selectedguild, setSelectedGuild] = useState("unassigned");
  const [search, setSearch] = useState("");

  const [moreLoadingAssign, setMoreLoadingAssigned] = useState(false);

  const [unAssignGuildPage, setUnAssignGuildPage] = useState(1);
  const [unAssignGuildNftListLoading, setUnAssignGuildnftListLoading] =
    useState(false);
  const [unAssignGuildNFTs, setUnAssignGuildNFTs] = useState({});
  const [unAssignGuildNFTCount, setUnAssignGuildNFTCount] = useState(0);
  const [unAssignGuildNFTsList, setUnAssignGuildNFTsList] = useState([]);
  const [filteredUnAssignGuildNFTCount, setFilteredUnAssignGuildNFTCount] =
    useState(0);
  const [moreLoadingUnAssign, setMoreLoadingUnAssigned] = useState(false);
  const [filtersUnAssignApplied, setFiltersUnAssignApplied] = useState(false);

  //Assign Data
  const [assignGuildPage, setAssignGuildPage] = useState(1);
  const [assignGuildNftListLoading, setAssignGuildnftListLoading] =
    useState(false);
  const [assignGuildNFTs, setAssignGuildNFTs] = useState({});
  const [assignGuildNFTCount, setAssignGuildNFTCount] = useState(0);
  const [assignGuildNFTsList, setAssignGuildNFTsList] = useState([]);
  const [filteredAssignGuildNFTCount, setFilteredAssignGuildNFTCount] =
    useState(0);
  const [filtersAssignApplied, setFiltersAssignApplied] = useState(false);

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
    role: [
      {
        name: "Batsman",
        value: "Batsman",
        checked: false,
      },
      {
        name: "Bowler",
        value: "Bowler",
        checked: false,
      },
      {
        name: "Bat",
        value: "Bat",
        checked: false,
      },
    ],
  });
  const [apiFilterList, setApiFilterList] = useState({
    sale_kind: "all",
    nft_collection: [],
    nft_level: [],
    nft_category: [],
    keyword: "",
    filterApplied: false,
  });

  useEffect(() => {
    getUserAssignGuildNFTs();
    getUserUnAssignGuildNFTs();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setFiltersUnAssignApplied(checkIfFiltersUnAssignGuildNftArePresent());
    apiFilterList.filterApplied && getUserUnAssignGuildNFTs(1);
    setFiltersAssignApplied(checkIfFiltersAssignGuildNftArePresent());
    apiFilterList.filterApplied && getUserAssignGuildNFTs(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiFilterList]);

  // For Un Assign APIs
  const checkIfFiltersUnAssignGuildNftArePresent = () => {
    if (search !== "") return true;
    for (let [_, arr] of Object.entries(filter)) {
      for (let { checked } of arr) {
        if (checked) {
          return true;
        }
      }
    }
    return false;
  };

  const getUserUnAssignGuildNFTs = async (page) => {
    try {
      setUnAssignGuildnftListLoading(true);

      const result = await userUnAssignGuildNFTsApi(
        page ? page : unAssignGuildPage,
        {
          ...apiFilterList,
          sale_kind:
            apiFilterList.sale_kind !== "all" ? apiFilterList.sale_kind : "",
        }
      );
      if (!checkIfFiltersUnAssignGuildNftArePresent()) {
        setUnAssignGuildNFTCount(result?.data?.data?.total_count);
      } else {
        setFilteredUnAssignGuildNFTCount(result?.data?.data?.total_count);
      }
      setUnAssignGuildNFTs(result?.data?.data);
      setUnAssignGuildNFTsList(result?.data?.data?.nfts);
      setUnAssignGuildnftListLoading(false);
    } catch (error) {
      console.log(error);
      setUnAssignGuildnftListLoading(false);
    }
  };

  const getMoreUnAssignGuildNFTs = async (
    pageNo,
    type = "all",
    remove = false
  ) => {
    try {
      const info = { ...filter };
      let nft_collection = [];
      let nft_level = [];
      let nft_category = [];
      info.nftCollection.map((obj) => {
        if (obj?.checked === true) nft_collection?.push(obj?.value);
      });
      info.level.map((obj) => {
        if (obj?.checked === true) nft_level?.push(obj?.value);
      });
      info.role.map((obj) => {
        if (obj?.checked === true) nft_category?.push(obj?.value);
      });
      const filterSearch = {
        sale_kind: type !== "all" ? type : "",
        keyword: !remove ? search : "",
        nft_collection,
        nft_level,
        nft_category,
      };
      setMoreLoadingUnAssigned(true);
      const result = await userUnAssignGuildNFTsApi(pageNo, filterSearch);
      setUnAssignGuildNFTs(result?.data?.data);
      setUnAssignGuildNFTsList([
        ...unAssignGuildNFTsList,
        ...result?.data?.data?.nfts,
      ]);
      setMoreLoadingUnAssigned(false);
    } catch (err) {
      setMoreLoadingUnAssigned(false);
      console.log(
        "🚀 ~ file: wallet.js ~ line 28 ~ getTransactionHistory ~ err",
        err
      );
    }
  };

  const loadMoreUnAssignGuildNFTs = () => {
    if (unAssignGuildNFTs?.next_page) {
      getMoreUnAssignGuildNFTs(unAssignGuildPage + 1);
      setUnAssignGuildPage(unAssignGuildPage + 1);
    }
  };

  // For Assign APIs
  const checkIfFiltersAssignGuildNftArePresent = () => {
    if (search !== "") return true;
    for (let [_, arr] of Object.entries(filter)) {
      for (let { checked } of arr) {
        if (checked) {
          return true;
        }
      }
    }
    return false;
  };

  const getUserAssignGuildNFTs = async (page) => {
    try {
      const apiFilterList = {
        keyword: "",
        nft_collection: {},
        nft_level: {},
        nft_category: {},
      };
      setAssignGuildnftListLoading(true);
      const result = await userAssignGuildNFTsApi(
        page ? page : assignGuildPage,
        apiFilterList
      );

      if (!checkIfFiltersAssignGuildNftArePresent()) {
        setAssignGuildNFTCount(result?.data?.data?.total_count);
      } else {
        //setFilteredAssignGuildNFTCount(result?.data?.data?.total_count);
      }
      setAssignGuildNFTs(result?.data?.data);
      setAssignGuildNFTsList(result?.data?.data?.nfts);
      setAssignGuildnftListLoading(false);
    } catch (error) {
      console.log(error);
      setAssignGuildnftListLoading(false);
    }
  };

  const getMoreAssignGuildNFTs = async (
    pageNo,
    type = "all",
    remove = false
  ) => {
    try {
      const info = { ...filter };
      let nft_collection = [];
      let nft_level = [];
      let nft_category = [];
      info.nftCollection.map((obj) => {
        if (obj?.checked === true) nft_collection?.push(obj?.value);
      });
      info.level.map((obj) => {
        if (obj?.checked === true) nft_level?.push(obj?.value);
      });
      info.role.map((obj) => {
        if (obj?.checked === true) nft_category?.push(obj?.value);
      });
      // const filterSearch = {
      //   keyword: !remove ? search : "",
      //   nft_collection,
      //   nft_level,
      //   nft_category,
      // };
      const filterSearch = {
        keyword: "",
        nft_collection: {},
        nft_level: {},
        nft_category: {},
      };
      setMoreLoadingAssigned(true);
      const result = await userAssignGuildNFTsApi(pageNo, filterSearch);
      setAssignGuildNFTs(result?.data?.data);
      setAssignGuildNFTsList([
        ...assignGuildNFTsList,
        ...result?.data?.data.nfts,
      ]);
      setMoreLoadingAssigned(false);
    } catch (err) {
      setMoreLoadingAssigned(false);
      console.log(
        "🚀 ~ file: wallet.js ~ line 28 ~ getTransactionHistory ~ err",
        err
      );
    }
  };

  const loadMoreAssignGuildNFTs = () => {
    if (assignGuildNFTs?.next_page) {
      getMoreAssignGuildNFTs(assignGuildPage + 1);
      setAssignGuildPage(assignGuildPage + 1);
    }
  };

  const handleGuildFilter = (input, type, remove = false) => {
    const info = { ...filter };
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
        info.nftCollection = filter?.nftCollection.map((obj) => {
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
        info.level = filter?.level.map((obj) => {
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
      case "nft_role":
        info.role = filter?.role.map((obj) => {
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
      if (obj?.checked === true) nft_collection?.push(obj?.value);
    });
    info.level.map((obj) => {
      if (obj?.checked === true) nft_level?.push(obj?.value);
    });
    info.role.map((obj) => {
      if (obj?.checked === true) nft_category?.push(obj?.value);
    });
    setFilter({ ...info });

    setApiFilterList({
      sale_kind,
      nft_collection,
      nft_level,
      nft_category,
      keyword: search,
      filterApplied: true,
    });
  };
  useDebounce(() => handleTextSearch(), 500, search);

  const sendSeacrhFilter = (e) => {
    setSearch(e?.target?.value);
  };
  const handleTextSearch = (remove = false) => {
    setApiFilterList((prev) => ({
      ...prev,
      keyword: !remove ? search : "",
      filterApplied: true,
    }));
    //}
  };

  const handleKeyPressEvent = (event) => {
    if (event.key === "Enter") {
      handleTextSearch();
    }
  };

  const nftCollectionDropDown = React.forwardRef(({ onClick }, ref) => (
    <div
      className="border badge badge-pill text-dark fs-6 border-dark rounded-pill"
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
      className="border badge badge-pill text-dark fs-6 border-dark rounded-pill"
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

  // newly added filters
  const RoleDropdown = React.forwardRef(({ onClick }, ref) => (
    <div
      className="border badge badge-pill text-dark fs-6 border-dark rounded-pill"
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

  return (
    <>
      <div className="row">
        <div className="col-md-12 ">
          <div className="mb-4 about-heading mynft-heading">
            <>
              {" "}
              <div className="top-flex-block-pill">
                <div className="top-flex-block-pill-box">
                  <>
                    <div
                      role={"button"}
                      className={`rounded-pill ps-3 pe-3 pt-1 pb-1 top-activity-filter-pill ${
                        selectedguild === "assigned" ? "active" : ""
                      }`}
                      onClick={() => setSelectedGuild("assigned")}
                    >
                      Assigned {"(" + assignGuildNFTCount + ")"}
                    </div>

                    <div
                      role={"button"}
                      className={`rounded-pill ps-3 pe-3 pt-1 pb-1 top-activity-filter-pill ${
                        selectedguild === "unassigned" ? "active" : ""
                      }`}
                      onClick={() => setSelectedGuild("unassigned")}
                    >
                      Unassigned {"(" + unAssignGuildNFTCount + ")"}
                    </div>
                  </>
                </div>
                <div className="py-2 search-block">
                  {selectedguild === "unassigned" && (
                    <div className="filt-flex-search ">
                      <input
                        type="text"
                        value={search}
                        className="search-box-add guild"
                        placeholder="Search here"
                        onKeyPress={handleKeyPressEvent}
                        onChange={(e) => sendSeacrhFilter(e)}
                      />{" "}
                      <span
                        role="button"
                        className="search-button"
                        onClick={() => handleTextSearch}
                      >
                        <BiSearch size={15} />
                      </span>
                      {search && (
                        <span
                          role="button"
                          className="search-close-button"
                          onClick={() => {
                            setSearch("");
                            handleTextSearch(true);
                          }}
                        >
                          <AiOutlineClose size={15} />
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          </div>
        </div>
      </div>

      <>
        <>
          {" "}
          <>
            {" "}
            {selectedguild === "unassigned" && (
              <div className="gap-2 p-2 d-flex">
                <Dropdown autoClose={["inside", "outside"]}>
                  <Dropdown.Toggle
                    align="start"
                    drop="start"
                    as={RoleDropdown}
                  ></Dropdown.Toggle>

                  <Dropdown.Menu align="start">
                    {filter.role.map((obj, i) => (
                      <Dropdown.Item
                        key={`nft-${obj?.checked}-${i}`}
                        as="button"
                        color={"#000"}
                        onClick={() => handleGuildFilter(obj, "nft_role")}
                      >
                        <FaCheckCircle
                          fill={obj.checked ? "#F47411" : "#898989"}
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
                    as={nftCollectionDropDown}
                  ></Dropdown.Toggle>

                  <Dropdown.Menu align="start">
                    {filter?.nftCollection.map((obj, i) => (
                      <Dropdown.Item
                        key={`nft-${obj?.checked}-${i}`}
                        as="button"
                        color={"#000"}
                        onClick={() => handleGuildFilter(obj, "nft_collection")}
                      >
                        <FaCheckCircle
                          fill={obj.checked ? "#F47411" : "#898989"}
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

                  <Dropdown.Menu align="start" className="nftLevel-dropdown">
                    {filter.level.map((obj, i) => (
                      <Dropdown.Item
                        key={`nft-${obj?.checked}-${i}`}
                        as="button"
                        color={"#000"}
                        onClick={() => handleGuildFilter(obj, "nft_level")}
                      >
                        <FaCheckCircle
                          fill={obj.checked ? "#F47411" : "#898989"}
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
                    as={saleTypeDropdown}
                  ></Dropdown.Toggle>

                  <Dropdown.Menu align="start">
                    {filter?.owned.map((obj, i) => (
                      <Dropdown.Item
                        key={`nft-${obj?.checked}-${i}`}
                        as="button"
                        onClick={() => handleGuildFilter(obj, "owned")}
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
              </div>
            )}
            {selectedguild == "assigned" &&
              filteredAssignGuildNFTCount !== 0 && (
                <div className="d-flex align-items-center text-dark fs-6 fw-bold">
                  {`Filtered NFTs (${filteredAssignGuildNFTCount})`}
                </div>
              )}
            {selectedguild === "unassigned" && filtersUnAssignApplied && (
              <div className="flex-wrap gap-2 p-2 mb-3 w-100 d-flex">
                {filtersUnAssignApplied &&
                  selectedguild == "unassigned" &&
                  filteredUnAssignGuildNFTCount !== 0 && (
                    <div className="d-flex align-items-center text-dark fs-6 fw-bold">
                      {`Filtered NFTs (${filteredUnAssignGuildNFTCount})`}
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
                        onClick={() => handleGuildFilter(obj, "owned", true)}
                      />
                    </div>
                  ))}
                {filter.nftCollection
                  .filter((xx) => xx?.checked === true)
                  .map((obj, i) => (
                    <div
                      key={`filter-pill${i}`}
                      role={"button"}
                      className="text-white bg-opacity-75 badge badge-pill bg-secondary text-dark fs-6 rounded-pill bg-hover-dark"
                    >
                      {obj?.name}
                      <BiX
                        role="button"
                        size={18}
                        onClick={() =>
                          handleGuildFilter(obj, "nft_collection", true)
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
                      className="text-white bg-opacity-75 badge badge-pill bg-secondary text-dark fs-6 rounded-pill bg-hover-dark"
                    >
                      {obj?.name}
                      <BiX
                        role="button"
                        size={18}
                        onClick={() =>
                          handleGuildFilter(obj, "nft_level", true)
                        }
                      />
                    </div>
                  ))}
                {filter.role
                  .filter((xx) => xx?.checked === true)
                  .map((obj, i) => (
                    <div
                      key={`filter-pill${i}`}
                      role={"button"}
                      className="text-white bg-opacity-75 badge badge-pill bg-secondary text-dark fs-6 rounded-pill bg-hover-dark"
                    >
                      {obj?.name}
                      <BiX
                        role="button"
                        size={18}
                        onClick={() =>
                          handleGuildFilter(obj, "nft_level", true)
                        }
                      />
                    </div>
                  ))}
              </div>
            )}
          </>
          <GuildNfts
            selectedguild={selectedguild}
            assignGuildNFTsList={assignGuildNFTsList}
            assignGuildNFTs={assignGuildNFTs}
            loadMoreAssignGuildNFTs={loadMoreAssignGuildNFTs}
            getUserAssignGuildNFTs={getUserAssignGuildNFTs}
            getUserUnAssignGuildNFTs={getUserUnAssignGuildNFTs}
            moreLoadingAssign={moreLoadingAssign}
            assignGuildNftListLoading={assignGuildNftListLoading}
            filtersAssignApplied={filtersAssignApplied}
            unAssignGuildNFTsList={unAssignGuildNFTsList}
            unAssignGuildNFTs={unAssignGuildNFTs}
            moreLoadingUnAssign={moreLoadingUnAssign}
            loadMoreUnAssignGuildNFTs={loadMoreUnAssignGuildNFTs}
            unAssignGuildNftListLoading={unAssignGuildNftListLoading}
            filtersUnAssignApplied={filtersUnAssignApplied}
            guildUserMenuPermissionList={guildUserMenuPermissionList}
          />
        </>
      </>
    </>
  );
};

export default MclNfts;
