import { useEffect, useState } from "react";

import { userFavNFTsApi } from "../../api/methods-marketplace";

import NFTCardList from "./nft-card-list";
import NoRecord from "./no-record";

import "./styles.scss";
import { GAMES } from "../../utils/game-config";

const FavNFT = ({ setCount }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getList(1);
  }, []);

  const getList = async (page) => {
    try {
      setLoading(true);
      const result = await userFavNFTsApi(page, GAMES.HURLEY);
      setCount(result?.data?.data?.total_count);
      setList(result?.data?.data?.nfts);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="mynft-card-list">
      {!loading ? (
        <>
          {list?.length > 0 ? (
            list?.map((nft, i) => (
              <NFTCardList nft={nft} key={i} hideCheckbox navigation />
            ))
          ) : (
            <NoRecord />
          )}{" "}
        </>
      ) : (
        <div className="norecord-found">
          <h5>Loading...</h5>
        </div>
      )}
    </div>
  );
};

export default FavNFT;
