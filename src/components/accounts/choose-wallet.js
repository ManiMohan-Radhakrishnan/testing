import React, { useState } from "react";
import { toast } from "react-toastify";
import { getGameWallet } from "../../api/methods";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { BsCheckCircleFill } from "react-icons/bs";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import jumplogo from "../../images/jump-trade/rangeslider.ico";
import { getCookies } from "../../utils/cookies";
import { user_load_by_token_thunk } from "../../redux/thunk/user_thunk";
import callitlogo from "../../images/call-it-logo-mark.png";

const ChooseWallet = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state);
  const [loading, setLoading] = useState(false);
  const [jumpPoint, setJumpPoint] = useState(
    !user?.data?.user?.jt_credit_wallet
      ? true
      : user?.data?.user?.jt_credit_wallet === "jump_point" || false
  );
  const [gameWallet, setGameWallet] = useState(
    user?.data?.user?.jt_credit_wallet === "game_profit" || false
  );

  const [walletName, setWalletName] = useState();

  const [show, setShow] = useState(false);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (value === "game_profit") {
      setGameWallet(checked);
      setJumpPoint(!checked);
      setShow(true);
      setWalletName("game_profit");
    } else if (value === "jump_point") {
      setJumpPoint(checked);
      setGameWallet(!checked);
      setShow(true);
      setWalletName("jump_point");
    }
  };

  const handleSubmit = async (value) => {
    try {
      setLoading(true);
      const result = await getGameWallet(value);

      if (result.data.success) {
        toast.success(result.data.message);
        setShow(false);
        dispatch(user_load_by_token_thunk(getCookies()));
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
    setLoading(false);
  };

  const closeModal = () => {
    setShow(false);
    if (walletName == "game_profit") {
      setGameWallet(false);
      setJumpPoint(true);
    } else {
      setGameWallet(true);
      setJumpPoint(false);
    }
  };

  return (
    <>
      <div className="whiteList-back auth-box">
        <h4 className="settings-card-title">Choose Wallet</h4>
        <p>Select your wallet preference for JT Points credit.</p>
        <div className="wallet-checkbox-block">
          <div class="up-in-toggle">
            <input
              type="radio"
              id="switch_jumpwallet"
              name="switch_2"
              value="jump_point"
              checked={jumpPoint}
              onChange={handleCheckboxChange}
            />
            <label for="switch_jumpwallet" className="jump-walet-label">
              <img className="jump" src={jumplogo} />
              GuardianLink Wallet
            </label>
            <input
              type="radio"
              id="switch_gamewallet"
              name="switch_2"
              value="game_profit"
              checked={gameWallet}
              onChange={handleCheckboxChange}
            />
            <label for="switch_gamewallet" className="game-walet-label">
              <img className="callit" src={callitlogo} />
              Game Profit Wallet
            </label>
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
          {walletName === "jump_point" ? (
            <div className="mb-2">
              <p>
                When the JT Points are credited to the GuardianLink wallet,
                please note that the TDS of 31.2% will be applicable for the
                Indian users.
              </p>
              <div className="walletmodal-btn-block">
                <button
                  type="button"
                  className="btn btn-dark mx-auto mb-3  mt-2 width-correction"
                  onClick={() => {
                    handleSubmit("jump_point");
                  }}
                  disabled={loading}
                >
                  {loading ? "Loading.." : "Confirm"}
                </button>
                <button
                  type="button"
                  className="btn btn-dark-secondary "
                  onClick={() => {
                    closeModal();
                    // setGameWallet(true);
                    // setJumpPoint(false);
                    //setShow(false);
                    //setWalletName("game_profit");

                    // dispatch(whitelistPopUp(false));
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : walletName === "game_profit" ? (
            <>
              {" "}
              <div className="mb-2">
                <p>
                  When the JT Points are credited directly to the Callit wallet,
                  you will receive your earnings in full, without any TDS
                  deductions.
                </p>

                <div className="walletmodal-btn-block">
                  <button
                    type="button"
                    className="btn btn-dark mx-auto mb-3  mt-2 width-correction"
                    onClick={() => {
                      handleSubmit("game_profit");
                    }}
                    disabled={loading}
                  >
                    {loading ? "Loading.." : "Confirm"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-dark-secondary "
                    onClick={() => {
                      closeModal();
                      // setGameWallet(false);
                      // setJumpPoint(true);
                      // dispatch(whitelistPopUp(false));
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ChooseWallet;
