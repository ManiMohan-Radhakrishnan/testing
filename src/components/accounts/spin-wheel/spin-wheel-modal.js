import { useState } from "react";
import { Modal } from "react-bootstrap";
import {
  SPIN_DELAY,
  SPIN_WHEEL_COLORS,
  SPIN_WHEEL_COLORS_DUAL,
  SPIN_WHEEL_PRIMARY_COLOR,
  SPIN_WHEEL_SECONDARY_COLOR,
} from "./config";
import WheelofFoutune from "./spin-wheel";
import spinMp3Low from "../../../audio/spinWheel8s.mp3";
import spinMp3High from "../../../audio/spinWheelHigh.mp3";

import "./style.scss";

const SpinWheelModal = ({
  show = false,
  spinInfo = {},
  onSpin = () => {},
  onHide = () => {},
  spinWheelEventList,
  className,
  event_type = "",
}) => {
  let spinAudio = new Audio(spinMp3Low);
  const [onSpinHandle, setOnSpinHandle] = useState(false);
  const [onSpinRotate, setOnSpinRotate] = useState(false);
  let { event = {}, rewards = [] } = spinInfo;
  const spinAudioHandle = () => {
    spinAudio.play();
    setOnSpinHandle(true);
    setTimeout(() => {
      spinAudio.pause();
      setOnSpinHandle(false);
    }, 8000);
  };
  return show ? (
    <Modal
      show={show}
      className={`spin-wheel-modal ${event_type !== "referral" && className}`}
      size="md"
      backdrop="static"
      centered
    >
      <Modal.Header onHide={onHide} closeButton={!onSpinHandle}>
        <Modal.Title>{event?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <WheelofFoutune
          event={event}
          event_type={event_type}
          items={rewards}
          itemColors={
            event_type === "referral"
              ? SPIN_WHEEL_COLORS_DUAL
              : SPIN_WHEEL_COLORS
          }
          spinDelay={SPIN_DELAY}
          onSpin={onSpin}
          spinStatus={onSpinHandle}
          spinStart={spinAudioHandle}
          primaryColor={SPIN_WHEEL_PRIMARY_COLOR}
          secondaryColor={SPIN_WHEEL_SECONDARY_COLOR}
        />
      </Modal.Body>
    </Modal>
  ) : (
    <></>
  );
};

export default SpinWheelModal;
