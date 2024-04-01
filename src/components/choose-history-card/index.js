import { useState } from "react";
import { Offcanvas } from "react-bootstrap";
import PlayerNFTCardHistoryUpgradable from "../history-upgradable-card";
import { upgradableCardLogsData } from "../../api/methods-marketplace";
import "./style.scss";

const ChooseNFTHistoryCard = ({
  cardData,
  setCardData,
  cards,
  setCards,
  page,
  setPage,
  chooseNFTPop,
  setChooseNFTPop,
  tournamentId,
  logdata,
}) => {
  const [loading, setLoading] = useState(false);

  const getCardLogs = async (page) => {
    try {
      setLoading(true);
      const result = await upgradableCardLogsData(page, tournamentId);
      setCardData(result?.data?.data);
      setCards([...cards, ...result?.data?.data?.upgradable_card_logs]);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const loadMoreCardLogs = () => {
    if (cardData.next_page) {
      getCardLogs(page + 1);
      setPage(page + 1);
    }
  };

  return (
    <>
      <Offcanvas
        show={chooseNFTPop}
        onHide={() => setChooseNFTPop(!chooseNFTPop)}
        placement="end"
        className=" popup-wrapper-canvas-choose-history maxiwidth-choose-history"
      >
        <Offcanvas.Body className="p-0 pop-body-container-choose-history">
          <>
            <div className="pop-nft-details-choose-history">
              <div className="pop-head-content-choose-history">
                <div className="pop-bid-title-choose-history">
                  {cards[0]?.tournament?.name}
                </div>
                <div
                  className="close-button-pop-choose-history"
                  onClick={() => setChooseNFTPop(!chooseNFTPop)}
                >
                  <img
                    alt="close"
                    src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e"
                  ></img>
                </div>
              </div>
              <div className={`pop-bid-progress-choose-history`}>
                <div className="progress-complete-choose-history"></div>
              </div>
              <div className="pop-body-content-choose-history">
                <div className="pop-nft-info-choose-historyuseNft-list-choose-history">
                  <div className="nft-stats-choose-history pop-nft-stats-choose-history"></div>
                </div>
                <div className="sticky-bottom-fix-choose-history">
                  {/* sticky */}
                </div>
                <div className="nft-list-fix-choose-history choose-nft-upgrade-choose-history container-fluid">
                  {cards?.length > 0 ? (
                    <div className="row">
                      {cards?.map((card, i) => (
                        <div
                          className="col-lg-6 col-sm-6"
                          key={`col-nft-upgrade-${i}`}
                        >
                          <PlayerNFTCardHistoryUpgradable
                            key={`nft-unft-image-blockpgrade-${i}`}
                            card={card}
                            chooseNFT
                          />
                        </div>
                      ))}
                      {cardData?.next_page && (
                        <div className="d-flex justify-content-center w-100">
                          <button
                            className="btn btn-outline-dark rounded-pill col-6"
                            type="button"
                            disabled={loading}
                            onClick={loadMoreCardLogs}
                          >
                            {loading ? "Loading..." : "Load More"}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <h4 className="nonft-found">No NFT Found</h4>
                  )}
                </div>
              </div>
            </div>
          </>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default ChooseNFTHistoryCard;
