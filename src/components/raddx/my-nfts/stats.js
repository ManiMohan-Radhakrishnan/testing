import {
  raddx_car_category,
  raddx_category,
  raddx_level,
  raddx_roles,
} from "../../../utils/common";

const Stats = ({ statistics, className }) => {
  const levelData = raddx_level(statistics?.level?.value);
  const roleData = raddx_roles(statistics?.role?.value);
  const raddxCategory = raddx_category(statistics?.category?.value);

  const raddxCarCategory = raddx_car_category(statistics?.car_category?.value);

  return (
    <>
      <article className={`nft_stats ${className ? className : ""}`}>
        {roleData && (
          <div className="player-type">
            <img src={roleData?.value} />
            <h6>{roleData?.name}</h6>
          </div>
        )}

        {raddxCarCategory && (
          <div className="bat-type-2x">
            <img src={raddxCarCategory?.value} />
            <h6>{raddxCarCategory?.name}</h6>
          </div>
        )}

        {raddxCategory && (
          <div className="player-range">
            <span className="band">{raddxCategory?.value}</span>
            <h6>{raddxCategory?.name}</h6>
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
