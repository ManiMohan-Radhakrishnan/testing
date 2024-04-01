import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiArrowLeft, FiPlusSquare } from "react-icons/fi";
import ContentLoader from "react-content-loader";
import { Carousel } from "react-responsive-carousel";
import { useSelector } from "react-redux";

import { detachFractoCardApi, ccFractoPayment, xena } from "../../api/methods";
import NewCardForm from "./../new-card-fracto";
import { BiX } from "react-icons/bi";
import BankCard from "./../bank-card-fracto";
import ToolTip from "../tooltip";
import { fetchFractoCardApi } from "./../../api/methods";
import fracto from "../../images/fracto.svg";
import { currencyFormat, validateCurrency } from "./../../utils/common";
import { getCookiesByName } from "../../utils/cookies";

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import "./style.scss";

const CardDetailsFracto = ({
  addFund,
  setAddFund,
  setPageNo,
  getTransactionHistory,
  isFirstDeposit,
  getDepositStat,
}) => {
  const { user } = useSelector((state) => state.user.data);
  const [modal, setModal] = useState(false);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [getLoading, setGetLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const [amount, setAmount] = useState("");
  const [cvv, setCvv] = useState("");

  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    fetchAllCards();
  }, [trigger]);

  const fetchAllCards = async () => {
    try {
      setGetLoading(true);
      const result = await fetchFractoCardApi();
      setCards(
        result.data.data.payment_methods.filter((obj) => obj.type === "card")
      );
      setGetLoading(false);
    } catch (err) {
      setGetLoading(false);
      console.log("🚀 ~ file: index.js ~ line 52 ~ fetchAllCards ~ err", err);
    }
  };

  const handleCardChange = (index) => {
    const info = [...cards];
    for (let i = 0; i < info.length; i++) {
      info[i] = { ...info[i], active: false };
    }
    info[index] = { ...info[index], active: true };
    setCards(info);
  };

  const handleRemoveCard = async (id) => {
    try {
      await detachFractoCardApi(id);
      toast.success(
        "Your Card Has Successfully Been Removed. You Can Add The Card Again At Any Time"
      );
      setTrigger(!trigger);
    } catch (error) {
      toast.error("An unexpected error occured. Please try again  later");
      console.log(
        "🚀 ~ file: index.js ~ line 59 ~ handleRemoveCard ~ error",
        error
      );
    }
  };

  const handlePayment = async () => {
    const selectedCard = cards.find((o) => o?.active === true);

    if (selectedCard) {
      if (cvv) {
        if (
          amount &&
          parseFloat(amount) >=
            parseFloat(process.env.REACT_APP_FRACTO_MIN_FUND) &&
          parseFloat(amount) <=
            parseFloat(process.env.REACT_APP_FRACTO_MAX_FUND)
        ) {
          try {
            setError(undefined);
            setLoading(true);
            const result = await ccFractoPayment(
              selectedCard.paymentmethod_id,
              amount,
              cvv
            );

            setLoading(false);
            toast.success(result.data.message);

            // XENA Marketing Deposit Endpoint
            if (getCookiesByName("aid")) {
              xena({
                code: 10033,
                uid: user?.slug,
                aid: getCookiesByName("aid") || "",
                campaign: getCookiesByName("campaign") || "",
                source: getCookiesByName("source") || "",
                vid: getCookiesByName("vid") || "",
                click_id: getCookiesByName("click_id") || "",
                event_name: "deposit",
                ftd: isFirstDeposit ? 1 : 0,
                deposit_amt: amount,
                payment_type: "fracto_card",
                is_datas_present: "true",
              });
            } else {
              xena({
                uid: user?.slug,
                event_name: "deposit",
                ftd: isFirstDeposit ? 1 : 0,
                deposit_amt: amount,
                payment_type: "fracto_card",
                is_datas_present: "false",
              });
            }

            setAddFund({ ...addFund, show: false });
            getDepositStat();

            setPageNo(1);
            getTransactionHistory(1);
          } catch (error) {
            setLoading(false);
            toast.error(error?.data?.message);
            console.log(
              "🚀 ~ file: index.js ~ line 46 ~ handlePayment ~ error",
              error
            );
          }
        } else {
          setError(
            `Please enter the amount minimum of $${process.env.REACT_APP_FRACTO_MIN_FUND} and maximum of $${process.env.REACT_APP_FRACTO_MAX_FUND} to fund your GuardianLink wallet`
          );
        }
      } else {
        setError("Please enter the CVV for the selected card");
      }
    } else {
      setError("Please select the card");
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
          <div className="text-secondary mt-5 ac-step">Step 1</div>

          <div className="d-flex justify-content-between ac-cc-title">
            Choose a Card
            {modal ? (
              <BiX
                size={30}
                className="text-secondary"
                onClick={() => setModal(false)}
                role="button"
              />
            ) : (
              cards.length !== 0 && (
                <ToolTip
                  content={"Add New Card"}
                  placement="top"
                  icon={
                    <FiPlusSquare
                      size={30}
                      className="text-secondary"
                      onClick={() => setModal(true)}
                      role="button"
                    />
                  }
                />
              )
            )}
          </div>

          {modal ? (
            <div>
              <NewCardForm
                handleHide={setModal}
                setTrigger={setTrigger}
                trigger={trigger}
              />
            </div>
          ) : (
            <div className="row mt-3">
              <div className="col-12">
                {getLoading ? (
                  <CardLoader />
                ) : (
                  <>
                    {cards.length > 0 ? (
                      <Carousel autoPlay={false}>
                        {cards.map((o, i) => (
                          <div>
                            <BankCard
                              isActive={o.active}
                              key={`bankcard${i}`}
                              id={o.paymentmethod_id}
                              number={`xxxx xxxx xxxx ${o.last4}`}
                              onClick={() => handleCardChange(i)}
                              onRemove={handleRemoveCard}
                            />
                          </div>
                        ))}
                      </Carousel>
                    ) : (
                      <div className="add-card-new">
                        <div
                          className="add-card-new-text"
                          role="button"
                          onClick={() => setModal(true)}
                        >
                          Add New Card
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {!modal && (
          <>
            <div className="mt-3 mb-3">
              <div className="text-secondary mt-4 ac-step">Step 2</div>

              <div className="d-flex justify-content-between ac-cc-title">
                CVV
              </div>
              <input
                type="password"
                value={cvv}
                className="form-control cvv-input"
                onChange={(e) => {
                  setError("");
                  if (e.target.value && e.target.value.length < 7) {
                    if (validateCurrency(e.target.value)) {
                      setCvv(e.target.value);
                    } else {
                      if (e.target.value.indexOf(".") !== -1) {
                        const str = e.target.value;
                        setCvv(str.substring(0, str.length - 1));
                      } else {
                        setCvv("");
                      }
                    }
                  } else {
                    setCvv("");
                  }
                }}
              />
              <div className="text-secondary mt-4 ac-step">Step 3</div>

              <div className="d-flex justify-content-between ac-cc-title">
                Payment Amount
              </div>

              <div className="sf-amt-container">
                <div className="af-symbol">$</div>
                <input
                  type="text"
                  value={amount}
                  className="af-amount"
                  onChange={(e) => {
                    setError("");
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
            <div className="mb-4 text-center">
              <button
                disabled={loading}
                type="button"
                className="btn btn-dark w-100 rounded-pill btn-af-pay"
                onClick={handlePayment}
              >
                {loading ? "Processing please wait..." : "Pay"}
              </button>
              <label className="loaded-info">
                You need to fund your GuardianLink wallet with a minimum of $
                {process.env.REACT_APP_FRACTO_MIN_FUND} and maximum of $
                {process.env.REACT_APP_FRACTO_MAX_FUND} per transaction
              </label>
            </div>
          </>
        )}
        <div className="mt-4 mb-4 p-3 rounded-3 border ">
          <p className="card-info">
            Your card may not have international transactions enabled. If your
            payment fails, please check with your bank to enable
            international/online transactions on your card and try again.
          </p>
          <p className="card-info">
            When you make payments using your credit card/debit card, your
            payment is processed in equivalent USD, and you transact with
            Jump.trade.
          </p>
        </div>

        <div className="fracto-brand">
          Powered by <img src={fracto} />
        </div>
      </div>
    </>
  );
};

export default CardDetailsFracto;

const CardLoader = (props) => (
  <ContentLoader viewBox="0 0 100% 200" height={200} width={"100%"} {...props}>
    <rect width="100%" height="180" max-height="180" />
  </ContentLoader>
);
