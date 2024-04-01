import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FiArrowLeft } from "react-icons/fi";
import { currencyFormat } from "../../utils/common";

import "./style.scss";
import { toast } from "react-toastify";
import { OnrampInstantSDK } from "@onramp.money/onramp-web-sdk";
import { Modal } from "react-bootstrap";

const BitbnsPayment = ({ setAddFund, addFund }) => {
  const { user } = useSelector((state) => state.user.data);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const openBitbns = () => {
    setShow(!show);
    setAddFund(!addFund);
    // new OnrampInstantSDK({
    //   appId: process.env.REACT_APP_RAMP_BITBNS_APP_ID,
    //   walletAddress: user?.crypto_address,
    // }).show();
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

        <div className="mt-5 mb-4 qr-terms border p-4 rounded-3">
          When you make payments using Onramp, your payment is processed in
          equivalent USD, and you transact with Guardian Blockchain Labs Pte
          Ltd.
        </div>

        <>
          <div className="mt-3 mb-4 text-center">
            <button
              disabled={loading}
              type="button"
              className="btn btn-dark w-100 rounded-pill btn-af-pay"
              onClick={() => setShow(true)}
            >
              {loading ? "Processing please wait..." : "Deposit"}
            </button>
          </div>
        </>
        <Modal
          backdrop={"static"}
          show={show}
          onHide={() => setShow(false)}
          size={"lg"}
          className="bitbns-deposite-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Onramp Payment Gateway</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <iframe
              height="100%"
              title="Onramp Ramp Widget"
              src={`https://onramp.money/app/?appId=${process.env.REACT_APP_RAMP_BITBNS_APP_ID}&walletAddress=${user?.crypto_address}`}
              frameBorder="no"
              allowTransparency="true"
              allowFullscreen=""
              style={{
                display: "block",
                width: "100%",
                maxHeight: "100%",
                maxWidth: "100%",
              }}
            ></iframe>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default BitbnsPayment;
