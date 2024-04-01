import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FiArrowLeft } from "react-icons/fi";
import { Modal } from "react-bootstrap";
import { currencyFormat } from "../../utils/common";
import { onMetaWidget } from "../../utils/onmeta-sdk";

import "./style.scss";

const OnmetaPayment = ({ setAddFund, addFund }) => {
  const { user } = useSelector((state) => state.user.data);
  const [show, setShow] = useState(false);

  let createWidget = new onMetaWidget({
    elementId: "onMetaWidget",
    apiKey: process.env.REACT_APP_ONMETA_KEY,
    userEmail: user?.email,
    walletAddress: user?.crypto_address,
    environment: process.env.REACT_APP_ONMETA_ENVIRONMENT, // staging || production
  });

  useEffect(() => {
    if (show) {
      createWidget.init();
      createWidget.on("ALL_EVENTS", (status) => console.log(status));
    }
  }, [show]);

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
              {currencyFormat(user?.balance, user?.currency_name)}
            </div>
          </div>
        </div>

        <div className="mt-5 mb-4 qr-terms border p-4 rounded-3">
          When you make payments using Onmeta, your payment is processed in
          equivalent USD, and you transact with Guardian Blockchain Labs Pte
          Ltd.
        </div>

        <>
          <div className="mt-3 mb-4 text-center">
            <button
              type="button"
              className="btn btn-dark w-100 rounded-pill btn-af-pay"
              onClick={() => setShow(true)}
            >
              Deposit
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
            <Modal.Title>Onmeta Payment Gateway</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="payment-block">
              <div id="onMetaWidget"></div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default OnmetaPayment;
