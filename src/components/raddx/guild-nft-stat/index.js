import React from "react";
import {
  level,
  Nationality,
  playerCategory,
  role,
  raddx_category,
  raddx_car_category,
} from "../../../utils/common";

const GuildNFTStat = ({ statistics }) => {
  const levelData = level(statistics?.level?.value);
  const roleData = raddx_car_category(statistics?.car_category?.value);
  const playerCatData = raddx_category(statistics?.category?.value);

  return (
    <>
      <article className={`player_stats`}>
        {roleData && (
          <div className="player-type">
            <img src={roleData?.value} />
            <p style={{ color: "white" }}>{statistics?.car_category?.value}</p>
          </div>
        )}

        {playerCatData && (
          <div
            className="player-range"
            style={{
              borderBottom:
                levelData || statistics?.year?.value
                  ? "0.1rem solid #3b3b3b"
                  : "none",
            }}
          >
            <span
              className="band"
              style={{
                background: playerCatData?.color ? playerCatData?.color : "",
              }}
            >
              {playerCatData?.value}
            </span>
          </div>
        )}

        {levelData && (
          <div className="player-level">
            <h6>{levelData?.name}</h6>
            <img src={levelData?.value} />
          </div>
        )}
      </article>
    </>
  );
};

export default GuildNFTStat;
