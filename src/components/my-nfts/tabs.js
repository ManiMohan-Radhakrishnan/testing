import React, { useCallback, useMemo, useState } from "react";
import AvailableNFT from "./available-nft";
import FavNFT from "./fav-nft";
import OnsaleNFT from "./onsale-nft";
import RentedNFT from "./rented-nft";
import "./styles.scss";
import BurnBatNft from "./burn-bat-nft";

export const Tabs = ({ hideMenus }) => {
  const [count, setCount] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const availableNft = useCallback(() => {
    return (
      <AvailableNFT
        setCount={setCount}
        setActiveTab={setActiveTab}
        hideMenus={hideMenus}
      />
    );
  }, [activeTab, hideMenus]);

  const onsaleNFT = useCallback(() => {
    return <OnsaleNFT setCount={setCount} />;
  }, [activeTab]);

  const rentedNFT = useCallback(() => {
    return (
      <RentedNFT
        setCount={setCount}
        setActiveTab={setActiveTab}
        hideMenus={hideMenus}
      />
    );
  }, [activeTab, hideMenus]);

  const favNFT = useCallback(() => {
    return <FavNFT setCount={setCount} />;
  }, [activeTab]);

  const burnBatNFT = useCallback(() => {
    return <BurnBatNft setCount={setCount} hideMenus={hideMenus} />;
  }, [activeTab]);

  const tabs = [
    { label: "All", component: availableNft },
    { label: "Sale", component: onsaleNFT },
    { label: "Rented Out", component: rentedNFT },
    { label: "Favorites", component: favNFT },
    // Burn Crypto Bat hidden
    { label: "Burn Crypto Bat", component: burnBatNFT },
  ];

  const changeTab = (index) => {
    if (index !== activeTab) setCount(0);
    setActiveTab(index);
  };

  const TabContent = tabs[activeTab].component;

  return (
    <div className="tabs">
      <ul className="tab-list">
        {tabs?.map((tab, index) =>
          hideMenus ? (
            ![1, 3].includes(index) && (
              <li className="nav-item" key={tab?.label}>
                <span
                  className={`nav-link ${activeTab === index ? "active" : ""}`}
                  key={tab?.label}
                  onClick={() => changeTab(index)}
                >
                  {tab?.label}{" "}
                  {activeTab === index && count !== 0 && <span>({count})</span>}
                </span>
              </li>
            )
          ) : (
            <li className="nav-item" key={tab?.label}>
              <span
                className={`nav-link ${activeTab === index ? "active" : ""}`}
                key={tab?.label}
                onClick={() => changeTab(index)}
              >
                {tab?.label}{" "}
                {activeTab === index && count !== 0 && <span>({count})</span>}
              </span>
            </li>
          )
        )}
      </ul>
      <div className="mynft-tab-content">
        <TabContent setActiveTab={setActiveTab} hideMenus={hideMenus} />
      </div>
    </div>
  );
};
