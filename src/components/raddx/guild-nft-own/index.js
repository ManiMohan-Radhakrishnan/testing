import React from "react";
import nonftfound from "../../../images/nonftfound.svg";
import GuildNFTCard from "../guild-nft-card";

const GuildNFTOwn = ({
  nftList,
  data,
  putOnSale = false,
  isLive = false,
  handleGuildNft,
  guildNftText,
  filtersApplied,
  isAssign,
  guildUserMenuPermissionList,
}) => {
  return (
    <>
      {nftList.length > 0 ? (
        <div className="row">
          {nftList.map((nft, i) => (
            <div className="col-xl-3 col-sm-6 col-lg-4">
              <GuildNFTCard
                key={nft.slug}
                nft={nft}
                data={data}
                putOnSale={isAssign}
                isLive={isLive}
                handleGuildNft={handleGuildNft}
                guildNftText={guildNftText}
                isAssign={isAssign}
                guildUserMenuPermissionList={guildUserMenuPermissionList}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="nonft_found">
          <div className="nodata-card">
            <img src={nonftfound} height="90" alt="" />
            {!filtersApplied ? (
              isAssign ? (
                <h4>All NFTs have been assigned to scholars.</h4>
              ) : (
                <h4>No NFTs have been assigned to any scholars yet.</h4>
              )
            ) : (
              <h4>No NFTs found!</h4>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default GuildNFTOwn;
