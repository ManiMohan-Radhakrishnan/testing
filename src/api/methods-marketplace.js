import { ParamsSerialize } from "../utils/params-serialize";
import marketplaceAxios from "./axios-utils-marketplace";

export const userOwnedNFTsApi = (page, filter, fusor_id) =>
  marketplaceAxios.get(`/users/owned?page=${page}`, {
    params: {
      filter,
      time: new Date().getTime(),
      fusor_id,
    },
    paramsSerializer: (params) => {
      return ParamsSerialize(params);
    },
  });

export const userFavNFTsApi = (page, game_name) =>
  marketplaceAxios.get(`/users/faved`, {
    params: {
      page,
      game_name,
    },
    paramsSerializer: (params) => {
      return ParamsSerialize(params);
    },
  });

export const userActiveBidNFTsApi = (page) =>
  marketplaceAxios.get(`/users/active_bids?page=${page}`);

export const userOverBidNFTsApi = (page) =>
  marketplaceAxios.get(`/users/over_bids?page=${page}`);

export const userActivityYieldsApi = (page) =>
  marketplaceAxios.get(`/users/yield_histories?page=${page}`);

export const userNFTInvoiceApi = (slug) =>
  marketplaceAxios.get(`/users/order_invoice?order_detail_slug=${slug}`);

export const userBuyOrdersApi = (page, type) =>
  marketplaceAxios.get(`/users/buy_orders?page=${page}`, {
    params: {
      type,
      size: "5",
    },
    paramsSerializer: (params) => {
      return ParamsSerialize(params);
    },
  });

export const userSellOrdersApi = (page, type) =>
  marketplaceAxios.get(`/users/sell_orders?page=${page}`, {
    params: {
      type,
      size: "5",
    },
    paramsSerializer: (params) => {
      return ParamsSerialize(params);
    },
  });

export const getCartListApi = () =>
  marketplaceAxios.get(`/carts/cart_line_items`);

export const upgradableCardsApi = () =>
  marketplaceAxios.get("/users/owned_upgradable_cards");

export const upgradableNFTsApi = (page, upgradable_card, filter) =>
  marketplaceAxios.get(`/users/nfts_with_upgrades?page=${page}`, {
    params: {
      upgradable_card,
      filter,
    },
    paramsSerializer: (params) => {
      return ParamsSerialize(params);
    },
  });

export const upgradableCost = (slug) =>
  marketplaceAxios.get(`/nfts/${slug}/upgradable_stats`);

export const upgradeNFTWithPayment = (slug, payment_type) =>
  marketplaceAxios.post(`/nfts/${slug}/upgrade_nft`, {
    payment_type,
  });

export const getUpgradesApi = (page, filter) =>
  marketplaceAxios.get(`/nft_upgrades?page=${page}`, {
    params: {
      filter,
      size: "5",
    },
    paramsSerializer: (params) => {
      return ParamsSerialize(params);
    },
  });

export const nftUpgradeInvoiceApi = (slug) =>
  marketplaceAxios.get(`/nft_upgrades/${slug}`);

export const upgradableNFTsApiFilter = (page, filter) =>
  marketplaceAxios.get(`/users/nfts_with_upgrades?page=${page}`, {
    params: {
      filter,
    },
    paramsSerializer: (params) => {
      return ParamsSerialize(params);
    },
  });

export const upgradableCardLogs = (page) =>
  marketplaceAxios.get(`/upgradable_card_logs?page=${page}`, {
    params: {
      size: "20",
    },
    paramsSerializer: (params) => {
      return ParamsSerialize(params);
    },
  });

export const primaryInvoices = (page) =>
  marketplaceAxios.get(`/primary_purchases?page=${page}`, {
    params: {
      size: "5",
    },
    paramsSerializer: (params) => {
      return ParamsSerialize(params);
    },
  });

export const primaryInvoicesApi = (slug) =>
  marketplaceAxios.get(`/primary_purchases/${slug}`);

export const getLimitOrdersApi = () => marketplaceAxios.get(`/limit_orders`);

export const createLimitOrderApi = (props) =>
  marketplaceAxios.post("/limit_orders", {
    limit_order: { ...props },
  });

export const deleteLimitOrderApi = (slug) =>
  marketplaceAxios.delete(`/limit_orders/${slug}`);

export const updateLimitOrderApi = (slug, input) =>
  marketplaceAxios.put(`/limit_orders/${slug}`, {
    limit_order: { ...input },
  });

export const enableLimitOrderApi = (slug) =>
  marketplaceAxios.patch(`/limit_orders/${slug}/enable`);

export const disableLimitOrderApi = (slug) =>
  marketplaceAxios.patch(`/limit_orders/${slug}/disable`);

export const upgradableCardLogsData = (page, tournamentfilter) =>
  marketplaceAxios.get(
    `/upgradable_card_logs/${tournamentfilter}?page=${page}`
  );

export const upgradableCardLogsDatapage = (page, tournamentfilter) =>
  marketplaceAxios.get(
    `/upgradable_card_logs/${tournamentfilter}/page=${page}`,
    {
      params: {
        tournamentfilter,
      },
      paramsSerializer: (params) => {
        return ParamsSerialize(params);
      },
    }
  );

export const userAssignGuildNFTsApi = (page, filter) =>
  marketplaceAxios.get(`/guild/assigned?page=${page}`, {
    params: {
      filter,
    },
    paramsSerializer: (params) => {
      return ParamsSerialize(params);
    },
  });
export const userUnAssignGuildNFTsApi = (page, filter) =>
  marketplaceAxios.get(`/guild/unassigned?page=${page}`, {
    params: {
      filter,
    },
    paramsSerializer: (params) => {
      return ParamsSerialize(params);
    },
  });

export const getPrebookedNftList = () =>
  marketplaceAxios.get(`/preorder_summaries`);

export const getPrebookedListLogs = (slug) =>
  marketplaceAxios.get(`/preorder_summaries/${slug}`);

export const userDownloadInvoiceApi = (slug) =>
  marketplaceAxios.get(
    `/users/download_order_invoice?order_detail_slug=${slug}`,
    {
      responseType: "arraybuffer",
    }
  );

export const PrimaryInvoiceDownloadApi = (slug) =>
  marketplaceAxios.get(`/users/download_primary_invoice?slug=${slug}`, {
    responseType: "arraybuffer",
  });

export const getPendingAssigneeList = (slug) =>
  marketplaceAxios.get(`guild/${slug}/pending`);

export const promoteNFT = (slug) =>
  marketplaceAxios.post(`/nfts/${slug}/promote`);

export const allowOrRevokeRental = (slug, allow_rent) =>
  marketplaceAxios.post(`/nfts/${slug}/allow_rental`, { allow_rent });

// export const userRentedNFTsApi = (page, filter) =>
//   marketplaceAxios.get(`/users/rented?page=${page}`, {
//     params: {
//       filter,
//       time: new Date().getTime(),
//     },
//   });

export const getNFTForRent = () =>
  marketplaceAxios.post("/nfts/rent_request", {
    nft: { nft_collection: "", nft_category: "" },
  });

export const allowForRental = (props) =>
  marketplaceAxios.post("/rents/allow_rental", { ...props });

export const userRentedNFTsApi = (page, filter) =>
  marketplaceAxios.get(`/users/rented?page=${page}`, {
    params: {
      filter,
      time: new Date().getTime(),
    },
    paramsSerializer: (params) => {
      return ParamsSerialize(params);
    },
  });

export const revokeRental = (props) =>
  marketplaceAxios.post("/rents/revoke_rental", { ...props });

export const getNFTRentDetails = (slug, page, size = 8) =>
  marketplaceAxios.get(`nfts/${slug}/rent_details?page=${page}`, {
    params: {
      size: size,
    },
    paramsSerializer: (params) => {
      return ParamsSerialize(params);
    },
  });

export const getNFTUserRevenues = (slug) =>
  marketplaceAxios.get(`nfts/${slug}/users_revenues`);

export const nftDetailApi = ({ nft_slug }) =>
  marketplaceAxios.get(`/nfts/${nft_slug}`, {
    params: {
      time: new Date().getTime(),
    },
    paramsSerializer: (params) => {
      return ParamsSerialize(params);
    },
  });

export const transferNFTApi = (input) =>
  marketplaceAxios.post(`/nfts/external_transfer`, input);

export const getTransferNftMenu = () =>
  marketplaceAxios.get(`/users/drop_available`);

export const listBundleOnSale = (order) =>
  marketplaceAxios.post(`/orders/bundle`, { order });

export const nftsCountApi = () => marketplaceAxios.get(`/users/nfts_count`);

export const bundleSaleSplitApi = (
  buildingNftSlug,
  buildAmount,
  landNftSlug,
  landAmount
) =>
  marketplaceAxios.get(
    `orders/bundle_sale_split?order[bundle_nfts][${buildingNftSlug}]=${buildAmount}&order[bundle_nfts][${landNftSlug}]=${landAmount}`
  );
export const fuseNFTApi = (input) =>
  marketplaceAxios.post(`/nfts/fuse_nft`, input);

export const getFusorLogs = () =>
  marketplaceAxios.get(`/nfts/show_fusor_histories`);

export const batBurnApi = (slug, value) =>
  marketplaceAxios.post(`/nfts/${slug}/burn_nft`, value);

export const batBurnRequestCancel = (slug) =>
  marketplaceAxios.get(`/nfts/${slug}/revert_nft`);
