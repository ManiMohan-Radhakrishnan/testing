import React from "react";
import { FaCheckCircle } from "react-icons/fa";

import "./style.scss";

const BankAccount = ({
  isActive = false,
  onClick = () => {},
  onRemove = () => {},
  id = "",
  number,
}) => {
  return (
    <div
      role="button"
      onClick={onClick}
      className={`p-4 mb-3 bank-account-blk`}
    >
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
            Remove this account
          </div>
        </div>
        <div>
          {isActive ? (
            <FaCheckCircle
              className="select active"
              size={25}
              color={"white"}
            />
          ) : (
            <FaCheckCircle className="select" size={25} color={"white"} />
          )}
        </div>
      </div>
    </div>
  );
};

export default BankAccount;
