import React, { useEffect, useState } from "react";
import "./style.scss";
import {
  guilddashboard,
  guildDashboardTopScholars,
} from "../../../api/methods";
import dayjs from "dayjs";
import { DatePicker, Radio } from "antd";
import "antd/dist/antd.css";
import { currencyFormat } from "../../../utils/common";
import utCoin from "../../../images/coin.png";
import dogeCoin from "../../../images/dogecoin.png";
import { FaUserFriends } from "react-icons/fa";

const { RangePicker } = DatePicker;

const DashBoardIndigg = () => {
  const initialfilterdates = {
    start_date: "",
    end_date: "",
    limit: 10,
  };

  const initialdashboardstate = {
    dashboard: {
      scholars: 0,
      game_reward_balances: {},
      game_reward_usd_balances: {},
    },
  };

  const initialtopscholars = {};
  // state
  const [rLoading, setRLoading] = useState(false);
  const [dashboardLoader, setDashboardLoader] = useState(false);
  const [datadash, setDatadash] = useState(initialdashboardstate);
  const [dashtopscholars, setDashtopscholars] = useState(initialtopscholars);
  const [apidate, setApidata] = useState(initialfilterdates);
  const today = new Date();
  const prior30Date = new Date(new Date().setDate(today.getDate() - 30));

  // api method
  const dashboardapicall = async () => {
    try {
      setDashboardLoader(true);
      const dashboardata = await guilddashboard();
      setDatadash(dashboardata?.data?.data?.dashboard);
      setDashboardLoader(false);
    } catch (error) {
      setDashboardLoader(false);
      console.log("this is the error message", error);
    }
  };
  const dashboardTopscholars = async (datetobesent) => {
    try {
      setRLoading(true);
      const dashboardtopdata = await guildDashboardTopScholars(datetobesent);
      setDashtopscholars(dashboardtopdata?.data?.data);
      setApidata(datetobesent);
      setRLoading(false);
    } catch (error) {
      setRLoading(false);
      console.log("this is the error message", error?.response?.data?.message);
    }
  };
  const handleDateChange = (value) => {
    if (value) {
      const standardate = { ...apidate };
      standardate.start_date = dayjs(value?.[0]?._d).format("YYYY-MM-D");
      standardate.end_date = dayjs(value?.[1]?._d).format("YYYY-MM-D");

      dashboardTopscholars(standardate);
    } else {
      initialDashboardData();
    }
  };

  const initialDashboardData = async () => {
    const standardate = { ...apidate };
    standardate.start_date = dayjs(prior30Date).format("YYYY-MM-D");
    standardate.end_date = dayjs(today).format("YYYY-MM-D");
    dashboardapicall();
    dashboardTopscholars(standardate);
  };

  // use effect
  useEffect(() => {
    initialDashboardData();
  }, []);

  return (
    <div className="main-content-block dashboard-mainblock">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 ipad-col-9.5">
            <div className="dashboard-page">
              <h2 className="heading">Dashboard</h2>
              {!dashboardLoader ? (
                <div className="dashBoard ">
                  <div className="item one">
                    <span>
                      <FaUserFriends />
                      SCHOLARS
                    </span>
                    <h2>{datadash?.scholars}</h2>
                  </div>

                  {datadash &&
                    datadash?.game_reward_balances &&
                    Object.keys(datadash?.game_reward_balances).length > 0 &&
                    Object.keys(datadash?.game_reward_balances).map(
                      (key, index) => (
                        <div className="item " key={index}>
                          <span>
                            <img
                              src={`${key === "DOGE" ? dogeCoin : utCoin}`}
                            />{" "}
                            {`${key}`}
                          </span>
                          <h2>{datadash?.game_reward_balances?.[key]?.amt}</h2>
                          <h6>
                            {key === "DOGE" && "~"} USD{" "}
                            <b>
                              {
                                datadash?.game_reward_balances?.[key]
                                  ?.amt_in_usd
                              }
                            </b>
                          </h6>
                          {/* <b>
                            {" "}
                            {`  ${currencyFormat(
                              datadash?.game_reward_balances?.[key]?.amt_in_usd,
                              "USD"
                            )}
                                    `}{" "}
                          </b>{" "} */}
                        </div>
                      )
                    )}
                </div>
              ) : (
                <div className="display-f">
                  <p className="loading-text">Loading</p>
                  <span className="dot-flashing"></span>
                </div>
              )}
              <div className="dashboard-table-section">
                <div className="dashboard-table-header-section d-flex w-100 align-center justify-content-between">
                  <div className="table-header-dashboard">Top 10 Scholars</div>

                  <div className="dashboard-filter-dropdown">
                    <RangePicker
                      onChange={(value) => handleDateChange(value)}
                      placement="bottomLeft"
                      popupClassName="popup-rangepicker"
                      status="warning"
                      className="topscholar-datepicker"
                    />
                  </div>
                </div>
                <div className="dashboard-table-section-block">
                  {rLoading ? (
                    <div className="display-f">
                      <p className="loading-text">Loading</p>
                      <span className="dot-flashing"></span>
                    </div>
                  ) : !dashtopscholars?.users?.length > 0 ? (
                    <p className="loading-text">No Scholars Found!</p>
                  ) : (
                    <table className="dashboard-table">
                      <thead>
                        <tr>
                          <th className="slno">SL NO</th>
                          <th className="name">Name</th>
                          <th className="email">Email ID</th>

                          <th className="jt table-text-right">
                            JT Points Earned
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashtopscholars?.users?.map((obj, i) => {
                          return (
                            <tr key={i} className="table-content-section">
                              <td>{i + 1}</td>
                              <td>{obj?.full_name}</td>
                              <td>{obj?.email}</td>

                              <td className="table-text-right">
                                {Math.round(obj?.total_points)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoardIndigg;
