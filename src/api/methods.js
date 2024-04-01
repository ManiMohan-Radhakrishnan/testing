import { encryptMessage } from "../utils/common";
import { ParamsSerialize } from "../utils/params-serialize";
import axios from "./axios-utils";
import marketplaceAxios from "./axios-utils-marketplace";

export const registerApi = (props) =>
  axios.post("/register", { user: { ...props } });

export const changePasswordApi = (props) =>
  axios.put("/change_password", { user: { ...props } });

// export const signInApi = (props) =>
//   axios.post("/login", { ...props, source: "web" });

export const signInApi = (props) =>
  axios.post("/user_login", { ...props, source: "web" });

export const mfaDetailsApi = () => axios.get("/users/qr_code_uri");

export const enableMfaApi = (props) =>
  axios.post("/users/enable_google_auth", { ...props });

export const disableMfaApi = (payload) =>
  axios.post("/users/disable_google_auth", payload);

export const verifyGoogleOtpApi = (props) =>
  axios.post("/verify_google_otp", { ...props });

export const userApi = (token) =>
  axios.get("/users/me", { headers: { Authorization: token } });

export const getDeflationPercentage = () =>
  axios.get("/payments/ippopay/deflation_percentage");

export const showUserApi = (slug) => axios.get(`/users/${slug}`);

export const paymentStatusApi = (type) =>
  axios.get(`/users/payment_status?type=${type}`);

export const removeImage = (slug, type) =>
  axios.put(`/users/${slug}/remove_image?type=${type}`);

export const resendConfirmationApi = (email) =>
  axios.post(`/resend_confirmation`, { email });

export const userActivityApi = (page, filter) =>
  axios.get(
    `/users/activities?page=${page}&reasons=${JSON.stringify(filter)}`,
    {
      params: {
        size: "5",
      },
      paramsSerializer: (params) => {
        return ParamsSerialize(params);
      },
    }
  );

export const getUserTreasureBalance = () =>
  axios.get(`/users/treasure_balance`);

export const moveTreasureBalance = () => axios.post(`/users/treasure_redeem`);

export const signOutApi = () => axios.delete("/logout");

export const profileUpdateApi = ({ slug, data }) =>
  axios.put(`/users/${slug}`, data);

export const privateNFTApi = ({ data }) =>
  axios.post(`/users/private_nfts`, data);

export const confimationApi = (token) =>
  axios.get(`/confirm?confirmation_token=${token}`);

export const resetPasswordApi = (props) =>
  axios.put("/password", { user: { ...props } });

export const forgotPasswordApi = (email) =>
  axios.post(`/forgot_password`, { email });

export const attachCardApi = (id) =>
  axios.post("/payments/stripe/add_stripe_card", { payment_method_id: id });

export const kycExistingUserApi = (redirect_url, kyc, slug) =>
  axios.put(`/kyc/${slug}`, { redirect_url, kyc });

export const kycApi = (redirect_url, kyc) =>
  axios.post("/kyc", { redirect_url, kyc });

export const getUserKycDetails = (slug) => axios.get(`/kyc/${slug}`);

export const ippoCreateOrder = (amount) =>
  axios.post("/payments/ippopay/create_order", { amount });

export const cashfreeCreateOrder = (amount) =>
  axios.post("/payments/cashfree/create_order", { amount });

export const cashfreeOrderStatus = (order_id) =>
  axios.put("/payments/cashfree/order_status", { order_id });

export const fireBlockFetchAddress = () =>
  axios.post("/payments/fireblock/fetch_address");

export const fireBlockRefresh = () => axios.post("/payments/fireblock/refresh");

export const ippoUpdateOrder = (order_id) =>
  axios.put("/payments/ippopay/order_status", { order_id });

export const detachCardApi = (id) =>
  axios.post("/payments/stripe/detach_stripe_card", { payment_method_id: id });

export const getNotificationApi = (page) =>
  axios.get(`/users/notifications?page=${page}`);

export const readNotificationApi = () => axios.post("/users/notification_read");

export const withdrawBalanceApi = () => axios.get("/users/withdraw_balance");

export const withdrawRequestApi = (input) => axios.post("/withdraws", input);

export const withdrawCancelApi = (id) => axios.put(`/withdraws/${id}/cancel`);

export const withdrawOTPApi = (input) =>
  axios.post("/withdraws/send_otp", input);

export const withdrawOTPVerifyApi = (input) =>
  axios.post("/withdraws/verify_otp", input);

export const resendOtpApi = (email, login_with_otp = false) =>
  axios.post("/resend_email_otp", { email, login_with_otp, source: "web" });

export const verifyOtpApi = (email, otp) =>
  axios.post("/verify_email", { email, otp, source: "web" });

export const sendNumberOtp = (data) =>
  axios.post("/send_sms_otp_for_login", data);

export const otpNumberVerify = (data) =>
  axios.post("/verify_sms_for_login", data);

export const chargeCardApi = (id, amount) =>
  axios.post("/payments/stripe/charge_stripe_card", {
    payment_method_id: id,
    amount,
  });

export const fetchCardApi = () =>
  axios.get("/payments/stripe/fetch_stripe_cards");

export const fetchPaymentHistory = (page, filter) =>
  axios.get(`/payments/history?page=${page}&type=${filter}`);

export const updateBanner = (slug, form) =>
  axios.put(`/users/${slug}/update_banner`, form, {
    headers: {
      "Content-Type": `multipart/form-data; boundary=${form._boundary}`,
    },
  });

export const updateAvatar = (slug, form) =>
  axios.put(`/users/${slug}/update_avatar`, form, {
    headers: {
      "Content-Type": `multipart/form-data; boundary=${form._boundary}`,
    },
  });

export const userOwnedNFTsApi = (page) =>
  axios.get(`/users/owned?page=${page}`);

export const userFavNFTsApi = (page) => axios.get(`/users/faved?page=${page}`);

export const userClaimNFTsApi = (page) =>
  axios.get(`/users/bid_activity_claims?page=${page}`);

export const userActiveBidNFTsApi = (page) =>
  axios.get(`/users/active_bids?page=${page}`);

export const userOverBidNFTsApi = (page) =>
  axios.get(`/users/over_bids?page=${page}`);

export const claimNFTApi = (props) => axios.post("/users/claim", props);

export const getlinkToken = () => axios.post("/payments/fracto/ach_start");

export const achPayment = (input) =>
  axios.post("/payments/fracto/ach_payment", input);

export const achVerify = (input) =>
  axios.post("/payments/fracto/ach_verify", input);

export const addCardFractoApi = (input) =>
  axios.post("/payments/fracto/add_card", {
    fracto: input,
  });

export const fetchFractoCardApi = () =>
  axios.get("/payments/fracto/fetch_payment_methods");

export const fetchFractoAchStatusApi = (txid) =>
  axios.get(`/payments/fracto/ach_status?txid=${txid}`);

export const ccFractoPayment = (id, amount, cvv) =>
  axios.post("/payments/fracto/cc_payment", {
    fracto: {
      paymentmethod_id: id,
      amount,
      cvv,
    },
  });

export const detachFractoCardApi = (id) =>
  axios.post("/payments/fracto/detach_card", { paymentmethod_id: id });

export const detachFractoACHApi = (id) =>
  axios.post("/payments/fracto/detach_ach_account", { paymentmethod_id: id });

export const getRAMPAddress = () => axios.get("/payments/ramp/fetch_address");

export const rampPurchaseCreate = (input) =>
  axios.post("/payments/ramp", input);

export const fractoCryptoPayment = (input) =>
  axios.post("/payments/fracto/crypto_payment", { amount: input });

export const trackIP = () => axios.get("https://geolocation-db.com/json/");

export const getServerTimeApi = () =>
  axios.get(
    `${process.env.REACT_APP_SERVER_URL.replace(
      "api/v1",
      ""
    )}/time?timestamp=${new Date().getTime()}`
  );

export const getUserRewardBalance = () => axios.get(`/user_rewards`);

export const moveRedeem = (slug) => axios.put(`/user_rewards/${slug}/redeem`);

export const preOrder = (slug) => axios.get(`/reserve_terms/${slug}`);

export const preOrderHistory = (slug) =>
  axios.get(`/reserve_terms/${slug}/reserved_nfts`);

export const preOrderReserve = (slug, quantity) =>
  axios.post(`reserve_terms/${slug}/reserved_nfts`, {
    reserved_nfts: {
      quantity,
    },
  });

export const getUserRewardBalanceList = () => axios.get(`/user_rewards/list`);

export const getUserReferralSummary = () => axios.get(`/referrals/summary`);

export const getUserCashbackBalanceList = () =>
  axios.get(`/user_rewards/cashback`);

export const addUserAccountCoupon = (coupon) =>
  axios.post("/user_rewards", {
    user_reward: {
      coupon,
    },
  });

export const getUTCoinsList = (jump_point, page) =>
  axios.get(`/user_assert_versions?page=${page}`, {
    params: {
      assert: jump_point,
    },
    paramsSerializer: (params) => {
      return ParamsSerialize(params);
    },
  });

export const utcoinsConvert = (jump_point, amount) =>
  axios.post("/assert_conversions/convert", null, {
    params: {
      amount: amount,
      assert: jump_point,
    },
  });
export const LoginWithOtp = (props) =>
  axios.post("/login_with_otp", { ...props, source: "web" });

export const SendEmailOtp = (props) =>
  axios.post("/send_email_otp", { ...props, source: "web" });

export const ResendEmailOtp = (props) =>
  axios.post("/send_email_otp", { ...props });

export const xena = (props) => axios.post("/xena_registration", { ...props });

export const getJTCoinsGuildUserList = (jump_point, page) =>
  axios.get(`user_assert_versions/point_history?page=${page}`, {
    params: {
      assert: jump_point,
    },
    paramsSerializer: (params) => {
      return ParamsSerialize(params);
    },
  });
export const getReferralDashboardList = () => axios.get(`/referrals/summary`);
export const getReferralUsersList = (referalprop) =>
  axios.get(`/referrals`, {
    params: referalprop,
    paramsSerializer: (params) => {
      return ParamsSerialize(params);
    },
  });

//guildNFT
export const sendEmailAssignOtpApi = () => axios.post("/guild/send_assign_otp");

export const resenEmaildAssignOtpApi = () =>
  axios.post("/guild/resend_assign_otp");

export const AssignRoleApi = (props) =>
  axios.post("/guild/assign_role", { ...props });

export const RemoveRoleApi = (props) =>
  axios.post("/guild/remove_role", { ...props });

export const guilddashboard = () => axios.get(`guild/dashboard`);

export const guildDashboardTopScholars = (filtereddate) =>
  axios.get(`guild/top_users`, {
    params: filtereddate,
  });

export const guildUserListDropAssert = () =>
  axios.get(`asserts/select_options`);

export const guildUserList = (listpageno) =>
  axios.get(`guild/users_list`, {
    params: listpageno,
  });

export const getUserNftListApi = (user_slug) =>
  marketplaceAxios.get(`guild/user_assigned/${user_slug}`);

export const guildUserDetail = (userdetailslug) =>
  axios.get(`guild/users/${userdetailslug}`);

export const guildSubAdminTable = (subAdminTableProp) =>
  axios.get(`guild/subadmins_list`, {
    params: subAdminTableProp,
    paramsSerializer: (params) => {
      return ParamsSerialize(params);
    },
  });

export const getRoles = () => axios.get(`guild/guild_roles/select_options`);

export const guilUserMenuPermissions = () => axios.get(`guild/guild_menus`);

export const guildRoleList = (guildRoleListProp) =>
  axios.get(`guild/guild_roles`, {
    params: guildRoleListProp,
    paramsSerializer: (params) => {
      return ParamsSerialize(params);
    },
  });

export const guildCreateRole = (props) =>
  axios.post(`guild/guild_roles`, { ...props });

export const guildViewRoleMenus = (roleId) =>
  axios.get(`guild/guild_role_menus?guild_role_id=${roleId}`);

export const guildRoleMenuDefault = () => axios.get(`guild/guild_role_menus`);

export const guildEditRole = (editedRoleData, RoleId) =>
  axios.put(`guild/guild_roles/${RoleId}`, { ...editedRoleData });

export const guildDeleteRole = (deleteid) =>
  axios.delete(`guild/guild_roles/${deleteid}`);

export const guildPermissionApi = () => axios.get(`guild/user_can`);

// whitelist
export const whitelistSendOtp = (props) =>
  axios.post("/whitelist/send_otp", { ...props });

export const getUserListApi = () => axios.get(`guild/users/select_options`);

export const whitelistVerifyOtp = (props) =>
  axios.post("/whitelist/verify_otp", { ...props });

export const upiIdVerify = (input) => axios.post(`/upi_verification`, input);

export const whitelistPaymentID = (props) =>
  axios.post("/whitelist", { ...props });

export const reverifyWhitelistPaymentID = (slug, input) =>
  axios.put(`/whitelist/${slug}/upi_validator`, input);

export const whitelistedUpiList = () => axios.get("/whitelist/upi_list");

export const whitelistedCryptoList = () => axios.get("/whitelist/crypto_list");

export const whitelistToggle = (slug) =>
  axios.put(`/users/${slug}/toggle_whitelist`);

export const deleteWhitelist = (slug) => axios.delete(`whitelist/${slug}`);

export const referralSendReminder = (email) =>
  axios.post(`/referrals/notify`, {
    email: email,
  });

export const activeCodesList = () => axios.get("/activation_codes");

export const verifyGamerApi = (headers) =>
  axios.get(`/verify_gamer`, { headers });

export const getGameTotalbalance = () =>
  axios.get(`/users/play_wallet_balance`);

export const getAppLinks = (source) => axios.get(`/download_files/${source}`);

export const mobileNumSendOtp = (data) => axios.post(`/send_sms_otp`, data);

export const mobileNumVerifyOtp = (data) => axios.post(`/verify_sms`, data);
export const getTournaments = () => axios.get("/tournaments");

export const socialLogin = ({ provider, token, email }) =>
  axios.post(
    "/social_login",
    { provider, source: "web", email },
    { headers: { Authorization: token } }
  );

export const offlinePaymentsDetails = () =>
  axios.get("/payments/offline_payments/details");

export const offlinePaymentsConvert = (amount) =>
  axios.get(`/payments/offline_payments/approx_usd?amount=${amount}`);

// export const offlinePaymentsSubmit = (amount, txid, upi_id) =>
//   axios.post(`/payments/offline_payments`, {
//     params: {
//       amount: amount,
//       txid: txid,
//       upi_id: upi_id,
//     },
//   });

export const offlinePaymentsSubmit = (props) =>
  axios.post("/payments/offline_payments", { ...props });

export const offlinePaymentsCancel = (deposit_slug) =>
  axios.post(`/payments/offline_payments/cancel?deposit_slug=${deposit_slug}`);
// Spin the Wheel methods

export const getSpinWheelEventList = () => axios.get("/spin_wheel_events");

export const getRewardListBySpinEvent = ({ event_id }) =>
  axios.get(`spin_wheel_events/${event_id}/spin_wheel_rewards`);

export const getPrizeBySpinEvent = ({ event_id }) =>
  axios.post(`spin_wheel_events/${event_id}/spin_wheel_users`);

export const getUserRewardListBySpinEvent = () => axios.get(`spin_wheel_users`);

// export const transferNFTApi = (input) =>
//   axios.post(`/nfts/external_transfer`, input);

export const treasureList = (slug) =>
  axios.get(`/treasures/${slug}/user_treasures`);

export const treasureClaim = (slug, claim_slug) =>
  axios.put(`treasures/${claim_slug}/user_treasures/${slug}`);

export const getGameWallet = (wallet_type) =>
  axios.put(`/users/game_wallet`, {
    wallet_type: wallet_type,
  });
