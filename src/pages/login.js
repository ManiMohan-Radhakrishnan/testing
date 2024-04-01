import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router";

import Header2 from "./../components/header2";
import LoginComponent from "./../components/login";
import { useQuery } from "../hooks/url-params";
import { setCookiesByName } from "../utils/cookies";
import { toast } from "react-toastify";

const Login = () => {
  const location = useLocation();
  const query = useQuery(location.search);

  useEffect(() => {
    const fsz = query.get("fsz");
    const guild_source = query.get("guild_source");
    const { state } = location;
    state?.toastMessage && toast.info(state?.toastMessage);

    if (fsz) {
      setCookiesByName("fsz", fsz);
    }
    if (guild_source) {
      setCookiesByName("guild_source", guild_source);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet>
        <title>Jump.trade - Sign In</title>
        <meta
          name="description"
          content="Kickstart your dream NFT  with just a twofold process:  Enter your credentials and Sign in"
        />
        <meta property="og:title" content="Jump.trade - Sign In" />
        <meta
          property="og:description"
          content="Kickstart your dream NFT  with just a twofold process:  Enter your credentials and Sign in"
        />
        <meta name="twitter:title" content="Jump.trade - Sign In" />
        <meta
          name="twitter:description"
          content="Kickstart your dream NFT  with just a twofold process:  Enter your credentials and Sign in"
        />
      </Helmet>
      <Header2 />
      <LoginComponent />
    </>
  );
};

export default Login;
