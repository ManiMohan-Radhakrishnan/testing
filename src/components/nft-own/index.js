import React from "react";
import NFTCard from "../nft-card";
import nonftfound from "../../images/nonftfound.svg";

const NFTOwn = ({
  nftList,
  data,
  putOnSale = false,
  isLive = false,
  filtersApplied = false,
  trigger,
  setTrigger,
}) => {
  return (
    <>
      {nftList.length > 0 ? (
        <div className="row">
          {nftList.map((nft, i) => (
            <div
              className="col-xl-3 col-sm-6 col-lg-4"
              key={`div-nft-own-${i}`}
            >
              <NFTCard
                key={`nft-own-${i}`}
                nft={nft}
                data={data}
                putOnSale={putOnSale}
                isLive={isLive}
                trigger={trigger}
                setTrigger={setTrigger}
                owned
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="nonft_found">
          <div className="nodata-card">
            <img src={nonftfound} height="90" alt="" />
            {!filtersApplied ? (
              <h4>This space is awaiting your NFT.</h4>
            ) : (
              <h4>No NFTs found!</h4>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NFTOwn;
