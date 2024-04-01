import React, { useState } from "react";
import { toast } from "react-toastify";
import { getGameWallet } from "../../api/methods";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { BsCheckCircleFill } from "react-icons/bs";
import { Modal } from "react-bootstrap";
import { useSelector } from "react-redux";

// import jumpLogo from "";
// import CallitLogo from "";

const ChooseWallet = () => {
  const { user } = useSelector((state) => state);
  console.log(
    "🚀 ~ file: choose-wallet.js:11 ~ ChooseWal ~ user:",
    user?.data?.user
  );
  const [loading, setLoading] = useState(false);
  const [jumpPoint, setJumpPoint] = useState(true);
  console.log(
    "🚀 ~ file: choose-wallet.js:15 ~ ChooseWal ~ jumpPoint:",
    jumpPoint
  );
  const [show, setShow] = useState(false);

  const handleCheckboxChange = () => {
    // Toggle the state of the 'jumpPoint' variable
    setJumpPoint(!jumpPoint);
    setShow(true);
  };

  const handleSubmit = async (value) => {
    try {
      setLoading(true);
      const result = await getGameWallet(value);
      console.log(
        "🚀 ~ file: choose-wallet.js:29 ~ handleSubmit ~ result:",
        result
      );
      if (result.data.success) {
        toast.success(result.data.message);
        setShow(false);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
    setLoading(false);
  };

  const closeModal = () => {
    setShow(false);
  };

  return (
    <>
      <div className="whiteList-back auth-box">
        <h4 className="settings-card-title">Choose Wallet</h4>
        <p>
          Crypto wallet addresses whitelisted. You can delete the existing ones
          to add a new address
        </p>

        <div className="wallet-toggle-box">
          <div className="jump-wallet">
            <img
              src={
                "https://cdn.guardianlink.io/product-hotspot/images/jump/jump-trade-logo.svg"
              }
            />{" "}
            wallet
          </div>
          <label className="switch">
            <input
              type="checkbox"
              name="jump_point"
              checked={jumpPoint}
              onChange={handleCheckboxChange}
            />{" "}
            {/* <BsCheckCircleFill /> */}
            <span className="slider round"></span>
          </label>
          <div className="game-wallet">
            <img
              src={
                "https://cricsage.guardiannft.org/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcall-it-logo-mark.14c10632.png&w=384&q=75"
              }
            />{" "}
            Game wallet
          </div>
        </div>
      </div>

      <Modal
        show={show}
        //
        className="Modal-alert-mfa upi-modal"
        size="md"
        backdrop="static"
      >
        <Modal.Header onHide={closeModal} closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!jumpPoint ? (
            <div className="mb-2">
              <p>
                Note: Please add only the addresses that supports - Ethereum
                ERC-20/Polygon ERC-20/Binance BSC BEP-20, and no other
                chain/standard. Note: Please add only the addresses that
                supports - Ethereum ERC-20/Polygon ERC-20/Binance BSC BEP-20,
                and no other chain/standard.
              </p>

              <p>
                Note: Please add only the addresses that supports - Ethereum
                ERC-20/Polygon ERC-20/Binance BSC BEP-20, and no other
                chain/standard. Note: Please add only the addresses that
                supports - Ethereum ERC-20/Polygon ERC-20/Binance BSC BEP-20,
                and no other chain/standard.
              </p>
              <div className="walletmodal-btn-block">
                <button
                  type="button"
                  className="btn btn-dark mx-auto mb-3  mt-2 width-correction"
                  onClick={() => {
                    handleSubmit("jump_point");
                  }}
                >
                  Confirm JT
                </button>
                <button
                  type="button"
                  className="btn btn-dark-secondary "
                  onClick={() => {
                    closeModal();
                    // dispatch(whitelistPopUp(false));
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {" "}
              <div className="mb-2">
                <p>
                  Note: Please add only the addresses that supports - Ethereum
                  ERC-20/Polygon ERC-20/Binance BSC BEP-20, and no other
                  chain/standard.
                </p>

                <p>
                  Note: Please add only the addresses that supports - Ethereum
                  ERC-20/Polygon ERC-20/Binance BSC BEP-20, and no other
                  chain/standard. Note: Please add only the addresses that
                  supports - Ethereum ERC-20/Polygon ERC-20/Binance BSC BEP-20,
                  and no other chain/standard.
                </p>
                <div className="walletmodal-btn-block">
                  <button
                    type="button"
                    className="btn btn-dark mx-auto mb-3  mt-2 width-correction"
                    onClick={() => {
                      handleSubmit("game_profit");
                    }}
                  >
                    Confirm GW
                  </button>
                  <button
                    type="button"
                    className="btn btn-dark-secondary "
                    onClick={() => {
                      closeModal();
                      // dispatch(whitelistPopUp(false));
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ChooseWallet;
