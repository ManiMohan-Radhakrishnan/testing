import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Offcanvas } from "react-bootstrap";

import { getUserRewardListBySpinEvent } from "../../../api/methods";

import prize_1 from "../../../images/spin-wheel/prizes/prize-1.png";

import "./style.scss";

const LOGS_SAMPLE = [
  {
    reward_name: "BTC",
    image_url: `https://img.freepik.com/free-vector/cryptocurrency-bitcoin-golden-coin-background_1017-31505.jpg`,
  },
  {
    reward_name: "Bike",
    image_url:
      "https://bd.gaadicdn.com/processedimages/ktm/ktm-duke-390/640X309/ktm-duke-3905fd47cd663191.jpg",
  },
  {
    reward_name: "Car",
    image_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6b3jeZREXM0lmx1pmvS130q1Lt_t1tbcGf1vLdddf5A&s",
  },
];

const SpinWheelLogs = ({
  show = false,
  onHide = () => {},
  eligibleSpin = false,
}) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [moreLoading, setMoreLoading] = useState(false);
  const [nextPage, setNextPage] = useState(false);

  const fetchSpinWheelActivityLogs = async () => {
    try {
      !loading && setLoading(true);
      const response = await getUserRewardListBySpinEvent();
      if (response?.data?.success) {
        setLogs(response?.data?.data?.rewards);
        setNextPage(response?.data?.data?.next_page);
      }
    } catch (error) {
      console.log("Error in fetching spin wheel activity logs", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchSpinWheelActivityLogsMore = async () => {
    try {
      setMoreLoading(true);
      const response = await getUserRewardListBySpinEvent(pageNo + 1, 5);
      if (response?.data?.success) {
        setLogs([...logs, ...response?.data?.data?.rewards]);
        setNextPage(response?.data?.data?.next_page);
      }
    } catch (error) {
      console.log("Error in fetching spin wheel activity logs", error);
    } finally {
      setMoreLoading(false);
      setPageNo(pageNo + 1);
    }
  };

  useEffect(() => {
    fetchSpinWheelActivityLogs();
  }, []);

  return show ? (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement="end"
      className="spin-wheel-activity-logs"
      backdrop={true}
    >
      <Offcanvas.Body className="p-0 pop-body-containers">
        <div className="pop-head-content">
          <div className="pop-bid-title">SPIN-THE-WHEEL Activity</div>
          <div className="close-button-pop" onClick={onHide}>
            <img
              alt="close"
              src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e"
            ></img>
          </div>
        </div>
        <div className="pop-body-content">
          {!loading && logs?.length > 0 ? (
            <>
              <div className="activity-log-block">
                {logs.map((log, i) => {
                  let {
                    reward_name = "",
                    image_url = "",
                    desc = "",
                    assert_type = "",
                    price_in_usd = "",
                    redeemed_on = "",
                  } = log;
                  return (
                    <div key={`logs-${i}`} className="activity-log-item">
                      <img
                        className="activity-image"
                        src={image_url || prize_1}
                      ></img>
                      <div className="activity-info-block">
                        {reward_name ? (
                          <h3 className="activity-name">
                            You have won <span>{reward_name}</span>
                            {assert_type === "physical" &&
                              parseInt(price_in_usd) >= 1 && (
                                <>
                                  {" "}
                                  worth <span>~${price_in_usd}</span>.
                                </>
                              )}
                          </h3>
                        ) : (
                          <></>
                        )}
                        {redeemed_on ? (
                          <p className="activity-desc">
                            {dayjs(redeemed_on).format(" D MMM YYYY hh:mma")}
                          </p>
                        ) : (
                          <></>
                        )}
                        {desc ? <p className="activity-desc">{desc}</p> : <></>}
                      </div>
                    </div>
                  );
                })}

                {nextPage ? (
                  <button
                    className="btn btn-sm d-flex justify-content-center align-items-center mx-auto mt-5 rounded-pill btn-dark"
                    onClick={fetchSpinWheelActivityLogsMore}
                    disabled={moreLoading}
                  >
                    {moreLoading ? "Loading..." : "Load more"}
                  </button>
                ) : (
                  <p className="text-center">
                    You've reached the end of the list
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="norecord-found">
              <h5>
                {loading ? (
                  "Loading..."
                ) : eligibleSpin ? (
                  <>
                    <span onClick={onHide}>
                      <a>SPIN NOW</a>{" "}
                    </span>
                    TO UNLOCK EPIC REWARDS!
                  </>
                ) : (
                  "No records found."
                )}
              </h5>
            </div>
          )}
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  ) : (
    <></>
  );
};

export default SpinWheelLogs;
