/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { useSelector } from "react-redux";

import { useRouteMatch } from "react-router";

import nonftfound from "../../images/nonftfound.svg";
import "./styles.scss";

const GuildNoPermission = () => {
  const { user } = useSelector((state) => state.user.data);
  const indigg_user_state = useSelector(
    (state) => state?.user?.indigg_data?.data?.guild_menu
  );
  const match = useRouteMatch();
  const { page } = match.params;
  const currentPage = page ? page : "profile";

  return (
    <>
        <div className="nonft_found">
          <div className="nodata-card">
            <img src={nonftfound} height="90" alt="" />
            <h4>
              You have no permission
            </h4>
          </div>
        </div>
    </>
  );
};

export default GuildNoPermission;
