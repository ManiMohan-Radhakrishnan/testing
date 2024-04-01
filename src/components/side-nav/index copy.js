import React, { useContext } from "react";
import {
  RiUser3Line,
  RiWallet3Line,
  RiSettings5Line,
  RiLayoutGridLine,
  RiLogoutCircleRLine,
  RiShoppingCart2Line,
  RiBookmarkLine,
  RiAuctionLine,
  RiFileDownloadLine,
  RiRuler2Line,
} from "react-icons/ri";
import { BsCardList } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useRouteMatch } from "react-router";
import { useDispatch } from "react-redux";

import { user_logout_thunk } from "../../redux/thunk/user_thunk";
// import { Accordion } from "react-bootstrap";
import { Accordion, Card, Button, useAccordionButton } from "react-bootstrap";
import AccordionContext from "react-bootstrap/AccordionContext";
import nftImage from "../../images/nft-image.svg";

function ContextAwareToggle({ children, eventKey, callback }) {
  const { activeEventKey } = useContext(AccordionContext);

  const decoratedOnClick = useAccordionButton(
    eventKey,
    () => callback && callback(eventKey)
  );

  return (
    <button type="button" onClick={decoratedOnClick}>
      {children}
    </button>
  );
}

const SideNav = () => {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const width = window.innerWidth > 769;

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

  return (
    <>
      {/* <div className="col-md-2"> */}
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
                <ContextAwareToggle eventKey="0">
                  <Link
                    to="/accounts/profile"
                    className="list_item_a accordion-header"
                    id="headingOne"
                  >
                    {/* <FaUser className="icon" /> */}

                    <RiUser3Line />
                    <span>My Profile</span>
                    {/* </button> */}
                  </Link>
                  {/* </li> */}
                </ContextAwareToggle>
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
                    <RiWallet3Line className="icon" /> <span>Wallet</span>
                  </Link>
                </ContextAwareToggle>
              </li>

              <li
                className={`vertical-item level1 ${
                  currentPage === "myinvoice" ? "list-active" : ""
                }`}
              >
                <ContextAwareToggle eventKey="2">
                  <Link to="/accounts/myinvoice" className="list_item_a">
                    <RiFileDownloadLine />
                    <span>Invoices</span>
                  </Link>
                </ContextAwareToggle>
              </li>

              <li
                className={`vertical-item level1 ${
                  currentPage === "my-orders" ? "list-active" : ""
                }`}
              >
                <ContextAwareToggle eventKey="3">
                  <Link to="/accounts/my-orders" className="list_item_a">
                    <RiShoppingCart2Line /> <span>My Orders</span>
                    {/* <i className="fas fa-analytics"></i> */}
                  </Link>
                </ContextAwareToggle>
              </li>
              <li
                className={`vertical-item level1 ${
                  currentPage === "limit-orders" ? "list-active" : ""
                }`}
              >
                <ContextAwareToggle eventKey="8">
                  <Link to="/accounts/limit-orders" className="list_item_a">
                    <RiRuler2Line />{" "}
                    <span>
                      Limit Orders <i className="newbadge blink_me">new</i>
                    </span>
                  </Link>
                </ContextAwareToggle>
              </li>
              <li
                className={`vertical-item level1 ${
                  currentPage === "pre-orders" ? "list-active" : ""
                }`}
              >
                <ContextAwareToggle eventKey="4">
                  <Link to="/accounts/pre-orders" className="list_item_a">
                    <RiBookmarkLine /> <span>Pre Book</span>
                  </Link>
                </ContextAwareToggle>
              </li>
              <li
                className={`vertical-item level1 ${
                  currentPage === "bid-activity" ? "list-active" : ""
                }`}
              >
                <ContextAwareToggle eventKey="5">
                  <Link to="/accounts/bid-activity" className="list_item_a">
                    <RiAuctionLine /> <span>My Bids</span>
                    {/* <i className="fas fa-analytics"></i>  */}
                  </Link>
                </ContextAwareToggle>
              </li>
              {/* <li
              className={`vertical-item level1 ${
                currentPage === "claim" ? "list-active" : ""
              }`}
            >
              <Link to="/accounts/claim" className="list_item_a">
                <RiHammerFill /> <span>Claim NFTs</span>
              </Link>
            </li> */}
              <li
                className={`vertical-item level1 ${
                  currentPage === "user-activity" ? "list-active" : ""
                }`}
              >
                <ContextAwareToggle eventKey="6">
                  <Link to="/accounts/user-activity" className="list_item_a">
                    <RiLayoutGridLine /> <span>My Activity</span>
                  </Link>
                </ContextAwareToggle>
              </li>
              <li
                className={`vertical-item level1 ${
                  currentPage === "settings" ? "list-active" : ""
                }`}
              >
                <ContextAwareToggle eventKey="7">
                  <Link to="/accounts/settings" className="list_item_a">
                    <RiSettings5Line /> <span>Settings</span>
                  </Link>
                </ContextAwareToggle>
              </li>
            </Accordion>

            {/* <li className={`vertical-item level1`}>
                <a
                  href={process.env.REACT_APP_CHAKRA_URL}
                  target="_self"
                  className="list_item_a"
                >
                  <FiGrid /> <span>Drops</span>
                </a>
              </li> */}
            {/* <li
                className={`vertical-item level1 ${
                  currentPage === "support" ? "list-active" : ""
                }`}
              >
                <Link to="/accounts/support" className="list_item_a">
                  <FaQuestionCircle /> <span>Support</span>
                </Link>
              </li> */}
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
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default SideNav;
