import React, { useEffect, useState } from "react";
import {
  RiUser3Line,
  RiWallet3Line,
  RiSettings5Line,
  RiLogoutCircleRLine,
  RiShoppingCart2Line,
  RiBookmarkLine,
  RiAuctionLine,
  RiFileDownloadLine,
  RiRuler2Line,
  RiLockPasswordFill,
  RiDashboardLine,
  RiTableAltLine,
} from "react-icons/ri";
import {
  MdCardMembership,
  MdConnectWithoutContact,
  MdSportsCricket,
} from "react-icons/md";
import { VscChecklist } from "react-icons/vsc";
import { BsCardList } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useRouteMatch } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Accordion, Card, useAccordionButton } from "react-bootstrap";
import { MdKeyboardBackspace } from "react-icons/md";
import { MdFileCopy, MdShare } from "react-icons/md";
import { toast } from "react-toastify";
import { CopyToClipboard } from "react-copy-to-clipboard";

import referalImage from "../../images/refer-earn/hero-left.svg";
import nftImage from "../../images/nft-image.svg";
import { getReferralDashboardList } from "../../api/methods";
import { user_logout_thunk } from "../../redux/thunk/user_thunk";

// Share popup dependency
import { OverlayTrigger, Popover } from "react-bootstrap";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import {
  AiFillFacebook,
  AiFillTwitterCircle,
  AiOutlineFileProtect,
  AiOutlineLink,
} from "react-icons/ai";

function ContextAwareToggle({ children, eventKey, callback }) {
  const decoratedOnClick = useAccordionButton(eventKey, () => {
    callback && callback(eventKey);
  });

  return (
    <button type="button" onClick={decoratedOnClick}>
      {children}
    </button>
  );
}

const SideNav = ({
  MenuList,
  guildUserMenuList,
  getUserPermission,
  guildInvite,
}) => {
  const [referralDashboard, setreferralDashboard] = useState();
  useEffect(() => {
    referralDashboardList();
  }, []);

  const referralDashboardList = async () => {
    try {
      const result = await getReferralDashboardList();
      setreferralDashboard(result?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const width = window.innerWidth > 769;

  const [isIndiggMenu, setIsIndiggMenu] = useState("");

  let guild_route = [
    "dashboard",
    "guild-profile",
    "guild-mynft",
    "guild-wallet",
    "user-management-profile",
    "user-management-sub-admin",
    "guild-activity",
    "game-history",
  ];

  if (isIndiggMenu === "show-menu") {
    document.body.classList.add("show-guild");
  } else {
    document.body.classList.remove("show-guild");
  }

  const dashboardIcon = (givencomponent) => {
    switch (givencomponent) {
      case "dashboard":
        return <RiDashboardLine className="icon" />;
      case "guildnft":
        return <BsCardList className="icon" />;
      case "user":
        return <RiUser3Line className="icon" />;
      case "guildrole":
        return <RiTableAltLine className="icon" />;
      case "activity":
        return <VscChecklist className="icon" />;
      default:
        return <RiDashboardLine className="icon" />;
    }
  };

  const { page } = match.params;
  const currentPage = page ? page : "profile";
  let defaultKey;
  if (width) {
    if (
      currentPage === "mynft" ||
      currentPage === "my-cards" ||
      currentPage === "profile"
    ) {
      defaultKey = "0";
    } else {
      defaultKey = null;
    }
  }
  const { user } = useSelector((state) => state.user.data);

  const currentPageIndigg = page ? page : "profile";
  let defaultKeyIndigg;
  if (width) {
    if (
      currentPageIndigg === "mynft" ||
      currentPageIndigg === "my-cards" ||
      currentPageIndigg === "profile"
    ) {
      defaultKey = "0";
    } else {
      defaultKey = null;
    }
  }

  const Guild_url =
    window.location.origin + "/signup?guild_source=" + guildInvite;

  return (
    <>
      <div className="side_menu" id="tab_section">
        <div className="vertical-wrapper">
          <ul className="vertical-group">
            <Accordion defaultActiveKey={defaultKey}>
              <li
                className={`vertical-item level1 ${
                  ["mynft", "profile", "my-cards"].includes(currentPage)
                    ? "list-active"
                    : ""
                }`}
              >
                <Link
                  to="/accounts/profile"
                  className="list_item_a accordion-header"
                  id="headingOne"
                >
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>
                      <RiUser3Line />
                      <span>My Profile</span>
                    </Accordion.Header>
                  </Accordion.Item>
                </Link>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    <li
                      className={`vertical-item level1 ${
                        currentPage === "mynft" ? "list-active" : ""
                      }`}
                    >
                      <Link to="/accounts/mynft" className="list_item_a">
                        {/* <FaUser className="icon" /> */}
                        <img src={nftImage} className="nft-image" alt="" />
                        <span>NFTs</span>
                      </Link>
                    </li>
                    <li
                      className={`vertical-item level1 ${
                        currentPage === "my-cards" ? "list-active" : ""
                      }`}
                    >
                      <Link to="/accounts/my-cards" className="list_item_a">
                        <BsCardList />
                        <span>Cards</span>
                      </Link>
                    </li>
                    {/* <li
                      className={`vertical-item level1 ${
                        currentPage === "play-nfts" ? "list-active" : ""
                      }`}
                    >
                      <Link to="/accounts/play-nfts" className="list_item_a">
                        <MdSportsCricket />
                        <span>Play Nfts</span>
                      </Link>
                    </li> */}
                    <li
                      className={`vertical-item level1 ${
                        currentPage === "referral" ? "list-active" : ""
                      }`}
                    >
                      <Link to="/accounts/referral" className="list_item_a">
                        <MdConnectWithoutContact />
                        <span>
                          Referral <i className="newbadge blink_me">new</i>
                        </span>{" "}
                      </Link>
                    </li>
                  </Card.Body>
                </Accordion.Collapse>
              </li>

              <li
                className={`vertical-item level1 ${
                  currentPage === "wallet" ? "list-active" : ""
                }`}
              >
                <ContextAwareToggle eventKey="1">
                  <Link to="/accounts/wallet" className="list_item_a">
                    <RiWallet3Line className="icon" />{" "}
                    <span>GuardianLink Wallet</span>
                  </Link>
                </ContextAwareToggle>
              </li>
              {/* <li
                className={`vertical-item level1 ${
                  currentPage === "refer-earn" ? "list-active" : ""
                }`}
              >
                <ContextAwareToggle eventKey="1">
                  <Link to="/accounts/refer-earn/" className="list_item_a">
                    <RiWallet3Line className="icon" />{" "}
                    <span>Refer and Earn</span>
                  </Link>
                </ContextAwareToggle>
              </li> */}

              <li
                className={`vertical-item level1 ${
                  [
                    "my-orders",
                    "myinvoice",
                    "limit-orders",
                    "pre-orders",
                    "game-pass",
                    "bid-activity",
                  ].includes(currentPage)
                    ? "list-active"
                    : ""
                }`}
              >
                <ContextAwareToggle eventKey="2">
                  <Link to="/accounts/my-orders" className="list_item_a">
                    <Accordion.Item eventKey="2">
                      <Accordion.Header>
                        <RiShoppingCart2Line />
                        <span>Orders</span>
                      </Accordion.Header>
                    </Accordion.Item>
                  </Link>
                </ContextAwareToggle>
                <Accordion.Collapse eventKey="2">
                  <Card.Body>
                    <li
                      className={`vertical-item level1 ${
                        currentPage === "my-orders" ? "list-active" : ""
                      }`}
                    >
                      <Link to="/accounts/my-orders" className="list_item_a">
                        <RiShoppingCart2Line /> <span>My Orders</span>
                        {/* <i className="fas fa-analytics"></i> */}
                      </Link>
                    </li>

                    <li
                      className={`vertical-item level1 ${
                        currentPage === "myinvoice" ? "list-active" : ""
                      }`}
                    >
                      <Link to="/accounts/myinvoice" className="list_item_a">
                        <RiFileDownloadLine />
                        <span>Invoices</span>
                      </Link>
                    </li>
                    <li
                      className={`vertical-item level1 ${
                        currentPage === "bid-activity" ? "list-active" : ""
                      }`}
                    >
                      <Link to="/accounts/bid-activity" className="list_item_a">
                        <RiAuctionLine /> <span>My Bids</span>
                        {/* <i className="fas fa-analytics"></i>  */}
                      </Link>
                    </li>
                    <li
                      className={`vertical-item level1 ${
                        currentPage === "pre-orders" ? "list-active" : ""
                      }`}
                    >
                      <Link to="/accounts/pre-orders" className="list_item_a">
                        <RiBookmarkLine /> <span>Pre Book</span>
                      </Link>
                    </li>
                    <li
                      className={`vertical-item level1 ${
                        currentPage === "game-pass" ? "list-active" : ""
                      }`}
                    >
                      <Link to="/accounts/game-pass" className="list_item_a">
                        <MdSportsCricket /> <span>Game Pass</span>
                      </Link>
                    </li>
                    <li
                      className={`vertical-item level1 ${
                        currentPage === "limit-orders" ? "list-active" : ""
                      }`}
                    >
                      <Link to="/accounts/limit-orders" className="list_item_a">
                        <RiRuler2Line />{" "}
                        <span>
                          Limit Orders
                          {/* <i className="newbadge blink_me">new</i> */}
                        </span>
                      </Link>
                    </li>
                  </Card.Body>
                </Accordion.Collapse>
              </li>

              <li
                className={`vertical-item level1 ${
                  currentPage === "user-activity" ? "list-active" : ""
                }`}
              >
                <ContextAwareToggle eventKey="3">
                  <Link to="/accounts/user-activity" className="list_item_a">
                    <VscChecklist /> <span>Activity</span>
                  </Link>
                </ContextAwareToggle>
              </li>

              <li
                className={`vertical-item level1 ${
                  currentPage === "settings" ? "list-active" : ""
                }`}
              >
                <ContextAwareToggle eventKey="4">
                  <Link to="/accounts/settings" className="list_item_a">
                    <Accordion.Item eventKey="4">
                      <Accordion.Header>
                        <RiSettings5Line />
                        <span> Settings</span>
                      </Accordion.Header>
                    </Accordion.Item>
                  </Link>
                </ContextAwareToggle>
                <Accordion.Collapse eventKey="4">
                  <Card.Body>
                    <li
                      className={`vertical-item level1 ${
                        currentPage === "settings" ? "list-active" : ""
                      }`}
                    >
                      <Link to="/accounts/settings" className="list_item_a">
                        <RiLockPasswordFill /> <span>Security Settings</span>
                      </Link>
                    </li>
                    <li
                      className={`vertical-item level1 ${
                        currentPage === "whitelist" ? "list-active" : ""
                      }`}
                    >
                      <Link to="/accounts/whitelist" className="list_item_a">
                        <AiOutlineFileProtect />{" "}
                        <span>Whitelist Payment ID</span>
                      </Link>
                    </li>
                  </Card.Body>
                </Accordion.Collapse>
              </li>

              {(() => {
                if (MenuList && MenuList?.length > 0) {
                  return (
                    <li className={`vertical-item level1 web-guild-btn`}>
                      {MenuList?.indexOf["dashboard"] ? (
                        <Link
                          to="/accounts/dashboard"
                          className={`list_item_a guild-menu-btn ${
                            guild_route?.indexOf(currentPageIndigg) > -1
                              ? "hide-btn"
                              : ""
                          }`}
                          onClick={() => {
                            setIsIndiggMenu("show-menu");
                            //setGuildMenuStatus(true);
                          }}
                        >
                          <span>
                            <MdCardMembership />
                            Guild{" "}
                            <MdKeyboardBackspace className="feature-arrow" />
                          </span>
                        </Link>
                      ) : (
                        <Link
                          to={`/accounts/${MenuList[0]}`}
                          className={`list_item_a guild-menu-btn ${
                            guild_route?.indexOf(currentPageIndigg) > -1
                              ? "hide-btn"
                              : ""
                          }`}
                          onClick={() => {
                            setIsIndiggMenu("show-menu");
                            getUserPermission();
                          }}
                        >
                          <span>
                            <MdCardMembership />
                            Guild{" "}
                            <MdKeyboardBackspace className="feature-arrow" />
                          </span>
                        </Link>
                      )}
                    </li>
                  );
                }
                return null;
              })()}
            </Accordion>
            {(() => {
              if (MenuList && MenuList.length > 0) {
                return (
                  <li className={`vertical-item level1 mobile-guild-btn`}>
                    {MenuList?.indexOf["dashboard"] ? (
                      <Link
                        to="/accounts/guild-mynft"
                        className={` guild-menu-btn ${
                          guild_route.indexOf(currentPageIndigg) > -1
                            ? "hide-btn"
                            : ""
                        }`}
                        onClick={() => setIsIndiggMenu("show-menu")}
                      >
                        <span>
                          Guild <MdKeyboardBackspace />
                        </span>
                      </Link>
                    ) : (
                      <Link
                        to={`/accounts/${MenuList[0]}`}
                        className={` guild-menu-btn ${
                          guild_route.indexOf(currentPageIndigg) > -1
                            ? "hide-btn"
                            : ""
                        }`}
                        onClick={() => {
                          setIsIndiggMenu("show-menu");
                          getUserPermission();
                        }}
                      >
                        <span>
                          Guild <MdKeyboardBackspace />
                        </span>
                      </Link>
                    )}
                  </li>
                );
              }
              return null;
            })()}
          </ul>
          <div className="fixed-footer-aside">
            <ul className="vertical-group">
              <li className={`vertical-item level1`}>
                <Link
                  to="#"
                  className="list_item_a  d-flex custom-logout"
                  onClick={() => dispatch(user_logout_thunk())}
                >
                  <span>
                    <RiLogoutCircleRLine />
                  </span>
                  <span>Sign Out</span>
                </Link>
              </li>
            </ul>
          </div>
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
      </div>

      <div
        className={`side_menu indgg-side_menu ${
          guild_route.indexOf(currentPageIndigg) > -1 ? "show-menu" : ""
        }`}
        id="tab_section"
      >
        <div className="vertical-wrapper">
          <ul className="vertical-group">
            <Accordion>
              {/* Dashboard 9 */}
              <div className="sub-sidenave-header">
                <Link to="/accounts">
                  <MdKeyboardBackspace onClick={() => setIsIndiggMenu("")} />{" "}
                </Link>
                <span>Guild</span>
              </div>
              <ul className="sub-sidenave-menu-list">
                {guildUserMenuList &&
                  guildUserMenuList?.length > 0 &&
                  guildUserMenuList?.map((guilddata, guildindex) => {
                    return (
                      <li
                        key={guildindex}
                        className={`vertical-item level1 ${
                          currentPageIndigg === MenuList[guildindex]
                            ? "list-active"
                            : ""
                        }`}
                      >
                        <Link
                          to={`/accounts/${MenuList[guildindex]}`}
                          className="list_item_a"
                        >
                          {dashboardIcon(guilddata?.name_key)}
                          <span>{guilddata?.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                <li>
                  <div className="refer-sidenav-block guild-sidenav">
                    <div className="heading-box">
                      <h1>GUILD INVITE LINK</h1>
                      <h5>Invite new members to your guild!</h5>
                    </div>

                    <article className="refer-link-band">
                      <CopyToClipboard
                        role="button"
                        className="me-2"
                        text={`${Guild_url}`}
                        onCopy={() => {
                          toast.success("Copied to Clipboard");
                        }}
                      >
                        <h5>
                          Indigg Invite Code:
                          <span className="code-box noselect">
                            {guildInvite}
                            {/* <span className="btn-box d-flex">
                            <CopyToClipboard
                              role="button"
                              text={guildInvite}
                              onCopy={() => {
                                toast.success("Copied to Clipboard");
                              }}
                            >
                              <MdFileCopy className="copy-btn" />
                            </CopyToClipboard>
                            
                          </span> */}
                          </span>
                        </h5>
                      </CopyToClipboard>
                    </article>

                    <img
                      src={referalImage}
                      alt="referalImage"
                      className="referal-staticimg"
                    />
                    <GuildSharePopover
                      icon={<MdShare className="share-btn" />}
                      placement="top"
                      user={user}
                      invitecode={guildInvite}
                    />
                  </div>
                </li>
              </ul>
            </Accordion>
          </ul>

          {/* <div className="fixed-footer-aside">
            <ul className="vertical-group">
              <li className={`vertical-item level1`}>
                <Link
                  to="#"
                  className="list_item_a  d-flex custom-logout"
                  onClick={() => dispatch(user_logout_thunk())}
                >
                  <span>
                    <RiLogoutCircleRLine />
                  </span>
                  <span>Sign Out</span>
                </Link>
              </li>
            </ul>
          </div> */}
        </div>
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

const GuildSharePopover = ({ user, icon, placement, invitecode }) => {
  // const referralcode = user?.slug;

  const url = window.location.origin + "/signup?guild_source=" + invitecode;
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
      <article className="guild-share-list">
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
              `https://www.facebook.com/sharer/sharer.php?url=${`${encodeURIComponent(
                url
              )}`}&quote=Join the IndiGG Guild and begin playing Meta Cricket League. When registering, use the Invite Code:${invitecode}. Click here`
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
              `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}
                      &text=Join the IndiGG Guild and begin playing Meta Cricket League. When registering, use the Invite Code:${invitecode}. Click here`
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
                      &title=Join the IndiGG Guild and begin playing Meta Cricket League. When registering, use the Invite Code:${invitecode}. Click here`
            )
          }
        />

        <FaWhatsapp
          role="button"
          size={35}
          style={{ color: "#25D366" }}
          onClick={() => {
            detectWhatsapp(
              `whatsapp://send?text=Join the IndiGG Guild and begin playing Meta Cricket League. When registering, use the Invite Code:${invitecode}. Click here:${encodeURIComponent(
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
      </article>
    </>
  );
};
export default SideNav;
