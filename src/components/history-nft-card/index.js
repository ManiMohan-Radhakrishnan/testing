import React, { useState } from "react";
import "./style.scss";
import ChooseNFTHistoryCard from "../choose-history-card";
import { upgradableCardLogsData } from "../../api/methods-marketplace";
import UpNext from "../../images/jump-trade/upnext.png";

const HistoryNftCard = ({ log, dayjs, logData }) => {
  const [chooseNFTPop, setChooseNFTPop] = useState(false);
  const [page, setPage] = useState(1);

  const [cardData, setCardData] = useState({});
  const [cards, setCards] = useState([]);

  const getCardLogsData = async (page, id) => {
    try {
      const result = await upgradableCardLogsData(page, id);
      setCardData(result?.data?.data);
      setCards(result?.data?.data?.upgradable_card_logs);
      setChooseNFTPop(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="mynfthistory-card-box history-card-nft mb-3">
        <div className="block-box-history user-post jt-card-history">
          <div className="history-post history-img-card-border">
            <img
              className="img-card"
              src={log?.image_url ? log?.image_url : UpNext}
              alt={log?.name}
              width="100%"
            />
            <span className="time-ago-history">
              {dayjs(
                log?.tournament_date ? log?.tournament_date : new Date()
              ).format(" D MMM YYYY hh:mm a")}
            </span>
          </div>
          <div className="history-content">
            <div className="user-title-history">
              {log?.title ? (
                <>{log?.title} </>
              ) : (
                <>
                  {/* {log?.upgradable_card?.name}{" "} */}
                  <div className="card-title-div-history">
                    {log?.quantity > 0
                      ? ` ${log?.quantity > 1 ? ` Cards` : `Card`} Earned`
                      : `Card Earned`}
                  </div>
                  <div className="card-quantity-history">{log?.quantity}</div>
                </>
              )}
            </div>
          </div>
          <div className="view-all-card-button-history">
            <div className="skew-box-wrapper-history available-card-history">
              <div className="wrap-history">
                <button
                  className="upgrade-btn-history buy-to-upgradde-history mt-3 mb-3"
                  onClick={() => getCardLogsData(1, log?.game_tournament_id)}
                >
                  <span>View Cards</span>
                </button>
              </div>
            </div>
          </div>
          <div className="tournament-img-history">
            {log?.tournament?.image_url && (
              <img
                src={log?.tournament?.image_url}
                alt={log?.tournament?.name}
              />
            )}
          </div>
        </div>
      </div>
      <ChooseNFTHistoryCard
        logdata={logData}
        tournamentId={log?.game_tournament_id}
        cardData={cardData}
        setCardData={setCardData}
        cards={cards}
        setCards={setCards}
        page={page}
        setPage={setPage}
        chooseNFTPop={chooseNFTPop}
        setChooseNFTPop={setChooseNFTPop}
      />
    </>
  );
};

export default HistoryNftCard;
