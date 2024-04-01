import { useState } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { useHistory } from "react-router-dom";

import {
  mfaDetailsApi,
  whitelistedCryptoList,
  whitelistedUpiList,
} from "../../../api/methods";
import useEffectOnce from "../../../hooks/useEffectOnce";

import Loader from "./loader";

const FeatureStatusCard = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [features, setFeatures] = useState({});
  const [upiVerified, setUpiVerified] = useState();

  const getFeatureStatus = async () => {
    let featuresObj = {};
    try {
      setLoading(true);
      let result = await mfaDetailsApi();
      featuresObj.mfa_enabled = result?.data?.data?.enabled;
      result = await whitelistedUpiList();
      result?.data?.data?.payment_methods[0]?.upi_verified &&
        setUpiVerified(result?.data?.data?.payment_methods[0]?.upi_verified);
      featuresObj.upi_whitelisted =
        result?.data?.data?.payment_methods?.length === 1;
      result = await whitelistedCryptoList();
      let payment_methods = result?.data?.data?.payment_methods || {};
      let limit = result?.data?.data?.limit;
      featuresObj.crypto_whitelisted = Object.entries(payment_methods).every(
        ([_, value = []]) => value?.length === limit
      );
      setFeatures(featuresObj);
    } catch (error) {
      console.error("Error in fetching feature status", error);
    } finally {
      setLoading(false);
    }
  };

  useEffectOnce(getFeatureStatus);
  return (
    <article className="grid-card">
      <div className="card-box  featureStatus-card">
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="card-header">
              <h4>Feature status </h4>
            </div>
            <div className="card-body">
              <ul className="featureStatus-list">
                <li>
                  <h6>Multi-Factor Authentication</h6>
                  {features?.mfa_enabled ? (
                    <BsCheckCircleFill fill="#27a723" />
                  ) : (
                    <a
                      className="btn btn-dark min-unset"
                      onClick={() => history.push("/accounts/settings")}
                    >
                      Enable
                    </a>
                  )}
                </li>
                <li>
                  <h6>UPI ID Whitelisted</h6>
                  {features?.upi_whitelisted && upiVerified ? (
                    <BsCheckCircleFill fill="#27a723" />
                  ) : (
                    <a
                      className="btn btn-dark min-unset"
                      onClick={() => history.push("/accounts/whitelist")}
                    >
                      {features?.upi_whitelisted && !upiVerified
                        ? "Reverify"
                        : "Add"}
                    </a>
                  )}
                </li>
                <li>
                  <h6>Crypto Wallet Address</h6>
                  {features?.crypto_whitelisted ? (
                    <BsCheckCircleFill fill="#27a723" />
                  ) : (
                    <a
                      className="btn btn-dark min-unset"
                      onClick={() => history.push("/accounts/whitelist")}
                    >
                      Add
                    </a>
                  )}
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </article>
  );
};

export default FeatureStatusCard;
