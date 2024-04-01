/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";

import "./style.scss";

const CheckLoginType = ({ currentPage, setcurrentPage }) => {
  return (
    <>
      <span>Continue with </span>

      <span
        className="link-text"
        onClick={() =>
          setcurrentPage(currentPage === "number" ? "emailotp" : "number")
        }
      >
        {" "}
        {/* Mobile number */}
        {currentPage === "number" ? "Email" : "Mobile number"}
      </span>
    </>
  );
};

export default CheckLoginType;
