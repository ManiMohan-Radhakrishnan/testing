import React from "react";
import { MdFileCopy, MdShare } from "react-icons/md";

import "./style.scss";
import HeroBG from "../../../images/refer-earn/hero-bubble.png";
import Heroright from "../../../images/refer-earn/hero-right.svg";
import Heroleft from "../../../images/refer-earn/hero-left.svg";
import ShareIcon from "../../../images/refer-earn/icons/share.svg";
import RegisterIcon from "../../../images/refer-earn/icons/register.svg";
import KYCIcon from "../../../images/refer-earn/icons/kyc.svg";
import PurchaseIcon from "../../../images/refer-earn/icons/purchase.svg";
import TreasureboxIcon from "../../../images/refer-earn/icons/tresurebox.svg";

const ReferEarnInstruction = () => {
  return (
    <>
      <section className="main-content-block refer-earnpage px-0">
        <section
          className="refer-banner"
          style={{ backgroundImage: `url(${HeroBG})` }}
        >
          <img
            alt="Hero-Lft"
            src={Heroleft}
            className="hero-content-image left"
          />
          <img
            alt="Hero-Ryt"
            src={Heroright}
            className="hero-content-image right"
          />
          <div className="hero-content">
            <h1>Refer &amp; Reward</h1>
            <h5>Invite friends. Get rewards.</h5>
            <p>
              We are offering wide range of referral programs, rewards and
              prizes for the every successful referral.
            </p>

            {/* <div className="refer-code-box">
              <h6>
                Your Invite code: <span>REFERPROG</span>
              </h6>
              <button className="copy-btn">
                <MdFileCopy />
                Copy
              </button>
            </div> */}

            <article className="refer-link-band">
              <h5>
                Your Invite code: <span>REFERPROG</span>
              </h5>
              <button className="copy-btn">
                <MdFileCopy />
                Copy
              </button>
            </article>

            <button className="share-btn">
              Share <MdShare />
            </button>
          </div>
        </section>
        <section className="refferal-program-info  drop">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="section-heading">DROP REFFERAL PROGRAM</div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <article className="referral-program-info-detail">
                  <ul className="refferal-icon-flex">
                    <li className="refferal-icon-flex-box">
                      <img
                        src={ShareIcon}
                        alt={ShareIcon}
                        className="refferal-icon"
                      />
                      <h5>Share</h5>
                    </li>
                    <li className="refferal-icon-flex-box">
                      <img
                        src={RegisterIcon}
                        alt={RegisterIcon}
                        className="refferal-icon"
                      />
                      <h5>Register</h5>
                    </li>
                    <li className="refferal-icon-flex-box">
                      <img
                        src={KYCIcon}
                        alt={KYCIcon}
                        className="refferal-icon"
                      />
                      <h5>KYC</h5>
                    </li>
                    <li className="refferal-icon-flex-box">
                      <img
                        src={PurchaseIcon}
                        alt={PurchaseIcon}
                        className="refferal-icon"
                      />
                      <h5>Purchase</h5>
                    </li>
                    <li className="refferal-icon-flex-box">
                      <img
                        src={TreasureboxIcon}
                        alt={TreasureboxIcon}
                        className="refferal-icon"
                      />
                      <h5>Treasure box</h5>
                    </li>
                  </ul>
                  <ul className="refferal-content-flex">
                    <li className="refferal-content-flex-box">
                      <p>
                        Once you Share referral link with your friends you will
                        be eligible for <b>10$ reward bonus</b>.
                      </p>
                    </li>
                    <li className="refferal-content-flex-box">
                      <p>
                        When Your friend registers in the site using the shared
                        link You will receive <b>$10 reward bonus instantly</b>.
                      </p>
                      <p className="hint">
                        Rewards will be used for buying NFTs or joining the
                        contest in MCL.
                      </p>
                    </li>
                    <li className="refferal-content-flex-box">
                      <p>
                        When you and your friend Complete the KYC, You will
                        receive a <b>locked treasure box</b>. To <b>unlock</b>,
                        referred friend should make a <b>NFT purchase</b>.
                      </p>
                      <p className="hint">
                        (To unlock, referred friend and you should complete KYC)
                      </p>
                    </li>
                    <li className="refferal-content-flex-box">
                      <p>
                        When your Friend make <b>first NFT</b> purchase Your{" "}
                        <b>treasure box</b> will be <b>unlocked</b>.<sup>*</sup>
                      </p>
                      <p className="hint">
                        (To unlock, referred friend and you should complete KYC)
                      </p>
                    </li>
                    <li className="refferal-content-flex-box">
                      <p>
                        You are eligible for referral contest to gets exciting
                        prizes like{" "}
                        <b>BMW Bike, iPhone 14 pro, Playstation, Asus laptop</b>{" "}
                        and many more.{" "}
                        <b>More the referral, more the chances of winning</b>.
                      </p>
                      <p className="hint">
                        BMW Bike, iPhone 14 pro, Playstation, Asus laptop
                      </p>
                    </li>
                  </ul>
                </article>
              </div>
            </div>
          </div>
        </section>
        <section className="refferal-program-info premium">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="section-heading">PREMIUM REFERRAL PROGRAM</div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <article className="referral-program-info-detail">
                  <ul className="refferal-icon-flex">
                    <li className="refferal-icon-flex-box">
                      <img
                        src={ShareIcon}
                        alt={ShareIcon}
                        className="refferal-icon"
                      />
                      <h5>Share</h5>
                    </li>
                    <li className="refferal-icon-flex-box">
                      <img
                        src={RegisterIcon}
                        alt={RegisterIcon}
                        className="refferal-icon"
                      />
                      <h5>Register</h5>
                    </li>
                    <li className="refferal-icon-flex-box">
                      <img
                        src={KYCIcon}
                        alt={KYCIcon}
                        className="refferal-icon"
                      />
                      <h5>KYC</h5>
                    </li>
                    <li className="refferal-icon-flex-box">
                      <img
                        src={PurchaseIcon}
                        alt={PurchaseIcon}
                        className="refferal-icon"
                      />
                      <h5>Purchase</h5>
                    </li>
                    <li className="refferal-icon-flex-box">
                      <img
                        src={TreasureboxIcon}
                        alt={TreasureboxIcon}
                        className="refferal-icon"
                      />
                      <h5>Treasure box</h5>
                    </li>
                  </ul>
                  <ul className="refferal-content-flex">
                    <li className="refferal-content-flex-box">
                      <p>
                        Once you Share referral link with your friends you will
                        be eligible for <b>10$ reward bonus</b>.
                      </p>
                    </li>
                    <li className="refferal-content-flex-box">
                      <p>
                        When Your friend registers in the site using the shared
                        link You will receive <b>$10 reward bonus instantly</b>.
                      </p>
                      <p className="hint">
                        Rewards will be used for buying NFTs or joining the
                        contest in MCL.
                      </p>
                    </li>
                    <li className="refferal-content-flex-box">
                      <p>
                        When you and your friend Complete the KYC, You will
                        receive a <b>locked treasure box</b>. To <b>unlock</b>,
                        referred friend should make a <b>NFT purchase</b>.
                      </p>
                      <p className="hint">
                        (To unlock, referred friend and you should complete KYC)
                      </p>
                    </li>
                    <li className="refferal-content-flex-box">
                      <p>
                        When your Friend make <b>first NFT</b> purchase Your{" "}
                        <b>treasure box</b> will be <b>unlocked</b>.<sup>*</sup>
                      </p>
                      <p className="hint">
                        (To unlock, referred friend and you should complete KYC)
                      </p>
                    </li>
                    <li className="refferal-content-flex-box">
                      <p>
                        You are eligible for referral contest to gets exciting
                        prizes like{" "}
                        <b>BMW Bike, iPhone 14 pro, Playstation, Asus laptop</b>{" "}
                        and many more.{" "}
                        <b>More the referral, more the chances of winning</b>.
                      </p>
                      <p className="hint">
                        BMW Bike, iPhone 14 pro, Playstation, Asus laptop
                      </p>
                    </li>
                  </ul>
                </article>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default ReferEarnInstruction;
