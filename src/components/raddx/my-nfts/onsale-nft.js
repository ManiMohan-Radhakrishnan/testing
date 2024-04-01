import { useEffect, useRef, useState } from "react";

import { userOwnedNFTsApi } from "../../../api/methods-marketplace";

import FilterSection from "../filter-section";
import NFTCardList from "./nft-card-list";
import NoRecord from "./no-record";

import "./styles.scss";
import { GAMES } from "../../../utils/game-config";

const OnsaleNFT = ({ setCount }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState(false);
  const saleSectionRef = useRef({});

  useEffect(() => {
    list?.length === 0 && getList({ page });
  }, []);

  const getList = async ({
    page,
    filters = null,
    load = false,
    filterArePresent = false,
  }) => {
    if (filters) {
      saleSectionRef.current = filters;
    }
    try {
      if (load) {
        setMoreLoading(true);
      } else {
        setLoading(true);
      }

      const result = await userOwnedNFTsApi(page, {
        ...saleSectionRef.current,
        game_names: [GAMES.RADDX],
        sale_kind: "onsale",
      });
      if (load) {
        setList([...list, ...result?.data?.data?.nfts]);
      } else {
        setList(result?.data?.data?.nfts);
      }
      if (filterArePresent) setTotalCount(result?.data?.data?.total_count);
      else setCount(result?.data?.data?.total_count);
      setNextPage(result?.data?.data?.next_page);
      if (load) {
        setMoreLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setMoreLoading(false);
    }
  };

  const loadMore = () => {
    getList({ page: page + 1, load: true, filterArePresent: true });
    setPage(page + 1);
  };

  return (
    <>
      <FilterSection
        filteredNFTCount={totalCount}
        saleFilter
        saleFilterMethod={getList}
      />
      <div className="mynft-card-list">
        {!loading ? (
          <>
            {list?.length > 0 ? (
              list?.map((nft, i) => (
                <NFTCardList
                  nft={nft}
                  key={i}
                  hideCheckbox
                  saleTab
                  navigation
                />
              ))
            ) : (
              <NoRecord />
            )}
          </>
        ) : (
          <div className="norecord-found">
            <h5>Loading...</h5>
          </div>
        )}
        {nextPage && (
          <div className="d-flex justify-content-center w-100">
            <button
              className="btn btn-outline-dark text-center rounded-pill mt-5 mb-3 loadmore-btn"
              type="button"
              disabled={moreLoading}
              onClick={loadMore}
            >
              {moreLoading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default OnsaleNFT;
