import { useEffect, useState } from "react";
import NFTCounter from "../../nft-counter";
import { SPIN_STATUS } from "./config";
import { TfiAngleDoubleRight } from "react-icons/tfi";
import "./style.scss";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { IoIosInformationCircleOutline } from "react-icons/io";
import ToolTip from "../../tooltip";

const SpinWheelEventCard = ({ event = {}, onClick = () => {} }) => {
  let {
    name,
    desc,
    image_url,
    available_spins,
    total_spin_count,
    start_time,
    end_time,
    spins_taken,
    pending_spins,
    event_type,
    total_available_spins,
  } = event;

  const { user } = useSelector((state) => state.user.data);

  const areSpinsAvailable = available_spins > 0;
  // let start_time = "2023-02-20T18:50:20.639Z";
  // let end_time = "2023-02-28T18:57:20.639Z";

  const [eventInfo, setEventInfo] = useState({
    title: "",
    status: "",
    endAt: "",
    buttonDisabled: false,
  });

  const initEventInfo = () => {
    let now = new Date().getTime();
    let event_info = { ...eventInfo };
    if (now < new Date(start_time).getTime()) {
      event_info = {
        title: "Contest Starts In",
        status: SPIN_STATUS?.YET_TO_START,
        endAt: start_time,
        buttonDisabled: true,
      };
    } else if (now >= new Date(end_time).getTime()) {
      event_info = {
        title: "Expired On",
        status: SPIN_STATUS?.ENDED,
        endAt: end_time,
        buttonDisabled: true,
      };
    } else if (
      now >= new Date(start_time).getTime() &&
      now < new Date(end_time).getTime()
    ) {
      event_info = {
        title: "Contest Ends In",
        status: SPIN_STATUS?.ONGOING,
        endAt: end_time,
        buttonDisabled: false,
      };
    } else if (start_time === null || end_time === null) {
      event_info = {
        title: "",
        status: "",
        status: SPIN_STATUS?.ENDED,
        buttonDisabled: true,
      };
    }
    setEventInfo(event_info);
  };

  useEffect(() => {
    initEventInfo();
  }, [event]);

  const handleEndTimer = () => {
    setTimeout(initEventInfo, 1000);
  };

  const popover = (
    <Popover>
      <Popover.Body>
        <span className="password-terms">
          Please complete your user verification to proceed.
        </span>
      </Popover.Body>
    </Popover>
  );

  const claimedStatus = () => {
    if (available_spins === 0 && event_type === "default") return true;
    else if (available_spins === 0 && pending_spins === 0) return true;
    else return false;
  };

  const isClaimed = claimedStatus();

  return (
    <li className="spin-wheel-items">
      <div
        className={`spin-wheel-card ${
          eventInfo?.status === SPIN_STATUS?.ENDED &&
          available_spins !== 0 &&
          "expired-card"
        } ${isClaimed && "claimed-card"}`}
      >
        {name ? <h4 className="spin-wheel-card-title">{name}</h4> : <></>}

        {desc ? <p className="spin-wheel-card-description">{desc}</p> : <></>}
        {eventInfo?.status !== SPIN_STATUS?.ENDED &&
        eventInfo?.status &&
        !isClaimed ? (
          <div className="timer-block">
            <NFTCounter
              customClass="spin-timer"
              cTime={new Date().getTime()}
              time={eventInfo?.endAt}
              handleEndEvent={handleEndTimer}
            />
            <h6>{eventInfo?.title}</h6>
          </div>
        ) : (
          <></>
        )}
        <div className="spin-wheel-card-footer">
          {eventInfo?.status === SPIN_STATUS?.ENDED && !isClaimed ? (
            <div className="timer-block">
              {" "}
              <div className="expire-time">
                {dayjs(eventInfo?.endAt).format(" D MMM YYYY hh:mma")}{" "}
              </div>{" "}
              <h6>{eventInfo?.title}</h6>
            </div>
          ) : (
            <></>
          )}
          {eventInfo?.status !== SPIN_STATUS?.ENDED && (
            <>
              <div className="spin-btn-block">
                {user?.kyc_status !== "success" ? (
                  <>
                    {/* <div className="spin-btn-block"> */}
                    <OverlayTrigger
                      trigger={["click"]}
                      rootClose={true}
                      placement="top"
                      overlay={popover}
                    >
                      <button
                        disabled={
                          !areSpinsAvailable || eventInfo?.buttonDisabled
                        }
                        className={"spin-wheel-card-btn"}
                      >
                        GO <TfiAngleDoubleRight />
                      </button>
                    </OverlayTrigger>
                    {/* </div> */}
                  </>
                ) : (
                  // <div className="spin-btn-block">
                  <button
                    className={"spin-wheel-card-btn"}
                    onClick={() => onClick(event)}
                    disabled={!areSpinsAvailable || eventInfo?.buttonDisabled}
                  >
                    GO <TfiAngleDoubleRight />
                  </button>
                )}
                {!isClaimed ? (
                  <>
                    <div className="d-flex">
                      <h6 className="spins-availability">
                        {`Spin Remaining : ${available_spins}`}
                      </h6>
                      <div className="tooltip-sec">
                        <SharePopover
                          icon={
                            <IoIosInformationCircleOutline
                              size={16}
                              className="check-icon"
                            />
                          }
                          content={
                            <>
                              {event_type === "default" ? (
                                <>
                                  <p>
                                    Total Eligible Spin Count:{" "}
                                    {total_spin_count}
                                  </p>
                                  <p>Spin Completed: {spins_taken}</p>
                                  <p>Spin Remaining: {available_spins}</p>
                                </>
                              ) : (
                                <>
                                  <p>
                                    {/* Referrals Purchased RADDX during Drop:{" "} */}
                                    No. of users purchased RADDX NFT during drop
                                    using your referral: {total_spin_count}
                                  </p>
                                  <p>
                                    {/* Referrals Completed KYC:{" "} */}
                                    No. of user completed KYC:{" "}
                                    {total_spin_count - pending_spins}
                                  </p>
                                  <p>
                                    Total Eligible Spin Count:{" "}
                                    {total_spin_count - pending_spins}
                                  </p>
                                  <p>Spin Completed: {spins_taken}</p>
                                  <p>Spin Remaining: {available_spins}</p>
                                </>
                              )}
                            </>
                          }
                          placement="top"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </li>
  );
};

const SharePopover = ({ icon, placement, content }) => {
  return (
    <>
      <OverlayTrigger
        trigger="click"
        rootClose
        key={placement}
        placement={placement}
        overlay={
          <Popover className="mb-2 pop-over-spin">
            <Popover.Body className="p-1">
              <div>{content}</div>
            </Popover.Body>
          </Popover>
        }
      >
        <span>{icon}</span>
      </OverlayTrigger>
    </>
  );
};

export default SpinWheelEventCard;
