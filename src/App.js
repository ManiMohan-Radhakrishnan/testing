import React, { Suspense, lazy, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
  useLocation,
} from "react-router-dom";
import { useSelector, connect, useDispatch } from "react-redux";
import { change_lang_action } from "./redux/actions/lang_action";
import { setLanguage } from "react-multi-lang";
import dayjs from "dayjs";
import { FaTimes } from "react-icons/fa";
import mixpanel from "mixpanel-browser";
import { getCookies, setCookies, setCookiesByName } from "./utils/cookies";
import { getServerTimeApi } from "./api/methods";
import {
  user_load_by_token_thunk,
  user_logout_thunk,
  verify_gamer_thunk,
} from "./redux/thunk/user_thunk";
import { useQuery } from "./hooks/url-params";
import { getAbsoluteURLParams } from "./utils/common";

import "./App.css";

const ForgotPassword = lazy(() => import("./pages/forgot-password"));
const NotFound = lazy(() => import("./pages/not-found"));
const Navigate = lazy(() => import("./pages/navigate"));
const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/register"));
const Confirmation = lazy(() => import("./pages/confirmation"));
const ResetPassword = lazy(() => import("./pages/reset-password"));
const Accounts = lazy(() => import("./pages/accounts"));
const RegisterSuccess = lazy(() => import("./pages/register-success"));

function App(props) {
  const params = useQuery(window.location.search);
  const dispatch = useDispatch();
  const [online, setOnline] = useState(true);
  const [diffTimer, setDiffTimer] = useState(false);
  const [diffTimerSeconds, setDiffTimerSeconds] = useState(0);

  const { lang, user } = useSelector((state) => state);
  const referralcode = params.get("referralcode");

  let hideMenus = params.get("hideMenus") === "true" ? true : false;

  setCookiesByName("hideMenus", hideMenus);

  useEffect(() => {
    props.change_lang(lang);
    setLanguage(lang);
    mixpanel.init("fb37da042db19dafef9b171500d64106", { debug: true });
  }, [props, lang]);

  const secondsToDhms = (info) => {
    let seconds = info > 0 ? info : -1 * info;

    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor((seconds % (3600 * 24)) / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = Math.floor(seconds % 60);

    var dDisplay = d > 0 ? d + (d === 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";

    var result =
      info > 0
        ? dDisplay + hDisplay + mDisplay + sDisplay
        : "-" + dDisplay + hDisplay + mDisplay + sDisplay;
    return result;
  };

  const checkSystemTimer = (input) => {
    const date1 = dayjs(input);
    console.log(
      "🚀 ~ file: App.js ~ line 45 ~ checkSystemTimer ~ date1",
      date1.format("DD MM YYYY HH:mm:ss")
    );

    const date2 = dayjs();
    console.log(
      "🚀 ~ file: App.js ~ line 48 ~ checkSystemTimer ~ date2",
      date2.format("DD MM YYYY HH:mm:ss")
    );

    let seconds = date2.diff(date1, "seconds");

    console.log("seconds: ", seconds);

    setDiffTimerSeconds(seconds);

    if (seconds >= 10 || seconds <= -10) {
      setDiffTimer(true);
    } else {
      setDiffTimer(false);
    }
  };

  const getServerTime = async () => {
    try {
      const result = await getServerTimeApi();
      checkSystemTimer(result.data.data.time);
    } catch (error) {
      console.log("🚀 ~ file: App.js ~ line 48 ~ getServerTime ~ error", error);
    }
  };

  useEffect(() => {
    if (params.get("token")) {
      setCookies(params.get("token"));
    }
    const token = getCookies();
    if (token) dispatch(user_load_by_token_thunk(token));

    if (user?.data?.user && !token) dispatch(user_logout_thunk());

    if (referralcode) {
      for (const [key, value] of params.entries()) {
        value && setCookiesByName(key, value);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.addEventListener("online", (event) => {
      setOnline(navigator.onLine);
    });
    window.addEventListener("offline", (event) => {
      setOnline(navigator.onLine);
    });
    getServerTime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!online && (
        <div className="offline-ribbon">
          <div className="first">
            You are offline, please check you internet connection
          </div>
          <div>
            <FaTimes onClick={() => setOnline(true)} role={"button"} />
          </div>
        </div>
      )}

      {diffTimer && (
        <div className="offline-ribbon">
          <div className="first">
            Your system time does not match with the Internet time (
            {secondsToDhms(diffTimerSeconds)} difference). Please sync your
            system time with the Internet time to have a flawless experience,
          </div>
          <div>
            <FaTimes onClick={() => setDiffTimer(false)} role={"button"} />
          </div>
        </div>
      )}

      <div className="top-loader"></div>
      <div className="whole-content">
        <Router basename="/">
          <Suspense fallback={PreLoader}>
            <Switch>
              <Route exact path="/forgot-password" component={ForgotPassword} />
              <Route exact path="/password" component={ResetPassword} />
              <Route
                exact
                path="/signup/success/:source?"
                component={RegisterSuccess}
              />
              <Route exact path="/signup/:source?" component={Register} />
              <Route exact path="/signin" component={Login} />
              <Route exact path="/confirmation" component={Confirmation} />
              <PrivateRoute exact path="/navigate" component={Navigate} />
              {user?.login ? (
                <PrivateRoute
                  exact
                  path="/accounts/:page?"
                  component={Accounts}
                />
              ) : (
                <AutoLoginRoute
                  exact
                  path="/accounts/:page?"
                  component={Accounts}
                />
              )}

              <Redirect exact to="/signin" />
              {/* <Route path="/not-found" component={Login} /> */}
              {/* <Route exact component={Login} /> */}
            </Switch>
          </Suspense>
        </Router>
      </div>
    </>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    change_lang: (input) => {
      dispatch(change_lang_action(input));
    },
  };
};

export default connect(null, mapDispatchToProps)(App);

const PrivateRoute = ({ component: Component, authed, ...rest }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const token = getCookies();

  useEffect(() => {
    if (!token) {
      dispatch(user_logout_thunk());
    }
  }, [dispatch, token]);

  return (
    <Route
      {...rest}
      render={(props) =>
        user.login ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/signin", state: { from: props.location } }}
          />
        )
      }
    />
  );
};

const PreLoader = () => (
  <div className="flone-preloader-wrapper">
    <div className="flone-preloader">
      <span></span>
      <span></span>
    </div>
  </div>
);

const AutoLoginRoute = ({ component: Component, ...rest }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const handleFailureRedirect = (message = "") => {
    dispatch(user_logout_thunk());
    history.push("/signin", {
      from: location.pathname,
      toastMessage: message,
    });
  };

  const handleAutoLogin = async () => {
    let gameToken = getAbsoluteURLParams("t", location.search);
    let rentalToken = getAbsoluteURLParams("token", location.search);
    let token = getCookies();
    if (token) {
      dispatch(user_load_by_token_thunk(token));
      return;
    }
    if (!gameToken && !rentalToken) {
      handleFailureRedirect("");
      return;
    }
    if (gameToken)
      dispatch(
        verify_gamer_thunk({
          data: { "game-signature": gameToken },
          callback: dispatchAutoLoginCallback,
        })
      );
    else if (rentalToken) dispatch(user_load_by_token_thunk(rentalToken));
  };

  const dispatchAutoLoginCallback = (response) => {
    if (response?.status === 200) {
      setIsUserLoggedIn(true);
      history.push(location.pathname);
    } else
      handleFailureRedirect(
        response?.data?.data?.message ||
          "Something went wrong. Please try again later."
      );
  };

  useEffect(() => {
    handleAutoLogin();
  }, [dispatch]);

  return !isUserLoggedIn ? (
    <PreLoader />
  ) : (
    <Route {...rest} render={(props) => <Component {...props} />} />
  );
};
