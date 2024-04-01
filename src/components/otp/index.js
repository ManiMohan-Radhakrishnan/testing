import React from "react";
import { Link } from "react-router-dom";
import InputOTP from "./../input-otp";

const OtpComponent = () => {
  return (
    <div className="bg-white mt-3 p-5 rounded">
      <div className="form-group mb-3">
        <InputOTP title={"OTP"} />
      </div>
      <div className="form-group text-end">
        <small className="text-secondary">
          Don't receive code?{" "}
          <Link to="/forgot-password">Click here to resend OTP</Link>
        </small>
      </div>
      <div className="form-group mt-2">
        <button type="button" className="btn btn-primary btn-lg w-100">
          Verify
        </button>
      </div>
    </div>
  );
};

export default OtpComponent;
