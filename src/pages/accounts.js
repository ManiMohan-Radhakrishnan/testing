import React, { useEffect, useState } from "react";
import { useRouteMatch, Redirect, Route } from "react-router";
import { useSelector } from "react-redux";

import { guilUserMenuPermissions, guildPermissionApi } from "../api/methods";
import { useQuery } from "../hooks/url-params";

import DashboardWrapper from "../components/dashboard-wrapper";
import SideNav from "../components/side-nav";
import UserProfile from "../components/accounts/user-profile";
import MyInvoice from "../components/accounts/my-invoice";
import Wallet from "../components/accounts/wallet";
// import Wallet from "../components/accounts/wallet-new";
import UserActivity from "../components/accounts/user-activity";
import BidActivity from "../components/accounts/bid-activity";
import Settings from "../components/accounts/settings";
import Support from "../components/accounts/support";
import UserProfileView from "../components/accounts/user-profile-view";
import ClaimNFT from "./../components/accounts/claim-nft";
import MyOrders from "../components/accounts/my-orders";
// import PreOrders from "../components/accounts/pre-orders";
import MyCards from "../components/accounts/my-cards";
import LimitOrders from "../components/accounts/limit-orders";
import PlayNFTs from "../components/accounts/play-nfts";
import Referral from "../components/accounts/referral";
import ReferEarnInstruction from "../components/accounts/refer-earn-instruction";
import DashBoardIndigg from "../components/accounts/dash-board-indigg";
// import UserManagementProfile from "../components/accounts/user-management-profile";
import UserManagementSubAdmin from "../components/accounts/user-management-sub-admin";
import GameHistory from "../components/accounts/game-history";
import MyTransactions from "../components/accounts/my-transactions";
import IndiggProfile from "../components/accounts/indigg-profile";
import IndiggWallet from "../components/accounts/indigg-wallet";
import IndiggActivity from "../components/accounts/indigg-activity";
import PreBookedNFTs from "../components/accounts/pre-booked-nfts";
import Whitelist from "../components/accounts/white-list";
import GamePass from "../components/accounts/game-pass";
import MyNFTs from "../components/accounts/my-nfts";
import MyNFTsNew from "../components/accounts/my-nfts-new";
import MyRentedNFTs from "../components/accounts/my-rented-nfts";
import SpinWheel from "../components/accounts/spin-wheel";
import MyTransferNFT from "../components/accounts/my-transfer-nft";
import TreasureBox from "../pages/treasure-box";
import FusorLogs from "../components/accounts/fusorlog";

const Accounts = () => {
  const match = useRouteMatch();
  const { user } = useSelector((state) => state);
  const params = useQuery(window.location.search);
  const [menuList, setMenuList] = useState([]);
  const [guildUserMenuList, setGuildUserMenuList] = useState();
  const [guildInvite, setGuildInvite] = useState("");
  const [guildUserMenuPermissionList, setGuildUserMenuPermissionList] =
    useState();
  const [hideMenus, setHideMenus] = useState(false);
  const { page } = match.params;
  var currentPage = page ? page : "profile";

  // const [guildMenuStatus, setGuildMenuStatus] = useState(false);
  // console.log(user?.data?.user?.guild_enabled, "user");

  const pages = [
    "user",
    "profile",
    "mynft",
    "transfer-nft",
    "rented-nft",
    "my-cards",
    "play-nfts",
    "myinvoice",
    "user",
    "wallet",
    "whitelist",
    "user-activity",
    "claim",
    "bid-activity",
    "my-orders",
    "fusor-history",
    "limit-orders",
    "pre-orders",
    "game-pass",
    "settings",
    "support",
    "spin-wheel",
    "referral",
    "refer-earn-instruction",
    "dashboard",
    "user-management-sub-admin",
    // "user-management-profile",
    "game-history",
    "my-transactions",
    "guild-profile",
    "guild-mynft",
    "guild-wallet",
    "guild-activity",
    "treasure-box",
  ];

  if (!pages.includes(currentPage)) {
    window.open("/accounts", "_self");
  }
  const handleUserPermissionList = async () => {
    try {
      // setLoading(true);
      if (user?.data?.user?.guild_enabled) {
        const result = await guildPermissionApi();
        setGuildUserMenuPermissionList(result?.data?.data?.permissions);
        setGuildInvite(result?.data?.data?.guild_invite);
      }

      //setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  const handleUserGuildMenu = async () => {
    try {
      // setLoading(true);
      let Menus = [];
      if (user?.data?.user?.guild_enabled) {
        const result = await guilUserMenuPermissions();
        let response = result?.data?.data?.guild_menus;
        setGuildUserMenuList(response);

        if (response.find((v) => v?.name_key === "dashboard")) {
          Menus.push("dashboard");
        }
        if (response.find((v) => v?.name_key === "guildnft")) {
          Menus.push("guild-mynft");
        }
        // if (response.find((v) => v?.name_key === "user")) {
        //   Menus.push("user-management-profile");
        // }
        if (response.find((v) => v?.name_key === "guildrole")) {
          Menus.push("user-management-sub-admin");
        }
        if (response.find((v) => v?.name_key === "activity")) {
          Menus.push("guild-activity");
        }
      }
      setMenuList(Menus);

      //setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const getUserPermission = () => {
    handleUserPermissionList();
  };

  const handleMenuVisibility = () => {
    let hideMenus = params.get("hideMenus");
    setHideMenus(hideMenus === "true");
  };

  useEffect(() => {
    handleMenuVisibility();
    handleUserGuildMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const PrivateRoute = ({ component: Component, authed, ...rest }) => {
    return (
      <Route
        {...rest}
        render={(props) =>
          menuList?.indexOf(page) != -1 ? (
            <Component
              {...props}
              guildUserMenuPermissionList={guildUserMenuPermissionList}
            />
          ) : (
            <Redirect to={{ pathname: "/accounts" }} />
          )
        }
      />
    );
  };

  return (
    <>
      <DashboardWrapper hideHeader={hideMenus}>
        {!hideMenus && (
          <SideNav
            MenuList={menuList}
            guildUserMenuList={guildUserMenuList}
            getUserPermission={getUserPermission}
            guildInvite={guildInvite}
          />
        )}
        {currentPage === "spin-wheel" && <SpinWheel />}
        {currentPage === "profile" && <UserProfile />}
        {/* {currentPage === "mynft" && <MyNFTs />} */}
        {currentPage === "mynft" && <MyNFTsNew hideMenus={hideMenus} />}
        {currentPage === "transfer-nft" && <MyTransferNFT />}
        {currentPage === "rented-nft" && <MyRentedNFTs hideMenus={hideMenus} />}
        {currentPage === "my-cards" && <MyCards />}
        {currentPage === "play-nfts" && <PlayNFTs />}
        {currentPage === "myinvoice" && <MyInvoice />}
        {currentPage === "user" && <UserProfileView />}
        {currentPage === "wallet" && <Wallet />}
        {currentPage === "whitelist" && <Whitelist />}
        {currentPage === "user-activity" && <UserActivity />}
        {currentPage === "claim" && <ClaimNFT />}
        {currentPage === "bid-activity" && <BidActivity />}
        {currentPage === "my-orders" && <MyOrders />}
        {currentPage === "fusor-history" && <FusorLogs />}
        {currentPage === "limit-orders" && <LimitOrders />}
        {/* {currentPage === "pre-orders" && <PreOrders />} */}
        {currentPage === "settings" && <Settings />}
        {currentPage === "support" && <Support />}
        {currentPage === "referral" && <Referral />}
        {currentPage === "refer-earn-instruction" && <ReferEarnInstruction />}
        {currentPage === "dashboard" && (
          <PrivateRoute component={DashBoardIndigg} />
        )}

        {/* {currentPage === "user-management-profile" && (
          <PrivateRoute component={UserManagementProfile} />
        )} */}
        {currentPage === "user-management-sub-admin" && (
          <PrivateRoute component={UserManagementSubAdmin} />
        )}
        {currentPage === "game-history" && <GameHistory />}
        {currentPage === "my-transactions" && <MyTransactions />}

        {currentPage === "guild-profile" && (
          <PrivateRoute component={IndiggProfile} />
        )}
        {currentPage === "guild-mynft" && (
          <PrivateRoute component={IndiggProfile} />
        )}
        {currentPage === "guild-wallet" && (
          <PrivateRoute component={IndiggWallet} />
        )}
        {currentPage === "guild-activity" && (
          <PrivateRoute component={IndiggActivity} />
        )}
        {currentPage === "pre-orders" && <PreBookedNFTs />}
        {currentPage === "game-pass" && <GamePass />}
        {currentPage === "treasure-box" && <TreasureBox />}
      </DashboardWrapper>
    </>
  );
};

export default Accounts;
