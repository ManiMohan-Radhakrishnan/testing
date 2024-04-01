import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Offcanvas, Popover, OverlayTrigger, Dropdown } from "react-bootstrap";
import image from "../../../images/nft-card.png";
import { GoPlus } from "react-icons/go";
import Lottie from "lottie-react";
import successAnim from "../../../images/jump-trade/json/Tick.json";
import "./style.scss";
import { fuseNFTApi, userOwnedNFTsApi } from "../../../api/methods-marketplace";
import { GAMES } from "../../../utils/game-config";
import { BiCaretDown } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";
import { AiFillCloseCircle } from "react-icons/ai";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
const popover = () => (
  <Popover>
    <Popover.Body>
      <p className="password-terms">Selected NFT not a fusor category ...</p>
    </Popover.Body>
  </Popover>
);

const FusorPopup = ({
  hideMenus = false,
  setFusorNftPopup,
  fusorNftPopup,
  fusorSlug,
  fusorDetails,
  Reload = () => {},
}) => {
  const history = useHistory();
  const [popupData, setPopupData] = useState("initial");
  const [fusorNftList, setFusorNftList] = useState([]);
  const [nextPage, setNextPage] = useState(false);
  const [selectedNft, setSelectedNft] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [checked, setChecked] = useState(false);
  const [loadFuse, setLoadFuse] = useState(false);

  const [selectedItems, setSelcetedItems] = useState([]);

  const [filterStatus, setFilterStatus] = useState({});
  const [afterFuseList, setAfterFuseList] = useState([]);

  const [filter, setFilter] = useState({
    category: [
      { name: "Batsman", value: "Batsman", checked: false },
      { name: "Bowler", value: "Bowler", checked: false },
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
    ],
  });

  const handleTab = (tab) => {
    setPopupData(tab);
  };

  const handleCheckNft = () => {
    if (
      selectedItems?.find(
        (obj) =>
          obj?.core_statistics?.category?.value ===
          fusorDetails?.core_statistics?.category.value
      )
    ) {
      return true;
    } else {
      toast.error(
        "The category of at least one NFT selected for Fusion should be the same as the Fusor category."
      );
      return false;
    }
  };

  useEffect(() => {
    fusorNftPopup &&
      getFusorNftList(1, {
        nft_collection: [],
        nft_category: ["Batsman", "Bowler"],
      });
  }, [fusorNftPopup]);

  const getFusorNftList = async (page = 1, filter) => {
    try {
      setLoading(true);
      const result = await userOwnedNFTsApi(
        page,
        {
          ...filter,
          game_names: [GAMES.MCL],
          sale_kind: "not_on_sale",
          allow_rent: false,
        },
        fusorSlug
      );
      setLoading(false);
      setFilterStatus({ ...filter });
      setFusorNftList(result?.data?.data?.nfts);
      setNextPage(result?.data?.data?.next_page);
    } catch (error) {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    try {
      const result = await userOwnedNFTsApi(
        pageNo + 1,
        { ...filterStatus, game_names: [GAMES.MCL], sale_kind: "not_on_sale" },
        fusorSlug
      );
      setPageNo(pageNo + 1);
      setNextPage(result?.data?.data?.next_page);
      setFusorNftList([...fusorNftList, ...result?.data?.data?.nfts]);
    } catch (error) {}
  };

  const handleSelectedNft = (slug) => {
    let selectedNftTemp = selectedNft;
    if (selectedNftTemp?.includes(slug)) {
      selectedNftTemp.splice(selectedNftTemp.indexOf(slug), 1);
      selectedItemsFind(slug, "remove");
    } else {
      selectedNftTemp?.push(slug);
      selectedItemsFind(slug, "add");
    }
    setSelectedNft([...selectedNftTemp]);
  };

  const selectedItemsFind = (slug, type = "add") => {
    let selectedItemsTemp = [...selectedItems];
    if (type === "add")
      selectedItemsTemp?.push(fusorNftList?.find((obj) => obj.slug === slug));
    else
      selectedItemsTemp?.splice(
        selectedItemsTemp?.findIndex((obj) => obj.slug === slug),
        1
      );
    setSelcetedItems([...selectedItemsTemp]);
  };

  const handleFilter = (input, type, filterType = "single") => {
    let remove = false;
    console.log(input, type);
    const info = { ...filter };

    let nft_collection = [];
    let nft_category = [];

    let filterArePresent = false;
    if (filterType !== "single") {
      switch (type) {
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
        default:
      }
    } else {
      switch (type) {
        case "nft_category":
          info.category = filter.category.map((obj) => {
            let checked = input?.value === obj?.value ? true : false;
            return {
              ...obj,
              checked,
            };
          });
          break;
        case "nft_collection":
          info.nftCollection = filter.nftCollection.map((obj) => {
            let checked = input?.value === obj?.value ? true : false;
            return {
              ...obj,
              checked,
            };
          });
          break;
        default:
      }
    }

    info.nftCollection.map((obj) => {
      if (obj?.checked === true) nft_collection.push(obj?.value);
    });
    info.category.map((obj) => {
      if (obj?.checked === true) nft_category.push(obj?.value);
    });

    setFilter({ ...info });
    let page = 1;

    if (nft_collection.length > 0 || nft_category.length > 0) {
      // setFiltersApplied(true);
      filterArePresent = true;
    } else {
      // setFiltersApplied(false);
      filterArePresent = false;
    }

    let filters = {
      nft_collection: nft_collection,
      nft_category: nft_category,
    };
    getFusorNftList(page, filters);
  };

  const fuseTheNft = async () => {
    try {
      setLoadFuse(true);
      const result = await fuseNFTApi({
        nft: {
          nft_ids: selectedNft,
          fusor_id: fusorDetails?.slug,
        },
      });
      setLoadFuse(false);
      setPopupData("final");
      setAfterFuseList(result?.data?.data?.nft);
      console.log("DataResponse", result);
    } catch (error) {
      setLoadFuse(false);
      toast.error(error?.response.data?.message);
    }
  };

  const handleRedirect = () => {
    if (hideMenus) {
      window.open(
        `${process.env.REACT_APP_ACCOUNTS_URL}/accounts/mynft`,
        "_self"
      );
    } else {
      history.push("/accounts/mynft");
      setFusorNftPopup(false);
      Reload();
    }
  };

  return (
    <Offcanvas
      show={fusorNftPopup}
      onHide={() => {
        setFusorNftPopup(!fusorNftPopup);
        setPopupData("initial");
      }}
      placement="end"
      className="popup-wrapper-canvas-fusorNft"
      backdrop={"true"}
    >
      <Offcanvas.Body className="p-0 pop-body-container-fusorNft">
        <>
          <div className="pop-nft-details-fusorNft">
            <div className="pop-head-content-fusorNft">
              <div className="pop-bid-title-fusorNft">
                {(() => {
                  if (popupData === "initial") return "Start Fusion";
                  if (popupData === "confirm") return "Fusion Preview";
                  else return "Fusion Completed";
                })()}
              </div>
              <div
                className="close-button-pop-fusorNft"
                onClick={() => {
                  setFusorNftPopup(!fusorNftPopup);
                  setPopupData("initial");
                }}
              >
                {!hideMenus && (
                  <img
                    alt="close"
                    src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e"
                  ></img>
                )}
              </div>
            </div>
            {popupData && popupData == "initial" && (
              <div className={`pop-bid-progress-fusorNft p-3`}>
                <div className="d-flex align-items-start justify-content-center fesur-c__wrapper">
                  <div className="card border-0 d-flex flex-column">
                    <div className="default-card">
                      {selectedItems[0]?.asset_url ? (
                        <>
                          <AiFillCloseCircle
                            className="close-icon"
                            onClick={() =>
                              handleSelectedNft(selectedItems[0]?.slug)
                            }
                          />
                          <img
                            src={selectedItems[0]?.asset_url}
                            alt="image"
                            className="img-fluid"
                          />
                        </>
                      ) : (
                        <div className="add-wrapper">
                          <div className="add-btn">
                            <GoPlus color="#000" />
                          </div>
                          <span>SELECT NFT</span>
                        </div>
                      )}
                    </div>
                    {selectedItems.length > 0 && (
                      <>
                        <span className="selected-name">
                          {" "}
                          {selectedItems[0]?.name}
                        </span>
                        <span className="selected-category">
                          LEVEL{" "}
                          {selectedItems[0]?.core_statistics?.level?.value} |{" "}
                          {selectedItems[0]?.core_statistics?.category?.value} |{" "}
                          {selectedItems[0]?.core_statistics?.role?.value}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="p-icon">
                    <GoPlus color="#000" />
                  </div>

                  <div className="card border-0 d-flex flex-column">
                    <div className="default-card ">
                      {selectedItems[1]?.asset_url ? (
                        <>
                          <AiFillCloseCircle
                            className="close-icon"
                            onClick={() =>
                              handleSelectedNft(selectedItems[1]?.slug)
                            }
                          />
                          <img
                            src={selectedItems[1]?.asset_url}
                            alt="image"
                            className="img-fluid"
                          />
                        </>
                      ) : (
                        <div className="add-wrapper">
                          <div className="add-btn">
                            <GoPlus color="#000" />
                          </div>
                          <span>SELECT NFT</span>
                        </div>
                      )}
                    </div>
                    {selectedItems.length > 1 && (
                      <>
                        <span className="selected-name">
                          {" "}
                          {selectedItems[1]?.name}
                        </span>
                        <span className="selected-category">
                          LEVEL{" "}
                          {selectedItems[1]?.core_statistics?.level?.value} |{" "}
                          {selectedItems[1]?.core_statistics?.category?.value} |{" "}
                          {selectedItems[1]?.core_statistics?.role?.value}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="line"></div>

                  <div className="card border-0 d-flex flex-column">
                    <div className="default-card fuser-card">
                      <img
                        src={fusorDetails?.asset_url || image}
                        alt="image"
                        className="img-fluid"
                      />
                    </div>
                    <span className="selected-name">
                      Fuser | {fusorDetails?.name}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {popupData && popupData == "initial" && (
              <div className="pop-body-content-fusorNft p-3">
                <div className="fusorNft-list__wrapper">
                  <div className="fuserNft-filter__wrapper d-md-flex align-items-center my-1">
                    <h6 className="myNft-title my-2">My NFTs</h6>
                    <div className="select-area">
                      <select
                        class="form-select"
                        aria-label="Default select example"
                        onChange={(e) =>
                          handleFilter(
                            filter?.category?.find(
                              (obj) => obj.value === e.target.value
                            ),
                            "nft_category",
                            "single"
                          )
                        }
                      >
                        <option selected> Role - All</option>

                        {filter?.category?.map((obj, i) => (
                          <option
                            onClick={(e) => console.log(e.target.value)}
                            onChange={(e) => console.log(e.target.value)}
                            value={obj.value}
                          >
                            {obj.value}
                          </option>
                        ))}
                      </select>
                      <select
                        class="form-select"
                        aria-label="Default select example"
                        onChange={(e) =>
                          handleFilter(
                            filter?.nftCollection?.find(
                              (obj) => obj.value === e.target.value
                            ),
                            "nft_collection",
                            "single"
                          )
                        }
                      >
                        <option selected>Category - All</option>
                        {filter?.nftCollection.map((obj, i) => (
                          <option value={obj.value}>{obj.value}</option>
                        ))}
                      </select>

                      {/* <Dropdown autoClose={["inside", "outside"]}>
                        <Dropdown.Toggle
                          align="start"
                          drop="start"
                          as={nftCategoryDropDown}
                        ></Dropdown.Toggle>

                        <Dropdown.Menu align="start">
                          <>
                            {" "}
                            {filter.category.map((obj, i) => (
                              <Dropdown.Item
                                key={`nft-${obj?.checked}-${i}`}
                                as="button"
                                color={"#000"}
                                onClick={() =>
                                  handleFilter(obj, "nft_category")
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
                          </>
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
                      </Dropdown> */}
                    </div>
                  </div>
                  <div className="row fusers-list m-0">
                    {fusorNftList?.length > 0 ? (
                      <>
                        {fusorNftList?.map((nft, index) => {
                          return (
                            <>
                              {nft?.core_statistics?.role?.value !==
                                "Fusor" && (
                                <div
                                  key={index + nft?.slug}
                                  className="col-md-6 right-line"
                                >
                                  <div className="card">
                                    <div className="card-image">
                                      <img
                                        src={nft?.asset_url}
                                        className="img-fluid"
                                        alt="image"
                                      />
                                    </div>
                                    <div className="content-box">
                                      <h6 className="nft-name">{nft?.name}</h6>
                                      <div className="icon" key={nft?.slug}>
                                        <Checkbox
                                          nft={nft}
                                          selected={selectedNft}
                                          className="rent-nft-card-select"
                                          handleChange={() =>
                                            handleSelectedNft(nft?.slug)
                                          }
                                        />
                                      </div>
                                      <p className="mb-0 stats-box">
                                        {" "}
                                        LEVEL{" "}
                                        {
                                          nft?.core_statistics?.level?.value
                                        } |{" "}
                                        {nft?.core_statistics?.category?.value}{" "}
                                        | {nft?.core_statistics?.role?.value}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </>
                          );
                        })}
                        <div className="col-12">
                          {nextPage && (
                            <button
                              className="btn btn-outline-dark text-center rounded-pill  my-3 loadmore-btn"
                              type="button"
                              disabled={loading}
                              onClick={loadMore}
                            >
                              {loading ? "Loading..." : "Load More"}
                            </button>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="no-record-found">
                          {loading ? "Loading..." : "No Records Found"}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {popupData && popupData == "confirm" && (
              <>
                {loadFuse ? (
                  <>
                    <div class="loading-wrapper">
                      <button>
                        Loading ...
                        <svg>
                          <rect x="1" y="1"></rect>
                        </svg>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="pop-body-content-fusorNft fuser-popup-wrapper p-3">
                      <div className="confirmation_popup">
                        <ul className="fusor-listed-nfts">
                          <li>
                            <div className="card">
                              <img
                                src={selectedItems[0]?.asset_url || image}
                                className="img-fluid"
                                alt="image"
                              />
                              <h6 className="nft-name">
                                {selectedItems[0]?.name}
                              </h6>

                              {selectedItems.length > 0 && (
                                <span>
                                  {" "}
                                  LEVEL{" "}
                                  {
                                    selectedItems[0]?.core_statistics?.level
                                      ?.value
                                  }{" "}
                                  |{" "}
                                  {
                                    selectedItems[0]?.core_statistics?.category
                                      ?.value
                                  }{" "}
                                  |{" "}
                                  {
                                    selectedItems[0]?.core_statistics?.role
                                      ?.value
                                  }
                                </span>
                              )}
                            </div>
                          </li>
                          <li>
                            <div className="card">
                              <img
                                src={selectedItems[1]?.asset_url || image}
                                className="img-fluid"
                                alt="image"
                              />
                              <h6 className="nft-name">
                                {selectedItems[1]?.name}
                              </h6>
                              {selectedItems.length > 1 && (
                                <span>
                                  {" "}
                                  LEVEL{" "}
                                  {
                                    selectedItems[1]?.core_statistics?.level
                                      ?.value
                                  }{" "}
                                  |{" "}
                                  {
                                    selectedItems[1]?.core_statistics?.category
                                      ?.value
                                  }{" "}
                                  |{" "}
                                  {
                                    selectedItems[1]?.core_statistics?.role
                                      ?.value
                                  }
                                </span>
                              )}
                            </div>
                          </li>
                          <li>
                            <div className="card">
                              <img
                                src={fusorDetails?.asset_url || image}
                                className="img-fluid"
                                alt="image"
                              />
                              <h6 className="nft-name">
                                {fusorDetails?.core_statistics?.role?.value}{" "}
                              </h6>
                              <span className="stats-box">
                                {fusorDetails?.core_statistics?.category?.value}{" "}
                                | {fusorDetails?.name}
                              </span>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {popupData && popupData == "final" && (
              <div className="pop-body-content-fusorNft fuser-popup-wrapper p-3">
                <div className="final-popup">
                  <Lottie
                    animationData={successAnim}
                    className={"lotti-icon"}
                  />
                  <h5>Fusion completed successfully!</h5>
                  <h5 className="mt-3">Your New NFTs!!!</h5>

                  <div className="confirmation_popup">
                    <ul className="fusor-listed-nfts">
                      <>
                        {afterFuseList?.map((items, index) => (
                          <li key={index}>
                            <div className="card">
                              <img
                                src={items.cover_url || image}
                                className="img-fluid"
                                alt="image"
                              />
                              <h6 className="nft-name">{items?.name}</h6>
                              <span>
                                {" "}
                                {items?.core_statistics?.level?.value !==
                                  null &&
                                items?.core_statistics?.level?.value !== 0 ? (
                                  `LEVEL ${items?.core_statistics?.level?.value} | `
                                ) : (
                                  <></>
                                )}
                                {items?.core_statistics?.category?.value !==
                                  null &&
                                  items?.core_statistics?.category?.value}{" "}
                                |{" "}
                                {items?.core_statistics?.role?.value &&
                                  items?.core_statistics?.role?.value}
                              </span>
                            </div>
                          </li>
                        ))}
                      </>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="sticky-bottom-box">
            {popupData && popupData == "initial" && (
              <div className="w-100">
                {/* <OverlayTrigger
                  trigger={["click"]}
                  rootClose={true}
                  placement="top"
                  overlay={popover()}
                > */}
                <button
                  className="btn btn-dark w-100"
                  onClick={() => {
                    handleCheckNft() && handleTab("confirm");
                  }}
                  type="button"
                  disabled={selectedNft?.length < 2}
                >
                  Continue
                </button>
                {/* </OverlayTrigger> */}
                <p className="hint">
                  * The category of at least one NFT selected for Fusion should
                  be the same as the Fusor category.
                </p>
              </div>
            )}

            {popupData && popupData == "confirm" && !loadFuse && (
              <div className="w-100 confirmation_button">
                <div className="row m-0">
                  <div className="col-12">
                    <div className="form-group mb-3  align-items-center d-flex">
                      {/* <input type="checkbox" role={"button"} />{" "} */}
                      <div className="fusor-check-terms-box">
                        <span>
                          <b>Terms:</b>
                          <br />
                          <ul>
                            {" "}
                            <li>
                              {" "}
                              1. MCL Premier Player, Special Shot, and Fielding
                              Action NFTs will be generated and assigned
                              randomly based on the supply.
                            </li>
                            <li>
                              {" "}
                              2. MCL Players and the Fusor will be burnt in the
                              Fusion process.
                            </li>
                          </ul>
                        </span>
                        <label htmlFor={`fusor-check-terms`}>
                          <input
                            type="checkbox"
                            role={"button"}
                            id={`fusor-check-terms`}
                            checked={checked}
                            onChange={() => setChecked(!checked)}
                          />
                          <span className="checked-img"></span>
                          <span className="checked-content">
                            {" "}
                            By proceeding further, I accept the above terms.
                            {/* <a
                              className="terms-link"
                              href={process.env.REACT_APP_TERMS_URL}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Terms & Conditions.
                            </a> */}
                          </span>
                        </label>
                      </div>
                      {/* <span className="mb-0 mx-2">
                        Please Accept Terms and condtion
                      </span>{" "} */}
                    </div>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col-4">
                    <button
                      className="btn btn-dark secondary"
                      onClick={() => handleTab("initial")}
                      type="button"
                    >
                      Back
                    </button>
                  </div>
                  <div className="col-8">
                    {/* <OverlayTrigger
                      trigger={["click"]}
                      rootClose={true}
                      placement="top"
                      overlay={popover()}
                    > */}
                    <button
                      className="btn btn-dark w-100"
                      onClick={() => fuseTheNft()}
                      type="button"
                      disabled={!checked}
                    >
                      Start Fusion
                    </button>
                    {/* </OverlayTrigger> */}
                  </div>
                </div>
              </div>
            )}

            {popupData && popupData == "final" && (
              <div className="w-100">
                {/* <OverlayTrigger
                  trigger={["click"]}
                  rootClose={true}
                  placement="top"
                  overlay={popover()}
                > */}
                <button
                  onClick={handleRedirect}
                  className="btn btn-dark w-100"
                  type="button"
                >
                  Go to My NFTs
                </button>
                {/* </OverlayTrigger> */}
              </div>
            )}
          </div>
        </>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default FusorPopup;

const Checkbox = ({ nft, selected, handleChange, className }) => {
  return (
    <label
      htmlFor={`nftSelect${nft}`}
      className={`${className}`}
      key={nft?.slug}
    >
      <input
        id={`nftSelect${nft}`}
        key={nft?.slug}
        type="checkbox"
        checked={selected?.includes(nft?.slug)}
        disabled={selected?.length === 2 && !selected?.includes(nft?.slug)}
      />
      <span
        className="checked-img"
        onClick={() => {
          (selected?.length < 2 || selected?.includes(nft?.slug)) &&
            handleChange(nft?.slug);
        }}
      ></span>
    </label>
  );
};

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
