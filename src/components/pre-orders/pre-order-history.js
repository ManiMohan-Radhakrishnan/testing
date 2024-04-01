import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

import preorderImage from "../../images/jump-trade/preorder-img001.png";

import { preOrderHistory } from "../../api/methods";

import { currencyFormat } from "../../utils/common";

const PreOrderHistory = ({ data }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (data) getPreOrdersHistory();
  }, []);

  const getPreOrdersHistory = async () => {
    try {
      setLoading(true);
      const result = await preOrderHistory(data);
      setHistory(result.data.data.reserved_nfts);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    "Loading histories..."
  ) : history.length > 0 ? (
    history.map((obj, i) => (
      <PreOrderHistoryCard key={`pohc${i}`} input={obj} />
    ))
  ) : (
    <div className="text-center mt-4">No pre-book history found</div>
  );
};

const PreOrderHistoryCard = ({ input }) => {
  return (
    <div className="preorder-card">
      <div className="img-content-block">
        <div className="img-block">
          <img src={preorderImage} />
        </div>
        <div className="base-detail">
          <h5>
            {input.name} <span>April 22, 2022</span>
          </h5>
          <h6 className="min-font">
            Purchase Price: <br />
            {currencyFormat(25, "USD")}/NFT
          </h6>
        </div>
      </div>

      <div className="preorder-info-block">
        <div className="preorder-price-info">
          <h6>
            Pre-Book Quantity
            <span className="quantity">{input.quantity}</span>
          </h6>
        </div>
      </div>
      <div className="auction-flex dis-none">
        <div className="preorder-price-info">
          {/* Created date :{" "} */}
          <b>{dayjs(input?.created_at).format(" D MMM YYYY hh:mma")}</b>
        </div>
        <div className="preorder-price-info">
          {/* Price :{" "} */}
          <b>
            {currencyFormat(
              input.quantity * parseFloat(input.buy_amount),
              "USD"
            )}
          </b>
        </div>
      </div>
      <div className="auction-flex confirm-order">
        <button type="button" className="successBtn">
          Pre-Book Confirmed
          <span>{dayjs(input?.created_at).format(" D MMM YYYY hh:mma")}</span>
        </button>
        <h4 className="price">{currencyFormat(input.buy_amount, "USD")}</h4>
      </div>
    </div>
  );
};

export default PreOrderHistory;
