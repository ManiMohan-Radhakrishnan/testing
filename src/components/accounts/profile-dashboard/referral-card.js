import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import { OverlayTrigger, Popover } from "react-bootstrap";
import {
  AiFillFacebook,
  AiFillTwitterCircle,
  AiOutlineLink,
} from "react-icons/ai";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import { MdFileCopy, MdShare } from "react-icons/md";

import { getReferralDashboardList } from "../../../api/methods";
import { getUserInfo } from "../../../redux/reducers/user_reducer";
import Loader from "./loader";

import referalImage from "../../../images/refer-earn/hero-left.svg";

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
  );
};

const ReferralCard = () => {
  const user = useSelector(getUserInfo);
  const [loading, setLoading] = useState(false);
  const [referralDashboard, setreferralDashboard] = useState();

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const result = await getReferralDashboardList();
      setreferralDashboard(result?.data?.data);
    } catch (error) {
      console.error(`Error in fetching referral details`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  return (
    <article className="grid-card">
      {loading ? (
        <Loader />
      ) : (
        <div className="card-box  refer-card">
          <div className="refer-sidenav-block">
            <div className="heading-box">
              <h1>REFER &amp; REWARD</h1>
              <h5>Invite friends. Get rewards.</h5>
            </div>
            <article className="refer-link-band">
              <h5>
                Your Invite code:
                <span className="code-box">
                  {referralDashboard?.referral_code}
                  <span className="btn-box">
                    <CopyToClipboard
                      role="button"
                      text={referralDashboard?.referral_code}
                      onCopy={() => {
                        toast.success("Copied to Clipboard");
                      }}
                    >
                      <MdFileCopy className="copy-btn" />
                    </CopyToClipboard>
                    <SharePopover
                      icon={<MdShare className="share-btn" />}
                      placement="top"
                      user={user}
                    />
                  </span>
                </span>
              </h5>
            </article>
            <img
              src={referalImage}
              alt="referalImage"
              className="referal-staticimg"
            />
          </div>
        </div>
      )}
    </article>
  );
};

export default ReferralCard;
