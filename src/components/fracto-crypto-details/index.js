import React, { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import QRCode from "react-qr-code";
import Select from "react-select";

import CopyToClipboardComponent from "../copy-to-clipboard";
import { currencyFormat, dot, validateCurrency } from "../../utils/common";
import { fractoCryptoPayment } from "../../api/methods";

import "./style.scss";
import NFTCounter from "../nft-counter";

const FractoCryptoDetails = ({
  addFund,
  setAddFund,
  setPageNo,
  getTransactionHistory,
  getDepositStat,
}) => {
  const { user } = useSelector((state) => state.user.data);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [showQrcode, setShowQrcode] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const [refresh, setRefresh] = useState(false);
  const dispatch = useDispatch();
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState();
  const [token, setToken] = useState();
  const [error, setError] = useState();
  const [selectedToken, setSelectedToken] = useState();

  useEffect(() => {
    let myInterval = 0;
    if (refresh) {
      myInterval = setInterval(() => {
        setSeconds(seconds - 1);
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else {
          setRefresh(false);
        }
      }, 1000);
    } else {
      setSeconds(30);
    }

    return () => {
      clearInterval(myInterval);
    };
  }, [seconds, refresh]);

  const crispStyle = {
    control: (prop) => ({
      ...prop,
      padding: ".8rem 0.8rem",
      borderRadius: "0.7rem",
      minHeight: "33px",
      fontSize: "1rem",
      fontWeight: "bolder",
      borderColor: "#000",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#000",
      },
      "&:focus": {
        boxShadow: "none",
        borderColor: "#000",
      },
      "&:active": {
        boxShadow: "none",
        borderColor: "#000",
      },
    }),
    input: (prop) => ({
      ...prop,
      margin: 0,
      padding: 0,
    }),
    valueContainer: (prop) => ({
      ...prop,
      margin: 0,
      padding: 0,
    }),
    singleValue: (styles, { data }) => ({
      ...styles,
      margin: 0,
      padding: 0,
      ...(data.color ? dot(data.color) : {}),
    }),

    dropdownIndicator: (prop) => ({
      ...prop,
      margin: 0,
      padding: "0 3px 0 0",
      color: "#000",
    }),
    indicatorsContainer: (prop) => ({
      ...prop,
      margin: 0,
      padding: 0,
    }),
    clearIndicator: (prop) => ({
      ...prop,
      margin: 0,
      padding: 0,
    }),
    indicatorSeparator: (prop) => ({
      ...prop,
      margin: "3px",
      padding: 0,
    }),
    noOptionsMessage: (prop) => ({
      ...prop,
      padding: 0,
      fontSize: "12px",
    }),
    option: (prop, { isSelected }) => ({
      ...prop,
      padding: "8px",
      fontSize: "1rem",
      backgroundColor: isSelected && "#000",
      fontFamily: "neue_helvetica_medium",
      "&:hover": {
        backgroundColor: !isSelected && "#ddd",
        color: !isSelected && "#000",
      },
      "&:active": {
        backgroundColor: "#ddd",
      },
    }),
    menu: (prop) => ({
      ...prop,
      borderRadius: "3px",
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999, top: base.top - 5 }),
  };

  const handleProceed = async () => {
    if (
      parseInt(amount) >= parseInt(process.env.REACT_APP_FRACTO_CRYPTO_MIN_FUND)
    ) {
      setShowQrcode(!showQrcode);

      try {
        setLoading1(true);
        const response = await fractoCryptoPayment(amount);

        setResult(response.data.data.pay);
      } catch (error) {
        console.log(
          "🚀 ~ file: index.js ~ line 94 ~ handleProceed ~ error",
          error
        );
      } finally {
        setLoading1(false);
      }
    } else {
      setError(
        `Payment should be minimum ${currencyFormat(
          process.env.REACT_APP_FRACTO_CRYPTO_MIN_FUND,
          "USD"
        )}`
      );
    }
  };

  return (
    <>
      <div className="inner-card-details">
        <div
          className="pay-list-back"
          role="button"
          onClick={() => setAddFund({ ...addFund, type: "" })}
        >
          <FiArrowLeft size={25} /> Back
        </div>

        <div className="bg-white mt-3 p-3 current-balance">
          <div className="cb-title">Current Balance</div>
          <div>
            <div className="cb-balance">
              {currencyFormat(user.balance, user.currency_name)}
            </div>
          </div>
        </div>

        <div className="mt-3">
          <>
            {showQrcode && (
              <>
                {loading1 ? (
                  <div className="text-center">Loading...</div>
                ) : (
                  <>
                    <div>
                      <div className="d-flex justify-content-between ac-cc-title">
                        Choose your Token
                      </div>

                      <Select
                        options={
                          result &&
                          result.currencies.map((o) => ({
                            label: `${o.token} - ${o.network}`,
                            value: o.token,
                          }))
                        }
                        value={
                          token &&
                          result.currencies.map((o) => {
                            if (o.token === token) {
                              return {
                                label: `${o.token} - ${o.network}`,
                                value: o.token,
                              };
                            }
                          })
                        }
                        styles={crispStyle}
                        onChange={(data) => {
                          setToken(data.value);
                          setSelectedToken(
                            result.currencies.find(
                              (o) => o.token === data.value
                            )
                          );
                        }}
                      />
                    </div>
                    <div className="d-flex justify-content-between ac-cc-title mt-3">
                      <div>Expires At</div>
                    </div>
                    <div className="text-center mt-4">
                      <NFTCounter
                        time={new Date(result.expiredAt * 1000)}
                        handleEndEvent={() => {
                          setAddFund({ ...addFund, show: false });
                          setPageNo(1);
                          getTransactionHistory(1);
                          getDepositStat();
                        }}
                      />
                    </div>
                  </>
                )}

                {selectedToken && (
                  <>
                    <div className="d-flex justify-content-between ac-cc-title mt-3">
                      <div>Scan Code</div>
                    </div>
                    <div className="text-center mt-4">
                      <QRCode value={selectedToken.address} width="100%" />
                    </div>
                    <div className="mt-4">
                      <CopyToClipboardComponent
                        copyText={selectedToken.address}
                      />
                    </div>
                    <div className="d-flex justify-content-between ac-cc-title mt-3">
                      <div>Amount of Tokens, that you should send</div>
                    </div>
                    <div className="mt-1">
                      <CopyToClipboardComponent
                        css="font-12"
                        copyText={selectedToken.amount}
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {!showQrcode && (
              <>
                <div className="mt-3 mb-3">
                  <div className="text-secondary mt-5 ac-step">Step 1</div>
                  <div className="d-flex justify-content-between ac-cc-title">
                    Payment Amount
                  </div>

                  <div className="sf-amt-container">
                    <div className="af-symbol">$</div>
                    <input
                      type="text"
                      value={amount}
                      disabled={loading}
                      className="af-amount"
                      onChange={(e) => {
                        if (e.target.value && e.target.value.length < 10) {
                          if (validateCurrency(e.target.value)) {
                            setAmount(e.target.value);
                          } else {
                            if (e.target.value.indexOf(".") !== -1) {
                              const str = e.target.value;
                              setAmount(str.substring(0, str.length - 1));
                            } else {
                              setAmount("");
                            }
                          }
                        } else {
                          setAmount("");
                        }
                      }}
                    />
                  </div>
                </div>
                {error && (
                  <div className="mb-3">
                    <h6 className="text-danger mb-0">{error}</h6>
                  </div>
                )}
                <button
                  type="button"
                  disabled={!amount}
                  className="btn btn-dark w-100 rounded-pill btn-af-pay mt-2"
                  onClick={handleProceed}
                >
                  Proceed
                </button>
              </>
            )}

            <div className="mt-5 mb-4 qr-terms border p-4 rounded-3">
              <ol>
                <li>
                  Fracto's crypto payment option enables you deposit USD
                  equivalents in an accepted range of crypto coins at
                  market-determined exchange rates.
                </li>
                <li>
                  The deposit address will be dynamically generated based on the
                  coin you choose. The addess is valid only for 30 minutes. Upon
                  failing to make a payment in 30 mins, you should re-initiate
                  your transaction.
                </li>
                <li>
                  The amount deposited should be exact as indicated. Depositing
                  lesser amounts might result in loss of funds. Any amount sent
                  in excess might also be forfeited.
                </li>
                <li>
                  Please ensure that you send ONLY the crypto coin you've chosen
                  and ONLY to the specified address.
                </li>
                <li>
                  The entire payment needs to be made in a single transaction.
                  Multiple payments for a single transactions will not be
                  considered valid.
                </li>
              </ol>
            </div>
          </>
        </div>
      </div>
    </>
  );
};

export default FractoCryptoDetails;
