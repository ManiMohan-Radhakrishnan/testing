import indiggMarketplaceAxios from "./axios-utils-indigg-marketplace";
import { getCookies } from "../utils/cookies";
import { ParamsSerialize } from "../utils/params-serialize";

const auth_token = getCookies();

export const userAssignGuildNFTsApi = (page, filter) =>
  indiggMarketplaceAxios.get(`/guild_nft/assigned?page=${page}`, {
    params: {
      filter,
    },
    paramsSerializer: (params) => {
      return ParamsSerialize(params);
    },
  });

export const userUnAssignGuildNFTsApi = (page, filter) =>
  indiggMarketplaceAxios.get(`/guild_nft/unassigned?page=${page}`, {
    params: {
      filter,
    },
    paramsSerializer: (params) => {
      return ParamsSerialize(params);
    },
  });

export const userValidateUser = (props) =>
  indiggMarketplaceAxios.post("/guild_nft/validate_user", { ...props });

export const assignNftapi = (userNft, data) =>
  indiggMarketplaceAxios.post(`/guild/${userNft}/assign_nft`, {
    ...data,
  });
export const getNftUser = (slug) =>
  indiggMarketplaceAxios.get(`/guild/${slug}/nft_user`);

export const revokeNftapi = (userNft) =>
  indiggMarketplaceAxios.post(`/guild/${userNft}/remove_nft`);

export const cancelNftapi = (nftId) =>
  indiggMarketplaceAxios.post(`/guild/${nftId}/cancel_nft`);
