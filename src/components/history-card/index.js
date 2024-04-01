import React from "react";
import notFound from "../../images/nonftfound.svg";
import HistoryNftCard from "../history-nft-card/index";
const HistroyCard = ({ logs, dayjs, logData }) => {
  return (
    <>
      {logs?.length > 0 ? (
        <>
          {logs?.map((log, i) => (
            <div key={`log-${i}`} className="card-history-items">
              <HistoryNftCard
                key={`history-card-${i}`}
                log={log}
                logData={logData}
                dayjs={dayjs}
              />
            </div>
          ))}
        </>
      ) : (
        <div className="nonft_found">
          <div className="nodata-card">
            <img src={notFound} height="90" alt="" />
            <h4>No card history found.</h4>
          </div>
        </div>
      )}
    </>
  );
};

export default HistroyCard;
