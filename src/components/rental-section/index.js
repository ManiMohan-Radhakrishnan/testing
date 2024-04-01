import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { getTournaments } from "../../api/methods";
import { getNFTForRent } from "../../api/methods-marketplace";
import { subtractMin } from "../../utils/common";
import NFTCounter from "../nft-counter";
import { AiOutlineFieldTime } from "react-icons/ai";
import "./style.scss";

const RentalSection = ({ getRentedNFTs = [] }) => {
  const [showAlert, setShowAlert] = useState(true);
  const [tournament, setTournament] = useState({});
  const [enableRent, setEnableRent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // getTournament();
  }, []);

  const getTournament = async () => {
    try {
      const result = await getTournaments();
      if (result?.data?.data?.active?.length > 0) {
        const [first] = result?.data?.data?.active;
        setEnableRent(
          new Date(result?.data?.data?.time).getTime() >=
            new Date(first?.start_time).getTime()
        );
        setTournament(first);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetNFT = async () => {
    try {
      setLoading(true);
      await getNFTForRent();
      getRentedNFTs(1);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message, { autoClose: 2000 });
      setLoading(false);
    }
  };

  const handleEndTimer = () => {
    setEnableRent(true);
  };
  return (
    <>
      <Alert
        className="get-rental-nft-alert-box"
        variant="dark"
        show={showAlert}
        // onClose={() => setShowAlert(false)}
        // dismissible
      >
        <div className="get-rental-nft-header">
          <Alert.Heading>Play & Win Big with Rental MCL NFTs!</Alert.Heading>

          <p>
            Use rental NFTs to enter the MCL Game and play in daily tournaments.
          </p>
        </div>
        {tournament?.start_time && (
          <>
            <div className="get-rental-nft">
              <div className="get-rental-nft-content">
                <img
                  className="tournament_img"
                  src={tournament?.img_url}
                  alt="tournament"
                />
                <div className="get-rental-nft-content-info">
                  <h5>{tournament?.name}</h5>
                  <p>
                    <AiOutlineFieldTime />

                    <i>
                      <span>
                        {dayjs(tournament?.start_time).format(
                          " D MMM YYYY hh:mma"
                        )}
                      </span>{" "}
                      to
                      <span>
                        {dayjs(tournament?.end_time).format(
                          " D MMM YYYY hh:mma"
                        )}
                      </span>
                    </i>
                  </p>
                </div>
              </div>

              <div className="timer-btn-block">
                {!enableRent && (
                  <div className="timer-box">
                    <h6>Rental opens in</h6>
                    <NFTCounter
                      intervalClass="expire-interval"
                      invervalGapClass="expire-interval-space"
                      time={subtractMin(tournament?.start_time, 30)}
                      handleEndEvent={handleEndTimer}
                    />
                  </div>
                )}

                <button
                  className="theme-btn"
                  onClick={enableRent && handleGetNFT}
                  disabled={!enableRent || loading}
                >
                  {loading ? "Processing..." : "Rent NFT"}
                </button>
              </div>
            </div>
          </>
        )}
      </Alert>
    </>
  );
};

export default RentalSection;
