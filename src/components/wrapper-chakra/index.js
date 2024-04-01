import React from "react";

import { openWindowBlank } from "./../../utils/common";
import bgImg1 from "../../images/amitab_nft1.png";

import "./style.scss";

const WrapperChakra = ({ children }) => {
  return (
    <div className="bl_signup_wrapper">
      <div className="container-fluid position-relative">
        <div className="row align-items-center">
          <div className="col-md-6 d-flex align-items-center">{children}</div>
          <div className="col-md-6 text-center">
            <img
              className="bl_nft"
              src={bgImg1}
              role="button"
              onClick={() => openWindowBlank(process.env.REACT_APP_WEBSITE_URL)}
              alt="drops logo"
            />
          </div>
        </div>
      </div>
      <div className="container-fluid bl_copyright">
        <p className="d-hide">
          Grab the latest and trendy NFTs exclusively on{" "}
          <a href={process.env.REACT_APP_WEBSITE_URL} target="_self">
            Jump.trade
          </a>
        </p>
        <p className="mIntro">
          Jump.trade and Orange Comet's exclusive NFT collection
        </p>
      </div>
    </div>
  );
};

export default WrapperChakra;
