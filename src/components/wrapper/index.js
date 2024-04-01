import React from "react";

import "./style.scss";

const Wrapper = ({ children }) => {
  return (
    <div className="bl_signup_wrapper">
      <div className="container-fluid position-relative">
        <div className="row align-items-center">
          <div className="col-md-12">
            <div className="flex-block">
              {children}
              <div className="text-block">
                <h2>ONE ACCOUNT…</h2>
                <h3>MULTI-NFT METAVERSE ACCESS!</h3>
              </div>
            </div>
          </div>
          {/* <div className="col-md-6 text-center">
            <img
              className="bl_nft"
              src={bgImg}
              role="button"
              onClick={() => openWindowBlank(process.env.REACT_APP_WEBSITE_URL)}
              alt="drops logo"
            />
          </div> */}
        </div>
      </div>
      <div className="container-fluid bl_copyright">
        <p>
          Grab the latest and trendy NFTs exclusively on{" "}
          <a href={process.env.REACT_APP_WEBSITE_URL} target="_self">
            Jump.trade
          </a>
        </p>
      </div>
    </div>
  );
};

export default Wrapper;
