import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import useWindowUtils from "../../../hooks/useWindowUtils";
import { getPrizeBySpinEvent } from "../../../api/methods";

import prize_0 from "../../../images/spin-wheel/prizes/prize-1.png";
import prize_1 from "../../../images/spin-wheel/prizes/prize-2.png";
import prize_2 from "../../../images/spin-wheel/prizes/prize-3.png";
import prize_3 from "../../../images/spin-wheel/prizes/prize-4.png";
import prize_4 from "../../../images/spin-wheel/prizes/prize-1.png";
import prize_5 from "../../../images/spin-wheel/prizes/prize-2.png";
import prize_6 from "../../../images/spin-wheel/prizes/prize-1.png";
import prize_7 from "../../../images/spin-wheel/prizes/prize-2.png";
import prize_8 from "../../../images/spin-wheel/prizes/prize-3.png";
import prize_9 from "../../../images/spin-wheel/prizes/prize-4.png";
import prize_10 from "../../../images/spin-wheel/prizes/prize-1.png";
import prize_11 from "../../../images/spin-wheel/prizes/prize-2.png";
import prize_12 from "../../../images/spin-wheel/prizes/prize-2.png";
import prize_13 from "../../../images/spin-wheel/prizes/prize-2.png";
import prize_14 from "../../../images/spin-wheel/prizes/prize-2.png";
import prize_15 from "../../../images/spin-wheel/prizes/prize-2.png";
import prize_16 from "../../../images/spin-wheel/prizes/prize-2.png";

import "./style.scss";
import { SPIN_DELAY, SUCCESS_MODAL_DELAY } from "./config";

const samplePrizes = {
  prize_0,
  prize_1,
  prize_2,
  prize_3,
  prize_4,
  prize_5,
  prize_6,
  prize_7,
  prize_8,
  prize_9,
  prize_10,
  prize_11,
  prize_12,
  prize_13,
  prize_14,
  prize_15,
  prize_16,
};

const prizeSample = {
  reward_name: "BIKE",
  event_name: "New Year",
  available_spin: 13,
};

const WheelofFoutune = ({
  fontFamily = "",
  event = "",
  items = [],
  itemColors = [],
  onSpin = () => {},
  spinStart = () => {},
  spinStop = () => {},
  spinStatus = false,
  primaryColor = "",
  secondaryColor = "",
  spinButtonTitle = "Spin Now",
  spinDelay = 2000,
  wheelSliceSpacing = "",
  wheelBorderSize = "",
  event_type = "",
}) => {
  const [spinError, setSpinError] = useState(false);
  const [isSpinEnabled, enableSpin] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  // const [availableSpins, setAvailableSpins] = useState(event?.available_spins);

  const { width } = useWindowUtils();
  const isLarge = width >= 768;
  const isMin = width <= 374;
  const wheelVarsXS = {
    "--wheel-font": fontFamily || `"Lato", "Quicksand", sans-serif`,
    "--wheel-size": "18rem",
    "--wheel-slice-spacing": wheelSliceSpacing || "7px",
    "--wheel-border-size": wheelBorderSize || "0",
    "--PI": "3.14159265358979",
    "--item-nb": 0,
    "--nb-turn": 5,
    "--nb-item": items.length,
    "--selected-item": selectedItem,
    "--spinning-duration": `${spinDelay}ms`,
    "--reset-duration": `${selectedItem === null ? "0s" : "0.25s"}`,
    "--primary-color": `${primaryColor || "black"}`,
    "--secondary-color": `${secondaryColor || "white"}`,
  };
  const wheelVars = {
    "--wheel-font": fontFamily || `"Lato", "Quicksand", sans-serif`,
    "--wheel-size": "22rem",
    "--wheel-slice-spacing": wheelSliceSpacing || "7px",
    "--wheel-border-size": wheelBorderSize || "0",
    "--PI": "3.14159265358979",
    "--item-nb": 0,
    "--nb-turn": 5,
    "--nb-item": items.length,
    "--selected-item": selectedItem,
    "--spinning-duration": `${spinDelay}ms`,
    "--reset-duration": `${selectedItem === null ? "0s" : "0.25s"}`,
    "--primary-color": `${primaryColor || "black"}`,
    "--secondary-color": `${secondaryColor || "white"}`,
  };
  const wheelVarsLarge = {
    "--wheel-font": fontFamily || `"Lato", "Quicksand", sans-serif`,
    "--wheel-size": "30rem",
    "--wheel-slice-spacing": wheelSliceSpacing || "7px",
    "--wheel-border-size": wheelBorderSize || "0",
    "--PI": "3.14159265358979",
    "--item-nb": 0,
    "--nb-turn": 5,
    "--nb-item": items.length,
    "--selected-item": selectedItem,
    "--spinning-duration": `${spinDelay}ms`,
    "--reset-duration": `${selectedItem === null ? "0s" : "0.25s"}`,
    "--primary-color": `${primaryColor || "black"}`,
    "--secondary-color": `${secondaryColor || "white"}`,
  };

  const fetchSpinPrize = useCallback(async () => {
    try {
      const response = await getPrizeBySpinEvent({ event_id: event?.event_id });
      if (response?.data?.success) {
        let prize = response?.data?.data?.reward || {};
        let winner = items.findIndex(
          (item) => item?.reward_id === prize?.reward_id
        );
        if (winner === -1) return;
        setSelectedItem(winner);
        spinStart();
        onSpin({ ...prize });
        // setTimeout(
        //   () => setAvailableSpins(prize?.available_spin),
        //   SPIN_DELAY + 750
        // );
      }
    } catch (error) {
      setSpinError(true);
      toast.error(
        error?.data?.message || "Something went wrong. Please try again"
      );
      console.log("Error in fetching prize for the spin", error);
    }
  }, []);

  const handleSpin = async () => {
    // spinStart();
    enableSpin(false);
    await fetchSpinPrize();
  };

  return (
    <>
      <section
        className="spin-wheel-section"
        style={isLarge ? wheelVarsLarge : isMin ? wheelVarsXS : wheelVars}
      >
        <div className="wheel-wrapper">
          <div className="wheel-container">
            <div
              className={`wheel ${selectedItem !== null ? "spinning" : ""} ${
                spinStatus ? "spinningRotate" : ""
              }`.trim()}
            >
              {items.map((item, index) => (
                <div
                  className="wheel-item"
                  key={index}
                  style={{
                    "--item-nb": index,
                    "--item-bg-color": itemColors[index % itemColors.length],
                  }}
                >
                  <img
                    src={
                      event_type === "referral"
                        ? item?.closed_box_url
                        : item?.image_url
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        {event?.available_spins ? (
          <>
            <button
              className="theme-btn"
              onClick={handleSpin}
              disabled={!isSpinEnabled}
            >
              {spinButtonTitle}
            </button>
            <h4 className="spins-left">
              Spin Remaining : <span>{event?.available_spins}</span>
            </h4>
          </>
        ) : (
          <div className="blur">
            <h4>You have no spins left!</h4>
          </div>
        )}
      </section>
    </>
  );
};

export default WheelofFoutune;
