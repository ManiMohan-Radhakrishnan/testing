import React, { useState, useRef, useEffect } from "react";
import { Modal } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import { BiLoaderAlt } from "react-icons/bi";
import { Button, Form } from "react-bootstrap";
import { HiOutlineArrowRight } from "react-icons/hi";
import {
  FaTelegramPlane,
  FaDiscord,
  FaInstagram,
  FaMediumM,
  FaFacebookF,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

import one from "../../images/drops/animation_box.gif";
import two from "../../images/drops/treasure_3.jpg";
import { currencyFormat, validateEmail } from "./../../utils/common";
import NFTCounter from "../nft-counter";

import tesla from "../../images/treasure/tesla.gif";
import btc from "../../images/treasure/btc.gif";
import eth from "../../images/treasure/eth.gif";
import sand from "../../images/treasure/sand.gif";
import shiba from "../../images/treasure/shiba.gif";
import mana from "../../images/treasure/mana.gif";
import inr from "../../images/treasure/mana.gif";

import "./style.scss";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { treasureClaim, treasureList } from "../../api/methods";

const MyTreasureBox = ({ started = true }) => {
  const r_email = useRef(null);
  const state = useSelector((state) => state);

  const { user } = state;
  const slug = user.data.user ? user.data.user.slug : null;
  // const { slug } = useParams();

  const [modal, setModal] = useState(false);
  const [email, setEmail] = useState();
  const [email2, setEmail2] = useState();
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [vEmail, setVEmail] = useState();
  const [vEmail2, setVEmail2] = useState();

  const [perkList, setPerkList] = useState([]);

  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    getTreasureList(slug);
  }, [slug]);

  const getTreasureList = async () => {
    try {
      setLoading3(true);
      const result = await treasureList("5Ew94W79IYgvxkDb");
      setLoading3(false);

      setPerkList(result.data.data.user_treasures);
    } catch (error) {
      setLoading3(false);
      console.log(
        "🚀 ~ file: index.js ~ line 43 ~ getTreasureList ~ error",
        error
      );
    }
  };

  const handleClaimTreasure = async (slug) => {
    try {
      const result = await treasureClaim(slug.slug, "5Ew94W79IYgvxkDb");
      getTreasureList();
      // toast.success("UnBoxed successfully");
    } catch (error) {
      console.log(
        "🚀 ~ file: index.js ~ line 130 ~ handleClaimTreasure ~ error",
        error
      );
    }
  };

  const getEndTime = (input_date) => {
    // var offset = new Date().getTimezoneOffset();
    var s_date = new Date(input_date);
    // s_date.setMinutes(s_date.getMinutes() - offset);

    return s_date;
  };

  const getNow = () => {
    var s_time = new Date();

    s_time.setSeconds(s_time.getSeconds() + 2);

    return s_time;
  };

  const getLogo = (name) => {
    switch (name) {
      case "TESLA SHARE":
        return tesla;
      case "ETH":
        return eth;
      case "BTC":
        return btc;
      case "SHIB":
        return shiba;
      case "MANA":
        return mana;
      case "SAND":
        return sand;
      case "INR":
        return inr;
      default:
        return shiba;
    }
  };

  return (
    <>
      <div className="main-content-block">
        <div className="new_drop_wrapper">
          <section className="loot_explanation">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12">
                  {/* <div className="page_title">
                    <h1>THE MEGA TREASURE BOX</h1>
                  </div> */}
                  <div className="win_box">
                    <h4>The treasure box has arrived</h4>
                    <h3>
                      The rewards you have been eagerly waiting for is now here!
                      The Treasure Box is your arena to unlock the "Mother of all
                      Goodness".
                    </h3>
                    <h5 className="mb-0">
                      Visit the Rewards section under{" "}
                      <Link
                        to="#"
                        onClick={() =>
                          window.open(
                            `${process.env.REACT_APP_ACCOUNTS_URL}/accounts/wallet`,
                            "_self"
                          )
                        }
                        target="_blank"
                        className="color"
                      >
                        My GuardianLink Wallet
                      </Link>{" "}
                      to redeem the coin rewards you unlock from the Treasure Box.
                    </h5>
                  </div>
                </div>
              </div>
              <div className="row d-flex justify-content-center">
                {loading3 ? (
                  <h5 className="text-center">Loading...</h5>
                ) : (
                  <>
                    {perkList.length > 0 &&
                      getEndTime(perkList[0].expire_at) > getNow() && (
                        <div style={{ display: "none" }}>
                          <NFTCounter
                            time={getEndTime(perkList[0].expire_at)}
                            handleEndEvent={() => setTrigger(!trigger)}
                            timeclassName="claim-end-time"
                            intervalclassName="claim-end-interval"
                          />
                        </div>
                      )}
                    {perkList.map((obj, i) => (
                      <div
                        key={`treasure${i}`}
                        className="col-md-3 gift_info_section"
                      >
                        {obj.claimed ? (
                          <>
                            {obj.assert_name ? (
                              <div className="gift_info">
                                {obj?.assert_type === "nft" ? (
                                  <>
                                    <img
                                      src={obj.nft_image}
                                      className="png-shadow"
                                    />
                                  </>
                                ) : (
                                  <>
                                    <img
                                      src={getLogo(obj.assert_name)}
                                      className="png-shadow"
                                    />
                                  </>
                                )}

                                {obj?.assert_type === "nft" ? (
                                  <>
                                    <h3>{`${obj.assert_name}`}</h3>
                                  </>
                                ) : (
                                  <>
                                    <h3>
                                      {`${obj.value}`}{" "}
                                      {obj.assert_name !== "BTC" ||
                                      obj.assert_name !== "ETH"
                                        ? `${obj.assert_name} ${
                                            parseInt(obj?.value) > 1
                                              ? "COINS"
                                              : "COIN"
                                          }`
                                        : obj.assert_name}
                                    </h3>
                                  </>
                                )}

                                {obj?.assert_type === "nft" && <h3>1 NFT</h3>}
                                {/* {obj.perk.name === "TESLA SHARE" ? (
                                  <>
                                    <h3>{obj.value}</h3> <h3>TESLA SHARE</h3>
                                  </>
                                ) : (
                                  <h3>{`${obj.value} ${obj.perk.name}`}</h3>
                                )} */}
                                {obj?.assert_type === "token" && (
                                  <p>{currencyFormat(obj.usd_value, "USD")}</p>
                                )}
                                {/* <p>{obj.perk.details}</p> */}

                                {/* {!obj.redeemed && (
                                  <div
                                    className="navigate-info"
                                    role="button"
                                    onClick={() =>
                                      window.open(
                                        `${process.env.REACT_APP_ACCOUNTS_URL}/accounts/wallet`,
                                        "_self"
                                      )
                                    }
                                  >
                                    Check your wallet for your updated Treasure
                                    Box balance
                                  </div>
                                )} */}
                              </div>
                            ) : (
                              <div className="gift_info">
                                <img src={two} />
                                <div className="navigate-info">
                                  Something Better Awaits... but not in here!
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="gift_info">
                            <img src={one} />
                            <p>
                              {getEndTime(obj.expire_at) > getNow() ? (
                                <>
                                  {getEndTime(obj.start_at) < getNow() ? (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => handleClaimTreasure(obj)}
                                      >
                                        <span>Open Now</span>
                                      </button>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                  {/* <button
                                    type="button"
                                    onClick={() =>
                                      handleClaimTreasure(obj)
                                    }
                                  >
                                    <span>Open Now</span>
                                  </button> */}

                                  <div className="claim-expiry">
                                    {getEndTime(obj.start_at) > getNow() ? (
                                      <>
                                        Opens in
                                        <NFTCounter
                                          time={getEndTime(obj.start_at)}
                                          handleEndEvent={() => getTreasureList()}
                                          timeclassName="claim-end-time"
                                          intervalclassName="claim-end-interval"
                                        />
                                      </>
                                    ) : (
                                      <>
                                        Claim within
                                        <NFTCounter
                                          time={getEndTime(obj.expire_at)}
                                          handleEndEvent={() => getTreasureList()}
                                          timeclassName="claim-end-time"
                                          intervalclassName="claim-end-interval"
                                        />
                                      </>
                                    )}
                                  </div>
                                </>
                              ) : (
                                <button type="button" disabled>
                                  Claim Expired
                                </button>
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}

                    {perkList.length === 0 && (
                      <>
                        <div className="empty-box-content">
                          Sorry, you did not receive a Treasure Box as you did not
                          acquire enough Super Loot during the drop. No
                          worries! The Treasure Box will be returning for our
                          future drops, stay tuned.
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      <Modal show={modal} centered>
        <Modal.Body>
          <p>Modal body text goes here.</p>

          <button type="button" onClick={() => setModal(false)}>
            close
          </button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MyTreasureBox;
