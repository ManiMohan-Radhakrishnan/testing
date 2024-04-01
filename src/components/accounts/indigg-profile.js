/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useRef } from "react";

import { GAMES } from "../../utils/game-config";

import RaddxNfts from "./raddx.nfts";
import MclNfts from "./mcl-nfts";

import "./_style.scss";

const IndiggProfile = ({ guildUserMenuPermissionList }) => {
  const mynft = useRef(null);

  const [gameName, setGameName] = useState(GAMES.MCL);
  const isMclGame = gameName === GAMES.MCL;
  const isRaddxGame = gameName === GAMES.RADDX;

  return (
    <>
      <div className="px-0 main-content-block profilepage " ref={mynft}>
        <div className="container-fluid">
          {/* <div ref={mynft}></div> */}
          <div className="about-user">
            <div className="row">
              <div className="col-md-12 ">
                {/* <div className="mb-4 about-heading mynft-heading"> */}
                <div className="internal-heading-sec guild-heading-sec">
                  <h3 className="about-title">Guild NFTs</h3>
                  <div className="me-2"></div>
                </div>
                <div className="internal-heading-sec mnft-page">
                  <h3 className="about-title mobile-show">My NFTs</h3>
                  <div className="game-switch">
                    <span
                      className={`switch ${isMclGame ? "active" : ""}`}
                      onClick={() => setGameName(GAMES.MCL)}
                    >
                      MCL
                    </span>
                    <span
                      className={`switch ${
                        isRaddxGame ? "active" : ""
                      } raddx-disabled`}
                      onClick={() => setGameName(GAMES.RADDX)}
                      disabled
                    >
                      RADDX
                    </span>
                  </div>
                </div>
              </div>
              {/* </div> */}
            </div>

            <>
              {" "}
              {gameName === GAMES.MCL && (
                <MclNfts
                  guildUserMenuPermissionList={guildUserMenuPermissionList}
                />
              )}
              {gameName === GAMES.RADDX && (
                <RaddxNfts
                  guildUserMenuPermissionList={guildUserMenuPermissionList}
                />
              )}
            </>
          </div>
        </div>
      </div>
    </>
  );
};

export default IndiggProfile;
