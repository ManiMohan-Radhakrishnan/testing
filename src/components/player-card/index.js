import React from "react";
import PlayerNFTCard from "../player-nft-card";
import notFound from "../../images/nonftfound.svg";

const PlayerCard = ({ list, data }) => {
  return (
    <>
      {list.length > 0 ? (
        <div className="row">
          {list.map((nft, i) => (
            <div
              className="col-xl-3 col-lg-4 col-sm-6"
              key={`col-player-card-${i}`}
            >
              <PlayerNFTCard
                key={`player-card-${i}`}
                nft={nft}
                data={data}
                playerCard
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="nonft_found">
          <div className="nodata-card">
            <img src={notFound} height="90" alt="" />
            <h4>No MCL Player Upgrades collected yet.</h4>
          </div>
        </div>
      )}
    </>
  );
};

export default PlayerCard;
