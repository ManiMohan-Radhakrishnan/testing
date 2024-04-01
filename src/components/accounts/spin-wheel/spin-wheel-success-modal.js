import { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import ReactConfetti from "react-confetti";
import { useHistory } from "react-router-dom";
import useWindowUtils from "../../../hooks/useWindowUtils";

import prize_1 from "../../../images/spin-wheel/prizes/prize-1.png";
import { openWindow } from "../../../utils/common";
import BmwGif from "../../../images/Black_BMW_bike.gif";

import "./style.scss";

const SpinWheelSuccessModal = ({
  show = false,
  prize = {},
  onClick = () => {},
  onHide = () => {},
  event_type = "",
}) => {
  // const [height, setHeight] = useState(null);
  // const [width, setWidth] = useState(null);
  const { width, height } = useWindowUtils();

  // const [prizeImage, setPrizeImage] = useState(
  //   event_type === "referral" ? prize?.open_box_url : ""
  // );

  const history = useHistory();

  // useEffect(() => {
  //   if (show && event_type === "referral") {
  //     if (!prizeImage) setPrizeImage(prize?.open_box_url);
  //     setTimeout(() => setPrizeImage(prize?.image_url), 1300);
  //   }
  // }, [show]);

  return show ? (
    <>
      <Modal
        show={show}
        contentClassName="spin-modal"
        centered
        className="spin-success-modal"
      >
        {/* {prize?.won ? (
          <ReactConfetti
            numberOfPieces={window.innerWidth > 769 ? 700 : 400}
            width={width}
            height={height}
          />
        ) : (
          <></>
        )} */}
        <Modal.Header className="spin-modal-header" onHide={onHide} closeButton>
          {/* {prize?.won ? "Congratulations" : "Oops!"} */}
          {prize?.won ? (
            <ReactConfetti
              numberOfPieces={window.innerWidth > 769 ? 500 : 300}
            />
          ) : (
            <></>
          )}
          Congratulations
        </Modal.Header>
        <Modal.Body className="spin-modal-body">
          <div className="spin-gift-box">
            {prize?.event_name && <h3>{prize?.event_name}</h3>}
            <img
              className={`${event_type === "referral" ? "" : "default-box"}`}
              // src={event_type === "referral" ? prizeImage : prize?.image_url}
              src={
                event_type === "referral"
                  ? prize?.open_box_url
                  : prize?.image_url
              }
            />
            {/* {prize?.name && <h6>{prize?.name}</h6>} */}
            {prize?.name && (
              <h6>
                You have won
                <br />
                <span>{prize?.name}</span>
                {/* {prize?.assert_type === "physical" &&
                  parseInt(prize?.price_in_usd) >= 1 && (
                    <>
                      {" "}
                      worth <span>~${prize?.price_in_usd}</span>.
                    </>
                  )} */}
              </h6>
            )}
            {prize?.assert_type === "physical" && (
              <>
                <p>
                  {prize?.name === "Dual Bat (Virtual Bat)" ? (
                    <>
                      *The Virtual Bat is not a digital collectible and cannot
                      be traded in the marketplace.
                      <br /> *The Virtual Bat can only be used within the game
                      (For Limited Period).
                      <br />
                      *We will announce the accessibility in the game soon.
                    </>
                  ) : (
                    "Our support team will contact you for the next steps"
                  )}
                </p>
              </>
            )}
          </div>
          <div className="button-block">
            {prize?.available_spin > 0 && (
              <button onClick={() => onClick("spin")}>
                SPIN REMAINING : {prize?.available_spin}
              </button>
            )}
            {/* <button onClick={() => history.push("/accounts/wallet")}> */}
            <button
              onClick={() => {
                prize?.assert_type === "physical"
                  ? onClick("logs")
                  : openWindow(
                      `${process.env.REACT_APP_ACCOUNTS_URL}/accounts/wallet`
                    );
              }}
            >
              View my Rewards
            </button>
          </div>
        </Modal.Body>
      </Modal>

      {/* {prize?.won && (
        <ReactConfetti
          numberOfPieces={window.innerWidth > 769 ? 700 : 400}
          width={width}
          height={height}
        />
      )} */}
    </>
  ) : (
    <></>
  );
};

export default SpinWheelSuccessModal;
