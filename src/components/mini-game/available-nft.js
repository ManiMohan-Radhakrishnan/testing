import { useEffect, useRef, useState } from "react";
import { Offcanvas, Popover, OverlayTrigger } from "react-bootstrap";
import { toast } from "react-toastify";
import { BsArrowLeft } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import Lottie from "lottie-react";

import {
  allowForRental,
  userOwnedNFTsApi,
} from "../../api/methods-marketplace";

import NFTCardList from "./nft-card-list";
import NoRecord from "./no-record";
import BulkRent from "./bulk-rent";

import successAnim from "../../images/jump-trade/json/Tick.json";
import failureAnim from "../../images/jump-trade/json/Cancel.json";
import { openWindowBlank } from "../../utils/common";

import "./styles.scss";
import { BiX } from "react-icons/bi";
import { GAMES } from "../../utils/game-config";
import HurleyFilterSection from "./filter-section";

const AvailableNFT = ({ setActiveTab, hideMenus, setCount }) => {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState([]);

  const [selectedAll, setSelectedAll] = useState(false);

  const [disableRental, setDisableRental] = useState(false);

  const [loading, setLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);
  const [rentalPop, setRentalPop] = useState(false);
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
        game_names: [GAMES.MINI],
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
      setIsBulkRental(result?.data?.data?.bulk_rental ? true : false);
      if (load) {
        setMoreLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
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
      setSelected(list.map((nft) => nft?.slug));
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
      {/* <HurleyFilterSection
        onFilterChange={handleFilter}
        filteredNFTCount={filterCount}
      /> */}
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
                      {selectAllDisabled && (
                        <>
                          <SelectAll
                            list={list}
                            selected={selected}
                            handleSelectAll={handleSelectAll}
                            disabledStatus={selectAllDisabled}
                            setSelectedAll={setSelectedAll}
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
                          allTab
                          hideMenus={hideMenus}
                          navigation
                          // fusor={nft?.core_statistics?.role?.value === "Fusor"}
                          Reload={() => {
                            filtersRef.current = {};
                            getList({ page });
                          }}
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

        {!isBulkRental && list?.length > 0 && (
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
                      disabled={selected?.length === 0}
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

            {/* {disableRental ? (
              <OverlayTrigger
                trigger={["click"]}
                rootClose={true}
                placement="top"
                overlay={disablePopover()}
              >
                <button
                  className="btn btn-dark"
                  type="button"
                  disabled={selected?.length === 0}
                >
                  List For Renting Out
                </button>
              </OverlayTrigger>
            ) : (
              <button
                className="btn btn-dark"
                type="button"
                disabled={selected?.length === 0}
                onClick={() => setRentalPop(!rentalPop)}
              >
                List For Renting Out
              </button>
            )} */}
          </div>
        )}
        {/* <ListForRental
          list={list}
          selected={selected}
          selectedAll={selectedAll}
          rentalPop={rentalPop}
          setRentalPop={setRentalPop}
          setActiveTab={setActiveTab}
        /> */}
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
  if (selected.length && selected.length === list.length) {
    setSelectedAll(true);
  }

  return (
    <label className="d-flex align-items-center ms-auto">
      <input
        type="checkbox"
        checked={selected.length && selected.length === list.length}
        disabled={disabledStatus}
        onChange={handleSelectAll}
      />{" "}
      <span className="checked-img"></span>
      &nbsp; Select All
    </label>
  );
};

// const ListForRental = ({
//   list,
//   selected,
//   selectedAll,
//   rentalPop,
//   setRentalPop,
//   setActiveTab,
// }) => {
//   const [modalType, setModalType] = useState("");

//   return (
//     <Offcanvas
//       show={rentalPop}
//       onHide={() => setRentalPop(!rentalPop)}
//       placement="end"
//       className="popup-wrapper-canvas-utcoin"
//       backdrop={"true"}
//     >
//       <Offcanvas.Body className="rental-body-container">
//         <div className="rental-nft-details">
//           <div className="rental-head-content">
//             <div className="rental-title">
//               <h2>
//                 NFTs Selected For Renting Out
//                 <BsArrowLeft
//                   onClick={() => setRentalPop(!rentalPop)}
//                   className="cancel-btn back-btn"
//                 />
//                 <IoMdClose
//                   onClick={() => setRentalPop(!rentalPop)}
//                   className="cancel-btn close-btn"
//                 />
//               </h2>
//               <h6>
//                 {selected?.length > 0 && (
//                   <span>
//                     <strong>Selected NFTs : {selected?.length}</strong>
//                   </span>
//                 )}
//               </h6>
//             </div>
//           </div>

//           {list?.length > 0 && selected?.length > 0 && (
//             <div className="rental-body-content">
//               {list
//                 ?.filter((obj) => selected?.includes(obj?.slug))
//                 ?.map((nft, i) => (
//                   <NFTCardList nft={nft} key={i} hideCheckbox navigation />
//                 ))}
//             </div>
//           )}
//         </div>
//         <div className="sticky-bottom-box">
//           <button
//             className="btn btn-dark"
//             type="button"
//             onClick={() => setModalType("confirm")}
//           >
//             List on Marketplace
//           </button>
//         </div>

//         {modalType === "confirm" && (
//           <Modal
//             type={modalType}
//             selected={selected}
//             selectedAll={selectedAll}
//             setModalType={setModalType}
//           />
//         )}
//         {modalType === "success" && (
//           <Modal
//             type={modalType}
//             selected={selected}
//             selectedAll={selectedAll}
//             setModalType={setModalType}
//             setRentalPop={setRentalPop}
//             setActiveTab={setActiveTab}
//           />
//         )}
//       </Offcanvas.Body>
//     </Offcanvas>
//   );
// };

// const Modal = ({
//   type = "",
//   setModalType,
//   selected,
//   selectedAll,
//   setRentalPop,
//   setActiveTab,
// }) => {
//   const handleSubmit = async () => {
//     try {
//       const response = await allowForRental({
//         selected_all: selectedAll,
//         nft_slugs: selectedAll ? [] : selected,
//       });
//       setModalType("success");
//     } catch (error) {
//       toast.error(error?.response?.data?.message);
//     }
//   };

//   return (
//     <>
//       <div className="popup-secondary">
//         {type == "confirm" && (
//           <div className="confirm-modal modal-box">
//             {/* <BiX onClick={() => setModalType("")} /> */}
//             <h5>List selected NFTs for renting out.</h5>
//             <div className="btn-block">
//               <button
//                 className="btn btn-dark border-btn"
//                 onClick={() => setModalType("")}
//               >
//                 No
//               </button>
//               <button className="btn btn-dark" onClick={handleSubmit}>
//                 Yes
//               </button>
//             </div>
//           </div>
//         )}
//         {type == "success" && (
//           <div className="success-modal modal-box">
//             <Lottie animationData={successAnim} className={"lotti-icon"} />
//             <h5>NFT listed for rent successfully.</h5>
//             <div className="btn-block">
//               <button
//                 className="btn btn-dark"
//                 onClick={() => {
//                   setModalType("");
//                   setRentalPop(false);
//                   setActiveTab(2);
//                 }}
//               >
//                 View NFTs
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };
