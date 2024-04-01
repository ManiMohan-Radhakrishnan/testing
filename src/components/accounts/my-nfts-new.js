import { useCallback, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import { useQuery } from "../../hooks/url-params";
import { toggleFreshworksHelp } from "../../utils/common";
import { GAMES } from "../../utils/game-config";
import { Tabs } from "../my-nfts/tabs";
import { Tabs as RaddxTabs } from "../raddx/my-nfts/tabs";
import { Tabs as HurleyTabs } from "../hurley/tabs";
import { Tabs as MiniGameTabs } from "../mini-game/tabs";

import "./referalstyle.scss";

import FusorPopup from "./fusor-popup";
import { fuseNFTApi, nftDetailApi } from "../../api/methods-marketplace";

const MyNFTsNew = ({ hideMenus }) => {
  const location = useLocation();
  const history = useHistory();
  const query = useQuery(location.search);
  const [gameName, setGameName] = useState();
  const isMclGame = gameName === GAMES.MCL;
  const isRaddxGame = gameName === GAMES.RADDX;
  const isHurleyGame = gameName === GAMES.HURLEY;
  const isMiniGame = gameName === GAMES.MINI;
  const [fusorNftPopup, setFusorNftPopup] = useState(query?.get("fusor_id"));
  const [fusorSlug, setFusorSlug] = useState(query?.get("fusor_id"));
  const [fusorDetails, setFusorDetails] = useState({});
  const [searchParams, setSearchParams] = useState();

  useEffect(() => {
    if (fusorSlug) getFusorDetails();
    setSearchParams(query.get("game_name"));
    let game_name = query.get("game_name");
    if (game_name === GAMES.MCL) setGameName(GAMES.MCL);
    else if (game_name === GAMES.RADDX) setGameName(GAMES.RADDX);
    else if (game_name === GAMES.HURLEY) setGameName(GAMES.HURLEY);
    else if (game_name === GAMES.MINI) setGameName(GAMES.MINI);
    else setGameName(GAMES.MCL);
    toggleFreshworksHelp(false);
    return () => {
      toggleFreshworksHelp(true);
    };
  }, []);

  const getFusorDetails = async () => {
    try {
      const result = await nftDetailApi({ nft_slug: fusorSlug });
      setFusorDetails(result?.data?.data?.nft);
    } catch (error) {}
  };

  const removeQueryParam = () => {
    history.replace(window.location.pathname);
  };

  return (
    <>
      <div className="main-content-block profilepage">
        <div className="container-fluid">
          <div className="about-user">
            <div className="row">
              <div className="col-md-12 ">
                <div className="mb-3 mt-4">
                  <div className="internal-heading-sec internal-heading-sec-sm mnft-page">
                    <h3 className="about-title mobile-show">My NFTs</h3>

                    <div className="game-switch">
                      <span
                        className={`switch ${isMclGame ? "active" : ""}`}
                        onClick={() => {
                          setGameName(GAMES.MCL);
                          searchParams && removeQueryParam();
                        }}
                      >
                        MCL
                      </span>
                      <span
                        className={`switch ${isRaddxGame ? "active" : ""}`}
                        onClick={() => {
                          setGameName(GAMES.RADDX);
                          searchParams && removeQueryParam();
                        }}
                      >
                        RADDX
                      </span>
                      <span
                        className={`switch ${isHurleyGame ? "active" : ""}`}
                        onClick={() => {
                          setGameName(GAMES.HURLEY);
                          searchParams && removeQueryParam();
                        }}
                      >
                        HURLEY
                      </span>
                      <span
                        className={`switch ${isMiniGame ? "active" : ""}`}
                        onClick={() => {
                          setGameName(GAMES.MINI);
                          searchParams && removeQueryParam();
                        }}
                      >
                        TORNADO
                      </span>
                    </div>
                  </div>
                </div>
                {isMclGame ? (
                  <MclNfts hideMenus={hideMenus} />
                ) : isRaddxGame ? (
                  <RaddxNfts hideMenus={hideMenus} />
                ) : isHurleyGame ? (
                  <HurleyNfts hideMenus={hideMenus} />
                ) : isMiniGame ? (
                  <MiniGameNfts hideMenus={hideMenus} />
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {fusorNftPopup && fusorSlug && (
        <FusorPopup
          hideMenus
          fusorNftPopup={fusorNftPopup}
          fusorSlug={fusorSlug}
          fusorDetails={fusorDetails}
        />
      )}
    </>
  );
};

const MclNfts = ({ hideMenus }) => <Tabs hideMenus={hideMenus} />;

const RaddxNfts = ({ hideMenus }) => <RaddxTabs hideMenus={hideMenus} />;

const HurleyNfts = ({ hideMenus }) => <HurleyTabs hideMenus={hideMenus} />;

const MiniGameNfts = ({ hideMenus }) => <MiniGameTabs hideMenus={hideMenus} />;

export default MyNFTsNew;
