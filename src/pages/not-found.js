import React from "react";
import { Navbar } from "react-bootstrap";
import jumpTradeLogo from "./../images/jump-trade-logo.svg";
const NotFound = () => {
  return (
    <>
      <section className="notfound-section">
        <div className="container">
          <div
            className="row align-items-center justify-content-center"
            style={{
              minHeight: "calc(100vh - 10rem)",
            }}
          >
            <center>
              <Navbar.Brand
                onClick={() =>
                  window.open(process.env.REACT_APP_WEBSITE_URL, "_blank")
                }
                role="button"
                className="not-found "
              >
                <img
                  alt="JumpTrade-Logo"
                  src={jumpTradeLogo}
                  className="logo-img"
                />
              </Navbar.Brand>
              <div className="notfound-text-block">
                <h1>404</h1>
                <h4>This page doesn't exist.</h4>
                <h5>
                  Go to Marketplace{" "}
                  <a
                    href={process.env.REACT_APP_MARKETPLACE_URL}
                    target="_blank"
                  >
                    Home
                  </a>{" "}
                  Page
                </h5>
              </div>
            </center>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
