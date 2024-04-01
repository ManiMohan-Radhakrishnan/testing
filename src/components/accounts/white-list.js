import React, { useEffect, useState } from "react";

import {
  changePasswordApi,
  whitelistedUpiList,
  whitelistPaymentID,
  whitelistSendOtp,
  whitelistVerifyOtp,
} from "../../api/methods";
import { toast } from "react-toastify";
import InputText from "./../input-text";
import { validatePassword, validateUpi } from "./../../utils/common";
import Modal from "react-bootstrap/Modal";
import InputOTP from "../input-otp";
import Switch from "react-switch";
import { useDispatch, useSelector } from "react-redux";
import { FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { whitelistPopUp } from "../../redux/actions/user_action";
import UPIIcon from "../../images/jump-trade/imgs/upi-icon.svg";
import CryptoWhitelist from "./crypto-whitelist";
import UPIWhitelist from "./upi-whitelist";
import ChooseWallet from "./choose-wallet";

const Whitelist = () => {
  return (
    <>
      {/* <div className="col-md-10"> */}
      <div className={`main-content-block`}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="wallet-user mt-3">
                <div className="row align-items-center">
                  <div className="col-lg-7">
                    <h3 className="wallet-title">Whitelist Payment ID</h3>{" "}
                  </div>
                </div>
              </div>
              <div className="change-pass-setting">
                <UPIWhitelist />
                <CryptoWhitelist />
                <ChooseWallet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Whitelist;
