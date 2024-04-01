/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";

import "./style.scss";

const LoginNavComponent = ({ currentPage, setcurrentPage }) => {
  return (
    <>
      <div className="row pb-4">
        <div
          className={`col-md-6  col-6  col-sm-6 tab-content ${
            currentPage === "emailotp" || currentPage === "number"
              ? "tab-content-active"
              : ""
          }`}
          onClick={() => {
            currentPage !== "number" && setcurrentPage("emailotp");
          }}
        >
          {" "}
          OTP
        </div>
        <div
          className={`col-md-6 col-6 col-sm-6 tab-content ${
            currentPage === "email" ? "tab-content-active" : ""
          }`}
          onClick={() => {
            setcurrentPage("email");
          }}
        >
          {" "}
          Password
        </div>
      </div>
    </>
  );
};

export default LoginNavComponent;
