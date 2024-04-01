import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router";
import { Link } from "react-router-dom";

import { confimationApi } from "./../api/methods";
import { useQuery } from "./../hooks/url-params";
import Wrapper from "../components/wrapper";
import Header2 from "../components/header2";

const Confirmation = () => {
  const query = useQuery(useLocation().search);

  const history = useHistory();
  const [seconds, setSeconds] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    status: false,
    code: 0,
  });

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleConfirmation = async () => {
      try {
        setLoading(true);
        const result = await confimationApi(query.get("confirmation_token"));

        if (result.status === 200) {
          setSuccess(true);
        }

        setLoading(false);
      } catch (err) {
        setError({
          status: true,
          code: err?.status,
        });

        setLoading(false);
      }
    };

    handleConfirmation();
  }, [query]);

  useEffect(() => {
    if (success) {
      let myInterval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else {
          history.push("/signin");
        }
      }, 1000);

      return () => {
        clearInterval(myInterval);
      };
    }
  }, [seconds, success, history]);

  return (
    <>
      <Header2 />
      <Wrapper>
        {loading && (
          <div className="bl_form_box  pt-5 pb-5">
            <h4>Confirming... please wait...</h4>
          </div>
        )}

        {!loading && success && (
          <div className="bl_form_box  pt-5 pb-5">
            <h4>Confirmation</h4>
            <p className="mb-4">
              Account verified successfully please{" "}
              <Link to="/signin"> login </Link> to continue
            </p>
            <p className="bl_redirect">
              Redirecting to login page in <span>{seconds}</span> seconds
            </p>
          </div>
        )}

        {!loading && error?.status && (
          <>
            {(() => {
              if (error?.code === 406) {
                return (
                  <div className="bl_form_box  pt-5 pb-5">
                    <h4>Already Confirmed</h4>
                    <p className="mb-4">
                      Email was already confirmed, continue to{" "}
                      <Link to="/signin"> Login </Link>
                    </p>
                  </div>
                );
              } else if (error?.code === 422) {
                return (
                  <div className="bl_form_box  pt-5 pb-5">
                    <h4>Confirmation token is invalid</h4>
                  </div>
                );
              } else {
                return (
                  <div className="bl_form_box  pt-5 pb-5">
                    <h4>
                      An unexpected error occured. Please try again after
                      sometimes{" "}
                    </h4>
                  </div>
                );
              }
            })()}
          </>
        )}
      </Wrapper>
    </>
  );
};

export default Confirmation;
