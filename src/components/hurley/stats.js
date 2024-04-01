import { HurleyCategoory, hurleyLevels } from "../../utils/common";

const Stats = ({ statistics, className }) => {
  const levelData = hurleyLevels(statistics?.level?.value);

  const playerCatData = HurleyCategoory(statistics?.category?.value);

  return (
    <>
      <article className={`nft_stats ${className ? className : ""}`}>
        {playerCatData && (
          <div
            className="player-type"
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
