import { useCallback, useEffect, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";

import {
  getRewardListBySpinEvent,
  getSpinWheelEventList,
} from "../../../api/methods";
import { SPIN_MODAL_TYPES, SUCCESS_MODAL_DELAY } from "./config";

import SpinWheelEventCard from "./spin-wheel-event-card";
import SpinWheelLogs from "./spin-wheel-logs";
import SpinWheelModal from "./spin-wheel-modal";
import SpinWheelSuccessModal from "./spin-wheel-success-modal";

import prize_1 from "../../../images/spin-wheel/prizes/prize-1.png";
import prize_2 from "../../../images/spin-wheel/prizes/prize-2.png";
import prize_3 from "../../../images/spin-wheel/prizes/prize-3.png";
import prize_4 from "../../../images/spin-wheel/prizes/prize-4.png";

import "./style.scss";

const eventListSample = [
  {
    event_id: "rakp2R5oFbOV1g58",
    name: "New Year",
    desc: "New YearNew Year New YearNew YearNew YearNew YearNew Year",
    available_spins: 18,
    total_spin_count: 50,
  },
  {
    event_id: "dM093YD0FKY5V7LA",
    name: "Kyc Success",
    desc: "Kyc SuccessKyc SuccessKyc SuccessKyc SuccessKyc SuccessKyc Success",
    available_spins: 38,
    total_spin_count: 50,
  },
];

const rewardListSample = [
  {
    reward_name: "CAR - 1",
    image_url: prize_1,
  },
  {
    reward_name: "TRY AGAIN - 1",
    image_url: prize_2,
  },
  {
    reward_name: "ETH - 1",
    image_url: prize_3,
  },
  {
    reward_name: "BIKE - 1",
    image_url: prize_4,
  },
  {
    reward_name: "CAR - 2",
    image_url: prize_1,
  },
  {
    reward_name: "TRY AGAIN - 2",
    image_url: prize_2,
  },
  {
    reward_name: "ETH - 2",
    image_url: prize_3,
  },
  {
    reward_name: "BIKE - 2",
    image_url: prize_4,
  },
  {
    reward_name: "CAR - 3",
    image_url: prize_1,
  },
  {
    reward_name: "TRY AGAIN - 3",
    image_url: prize_2,
  },
  {
    reward_name: "ETH - 3",
    image_url: prize_3,
  },
  {
    reward_name: "BIKE - 3",
    image_url: prize_4,
  },
  {
    reward_name: "CAR - 4",
    image_url: prize_1,
  },
  {
    reward_name: "TRY AGAIN - 4",
    image_url: prize_2,
  },
  {
    reward_name: "ETH - 4",
    image_url: prize_3,
  },
  {
    reward_name: "BIKE - 4",
    image_url: prize_4,
  },
];

const SpinWheel = () => {
  const [spinWheelEventList, setSpinWheelEventList] = useState([]);
  const [modalType, setModalType] = useState("");
  const [spinInfo, setSpinInfo] = useState({});
  const [successModalData, setSuccessModalData] = useState({});
  const [loading, setLoading] = useState(false);
  const [eventType, setEventType] = useState("");

  const fetchSpinEventList = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getSpinWheelEventList();
      if (response?.data?.success)
        setSpinWheelEventList(response?.data?.data?.events || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error in fetching spin wheel event list", error);
    }
  }, []);

  const fetchRewardListBySpinEvent = useCallback(async (event) => {
    try {
      const response = await getRewardListBySpinEvent({
        event_id: event?.event_id,
      });
      if (response?.data?.success) {
        setSpinInfo({ event, rewards: response?.data?.data?.rewards });
        setModalType(SPIN_MODAL_TYPES.SPIN);
      }
    } catch (error) {
      console.error("Error in fetching reward list for the spin event", error);
    }
  }, []);

  const handleSuccessClick = async (type) => {
    if (type === "logs") {
      toggleModal(SPIN_MODAL_TYPES.LOGS);
      await fetchSpinEventList();
    } else if (successModalData?.available_spin > 0) {
      let { event, rewards } = spinInfo;
      setSpinInfo({
        event: {
          ...event,
          available_spins: successModalData?.available_spin,
        },
        rewards,
      });
      toggleModal(SPIN_MODAL_TYPES.SPIN);
    } else {
      await fetchSpinEventList();
      toggleModal();
    }
  };

  const handleSpinEventClick = async (event = null) => {
    setEventType(event?.event_type);
    if (!event) return;
    await fetchRewardListBySpinEvent(event);
    // setSpinInfo({ event, rewards: rewardListSample });
    // toggleModal(SPIN_MODAL_TYPES.SPIN);
  };

  const toggleModal = (modal_type = "") => {
    setModalType(modal_type);
  };

  const handleSpin = (prizeInfo) => {
    setSuccessModalData(prizeInfo);
    setTimeout(
      () => setModalType(SPIN_MODAL_TYPES.SUCCESS),
      SUCCESS_MODAL_DELAY
    );
  };

  const reset = async () => {
    await fetchSpinEventList();
    setSpinInfo({});
    toggleModal();
  };

  useEffect(() => {
    fetchSpinEventList();
    // setSpinWheelEventList(eventListSample);
  }, []);

  return (
    <div className="main-content-block spin-wheel-block">
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="spin-wheel-title-box">
              <h3 className="spin-wheel-title">SPIN-THE-WHEEL</h3>
              {spinWheelEventList.length > 0 && (
                <span
                  className="log-btn"
                  onClick={() => toggleModal(SPIN_MODAL_TYPES.LOGS)}
                >
                  Logs <MdKeyboardArrowRight />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      {!loading && spinWheelEventList.length > 0 ? (
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="spin-wheel-box">
                <ul className="spin-wheel-list">
                  {spinWheelEventList.map((event, i) => {
                    return (
                      <SpinWheelEventCard
                        key={event?.event_id || `event-${i}`}
                        event={event}
                        onClick={handleSpinEventClick}
                      />
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="norecord-found">
          <h2>
            {" "}
            {!loading
              ? "Participate in different contests to earn a Spin Wheel."
              : "Loading..."}
          </h2>
        </div>
      )}

      {modalType === SPIN_MODAL_TYPES.SPIN && (
        <SpinWheelModal
          show={modalType === SPIN_MODAL_TYPES.SPIN}
          spinInfo={spinInfo}
          event_type={eventType}
          spinWheelEventList={spinWheelEventList}
          onSpin={handleSpin}
          onHide={reset}
          className="four-color-spin"
        ></SpinWheelModal>
      )}
      {modalType === SPIN_MODAL_TYPES.SUCCESS && (
        <SpinWheelSuccessModal
          show={modalType === SPIN_MODAL_TYPES.SUCCESS}
          event_type={eventType}
          prize={successModalData}
          onClick={handleSuccessClick}
          onHide={reset}
        />
      )}
      {modalType === SPIN_MODAL_TYPES.LOGS && (
        <SpinWheelLogs
          show={modalType === SPIN_MODAL_TYPES.LOGS}
          onHide={() => {
            setSpinInfo({});
            toggleModal();
          }}
          eligibleSpin={spinWheelEventList?.length > 0}
        />
      )}
    </div>
  );
};

export default SpinWheel;
