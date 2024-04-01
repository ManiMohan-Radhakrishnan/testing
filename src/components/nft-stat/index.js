import React from "react";
import {
  batPower,
  level,
  Nationality,
  playerCategory,
  role,
} from "../../utils/common";

const NFTStat = ({ statistics }) => {
  const levelData = level(statistics?.level?.value);
  const roleData = role(
    statistics?.role?.value,
    statistics?.dominant_hand?.value && statistics?.dominant_hand?.value
  );
  const playerCatData = playerCategory(statistics?.category?.value);

  const NationalityData = Nationality(statistics?.nationality?.value);

  const batData = batPower(statistics?.twox_power?.value);

  return (
    <>
      <article className={`player_stats`}>
        {roleData && (
          <div className="player-type">
            <img src={roleData?.value} />
          </div>
        )}

        {batData && (
          <div className="bat-type-2x">
            <img src={batData?.value} />
          </div>
        )}

        {playerCatData && (
          <div
            className="player-range"
            style={{
              borderBottom:
                levelData || NationalityData || statistics?.year?.value
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

        {NationalityData && (
          <div
            className="player-level"
            style={{
              borderBottom: statistics?.year?.value
                ? "0.1rem solid #3b3b3b"
                : "none",
            }}
          >
            <img src={NationalityData?.value} alt="Player-level" />
          </div>
        )}
        {statistics?.year?.value && (
          <div className="player-level yearshow">
            <h6>Year</h6>
            <span style={{ color: "#f2f2f2" }}>{statistics?.year?.value}</span>
          </div>
        )}
      </article>
    </>
  );
};

export default NFTStat;
