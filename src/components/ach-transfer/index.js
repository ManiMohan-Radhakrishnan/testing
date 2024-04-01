import React, { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { currencyFormat, validateCurrency } from "./../../utils/common";
import ContentLoader from "react-content-loader";
import { useSelector } from "react-redux";
import { FiArrowLeft } from "react-icons/fi";
import { PlaidLink } from "react-plaid-link";

import { getCookies } from "../../utils/cookies";
import fracto from "../../images/fracto.svg";
import BankAccount from "../bank-account-fracto";
import {
  getlinkToken,
  achPayment,
  fetchFractoCardApi,
  detachFractoACHApi,
  achVerify,
} from "../../api/methods";
import "./style.scss";

const ACHPayment = ({
  setAddFund,
  addFund,
  getTransactionHistory,
  setPageNo,
  getDepositStat,
}) => {
  const refAmount = useRef(null);
  const { user } = useSelector((state) => state.user.data);
  const [error, setError] = useState();
  const [getLoading, setGetLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState();

  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    fetchAllAccounts();
  }, [trigger]);

  useEffect(() => {
    async function createLinkToken() {
      const token = getCookies();
      let response = await getlinkToken();

      setToken(response.data.data.link_token);
    }
    createLinkToken();
  }, []);

  const fetchAllAccounts = async () => {
    try {
      setGetLoading(true);
      const result = await fetchFractoCardApi();
      setAccounts(
        result.data.data.payment_methods.filter((obj) => obj.type === "ach")
      );
      setGetLoading(false);
    } catch (err) {
      setGetLoading(false);
      console.log(
        "🚀 ~ file: index.js ~ line 52 ~ fetchAllAccounts ~ err",
        err
      );
    }
  };

  const handleAccountChange = (index) => {
    const info = [...accounts];
    for (let i = 0; i < info.length; i++) {
      info[i] = { ...info[i], active: false };
    }
    info[index] = { ...info[index], active: true };
    setAccounts(info);
  };

  const handleRemoveAccounts = async (id) => {
    try {
      await detachFractoACHApi(id);
      toast.success(
        "Your Account Has Successfully Been Removed. You Can Add The Account Again At Any Time"
      );
      setTrigger(!trigger);
    } catch (error) {
      toast.error("An unexpected error occured. Please try again  later");
      console.log(
        "🚀 ~ file: index.js ~ line 59 ~ handleRemoveAccounts ~ error",
        error
      );
    }
  };

  const handlePayment = async () => {
    const selectedAccount = accounts.find((o) => o?.active === true);

    if (selectedAccount) {
      if (
        amount &&
        parseFloat(amount) >=
          parseFloat(process.env.REACT_APP_FRACTO_ACH_MIN_FUND) &&
        parseFloat(amount) <=
          parseFloat(process.env.REACT_APP_FRACTO_ACH_MAX_FUND)
      ) {
        try {
          setError(undefined);
          setLoading2(true);
          const result = await achPayment({
            paymentmethod_id: selectedAccount.paymentmethod_id,
            amount,
          });
          console.log(
            "🚀 ~ file: index.js ~ line 112 ~ handlePayment ~ result",
            result
          );

          setLoading2(false);

          toast.success("Your payment has been initiated successfully");
          getTransactionHistory(1);
          setAddFund({ ...addFund, show: false });
          getDepositStat();

          setPageNo(1);
        } catch (error) {
          setLoading2(false);
          toast.error("Your payment failed. Please try again");

          console.log(
            "🚀 ~ file: index.js ~ line 46 ~ handlePayment ~ error",
            error
          );
        }
      } else {
        setError(
          `Please enter the amount minimum of $${process.env.REACT_APP_FRACTO_ACH_MIN_FUND} and maximum of $${process.env.REACT_APP_FRACTO_ACH_MAX_FUND} to fund your GuardianLink wallet`
        );
      }
    } else {
      setError("Please select the account to proceed");
    }
  };

  const onSuccess = useCallback(async (public_token, metadata) => {
    setLoading(true);
    try {
      await achVerify({
        accountId: metadata.accounts[0].id,
        publicToken: public_token,
      });
      setLoading(false);

      toast.success("Your account has been added successfully");
      setTrigger(!trigger);
    } catch (error) {
      setLoading(false);
      console.log("🚀 ~ file: index.js ~ line 46 ~ onSuccess ~ error", error);

      toast.error(
        "A bank account with the same bank is associated with your Jump.trade account - you can have only one bank account per bank attached to Jump.trade. You can choose to remove your existing account or add another bank's account."
      );
    }
  }, []);

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

        <>
          <div className="mt-3 mb-3">
            <div className="text-secondary mt-5 ac-step">Step 1</div>
            <div className="d-flex justify-content-between ac-cc-title">
              Choose a Bank Accounts
            </div>

            {getLoading ? (
              <AccountLoader />
            ) : (
              <>
                {accounts.map((o, i) => (
                  <div>
                    <BankAccount
                      isActive={o.active}
                      key={`bankaccount${i}`}
                      id={o.paymentmethod_id}
                      number={`xxxxxxxx${o.last4}`}
                      onClick={() => handleAccountChange(i)}
                      onRemove={handleRemoveAccounts}
                    />
                  </div>
                ))}
              </>
            )}
          </div>

          {!token ? (
            // insert your loading animation here
            <button
              type="button"
              className="btn btn-dark w-100 rounded-pill btn-af-pay"
              disabled={true}
            >
              Please wait...
            </button>
          ) : (
            <>
              {!loading ? (
                accounts.length < 2 ? (
                  <PlaidLink
                    className="btn btn-dark w-100 rounded-pill btn-af-pay custom-bank"
                    token={token}
                    onSuccess={onSuccess}
                    dis
                    // onExit={...}
                    // onEvent={...}
                  >
                    Add a bank account
                  </PlaidLink>
                ) : (
                  <button
                    type="button"
                    className="btn btn-dark w-100 rounded-pill btn-af-pay custom-bank"
                    disabled
                  >
                    Max. two accounts only allowed
                  </button>
                )
              ) : (
                <button
                  className="btn btn-dark w-100 rounded-pill btn-af-pay custom-bank"
                  disabled
                >
                  Processing...
                </button>
              )}
            </>
          )}

          <div className="mt-3 mb-3">
            <div className="text-secondary mt-5 ac-step">Step 2</div>
            <div className="d-flex justify-content-between ac-cc-title">
              Payment Amount
            </div>

            <div className="sf-amt-container">
              <div className="af-symbol">$</div>
              <input
                ref={refAmount}
                type="text"
                value={amount}
                disabled={loading}
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
        </>
        <div className="mb-4 text-center">
          <button
            disabled={loading2}
            type="button"
            className="btn btn-dark w-100 rounded-pill btn-af-pay"
            onClick={handlePayment}
          >
            {loading2 ? "Processing please wait..." : "Pay"}
          </button>
          <label className="loaded-info">
            You need to fund your GuardianLink wallet with a minimum of $
            {process.env.REACT_APP_FRACTO_ACH_MIN_FUND} and maximum of $
            {process.env.REACT_APP_FRACTO_ACH_MAX_FUND} per transaction
          </label>
        </div>
        <div className="mt-4 mb-4 p-3 rounded-3 border ">
          <p className="card-info">
            Please note that payments made using Automated Clearing House (ACH)
            will take about 2-3 business days to get cleared and reflect in your
            wallet. The completion of your payment is subject to
            terms/permissions of your financial institution.
          </p>
          <p className="card-info">
            When you make payments using ACH, your payment is processed in
            equivalent USD, and you transact with Jump.trade.
          </p>
        </div>

        <div className="fracto-brand">
          Powered by <img src={fracto} />
        </div>
      </div>
    </>
  );
};

export default ACHPayment;

const AccountLoader = (props) => (
  <ContentLoader viewBox="0 0 100% 200" height={65} width={"100%"} {...props}>
    <rect width="100%" height="180" max-height="65" />
  </ContentLoader>
);
