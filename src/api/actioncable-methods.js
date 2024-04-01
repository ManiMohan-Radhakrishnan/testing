import ActionCable from "actioncable";
import cable from "./actioncable-utils";

const marketplaceCable = ActionCable.createConsumer(
  process.env.REACT_APP_MARKETPLACE_SOCKET_URL
);

export const accountDetail = (slug, value) => {
  cable.subscriptions.create(
    { channel: "UserChannel", room: `account_${slug}` },
    {
      connected: () => {},
      received: (data) => {
        value(data);
      },
    }
  );
};

export const nftUpgradeCable = (slug, value) => {
  marketplaceCable.subscriptions.create(
    { channel: "NftChannel", room: `nft_upgrade_${slug}` },
    {
      connected: () => {
        console.log("BL/AC2:Connected");
      },
      received: (data) => {
        console.log("BL/AC2:Success");
        value(data);
      },
    }
  );
};
