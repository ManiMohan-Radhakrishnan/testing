import React, { useEffect, useState } from "react";
import { ButtonGroup, Modal, ToggleButton } from "react-bootstrap";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { VscCheck } from "react-icons/vsc";
import { toast } from "react-toastify";
import {
  deleteLimitOrderApi,
  disableLimitOrderApi,
  enableLimitOrderApi,
  updateLimitOrderApi,
} from "../../api/methods-marketplace";
import { currencyFormat } from "../../utils/common";
import rules from "../../utils/rules.json";
import InputText from "../input-text";
import BowlingStyle from "./bowling-style";
import Category from "./category";
// import Gender from "./gender";
import Hand from "./hand";
import SignedBy from "./signed-by";
import "./style.scss";
import notFound from "../../images/nonftfound.svg";

const initialLimitErrors = {
  name: "",
  price_from: "",
  price_to: "",
  level_to: "",
};
const initialLimitValidation = {
  name: false,
  // quantity: true,
  price_from: false,
  price_to: false,
  resale: false,
  resale_for: false,
  resale_after: false,
  role: true,
  level_from: false,
  level_to: false,
};
const skipSignedBy = ["unique", "premium", "superior", "standard"];
const floorPrice = 1;

const LimitOrderCard = ({ order, status, apiCallback }) => {
  const role = order?.limit_order_stat?.role;
  const dominant_hand = order?.options?.find(
    (v) => v?.dominant_hand
  )?.dominant_hand;
  const level = order?.limit_order_stat;
  const category = order?.options?.find((v) => v?.category)?.category;
  const bat_category = [];
  const bat_ct = rules?.bat?.category?.filter(
    (v) =>
      order?.options?.find((v) => v?.category)?.category?.includes(v?.value) &&
      bat_category.push(v?.key)
  );

  const bowling_style = order?.options?.find(
    (v) => v?.bowling_style
  )?.bowling_style;
  const signed_by = order?.options?.find((v) => v?.signed_by)?.signed_by;

  const [showEdit, setShowEdit] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("step1");
  const [limit, setLimit] = useState({
    name: order?.name || "",
    // quantity: order?.total_quantity || "",
    price_from: parseInt(order?.price_from) || "",
    price_to: parseInt(order?.price_till) || "",
    resale: false,
    resale_for: "",
    resale_after: "",
    role: order?.limit_order_stat?.role || 0,
    role_type: rules.role.find((v) => v.value == role)?.key,
    category: order?.options?.find((v) => v?.category)?.category || [],
    bat_category: bat_category || [],
    dominant_hand:
      order?.options?.find((v) => v?.dominant_hand)?.dominant_hand || [],
    bowling_style:
      order?.options?.find((v) => v?.bowling_style)?.bowling_style || [],
    // gender: [],
    signed_by: order?.options?.find((v) => v?.signed_by)?.signed_by || [],
    level_from: order?.limit_order_stat?.level_from || "",
    level_to: order?.limit_order_stat?.level_till || "",
  });
  useEffect(() => {
    setLimit({
      name: order?.name || "",
      // quantity: order?.total_quantity || "",
      price_from: parseInt(order?.price_from) || "",
      price_to: parseInt(order?.price_till) || "",
      resale: false,
      resale_for: "",
      resale_after: "",
      role: order?.limit_order_stat?.role || 0,
      role_type: rules.role.find((v) => v.value == role)?.key,
      category: order?.options?.find((v) => v?.category)?.category || [],
      bat_category: bat_category || [],
      dominant_hand:
        order?.options?.find((v) => v?.dominant_hand)?.dominant_hand || [],
      bowling_style:
        order?.options?.find((v) => v?.bowling_style)?.bowling_style || [],
      // gender: [],
      signed_by: order?.options?.find((v) => v?.signed_by)?.signed_by || [],
      level_from: order?.limit_order_stat?.level_from || "",
      level_to: order?.limit_order_stat?.level_till || "",
    });
    setLimitError(initialLimitErrors);
    setLimitValidation(initialLimitValidation);
    setStep("step1");
  }, [showEdit]);

  const [limitValidation, setLimitValidation] = useState(
    initialLimitValidation
  );
  const [limitErrors, setLimitError] = useState(initialLimitErrors);

  const handleDelete = async () => {
    try {
      const result = await deleteLimitOrderApi(order?.slug);
      if (result?.status === 200) {
        toast.success("Limit order deleted successfully");
        setConfirm(false);
        apiCallback();
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  const handleLimitUpdate = async () => {
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
          slug: order?.limit_order_stat?.slug,
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
      const result = await updateLimitOrderApi(order?.slug, input);
      if (result?.status === 200) {
        setShowEdit(false);
        toast.success("Limit order updated successfully");
        apiCallback();
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleEnable = async () => {
    try {
      const result = await enableLimitOrderApi(order?.slug);
      if (result.status === 200) {
        toast.success("Limit order active");
        apiCallback();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDisable = async () => {
    try {
      const result = await disableLimitOrderApi(order?.slug);
      if (result.status === 200) {
        toast.success("Limit order inactive");
        apiCallback();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <article className="limit-order-item">
        <h5 className="title"># {order?.name}</h5>
        <div className="content-block">
          <div className="list-block">
            <div className="flex-list-view">
              <ul className="cate-block">
                {rules[`${role}`] && (
                  <li>
                    <span className="key">Role:</span>
                    <span className="value">{rules[`${role}`]}</span>
                  </li>
                )}
                {category?.length > 0 && (
                  <li>
                    <span className="key">Category:</span>
                    <span className="value">
                      {category?.map((v) => (
                        <>
                          {rules?.category[`${v}`]} {"  "}
                        </>
                      ))}
                    </span>
                  </li>
                )}
              </ul>
            </div>
            <div className="flex-list-view">
              <ul className="level-block">
                {dominant_hand?.length > 0 && (
                  <li>
                    <span className="key">Dominant Hand:</span>
                    <span className="value">
                      {dominant_hand.map((v) => (
                        <>
                          {rules[`${v}`]} {"  "}
                        </>
                      ))}
                    </span>
                  </li>
                )}
                {level?.level_from && level?.level_till && (
                  <li>
                    <span className="key">Level:</span>
                    <span className="value">
                      {level?.level_from}
                      <i>to</i> {level?.level_till}
                    </span>
                  </li>
                )}
                {signed_by?.length > 0 && (
                  <li>
                    <span className="key">Signed By:</span>
                    <span className="value">
                      {signed_by.map((v) => (
                        <>
                          {rules[`${v}`]} {"  "}
                        </>
                      ))}
                    </span>
                  </li>
                )}
              </ul>
            </div>
            <div className="flex-list-view">
              <ul className="price-block">
                {bowling_style?.length > 0 && (
                  <li>
                    <span className="key">Bowling Style:</span>
                    <span className="value">
                      {bowling_style.map((v) => (
                        <>
                          {rules[`${v}`]} {"  "}
                        </>
                      ))}
                    </span>
                  </li>
                )}
                {/* <li>
                  <span className="key">Quantity:</span>
                  <span className="value">{order?.total_quantity}</span>
                </li> */}
                <li>
                  <span className="key">Price:</span>
                  <span className="value">
                    {currencyFormat(order?.price_from, "USD")} <i>to</i>
                    {currencyFormat(order?.price_till, "USD")}
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="action-block">
            <span
              className={`${status} active-btn`}
              onClick={() => {
                if (status === "active") {
                  handleDisable();
                } else {
                  handleEnable();
                }
              }}
            >
              {status}
            </span>
            <ul className="btn-block">
              <li>
                <AiFillEdit
                  className="edit-icon"
                  onClick={() => setShowEdit(true)}
                />
              </li>
              <li>
                <AiFillDelete
                  className="delete-icon"
                  onClick={() => setConfirm(true)}
                />
              </li>
            </ul>
          </div>
        </div>

        <Modal
          show={showEdit}
          size="lg"
          onHide={() => setShowEdit(false)}
          backdrop={"static"}
          className="create-steps"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {step === "step1" && (
                <span className="title">
                  <span>Basics - Update</span>
                  <ul className="placement-list">
                    <li className="active">1</li>
                    <li className="disabled">2</li>
                  </ul>
                </span>
              )}
              {step === "step2" && (
                <span className="title">
                  <span>Limits - Update</span>
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
            <div className="row">
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
                          checked={limit.role === role.value}
                          onChange={(e) => {
                            if (idx === 2) {
                              setLimit({
                                ...limit,
                                role: parseInt(e.currentTarget.value),
                                role_type: role.key,
                                category: [],
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
                        categories={rules[`${limit.role_type}`]?.category || []}
                        limit={limit}
                        setLimit={setLimit}
                        update
                      />
                    </div>
                  )}

                  {limit?.role_type && limit?.role_type !== "bat" && (
                    <div className="col-12">
                      <Hand
                        hand={rules[`${limit.role_type}`]?.hand || []}
                        limit={limit}
                        setLimit={setLimit}
                        update
                      />
                    </div>
                  )}

                  {limit?.role_type && limit?.role_type === "bowler" && (
                    <div className="col-12">
                      <BowlingStyle
                        bowlingStyle={rules[`${limit.role_type}`]?.style}
                        limit={limit}
                        setLimit={setLimit}
                        update
                      />
                    </div>
                  )}

                  {/* {limit?.role_type && limit?.role_type !== "bat" && (
                    <div className="col-12">
                      <Gender
                        genders={rules[`${limit.role_type}`]?.gender}
                        limit={limit}
                        setLimit={setLimit}
                        update
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
                          update
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
                </article>
              )}
            </div>
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
                        <div className="error-text">{limitErrors.price_to}</div>
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
                      className="btn btn-dark-secondary prev-btn"
                      onClick={() => setShowEdit(false)}
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
                    onClick={() => {
                      if (step === "step1") {
                        setStep("step2");
                      } else if (step === "step2") {
                        handleLimitUpdate();
                      }
                    }}
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

        {/* Delete Modal start */}
        <Modal
          show={confirm}
          size="sm"
          onHide={() => setConfirm(false)}
          backdrop={"static"}
          className="lmtorder-delete-modal"
        >
          <Modal.Body className="card-modal ">
            <h4>Are you sure want to delete ?</h4>
            <div className="btn-grp">
              <button
                className="btn btn-dark"
                onClick={() => handleDelete()}
                type="button"
              >
                Yes
              </button>
              <button
                className="btn btn-dark-secondary"
                onClick={() => setConfirm(false)}
                type="button"
              >
                No
              </button>
            </div>
          </Modal.Body>
        </Modal>
        {/* Delete Modal end */}
      </article>
    </>
  );
};

export default LimitOrderCard;
