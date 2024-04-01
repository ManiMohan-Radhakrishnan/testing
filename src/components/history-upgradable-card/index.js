import React, { useEffect } from "react";
import postOne from "../../images/post1.png";
import { playerCategory, role } from "../../utils/common";
import dayjs from "dayjs";
import "./style.scss";

const PlayerNFTCardHistoryUpgradable = ({ card }) => {
  const CardDetails = (card) => {
    const roleData = role(
      card?.upgradable_card?.role,
      card?.upgradable_card?.dominant_hand
        ? card?.upgradable_card?.dominant_hand
        : "BAT"
    );
    const playerCatData = playerCategory(card?.upgradable_card?.category);
    return (
      <article
        className={`player_stats-upgradable-history cards_upgrades-upgradable-history`}
      >
        {roleData && (
          <div className="player-type">
            <img src={roleData?.value} />
          </div>
        )}

        {playerCatData && (
          <div className="player-range-upgradable-history">
            <span
              className="band-upgradable-history"
              style={{
                background: playerCatData?.color ? playerCatData?.color : "",
              }}
            >
              {playerCatData?.value}
            </span>
          </div>
        )}
      </article>
    );
  };

  return (
    <>
      <div className="mynft-card-box-upgradable-history available-card-nft-upgradable-history mb-3">
        <div className="block-box-upgradable-history user-post jt-card-upgradable-history">
          <div className="item-post-upgradable-history img-card-border-upgradable-history">
            <span className="upgradelabel-upgradable-history">Upgrades</span>
            <img
              src={
                card?.upgradable_card?.image_url
                  ? card?.upgradable_card?.image_url
                  : postOne
              }
              width="100%"
              alt="nft logo"
              role="button"
            />
            {CardDetails(card)}
          </div>

          <div className="item-content-upgradable-history">
            <div className="post-cost-upgradable-history pw_we ">
              <div className="skew_box available-card-upgradable-history">
                <div className="wrap-upgradable-history">
                  <div className="box-upgradable-history box1-upgradable-history">
                    <p>{card?.upgradable_card?.name}</p>
                  </div>

                  <div className="box-upgradable-history box2-upgradable-history">
                    {card?.quantity && (
                      <>
                        <div className="title-card-box-upgradable-history">
                          <div className="text-end title-card-upgradable-history">
                            <p>Cards</p>
                            <p>Earned</p>
                          </div>

                          <h2>{card?.quantity}</h2>
                        </div>
                        <div className="data-of-card-upgradable-history">
                          {dayjs(card?.created_at).format(
                            " D MMM YYYY hh:mm a"
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayerNFTCardHistoryUpgradable;
