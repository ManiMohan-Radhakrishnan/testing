import React, { useEffect, useState } from "react";
import { MdFileCopy, MdShare } from "react-icons/md";
import ReferralList from "../referral-list";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { toast } from "react-toastify";
import {
  AiFillFacebook,
  AiFillHome,
  AiFillTwitterCircle,
  AiOutlineLink,
} from "react-icons/ai";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useSelector } from "react-redux";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";

import ReferalTotal from "../../images/refer-earn/ref-icons/referal-total.svg";
import ReferalComplete from "../../images/refer-earn/ref-icons/referal-complete.svg";
import ReferalPending from "../../images/refer-earn/ref-icons/referal-pending.svg";
import TreasureBoxBig from "../../images/jump-trade/treasurebox.png";
import ToolTip from "../tooltip/index";
import "./referral-style.scss";
import { ReferralLoader } from "./content-page-loader";
import { getReferralDashboardList } from "../../api/methods";

// import CardReward from "../../images/refer-earn/ref-icons/card-reward.svg";
// import TreasureBox from "../../images/refer-earn/ref-icons/treasure-box.svg";
// import PotentialEarning from "../../images/refer-earn/ref-icons/potential-earning.svg";

const Referral = () => {
  const { user } = useSelector((state) => state.user.data);

  const [loading, setLoading] = useState(false);
  const [referralDashboard, setReferralDashboard] = useState();
  useEffect(() => {
    ReferralDashboardList();
  }, []);

  const ReferralDashboardList = async () => {
    try {
      setLoading(true);
      const result = await getReferralDashboardList();
      setReferralDashboard(result?.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <>
      <div className="main-content-block">
        {referralDashboard ? (
          <secttion className="referral-section">
            {/* <article className="refer-link-band">
              <h5>
                Your Invite code:{" "}
                <span className="captital">
                  {referralDashboard?.referral_code}
                </span>
              </h5>

              <CopyToClipboard
                role="button"
                text={referralDashboard?.referral_code}
                onCopy={() => {
                  toast.success("Copied to Clipboard");
                }}
              >
                <button className="copy-btn">
                  <MdFileCopy />
                  Copy
                </button>
              </CopyToClipboard>
            </article> */}
            <article className="refer-link-band-heading">
              <div className="refer-breadcrumb">
                <ul>
                  <li>
                    <AiFillHome />
                  </li>
                  <li>Profile</li>
                  <li>Referrals</li>
                </ul>
                <h5 className="refer-breadcrumb-title">Referrals</h5>
              </div>
              <div className="refer-link-band">
                <h5>
                  Invite code: <span>{referralDashboard?.referral_code}</span>
                </h5>
                <CopyToClipboard
                  role="button"
                  text={referralDashboard?.referral_code}
                  onCopy={() => {
                    toast.success("Copied to Clipboard");
                  }}
                >
                  <button className="copy-btn">
                    <MdFileCopy />
                    Copy
                  </button>
                </CopyToClipboard>
                <button className="share-btn">
                  <SharePopover
                    icon={
                      <div>
                        <MdShare />
                        {/* Reminder */}
                      </div>
                    }
                    user={user}
                    placement="top"
                  />
                </button>
              </div>
            </article>
            {/* <div className=" container-fluid">
              <div className="row g-3">
                <div className="col-12">
                  <div className="referal--flex">
                    <div className="referal--box">
                      <img src={ReferalTotal} alt="ReferalTotal" />
                      <h6>No. of Referrals</h6>
                      <h3 className="referal-num">
                        {referralDashboard?.no_of_referrals}
                      </h3>
                    </div>
                    <div className="referal--box">
                      <img src={ReferalComplete} alt="ReferalComplete" />
                      <h6>Completed</h6>
                      <h3 className="referal-num">
                        {referralDashboard?.completed}
                      </h3>
                    </div>
                    <div className="referal--box">
                      <img src={ReferalPending} alt="ReferalPending" />
                      <h6>Pending</h6>
                      <h3 className="referal-num">
                        {referralDashboard?.pending}
                      </h3>
                    </div>
                    <div className="referal--box">
                      <img src={CardReward} alt="CardReward" />
                      <h6>Cash Rewards</h6>
                      <h3 className="referal-num">
                        {referralDashboard?.cash_rewards}
                      </h3>
                    </div>
                    <div className="referal--box">
                      <img src={TreasureBox} alt="TreasureBox" />
                      <h6>Treasure Box</h6>
                      <h3 className="referal-num">
                        {referralDashboard?.treasure_box}
                      </h3>
                    </div>
                    <div className="referal--box">
                      <img src={PotentialEarning} alt="PotentialEarning" />
                      <h6>Potential Earnings</h6>
                      <h3 className="referal-num">
                        {referralDashboard?.potentail_earnings}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            <div className=" container-fluid">
              <div className="row g-3">
                <div className="col-12">
                  <div className="referal--flex combine-card">
                    <div className="referal--box">
                      <h4 className="referal--box-heading">
                        Referrals{" "}
                        <ToolTip
                          icon={
                            <IoIosInformationCircleOutline
                              size={16}
                              className="mb-1 check-icon"
                            />
                          }
                          content={
                            "Get Details About Your Referrals & The Progress"
                          }
                          placement="right"
                        />
                      </h4>
                      <p>Refer your friends to Jump.trade</p>
                      <ul>
                        <li>
                          <img src={ReferalTotal} alt="ReferalTotal" />
                          <div className="referal--box-info">
                            <h6>No. of Referrals</h6>
                            <h3 className="referal-num">
                              {referralDashboard?.no_of_refferals}
                            </h3>
                          </div>
                        </li>
                        <li>
                          <img src={ReferalComplete} alt="ReferalComplete" />
                          <div className="referal--box-info">
                            <h6>Completed</h6>
                            <h3 className="referal-num">
                              {referralDashboard?.completed}
                            </h3>
                          </div>
                        </li>
                        <li>
                          <img src={ReferalPending} alt="ReferalPending" />

                          <div className="referal--box-info">
                            <h6>Pending</h6>
                            <h3 className="referal-num">
                              {referralDashboard?.pending}
                            </h3>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="referal--box fullbox">
                      <div className="referal--box-set">
                        <h4 className="referal--box-heading">
                          Rewards{" "}
                          <ToolTip
                            icon={
                              <IoIosInformationCircleOutline
                                size={16}
                                className="mb-1 check-icon"
                              />
                            }
                            content={
                              "Get Details On The Rewards You Have Earned!"
                            }
                            placement="right"
                          />
                        </h4>
                        <p>Get Rewarded For Their NFT Purchases</p>
                      </div>
                      {/* <ul>
                        <li>
                          <img src={CardReward} alt="CardReward" />
                          <div className="referal--box-info">
                            <h6>Cash Rewards</h6>
                            <h3 className="referal-num">
                              {referralDashboard?.cash_rewards}
                            </h3>
                          </div>
                        </li>
                        <li>
                          <img src={TreasureBox} alt="TreasureBox" />
                          <div className="referal--box-info">
                            <h6>Treasure Box</h6>
                            <h3 className="referal-num">
                              {referralDashboard?.treasure_box}
                            </h3>
                          </div>
                        </li>
                      </ul> */}
                      <div className="treasurebox-block">
                        <img src={TreasureBoxBig} alt="TreasureBoxBig" />
                        <div className="treasurebox-content">
                          <h5>Treasure Box</h5>
                          <h2>{referralDashboard?.treasure_box}</h2>
                        </div>
                      </div>
                    </div>
                    {/* <div className="referal--box">
                      <img src={PotentialEarning} alt="PotentialEarning" />
                      <h6>Potential Earnings</h6>
                      <h3 className="referal-num">
                        {referralDashboard?.potentail_earnings}
                      </h3>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </secttion>
        ) : (
          <ReferralLoader />
        )}

        <ReferralList />
      </div>
    </>
  );
};

const SharePopover = ({
  user,
  icon,
  placement,
  title,
  listedShare = false,
}) => {
  const referralcode = user?.referral_code;

  const url =
    window.location.origin +
    "/signup?fsz=carnftrefer&referralcode=" +
    referralcode;
  // var hashtags = "jump.trade,NFT,popularNFT,rareNFT,NFTMarketplace";
  // const via = "jump.trade";

  const detectWhatsapp = (uri) => {
    const onIE = () => {
      return new Promise((resolve) => {
        window.navigator.msLaunchUri(
          uri,
          () => resolve(true),
          () => resolve(false)
        );
      });
    };

    const notOnIE = () => {
      return new Promise((resolve) => {
        const a =
          document.getElementById("wapp-launcher") ||
          document.createElement("a");
        a.id = "wapp-launcher";
        a.href = uri;
        a.style.display = "none";
        document.body.appendChild(a);

        const start = Date.now();
        const timeoutToken = setTimeout(() => {
          if (Date.now() - start > 1250) {
            resolve(true);
          } else {
            resolve(false);
          }
        }, 1000);

        const handleBlur = () => {
          clearTimeout(timeoutToken);
          resolve(true);
        };
        window.addEventListener("blur", handleBlur);

        a.click();
      });
    };

    return window.navigator.msLaunchUri ? onIE() : notOnIE();
  };

  return (
    <>
      <OverlayTrigger
        trigger="click"
        rootClose
        key={placement}
        placement={placement}
        overlay={
          <Popover className="mb-2">
            <Popover.Body className="p-1 custom-pop">
              <>
                <CopyToClipboard
                  role="button"
                  className="me-2"
                  text={`${url}`}
                  onCopy={() => {
                    toast.success("Copied to Clipboard");
                  }}
                >
                  <AiOutlineLink size={35} />
                </CopyToClipboard>
                <AiFillFacebook
                  role="button"
                  className="me-2"
                  size={35}
                  style={{ color: "#4267B2" }}
                  onClick={() =>
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${`${encodeURIComponent(
                        url
                      )}`}&quote=Hey!! I've found an awesome NFT collection... and I've got mine! Thought it would be great for you to get one too!%0a%0aPlease use the referral code when signing up! PS: If you buy your NFT, I get a referral reward... And I'm sure you'll do it for me!%0a%0a Cheers%0a%0a`
                    )
                  }
                />
                <AiFillTwitterCircle
                  role="button"
                  className="me-2"
                  size={35}
                  style={{ color: "#1DA1F2" }}
                  onClick={() =>
                    window.open(
                      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                        url
                      )}
                      &text=Hey!! I've found an awesome NFT collection... and I've got mine! Thought it would be great for you to get one too!%0a%0aPlease use the referral code when signing up! PS: If you buy your NFT, I get a referral reward... And I'm sure you'll do it for me!%0a%0a Cheers%0a%0a`
                    )
                  }
                />
                <FaTelegramPlane
                  role="button"
                  className="me-2"
                  size={35}
                  style={{ color: "#0088cc" }}
                  onClick={() =>
                    window.open(
                      `https://telegram.me/share/?url=${encodeURIComponent(url)}
                      &title=Hey!! I've found an awesome NFT collection... and I've got mine! Thought it would be great for you to get one too!%0a%0aPlease use the referral code when signing up! PS: If you buy your NFT, I get a referral reward... And I'm sure you'll do it for me!%0a%0a Cheers%0a%0a`
                    )
                  }
                />

                <FaWhatsapp
                  role="button"
                  size={35}
                  style={{ color: "#25D366" }}
                  onClick={() => {
                    detectWhatsapp(
                      `whatsapp://send?text=Hey!! I've found an awesome NFT collection... and I've got mine! Thought it would be great for you to get one too!%0a%0aPlease use the referral code when signing up! PS: If you buy your NFT, I get a referral reward... And I'm sure you'll do it for me!%0a%0a Cheers%0a%0a${encodeURIComponent(
                        url
                      )}`
                    ).then((hasWhatsapp) => {
                      if (!hasWhatsapp) {
                        alert(
                          "You don't have WhatsApp, kindly install it and try again"
                        );
                      }
                    });
                  }}
                />
              </>
            </Popover.Body>
          </Popover>
        }
      >
        <span>{icon}</span>
      </OverlayTrigger>
    </>
  );
};
export default Referral;
