import React, { useState } from "react";
import { toast } from "react-toastify";

import InputText from "../input-text";
import { changePasswordApi } from "../../api/methods";
import { passwordLength } from "./../../utils/common";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const [validation, setValidation] = useState({
    current_password: false,
    password: false,
    password_confirmation: false,
  });

  const handleChangeEvent = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    if (e.target.value) {
      setValidation({ ...validation, [e.target.name]: false });
    } else {
      setValidation({ ...validation, [e.target.name]: true });
    }
  };

  const handleChangePassword = async () => {
    if (checkValidation()) {
      const { password, password_confirmation } = data;
      if (password.length >= passwordLength) {
        if (password === password_confirmation) {
          try {
            setLoading(true);

            const result = await changePasswordApi(data);
            if (result.status === 200) {
              toast.success("Password Updated Successfully");
              setData({
                current_password: "",
                password: "",
                password_confirmation: "",
              });
            }
          } catch (err) {
            setLoading(false);

            if (err?.status === 422) {
              toast.error(
                "The Current Password Is Invalid. Please Create A New Password Compliant With Our Password Policy. "
              );
            } else {
              toast.error("An unexpected error occured. Please try again ");
              console.log(
                "🚀 ~ file: index.js ~ line 106 ~ handleSignUp ~ err",
                err
              );
            }
          }

          setLoading(false);
        } else {
          toast.warn("Passwords Do Not Match!");
        }
      } else {
        toast.warn("Password Should Be A Minimum of 6 Characters");
      }
    }
  };

  const checkValidation = () => {
    let c_validation = { ...validation };

    if (!data.current_password) {
      c_validation = { ...c_validation, current_password: true };
    }
    if (!data.password) {
      c_validation = { ...c_validation, password: true };
    }
    if (!data.password_confirmation) {
      c_validation = { ...c_validation, password_confirmation: true };
    }

    setValidation(c_validation);
    if (
      !c_validation.current_password &&
      !c_validation.password &&
      !c_validation.password_confirmation
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="bg-white mt-3 p-5 rounded">
      <h4> Change Password</h4>
      <div className="form-group mb-3 mt-3">
        <InputText
          title="Old Password"
          type="password"
          required={validation.current_password}
          name="current_password"
          onChange={handleChangeEvent}
          value={data.current_password}
        />
      </div>
      <div className="form-group mb-3 mt-3">
        <InputText
          title="New Password"
          type="password"
          required={validation.password}
          name="password"
          onChange={handleChangeEvent}
          value={data.password}
        />
      </div>
      <div className="form-group mb-3 mt-3">
        <InputText
          title="Confirm New Password"
          type="password"
          required={validation.password_confirmation}
          name="password_confirmation"
          onChange={handleChangeEvent}
          value={data.password_confirmation}
        />
      </div>
      <div className="form-group mt-2">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleChangePassword}
          disabled={loading}
        >
          {loading ? "Loading..." : "Change Password"}
        </button>
      </div>
    </div>
  );
};

export default Settings;
