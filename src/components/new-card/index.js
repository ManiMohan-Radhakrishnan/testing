// import React, { useState } from "react";
// import Select from "react-select";
// import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
// import { toast } from "react-toastify";

// import {
//   CardField,
//   crispStyle,
//   validateEmail,
//   validateName,
//   validateNameReplace,
//   validInternationalPhone,
// } from "../../utils/common";
// import InputText from "./../input-text";
// import countries from "../../utils/countries.json";
// import { attachCardApi } from "./../../api/methods";
// import InputPhone from "./../input-phone";

// import "./style.scss";

// const NewCardForm = ({ handleHide, trigger, setTrigger }) => {
//   const stripe = useStripe();
//   const elements = useElements();

//   const [error, setError] = useState(null);
//   const [cardComplete, setCardComplete] = useState(false);
//   const [billing, setBilling] = useState({
//     email: null,
//     name: null,
//     phone_code: null,
//     phone: null,
//     city: null,
//     country: null,
//     address_line1: null,
//     address_line2: null,
//     postal_code: null,
//     state: null,
//   });

//   const [loading, setLoading] = useState(false);

//   const [validation, setValidation] = useState({
//     card: false,
//     name: false,
//     email: false,
//     phone: false,
//   });

//   const handleChangeEvent = (e) => {
//     if (e.target.value) {
//       if (e.target.name === "name") {
//         if (validateName(e.target.value)) {
//           setBilling({
//             ...billing,
//             [e.target.name]: validateNameReplace(e.target.value),
//           });

//           setValidation({ ...validation, [e.target.name]: false });
//         }
//       } else {
//         setBilling({ ...billing, [e.target.name]: e.target.value });
//         setValidation({ ...validation, [e.target.name]: false });
//       }
//     } else {
//       setBilling({ ...billing, [e.target.name]: e.target.value });
//       setValidation({ ...validation, [e.target.name]: true });
//     }
//   };

//   const checkValidation = () => {
//     let c_validation = { ...validation };

//     if (!cardComplete) {
//       c_validation = { ...c_validation, card: true };
//     } else {
//       c_validation = { ...c_validation, card: false };
//     }

//     if (!billing.name) {
//       c_validation = { ...c_validation, name: true };
//     } else {
//       c_validation = { ...c_validation, name: false };
//     }

//     if (billing.phone) {
//       if (validInternationalPhone(billing.phone, billing.phone_code)) {
//         c_validation = { ...c_validation, phone: false };
//       } else {
//         c_validation = { ...c_validation, phone: true };
//       }
//     } else {
//       c_validation = { ...c_validation, phone: false };
//     }

//     if (billing.email) {
//       if (validateEmail(billing.email)) {
//         c_validation = { ...c_validation, email: false };
//       } else {
//         c_validation = { ...c_validation, email: true };
//       }
//     } else {
//       c_validation = { ...c_validation, email: false };
//     }

//     console.log(
//       "🚀 ~ file: index.js ~ line 101 ~ checkValidation ~ c_validation",
//       c_validation
//     );
//     setValidation(c_validation);
//     if (
//       !c_validation.name &&
//       !c_validation.email &&
//       !c_validation.phone &&
//       !c_validation.card
//     ) {
//       return true;
//     } else {
//       return false;
//     }
//   };

//   const handleSubmit = async () => {
//     setError(null);
//     if (checkValidation()) {
//       try {
//         setLoading(true);
//         const payload = await stripe.createPaymentMethod({
//           type: "card",
//           card: elements.getElement(CardElement),
//           billing_details: {
//             address: {
//               city: billing.city,
//               country: billing.country,
//               line1: billing.address_line1,
//               line2: billing.address_line2,
//               postal_code: billing.postal_code,
//               state: billing.state,
//             },
//             email: billing?.email,
//             name: billing?.name,
//             phone: billing?.phone,
//           },
//         });

//         if (payload?.error) {
//           setError(payload?.error.message);
//           console.log(
//             "🚀 ~ file: index.js ~ line 93 ~ handleSubmit ~ payload?.error.message",
//             payload?.error.message
//           );
//           setLoading(false);
//           return false;
//         }

//         await attachCardApi(payload.paymentMethod.id);

//         toast.success(
//           "We've successfully added your card. Now, you can fund your wallet with your newly added card. "
//         );
//         setLoading(false);
//         handleHide(false);
//         setTrigger(!trigger);
//       } catch (error) {
//         if (error.status === 406) {
//           toast.error(
//             "Your card is declined. Please check if your card has online and/or international transactions enabled. Contact your bank for more details."
//           );
//         } else {
//           toast.error("An unexpected error occured. Please try again  later");
//         }

//         console.error(error);
//         setLoading(false);
//       }
//     }
//   };

//   return (
//     <div className="new-card-container">
//       <div className="row">
//         <div className="col-12">
//           <div className="mb-2">
//             <CardField
//               title="Card Number"
//               required={validation.card}
//               onChange={(e) => {
//                 setValidation({ ...validation, card: !e.complete });
//                 setCardComplete(e.complete);
//               }}
//             />
//           </div>
//         </div>

//         <div className="col-12">
//           <div className="mb-2 mt-4">
//             <h6 className="dnc-title">Billing Details</h6>
//           </div>
//         </div>

//         <div className="col-12">
//           <div className="mb-2">
//             <InputText
//               title="Cardholder Name"
//               value={billing.name}
//               required={validation.name}
//               name="name"
//               onChange={handleChangeEvent}
//             />
//           </div>
//         </div>

//         <div className="col-12">
//           <div className="mb-2">
//             <InputText
//               title="Address Line 1"
//               value={billing.address_line1}
//               name="address_line1"
//               onChange={handleChangeEvent}
//             />
//           </div>
//         </div>

//         <div className="col-12">
//           <div className="mb-2">
//             <InputText
//               title="Address Line 2"
//               value={billing.address_line2}
//               name="address_line2"
//               onChange={handleChangeEvent}
//             />
//           </div>
//         </div>

//         <div className="col-6">
//           <div className="mb-2">
//             <label className="input-title">Country</label>
//             <Select
//               options={countries.map((o) => ({
//                 label: o.name,
//                 value: o.code2,
//               }))}
//               value={
//                 billing.country && {
//                   label: countries.find((o) => o.code2 === billing.country)
//                     .name,
//                   value: billing.country,
//                 }
//               }
//               styles={crispStyle}
//               onChange={(data) => {
//                 setBilling({ ...billing, country: data.value, state: null });
//               }}
//             />
//           </div>
//         </div>

//         <div className="col-6">
//           <div className="mb-2">
//             <label className="input-title">State</label>
//             <Select
//               styles={crispStyle}
//               value={
//                 billing.state && {
//                   label: countries
//                     .find((o) => o.code2 === billing.country)
//                     .states.find((o) => o.code === billing.state).name,
//                   value: billing.state,
//                 }
//               }
//               options={
//                 billing.country &&
//                 countries
//                   .find((o) => o.code2 === billing.country)
//                   .states.map((o) => ({
//                     label: o.name,
//                     value: o.code,
//                   }))
//               }
//               onChange={(data) => {
//                 setBilling({ ...billing, state: data.value });
//               }}
//             />
//           </div>
//         </div>

//         <div className="col-6">
//           <div className="mb-2">
//             <InputText
//               title="City"
//               value={billing.city}
//               name="city"
//               onChange={handleChangeEvent}
//             />
//           </div>
//         </div>

//         <div className="col-6">
//           <div className="mb-2">
//             <InputText
//               title="Postalcode"
//               value={billing.postal_code}
//               name="postal_code"
//               onChange={handleChangeEvent}
//             />
//           </div>
//         </div>

//         <div className="col-12">
//           <div className="mb-2">
//             <InputPhone
//               title="Phone"
//               className="phone-style"
//               value={billing.phone}
//               onChange={(e, c_code) => {
//                 setBilling({
//                   ...billing,
//                   phone: e,
//                   phone_code: c_code.countryCode.toUpperCase(),
//                 });
//               }}
//             />
//             {validation.phone && (
//               <label className="text-danger">
//                 Please enter valid phone number
//               </label>
//             )}
//           </div>
//         </div>

//         <div className="col-12">
//           <div className="mb-2">
//             <InputText
//               title="Email"
//               value={billing.email}
//               name="email"
//               onChange={handleChangeEvent}
//             />
//             {validation.email && (
//               <label className="text-danger">Please enter valid email</label>
//             )}
//           </div>
//         </div>

//         {error && (
//           <div className="col-12 mt-2">
//             <label className="text-danger">{error}</label>
//           </div>
//         )}

//         <div className="col-12 mt-2">
//           <button
//             disabled={loading}
//             className="btn btn-dark w-100 dnc-btn"
//             type="button"
//             onClick={handleSubmit}
//           >
//             {loading ? "Adding card, please wait..." : "Submit"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewCardForm;
