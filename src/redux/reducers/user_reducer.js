import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_OTP,
  USER_LOGIN_GOOGLE_OTP,
  USER_LOGIN_FAILURE,
  USER_LOGIN_RESET,
  USER_LOGOUT,
  USER_DISABLE_MFA,
  USER_ENABLE_MFA,
  USER_DISABLED_MFA_SUCCESS,
  USER_ENABLED_MFA_SUCCESS,
  MARKET_LIVE,
  MARKET_LIVE_OFF,
  WHITELIST_POP_UP,
  WHITELIST_CRYPTO_UP,
  MOBILE_NUM_ADD,
  MOBILE_NUM_VERIFY,
  USER_UPI_ID,
  USER_UPI_ID_NAME,
  USER_UPI_ID_VALID,
  USER_PAN_NAME_VALID,
  USER_PAN_MISMATCH_ERROR,
  USER_PAN_NAME,
  UPI_ID_DISABLED,
} from "./../actions/user_action";

const initState = {
  data: {},
  login: false,
  loading: false,
  error: false,
  mfaEnabled: false,
  errorData: {},
  marketLive: false,
  whitelist_popup: false,
  whitelist_crypto_popup: "",
  mobile_num_add: false,
  mobile_num_verify: false,
  upi_id: "",
  upi_user_name: "",
  upiIdValid: false,
  panNameValid: false,
  panMismatchError: "",
  userPanName: "",
  upiIdDisabledMode: false,
};

const user_reducer = (state = initState, { payload, type }) => {
  if (type === USER_LOGIN_REQUEST) {
    state = { ...state, loading: true };
  }

  if (type === USER_LOGIN_SUCCESS) {
    state = { ...state, loading: false, login: true, data: payload };
  }
  if (type === USER_ENABLED_MFA_SUCCESS) {
    state = { ...state, loading: false, login: true, mfaEnabled: true };
  }

  if (type === USER_DISABLED_MFA_SUCCESS) {
    state = { ...state, loading: false, login: true, mfaEnabled: false };
  }

  if (type === USER_LOGIN_RESET) {
    state = { ...state, loading: false, login: false };
  }

  if (type === USER_LOGIN_OTP) {
    state = { ...state, loading: false, login: false };
  }

  if (type === USER_LOGIN_GOOGLE_OTP) {
    state = { ...state, loading: false, login: false, mfaEnabled: true };
  }

  if (type === USER_ENABLE_MFA) {
    state = { ...state, loading: false, login: true, mfaEnabled: false };
  }

  if (type === USER_DISABLE_MFA) {
    state = { ...state, loading: false, login: true, mfaEnabled: true };
  }

  if (type === USER_LOGIN_FAILURE) {
    state = { ...state, loading: false, error: true, errorData: payload };
  }

  if (type === MARKET_LIVE) {
    state = { ...state, marketLive: true };
  }

  if (type === MARKET_LIVE_OFF) {
    state = { ...state, marketLive: false };
  }

  if (type === USER_LOGOUT) {
    state = {
      ...state,
      data: {},
      login: false,
      loading: false,
      error: false,
      mfaEnabled: false,
      errorData: {},
      upi_id: "",
      upi_user_name: "",
      upiIdValid: false,
      panNameValid: false,
      panMismatchError: "",
      userPanName: "",
      upiIdDisabledMode: false,
    };
  }

  if (type === WHITELIST_POP_UP) {
    state = { ...state, whitelist_popup: payload };
  }
  if (type === WHITELIST_CRYPTO_UP) {
    state = { ...state, whitelist_crypto_popup: payload };
  }
  if (type === MOBILE_NUM_ADD) {
    state = { ...state, mobile_num_add: payload };
  }
  if (type === MOBILE_NUM_VERIFY) {
    state = { ...state, mobile_num_verify: payload };
  }
  if (type === USER_UPI_ID) {
    state = { ...state, upi_id: payload };
  }
  if (type === USER_UPI_ID_NAME) {
    state = { ...state, upi_user_name: payload };
  }
  if (type === USER_UPI_ID_VALID) {
    state = { ...state, upiIdValid: payload };
  }
  if (type === USER_PAN_NAME_VALID) {
    state = { ...state, panNameValid: payload };
  }
  if (type === USER_PAN_MISMATCH_ERROR) {
    state = { ...state, panMismatchError: payload };
  }
  if (type === USER_PAN_NAME) {
    state = { ...state, userPanName: payload };
  }
  if (type === UPI_ID_DISABLED) {
    state = { ...state, upiIdDisabledMode: payload };
  }
  return state;
};

export const getUserInfo = (state) => state?.user?.data?.user || {};
export const getUserBalanceInfo = (state) => {
  let user = getUserInfo(state);
  return {
    usd: user?.balance || 0,
    doge: user?.doge_balance || 0,
    jump_point: user?.jump_points_balance || 0,
    reward_point: user?.assert_balances?.reward_point || 0,
  };
};

export default user_reducer;
