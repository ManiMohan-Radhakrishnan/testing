import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AiFillApple } from "react-icons/ai";
import { IoLogoGooglePlaystore } from "react-icons/io5";

import { get_active_code_list } from "../../../redux/thunk/user_thunk";
import { getAppLinks, getServerTimeApi } from "../../../api/methods";
import NFTCounter from "../../nft-counter";

import sample from "../../../images/post1.png";
import "./style.scss";

// {
//   code: "538v6bwn6kng",
//   tournament_name: "Eveddnt1d",
//   tournament_start_time: "2022-01-03T20:04:04.000Z",
//   tournament_end_time: "2022-12-03T21:04:04.000Z",
//   is_claimed: false,
// },

const GamePass = () => {
  const dispatch = useDispatch();
  const [activeCodeList, setActiveCodeList] = useState([]);
  const [currentTime, setCurrentTime] = useState(false);
  const [appLink, setAppLink] = useState({});

  const dispatchCallback = (response) => {
    if (response?.status === 200)
      setActiveCodeList(response?.data?.data?.activation_codes);
  };

  const getServerTime = async () => {
    try {
      const result = await getServerTimeApi();
      setCurrentTime(result.data.data.time);
    } catch (err) {
      console.error("Error in time API", err);
    }
  };

  const getAppLink = async (type = "android") => {
    try {
      if (!appLink[type]) {
        const result = await getAppLinks(type);
        setAppLink({
          ...appLink,
          [type]: result?.data?.data?.download_details?.download_file,
        });
      }
    } catch (error) {
      console.error(`Error in ${type} app link`, error?.data?.message);
    }
  };

  useEffect(() => {
    getServerTime();
    dispatch(get_active_code_list({ callback: dispatchCallback }));
  }, [dispatch]);

  return (
    <div className="main-content-block profilepage">
      <div className="container-fluid">
        <div className="about-user">
          <div className="row">
            <div className="col-md-12 ">
              <div className="about-heading mynft-heading mb-4 mt-4">
                <div className="internal-heading-sec">
                  <h3 className="about-title">Game Pass</h3>
                </div>
              </div>
              <section className="game-code-block">
                {activeCodeList.length > 0 ? (
                  activeCodeList.map((codelist, i) => (
                    <GameCard
                      key={`codelist-${i}`}
                      currentTime={currentTime}
                      appLink={appLink}
                      getAppLink={getAppLink}
                      data={codelist}
                    />
                  ))
                ) : (
                  <>
                    <p className="no-data">No Records Found</p>
                  </>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GameCard = ({ data = {}, currentTime, appLink = {}, getAppLink }) => {
  const now = new Date().getTime();
  const [isStarted, setIsStarted] = useState(
    now >= new Date(data?.tournament_start_time).getTime()
  );
  const isExpired = now >= new Date(data?.tournament_end_time).getTime();
  const isClaimed = data?.claimed;
  {
    console.log(data, "data");
  }
  return (
    <article
      data-value={isExpired ? "Expired" : isClaimed ? "Claimed" : ""}
      className={`game-code  ${isClaimed || isExpired ? "expired" : ""}`.trim()}
    >
      <div className="nft-info">
        {!isStarted && data?.tournament_supply_type === "infinite" && (
          <div className="timer-block">
            <h4>Starts in:</h4>
            <NFTCounter
              time={data?.tournament_start_time}
              cTime={currentTime}
              customClass="game-card-timer"
              timeClass={"card-time"}
              intervalClass={"card-interval"}
              handleEndEvent={() => {
                setIsStarted(true);
              }}
            ></NFTCounter>
          </div>
        )}

        <div className="img-block">
          <img
            alt="NFT"
            src={data?.tournament_img_url ? data?.tournament_img_url : sample}
          />
        </div>
        <div className="game-code-detail">
          <h4 className="transform">{data?.tournament_name} </h4>
          {data?.serial ? (
            <h4 className="transform text-center">#{data?.serial}</h4>
          ) : (
            <></>
          )}
        </div>

        {data?.tournament_supply_type !== "infinite" && (
          <div className="game-code-info-block">
            <div className="game-code-price-info">
              <h4>
                {" "}
                <span className="caption">Tournament Duration</span>
              </h4>
              <h5>
                <span className="caption">Start:</span>{" "}
                <span>
                  {dayjs(data?.tournament_start_time).format(
                    "D MMM YYYY hh:mma"
                  )}
                </span>{" "}
              </h5>
              <h5>
                <span className="caption">End:</span>{" "}
                <span>
                  {dayjs(data?.tournament_end_time).format("D MMM YYYY hh:mma")}
                </span>{" "}
              </h5>
            </div>
          </div>
        )}

        {!isStarted ||
          (data?.tournament_supply_type === "infinite" && (
            <div className="game-download-block">
              <h4>Download MCL Game</h4>
              <a
                href="https://play.google.com/store/apps/details?id=com.metacricketleague.app"
                target="_blank"
              >
                <span>
                  <IoLogoGooglePlaystore />
                  Google Play
                </span>
              </a>
              <a
                href="https://apps.apple.com/in/app/meta-cricket-league-nft-game/id1616152944"
                target="_blank"
              >
                <span>
                  <AiFillApple />
                  App Store
                </span>
              </a>
            </div>
          ))}
      </div>
    </article>
  );
};

export default GamePass;
