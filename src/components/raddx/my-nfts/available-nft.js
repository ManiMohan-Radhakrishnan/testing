import { useEffect, useRef, useState } from "react";
import { Offcanvas, Popover, OverlayTrigger } from "react-bootstrap";
import { toast } from "react-toastify";
import { BsArrowLeft } from "react-icons/bs";
import { BiX } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import Lottie from "lottie-react";

import {
  allowForRental,
  bundleSaleSplitApi,
  listBundleOnSale,
  userOwnedNFTsApi,
} from "../../../api/methods-marketplace";
import { GAMES } from "../../../utils/game-config";
import {
  currencyFormat,
  formattedBundlePrice,
  openWindowBlank,
} from "../../../utils/common";

import NFTCardList from "./nft-card-list";
import NoRecord from "./no-record";
import FilterSection from "../filter-section";
import BulkRent from "./bulk-rent";

import successAnim from "../../../images/jump-trade/json/Tick.json";
import failureAnim from "../../../images/jump-trade/json/Cancel.json";

import "./styles.scss";
import { FaCheckCircle } from "react-icons/fa";
import { useSelector } from "react-redux";

const AvailableNFT = ({ setActiveTab, hideMenus, setCount }) => {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState([]);

  const [selectedAll, setSelectedAll] = useState(false);

  const [disableRental, setDisableRental] = useState(true);

  const [loading, setLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);
  const [bundlePop, setBundlePop] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const [nextPage, setNextPage] = useState(false);
  const [page, setPage] = useState(1);
  const filtersRef = useRef({});
  const [selectAllDisabled, setSelectAllDisabled] = useState(false);

  const [isBulkRental, setIsBulkRental] = useState(false);

  useEffect(() => {
    list?.length === 0 && getList({ page });
  }, []);

  const getList = async ({
    page,
    filters = null,
    load = false,
    filterArePresent = false,
  }) => {
    if (filters) {
      filtersRef.current = filters;
    }
    try {
      if (load) {
        setMoreLoading(true);
      } else {
        setLoading(true);
      }
      const result = await userOwnedNFTsApi(page, {
        sale_kind: "",
        game_names: [GAMES.RADDX],
        ...filtersRef.current,
      });
      if (load) {
        setList([...list, ...result?.data?.data?.nfts]);
      } else {
        setList(result?.data?.data?.nfts);
      }
      if (filterArePresent) setFilterCount(result?.data?.data?.total_count);
      else setCount(result?.data?.data?.total_count);

      setNextPage(result?.data?.data?.next_page);

      if (load) {
        setMoreLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
      setLoading(false);
      setMoreLoading(false);
    }
  };

  const loadMore = async () => {
    getList({ page: page + 1, load: true, filterArePresent: true });
    setPage(page + 1);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      // setSelected(list?.map((nft) => nft?.slug));
      setSelected(
        list
          .filter(
            (nft) =>
              !nft?.allow_rent && nft?.core_statistics?.role?.value !== "Shot"
          )
          .map((nft) => nft?.slug)
      );
      setSelectedAll(true);
    } else {
      setSelected([]);
      setSelectedAll(false);
    }
  };

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

  const [selectedNft = ""] = selected;

  const buttonDisabled = list.some(
    (nft) => nft?.slug === selectedNft && nft?.is_on_sale
  );

  const popover = () => (
    <Popover>
      <Popover.Body>
        <p className="password-terms">
          You can only list one NFT for sale at a time.
        </p>
      </Popover.Body>
    </Popover>
  );

  const BundlePopover = () => (
    <Popover>
      <Popover.Body>
        <p className="password-terms">
          Please select 1 Land and 1 Building to list it for bundle sale.
        </p>
      </Popover.Body>
    </Popover>
  );

  const disablePopover = () => (
    <Popover>
      <Popover.Body>
        <p className="password-terms">
          Rental feature is in the closed beta testing phase. Launching soon for
          everyone. Thanks.
        </p>
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      <FilterSection
        onFilterChange={handleFilter}
        filteredNFTCount={filterCount}
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
                      {/* {selected?.length > 0 && (
                        <span>
                          <strong>
                            Selected NFTs :{" "}
                            {selectedAll ? "All" : selected?.length}
                          </strong>
                        </span>
                      )} */}
                      {/* {!selectAllDisabled && (
                        <>
                          <SelectAll
                            list={list}
                            selected={selected}
                            handleSelectAll={handleSelectAll}
                            disabledStatus={selectAllDisabled}
                            setSelectedAll={setSelectedAll}
                          />
                        </>
                      )} */}
                    </div>
                    <div className="mynft-card-list">
                      {list?.map((nft, i) => (
                        <NFTCardList
                          nft={nft}
                          key={i}
                          setSelected={setSelected}
                          setSelectedAll={setSelectedAll}
                          selected={selected}
                          allTab
                          hideCheckbox={!nft?.put_on_sale}
                          hideMenus={hideMenus}
                          navigation
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
                              disabled={moreLoading}
                              onClick={loadMore}
                            >
                              {moreLoading ? "Loading..." : "Load More"}
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

        {list?.length > 0 && (
          <div className={`btn-fixed ${hideMenus ? "hiddenMenu" : ""}`}>
            {!hideMenus && (
              <>
                {selected?.length > 1 ? (
                  <OverlayTrigger
                    trigger={["click"]}
                    rootClose={true}
                    placement="top"
                    overlay={popover()}
                  >
                    <button
                      className="btn btn-dark"
                      type="button"
                      disabled={selected?.length === 0 || selected.length > 1}
                    >
                      List For Sale
                    </button>
                  </OverlayTrigger>
                ) : (
                  <button
                    className="btn btn-dark"
                    type="button"
                    disabled={
                      selected?.length === 0 ||
                      selected?.length > 1 ||
                      buttonDisabled
                    }
                    onClick={() => {
                      if (selected?.length === 1) {
                        const [first] = selected;
                        first &&
                          openWindowBlank(
                            `${process.env.REACT_APP_MARKETPLACE_URL}/nft-marketplace/details/${first}`
                          );
                      }
                    }}
                  >
                    List For Sale
                  </button>
                )}
              </>
            )}
            {!hideMenus && (
              <>
                {selected?.length > 3 ||
                selected?.length === 1 ||
                list
                  .filter((obj) => selected.includes(obj.slug))
                  .filter((xx) => xx.core_statistics.role.value === "Car")
                  .length > 0 ||
                list
                  .filter((obj) => selected.includes(obj.slug))
                  .filter((xx) => xx.core_statistics.role.value === "Land")
                  .length > 1 ||
                list
                  .filter((obj) => selected.includes(obj.slug))
                  .filter((xx) => xx.core_statistics.role.value === "Building")
                  .length > 1 ? (
                  <OverlayTrigger
                    trigger={["click"]}
                    rootClose={true}
                    placement="top"
                    overlay={BundlePopover()}
                  >
                    <button
                      className="btn btn-dark"
                      type="button"
                      disabled={selected?.length === 0 || selected?.length >= 3}
                    >
                      List For Bundle Sale
                    </button>
                  </OverlayTrigger>
                ) : (
                  <button
                    className="btn btn-dark"
                    type="button"
                    disabled={selected?.length >= 3 || selected?.length <= 1}
                    onClick={() => {
                      setBundlePop(!bundlePop);
                    }}
                  >
                    List For Bundle Sale
                  </button>
                )}
              </>
            )}
          </div>
        )}
        <ListForBundle
          list={list}
          selected={selected}
          bundlePop={bundlePop}
          setBundlePop={setBundlePop}
          getList={getList}
          setSelected={setSelected}
        />
      </div>
    </>
  );
};

export default AvailableNFT;

const SelectAll = ({
  list,
  selected,
  handleSelectAll,
  setSelectedAll,
  disabledStatus,
}) => {
  if (
    selected.length &&
    selected.length ===
      list.filter(
        (nft) =>
          !nft?.allow_rent && nft?.core_statistics?.role?.value !== "Shot"
      )?.length
  ) {
    setSelectedAll(true);
  }

  return (
    <label className="d-flex align-items-center ms-auto">
      <input
        type="checkbox"
        checked={
          selected.length &&
          selected?.length ===
            list.filter(
              (nft) =>
                !nft?.allow_rent && nft?.core_statistics?.role?.value !== "Shot"
            )?.length
        }
        disabled={disabledStatus}
        onChange={handleSelectAll}
      />{" "}
      <span className="checked-img"></span>
      &nbsp; Select All
    </label>
  );
};

const ListForBundle = ({
  list,
  selected,
  bundlePop,
  setBundlePop,
  getList = () => {},
  setSelected,
}) => {
  const [modalType, setModalType] = useState("listedonsale");
  const [modalState, setModalState] = useState({});

  const onHide = () => {
    setModalState({});
    setModalType("listedonsale");
    setBundlePop(false);
  };

  const onHideSuccess = () => {
    setModalState({});
    setModalType("listedonsale");
    setBundlePop(false);
    setSelected([]);
    getList(1);
  };

  return (
    <Offcanvas
      show={bundlePop}
      onHide={onHide}
      placement="end"
      className="popup-wrapper-canvas-utcoin"
      backdrop={"true"}
    >
      {modalType === "listedonsale" ? (
        <ListedOnSaleModal
          list={list}
          selected={selected}
          setModalType={setModalType}
          setModalState={setModalState}
          onHide={onHide}
        />
      ) : modalType === "confirmed" ? (
        <ConfirmedModal
          list={list}
          selected={selected}
          setModalType={setModalType}
          modalState={modalState}
          setModalState={modalState}
          onHide={onHide}
        />
      ) : modalType === "success" ? (
        <SuccessModal list={list} selected={selected} onHide={onHideSuccess} />
      ) : (
        <></>
      )}
    </Offcanvas>
  );
};

const ListedOnSaleModal = ({
  list = [],
  selected = [],
  setModalType,
  setModalState,
  onHide = () => {},
}) => {
  const [totalSum, setTotalSum] = useState(0);
  const [nftPrices, setNftPrices] = useState({});

  const isSaleDisabled =
    totalSum <= 0 ||
    Object.values(nftPrices).length !== selected.length ||
    Object.values(nftPrices).some((nft_price) => !nft_price);

  const [btnSaleDisable, setBtnSaleDisable] = useState(false);

  const handleNftPriceChange = (slug, NFTvalue) => {
    let floatValue = parseFloat(NFTvalue);
    let nft_price =
      NFTvalue.length <= process.env.REACT_APP_AMOUNT_MAX_LENGTH && floatValue
        ? floatValue
        : "";
    setNftPrices({ ...nftPrices, [slug]: nft_price });
  };

  useEffect(() => {
    let nft_maxBuildingPrice = false;
    let nft_maxLandPrice = false;

    for (const [key, value] of Object.entries(nftPrices)) {
      let roleValue = list.find((e) => e.slug == key)?.core_statistics?.role
        ?.value;
      if (roleValue == "Land") {
        nft_maxLandPrice = value >= process.env.REACT_APP_MAX_AMOUNT_LAND;
      } else if (roleValue == "Building") {
        nft_maxBuildingPrice =
          value >= process.env.REACT_APP_MAX_AMOUNT_BUILDING;
      }

      if (nft_maxLandPrice && nft_maxBuildingPrice) {
        setBtnSaleDisable(true);
      } else {
        setBtnSaleDisable(false);
      }
    }
  }, [nftPrices]);

  const handleBundleSale = () => {
    if (totalSum <= 0) return;

    let bundle = Object.keys(nftPrices).reduce((acc, curr) => {
      let request = {
        nft_slug: curr,
        buy_amount: nftPrices[curr],
        is_buy: true,
        is_bid: false,
      };
      return [...acc, request];
    }, []);

    handleSplitBundle(bundle);
  };

  const handleSplitBundle = async (bundle) => {
    try {
      if (selected?.length >= 2) {
        let response = await bundleSaleSplitApi(
          selected[0],
          nftPrices[selected[0]],
          selected[1],
          nftPrices[selected[1]]
        );

        if (response?.status === 200) {
          // let amountData = response?.data?.data;
          // let sub_total = amountData?.buy_amount;
          // let service_fee = amountData?.buy_amount;
          // let tds = amountData?.buy_amount;
          // let service_fee_amount = amountData?.buy_amount;
          // let tds_fee_amount = amountData?.buy_amount;
          // let artist_fee = amountData?.buy_amount;
          // let artist_fee_amount = amountData?.buy_amount;

          // let total = amountData?.total_price;
          // let paymentInfo = { sub_total, total };
          let paymentInfo = response?.data?.data;

          setModalState({ bundle, paymentInfo });
          setModalType("confirmed");
        } else
          toast.error(
            "Unable to list bundle for sale. Please try again after sometime"
          );
      }
    } catch (error) {
      console.log("error", error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    let total = Object.values(nftPrices).reduce((acc, curr) => acc + curr, 0);
    setTotalSum(total * 1);
  }, [nftPrices]);

  return (
    <Offcanvas.Body className="bundle-body-container">
      <div className="bundle-nft-details">
        <div className="bundle-head-content">
          <div className="bundle-title">
            <h6 className="bundle-main-title">
              List for Bundle sale
              {selected?.length > 0 && (
                <span>
                  <strong>Selected NFTs : {selected?.length}</strong>
                </span>
              )}
            </h6>
            <h2>
              <IoMdClose onClick={onHide} className="cancel-btn close-btn" />
            </h2>
          </div>
        </div>

        {list?.length > 0 && selected?.length > 0 && (
          <div className="bundle-body-content">
            {list
              ?.filter((obj) => selected?.includes(obj?.slug))
              ?.map((nft, i) => (
                <NFTCardList
                  nft={nft}
                  key={i}
                  hideCheckbox
                  hideMenus
                  showInput
                  nftPrices={nftPrices}
                  handleNftPriceChange={handleNftPriceChange}
                />
              ))}
          </div>
        )}
      </div>
      <div className="sticky-bottom-box">
        {totalSum > 0 ? (
          <div className="bundle-total-value">
            <h4>
              <span className="key">Total Price :</span>
              <span className="value">${totalSum}</span>
            </h4>
          </div>
        ) : (
          <></>
        )}
        <button
          className="btn btn-dark"
          type="button"
          disabled={isSaleDisabled ? true : btnSaleDisable ? false : true}
          onClick={handleBundleSale}
        >
          {btnSaleDisable ? "Continue" : `Min Amount  is required`}

          {/* {btnSaleDisable
            ? "Continue"
            : `Min Land Amount ${currencyFormat(
                process.env.REACT_APP_MAX_AMOUNT_LAND
              )} & Min Building Amount ${currencyFormat(
                process.env.REACT_APP_MAX_AMOUNT_BUILDING,
                "USD"
              )} is required`} */}
        </button>
      </div>
    </Offcanvas.Body>
  );
};

const ConfirmedModal = ({
  list = [],
  selected = [],
  setModalType,
  modalState,
  setModalState,
  onHide = () => {},
}) => {
  const { user } = useSelector((state) => state);
  let { bundle, paymentInfo } = modalState;

  const handleBundleSale = async () => {
    try {
      let response = await listBundleOnSale({ bundle });
      if (response?.status === 200) {
        setModalType("success");
        setModalState({});
      } else
        toast.error(
          "Unable to list bundle for sale. Please try again after sometime"
        );
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <Offcanvas.Body className="bundle-body-container bundle-confirm-popup">
      <div className="bundle-nft-details">
        <div className="bundle-head-content">
          <div className="bundle-title">
            <h6 className="bundle-main-title">
              Confirm the Bundle Listing
              {selected?.length > 0 && (
                <span>
                  <strong>Selected NFTs : {selected?.length}</strong>
                </span>
              )}
            </h6>
            <h2>
              <IoMdClose onClick={onHide} className="cancel-btn close-btn" />
            </h2>
          </div>
        </div>

        {list?.length > 0 && selected?.length > 0 && (
          <div className="bundle-body-content">
            <div className="confirm-card-list">
              {list
                ?.filter((obj) => selected?.includes(obj?.slug))
                ?.map((nft, i) => (
                  <NFTCardList
                    nft={nft}
                    key={i}
                    hideCheckbox
                    hideMenus
                    hideStats
                    navigation
                  />
                ))}
            </div>

            <div className="confirm-bundle-amount">
              <ul>
                <li>
                  <span className="key">Type</span>
                  <span className="value">Buy</span>
                </li>
                <li>
                  <span className="key">Buy Amount</span>
                  <span className="value">${paymentInfo?.buy_amount}</span>
                </li>
                <li>
                  <span className="key">Artist Fee</span>
                  <span className="value">${paymentInfo?.artist_amount}</span>
                </li>
                <li>
                  <span className="key">
                    Service Fee ({paymentInfo?.service} %)
                  </span>
                  <span className="value">${paymentInfo?.service_amount}</span>
                </li>
                {user?.data?.user?.apply_sale_tds && (
                  <li>
                    <span className="key">TDS ({paymentInfo?.tds_fee} %)</span>
                    <span className="value">${paymentInfo?.tds_amount}</span>
                  </li>
                )}
              </ul>
              <h5 className="confirm-msg">Are you sure want to Continue ?</h5>
            </div>
          </div>
        )}
      </div>
      <div className="sticky-bottom-box">
        <div className="bundle-total-value">
          <h4>
            <span className="key">Total price</span>
            <span className="value">${paymentInfo?.total_price}</span>
          </h4>
        </div>
        <button
          className="btn btn-dark"
          type="button"
          onClick={handleBundleSale}
        >
          Confirm
        </button>
      </div>
    </Offcanvas.Body>
  );
};

const SuccessModal = ({ list = [], selected = [], onHide = () => {} }) => {
  return (
    <Offcanvas.Body className="bundle-body-container bundle-success-popup">
      <div className="bundle-nft-details">
        <div className="bundle-head-content">
          <div className="bundle-title">
            <h6 className="bundle-main-title">Bundle Listing Successful</h6>
            <h2>
              <IoMdClose onClick={onHide} className="cancel-btn close-btn" />
            </h2>
          </div>
        </div>

        {list?.length > 0 && selected?.length > 0 && (
          <div className="bundle-body-content">
            <div className="bundle-success-content">
              <FaCheckCircle color={"#4caf50"} size={60} />
              <h4>Your Bundled NFTs have been listed for sale.</h4>
            </div>
            <div className="confirm-card-list">
              {list
                ?.filter((obj) => selected?.includes(obj?.slug))
                ?.map((nft, i) => (
                  <NFTCardList
                    nft={nft}
                    key={i}
                    hideCheckbox
                    hideStats
                    navigation
                  />
                ))}
            </div>
          </div>
        )}
      </div>
      <div className="sticky-bottom-box">
        <button className="btn btn-dark" type="button" onClick={onHide}>
          Go to My NFTs
        </button>
      </div>
    </Offcanvas.Body>
  );
};
