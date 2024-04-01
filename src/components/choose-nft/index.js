import React, { useEffect, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

import PlayerNFTCard from "../player-nft-card";
import { upgradableNFTsApi } from "../../api/methods-marketplace";
import "./style.scss";

const ChooseNFT = ({ card, chooseNFTPop, setChooseNFTPop }) => {
  const [nftList, setNFTList] = useState([]);
  const [nftData, setNFTData] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (chooseNFTPop) {
      getUpgradableNFTs(1, card?.player_id);
    }
  }, [chooseNFTPop]);

  const getUpgradableNFTs = async (page) => {
    try {
      const filter = {
        keyword: search ? search : "",
      };
      const result = await upgradableNFTsApi(page, card?.player_id, filter);
      setNFTData(result.data.data);
      setNFTList(result.data.data.nfts);
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyPressEvent = (event) => {
    if (event.key === "Enter") {
      getUpgradableNFTs(1);
    }
  };

  return (
    <>
      <Offcanvas
        show={chooseNFTPop}
        onHide={() => setChooseNFTPop(!chooseNFTPop)}
        placement="end"
        className=" popup-wrapper-canvas maxiwidth"
      >
        <Offcanvas.Body className="p-0 pop-body-container">
          <>
            <div className="pop-nft-details">
              <div className="pop-head-content">
                <div className="pop-bid-title">
                  {card?.name} NFTs{" "}
                  {nftData?.total_count && `(${nftData?.total_count})`}
                </div>
                <div
                  className="close-button-pop"
                  onClick={() => setChooseNFTPop(!chooseNFTPop)}
                >
                  <img
                    alt="close"
                    src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e"
                  ></img>
                </div>
              </div>
              <div className={`pop-bid-progress`}>
                <div className="progress-complete"></div>
              </div>
              <div className="pop-body-content">
                <div className="pop-nft-info useNft-list">
                  <div className="available-cards">
                    <div className="img-block">
                      <div className="nft-image-block">
                        <img src={card?.image_url} />
                      </div>
                    </div>
                    <div className="info-block">
                      <h6>{card?.name} is ready to level up!</h6>
                      <h3>{card?.quantity} cards</h3>
                    </div>
                  </div>

                  {/* <div className="nft-detail pop-nft-image">
                    <h5>{card?.name}</h5>
                    <div className="nft-image-block">
                      <img src={card?.image_url} />
                      <p>{card?.name} available to upgrade</p>
                      <p>{card?.quantity} cards </p>
                    </div>
                  </div> */}
                  <div className="nft-stats pop-nft-stats">
                    <div className="nft-list-heading">
                      <h4>Choose an NFT to upgrade</h4>
                      <div className="search-block">
                        <FaSearch onClick={() => getUpgradableNFTs(1)} />
                        <input
                          type="text"
                          placeholder="Search NFTs"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          onKeyPress={handleKeyPressEvent}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="sticky-bottom-fix">{/* sticky */}</div>
                <div className="nft-list choose-nft-upgrade container-fluid">
                  {nftList.length > 0 ? (
                    <div className="row">
                      {nftList.map((nft, i) => (
                        <div
                          className="col-xl-4 col-lg-6 col-sm-6"
                          key={`col-nft-upgrade-${i}`}
                        >
                          <PlayerNFTCard
                            key={`nft-upgrade-${i}`}
                            nft={nft}
                            data={nftData}
                            upgrade
                            chooseNFT
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <h4 className="nonft-found">No NFT Found</h4>
                  )}
                </div>
                {/* <div className="bottom-area">
                  <div className="bottom-content-pop">
                    <div
                      className="back-button"
                      onClick={() => setChooseNFTPop(!chooseNFTPop)}
                    >
                      Cancel
                    </div>
                    <div className="place-bid-button">
                      <button
                        className={`btn btn-dark text-center btn-lg w-75 rounded-pill place-bid-btn-pop `} //process -> proccessing
                        onClick={handlePayment}
                        disabled={(() => {
                          if (!paymentType || processing) {
                            return true;
                          } else if (
                            paymentType === "usd" &&
                            parseFloat(user?.balance) < parseFloat(cost?.usd)
                          ) {
                            return true;
                          } else if (
                            paymentType === "ut" &&
                            parseInt(user?.jump_points_balance) <
                              parseInt(cost?.ut)
                          ) {
                            return true;
                          } else {
                            return false;
                          }
                        })()}
                      >
                        <span>{processing ? "Processing..." : "Upgrade"}</span>
                      </button>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default ChooseNFT;
