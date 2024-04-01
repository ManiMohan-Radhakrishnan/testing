import React, { useEffect, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import fusorImage from "../../../images/nft-card.png";
import "./style.scss";
import Stats from "../../my-nfts/stats";
import { batBurnApi } from "../../../api/methods-marketplace";
import { toast } from "react-toastify";
import {
  alphaNumeric,
  currencyFormat,
  dot,
  roundDown,
} from "../../../utils/common";
import { useDispatch, useSelector } from "react-redux";
import { FaCheckCircle } from "react-icons/fa";
import Select from "react-select";
import { whitelistCryptoPopUp } from "../../../redux/actions/user_action";
import { FiArrowRight } from "react-icons/fi";

const BurnNFTDetail = ({
  showEdit,
  burnBatDetails,
  setShowEdit,
  Reload = () => {},
  details,
  cryptoList,
  networkList,
  balanceInfo,
}) => {
  const feeCharges = balanceInfo?.crypto_fees;
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [payMethod, setPayMethod] = useState("crypto");
  const [networkOptions, setNetworkOptions] = useState([]);
  const [network, setNetwork] = useState(networkList[0]?.name || "binance");
  const [selectPaymentNetwork, setSelectPaymentNetwork] = useState();
  const [address, setAddress] = useState("");
  const [paymentSlug, setPaymentSlug] = useState("");
  const [selectFields, setSelectFields] = useState([]);
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state?.user?.data);

  const [fees, setFees] = useState({
    currency: "$",
    category: "",
    fee_type: "percent",
    fee_value: "0.0",
    min_amount: "0",
    max_amount: "0",
  });

  const handleBurnInitiate = async (slug) => {
    if (address) {
      setError("");
      try {
        let value = { address: address };
        setLoading(true);
        const result = await batBurnApi(slug, value);
        if (result.status === 200) {
          if (result?.data?.success) {
            toast.success(result?.data?.data?.response?.message);
            setShowEdit(false);
            Reload();
          }
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setShowEdit(false);

        toast.error(err.response?.data?.message);
      }
    } else {
      setError("Please enter the wallet address");
    }
  };

  const handleCheckboxChange = () => {
    setAccepted(!accepted);
  };
  useEffect(() => {
    checkNetworkData();
  }, [networkList]);

  const checkNetworkData = () => {
    let networks = new Array();

    for (let item of networkList) {
      networks.push({
        label: `${item?.display_name} -${currencyFormat(
          feeCharges?.find((obj) => obj?.network === item?.name)?.fee,
          user.currency_name
        )} Fee / Transaction`,
        value: item?.name,
      });
    }
    setNetwork(networks?.length > 0 ? networks[0]?.value : []);
    setNetworkOptions(networks);
  };

  const crispStyle = {
    control: (prop) => ({
      ...prop,
      padding: ".8rem 0.8rem",
      borderRadius: "0.7rem",
      minHeight: "33px",
      fontSize: "1rem",
      fontWeight: "bolder",
      borderColor: "#000",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#000",
      },
      "&:focus": {
        boxShadow: "none",
        borderColor: "#000",
      },
      "&:active": {
        boxShadow: "none",
        borderColor: "#000",
      },
    }),
    input: (prop) => ({
      ...prop,
      margin: 0,
      padding: 0,
    }),
    valueContainer: (prop) => ({
      ...prop,
      margin: 0,
      padding: 0,
    }),
    singleValue: (styles, { data }) => ({
      ...styles,
      margin: 0,
      padding: 0,
      ...(data.color ? dot(data.color) : {}),
    }),

    dropdownIndicator: (prop) => ({
      ...prop,
      margin: 0,
      padding: "0 3px 0 0",
      color: "#000",
    }),
    indicatorsContainer: (prop) => ({
      ...prop,
      margin: 0,
      padding: 0,
    }),
    clearIndicator: (prop) => ({
      ...prop,
      margin: 0,
      padding: 0,
    }),
    indicatorSeparator: (prop) => ({
      ...prop,
      margin: "3px",
      padding: 0,
    }),
    noOptionsMessage: (prop) => ({
      ...prop,
      padding: 0,
      fontSize: "12px",
    }),
    option: (prop, { isSelected }) => ({
      ...prop,
      padding: "8px",
      fontSize: "1rem",
      backgroundColor: isSelected && "#000",
      fontFamily: "neue_helvetica_medium",
      "&:hover": {
        backgroundColor: !isSelected && "#ddd",
        color: !isSelected && "#000",
      },
      "&:active": {
        backgroundColor: "#ddd",
      },
    }),
    menu: (prop) => ({
      ...prop,
      borderRadius: "3px",
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999, top: base.top - 5 }),
  };

  useEffect(() => {
    if (user?.whitelist_withdrawal) {
      if (cryptoList?.[network]?.length > 0) {
        let pushItems = [];
        setSelectPaymentNetwork(cryptoList?.[network]);
        setAddress(cryptoList?.[network][0]?.payment_id);
        setPaymentSlug(cryptoList?.[network][0]?.slug);
        cryptoList?.[network].map((item) => {
          let modifyData = {
            ...item,
            label:
              item?.detail?.name +
              " - " +
              item?.payment_id?.toString()?.substring(0, 5) +
              "....." +
              item?.payment_id
                ?.toString()
                .substring(
                  item?.payment_id?.length - 5,
                  item?.payment_id?.length
                ),
            value: item?.payment_id,
            slug: item?.slug,
          };
          pushItems.push(modifyData);
        });
        setSelectFields(pushItems);
      } else {
        setSelectPaymentNetwork([]);
      }
    }
  }, [network]);

  return (
    <Offcanvas
      show={showEdit}
      onHide={() => {
        setShowEdit(!showEdit);
      }}
      placement="end"
      className="popup-wrapper-canvas-burnBatNftHistory"
      backdrop={"true"}
    >
      <Offcanvas.Body className="p-0 pop-body-container-burnBatNftHistory">
        <>
          <div className="pop-nft-details-burnBatNftHistory">
            <div className="pop-head-content-burnBatNftHistory">
              <div className="pop-bid-title-burnBatNftHistory">
                Crypto Bat Burn Confirmation
              </div>
              <div
                className="close-button-pop-burnBatNftHistory"
                onClick={() => {
                  setShowEdit(!showEdit);
                }}
              >
                <img
                  alt="close"
                  src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e"
                ></img>
              </div>
            </div>

            <div className="pop-body-content-burnBatNftHistory burnBat-popup-wrapper p-3">
              <div className="confirmation_popup">
                <div className="burn-nft-card">
                  <div className="img-block">
                    <img
                      src={burnBatDetails?.asset_url}
                      className="img-fluid"
                      alt="image"
                    />
                  </div>
                  <div className="content-block">
                    <h6 className="nft-name">{burnBatDetails?.name}</h6>
                    <Stats statistics={burnBatDetails?.core_statistics} />
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-8 offset-sm-2 col-12">
                    <div className="mt-3 mb-3">
                      <div className="d-flex justify-content-between ac-cc-title">
                        Your Withdrawal Method
                      </div>
                      <div className="d-flex mt-2 mb-4">
                        {/* <div
                          className={`w-mode ${
                            payMethod === "wallet" ? "active" : ""
                          }`}
                          role={"button"}
                          onClick={() => {
                            setPayMethod("wallet");
                          }}
                        >
                          <div className="title">Wallet</div>
                          <div>
                            <FaCheckCircle
                              color={payMethod === "wallet" ? "#fff" : "#ccc"}
                              className="mb-1 me-2"
                              size={17}
                            />
                          </div>
                        </div> */}
                        <div
                          className={
                            "w-mode"
                            // ${
                            // payMethod === "crypto" ? "active" : ""
                            // }
                          }
                          role={"button"}
                          // onClick={() => {
                          //   setPayMethod("crypto");
                          // }}
                        >
                          <div className="title">Crypto</div>
                          {/* <div>
                            <FaCheckCircle
                              color={payMethod === "crypto" ? "#fff" : "#ccc"}
                              className="mb-1 me-2"
                              size={17}
                            />
                          </div> */}
                        </div>
                      </div>
                      {payMethod === "crypto" && (
                        <>
                          {/* <div>
                            <div className="d-flex justify-content-between ac-cc-title">
                              Network
                            </div>
                            <Select
                              options={networkOptions}
                              value={networkOptions.find(
                                (o) => o?.value === network
                              )}
                              styles={crispStyle}
                              onChange={(data) => {
                                setAddress("");
                                setNetwork(data.value);
                                // calcCharges(amount, data.value);
                              }}
                            />
                          </div> */}

                          <div className="mt-3 mb-3">
                            <div className="d-flex justify-content-between ac-cc-title">
                              Withdrawal Address
                            </div>
                            <input
                              type="text"
                              value={address}
                              className="wallet-address"
                              placeholder="0xc896..."
                              maxLength={42}
                              onChange={(e) => {
                                if (e) {
                                  alphaNumeric(e.target.value) &&
                                    setAddress(e.target.value);
                                  setError("");
                                }
                              }}
                            />
                            {/* {(() => {
                              if (user?.whitelist_withdrawal) {
                                if (selectPaymentNetwork?.length > 0)
                                  return (
                                    <Select
                                      options={selectFields}
                                      value={selectFields.find(
                                        (o) => o.value === address
                                      )}
                                      styles={crispStyle}
                                      onChange={(data) => {
                                        setAddress(data?.value);
                                        setPaymentSlug(data?.slug);
                                      }}
                                    />
                                  );
                                else {
                                  return (
                                    <>
                                      <div className={"pre-btn"}>
                                        <p
                                          className="bank-details-input wait-msg d-flex align-items-center justify-content-between"
                                          onClick={() => {
                                            dispatch(
                                              whitelistCryptoPopUp(network)
                                            );
                                            // history.push("/accounts/whitelist");
                                          }}
                                        >
                                          Please Whitelist your Wallet Address{" "}
                                          <FiArrowRight size={25} />
                                        </p>
                                      </div>
                                    </>
                                  );
                                }
                              } else {
                                return (
                                  <input
                                    type="text"
                                    value={address}
                                    className="wallet-address"
                                    placeholder="0xc896..."
                                    maxLength={42}
                                    onChange={(e) => {
                                      alphaNumeric(e.target.value) &&
                                        setAddress(e.target.value);
                                    }}
                                  />
                                );
                              }
                            })()} */}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <h5 className="burn-hint">
                  <p>
                    Please carefully consider the following points before
                    proceeding further:
                  </p>
                  <ul>
                    {details && (
                      <li>
                        <b>Current Asset Value : {details?.asset_quantity}</b>
                        {"    "}
                        {/* <b>
                          {details?.asset_value === "-"
                            ? "-"
                            : "~" +
                              " " +
                              currencyFormat(details?.asset_value, "USD")}
                        </b> */}
                      </li>
                    )}
                    <li>
                      <b>Irreversible Action:</b> Burning your NFT is a
                      permanent action that will remove it from circulation.
                      Once burned, the NFT cannot be recovered, transferred, or
                      traded again.
                    </li>
                    <li>
                      <b>Loss of Ownership:</b> By burning your NFT, you will
                      relinquish all ownership rights associated with it,
                      including any potential future benefits or rewards.
                    </li>
                    <li>
                      <b>No Refunds:</b> There is no way to reverse the burning
                      process, and we cannot offer refunds or replacements for
                      burned NFTs. Please make sure you are certain about your
                      decision before proceeding.
                    </li>
                    {/* <li>
                      <b>Cancel Burn:</b> You can cancel your registration for
                      the burn event only till the registration window is open.
                    </li> */}
                    <li>
                      <b>Can't list for Sale:</b> Once you register your NFT for
                      burn event, you cannot list it for sale. If listed already
                      for sale, you cannot register that NFT for burn. You can
                      still list your NFT for rent even for registering it for
                      burn.
                    </li>
                    <li>
                      <b>Asset Transfer:</b> After burning the specified NFT,
                      the associated wrapped crypto asset will be transferred to
                      the submitted address.
                      <b> 1% TDS will be applicable to Indian users.</b>
                    </li>
                    {/* <li>
                      <b>USD Credit:</b> The USD credit for the NFT burned will
                      be based on the exchange rate during burn event. The date
                      and time of the burn event will be announced separately.
                    </li> */}
                  </ul>
                  <p>
                    <input
                      type="checkbox"
                      checked={accepted}
                      onChange={handleCheckboxChange}
                    />{" "}
                    By clicking on <b>"Submit"</b>, you acknowledge that you
                    have read and understood the information provided above. If
                    you have any doubts or questions, we strongly recommend
                    reaching out to our support team before making your final
                    decision.
                  </p>
                </h5>
              </div>
            </div>
          </div>
          <div className="sticky-bottom-box">
            {error && <p className="error-txt">{error}</p>}
            <div className="w-100">
              <button
                disabled={loading || !accepted}
                onClick={() => handleBurnInitiate(burnBatDetails?.slug)}
                className="btn btn-dark w-100"
                type="button"
              >
                Submit
              </button>
            </div>
          </div>
        </>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default BurnNFTDetail;
