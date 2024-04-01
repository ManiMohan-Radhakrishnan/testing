export const USER_LOGIN_REQUEST = "USER_LOGIN_REQUEST";
export const USER_LOGIN_SUCCESS = "USER_LOGIN_SUCCESS";
export const USER_LOGIN_RESET = "USER_LOGIN_RESET";
export const USER_LOGIN_OTP = "USER_LOGIN_OTP";
export const USER_LOGIN_GOOGLE_OTP = "USER_LOGIN_GOOGLE_OTP";
export const USER_ENABLE_MFA = "USER_ENABLE_MFA";
export const USER_DISABLE_MFA = "USER_DISABLE_MFA";
export const USER_LOGIN_FAILURE = "USER_LOGIN_FAILURE";
export const USER_DISABLED_MFA_SUCCESS = "USER_DISABLED_MFA_SUCCESS";
export const USER_ENABLED_MFA_SUCCESS = "USER_ENABLED_MFA_SUCCESS";

export const USER_LOGOUT = "USER_LOGOUT";

export const MARKET_LIVE = "MARKET_LIVE";
export const MARKET_LIVE_OFF = "MARKET_LIVE_OFF";
export const WHITELIST_POP_UP = "WHITELIST_POP_UP";
export const WHITELIST_CRYPTO_UP = "WHITELIST_CRYPTO_UP";
export const MOBILE_NUM_ADD = "MOBILE_NUM_ADD";
export const MOBILE_NUM_VERIFY = "MOBILE_NUM_VERIFY";
export const USER_UPI_ID = "USER_UPI_ID";
export const USER_UPI_ID_NAME = "USER_UPI_ID_NAME";
export const USER_UPI_ID_VALID = "USER_UPI_ID_VALID";
export const USER_PAN_NAME_VALID = "USER_PAN_NAME_VALID";
export const USER_PAN_MISMATCH_ERROR = "USER_PAN_MISMATCH_ERROR";
export const USER_PAN_NAME = "USER_PAN_NAME";
export const UPI_ID_DISABLED = "UPI_ID_DISABLED";

export const user_login_action_request = () => {
  return {
    type: USER_LOGIN_REQUEST,
  };
};

export const user_login_action_success = (input) => {
  return {
    type: USER_LOGIN_SUCCESS,
    payload: input,
  };
};

export const user_enable_mfa = (input) => {
  return {
    type: USER_ENABLE_MFA,
    payload: input,
  };
};

export const user_disable_mfa = (input) => {
  return {
    type: USER_DISABLE_MFA,
    payload: input,
  };
};

export const user_login_google_otp_action = () => {
  return {
    type: USER_LOGIN_GOOGLE_OTP,
  };
};

export const user_enable_mfa_auth_success = (input) => {
  return {
    type: USER_ENABLED_MFA_SUCCESS,
  };
};

export const user_disable_mfa_auth_success = () => {
  return {
    type: USER_DISABLED_MFA_SUCCESS,
  };
};

export const user_login_action_reset = () => {
  return {
    type: USER_LOGIN_RESET,
  };
};

export const user_login_action_failure = (input) => {
  return {
    type: USER_LOGIN_FAILURE,
    payload: input,
  };
};

export const user_login_otp_action = (input) => {
  return {
    type: USER_LOGIN_OTP,
  };
};

export const user_logout_action = () => {
  return {
    type: USER_LOGOUT,
  };
};

export const market_live = () => {
  return {
    type: MARKET_LIVE,
  };
};

export const market_live_off = () => {
  return {
    type: MARKET_LIVE_OFF,
  };
};

export const whitelistPopUp = (input = false) => {
  return {
    type: WHITELIST_POP_UP,
    payload: input,
  };
};

export const whitelistCryptoPopUp = (input = "") => {
  return {
    type: WHITELIST_CRYPTO_UP,
    payload: input,
  };
};

export const mobilNumAddModal = (input = false) => {
  return {
    type: MOBILE_NUM_ADD,
    payload: input,
  };
};

export const mobileNumVerifyModal = (input = false) => {
  return {
    type: MOBILE_NUM_VERIFY,
    payload: input,
  };
};

export const getUpiId = (input = "") => {
  return {
    type: USER_UPI_ID,
    payload: input,
  };
};

export const getUpiIdUserName = (input = "") => {
  return {
    type: USER_UPI_ID_NAME,
    payload: input,
  };
};

export const getUpiIdValid = (input = false) => {
  return {
    type: USER_UPI_ID_VALID,
    payload: input,
  };
};

export const getPanNameValid = (input = false) => {
  return {
    type: USER_PAN_NAME_VALID,
    payload: input,
  };
};

export const getPanMismatch = (input = "") => {
  return {
    type: USER_PAN_MISMATCH_ERROR,
    payload: input,
  };
};

export const getPanName = (input = "") => {
  return {
    type: USER_PAN_NAME,
    payload: input,
  };
};

export const getUpiIdDisabled = (input = false) => {
  return {
    type: UPI_ID_DISABLED,
    payload: input,
  };
};
