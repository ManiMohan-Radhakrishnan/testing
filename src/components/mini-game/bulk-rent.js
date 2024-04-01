import { useEffect, useState } from "react";
import "./styles.scss";

const BulkRent = ({ refreshData }) => {
  const [counter, setCounter] = useState(10);
  useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  }, [counter]);

  return (
    <div className="no-record-found">
      <div className="record-found-cart">
        <div className="content-no-record">
          <div className="loader"></div>
          <div className="mt-3">
            <h4>Rental NFTs processing please wait...</h4>
          </div>

          <button
            className="btn-counter mt-4"
            role="button"
            onClick={() => refreshData({ page: 1 })}
            disabled={counter !== 0}
          >
            {counter === 0 ? "Refresh" : `${counter}s`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkRent;
