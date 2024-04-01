import React from "react";
import nonftfound from "../../images/nonftfound.svg";
import PlayNftCard from "../play-nft-card";

const NFTPlayNft = ({}) => {
  return (
    <>
      <section className="mynftplaynft-card-block">
        <PlayNftCard />
        <PlayNftCard />
        <PlayNftCard />
        <PlayNftCard />
        <PlayNftCard />
        <PlayNftCard />

        {/* // ------------ Nodata found card ----------- */}
        {/* <div className="nonft_found">
          <div className="nodata-card">
            <img src={nonftfound} height="90" alt="" />
            <h4>This space is awaiting your NFT.</h4>
          </div>
        </div> */}
      </section>
    </>
  );
};

export default NFTPlayNft;
