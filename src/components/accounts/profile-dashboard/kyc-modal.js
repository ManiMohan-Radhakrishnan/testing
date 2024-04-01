import { useState } from "react";
import Select from "react-select";
import {
  Modal,
  ButtonGroup,
  ToggleButton as CustomToggle,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  getUserKycDetails,
  kycApi,
  kycExistingUserApi,
} from "../../../api/methods";
import { getCookies } from "../../../utils/cookies";
import countries from "../../../utils/countries.json";
import {
  crispStyle,
  EVENT_NAMES,
  invokeTrackEvent,
  validateNumber,
  validatePAN,
} from "../../../utils/common";
import { getUserInfo } from "../../../redux/reducers/user_reducer";
import { user_load_by_token_thunk } from "../../../redux/thunk/user_thunk";
import useEffectOnce from "../../../hooks/useEffectOnce";

import InputText from "../../input-text";

const initialKycInfo = Object.freeze({
  nationality: "IN",
  user_type: "individual",
  pan: "",
  document_number: "",
  tan: "",
  gst: "",
  line1: "",
  line2: "",
  country: "IN",
  state: "",
  city: "",
  pincode: "",
  id: "",
  havingGST: "no",
  agree: false,
  gstAgree: false,
  firstName: "",
  lastName: "",
});

const initialKycValidation = Object.freeze({
  pan: false,
  document_number: false,
  tan: false,
  gst: false,
  line1: false,
  line2: false,
  country: false,
  state: false,
  city: false,
  pincode: false,
  firstName: false,
  lastName: false,
  agree: false,
});

const KycModal = ({
  show,
  onHide = () => {},
  step,
  setStep,
  kycLoading = false,
  setKycLoading,
}) => {
  const dispatch = useDispatch();
  const user = useSelector(getUserInfo);
  const [kycDetails, setKycDetails] = useState(initialKycInfo);
  const [kycValidation, setKycValidation] = useState(initialKycValidation);
  const [panFormat, setPanFormat] = useState(false);
  const [error, setError] = useState("");

  const nationalityRadio = [
    { name: "INDIA", value: "IN" },
    { name: "OTHERS", value: "OTHERS" },
  ];

  const userTypeRadio = [
    { name: "INDIVIDUAL", value: "individual" },
    // { name: "BUSINESS", value: "business" },
  ];

  const countriesWithoutIndia = countries.filter(function (x) {
    return x.code2 !== "IN";
  });

  const countriesOnlyIndia = countries.filter(function (x) {
    return x.code2 === "IN";
  });

  const fetchUserKycDetails = async () => {
    try {
      setKycLoading(true);
      const result = await getUserKycDetails(user.slug);
      const kyc = result.data.data.kyc;

      if (kyc.kyc_status !== "success") {
        setKycDetails({
          nationality: "IN",
          user_type: kyc.user_type ? kyc.user_type : "individual",
          pan: kyc.pan,
          document_number: kyc.document_number,
          havingGST: kyc.gst ? "yes" : "no",
          gst: kyc.gst,
          tan: kyc.tan,
          line1: kyc.address?.line1,
          line2: kyc.address?.line2,
          city: kyc.address?.city,
          pincode: kyc.address?.pincode,
          firstName: kyc.address?.first_name,
          lastName: kyc.address?.last_name,
          id: kyc.address?.id,
        });
      } else {
        const token = getCookies();
        if (token) {
          dispatch(user_load_by_token_thunk(token));
        }
      }
      setKycLoading(false);
    } catch (error) {
      setKycLoading(false);
    }
  };

  const checkKycValidation = () => {
    let c_validation = { ...kycValidation };

    if (kycDetails.nationality === "IN" && !validatePAN(kycDetails.pan)) {
      c_validation = { ...c_validation, pan: true };
      setPanFormat(true);
      setError("Please enter correct PAN card details");
    } else c_validation = { ...c_validation, pan: false };

    if (kycDetails.user_type === "business" && !kycDetails.tan) {
      c_validation = { ...c_validation, tan: true };
    } else {
      c_validation = { ...c_validation, tan: false };
    }

    if (!kycDetails.line1) {
      c_validation = { ...c_validation, line1: true };
    } else {
      c_validation = { ...c_validation, line1: false };
    }

    if (!kycDetails.city) {
      c_validation = { ...c_validation, city: true };
    } else {
      c_validation = { ...c_validation, city: false };
    }

    if (!kycDetails.country) {
      c_validation = { ...c_validation, country: true };
    } else {
      c_validation = { ...c_validation, country: false };
    }
    if (kycDetails.nationality !== "IN") {
      if (!kycDetails.document_number) {
        c_validation = { ...c_validation, document_number: true };
      } else {
        c_validation = { ...c_validation, document_number: false };
      }
    }

    const states = kycDetails.country
      ? countries.find((o) => o.code2 === kycDetails.country).states
      : [];

    if (
      kycDetails.nationality === "IN" &&
      !kycDetails.state &&
      states.length > 0
    ) {
      c_validation = { ...c_validation, state: true };
    } else {
      c_validation = { ...c_validation, state: false };
    }

    if (!kycDetails.pincode) {
      c_validation = { ...c_validation, pincode: true };
    } else {
      c_validation = { ...c_validation, pincode: false };
    }

    if (!kycDetails.firstName) {
      c_validation = { ...c_validation, firstName: true };
    } else {
      c_validation = { ...c_validation, firstName: false };
    }

    if (!kycDetails.lastName) {
      c_validation = { ...c_validation, lastName: true };
    } else {
      c_validation = { ...c_validation, lastName: false };
    }

    if (!kycDetails.agree) {
      c_validation = { ...c_validation, agree: true };
    } else {
      c_validation = { ...c_validation, agree: false };
    }

    setKycValidation(c_validation);
    if (
      !c_validation.line1 &&
      !c_validation.pan &&
      !c_validation.document_number &&
      !c_validation.city &&
      !c_validation.country &&
      !c_validation.state &&
      !c_validation.pincode &&
      !c_validation.firstName &&
      !c_validation.lastName &&
      !c_validation.agree
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleKycChangeEvent = (e) => {
    if (e.target.value) {
      if (e.target.name === "pan") {
        if (e.target.value.length <= 10) {
          if (e.target.value) {
            setKycDetails({
              ...kycDetails,
              [e.target.name]: e.target.value.toUpperCase(),
            });
            setError("");
          }
        }
      } else if (e.target.name === "pincode") {
        if (kycDetails.nationality === "IN" && e.target.value) {
          if (e.target.value.length <= 6 && validateNumber(e.target.value)) {
            setKycDetails({
              ...kycDetails,
              [e.target.name]: e.target.value,
            });
            setError("");
          }
        } else {
          if (e.target.value) {
            setKycDetails({
              ...kycDetails,
              [e.target.name]: e.target.value,
            });
            setError("");
          }
        }
      } else {
        setKycDetails({ ...kycDetails, [e.target.name]: e.target.value });
        setKycValidation({ ...kycValidation, [e.target.name]: false });
      }
    } else {
      setKycDetails({ ...kycDetails, [e.target.name]: e.target.value });
      setKycValidation({ ...kycValidation, [e.target.name]: true });
    }
  };

  const handleKYC = async () => {
    if (checkKycValidation()) {
      try {
        setKycLoading(true);
        const kyc = {
          nationality:
            kycDetails?.nationality === "IN"
              ? kycDetails?.nationality
              : kycDetails?.country,
          user_type:
            kycDetails?.nationality === "IN" ? kycDetails?.user_type : "",
          pan: kycDetails?.nationality === "IN" ? kycDetails?.pan : "",
          document_number:
            kycDetails?.nationality !== "IN" ? kycDetails?.document_number : "",
          gst: kycDetails?.nationality === "IN" ? kycDetails?.gst : "",
          tan: kycDetails?.nationality === "IN" ? kycDetails?.tan : "",
          address_attributes: {
            first_name: kycDetails?.firstName,
            last_name: kycDetails?.lastName,
            line1: kycDetails?.line1,
            line2: kycDetails?.line2,
            country: kycDetails?.country,
            state: kycDetails?.state,
            city: kycDetails?.city,
            pincode: kycDetails?.pincode,
            id: kycDetails?.id,
          },
        };
        let result;
        if (user.kyc_status === "partially_verified") {
          result = await kycExistingUserApi(
            window.location.href,
            kyc,
            user.slug
          );
        } else {
          result = await kycApi(window.location.href, kyc);
        }

        // console.log("Kyc Details", JSON.stringify(result));

        if (result.data.data.kyc.kyc_status === "success") {
          invokeTrackEvent(EVENT_NAMES?.KYC_COMPLETED, {});
        }

        if (result.data.data.kyc.kyc_status !== "success") {
          invokeTrackEvent(EVENT_NAMES?.KYC_FAILED, {});
          if (result.data.data.kyc.verification_url) {
            kycDetails?.nationality === "IN"
              ? window.open(
                  `${result.data.data.kyc.verification_url}&exit_uri=${window.location.href}`,
                  "_self"
                )
              : window.open(result.data.data.kyc.verification_url, "_self");
          } else {
            toast.warn(
              "Unexpected error occured, please try again after sometimes"
            );
          }
        }
        setKycLoading(false);
        onHide();
      } catch (error) {
        if (error?.status === 400)
          toast.error("Account already exists for the entered PAN.");
        setKycLoading(false);
      }
    }
  };

  useEffectOnce(fetchUserKycDetails);

  return (
    <Modal show={show} size="lg" onHide={onHide} backdrop={"static"}>
      <Modal.Header closeButton>
        <Modal.Title>Start your identity check</Modal.Title>
      </Modal.Header>
      <Modal.Body className="card-modal edit-profile-pop">
        <div className="row">
          {step === "step1" && (
            <>
              <article className="kyc-step-1">
                <p>Select your country of citizenship</p>
                <ButtonGroup>
                  {nationalityRadio.map((nationality, idx) => (
                    <CustomToggle
                      className="btn btn-dark-secondary"
                      key={idx}
                      id={`nationality-${idx}`}
                      type="radio"
                      variant="outline-dark"
                      name="nationality"
                      value={nationality.value}
                      checked={kycDetails.nationality === nationality.value}
                      onChange={(e) =>
                        setKycDetails({
                          ...kycDetails,
                          ...initialKycInfo,
                          nationality: e.currentTarget.value,
                          country: e.currentTarget.value === "IN" ? "IN" : "",
                        })
                      }
                    >
                      {nationality.name}
                    </CustomToggle>
                  ))}
                </ButtonGroup>
              </article>
            </>
          )}

          {step === "step2" && (
            <>
              <article className="kyc-step-2">
                {/* <p>Select your account type</p> */}
                <ButtonGroup className="mb-2 userTypeRadio">
                  {userTypeRadio.map((userType, idx) => (
                    <CustomToggle
                      key={idx}
                      id={`userType-${idx}`}
                      type="radio"
                      variant="outline-dark"
                      name="user_type"
                      value={userType.value}
                      checked={kycDetails.user_type === userType.value}
                      onChange={(e) =>
                        setKycDetails({
                          ...kycDetails,
                          user_type: e.currentTarget.value,
                        })
                      }
                    >
                      {userType.name}
                    </CustomToggle>
                  ))}
                </ButtonGroup>

                <article className="kyc-step-3">
                  <div className="row">
                    {step === "step2" && kycDetails.nationality === "IN" && (
                      <div className="col-12 mb-3">
                        <InputText
                          title={"PAN"}
                          className={"text-transform-uppercase"}
                          name="pan"
                          value={kycDetails.pan}
                          required={kycValidation.pan}
                          requiredBottom={kycValidation.pan}
                          onChange={handleKycChangeEvent}
                          tooltip={<span className="aster-des">*</span>}
                        />
                        {panFormat && <p className="error-message">{error}</p>}
                      </div>
                    )}

                    <div className="col-12 col-md-6 mb-3">
                      <label className="input-title">
                        Country&nbsp;<span className="aster-des">*</span>
                      </label>{" "}
                      {kycDetails.nationality === "IN" ? (
                        <Select
                          options={countriesOnlyIndia.map((o) => ({
                            label: o.name,
                            value: o.code2,
                          }))}
                          value={
                            kycDetails?.country && {
                              label: countriesOnlyIndia?.find(
                                (o) => o.code2 === kycDetails?.country
                              )?.name,
                              value: kycDetails.country,
                            }
                          }
                          styles={crispStyle}
                          onChange={(data) => {
                            setKycDetails({
                              ...kycDetails,
                              country: data.value,
                              state: null,
                            });
                            if (data.value) {
                              setKycValidation({
                                ...kycValidation,
                                country: false,
                              });
                            } else {
                              setKycValidation({
                                ...kycValidation,
                                country: true,
                              });
                            }
                          }}
                        />
                      ) : (
                        <Select
                          options={countriesWithoutIndia.map((o) => ({
                            label: o.name,
                            value: o.code2,
                          }))}
                          value={
                            kycDetails.country && {
                              label: countriesWithoutIndia.find(
                                (o) => o.code2 === kycDetails.country
                              ).name,
                              value: kycDetails.country,
                            }
                          }
                          styles={crispStyle}
                          onChange={(data) => {
                            setKycDetails({
                              ...kycDetails,
                              country: data.value,
                              state: null,
                            });
                            if (data.value) {
                              setKycValidation({
                                ...kycValidation,
                                country: false,
                              });
                            } else {
                              setKycValidation({
                                ...kycValidation,
                                country: true,
                              });
                            }
                          }}
                        />
                      )}
                      {kycValidation?.country && (
                        <small className="text-danger font-10">
                          (Required)
                        </small>
                      )}
                    </div>
                    <div className="col-12 col-md-6 mb-2">
                      <label className="input-title">
                        {kycDetails?.country === "IN" ? (
                          <>
                            State&nbsp;<span className="aster-des">*</span>
                          </>
                        ) : (
                          "State"
                        )}
                      </label>{" "}
                      <Select
                        isDisabled={!kycDetails.country}
                        styles={crispStyle}
                        value={
                          kycDetails.state && {
                            label: countries
                              .find((o) => o.code2 === kycDetails.country)
                              .states.find((o) => o.code === kycDetails.state)
                              ?.name,
                            value: kycDetails.state,
                          }
                        }
                        options={
                          kycDetails.country &&
                          countries
                            .find((o) => o.code2 === kycDetails.country)
                            .states.map((o) => ({
                              label: o.name,
                              value: o.code,
                            }))
                        }
                        onChange={(data) => {
                          setKycDetails({ ...kycDetails, state: data.value });
                          if (kycDetails.country === "IN" && !data.value)
                            setKycValidation({
                              ...kycValidation,
                              state: true,
                            });
                          else {
                            setKycValidation({
                              ...kycValidation,
                              state: false,
                            });
                          }
                        }}
                      />
                      {kycDetails.country === "IN" && kycValidation.state && (
                        <small className="text-danger font-10">
                          (Required)
                        </small>
                      )}
                    </div>
                    {kycDetails?.nationality !== "IN" && (
                      <div className="col-12 mb-3">
                        <InputText
                          title={"Document Number"}
                          className={"text-transform-uppercase"}
                          name="document_number"
                          value={kycDetails.document_number}
                          required={kycValidation.document_number}
                          requiredBottom={kycValidation.document_number}
                          onChange={handleKycChangeEvent}
                          tooltip={<span className="aster-des">*</span>}
                        />
                      </div>
                    )}
                    <div className="col-12 col-md-6 mb-2">
                      <InputText
                        title={"First Name"}
                        name="firstName"
                        value={kycDetails.firstName}
                        required={kycValidation.firstName}
                        requiredBottom={kycValidation.firstName}
                        onChange={handleKycChangeEvent}
                        tooltip={<span className="aster-des">*</span>}
                      />
                    </div>
                    <div className="col-12 col-md-6 mb-2">
                      <InputText
                        title={"Last Name"}
                        name="lastName"
                        value={kycDetails.lastName}
                        required={kycValidation.lastName}
                        requiredBottom={kycValidation.lastName}
                        onChange={handleKycChangeEvent}
                        tooltip={<span className="aster-des">*</span>}
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <InputText
                        title={"Address Line 1"}
                        name="line1"
                        value={kycDetails.line1}
                        required={kycValidation.line1}
                        requiredBottom={kycValidation.line1}
                        onChange={handleKycChangeEvent}
                        tooltip={<span className="aster-des">*</span>}
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <InputText
                        title="Address Line 2"
                        name="line2"
                        value={kycDetails.line2}
                        onChange={handleKycChangeEvent}
                      />
                    </div>
                    <div className="col-12 col-md-6 mb-2">
                      <InputText
                        title="City"
                        value={kycDetails.city}
                        required={kycValidation.city}
                        requiredBottom={kycValidation.city}
                        name="city"
                        onChange={handleKycChangeEvent}
                        tooltip={<span className="aster-des">*</span>}
                      />
                    </div>
                    <div className="col-12 col-md-6 mb-2">
                      <InputText
                        title="Pincode"
                        value={kycDetails.pincode}
                        required={kycValidation.pincode}
                        requiredBottom={kycValidation.pincode}
                        name="pincode"
                        onChange={handleKycChangeEvent}
                        tooltip={<span className="aster-des">*</span>}
                      />
                    </div>
                    <div className="col-12 mb-3 mt-3">
                      <div className="agree-box ">
                        <input
                          className={`agree ${
                            kycValidation.agree && "notSelect"
                          }`}
                          name="agree"
                          role={"button"}
                          type="checkbox"
                          checked={kycDetails.agree}
                          required={kycValidation.agree}
                          onChange={() =>
                            setKycDetails({
                              ...kycDetails,
                              agree: !kycDetails.agree,
                            })
                          }
                        />{" "}
                        By clicking the "Proceed" button, I hereby declare that
                        the information provided is true and correct.
                        <div>
                          {kycValidation.agree && (
                            <small className="text-danger font-10">
                              Please check declaration to proceed
                            </small>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </article>
            </>
          )}
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="modal-footer-btn-grp">
              {step !== "step1" && (
                <button
                  className="btn btn-dark-secondary" //btn-verify prev-btn
                  onClick={() => {
                    setStep("step1");
                  }}
                  type="button"
                >
                  Previous
                </button>
              )}
              <button
                disabled={(() => {
                  if (kycLoading) {
                    return true;
                  } else if (step === "step1" && !kycDetails.nationality) {
                    return true;
                  } else if (step === "step2" && !kycDetails.user_type) {
                    return true;
                  } else if (
                    step === "step2" &&
                    kycDetails?.nationality === "IN" &&
                    (kycDetails?.pan === null || kycDetails?.pan == "")
                  ) {
                    return true;
                  } else if (
                    step === "step2" &&
                    kycDetails?.nationality !== "IN" &&
                    kycDetails.document_number == ""
                  ) {
                    return true;
                  } else if (step === "step2" && (kycDetails?.firstName === undefined || kycDetails.firstName == "")) {
                    return true;
                  } else if (step === "step2" && (kycDetails?.lastName === undefined || kycDetails?.lastName == "")) {
                    return true;
                  } else if (step === "step2" && kycDetails?.country == "") {
                    return true;
                  } else if (step === "step2" && (kycDetails?.line1 === undefined || kycDetails?.line1 == "")) {
                    return true;
                    // } else if (step === "step2" && kycDetails?.line2 === undefined) {
                    //   return true;
                  } else if (step === "step2" && (kycDetails?.pincode === undefined || kycDetails?.pincode == "")) {
                    return true;
                  } else if (step === "step2" && (kycDetails?.city === undefined || kycDetails?.city == "")) {
                    return true;
                  } else if (step === "step2" && !kycDetails.agree) {
                    return true;
                  } else {
                    return false;
                  }
                })()}
                className="btn btn-dark"
                onClick={() => {
                  if (step === "step1") {
                    if (kycDetails.nationality === "OTHERS") {
                      setStep("step2");
                    } else {
                      setStep("step2");
                    }
                  } else if (step === "step2") {
                    handleKYC();
                  }
                }}
                type="button"
              >
                {(() => {
                  if (step === "step1") {
                    return "Next";
                  } else if (step === "step2") {
                    return kycLoading ? "Loading... Please wait..." : "Proceed";
                  } else if (step === "step2") {
                    return kycLoading ? "Loading... Please wait..." : "Proceed";
                  }
                })()}
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default KycModal;
