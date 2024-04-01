import React, { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import QRCode from "react-qr-code";
import { toast } from "react-toastify";

import CopyToClipboardComponent from "./../copy-to-clipboard";
import { currencyFormat } from "./../../utils/common";
import { fireBlockFetchAddress, fireBlockRefresh } from "../../api/methods";
import { user_load_by_token_thunk } from "./../../redux/thunk/user_thunk";
import { getCookies } from "../../utils/cookies";

import "./style.scss";

const CryptoDetails = ({ addFund, setAddFund }) => {
  const { user } = useSelector((state) => state.user.data);
  const [loading, setLoading] = useState(false);
  const [showQrcode, setShowQrcode] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const [refresh, setRefresh] = useState(false);
  const dispatch = useDispatch();

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

  const fetchAddress = async () => {
    try {
      setLoading(true);
      await fireBlockFetchAddress();
      setLoading(false);
      toast.success("Your Wallet Address Was Generated Successfully.");
      dispatch(user_load_by_token_thunk(getCookies()));
    } catch (error) {
      setLoading(false);
      toast.error("An unexpected error occured. Please try again ");
      console.log(
        "🚀 ~ file: index.js ~ line 16 ~ fetchAddress ~ error",
        error
      );
    }
  };

  const fireBlockRefreshCall = async () => {
    try {
      setLoading(true);
      const result = await fireBlockRefresh();
      setLoading(false);

      if (result.data.data.balance === user.balance) {
        if (showQrcode) {
          toast.info(
            "Now please wait for some more time & Refresh again! Rare congestions can sometimes delay payment fulfilments."
          );
        }
      } else {
        dispatch(user_load_by_token_thunk(getCookies()));
      }
    } catch (error) {
      setLoading(false);
      if (showQrcode) {
        toast.error("An unexpected error occured. Please try again ");
      }
      console.log(
        "🚀 ~ file: index.js ~ line 16 ~ fetchAddress ~ error",
        error
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
          {user.crypto_address ? (
            <>
              {showQrcode && (
                <>
                  <div className="d-flex justify-content-between ac-cc-title">
                    <div>Scan Code</div>
                  </div>
                  <div className="text-center mt-4">
                    <QRCode value={user.crypto_address} width="100%" />
                  </div>
                  <div className="mt-4">
                    <CopyToClipboardComponent copyText={user.crypto_address} />
                  </div>
                  <button
                    disabled={refresh}
                    type="button"
                    className="btn btn-dark mt-4 mb-2 mx-auto"
                    onClick={() => {
                      fireBlockRefreshCall();
                      setRefresh(true);
                    }}
                  >
                    {(() => {
                      if (refresh) {
                        return seconds;
                      } else if (loading && !refresh) {
                        return "Processing please wait...";
                      } else {
                        return "Refresh Balance";
                      }
                    })()}
                    {/* {refresh ? seconds : "Refresh Balance"} */}
                  </button>
                </>
              )}

              <div className="mt-5 mb-4 qr-terms border p-4 rounded-3">
                <ol>
                  <li>
                    Please deposit <b>ONLY USDT</b> (US Dollar Tether),{" "}
                    <b>USDC</b>. In addition, MANDATORILY, make sure that the{" "}
                    <b>USDT</b> and the <b>USDC</b> you transfer is compliant
                    with Ethereum's ERC-20, Polygon's ERC-20, or Binance Smart
                    Chain (BSC)'s BEP-20 token standards, and the{" "}
                    {/* <b>BUSD</b> is compliant with  */}
                    Ethereum's ERC-20 or Binance Smart Chain (BSC)'s BEP-20
                    token standards. Any other coin or any other non-compliant
                    standard token transferred to the GuardianLink wallet will
                    result in an irreversible and non-refundable loss of funds
                  </li>
                  <li>
                    The minimum deposit amount is{" "}
                    {process.env.REACT_APP_CRYPTO_MIN_FUND} <b>USDT/USDC</b>.
                    Any deposit below {process.env.REACT_APP_CRYPTO_MIN_FUND}{" "}
                    <b>USDT/USDC</b> will not be supported and cannot be
                    recovered/refunded.
                  </li>
                  <li>
                    The address only supports <b>USDT/USDC</b> (Ethereum
                    ERC-20/Polygon ERC-20/BSC BEP-20). and
                    {/* <b>BUSD</b>  */}
                    (Ethereum ERC-20/BSC BEP-20), and no other
                    coin/chain/standard. OMNI wallets are not supported.
                  </li>
                  <li>
                    When you make payments with cryptocurrency, you transact
                    with Guardian Blockchain Labs Pte Ltd.
                  </li>
                </ol>
              </div>

              {!showQrcode && (
                <button
                  type="button"
                  className="btn btn-dark mt-2 mb-4 mx-auto"
                  onClick={() => {
                    setShowQrcode(!showQrcode);
                    fireBlockRefreshCall();
                  }}
                >
                  Show Address
                </button>
              )}
            </>
          ) : (
            <>
              <button
                disabled={loading}
                type="button"
                className="btn btn-dark w-100 rounded-pill btn-af-pay mt-4 mb-4"
                onClick={fetchAddress}
              >
                {loading ? "Processing please wait..." : "Generate Address"}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CryptoDetails;
