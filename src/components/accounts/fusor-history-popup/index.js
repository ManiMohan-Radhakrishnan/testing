import React from "react";
import { Offcanvas } from "react-bootstrap";
import fusorImage from "../../../images/nft-card.png";
import "./style.scss";
const FusorHistoryPopup = ({
  setFusorNftHistoryPopup,
  fusorNftHistoryPopup,
  detailsFusor = {},
}) => {
  let { fused_nfts, fusor_nfts } = detailsFusor;
  return (
    <>
      <Offcanvas
        show={fusorNftHistoryPopup}
        onHide={() => {
          setFusorNftHistoryPopup(!fusorNftHistoryPopup);
        }}
        placement="end"
        className="popup-wrapper-canvas-fusorNftHistory"
        backdrop={"true"}
      >
        <Offcanvas.Body className="p-0 pop-body-container-fusorNftHistory">
          <>
            <div className="pop-nft-details-fusorNftHistory">
              <div className="pop-head-content-fusorNftHistory">
                <div className="pop-bid-title-fusorNftHistory">
                  Fusion Details
                </div>
                <div
                  className="close-button-pop-fusorNftHistory"
                  onClick={() => {
                    setFusorNftHistoryPopup(!fusorNftHistoryPopup);
                  }}
                >
                  <img
                    alt="close"
                    src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e"
                  ></img>
                </div>
              </div>

              {/* <div className={`pop-bid-progress-fusorNftHistory p-3`}></div> */}

              <div className="pop-body-content-fusorNftHistory fuser-popup-wrapper p-3">
                <div className="confirmation_popup">
                  <h4 className="sub-heading">
                    <b>Fused NFTs</b>
                  </h4>
                  <ul className="fusor-listed-nfts">
                    {fused_nfts?.map((items, index) => (
                      <li>
                        <div className="card">
                          <div className="card-img">
                            <img
                              src={items?.cover_url || fusorImage}
                              className="img-fluid"
                              alt="image"
                            />
                          </div>
                          <div className="card-content">
                            <h6 className="nft-name">{items?.name}</h6>

                            {/* <span>
                              {" "}
                              LEVEL {15} | {"Rookie"} | {"Batsman"}
                            </span> */}
                          </div>
                        </div>
                      </li>
                    ))}
                    {/* <li>
                      <div className="card">
                        <div className="card-img">
                          <img
                            src={fusorImage}
                            className="img-fluid"
                            alt="image"
                          />
                        </div>
                        <div className="card-content">
                          <h6 className="nft-name">Meta Alien Leg Glance</h6>

                          <span>
                            {" "}
                            LEVEL {15} | {"Rookie"} | {"Batsman"}
                          </span>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="card">
                        <div className="card-img">
                          <img
                            src={fusorImage}
                            className="img-fluid"
                            alt="image"
                          />
                        </div>
                        <div className="card-content">
                          <h6 className="nft-name">Meta Alien Leg Glance</h6>

                          <span>
                            {" "}
                            LEVEL {15} | {"Rookie"} | {"Batsman"}
                          </span>
                        </div>
                      </div>
                    </li> */}
                  </ul>
                  <hr />
                  <h4 className="sub-heading">
                    <b>Newly Minted NFTs</b>
                  </h4>
                  <ul className="fusor-listed-nfts">
                    {fusor_nfts?.map((items, index) => (
                      <li>
                        <div className="card">
                          <div className="card-img">
                            <img
                              src={items?.cover_url || fusorImage}
                              className="img-fluid"
                              alt="image"
                            />
                          </div>
                          <div className="card-content">
                            <h6 className="nft-name">{items?.name} </h6>

                            {/* <span>
                              {" "}
                              LEVEL {15} | {"Rookie"} | {"Batsman"}
                            </span> */}
                          </div>
                        </div>
                      </li>
                    ))}
                    {/* <li>
                      <div className="card">
                        <div className="card-img">
                          <img
                            src={fusorImage}
                            className="img-fluid"
                            alt="image"
                          />
                        </div>
                        <div className="card-content">
                          <h6 className="nft-name">Meta Alien Leg Glance</h6>

                          <span>
                            {" "}
                            LEVEL {15} | {"Rookie"} | {"Batsman"}
                          </span>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="card">
                        <div className="card-img">
                          <img
                            src={fusorImage}
                            className="img-fluid"
                            alt="image"
                          />
                        </div>
                        <div className="card-content">
                          <h6 className="nft-name">Meta Alien Leg Glance</h6>

                          <span>
                            {" "}
                            LEVEL {15} | {"Rookie"} | {"Batsman"}
                          </span>
                        </div>
                      </div>
                    </li>} */}
                  </ul>
                </div>
              </div>
              {/* {loadFuse ? (
                  <>
                    <div class="loading-wrapper">
                      <button>
                        Loading ...
                        <svg>
                          <rect x="1" y="1"></rect>
                        </svg>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="pop-body-content-fusorNftHistory fuser-popup-wrapper p-3">
                      <div className="confirmation_popup">
                        <ul className="fusor-listed-nfts">
                          <li>
                            <div className="card">
                              <img
                                src={selectedItems[0]?.asset_url || image}
                                className="img-fluid"
                                alt="image"
                              />
                              <h6 className="nft-name">
                                {selectedItems[0]?.name}
                              </h6>
  
                              {selectedItems.length > 0 && (
                                <span>
                                  {" "}
                                  LEVEL{" "}
                                  {
                                    selectedItems[0]?.core_statistics?.level
                                      ?.value
                                  }{" "}
                                  |{" "}
                                  {
                                    selectedItems[0]?.core_statistics?.category
                                      ?.value
                                  }{" "}
                                  |{" "}
                                  {selectedItems[0]?.core_statistics?.role?.value}
                                </span>
                              )}
                            </div>
                          </li>
                          <li>
                            <div className="card">
                              <img
                                src={selectedItems[1]?.asset_url || image}
                                className="img-fluid"
                                alt="image"
                              />
                              <h6 className="nft-name">
                                {selectedItems[1]?.name}
                              </h6>
                              {selectedItems.length > 1 && (
                                <span>
                                  {" "}
                                  LEVEL{" "}
                                  {
                                    selectedItems[1]?.core_statistics?.level
                                      ?.value
                                  }{" "}
                                  |{" "}
                                  {
                                    selectedItems[1]?.core_statistics?.category
                                      ?.value
                                  }{" "}
                                  |{" "}
                                  {selectedItems[1]?.core_statistics?.role?.value}
                                </span>
                              )}
                            </div>
                          </li>
                          <li>
                            <div className="card">
                              <img
                                src={fusorDetails?.asset_url || image}
                                className="img-fluid"
                                alt="image"
                              />
                              <h6 className="nft-name">
                                {fusorDetails?.core_statistics?.role?.value}{" "}
                              </h6>
                              <span className="stats-box">
                                {fusorDetails?.core_statistics?.category?.value} |{" "}
                                {fusorDetails?.name}
                              </span>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </>
                )} */}
            </div>
            <div className="sticky-bottom-box">
              <div className="w-100">
                <button
                  onClick={() => {
                    setFusorNftHistoryPopup(false);
                  }}
                  className="btn btn-dark w-100"
                  type="button"
                >
                  Close
                </button>
              </div>
            </div>
          </>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default FusorHistoryPopup;
