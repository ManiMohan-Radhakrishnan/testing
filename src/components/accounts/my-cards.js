import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { FaCheckCircle } from "react-icons/fa";
import { Dropdown } from "react-bootstrap";
import { BiCaretDown, BiX } from "react-icons/bi";
import {
  upgradableCardLogs,
  upgradableCardsApi,
  upgradableNFTsApiFilter,
} from "../../api/methods-marketplace";
import NFTUpgrade from "../nft-upgrade/index";
import PlayerCard from "../player-card/index";
import HistoryCard from "../history-card/index";

const MyCards = () => {
  const [key, setKey] = useState("cards");
  const [loading, setLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);
  const [ownedSearch, setOwnedSearch] = useState("");
  const [ownedNFTCount, setOwnedNFTCount] = useState(0);
  const [filteredNFTCount, setFilteredNFTCount] = useState(0);
  const [nftList, setNFTList] = useState([]);
  const [nftData, setNFTData] = useState({});
  const [cardList, setCardList] = useState([]);
  const [nftPage, setNftPage] = useState(1);
  const [cardsPage, setCardsPage] = useState(1);
  const [cardData, setCardData] = useState({});
  const [ownPage, setOwnPage] = useState(1);
  const [logs, setLogs] = useState([]);
  const [logData, setLogData] = useState({});
  const [logPage, setLogPage] = useState(1);

  const [filter, setFilter] = useState({
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
  });
  // const [filtersApplied, setFiltersApplied] = useState(false);

  const [apiFilterList, setApiFilterList] = useState(() => ({
    nft_collection: [],
    nft_level: [],
  }));

  const nftCollectionDropDown = React.forwardRef(({ onClick }, ref) => (
    <div
      className={`badge badge-pill text-dark fs-6 border border-dark rounded-pill ${
        apiFilterList.nft_collection.length > 0 ? "filter_active" : ""
      }`}
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
      className={`badge badge-pill text-dark fs-6 border border-dark rounded-pill ${
        apiFilterList.nft_level.length > 0 ? "filter_active" : ""
      }`}
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

  const handleFilter = (input, type, remove = false) => {
    const info = { ...filter };
    // const filters = { ...apiFilterList };
    let nft_collection = [];
    let nft_level = [];

    switch (type) {
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
      default:
    }
    info.nftCollection.map((obj) => {
      if (obj?.checked === true) nft_collection.push(obj?.value);
    });
    info.level.map((obj) => {
      if (obj?.checked === true) nft_level.push(obj?.value);
    });
    setFilter({ ...info });
    setOwnPage(1);
    setApiFilterList({
      nft_collection,
      nft_level,
    });
  };

  useEffect(() => {
    getUpgradableCards(1);
    getUpgradableNFTs(1);
    getCardLogs(1);
  }, []);

  useEffect(() => {
    // setFiltersApplied(checkIfFiltersArePresent());
    getUpgradableNFTs(1);
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

  const getUpgradableCards = async (page) => {
    try {
      setLoading(true);
      const result = await upgradableCardsApi(page);
      setCardData(result.data.data);
      setCardList(result.data.data.cards);
      setLoading(false);

      if (result.data.data.total_count > 0) {
        setKey("cards");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getUpgradableNFTs = async (page) => {
    try {
      setLoading(true);
      const result = await upgradableNFTsApiFilter(page ? page : ownPage, {
        ...apiFilterList,
      });
      if (!checkIfFiltersArePresent()) {
        setOwnedNFTCount(result.data.data.total_count);
      } else {
        setFilteredNFTCount(result.data.data.total_count);
      }
      setNFTData(result.data.data);
      setNFTList(result.data.data.nfts);
      setLoading(false);
      if (result.data.data.total_count > 0) {
        setKey("nfts");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getMoreUpgradableNFTs = async (page) => {
    try {
      setMoreLoading(true);
      const result = await upgradableNFTsApiFilter(page ? page : ownPage, {
        ...apiFilterList,
      });
      if (!checkIfFiltersArePresent()) {
        setOwnedNFTCount(result.data.data.total_count);
      } else {
        setFilteredNFTCount(result.data.data.total_count);
      }
      setNFTData(result.data.data);
      setNFTList([...nftList, ...result.data.data.nfts]);
      setMoreLoading(false);
    } catch (error) {
      console.log(error);
      setMoreLoading(false);
    }
  };

  const getCardLogs = async (page) => {
    try {
      setLoading(true);
      const result = await upgradableCardLogs(page);
      setLogData(result?.data?.data);
      setLogs([...logs, ...result?.data?.data?.card_history]);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const loadMoreUpgradableNFTs = () => {
    if (nftData.next_page) {
      getMoreUpgradableNFTs(nftPage + 1);
      setNftPage(nftPage + 1);
    }
  };
  const loadMoreUpgradableCards = () => {
    if (nftData.next_page) {
      getUpgradableCards(cardsPage + 1);
      setCardsPage(cardsPage + 1);
    }
  };
  const loadMoreCardLogs = () => {
    if (logData.next_page) {
      getCardLogs(logPage + 1);
      setLogPage(logPage + 1);
    }
  };

  return (
    <>
      <div className="main-content-block">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="wallet-user mt-3 p-0">
                <div className="row align-items-center">
                  <div className="col-lg-12">
                    <h3 className="about-title">My Card Collections</h3>
                  </div>
                </div>
                <div className="mycard-head">
                  <div className="flex-block-pill mt-3">
                    <div
                      role={"button"}
                      className={`rounded-pill ps-3 pe-3 mb-3 me-3 pt-1 pb-1 activity-filter-pill ${
                        key === "nfts" ? "active" : ""
                      }`}
                      onClick={() => setKey("nfts")}
                    >
                      {key === "nfts" && (
                        <FaCheckCircle
                          color={"white"}
                          size={17}
                          className="me-2"
                        />
                      )}
                      Upgradable NFTs
                    </div>
                    <div
                      role={"button"}
                      className={`rounded-pill ps-3 pe-3 mb-3 me-3 pt-1 pb-1 activity-filter-pill ${
                        key === "cards" ? "active" : ""
                      }`}
                      onClick={() => setKey("cards")}
                    >
                      {key === "cards" && (
                        <FaCheckCircle
                          color={"white"}
                          size={17}
                          className="me-2"
                        />
                      )}
                      Available Upgrades
                    </div>
                    <div
                      role={"button"}
                      className={`rounded-pill ps-3 pe-3 mb-3 me-3 pt-1 pb-1 activity-filter-pill ${
                        key === "logs" ? "active" : ""
                      }`}
                      onClick={() => setKey("logs")}
                    >
                      {key === "logs" && (
                        <FaCheckCircle
                          color={"white"}
                          size={17}
                          className="me-2"
                        />
                      )}
                      Cards History
                    </div>
                  </div>
                  {key === "nfts" ? (
                    <div className="d-flex gap-2">
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
                              onClick={() =>
                                handleFilter(obj, "nft_collection")
                              }
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
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
          {key === "cards" ? (
            <>
              <PlayerCard list={cardList} data={cardData} />
              {cardData?.next_page && (
                <div className="d-flex justify-content-center w-100">
                  <button
                    className="btn btn-outline-dark w-50 h-25 text-center rounded-pill mt-2 mb-3 "
                    type="button"
                    disabled={moreLoading}
                    onClick={loadMoreUpgradableCards}
                  >
                    {moreLoading ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </>
          ) : key === "nfts" ? (
            <>
              {loading ? (
                <h5 className="text-center mt-3">Loading...</h5>
              ) : (
                <>
                  {filter.nftCollection && (
                    <div className="w-100 d-flex gap-2 p-2 mb-3 flex-wrap">
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
                    </div>
                  )}
                  <NFTUpgrade list={nftList} data={nftData} />
                </>
              )}

              {nftData?.next_page && (
                <div className="d-flex justify-content-center w-100">
                  <button
                    className="btn btn-outline-dark w-50 h-25 text-center rounded-pill mt-2 mb-3 "
                    type="button"
                    disabled={moreLoading}
                    onClick={loadMoreUpgradableNFTs}
                  >
                    {moreLoading ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </>
          ) : (
            key === "logs" && (
              <>
                {loading ? (
                  <h5 className="text-center mt-3">Loading...</h5>
                ) : (
                  <>
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col-12">
                          <div className="card-history-list">
                            <HistoryCard
                              logs={logs}
                              logData={logData}
                              dayjs={dayjs}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {logData?.next_page && (
                  <div className="d-flex justify-content-center w-100">
                    <button
                      className="btn btn-outline-dark w-50 h-25 text-center rounded-pill mt-2 mb-3 "
                      type="button"
                      disabled={loading}
                      onClick={loadMoreCardLogs}
                    >
                      {loading ? "Loading..." : "Load More"}
                    </button>
                  </div>
                )}
              </>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default MyCards;
