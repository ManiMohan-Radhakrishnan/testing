import nftAxios from "./axios-utils-nft";

export const getTotalOwn = () => nftAxios.get(`/users/total_own`);

export const userFavNFTsApi = (page) =>
  nftAxios.get(`/users/faved?page=${page}`);

export const userOwnedNFTsApi = (page, onlyAuction) =>
  nftAxios.get(`/users/owned?page=${page}&parent=${onlyAuction}`);

export const userActiveBidNFTsApi = (page) =>
  nftAxios.get(`/users/active_bids?page=${page}`);

export const userOverBidNFTsApi = (page) =>
  nftAxios.get(`/users/over_bids?page=${page}`);
  
