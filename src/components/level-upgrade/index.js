import React, { useEffect, useState } from "react";
import { Offcanvas, ProgressBar } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { currencyFormat, errorMessage } from "../../utils/common";
import {
  upgradableCost,
  upgradeNFTWithPayment,
} from "../../api/methods-marketplace";
import utCoin from "../../images/coin.png";
import cardSvg from "../../images/jump-trade/card-svg.svg";

import "./style.scss";
import { toast } from "react-toastify";
import NFTStat from "../nft-stat";
import { FaRegCheckCircle } from "react-icons/fa";
import { nftUpgradeCable } from "../../api/actioncable-methods";
import { BsFillTrophyFill } from "react-icons/bs";
const LevelUpgrade = ({
  nft,
  levelUpPop,
  setLevelUpPop,
  successValue,
  playerCard = false,
}) => {
  const { user } = useSelector((state) => state.user.data);
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [stats, setStats] = useState([]);
  const [cost, setCost] = useState({});
  const [paymentType, setPaymentType] = useState("ut");
  const [success, setSuccess] = useState(false);
  const [successData, setSuccessData] = useState({});

  useEffect(() => {
    if (levelUpPop) {
      getUpgradableCost(nft?.slug);
    }
  }, [levelUpPop]);

  useEffect(() => {
    nftUpgradeCable(nft?.slug, (data) => {
      if (data?.nft) {
        setSuccessData(data?.nft);
        setSuccess(true);
      }
    });
  }, []);

  const getUpgradableCost = async (slug) => {
    try {
      setLoading(true);
      const result = await upgradableCost(slug);
      setStats(result.data.data.stats);
      let defaultUtCoins = result?.data?.data?.cost?.ut;
      if (parseFloat(user?.jump_points_balance) < parseFloat(defaultUtCoins)) {
        setPaymentType("usd");
      }
      setCost(result.data.data.cost);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      setProcessing(true);
      const result = await upgradeNFTWithPayment(nft?.slug, paymentType);

      setSuccessData(result.data.data.nft);
      setSuccess(true);
      setProcessing(false);
    } catch (error) {
      let message = errorMessage(error?.response?.data?.fail_status);
      message && toast.error(message);
      setProcessing(false);
    }
  };

  return (
    <>
      <Offcanvas
        show={levelUpPop}
        onHide={() => setLevelUpPop(!levelUpPop)}
        placement="end"
        className="popup-wrapper-canvas"
        backdrop={"true"}
      >
        <Offcanvas.Body className="p-0 pop-body-container">
          <>
            {!success ? (
              <div className="pop-nft-details">
                <div className="pop-head-content">
                  <div className="pop-bid-title">
                    Confirm Upgrade to Level{" "}
                    {nft?.core_statistics?.next_level?.value}
                  </div>
                  <div
                    className="close-button-pop"
                    onClick={() => setLevelUpPop(!levelUpPop)}
                  >
                    <img
                      alt="close"
                      src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e"
                    ></img>
                  </div>
                </div>
                <div
                  className={`pop-bid-progress ${processing ? "loading" : ""}`}
                >
                  <div className="progress-complete"></div>
                </div>
                <div className="pop-body-content pre-success-content">
                  <div className="pop-nft-info ">
                    <div className="nft-detail pop-nft-image">
                      <h5>{nft?.name}</h5>
                      <div className="nft-image-block">
                        <img src={nft?.asset_url} />
                        {nft?.core_statistics?.rank?.value && (
                          <span className="nft-type-badge-rank">
                            <span className="rank-title">
                              <BsFillTrophyFill />{" "}
                              {` ${nft?.core_statistics?.rank?.value}/${nft?.core_statistics?.rank?.maximum}`}
                            </span>
                          </span>
                        )}
                        {/* {nft?.nft_type && (
                          <span className="nft-type-badge">
                            {nft?.nft_type.toUpperCase()}
                          </span>
                        )} */}
                        <NFTStat statistics={nft?.core_statistics} />
                      </div>
                    </div>
                    <div className="nft-stats pop-nft-stats">
                      <h5>Upcoming Player Stats</h5>
                      <ul className="nft-stats-block">
                        {stats.length > 0 &&
                          stats.map((stat, i) => (
                            <li>
                              <article className="nft-stats-box">
                                <div className="stats-header">
                                  <p className="key">{stat?.key_name}</p>
                                  <p className="value">
                                    {stat?.new_value} / {stat?.maximum}
                                  </p>
                                </div>
                                <ProgressBar
                                  className="stat-progress"
                                  min={0}
                                  max={stat?.maximum}
                                >
                                  <ProgressBar
                                    striped
                                    variant="current-value"
                                    now={stat?.current_value}
                                    label={
                                      stat?.current_value && (
                                        <span className="text-center centered current-value-text">
                                          {stat?.current_value}
                                        </span>
                                      )
                                    }
                                    min={0}
                                    max={stat?.maximum}
                                    key={1}
                                  />
                                  <ProgressBar
                                    variant="increase-value"
                                    now={stat?.increase_by}
                                    label={
                                      stat?.increase_by && (
                                        <span className="text-center centered increase-value-text">
                                          +{stat?.increase_by}
                                        </span>
                                      )
                                    }
                                    min={0}
                                    max={stat?.maximum}
                                    key={2}
                                  />
                                </ProgressBar>
                              </article>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                  <div className="nft-card-count">
                    <div className="d-flex align-items-center justify-content-start">
                      <div className="card-svg-icon">
                        <div className="imgBlock">
                          <img src={cardSvg} />
                          <p>{nft?.upgradable_cards?.total_needed}</p>
                        </div>
                      </div>
                      <div className="card-nft-title">
                        <p className="mb-0">
                          <span className="bg-card-text">
                            {nft?.name.replace(/\#.*/, "")}
                          </span>
                          <span>will be utilized to complete the upgrade</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="sticky-bottom-fix">
                    <div className="price-check-block">
                      <h4>How do you want to pay to upgrade?</h4>
                      <div className="price-check-box">
                        <div className={`form__radio-group`}>
                          <input
                            type="radio"
                            name="size"
                            id="large"
                            className="form__radio-input"
                            checked={paymentType === "ut"}
                            onChange={() => setPaymentType("ut")}
                            disabled={
                              parseInt(user?.jump_points_balance) <
                              parseInt(cost?.ut)
                            }
                          />
                          <label
                            className={`form__label-radio form__radio-label ${
                              parseInt(user?.jump_points_balance) <
                              parseInt(cost?.ut)
                                ? "disabled"
                                : ""
                            }`}
                            htmlFor="large"
                          >
                            <span className="form__radio-content">
                              <span className="form__radio-button"></span>
                              <span className="form__radio-value">
                                JT Points <span>{cost?.ut}</span>
                              </span>
                            </span>
                            <span className="form__radio-footer">
                              <span className="key">Available</span>
                              <span className="value">
                                <img src={utCoin} className="me-2 jt-coin" />

                                <span>{user?.jump_points_balance}</span>
                              </span>
                            </span>
                          </label>
                        </div>
                        <div className={`form__radio-group`}>
                          <input
                            type="radio"
                            name="size"
                            id="small"
                            className="form__radio-input"
                            checked={paymentType === "usd"}
                            onChange={() => setPaymentType("usd")}
                            disabled={
                              parseFloat(user?.balance) < parseFloat(cost?.usd)
                            }
                          />
                          <label
                            className={`form__label-radio form__radio-label ${
                              parseFloat(user?.balance) < parseFloat(cost?.usd)
                                ? "disabled"
                                : ""
                            }`}
                            htmlFor="small"
                          >
                            <span className="form__radio-content">
                              <span className="form__radio-button"></span>
                              <span className="form__radio-value">
                                Pay in USD{" "}
                                <span>
                                  {currencyFormat(
                                    cost?.usd,
                                    user.currency_name
                                  )}
                                </span>
                              </span>
                            </span>
                            <span className="form__radio-footer">
                              <span className="key">Balance</span>
                              <span className="value">
                                $ <span>{user?.balance}</span>
                              </span>
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bottom-area">
                    <div className="bottom-content-pop">
                      <div
                        className="back-button"
                        onClick={() => setLevelUpPop(!levelUpPop)}
                      >
                        Cancel
                      </div>
                      <div className="place-bid-button">
                        <button
                          className={`btn btn-dark text-center btn-lg w-75 rounded-pill place-bid-btn-pop `} //process -> proccessing
                          onClick={handlePayment}
                          disabled={(() => {
                            if (!paymentType || processing) {
                              return true;
                            } else if (
                              paymentType === "usd" &&
                              parseFloat(user?.balance) < parseFloat(cost?.usd)
                            ) {
                              return true;
                            } else if (
                              paymentType === "ut" &&
                              parseInt(user?.jump_points_balance) <
                                parseInt(cost?.ut)
                            ) {
                              return true;
                            } else {
                              return false;
                            }
                          })()}
                        >
                          <span>
                            {processing ? "Processing..." : "Upgrade"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="pop-nft-details">
                <div className="pop-head-content">
                  <div className="pop-bid-title">
                    Level Up Complete/Upgrade Complete
                  </div>
                  <div
                    className="close-button-pop"
                    onClick={() => {
                      successValue();
                      setLevelUpPop(!levelUpPop);
                    }}
                  >
                    <img
                      alt="close"
                      src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e"
                    ></img>
                  </div>
                </div>
                <div className={`pop-bid-progress`}>
                  <div className="progress-complete"></div>
                </div>
                <div className="pop-body-content success-content">
                  <div className="success-check">
                    <FaRegCheckCircle />
                    <h4>
                      Congratulations! Upgrade to Level{" "}
                      {successData?.core_statistics?.level?.value} Successful
                    </h4>
                  </div>
                  <div className="pop-nft-info ">
                    <div className="nft-detail pop-nft-image success-nft-card">
                      <h5>{successData?.name}</h5>
                      <div className="nft-image-block">
                        <img src={successData?.asset_url} />
                        {successData?.core_statistics?.rank?.value && (
                          <span className="nft-type-badge-rank">
                            <span className="rank-title">
                              <BsFillTrophyFill />{" "}
                              {` ${successData?.core_statistics?.rank?.value}/${successData?.core_statistics?.rank?.maximum}`}
                            </span>
                          </span>
                        )}
                        {/* {successData?.nft_type && (
                          <span className="nft-type-badge">
                            {nft?.nft_type.toUpperCase()}
                          </span>
                        )} */}
                        <NFTStat statistics={successData?.core_statistics} />
                      </div>
                    </div>
                    <div className="nft-stats pop-nft-stats">
                      <h5>New Player Stats</h5>
                      <ul className="nft-stats-block">
                        {stats.length > 0 &&
                          stats.map((stat, i) => (
                            <li>
                              <article className="nft-stats-box">
                                <div className="stats-header">
                                  <p className="key">{stat?.key_name}</p>
                                  <p className="value">
                                    {stat?.new_value} / {stat?.maximum}
                                  </p>
                                </div>

                                <ProgressBar
                                  className="stat-progress"
                                  min={0}
                                  max={stat?.maximum}
                                >
                                  <ProgressBar
                                    striped
                                    variant="current-value"
                                    now={stat?.new_value}
                                    label={
                                      stat?.new_value && (
                                        <span className="text-center centered current-value-text">
                                          {stat?.new_value}
                                        </span>
                                      )
                                    }
                                    min={0}
                                    max={stat?.maximum}
                                    key={1}
                                  />
                                </ProgressBar>
                              </article>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>

                  <div className="sticky-bottom-fix upgrade-success-card">
                    <div className="available-cards">
                      <div className="img-block">
                        <div className="nft-image-block">
                          <img src={successData?.upgradable_card?.image_url} />
                        </div>
                      </div>
                      <div className="info-block">
                        <h3>{successData?.upgradable_card?.name}</h3>
                        <h6>
                          Used Cards:{" "}
                          <div className="used_cards_number">
                            <span className="">{successData?.used_cards}</span>
                          </div>
                        </h6>
                        <h6>
                          Available Cards Now:{" "}
                          <div className="avl_cards_number">
                            <span className="">
                              {successData?.upgradable_card?.owned}
                            </span>
                          </div>
                        </h6>
                      </div>
                      {/* <div className="skew_box">
                        <div className="wrap">
                          <div className="box box1">
                            <p> Available Cards: </p>
                            <h2> {successData?.upgradable_card?.owned}</h2>
                          </div>
                          <div className="box box2">
                            <p>Used Cards:</p>
                            <h2>{successData?.used_cards}</h2>
                          </div>
                        </div>
                      </div> */}
                    </div>
                  </div>
                  <div className="bottom-area">
                    <div className="bottom-content-pop">
                      <div className="place-bid-button">
                        <button
                          className={`btn btn-dark text-center btn-lg w-75 rounded-pill place-bid-btn-pop `} //process -> proccessing
                          onClick={() => {
                            setSuccess(false);
                            setLevelUpPop(!levelUpPop);
                            history.push("/accounts/mynft");
                          }}
                        >
                          <span>Go to My NFTs</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default LevelUpgrade;
