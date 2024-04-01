import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ProgressBar } from "react-bootstrap";
import NFTStat from "../nft-stat";
import postOne from "../../images/post1.png";
import upgradeSVG from "../../images/jump-trade/upgrade-arrow.png";
import LevelUpgrade from "../level-upgrade";
import ChooseNFT from "../choose-nft";
import { playerCategory, role } from "../../utils/common";
import "./style.scss";
import { BsFillTrophyFill } from "react-icons/bs";

// import { level } from "../../utils/common";
// import sampleUpgradeCardImage from "../../images/jump-trade/CARDS_Character/Common/Batsman/1.png";

const PlayerNFTCard = ({
  nft,
  data,
  playerCard = false,
  chooseNFT = false,
}) => {
  const { user } = useSelector((state) => state.user.data);
  const [levelUpPop, setLevelUpPop] = useState(false);
  const [chooseNFTPop, setChooseNFTPop] = useState(false);
  const [successValue, setSuccessValue] = useState(false);
  const [imageloaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (successValue) {
      window.location.reload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successValue]);
  const CardDetails = (nft) => {
    //const levelData = level(statistics?.level?.value);
    // const searchname=
    const roleData = role(
      nft?.role,
      nft?.dominant_hand ? nft?.dominant_hand : "BAT"
    );
    const playerCatData = playerCategory(nft?.category);
    return (
      <article className={`player_stats cards_upgrades`}>
        {roleData && (
          <div className="player-type">
            <img alt="Player" src={roleData?.value} />
          </div>
        )}

        {playerCatData && (
          <div
            className="player-range"
            // style={{
            //   borderBottom: levelData ? "0.1rem solid #fff" : "none",
            // }}
          >
            <span
              className="band"
              style={{
                background: playerCatData?.color ? playerCatData?.color : "",
              }}
            >
              {playerCatData?.value}
            </span>
          </div>
        )}

        {/* {levelData && (
        <div className="player-level">
          <h6>{levelData?.name}</h6>
          <img src={levelData?.value} />
        </div>
      )} */}
      </article>
    );
  };

  return (
    <>
      {playerCard ? (
        <div className="mynft-card-box available-card-nft mb-3">
          <div className="block-box user-post jt-card">
            <div className="item-post img-card-border">
              <span className="upgradelabel">Upgrades</span>
              <img
                // src={sampleUpgradeCardImage}
                src={nft?.image_url ? nft?.image_url : postOne}
                width="100%"
                alt="nft logo"
                role="button"
                style={imageloaded ? {} : { height: "20rem" }}
                onLoad={() => setImageLoaded(true)}
              />
              {CardDetails(nft)}
            </div>

            <div className="item-content">
              <div className="post-cost pw_we ">
                {/* <div className="left-bids">
                  <div className="post-sold-text end">Meta</div>
                  <div className="post-sold-cost end ">
                    {nft?.name.replace("Meta", "")}
                  </div>
                </div>
                <div className="right-bid">
                  {nft?.quantity && (
                    <>
                      <div className="post-sold-text end">Cards Avl.</div>
                      <div className="post-sold-cost end">{nft?.quantity}</div>
                    </>
                  )}
                </div> */}
                <div className="skew_box available-card">
                  <div className="wrap">
                    <div className="box box1">
                      {/* <p>Meta </p> */}
                      {/* <p>{nft?.name.replace("Meta", "")}</p> */}
                      <p>{nft?.name}</p>
                    </div>
                    {/* <div class="box box2 d-flex justify-content-around flex-row flex-nowrap">
                      <p>Cards Available</p>
                      <h2 className="mb-0">{nft?.quantity}</h2>
                    </div> */}
                    <div className="box box2">
                      {nft?.quantity && (
                        <>
                          <div className="text-end">
                            <p>Cards</p>
                            <p>Available</p>
                          </div>

                          <h2>{nft?.quantity}</h2>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {nft?.nft_owned ? (
                <div className="skew-box-wrapper available-card">
                  <div className="wrap">
                    <button
                      className="upgrade-btn buy-to-upgradde mt-3 mb-3"
                      onClick={() => setChooseNFTPop(!chooseNFTPop)}
                    >
                      <span>Level Up Now</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="skew-box-wrapper available-card">
                  <div className="wrap">
                    <button className="upgrade-btn buy-to-upgradde  info-btn mt-3 mb-3">
                      <span
                        onClick={() =>
                          window.open(
                            `${
                              process.env.REACT_APP_MARKETPLACE_URL
                            }/nft-marketplace?search=${
                              nft?.name.toLowerCase().startsWith("meta")
                                ? nft?.name
                                    .toLowerCase()
                                    .replace("meta", "")
                                    .trim()
                                : nft?.name
                            }`,
                            "_blank"
                          )
                        }
                      >
                        Buy a {nft?.name} to upgrade
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="mynft-card-box upgrade-card-box mb-3">
          <div className="block-box user-post jt-card">
            <div className="item-post">
              {nft?.core_statistics?.rank?.value && (
                <span className="nft-type-badge-rank">
                  <span className="rank-title">
                    <BsFillTrophyFill />{" "}
                    {` ${nft?.core_statistics?.rank?.value}/${nft?.core_statistics?.rank?.maximum}`}
                  </span>
                </span>
              )}
              {/* {nft?.nft_type && (
                <span className="nft-type-badge">
                  {nft?.nft_type.toUpperCase()}
                </span>
              )} */}
              <NFTStat statistics={nft?.core_statistics} />
              <img
                src={nft?.asset_url ? nft?.asset_url : postOne}
                width="100%"
                className="upgrade-nft-img"
                alt="nft logo"
                role="button"
                style={imageloaded ? {} : { height: "20rem" }}
                onLoad={() => setImageLoaded(true)}
              />
              {nft?.is_on_sale && <p className="is-on-sale">On sale</p>}
            </div>

            <div className="item-content">
              <div className="post-cost pw_we ">
                {/* <div className="left-bids">
                  <div
                    className={`post-sold-text end ${
                      chooseNFT ? "small-text" : ""
                    }`}
                  >
                    Meta
                  </div>
                  <div
                    className={`post-sold-cost end ${
                      chooseNFT ? "small-text" : ""
                    }`}
                  >
                    {nft?.name.replace("Meta", "")}
                  </div>
                </div> */}
                {/* <div className="right-bid">
                  <>
                    <div
                      className={`post-sold-text end ${
                        chooseNFT ? "small-text" : ""
                      }`}
                    >
                      Upgradable to
                    </div>
                    <div
                      className={`post-sold-cost end ${
                        chooseNFT ? "small-text" : ""
                      }`}
                    >
                      LVL {nft?.core_statistics?.next_level?.value}
                    </div>
                  </>
                </div> */}
                <div className="skew_box">
                  <div className="wrap">
                    <div className="box box1">
                      <p>Meta </p>
                      <p>{nft?.name.replace("Meta", "")}</p>
                    </div>
                    <div className="box box2">
                      {nft?.upgradable_cards.total_needed > 0 ? (
                        <p>Upgradable to</p>
                      ) : (
                        <p></p>
                      )}
                      <h2>LEVEL {nft?.core_statistics?.next_level?.value}</h2>
                    </div>
                  </div>
                </div>
              </div>
              {!nft?.can_upgrade ? (
                <>
                  {nft?.upgradable_cards.total_needed > 0 ? (
                    <div className="skew-box-wrapper">
                      <div className="wrap">
                        <ProgressBar
                          className=""
                          variant="upgrade-nft-progress"
                          now={nft?.upgradable_cards.user_owned}
                          label={
                            <span className="text-center centered">
                              {nft?.upgradable_cards?.user_owned} /{" "}
                              {nft?.upgradable_cards?.total_needed}
                            </span>
                          }
                          min={0}
                          max={nft?.upgradable_cards?.total_needed}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="skew-box-wrapper">
                      <div className="wrap max-level">
                        <ProgressBar
                          className="max-level-label"
                          variant="upgrade-nft-progress"
                          now={nft?.upgradable_cards.user_owned}
                          label={<span className="">MAX LEVEL REACHED</span>}
                          min={0}
                          max={100}
                        />
                        {/* <span className="">MAX LEVEL REACHED</span> */}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="skew-box-wrapper">
                    <div className="wrap">
                      <img
                        alt="Upgrade"
                        src={upgradeSVG}
                        className="uparrowicon"
                      />
                      <ProgressBar
                        role={"button"}
                        className=""
                        variant="upgrade-nft-progress upgrade-radius"
                        now={100}
                        label={
                          <>
                            <span className="text-center centered-button">
                              Upgrade
                            </span>
                          </>
                        }
                        max={100}
                        onClick={() => setLevelUpPop(!levelUpPop)}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <ChooseNFT
        card={nft}
        chooseNFTPop={chooseNFTPop}
        setChooseNFTPop={setChooseNFTPop}
      />

      {nft?.can_upgrade && (
        <LevelUpgrade
          nft={nft}
          levelUpPop={levelUpPop}
          successValue={() => setSuccessValue(true)}
          setLevelUpPop={setLevelUpPop}
          playerCard={playerCard}
        />
      )}
    </>
  );
};

export default PlayerNFTCard;
