import React from "react";
import NFTCard from "../nft-card";
import nonftfound from "../../images/nonftfound.svg";

const NFTFav = ({ nftList, data, marketplace = false }) => {
  return (
    <>
      {nftList.length > 0 ? (
        <div className="row">
          {nftList.map((nft, i) => (
            <div className="col-xl-3 col-sm-6 col-lg-4">
              <NFTCard
                key={`nft-card-${i}`}
                nft={nft}
                data={data}
                marketplace={marketplace}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="nonft_found">
          <div className="nodata-card">
            <img src={nonftfound} height="90" alt="favorite NFTs" />
            <h4>No favorites found</h4>
          </div>
        </div>
      )}
    </>
  );
};

export default NFTFav;
