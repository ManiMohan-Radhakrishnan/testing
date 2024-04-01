import React from "react";
import cardImage from "../../images/playnft-card.png";
import "./style.scss";

const PlayNftCard = () => {
  return (
    <>
      <div className="mynftplaynft-card-box playnft-card-nft expire-card-nft mb-3">
        <div className="block-box-playnft user-post jt-card-playnft">
          <div className="playnft-post playnft-img-card-border">
            <img alt="Card" className="img-card" src={cardImage} width="100%" />
          </div>
          <div className="playnft-content">
            <div className="user-title-playnft">
              <div className="main-card-title">Daily Pack #2</div>
              <div className="card-title-div-playnft">Packages Expires in</div>
              <div className="card-quantity-playnft">23H 54M</div>
            </div>
          </div>
          <div className="view-all-card-button-playnft">
            <div className="skew-box-wrapper-playnft available-card-playnft">
              <div className="wrap-playnft">
                <button className="upgrade-btn-playnft buy-to-upgradde-playnft mt-3 mb-3">
                  <span>View NFTs</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayNftCard;
