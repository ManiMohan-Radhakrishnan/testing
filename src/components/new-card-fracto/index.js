import React, { useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import CreditCardInput from "react-credit-card-input";

import {
  crispStyle,
  validateEmail,
  validateName,
  validateNameReplace,
  validInternationalPhone,
} from "../../utils/common";
import InputText from "./../input-text";
import countries from "../../utils/countries.json";
import { addCardFractoApi, trackIP } from "./../../api/methods";
import InputPhone from "./../input-phone";

import "./style.scss";

const NewCardForm = ({ handleHide, trigger, setTrigger }) => {
  const [card, set_card] = useState({ number: "", exp: "", cvv: "" });

  const [cardValid, setCardValid] = useState({
    number: false,
    exp: false,
    cvv: false,
  });
  const [error, setError] = useState(null);
  const [billing, setBilling] = useState({
    email: null,
    first_name: null,
    last_name: null,
    phone_code: null,
    phone: null,
    city: null,
    country: null,
    address_line1: null,
    address_line2: null,
    postal_code: null,
    state: null,
  });

  const [loading, setLoading] = useState(false);

  const [validation, setValidation] = useState({
    card_number: false,
    card_exp: false,
    card_cvv: false,
    first_name: false,
    last_name: false,
    city: false,
    country: false,
    address_line1: false,
    address_line2: false,
    postal_code: false,
    state: false,
    email: false,
    phone: false,
  });

  const handleChangeEvent = (e) => {
    if (e.target.value) {
      if (e.target.name === "first_name" || e.target.name === "last_name") {
        if (validateName(e.target.value)) {
          setBilling({
            ...billing,
            [e.target.name]: validateNameReplace(e.target.value),
          });

          setValidation({ ...validation, [e.target.name]: false });
        }
      } else {
        setBilling({ ...billing, [e.target.name]: e.target.value });
        setValidation({ ...validation, [e.target.name]: false });
      }
    } else {
      setBilling({ ...billing, [e.target.name]: e.target.value });
      setValidation({ ...validation, [e.target.name]: true });
    }
  };

  const checkValidation = () => {
    let c_validation = { ...validation };

    if (card.number) {
      if (cardValid.number) {
        c_validation = { ...c_validation, card_number: false };
      } else {
        c_validation = { ...c_validation, card_number: true };
      }
    } else {
      c_validation = { ...c_validation, card_number: true };
    }

    if (card.exp) {
      if (cardValid.exp) {
        c_validation = { ...c_validation, card_exp: false };
      } else {
        c_validation = { ...c_validation, card_exp: true };
      }
    } else {
      c_validation = { ...c_validation, card_exp: true };
    }

    if (card.cvv) {
      if (cardValid.cvv) {
        c_validation = { ...c_validation, card_cvv: false };
      } else {
        c_validation = { ...c_validation, card_cvv: true };
      }
    } else {
      c_validation = { ...c_validation, card_cvv: true };
    }

    if (!billing.first_name) {
      c_validation = { ...c_validation, first_name: true };
    } else {
      c_validation = { ...c_validation, first_name: false };
    }

    if (!billing.last_name) {
      c_validation = { ...c_validation, last_name: true };
    } else {
      c_validation = { ...c_validation, last_name: false };
    }

    if (!billing.address_line1) {
      c_validation = { ...c_validation, address_line1: true };
    } else {
      c_validation = { ...c_validation, address_line1: false };
    }

    // if (!billing.address_line2) {
    //   c_validation = { ...c_validation, address_line2: true };
    // } else {
    //   c_validation = { ...c_validation, address_line2: false };
    // }

    if (!billing.city) {
      c_validation = { ...c_validation, city: true };
    } else {
      c_validation = { ...c_validation, city: false };
    }

    if (!billing.country) {
      c_validation = { ...c_validation, country: true };
    } else {
      c_validation = { ...c_validation, country: false };
    }

    if (!billing.postal_code) {
      c_validation = { ...c_validation, postal_code: true };
    } else {
      c_validation = { ...c_validation, postal_code: false };
    }

    if (billing.phone) {
      if (validInternationalPhone(billing.phone, billing.phone_code)) {
        c_validation = { ...c_validation, phone: false };
      } else {
        c_validation = { ...c_validation, phone: true };
      }
    } else {
      c_validation = { ...c_validation, phone: true };
    }

    if (billing.email) {
      if (validateEmail(billing.email)) {
        c_validation = { ...c_validation, email: false };
      } else {
        c_validation = { ...c_validation, email: true };
      }
    } else {
      c_validation = { ...c_validation, email: true };
    }

    setValidation(c_validation);
    if (
      !c_validation.card_number &&
      !c_validation.card_exp &&
      !c_validation.card_cvv &&
      !c_validation.first_name &&
      !c_validation.last_name &&
      !c_validation.address_line1 &&
      // !c_validation.address_line2 &&
      !c_validation.city &&
      !c_validation.country &&
      !c_validation.postal_code &&
      !c_validation.email &&
      !c_validation.phone &&
      !c_validation.card
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleSubmit = async () => {
    setError(null);
    if (checkValidation()) {
      try {
        setLoading(true);

        const result = await addCardFractoApi({
          first_name: billing?.first_name,
          last_name: billing?.last_name,
          email: billing?.email,
          address1: billing?.address_line1,
          address2: billing?.address_line2,
          city: billing?.city,
          state: billing?.state,
          zip: billing?.postal_code,
          country: billing?.country,
          ccnumber: card.number.replace(/ /g, ""),
          ccexp: card.exp.replace(/ /g, ""),
          cvv: card.cvv,
        });
        console.log(
          "🚀 ~ file: index.js ~ line 147 ~ handleSubmit ~ result",
          result
        );

        toast.success(
          "We've successfully added your card. Now, you can fund your wallet with your newly added card. "
        );
        setLoading(false);
        handleHide(false);
        setTrigger(!trigger);
      } catch (error) {
        if (error.status === 406) {
          toast.error(
            "Your card is declined. Please check if your card has online and/or international transactions enabled. Contact your bank for more details."
          );
        } else {
          toast.error("An unexpected error occured. Please try again  later");
        }

        console.error(error);
        setLoading(false);
      }
    }
  };

  return (
    <div className="new-card-container">
      <div className="row">
        <div className="col-12">
          <div className="mb-2">
            <CreditCardInput
              onError={({ inputName }) => {
                console.log(
                  "🚀 ~ file: index.js ~ line 289 ~ NewCardForm ~ inputName",
                  inputName
                );
                if (inputName === "cardNumber") {
                  setCardValid({ ...cardValid, number: false });
                } else if (inputName === "cardExpiry") {
                  setCardValid({ ...cardValid, exp: false });
                } else if (inputName === "cardCVC") {
                  setCardValid({ ...cardValid, cvv: false });
                }
              }}
              cardNumberInputProps={{
                value: card.number,
                onChange: (value) => {
                  set_card({ ...card, number: value.target.value });
                  setCardValid({ ...cardValid, number: true });
                },
              }}
              cardExpiryInputProps={{
                value: card.exp,
                onChange: (value) => {
                  set_card({ ...card, exp: value.target.value });
                  setCardValid({ ...cardValid, exp: true });
                },
              }}
              cardCVCInputProps={{
                value: card.cvv,
                onChange: (value) => {
                  set_card({ ...card, cvv: value.target.value });
                  setCardValid({ ...cardValid, cvv: true });
                },
              }}
              fieldClassName="input border"
            />
            {(validation.card_number ||
              validation.card_exp ||
              validation.card_cvv) && (
              <label className="text-danger">
                Please enter valid card details
              </label>
            )}
          </div>
        </div>

        <div className="col-12">
          <div className="mb-2 mt-4">
            <h6 className="dnc-title">Billing Details</h6>
          </div>
        </div>

        <div className="col-12">
          <div className="mb-2">
            <InputText
              title="Cardholder First Name"
              value={billing.first_name}
              required={validation.first_name}
              name="first_name"
              onChange={handleChangeEvent}
            />
          </div>
        </div>

        <div className="col-12">
          <div className="mb-2">
            <InputText
              title="Cardholder Last Name"
              value={billing.last_name}
              required={validation.last_name}
              name="last_name"
              onChange={handleChangeEvent}
            />
          </div>
        </div>

        <div className="col-12">
          <div className="mb-2">
            <InputText
              title="Address Line 1"
              value={billing.address_line1}
              required={validation.address_line1}
              name="address_line1"
              onChange={handleChangeEvent}
            />
          </div>
        </div>

        <div className="col-12">
          <div className="mb-2">
            <InputText
              title="Address Line 2"
              value={billing.address_line2}
              // required={validation.address_line2}
              name="address_line2"
              onChange={handleChangeEvent}
            />
          </div>
        </div>

        <div className="col-6">
          <div className="mb-2">
            <label className="input-title">Country</label>{" "}
            {validation.country && (
              <small className="text-danger font-10">(Required)</small>
            )}
            <Select
              isDisabled={!billing.address_line1}
              options={countries.map((o) => ({
                label: o.name,
                value: o.code2,
              }))}
              value={
                billing.country && {
                  label: countries.find((o) => o.code2 === billing.country)
                    .name,
                  value: billing.country,
                }
              }
              styles={crispStyle}
              onChange={(data) => {
                setBilling({ ...billing, country: data.value, state: null });
                if (data.value) {
                  setValidation({ ...validation, country: false });
                } else {
                  setValidation({ ...validation, country: true });
                }
              }}
            />
          </div>
        </div>

        <div className="col-6">
          <div className="mb-2">
            <label className="input-title">State</label>{" "}
            <Select
              isDisabled={!billing.country}
              styles={crispStyle}
              value={
                billing.state && {
                  label: countries
                    .find((o) => o.code2 === billing.country)
                    .states.find((o) => o.code === billing.state).name,
                  value: billing.state,
                }
              }
              options={
                billing.country &&
                countries
                  .find((o) => o.code2 === billing.country)
                  .states.map((o) => ({
                    label: o.name,
                    value: o.code,
                  }))
              }
              onChange={(data) => {
                setBilling({ ...billing, state: data.value });
                if (data.value) {
                  setValidation({ ...validation, state: false });
                } else {
                  setValidation({ ...validation, state: true });
                }
              }}
            />
          </div>
        </div>

        <div className="col-6">
          <div className="mb-2">
            <InputText
              title="City"
              value={billing.city}
              required={validation.city}
              name="city"
              onChange={handleChangeEvent}
            />
          </div>
        </div>

        <div className="col-6">
          <div className="mb-2">
            <InputText
              title="Postalcode"
              value={billing.postal_code}
              required={validation.postal_code}
              name="postal_code"
              onChange={handleChangeEvent}
            />
          </div>
        </div>

        <div className="col-12">
          <div className="mb-2">
            <InputPhone
              title="Phone"
              className="phone-style"
              value={billing.phone}
              required={validation.phone}
              onChange={(e, c_code) => {
                setBilling({
                  ...billing,
                  phone: e,
                  phone_code: c_code.countryCode.toUpperCase(),
                });
              }}
            />
            {validation.phone && (
              <label className="text-danger">
                Please enter valid phone number
              </label>
            )}
          </div>
        </div>

        <div className="col-12">
          <div className="mb-2">
            <InputText
              title="Email"
              value={billing.email}
              required={validation.email}
              name="email"
              onChange={handleChangeEvent}
            />
            {validation.email && (
              <label className="text-danger">Please enter valid email</label>
            )}
          </div>
        </div>

        {error && (
          <div className="col-12 mt-2">
            <label className="text-danger">{error}</label>
          </div>
        )}

        <div className="col-12 mt-2">
          <button
            disabled={loading}
            className="btn btn-dark w-100 dnc-btn"
            type="button"
            onClick={handleSubmit}
          >
            {loading ? "Adding card, please wait..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewCardForm;
