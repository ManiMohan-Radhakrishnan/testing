import React, { useEffect, useState } from "react";
import { ButtonGroup, Modal, Toast, ToggleButton } from "react-bootstrap";
import InputText from "../input-text";
import LimitOrderCard from "../limit-order";
import { VscCheck } from "react-icons/vsc";
import { BsPlusCircle } from "react-icons/bs";
import {
  createLimitOrderApi,
  getLimitOrdersApi,
} from "../../api/methods-marketplace";
import rules from "../../utils/rules.json";
import Category from "../limit-order/category";
import Hand from "../limit-order/hand";
import BowlingStyle from "../limit-order/bowling-style";
import SignedBy from "../limit-order/signed-by";
// import Gender from "../limit-order/gender";
import { toast } from "react-toastify";
import notFound from "../../images/nonftfound.svg";
const initialLimit = {
  name: "",
  // quantity: 1,
  price_from: "",
  price_to: "",
  resale: false,
  resale_for: "",
  resale_after: "",
  role: 0,
  role_type: "bowler",
  category: [],
  bat_category: [],
  dominant_hand: [],
  bowling_style: [],
  // gender: [],
  signed_by: [],
  level_from: 1,
  level_to: 15,
};
const initialLimitValidation = {
  name: true,
  // quantity: true,
  price_from: true,
  price_to: true,
  resale: false,
  resale_for: false,
  resale_after: false,
  role: true,
  level_from: false,
  level_to: false,
};
const initialLimitErrors = {
  name: "",
  price_from: "",
  price_to: "",
  level_to: "",
};

const skipSignedBy = ["unique", "premium", "superior", "standard"];
const floorPrice = 1;

const LimitOrders = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("step1");
  const [limitOrders, setLimitOrders] = useState([]);
  const [limit, setLimit] = useState(initialLimit);
  const [limitValidation, setLimitValidation] = useState(
    initialLimitValidation
  );
  const [limitErrors, setLimitError] = useState(initialLimitErrors);

  useEffect(() => {
    getLimitOrders();
  }, []);

  const handleLimitChangeEvent = (e) => {
    if (e.target.value) {
      if (e.target.name === "level_from" || e.target.name === "level_to") {
        if (e.target.value.toString().substring(0, 1) !== "0")
          checkLevelValidation(e.target.name, e.target.value);
      } else if (e.target.value.toString().substring(0, 1) !== "0") {
        setLimit({ ...limit, [e.target.name]: e.target.value });
        if (checkValidation(e.target.value, e.target.name))
          setLimitValidation({ ...limitValidation, [e.target.name]: false });
        else setLimitValidation({ ...limitValidation, [e.target.name]: true });
      }
    } else {
      setLimit({ ...limit, [e.target.name]: e.target.value });
      setLimitError({ ...limitErrors, [e.target.name]: "" });
      setLimitValidation({ ...limitValidation, [e.target.name]: true });
    }
  };
  const checkLevelValidation = (type, value) => {
    if (parseInt(value) <= 15) {
      setLimit({ ...limit, [type]: value });
      if (type === "level_from" && limit?.level_to)
        setLimit({ ...limit, [type]: value, level_to: "" });
      if (type === "level_to" && parseInt(value) < parseInt(limit.level_from)) {
        setLimitError({
          ...limitErrors,
          level_to: `"To" value should be greater than or equal to "From" value.`,
        });
      } else setLimitError({ ...limitErrors, level_to: "" });
    }
  };
  const checkValidation = (value, type) => {
    if (type === "price_from") {
      if (limit?.price_to || limitErrors?.price_to) {
        setLimit({ ...limit, price_from: value, price_to: "" });
      }
      if (value.length > 8) {
        setLimit({ ...limit, price_from: "" });
        return false;
      }
      if (parseInt(value) < floorPrice) {
        setLimitError({
          ...limitErrors,
          price_to: "",
          price_from: `Minimum price value should be $${floorPrice}`,
        });
        return false;
      } else if (parseInt(value) >= floorPrice) {
        setLimitError({ ...limitErrors, price_from: "" });
        return true;
      }
    }
    if (type === "price_to") {
      if (value.length > 8) {
        setLimit({ ...limit, price_to: "" });
        return false;
      }
      if (
        parseInt(value) < floorPrice ||
        parseInt(value) < parseInt(limit.price_from)
      ) {
        setLimitError({
          ...limitErrors,
          price_to: `"To" value should be greater than or equal to "From" value.`,
        });
        return false;
      } else {
        setLimitError({ ...limitErrors, price_to: "" });
        return true;
      }
    }
    if (type === "name") {
      if (value.length < 50) {
        if (limitErrors.name) {
          setLimitError({ ...limitErrors, name: "" });
        }
        return true;
      } else {
        setLimitError({
          ...limitErrors,
          name: "Rule Name should be within 50 characters.",
        });
        return false;
      }
    } else return true;
  };

  const getLimitOrders = async () => {
    try {
      setLoading(true);
      const result = await getLimitOrdersApi();
      setLimitOrders(result?.data?.data?.limit_orders);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleLimitCreate = async () => {
    try {
      setLoading(true);
      let input = {
        name: limit?.name,
        // total_quantity: limit?.quantity,
        price_from: limit?.price_from,
        price_till: limit?.price_to,
        limit_order_stat_attributes: {
          role: limit?.role,
          level_from: limit?.level_from,
          level_till: limit?.level_to,
        },
        options: {
          category: limit?.category,
          dominant_hand: limit?.dominant_hand,
          bowling_style: limit?.bowling_style,
          signed_by:
            skipSignedBy.filter(
              (obj) => limit?.bat_category?.indexOf(obj) !== -1
            )?.length === 0
              ? limit?.signed_by
              : [],
        },
      };
      const result = await createLimitOrderApi(input);
      if (result?.status === 200) {
        closeModal();
        toast.success("Limit order created successfully");
        getLimitOrders();
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const handleNext = () => {
    if (step === "step1") {
      // if (checkValidationPrice())
      setStep("step2");
    } else if (step === "step2") {
      // if (levelValidation())
      handleLimitCreate();
    }
  };
  const closeModal = () => {
    setShowAdd(false);
    setLimit(initialLimit);
    setStep("step1");
    setLimitError(initialLimitErrors);
    setLimitValidation(initialLimitValidation);
  };

  return (
    <>
      <div className="main-content-block limit-order-block">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="wallet-user mt-3">
                <div className="row align-items-center">
                  <div className="col-lg-12">
                    <div className="about-heading">
                      <h3 className="about-title">Limit Orders</h3>
                      {limitOrders?.length > 0 && limitOrders?.length < 10 && (
                        <button
                          className="btn create-btn"
                          onClick={() => setShowAdd(true)}
                        >
                          <BsPlusCircle /> Create new
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="limitorders-block">
                {limitOrders.length > 0 ? (
                  <>
                    {limitOrders.map((order, i) => (
                      <LimitOrderCard
                        key={`limit-${i}`}
                        order={order}
                        apiCallback={getLimitOrders}
                        status={order?.status}
                      />
                    ))}
                  </>
                ) : (
                  <>
                    <article className="nonft_found">
                      <div className="nodata-card nolimit-order-card">
                        <div className="nolimit-order-card-content">
                          <img src={notFound} height="90" alt="" />
                          <h4>No limit order found.</h4>
                          <p>
                            The Limit Order feature helps you get notified if a
                            certain NFT matches your requirement. You can
                            configure your choices using the Limit Order tool,
                            so you won't miss any NFTs you need!
                          </p>

                          <button
                            className="btn create-btn"
                            onClick={() => setShowAdd(true)}
                          >
                            <BsPlusCircle /> Create new
                          </button>
                        </div>
                      </div>
                    </article>
                  </>
                )}
              </div>
            </div>

            <Modal
              show={showAdd}
              size="lg"
              onHide={closeModal}
              backdrop={"static"}
              className="create-steps"
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  {step === "step1" && (
                    <span className="title">
                      <span>Basics - Create</span>
                      <ul className="placement-list">
                        <li className="active">1</li>
                        <li className="disabled">2</li>
                      </ul>
                    </span>
                  )}
                  {step === "step2" && (
                    <span className="title">
                      <span>Limits - Create</span>
                      <ul className="placement-list">
                        <li className="checked">
                          <VscCheck />
                        </li>
                        <li className="active">2</li>
                      </ul>
                    </span>
                  )}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="card-modal edit-limitorder-pop">
                {/* edit-profile-pop */}

                {step === "step1" && (
                  <>
                    <article className="limit-step-1">
                      <div className="row">
                        <div className="col-12">
                          <InputText
                            title={"RULE NAME *"}
                            placeholder={`e.g., Right Hand Rookie Batsman`}
                            name="name"
                            lengthValue={50}
                            value={limit.name}
                            boxRequired={limitErrors.name}
                            onChange={handleLimitChangeEvent}
                          />
                          <span className="hint-txt">(Limit order name*)</span>
                        </div>
                      </div>
                      <div className="row">
                        {/* <div className="col-12 col-sm-3">
                          <InputText
                            type="number"
                            title={"QUANTITY *"}
                            name="quantity"
                            value={limit.quantity}
                            onChange={handleLimitChangeEvent}
                          />
                        </div> */}
                        <div className="col-12 col-sm-9">
                          <label className="input-title">PRICE *</label>
                          <div className="flex-inputs">
                            <InputText
                              type="number"
                              name="price_from"
                              restrictChar={true}
                              scrollIncrese={true}
                              boxRequired={limitErrors.price_from}
                              value={limit.price_from}
                              onChange={handleLimitChangeEvent}
                            />
                            <span>To</span>
                            <InputText
                              type="number"
                              name="price_to"
                              restrictChar={true}
                              scrollIncrese={true}
                              boxRequired={limitErrors.price_to}
                              value={limit.price_to}
                              onChange={handleLimitChangeEvent}
                            />
                            <span>USD</span>
                          </div>
                        </div>
                      </div>
                      {/* <div className="col-12 resale-label">
                        <label for="resale" className="input-title">
                          RESALE
                        </label>
                        <input
                          type="checkbox"
                          name="resale"
                          checked={limit.resale}
                          onChange={() =>
                            setLimit({
                              ...limit,
                              resale: !limit.resale,
                            })
                          }
                        />
                      </div> */}
                      {limit.resale && (
                        <>
                          <div className="col-12">
                            <div className="flex-inputs min-inputs">
                              <InputText
                                type="number"
                                title={"RESALE %"}
                                name="resale_for"
                                value={limit.resale_for}
                                onChange={handleLimitChangeEvent}
                              />
                              <span>Percentage</span>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="flex-inputs min-inputs">
                              <InputText
                                type="number"
                                title={"RESALE AFTER"}
                                name="resale_after"
                                value={limit.resale_after}
                                onChange={handleLimitChangeEvent}
                              />
                              <span>Hours</span>
                            </div>
                          </div>
                        </>
                      )}
                    </article>
                  </>
                )}
                {step === "step2" && (
                  <article className="limit-step-2">
                    <div className="row">
                      <div className="col-12">
                        <label className="input-title">ROLE *</label>
                        <ButtonGroup className="d-block mb-3 mt-1 button-round-box radio-round-box">
                          {rules.role.map((role, idx) => (
                            <ToggleButton
                              key={idx}
                              id={`role-${idx}`}
                              type="radio"
                              variant="outline-dark"
                              name="role"
                              value={role.value}
                              checked={limit.role == role.value}
                              onChange={(e) => {
                                if (idx === 2) {
                                  setLimit({
                                    ...limit,
                                    role: parseInt(e.currentTarget.value),
                                    role_type: role.key,
                                    category: [],
                                    bat_category: [],
                                    dominant_hand: [],
                                    bowling_style: [],
                                    signed_by: [],
                                    gender: [],
                                    level_from: "",
                                    level_to: "",
                                  });
                                } else {
                                  setLimit({
                                    ...limit,
                                    role: parseInt(e.currentTarget.value),
                                    role_type: role.key,
                                    category: [],
                                    bat_category: [],
                                    dominant_hand: [],
                                    bowling_style: [],
                                    signed_by: [],
                                    gender: [],
                                    level_from: 1,
                                    level_to: 15,
                                  });
                                }
                              }}
                            >
                              {role.name}
                            </ToggleButton>
                          ))}
                        </ButtonGroup>
                      </div>
                      {limit?.role_type && (
                        <div className="col-12">
                          <Category
                            categories={
                              rules[`${limit.role_type}`]?.category || []
                            }
                            limit={limit}
                            setLimit={setLimit}
                          />
                        </div>
                      )}

                      {limit?.role_type && limit?.role_type !== "bat" && (
                        <div className="col-12">
                          <Hand
                            hand={rules[`${limit.role_type}`]?.hand || []}
                            limit={limit}
                            setLimit={setLimit}
                          />
                        </div>
                      )}

                      {limit?.role_type && limit?.role_type === "bowler" && (
                        <div className="col-12">
                          <BowlingStyle
                            bowlingStyle={rules[`${limit.role_type}`]?.style}
                            limit={limit}
                            setLimit={setLimit}
                          />
                        </div>
                      )}

                      {/* {limit?.role_type && limit?.role_type !== "bat" && (
                      <div className="col-12">
                        <Gender
                          genders={rules[`${limit.role_type}`]?.gender}
                          limit={limit}
                          setLimit={setLimit}
                        />
                      </div>
                    )} */}

                      {limit?.role_type &&
                        limit?.role_type === "bat" &&
                        skipSignedBy.filter(
                          (obj) => limit?.bat_category?.indexOf(obj) !== -1
                        )?.length === 0 && (
                          <div className="col-12">
                            <SignedBy
                              signedByOptions={
                                rules[`${limit.role_type}`]?.signed_by
                              }
                              limit={limit}
                              setLimit={setLimit}
                            />
                          </div>
                        )}

                      {limit?.role_type && limit?.role_type !== "bat" && (
                        <div className="col-12">
                          <label className="input-title">LEVEL</label>
                          <span> (Min: 1 and Max: 15)</span>
                          <div className="flex-inputs level-inputs">
                            <InputText
                              type="number"
                              name="level_from"
                              restrictChar={true}
                              scrollIncrese={true}
                              value={limit.level_from}
                              onChange={handleLimitChangeEvent}
                            />
                            <span>To</span>
                            <InputText
                              type="number"
                              name="level_to"
                              restrictChar={true}
                              scrollIncrese={true}
                              boxRequired={limitErrors.level_to}
                              value={limit.level_to}
                              onChange={handleLimitChangeEvent}
                            />
                            <span>Levels</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                )}

                <div className="row">
                  <div className="col-md-12">
                    {limitErrors && (
                      <>
                        <div className="err-msg-list">
                          {limitErrors.name && (
                            <div className="error-text">{limitErrors.name}</div>
                          )}
                          {limitErrors.price_from && (
                            <div className="error-text">
                              {limitErrors?.price_from}
                            </div>
                          )}
                          {limitErrors.price_to && (
                            <div className="error-text">
                              {limitErrors.price_to}
                            </div>
                          )}
                          {limitErrors.level_to && (
                            <div className="error-text">
                              {limitErrors?.level_to}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                    <div className="modal-footer-btn-grp">
                      {step === "step1" && (
                        <button
                          className="btn prev-btn btn-dark-secondary"
                          onClick={closeModal}
                          type="button"
                        >
                          Close
                        </button>
                      )}
                      {step === "step2" && (
                        <button
                          className="btn btn-dark-secondary prev-btn"
                          onClick={() => {
                            if (step === "step2") {
                              setStep("step1");
                            }
                          }}
                          type="button"
                        >
                          Previous
                        </button>
                      )}

                      <button
                        disabled={(() => {
                          if (loading) {
                            return true;
                          } else if (
                            step === "step1" &&
                            (!limit.name ||
                              limitValidation.price_from ||
                              limitValidation.price_to ||
                              limitValidation.name ||
                              !limit.price_from ||
                              !limit.price_to)
                          ) {
                            return true;
                          } else if (
                            step === "step2" &&
                            !limit.level_from &&
                            !limit.level_to
                          ) {
                            return false;
                          } else if (
                            step === "step2" &&
                            (limit.role === "" ||
                              !limit.level_from ||
                              !limit.level_to ||
                              limitErrors.level_to)
                          ) {
                            return true;
                          } else {
                            return false;
                          }
                        })()}
                        className="btn btn-dark  next-btn"
                        onClick={handleNext}
                        type="button"
                      >
                        {(() => {
                          if (step === "step1") {
                            return "Next";
                          } else if (step === "step2") {
                            return loading ? "Creating..." : "Done";
                          }
                        })()}
                      </button>
                    </div>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default LimitOrders;
