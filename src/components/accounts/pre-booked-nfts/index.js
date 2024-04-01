import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import ContentLoader from "react-content-loader";
import { useDispatch } from "react-redux";
import {
  get_pre_booked_nfts_list,
  get_pre_booked_nfts_list_logs,
} from "../../../redux/thunk/user_thunk";
import { currencyFormat, purchasedDate } from "../../../utils/common";
import tesla from "../../../images/jump-trade/eth1.png";
import utCoin from "../../../images/coin.png";
import { FiMinus, FiPlus } from "react-icons/fi";
import "./style.scss";

const PreBookedNFTs = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [plusIconEnable, setplusIconEnable] = useState(false);
  const [logLoading, setLogLoading] = useState(false);
  const [preBookedNFTsList, setPreBookedNFTsList] = useState([]);
  const [preBookedLogsList, setPreBookedLogsList] = useState([]);
  const [slug, setSlug] = useState("");

  const dispatchCallback = (response) => {
    if (response?.status === 200) {
      setPreBookedNFTsList(response?.data?.data?.preorder_summary);
    }
    setLoading(false);
  };
  const dispatchCallbackLogs = (response) => {
    setLogLoading(false);
    if (response?.status === 200) {
      setPreBookedLogsList(response?.data?.data?.preorders);
    }
  };

  useEffect(() => {
    setLoading(true);
    dispatch(get_pre_booked_nfts_list({ callback: dispatchCallback }));
  }, [dispatch]);

  const getPreBookLogs = (orderSlug) => {
    setLogLoading(true);
    setPreBookedLogsList([]);
    if (slug === orderSlug) {
      setSlug("");
      setplusIconEnable(false);
    } else {
      setSlug(orderSlug);
      setplusIconEnable(true);
    }
    dispatch(
      get_pre_booked_nfts_list_logs({
        callback: dispatchCallbackLogs,
        slug: orderSlug,
      })
    );
  };
  // const handleDown = (orderSlug) => {};

  return (
    <div className="main-content-block">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="wallet-user mt-3">
              <div className="row align-items-center">
                <div className="col-lg-12">
                  <h3 className="about-title">Pre-Book</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-12">
            <div className="prebook-status-table-block">
              <div className="prebook-status-table">
                <div className="table-content-block">
                  {loading ? (
                    <div className="p-5 text-center">Loading...</div>
                  ) : (
                    <>
                      <table
                        id="example"
                        className="display theme-table prebook-table"
                        style={{ width: "100%" }}
                      >
                        <thead>
                          <tr>
                            <th className="expand-icon"></th>
                            <th className="count">#</th>
                            <th className="name">COLLECTION</th>
                            <th className="date">PRE-BOOKED ON</th>
                            <th className="quantity">Pre-Booked </th>
                            <th className="alloted">Allocated</th>
                            <th className="amount">FUNDS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {preBookedNFTsList.length > 0 ? (
                            <>
                              {preBookedNFTsList.map((orderDetails, i) => (
                                <>
                                  <tr key={`tran-row-${i}`}>
                                    <td className="expand-icon">
                                      <span
                                        onClick={() => {
                                          getPreBookLogs(orderDetails?.slug);
                                        }}
                                      >
                                        {slug === orderDetails?.slug ? (
                                          <FiMinus />
                                        ) : (
                                          <FiPlus />
                                        )}
                                      </span>{" "}
                                    </td>
                                    <td className="count"> {i + 1}</td>
                                    <td className="name">
                                      {orderDetails.name}
                                    </td>
                                    <td className="date">
                                      {dayjs(
                                        orderDetails?.updated_at
                                          ? orderDetails?.updated_at
                                          : orderDetails?.created_at
                                      ).format(" D MMM YYYY hh:mma")}
                                    </td>
                                    <td className="quantity">
                                      {orderDetails.reserved}
                                    </td>
                                    <td className="alloted">
                                      {orderDetails?.settled === 0 ||
                                      orderDetails?.settled
                                        ? orderDetails?.settled
                                        : "-"}
                                    </td>
                                    <td className="amount">
                                      {currencyFormat(
                                        orderDetails.amount,
                                        "USD"
                                      )}{" "}
                                    </td>
                                  </tr>
                                  <tr className="fold-row">
                                    <td colspan="7">
                                      <table
                                        className="fold-row-table"
                                        style={{ width: "100%" }}
                                      >
                                        {preBookedLogsList?.length > 0 &&
                                        slug === orderDetails?.slug ? (
                                          <>
                                            {preBookedLogsList?.map(
                                              (logs, index) => {
                                                let {
                                                  name,
                                                  quantity,
                                                  total_amount,
                                                  approved,
                                                  splitup,
                                                  status,
                                                  created_at,
                                                } = logs;
                                                return (
                                                  <>
                                                    <tr key={`logs-${index}`}>
                                                      <td className="expand-icon"></td>
                                                      <td className="count">
                                                        {/* {index + 1} */}
                                                      </td>
                                                      <td className="name">
                                                        {name ? name : <></>}
                                                      </td>
                                                      <td className="date">
                                                        {created_at ? (
                                                          <>
                                                            {dayjs(
                                                              created_at
                                                            ).format(
                                                              " D MMM YYYY hh:mma"
                                                            )}
                                                          </>
                                                        ) : (
                                                          <></>
                                                        )}
                                                      </td>
                                                      <td className="quantity">
                                                        {quantity ? (
                                                          <>{quantity}</>
                                                        ) : (
                                                          <></>
                                                        )}
                                                      </td>
                                                      <td className="alloted"></td>

                                                      <td className="amount">
                                                        {/* {splitup?.usd ? (
                                                          <>
                                                            {currencyFormat(
                                                              splitup?.usd,
                                                              "USD"
                                                            )}
                                                          </>
                                                        ) : (
                                                          <></>
                                                        )}
                                                        {splitup?.jump_point ? (
                                                          <>
                                                            {splitup?.usd && (
                                                              <> + </>
                                                            )}
                                                            {
                                                              splitup?.jump_point
                                                            }{" "}
                                                            <img
                                                              src={utCoin}
                                                              className="coin-icon"
                                                            />
                                                          </>
                                                        ) : (
                                                          <></>
                                                        )}
                                                        {splitup?.reward_point ? (
                                                          <>
                                                            $
                                                            {splitup?.usd ||
                                                              (splitup?.jump_point && (
                                                                <> + </>
                                                              ))}
                                                            {
                                                              splitup?.reward_point
                                                            }{" "}
                                                            <img
                                                              src={tesla}
                                                              className="coin-icon"
                                                            />
                                                          </>
                                                        ) : (
                                                          <></>
                                                        )} */}
                                                        {total_amount ? (
                                                          <>
                                                            {/* Total Amount{" "} */}
                                                            {currencyFormat(
                                                              total_amount,
                                                              "USD"
                                                            )}
                                                          </>
                                                        ) : (
                                                          <></>
                                                        )}
                                                      </td>
                                                    </tr>
                                                  </>
                                                );
                                              }
                                            )}
                                          </>
                                        ) : logLoading &&
                                          slug === orderDetails?.slug ? (
                                          <tr>
                                            <td
                                              colspan="6"
                                              className="text-center"
                                            >
                                              loading
                                            </td>
                                          </tr>
                                        ) : slug === orderDetails?.slug ? (
                                          <tr>
                                            <td
                                              colspan="6"
                                              className="text-center"
                                            >
                                              No records found
                                            </td>
                                          </tr>
                                        ) : (
                                          <></>
                                        )}
                                      </table>
                                    </td>
                                  </tr>
                                </>
                              ))}
                            </>
                          ) : (
                            <tr className="text-center">
                              <td colSpan={5}>
                                You have not made any pre-bookings yet.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Loader = (props) => (
  <ContentLoader
    viewBox="0 0 900 400"
    width={"100%"}
    height={"100%"}
    backgroundColor="#f5f5f5"
    foregroundColor="#dbdbdb"
    className="mt-0"
    {...props}
  >
    <rect x="0" y="5" rx="5" ry="5" width="900" height="100" />
    <rect x="0" y="120" rx="5" ry="5" width="900" height="100" />
    <rect x="0" y="235" rx="5" ry="5" width="900" height="100" />
  </ContentLoader>
);

export default PreBookedNFTs;
