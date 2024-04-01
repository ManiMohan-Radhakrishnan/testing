/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";

import { openWindow } from "./../../utils/common";

// import JumpTradeLogo from "../../images/jump-trade/jump-trade-logo.svg";
import JumpTradeLogo from "../../images/jump-trade/jump-trade.svg";
import "./style.scss";
import NFTCounter from "../nft-counter/index";
import { useDispatch } from "react-redux";
import { market_live_thunk } from "../../redux/thunk/user_thunk";

const Header2 = () => {
  const market_start_date = "Jan 22, 2022 15:00:00";

  const [market_time, set_market_time] = useState();

  const dispatch = useDispatch();

  const timeFunction = (check = false) => {
    var offset = new Date().getTimezoneOffset();

    var market_start_date_utc = new Date(market_start_date);
    market_start_date_utc.setMinutes(
      market_start_date_utc.getMinutes() - offset
    );

    var s_time = new Date();

    if (check) s_time.setSeconds(s_time.getSeconds() + 2);

    if (new Date(market_start_date_utc) < s_time) {
      // set_market_started(true);
      // setIsLive(true);
      dispatch(market_live_thunk());
    } else {
      set_market_time(market_start_date_utc);
    }
  };

  useEffect(() => {
    timeFunction(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheck = () => {
    timeFunction(true);
  };

  const DropToggle = React.forwardRef(({ onClick }, ref) => {
    return (
      <a
        ref={ref}
        className="drop_login"
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
        href="#"
      >
        Drops
      </a>
    );
  });

  return (
    <div className="bl_header">
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="flex-nav">
              <div className="bl_logo pt-2 pb-2">
                {/* BeyondLife.club{" "}
                <span
                  role="button"
                  className="header-powereby"
                  onClick={() => openWindow(process.env.REACT_APP_GUARDIAN_URL)}
                >
                  Powered by GuardianLink
                </span> */}
                <img
                  className="brand-logo"
                  src={JumpTradeLogo}
                  onClick={() =>
                    window.open(process.env.REACT_APP_WEBSITE_URL, "_self")
                  }
                  role="button"
                />
                {/* <a
                  className="guardian-link-brand"
                  href="https://www.guardianlink.io/"
                  target="_blank"
                >
                  <span>|</span> A GuardianLink Brand
                </a> */}
              </div>

              <Dropdown autoClose={["inside", "outside"]}>
                <Dropdown.Toggle
                  align="start"
                  drop="start"
                  as={DropToggle}
                  onClick={() =>
                    window.open(
                      `${process.env.REACT_APP_WEBSITE_URL}`,
                      "_blank"
                    )
                  }
                ></Dropdown.Toggle>

                {/* <Dropdown.Menu align="end">
                  <Dropdown.Item
                    as="button"
                    onClick={() =>
                      window.open(
                        `${process.env.REACT_APP_CHAKRA_URL}`,
                        "_blank"
                      )
                    }
                  >
                    Chakra The Invincible NFTs
                  </Dropdown.Item>
                  <Dropdown.Item
                    as="button"
                    onClick={() =>
                      window.open(
                        `${process.env.REACT_APP_AMITABH_URL}`,
                        "_blank"
                      )
                    }
                  >
                    Amitabh NFTs
                  </Dropdown.Item>
                </Dropdown.Menu> */}
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header2;
