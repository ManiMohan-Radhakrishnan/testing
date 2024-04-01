/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import ContentLoader from "react-content-loader";
import { useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";

import PreOrderCard from "../pre-orders";
import { preOrder, preOrderReserve } from "../../api/methods";
import { validateQuantity } from "../../utils/common";
import NFTCounter from "../nft-counter/index";

const PreOrders = () => {
  const { user } = useSelector((state) => state.user.data);

  const reserveTime_UTC = "17 Apr 2022 12:30";

  var offset = new Date().getTimezoneOffset();

  var reserveTime = new Date(reserveTime_UTC);
  reserveTime.setMinutes(reserveTime.getMinutes() - offset);

  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [preOrderData, setPreOrderData] = useState();
  const [show, setShow] = useState(false);
  const [slug, setSlug] = useState();
  const [enable, setEnable] = useState(false);
  const [disable, setDisable] = useState(true); //actual value false

  const [profile, setProfile] = useState({
    quantity: "",
  });
  const [validation, setValidation] = useState({
    quantity: false,
  });

  useEffect(() => {
    getPreOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPreOrders = async () => {
    try {
      setLoading(true);
      const result = await preOrder("pPOGYQ3GI0QjDo4l");
      console.log(result);
      setPreOrderData({ ...result.data.data.user });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEvent = (e) => {
    console.log(e.target.value);

    if (e.target.value) {
      if (e.target.name === "quantity") {
        if (validateQuantity(e.target.value)) {
          setProfile({
            ...profile,
            [e.target.name]: e.target.value,
          });
          setValidation({ ...validation, [e.target.name]: false });
        }
      } else {
        setProfile({ ...profile, [e.target.name]: e.target.value });
        setValidation({ ...validation, [e.target.name]: false });
      }
    } else {
      setProfile({ ...profile, [e.target.name]: e.target.value });
      setValidation({ ...validation, [e.target.name]: true });
    }
  };

  const checkValidation = () => {
    let c_validation = { ...validation };
    if (!profile.quantity) {
      c_validation = { ...c_validation, quantity: true };
    } else {
      if (validateQuantity(profile.quantity)) {
        c_validation = { ...c_validation, valid_quantity: false };
      } else {
        c_validation = { ...c_validation, valid_quantity: true };
      }
    }

    setValidation(c_validation);
    if (!c_validation.quantity && !c_validation.valid_quantity) {
      return true;
    } else {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (checkValidation()) {
      try {
        setLoading2(true);
        // console.log("slug", slug);

        const result = await preOrderReserve(slug, profile.quantity);
        console.log("resultss", result);
        if (result.data.success) {
          toast.success(result.data.message);
        }
        setLoading2(false);

        setProfile({ quantity: "" });
        getPreOrders();
        setShow(false);
      } catch (error) {
        setLoading2(false);

        toast.error(error.data.message);

        // if (
        //   error.data.message ===
        //   "Reserve start time Reserve time not yet started"
        // ) {
        //   toast.error("Reserve time not yet started");
        // }

        // if (
        //   error.data.message ===
        //   "Reserve end time Sorry reserve time competed already"
        // ) {
        //   toast.error("Reserve time already ended");
        // }

        // if (
        //   error.data.message ===
        //   "Quantity Could not able to reserve nft, Please make sure you have sufficient account balance."
        // ) {
        //   toast.error("Low Balance");
        // }

        // if (
        //   error.data.message === "Quantity User can not reserve more than 100"
        // ) {
        //   toast.error("User buy quantity exceeded");
        // }

        console.log(
          "🚀 ~ file: index.js ~ line 46 ~ handleSubmit ~ error",
          error
        );
      }
    } else {
      toast.error("Please Enter Quantity ");
    }
  };

  const handleSubmitConfirm = (data) => {
    setShow(true);
    setSlug(data);
  };

  return (
    <>
      <div style={{ display: "none" }}>
        {enable && preOrderData?.reserve_end_time ? (
          <NFTCounter
            time={preOrderData.reserve_end_time}
            handleEndEvent={() => setDisable(true)}
          />
        ) : (
          <NFTCounter
            time={reserveTime}
            handleEndEvent={() => setEnable(true)}
          />
        )}
      </div>
      {/* <div className="col-md-10"> */}
      <div className="main-content-block">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="wallet-user mt-3">
                <div className="row align-items-center">
                  <div className="col-lg-12">
                    <h3 className="about-title">Pre Book nfts</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              {loading ? (
                <Loader />
              ) : (
                <div className="myorders-block">
                  {preOrderData && (
                    <PreOrderCard
                      disable={disable}
                      enable={enable}
                      quantity={profile.quantity}
                      reserveTime={reserveTime}
                      data={preOrderData}
                      onChange={handleChangeEvent}
                      handleSubmit={handleSubmitConfirm}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal show={show} size={"lg"} onHide={() => setShow(false)}>
        {enable || preOrderData?.can_order ? (
          <>
            <Modal.Header className="modal-confirm-head">
              Confirmation
            </Modal.Header>
            <div className="modal-confirm-body">
              By confirming the pre-book, you agree to the below terms and
              conditions:
              <ul>
                <li>
                  The pre-book once placed cannot be cancelled or reversed.
                </li>
                <li>
                  The final allocation of NFTs pre-booked by you is subject to
                  the overall NFT subscription on the platform. You will be
                  notified about your allocation atleast 3 hours prior to the
                  drop.
                </li>
                <li>
                  The amount used to pre-book NFTs will be included under 'funds
                  on hold' in your wallet. Until the pre-book allocation is
                  completed, you will not be able to use the locked amount for
                  other activities.
                </li>
                <li>
                  The value of un-allotted NFTs will be credited back to your
                  wallet once the allocation process is complete, which is
                  atleast 3 hours prior to the drop.
                </li>
              </ul>
            </div>
            <div className="mb-1 d-flex flex-row-reverse p-3">
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="btn btn-dark rounded rounded-pill ps-4 pe-4"
              >
                {loading2 ? "Loading..." : "Confirm"}
              </button>
              <button
                type="button"
                onClick={() => setShow(false)}
                className="btn btn-outline-dark rounded rounded-pill me-2 ps-4 pe-4"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="modal-confirm-body">
              Sorry, early access to pre-book is currently open to only
              community members who are already trading in the GuardianLink NFT
              ecosystem (BeyondLife.club, Fully Faltoo, Hindustan Times, LA
              Times, etc..)
              <div className="mt-3">
                Pre-book feature opens for everyone after{" "}
                <NFTCounter
                  time={reserveTime}
                  timeClass="counter-font-custom-time"
                  intervalClass="counter-font-custom-interval"
                  intervalGapClass="me-1"
                  customClass="d-inline"
                />
              </div>
            </div>
            <div className="mb-1 d-flex flex-row-reverse p-3">
              <button
                type="button"
                onClick={() => setShow(false)}
                className="btn btn-outline-dark rounded rounded-pill me-2 ps-4 pe-4"
              >
                Close
              </button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

const Loader = (props) => (
  <ContentLoader
    viewBox="0 0 900 400"
    width={"100%"}
    height={"100%"}
    backgroundColor="#f5f5f5"
    foregroundColor="#dbdbdb"
    className="mt-0"
    {...props}
  >
    <rect x="0" y="5" rx="5" ry="5" width="900" height="100" />
    <rect x="0" y="120" rx="5" ry="5" width="900" height="100" />
    <rect x="0" y="235" rx="5" ry="5" width="900" height="100" />
  </ContentLoader>
);

export default PreOrders;
