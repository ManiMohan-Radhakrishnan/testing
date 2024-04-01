import React, { useEffect, useState } from "react";
import fusorImage from "../../images/nft-card.png";
import "./style.scss";
import FusorHistoryPopup from "./fusor-history-popup";
import { getFusorLogs, userOwnedNFTsApi } from "../../api/methods-marketplace";
import dayjs from "dayjs";

const FusorLogs = () => {
  const [fusorNftHistoryPopup, setFusorNftHistoryPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fusorLogsLIst, setFusorLogsList] = useState([]);
  const [detailsFusor, setDetailsFusor] = useState({});

  useEffect(() => {
    getLogsFuserList();
  }, []);

  const getLogsFuserList = async () => {
    try {
      setLoading(true);
      const result = await getFusorLogs();
      setLoading(false);
      setFusorLogsList(result?.data?.data?.histories);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="main-content-block">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="wallet-user mt-3">
                <div className="row align-items-center">
                  <div className="col-lg-12">
                    <h3 className="about-title">Fusion History</h3>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12">
                    <table
                      className="display theme-table fusor-history-table"
                      style={{ width: "100%" }}
                    >
                      <thead>
                        <tr>
                          <th className="count">#</th>
                          <th className="name">Fusor</th>
                          <th className="date text-right">Fusion Date</th>
                          <th className="action text-right"> </th>
                        </tr>
                      </thead>
                      <tbody>
                        {fusorLogsLIst?.length > 0 ? (
                          <>
                            {fusorLogsLIst?.map((items, index) => {
                              let fusor = items?.nft_details;
                              return (
                                <>
                                  <tr>
                                    <td className="count">{index + 1}</td>
                                    <td className="name">
                                      <div className="fusor-history-info">
                                        <div className="fusor-img">
                                          <img
                                            src={
                                              fusor?.fused_nfts[2]?.cover_url ||
                                              fusorImage
                                            }
                                          />
                                        </div>
                                        <div className="fusor-content">
                                          <h5>{fusor?.fused_nfts[2]?.name}</h5>
                                          {/* <h6>Fusor Category</h6> */}
                                        </div>
                                      </div>
                                    </td>
                                    <td className="date text-right">
                                      {dayjs(items?.updated_at).format(
                                        "DD MMM YYYY hh:mma"
                                      )}
                                    </td>
                                    <td className="action text-right">
                                      <button
                                        class="fusor-btn btn"
                                        onClick={() => {
                                          setFusorNftHistoryPopup(
                                            !fusorNftHistoryPopup
                                          );
                                          setDetailsFusor(fusor);
                                        }}
                                      >
                                        View details
                                      </button>{" "}
                                    </td>
                                  </tr>
                                </>
                              );
                            })}
                          </>
                        ) : (
                          <>
                            <tr>
                              <td colSpan={4}>
                                <span className="no-record-found">
                                  {loading ? "Loading..." : "No Records Found"}
                                </span>
                              </td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FusorHistoryPopup
        setFusorNftHistoryPopup={() => {
          setFusorNftHistoryPopup(false);
          setDetailsFusor({});
        }}
        fusorNftHistoryPopup={fusorNftHistoryPopup}
        detailsFusor={detailsFusor}
      />
    </>
  );
};

export default FusorLogs;
