import { toast } from "react-toastify";
import {
  disableMfaApi,
  mfaDetailsApi,
  activeCodesList,
  verifyGamerApi,
  mobileNumSendOtp,
  mobileNumVerifyOtp,
} from "../../api/methods";
import { signInApi, SendEmailOtp } from "../../api/methods";
import { getCookies, setCookies, removeCookies } from "../../utils/cookies";
import { signOutApi, userApi } from "./../../api/methods";
import {
  user_login_otp_action,
  user_login_google_otp_action,
  user_login_action_request,
  user_login_action_success,
  user_login_action_failure,
  user_logout_action,
  user_login_action_reset,
  market_live,
  market_live_off,
  user_disable_mfa_auth_success,
  user_enable_mfa,
} from "../actions/user_action";
import {
  getCartListApi,
  getPrebookedListLogs,
  getPrebookedNftList,
} from "../../api/methods-marketplace";
import { get_cart_list } from "../actions/user_cart_action";

export const user_login_thunk = (
  input,
  returnMessage,
  setOTP,
  setGoogleOTP,
  setKey
) => {
  return async (dispatch) => {
    try {
      dispatch(user_login_action_request());

      const result = await signInApi(input);

      if (result?.status === 200) {
        if (result.data.data.gauth) {
          setKey(result.data.data.secret_key);
          setGoogleOTP(true);

          dispatch(user_login_google_otp_action());
        } else if (result.data.message === "verification required") {
          setOTP(true);

          dispatch(user_login_otp_action());
        } else {
          setCookies(result.data.data.token);

          try {
            const user = await userApi(result.data.data.token);

            dispatch(user_login_action_success(user.data.data));
          } catch (u_err) {
            if (u_err?.status === 401) {
              returnMessage("Invalid credential(s)");
            } else {
              toast.error(
                "An unexpected error occured. Please try again  later"
              );
            }
            dispatch(user_login_action_failure(u_err));
          }
        }
      }
    } catch (err) {
      if (err?.status === 422) {
        if (err?.data?.message === "email otp locked") {
          returnMessage(
            "Account lock for security reasons, please login again after 10 mins"
          );
        } else {
          returnMessage("Invalid credential(s)");
        }
      } else if (err?.status === 406) {
        if (err?.data.message === "login locked") returnMessage("login-locked");
        else returnMessage("confirm-email");
      } else {
        toast.error("An unexpected error occured. Please try again  later");
      }

      dispatch(user_login_action_failure(err));
    }
  };
};

export const user_login_with_email_thunk = (input, returnMessage, setOTP) => {
  return async (dispatch) => {
    try {
      dispatch(user_login_action_request());

      const result = await SendEmailOtp(input);

      if (result.data.status === 200) {
        setOTP(true);

        dispatch(user_login_otp_action());
      }
    } catch (err) {
      if (err?.status === 422) {
        if (err?.data?.message === "email otp locked") {
          returnMessage(
            "Account lock for security reasons, please login again after 10 mins"
          );
        } else if (err?.data?.error_code == 1001) {
          returnMessage(
            "Your email id does not exists, please signup and try again."
          );
        } else if (err?.data?.error_code == 1002) {
          setOTP(true);
        }
      } else if (err?.status === 406) {
        if (err?.data.message === "login locked") returnMessage("login-locked");
        else returnMessage("confirm-email");
      } else {
        toast.error("An unexpected error occured. Please try again  later");
      }

      dispatch(user_login_action_failure(err));
    }
  };
};

export const user_logout_thunk = () => {
  return async (dispatch) => {
    try {
      const token = getCookies();
      if (token) await signOutApi();
    } catch (err) {
      console.log("🚀 ~ file: user_thunk.js ~ line 58 ~ return ~ err", err);
    } finally {
      removeCookies();
      dispatch(user_logout_action());
    }
  };
};

export const user_mfa_thunk = (setShowQr, setQrValue) => {
  return async (dispatch) => {
    try {
      const result = await mfaDetailsApi();
      setQrValue(result.data.data.qr_code_uri);
      setShowQr(!result.data.data.enabled);
      dispatch(user_enable_mfa(result.data));
    } catch (err) {
      console.log("err", err);
    }
  };
};

export const user_disable_mfa_thunk = (
  payload,
  setShowMessage,
  setError,
  setShowdisable
) => {
  return async (dispatch) => {
    try {
      const result = await disableMfaApi(payload);
      dispatch(user_disable_mfa_auth_success());
      //toast.success("Authentication has been Disabled Sucessfully");
      setShowMessage(true);
      setShowdisable(false);
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);
    } catch (err) {
      setShowdisable(true);
      ///console.log("err", err);
      setError("Please enter the Valid Code");
    }
  };
};

export const user_load_by_token_thunk = (token) => {
  return async (dispatch) => {
    try {
      const user = await userApi(token);
      dispatch(user_login_action_success(user?.data?.data));
    } catch (err) {
      if (err?.status === 401) {
        removeCookies();
        toast.error(
          "Your Session Has Expired. Please Login Again To Continue. "
        );
      }
      console.log("🚀 ~ file: user_thunk.js ~ line 58 ~ return ~ err", err);
    }
  };
};

export const user_login_reset_thunk = () => {
  return async (dispatch) => {
    try {
      dispatch(user_login_action_reset());
    } catch (err) {
      console.log("🚀 ~ file: user_thunk.js ~ line 58 ~ return ~ err", err);
    }
  };
};

export const market_live_thunk = () => {
  return async (dispatch) => {
    dispatch(market_live());
  };
};

export const market_live_off_thunk = () => {
  return async (dispatch) => {
    dispatch(market_live_off());
  };
};

export const get_cart_list_thunk = () => {
  return async (dispatch) => {
    try {
      const result = await getCartListApi();
      dispatch(get_cart_list(result.data.data));
    } catch (err) {
      console.log(err);
    }
  };
};

export const get_pre_booked_nfts_list = (request) => {
  return async () => {
    let { callback = null } = request;
    try {
      const result = await getPrebookedNftList();
      typeof callback === "function" && callback(result);
    } catch (err) {
      console.log(err);
      typeof callback === "function" && callback(err?.response);
    }
  };
};
export const get_pre_booked_nfts_list_logs = (request) => {
  return async () => {
    let { callback = null, slug } = request;
    try {
      const result = await getPrebookedListLogs(slug);
      typeof callback === "function" && callback(result);
    } catch (err) {
      console.log(err);
      typeof callback === "function" && callback(err?.response);
    }
  };
};

export const get_active_code_list = (request) => {
  return async () => {
    let { callback = null } = request;
    try {
      const result = await activeCodesList();
      typeof callback === "function" && callback(result);
    } catch (err) {
      console.log(err);
      typeof callback === "function" && callback(err?.response);
    }
  };
};

export const verify_gamer_thunk = (request) => {
  return async (dispatch) => {
    let { callback = null, data = {} } = request;
    try {
      const result = await verifyGamerApi(data);
      let token = result?.data?.data?.token || "";
      if (token) {
        token && setCookies(token);
        dispatch(user_load_by_token_thunk(token));
      }
      typeof callback === "function" && callback(result);
    } catch (err) {
      console.log(err);
      typeof callback === "function" && callback(err?.response);
    }
  };
};

export const send_sms_otp_for_mobileVerify_thunk = (request) => {
  return async () => {
    let { callback = null, data } = request;
    try {
      let result = await mobileNumSendOtp(data);
      callback(result);
    } catch (error) {
      callback(error);
    }
  };
};

export const verify_sms_mobileVerify_thunk = (request) => {
  return async (dispatch) => {
    let { data, callback = null } = request;

    try {
      let response = await mobileNumVerifyOtp(data);
      if (response?.status === 200) {
        const token = getCookies();
        dispatch(user_load_by_token_thunk(token));
      }
      callback(response);
    } catch (err) {
      console.log("err", err?.data?.message);
      callback(err);
    }
  };
};
