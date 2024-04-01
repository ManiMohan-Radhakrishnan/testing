import React from "react";
import {
  FaCcAmex,
  FaCcDinersClub,
  FaCcDiscover,
  FaCcJcb,
  FaCcMastercard,
  FaCcVisa,
  FaCheckCircle,
} from "react-icons/fa";

import "./style.scss";

const BankCard = ({
  isActive = false,
  onClick = () => {},
  onRemove = () => {},
  name,
  type,
  id,
  expiryMonth,
  expiryYear,
  number,
}) => {
  return (
    <div role="button" onClick={onClick} className={`p-4 mb-3 bank-card-blk`}>
      <div className="top-section">
        <div>
          <label className="number">{number}</label>
          <div
            className="remove-text-card"
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(id);
            }}
          >
            Remove this card
          </div>
        </div>
        <div>
          {isActive ? (
            <FaCheckCircle
              className="select active"
              size={25}
              color={"#00a954"}
            />
          ) : (
            <FaCheckCircle className="select" size={25} color={"white"} />
          )}
        </div>
      </div>

      <div className="bottom-section">
        <div className="expiry">
          {expiryMonth}/{expiryYear}
        </div>

        <div className="name d-flex justify-content-between">
          <b>{name}</b>
          <div>
            {(() => {
              switch (type) {
                case "visa":
                  return <FaCcVisa size={30} />;
                case "mastercard":
                  return <FaCcMastercard size={30} />;
                case "amex":
                  return <FaCcAmex size={30} />;
                case "diners":
                  return <FaCcDinersClub size={30} />;
                case "discover":
                  return <FaCcDiscover size={30} />;
                case "jcb":
                  return <FaCcJcb size={30} />;
                case "unionpay":
                  return "UnionPay";
                default:
                  return type;
              }
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankCard;
