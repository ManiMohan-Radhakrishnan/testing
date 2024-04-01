import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";

import PreOrderHistory from "./pre-order-history";
import preorderImage from "../../images/jump-trade/preorder-img001.png";
import { currencyFormat } from "../../utils/common";

import "./style.scss";
import NFTCounter from "../nft-counter/index";

const PreOrderCard = ({
  enable,
  disable,
  data,
  quantity,
  reserveTime,
  onChange = () => {},
  handleSubmit = () => {},
}) => {
  const [total_qty, setTotalQty] = useState("");

  const [error, setError] = useState();

  useEffect(() => {
    setTotalQty(parseFloat(quantity) * parseFloat(data.buy_amount));
  }, [quantity]);
  return (
    <>
      <h5 className="pre-title">{data.name}</h5>
      <div className="wallet-box mt-0">
        <div className="media">
          <div className="media-body">
            <div className="item-subtitle text-center">Total Pre-Booked</div>
            <div className="item-title text-center">{data.reserved_qty}</div>
          </div>
        </div>
        <div className="media">
          <div className="media-body">
            <div className="item-subtitle text-center">Total Alloted</div>
            <div className="item-title text-center">
              {data.settled ? data.settled : 0}
            </div>
          </div>
        </div>
      </div>
      {/* <article className="preorder-card preorder-form ">
        <div className="img-content-block">
          <div className="img-block">
            <img src={preorderImage} />
          </div>
          <div className="base-detail">
            <h5>
              {data.name} <span>April 22, 2022</span>
            </h5>
            <h6 className="min-font">
              Purchase Price: <br />
              {currencyFormat(data.buy_amount, "USD")}/NFT
            </h6>
          </div>
        </div>

        <div className="preorder-info-block">
          <div className="preorder-price-info">
            <h6>Pre-Book Quantity</h6>
            <input
              type="text"
              id="quantity"
              name="quantity"
              disabled={disable}
              value={quantity}
              maxLength={10}
              onChange={onChange}
              className="form-control"
            />
          </div>
          <div className="preorder-price-info">
            <h6 className="min-font">
              Total Price: <br />
              {currencyFormat(total_qty ? total_qty : "0", "USD")}
            </h6>
          </div>
        </div>

        <div className="auction-flex">
          <button
            type="button"
            disabled={disable}
            onClick={() => {
              if (total_qty) {
                handleSubmit(data.slug);
                setError("");
              } else {
                setError("Enter Pre-Book Quantity");
              }
            }}
          >
            {disable ? "Pre-Book Closed" : "Pre-Book NFTs Now"}
          </button>
          {error && <div className="error-msg-alert">{error}</div>}

          {(() => {
            if (disable) {
              return null;
            } else if (enable) {
              return (
                <>
                  <div className="text-center exclusive">
                    Pre-Book is now available for all members until
                  </div>
                  <div className="text-center">
                    <NFTCounter time={data.reserve_end_time} />
                  </div>
                </>
              );
            } else if (data.can_order) {
              return (
                <>
                  <div className="text-center">
                    <NFTCounter time={reserveTime} />
                  </div>
                  <div className="text-center exclusive">
                    (Exclusive early access only for GuardianLink community
                    members)
                  </div>
                </>
              );
            }
          })()}
        </div>
      </article> */}
      <div className="preorder-history-block">
        <div className="preorder-history-heading">
          <div className="about-heading">
            <div>
              <h3 className="about-title">PRE BOOK NFTs HISTORY</h3>
            </div>
          </div>
        </div>
        <div className="preorder-history-items">
          <PreOrderHistory data={data.slug} image={preorderImage} />
        </div>
      </div>
    </>
  );
};

export default PreOrderCard;
