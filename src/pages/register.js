import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useHistory, useLocation } from "react-router";

import Header2 from "./../components/header2";
import RegisterComponent from "./../components/register";
import { useQuery } from "../hooks/url-params";
import { setCookiesByName } from "../utils/cookies";

const Register = () => {
  const location = useLocation();
  const query = useQuery(location.search);
  const history = useHistory();

  useEffect(() => {
    const fsz = query.get("fsz");
    const guild_source = query.get("guild_source");

    if (fsz) {
      setCookiesByName("fsz", fsz);
    }
    if (guild_source) {
      setCookiesByName("guild_source", guild_source);
      history.push("/signup");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Helmet>
        <title>Jump.trade - Sign Up</title>
        <meta
          name="description"
          content="Are you a first-time visitor? Sign-up with Jump.trade and become a part of the NFT revolution in the sub-continent."
        />
        <meta property="og:title" content="Jump.trade - Sign Up" />
        <meta
          property="og:description"
          content="Are you a first-time visitor? Sign-up with Jump.trade and become a part of the NFT revolution in the sub-continent."
        />
        <meta name="twitter:title" content="Jump.trade - Sign Up" />
        <meta
          name="twitter:description"
          content="Are you a first-time visitor? Sign-up with Jump.trade and become a part of the NFT revolution in the sub-continent."
        />

        <script
          src={`https://pixel.whistle.mobi/initialize_pixel.js?v=${Date.now()}`}
          type="text/javascript"
        />
      </Helmet>
      <Header2 />
      <RegisterComponent />
    </>
  );
};

export default Register;
