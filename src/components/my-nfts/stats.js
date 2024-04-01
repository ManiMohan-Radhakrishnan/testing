import { batPower, level, playerCategory, role } from "../../utils/common";
import images from "../../utils/raddx-images.json";

const Stats = ({ statistics, className, category }) => {
  const levelData = level(statistics?.level?.value);
  const roleData = role(
    statistics?.role?.value,
    statistics?.dominant_hand?.value
      ? statistics?.dominant_hand?.value
      : statistics?.role?.value
  );
  const playerCatData = playerCategory(statistics?.category?.value);

  const batData = batPower(statistics?.twox_power?.value);

  return (
    <>
      <article className={`nft_stats ${className ? className : ""}`}>
        {roleData && (
          <div className="player-type">
            <img src={roleData?.value} />
          </div>
        )}
        {category === "Ball" && (
          <div className="bat-type-2x">
            <img src={images.ball_image} />
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
            // style={{
            //   borderBottom: levelData ? "0.1rem solid #fff" : "none",
            // }}
          >
            <span
              className="band"
              // style={{
              //   background: playerCatData?.color ? playerCatData?.color : "",
              // }}
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

export default Stats;
