import { useState } from "react";
import { useHistory } from "react-router-dom";
import { HiExternalLink } from "react-icons/hi";

import { nftsCountApi } from "../../../api/methods-marketplace";
import useEffectOnce from "../../../hooks/useEffectOnce";

const emptyPlaceHolder = "- -";

const MyNftsCard = () => {
  const history = useHistory();
  const [nftsCount, setNftsCount] = useState({});
  const fetchNftsCount = async () => {
    try {
      const response = await nftsCountApi();
      setNftsCount(response?.data?.data || {});
      window?.webengage?.user?.setAttribute(
        "Total number of NFTs",
        parseInt(response?.data?.data?.total_nfts)
      );
    } catch (error) {
      console.log(`Error in fetching NFTs count`, error);
    }
  };

  useEffectOnce(fetchNftsCount);

  return (
    <article className="grid-card">
      <div className="card-box myNFT-card">
        <div className="card-header">
          <h4>My NFTs </h4>
          <a onClick={() => history.push("/accounts/mynft")}>
            View More <HiExternalLink />
          </a>
        </div>
        <div className="card-body">
          <ul className="myNFT-grid-container">
            <li>
              <h2>{nftsCount?.total_nfts || emptyPlaceHolder}</h2>
              <h6>Total NFTs Bought</h6>
            </li>
            <li>
              <h2>{nftsCount?.listed_for_sale || emptyPlaceHolder}</h2>
              <h6>Listed for Sale</h6>
            </li>
            <li>
              <h2>{nftsCount?.listed_for_rental || emptyPlaceHolder}</h2>
              <h6>Listed for Rental</h6>
            </li>
            <li>
              <h2>{nftsCount?.borrowed_nfts || emptyPlaceHolder}</h2>
              <h6>Total NFTs Borrowed</h6>
            </li>
          </ul>
        </div>
      </div>
    </article>
  );
};

export default MyNftsCard;
