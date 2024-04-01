// import { CardElement } from "@stripe/react-stripe-js";
// import batsmanIcon from "../images/jump-trade/batsman_ico.png";
// import bowlerIcon from "../images/jump-trade/bowler_ico.png";
import dayjs from "dayjs";

import lvl001 from "../images/jump-trade/player_levels/1.png";
import lvl002 from "../images/jump-trade/player_levels/2.png";
import lvl003 from "../images/jump-trade/player_levels/3.png";
import lvl004 from "../images/jump-trade/player_levels/4.png";
import lvl005 from "../images/jump-trade/player_levels/5.png";
import lvl006 from "../images/jump-trade/player_levels/6.png";
import lvl007 from "../images/jump-trade/player_levels/7.png";
import lvl008 from "../images/jump-trade/player_levels/8.png";
import lvl009 from "../images/jump-trade/player_levels/9.png";
import lvl0010 from "../images/jump-trade/player_levels/10.png";
import lvl0011 from "../images/jump-trade/player_levels/11.png";
import lvl0012 from "../images/jump-trade/player_levels/12.png";
import lvl0013 from "../images/jump-trade/player_levels/13.png";
import lvl0014 from "../images/jump-trade/player_levels/14.png";
import lvl0015 from "../images/jump-trade/player_levels/15.png";

import hlvl001 from "../images/jump-trade/hurley-levels/1.png";
import hlvl002 from "../images/jump-trade/hurley-levels/2.png";
import hlvl003 from "../images/jump-trade/hurley-levels/3.png";
import hlvl004 from "../images/jump-trade/hurley-levels/4.png";
import hlvl005 from "../images/jump-trade/hurley-levels/5.png";
import hlvl006 from "../images/jump-trade/hurley-levels/6.png";
import hlvl007 from "../images/jump-trade/hurley-levels/7.png";
import hlvl008 from "../images/jump-trade/hurley-levels/8.png";
import hlvl009 from "../images/jump-trade/hurley-levels/9.png";
import hlvl0010 from "../images/jump-trade/hurley-levels/10.png";

import raddx_images from "./raddx-images.json";

import {
  isPossiblePhoneNumber,
  isValidPhoneNumber,
  validatePhoneNumberLength,
  findPhoneNumbersInText,
} from "libphonenumber-js";
import JSEncrypt from "jsencrypt";
import { useEffect } from "react";

export const validateName = (name) => {
  const re =
    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
  return re.test(name);
};

export const encryptMessage = (message) => {
  const publicKey = `-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtNua9prEkf+FXz0ODWRK\nBOHhz6p1Lf4+L/EvYVAIgK/poGvRKnesu6qxoRMax4JKPPyiwyxcmjxZaTQClTIm\nC4jONN+QQgO/kjr2zlC30iFY7agBXICHkSo45ysqaJWOe87ixAI1oFBhDiyoc6M7\nxkKs6IBGMJfhJ/koQ7cdWLuh0TiS7xc3C3nyPiVUmGZnTXIRIBc1GLb9ql5JOZv9\nHYBxeUA6ynCRkka0Lmix5a4LeYwKxhgMeAG2Jo55hhRYkdC5I8i05nkhnlC4NcAp\nm1EFA5LwHcpR/ozzBZvx5xpGxpUMfjamNabOnP7+96L6NWTHAeRD2RxcrNmOSQcM\ncwIDAQAB\n-----END PUBLIC KEY-----\n`;
  const jsEncrypt = new JSEncrypt();
  jsEncrypt.setPublicKey(publicKey);

  return jsEncrypt.encrypt(message);
};

export const validateNameReplace = (input) =>
  input
    .replace("  ", " ")
    .replace("--", "-")
    .replace(",,", ",")
    .replace("..", ".")
    .replace("''", "'")
    .replace("-,", "-")
    .replace("-.", "-")
    .replace("-'", "-")
    .replace(",-", ",")
    .replace(",.", ",")
    .replace(",'", ",")
    .replace(".-", ".")
    .replace(".,", ".")
    .replace(".'", ".")
    .replace("'-", "'")
    .replace("',", "'")
    .replace("'.", "'");

export const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validatePhone = (mobile) => {
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im; // eslint-disable-line
  return re.test(mobile);
};

export const validatePAN = (pan) => {
  const re = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/; // eslint-disable-line
  return re.test(pan);
};

export const alphaNumeric = (input) => {
  if (!input) return true;
  const re = /^[0-9a-zA-Z]+$/;
  return re.test(input);
};

export const validateGSTIN = (gst) => {
  const re = /^[a-zA-Z0-9]{0,15}$/; // eslint-disable-line
  return re.test(gst);
};

export const validateNumber = (value) => {
  const re = /^[1-9][0-9]*$/;
  return re.test(value);
};

export const validatePassword = (password) => {
  const re = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
  const sp_re = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  return re.test(password) || sp_re.test(password);
};

export const validateURL = (url) => {
  const re =
    /^http(s?):\/\/(www\.)?(((\w+(([\.\-]{1}([a-z]{2,})+)+)(\/[a-zA-Z0-9\_\=\?\&\.\#\-\W]*)*$)|(\w+((\.([a-z]{2,})+)+)(\:[0-9]{1,5}(\/[a-zA-Z0-9\_\=\?\&\.\#\-\W]*)*$)))|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}(([0-9]|([1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]+)+)(\/[a-zA-Z0-9\_\=\?\&\.\#\-\W]*)*)((\:[0-9]{1,5}(\/[a-zA-Z0-9\_\=\?\&\.\#\-\W]*)*$)*))$/; // eslint-disable-line
  // /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
  return re.test(url);
};

export const openWindow = (url) => {
  window.open(url, "_self");
};

export const openWindowBlank = (url) => {
  window.open(url, "_blank");
};

export const validateUpi = (upi) => {
  const re = /^[\w\.\-_]{3,}@[a-zA-Z]{3,}/;
  return re.test(upi);
};

export const formattedNumber = (value, digit = 2) => {
  value = parseFloat(value);
  return Number(value.toString().match(/^\d+(?:\.\d{0,2})?/));
};

export const validateCurrency = (value) => {
  // const re = /^(\d*)\.?(\d){0,10}$/;
  const re = /^\d*\.?\d{0,2}$/;
  return re.test(value);
};

export const validateCurrencyUpiPayment = (value) => {
  // const re = /^(\d*)\.?(\d){0,10}$/;
  // const re = /^\d*\.?\d{0,2}$/;
  const re = /^[1-9][0-9]*$/;
  return re.test(value);
};

export const isNumber = (evt) => {
  evt = evt ? evt : window.event;
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
};

export const passwordLength = 6;

// const CARD_OPTIONS = {
//   iconStyle: "solid",
//   style: {
//     base: {
//       iconColor: "#c4f0ff",
//       color: "#495057",
//       fontWeight: "600",
//       fontSize: ".9rem",
//       fontSmoothing: "antialiased",
//       ":-webkit-autofill": {
//         color: "#495057",
//       },
//       "::placeholder": {
//         color: "#495057",
//       },
//     },
//     invalid: {
//       iconColor: "#f46a6a",
//       color: "#f46a6a",
//     },
//   },
// };

export const CardField = ({ title, onChange, required }) => (
  <>
    <label>{title}</label>{" "}
    {required && <small className="text-danger font-10">(Required)</small>}
    <div
      className={`cardnumber_input bg-white p-2 rounded-3 border ${
        required ? "border-danger" : ""
      }`}
    >
      {/* <CardElement options={CARD_OPTIONS} onChange={onChange} /> */}
    </div>
  </>
);

export const crispStyle = {
  control: (prop) => ({
    ...prop,
    padding: "0 3px 0 8px",
    borderRadius: "3px",
    minHeight: "33px",
    fontSize: ".8rem",
    fontWeight: "bolder",
    borderColor: "#9c9c9b",
    "&:hover": {
      borderColor: "#9c9c9b",
    },
    "&:focus": {
      boxShadow: "0 0 0 0.25rem #0d6efd40",
    },
  }),
  input: (prop) => ({
    ...prop,
    margin: 0,
    padding: 0,
  }),
  valueContainer: (prop) => ({
    ...prop,
    margin: 0,
    padding: 0,
  }),
  singleValue: (styles, { data }) => ({
    ...styles,
    margin: 0,
    padding: 0,
    ...(data.color ? dot(data.color) : {}),
  }),

  dropdownIndicator: (prop) => ({
    ...prop,
    margin: 0,
    padding: "0 3px 0 0",
  }),
  indicatorsContainer: (prop) => ({
    ...prop,
    margin: 0,
    padding: 0,
  }),
  clearIndicator: (prop) => ({
    ...prop,
    margin: 0,
    padding: 0,
  }),
  indicatorSeparator: (prop) => ({
    ...prop,
    margin: "3px",
    padding: 0,
  }),
  noOptionsMessage: (prop) => ({
    ...prop,
    padding: 0,
    fontSize: "12px",
  }),
  option: (prop) => ({
    ...prop,
    padding: "8px",
    fontSize: "12px",
  }),
  menu: (prop) => ({
    ...prop,
    borderRadius: "3px",
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999, top: base.top - 5 }),
};

export const dot = (color = "#ccc") => ({
  alignItems: "center",
  display: "flex",

  ":before": {
    backgroundColor: color,
    borderRadius: 10,
    content: '" "',
    display: "block",
    marginRight: 8,
    height: 10,
    width: 10,
  },
});

export const validInternationalPhone = (input, country) => {
  return (
    isPossiblePhoneNumber(input, country) === true &&
    isValidPhoneNumber(input, country) === true &&
    validatePhoneNumberLength(input, country) === undefined
  );
};

export const validateInternationalPhoneV2 = (phoneNumberInfo = {}) => {
  let {
    phone_no = "",
    phone_no_format = "",
    phone_no_dial_code = "",
    formatted_phone_no = "",
  } = phoneNumberInfo;
  if (
    formatted_phone_no.length > 0 &&
    phone_no_format.length === formatted_phone_no.length &&
    (phone_no.startsWith(phone_no_dial_code) ||
      phone_no_dial_code.startsWith(phone_no))
  )
    return true;
  else return false;
};

export const currencyFormat = (value, type = "usd") => {
  let formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: type,
  });
  return formatter.format(parseFloat(value ? value : 0));
};

export const feeCharges = [
  { network: "binance", fee: 2, min: "10", max: 1000000 },
  { network: "matic", fee: 2, min: "10", max: 1000000 },
  { network: "ethereum", fee: 35, min: "36", max: 1000000 },
];

export const roundDown = (number, decimals) => {
  decimals = decimals || 0;
  return Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

export const roundDownValue = (value) => {
  let number = value;
  const FormattedNumber = Number(
    number?.toString().match(/^\d+(?:\.\d{0,2})?/)
  );
  return FormattedNumber;
};

export const withoutRound = (number, decimals = 2) => {
  number = parseFloat(number);
  return Number(number.toString().match(/^\d+(?:\.\d{0,2})?/));
};

export const calculateTimeLeft = (input, cInput) => {
  var offset = new Date().getTimezoneOffset();
  var input_utc = new Date(input);
  input_utc.setMinutes(input_utc.getMinutes() - offset);

  let difference;
  if (cInput) {
    var cInput_utc = new Date(cInput);
    cInput_utc.setMinutes(cInput_utc.getMinutes() - offset);

    difference = +new Date(input_utc) - +new Date(cInput_utc);
  } else {
    var cInput_utc_1 = new Date();
    cInput_utc_1.setMinutes(cInput_utc_1.getMinutes() - offset);

    difference = +new Date(input_utc) - +new Date(cInput_utc_1);
  }

  var cInput_utc_2 = new Date();
  cInput_utc_2.setMinutes(cInput_utc_2.getMinutes() - offset);

  difference = +new Date(input_utc) - +new Date(cInput_utc_2);

  let timeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0.1,
  };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

export const validateQuantity = (value) => {
  const re = /^[1-9][0-9]*$/;
  return re.test(value);
};

export const level = (value) => {
  const level = [
    {
      type: "1",
      name: "LVL 1",
      value: lvl001,
    },
    {
      type: "2",
      name: "LVL 2",
      value: lvl002,
    },
    {
      type: "3",
      name: "LVL 3",
      value: lvl003,
    },
    {
      type: "4",
      name: "LVL 4",
      value: lvl004,
    },
    {
      type: "5",
      name: "LVL 5",
      value: lvl005,
    },
    {
      type: "6",
      name: "LVL 6",
      value: lvl006,
    },
    {
      type: "7",
      name: "LVL 7",
      value: lvl007,
    },
    {
      type: "8",
      name: "LVL 8",
      value: lvl008,
    },
    {
      type: "9",
      name: "LVL 9",
      value: lvl009,
    },
    {
      type: "10",
      name: "LVL 10",
      value: lvl0010,
    },
    {
      type: "11",
      name: "LVL 11",
      value: lvl0011,
    },
    {
      type: "12",
      name: "LVL 12",
      value: lvl0012,
    },
    {
      type: "13",
      name: "LVL 13",
      value: lvl0013,
    },
    {
      type: "14",
      name: "LVL 14",
      value: lvl0014,
    },
    {
      type: "15",
      name: "LVL 15",
      value: lvl0015,
    },
  ];
  const levelData = level.find((obj) => obj.type === value);
  return levelData;
};

export const hurleyLevels = (data) => {
  const level = [
    {
      type: "1",
      name: "LVL 1",
      value: hlvl001,
    },
    {
      type: "2",
      name: "LVL 2",
      value: hlvl002,
    },
    {
      type: "3",
      name: "LVL 3",
      value: hlvl003,
    },
    {
      type: "4",
      name: "LVL 4",
      value: hlvl004,
    },
    {
      type: "5",
      name: "LVL 5",
      value: hlvl005,
    },
    {
      type: "6",
      name: "LVL 6",
      value: hlvl006,
    },
    {
      type: "7",
      name: "LVL 7",
      value: hlvl007,
    },
    {
      type: "8",
      name: "LVL 8",
      value: hlvl008,
    },
    {
      type: "9",
      name: "LVL 9",
      value: hlvl009,
    },
    {
      type: "10",
      name: "LVL 10",
      value: hlvl0010,
    },
  ];
  const hurleyLevelData = level.find((obj) => obj?.type === data);
  return hurleyLevelData;
};

export const role = (value, style) => {
  const role = [
    {
      type: "Batsman",
      name: "BATSMAN",
      style: "LH",
      value:
        "https://cdn.guardianlink.io/product-hotspot/images/jump/jump-trade/LH.png",
    },
    {
      type: "Batsman",
      name: "BATSMAN",
      style: "RH",
      value:
        "https://cdn.guardianlink.io/product-hotspot/images/jump/jump-trade/RH.png",
    },
    {
      type: "Bowler",
      name: "BOWLER",
      style: "LA",
      value:
        "https://cdn.guardianlink.io/product-hotspot/images/jump/jump-trade/LA.png",
    },
    {
      type: "Bowler",
      name: "BOWLER",
      style: "RA",
      value:
        "https://cdn.guardianlink.io/product-hotspot/images/jump/jump-trade/RA.png",
    },
    {
      type: "Bat",
      name: "BAT",
      style: "BAT",
      value:
        "https://cdn.guardianlink.io/product-hotspot/images/jump/jump-trade/BAT.png",
    },
    {
      type: "Fielder",
      name: "FIELDER",
      style: "Fielder",
      value:
        "https://cdn.guardianlink.io/product-hotspot/images/jumptrade/mcl_fieldingicon.png",
    },
  ];
  const roleData = role.find(
    (obj) => obj.type === value && obj.style === style
  );
  return roleData;
};

export const playerCategory = (value) => {
  const playerCategory = [
    {
      type: "ROOKIE",
      value: "RO",
      color: "#3b56ff",
    },
    {
      type: "RARE",
      value: "RA",
      color: "#f58220",
    },
    {
      type: "EPIC",
      value: "EP",
      color: "#9e6cef",
    },
    {
      type: "LEGEND",
      value: "LG",
      color: "linear-gradient(202deg, #e2ff00, #18e0e0, #e8318d)",
    },
    {
      type: "ULTRA LEGEND",
      value: "UL",
      color: "linear-gradient(202deg, #e2ff00, #18e0e0, #e8318d)",
    },
    {
      type: "SUPER RARE",
      value: "SR",
      color: "#803cef",
    },
    {
      type: "ULTRA RARE",
      value: "UR",
      color: "#803cef",
    },
    {
      type: "IMMORTAL",
      value: "IM",
      color: "#803cef",
    },
    {
      type: "UNIQUE",
      value: "UN",
      color: "#803cef",
    },
    {
      type: "PREMIUM",
      value: "PR",
      color: "#803cef",
    },
    {
      type: "SUPERIOR",
      value: "SP",
      color: "#803cef",
    },
    {
      type: "STANDARD",
      value: "ST",
      color: "#803cef",
    },
  ];

  const playerCatData = playerCategory.find((obj) => obj.type === value);
  return playerCatData;
};

export const HurleyCategoory = (value) => {
  const category = [
    {
      type: "RARE",
      value: "RA",
      color: "#3b56ff",
    },
    {
      type: "EPIC",
      value: "EP",
      color: "#3b56ff",
    },
    {
      type: "LEGENDARY",
      value: "LG",
      color: "#3b56ff",
    },
    {
      type: "IMMORTAL",
      value: "IM",
      color: "#3b56ff",
    },
    {
      type: "COMMON",
      value: "CO",
      color: "#3b56ff",
    },
    {
      type: "UNCOMMON",
      value: "UCO",
      color: "#3b56ff",
    },
  ];

  const hurleyCategoryData = category.find((obj) => obj.type === value);
  return hurleyCategoryData;
};

export const Nationality = (value) => {
  const Nationality = [
    {
      type: "India",
      name: "India",
      value:
        "https://cdn.guardianlink.io/product-hotspot/images/shots/shots_country_India.png",
    },
    {
      type: "Australiaki",
      name: "Australia",
      value:
        "https://cdn.guardianlink.io/product-hotspot/images/shots/shots_country_Australia.png",
    },
    {
      type: "Bangladesh",
      name: "Bangladesh",
      value:
        "https://cdn.guardianlink.io/product-hotspot/images/shots/shots_country_Bangladesh.png",
    },
    {
      type: "England",
      name: "England",
      value:
        "https://cdn.guardianlink.io/product-hotspot/images/shots/shots_country_England.png",
    },
    {
      type: "New Zealand",
      name: "New Zealand",
      value:
        "https://cdn.guardianlink.io/product-hotspot/images/shots/shots_country_NewZealand.png",
    },
    {
      type: "Pakistan",
      name: "Pakistan",
      value:
        "https://cdn.guardianlink.io/product-hotspot/images/shots/shots_country_Pakistan.png",
    },
    {
      type: "South Africa",
      name: "South Africa",
      value:
        "https://cdn.guardianlink.io/product-hotspot/images/shots/shots_country_SouthAfrica.png",
    },
    {
      type: "Sri Lanka",
      name: "Sri Lanka",
      value:
        "https://cdn.guardianlink.io/product-hotspot/images/shots/shots_country_Srilanka.png",
    },
    {
      type: "Zimbabwe",
      name: "Zimbabwe",
      value:
        "https://cdn.guardianlink.io/product-hotspot/images/shots/shots_country_Zimbabwe.png",
    },
  ];
  const NationalityData = Nationality.find((obj) => obj.type === value);
  return NationalityData;
};
export const batPower = (value) => {
  const batPower = [
    {
      type: "1",
      name: "BAT",
      value:
        "https://cdn.guardianlink.io/product-hotspot/images/jumptradeapp/2x_1.png",
    },
    {
      type: "2",
      name: "BAT",
      value:
        "https://cdn.guardianlink.io/product-hotspot/images/jumptradeapp/2x_2.png",
    },
    {
      type: "3",
      name: "BAT",
      value:
        "https://cdn.guardianlink.io/product-hotspot/images/jumptradeapp/2x_3.png",
    },
  ];
  const batPowerData = batPower.find((obj) => obj.type == value?.toString());
  return batPowerData;
};

export const blockInvalidChar = (e) =>
  ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault();

export const errorMessage = (code) => {
  const ERROR = 500;
  const ERROR404 = 404;
  const UNAUTHORIZED = 401;
  const NFT_NOT_FOUND = 801;
  const NON_GAME_NFTS = 802;
  // const USER_HAS_NO_NFT = 803;
  const USER_NOT_FOUND = 805;
  const LEVEL_UP_FAILED = 806;
  const CRICKET_NFT_FAILED = 807;
  const CARDS_QTY_FAILED = 808;
  const INVALID_PAYMENT = 809;
  const INSUFFICIENT_BALANCE = 810;
  const INVALID_NFT = 811;
  const ALREADY_UPDATED = 812;
  const REQ_CARDS_FAILED = 813;
  const OWNER_FAILED = 814;

  switch (code) {
    case ERROR:
      return "The request could not be processed at this time. Please try again.!";
    case ERROR404:
      return "Not found!";
    case UNAUTHORIZED:
      return "Unauthorized";
    case NFT_NOT_FOUND:
      return "Nft not found with game_id or enough balance with admin";
    case NON_GAME_NFTS:
      return "Nft not found in-game";
    case USER_NOT_FOUND:
      return "User not found";
    case LEVEL_UP_FAILED:
      return "Reached maximum level";
    case CRICKET_NFT_FAILED:
      return "Not Cricket NFTs";
    case CARDS_QTY_FAILED:
      return "Not Enough Upgradable Cards";
    case INVALID_PAYMENT:
      return "Invalid payment method";
    case INSUFFICIENT_BALANCE:
      return "Insufficient balance";
    case INVALID_NFT:
      return "Invalid NFT";
    case ALREADY_UPDATED:
      return "NFT has been upgraded already to this level.";
    case REQ_CARDS_FAILED:
      return "Required cards not found";
    case OWNER_FAILED:
      return "Invalid Owner";
    default:
      return "The request could not be processed at this time. Please try again.!";
  }
};

export const purchasedDate = (date) =>
  dayjs(date).format("DD/MM/YYYY, H:mm:ss A");

export const validateRoleName = (name) => {
  const re =
    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.\w'-]+$/u;
  return re.test(name);
};

export const pendingListDate = (date) => dayjs(date).format("DD MMM YYYY");
export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getAbsoluteURLParams = (key = "", search = "") => {
  if (!key || !search) return;
  const regex = new RegExp(`${key}=([^&]+)`);
  let result = regex.exec(search);
  return Array.isArray(result) && result.length > 0 ? result[1] : null;
};
export const subtractMin = (time, min) => {
  let reducedTime = new Date(time);
  return reducedTime.setMinutes(reducedTime.getMinutes() - parseInt(min));
};

export const getMobileNumber = (mobNum, code) => {
  let m_number = mobNum ? mobNum : "";
  let c_code = code ? code : "";
  return findPhoneNumbersInText(m_number, c_code);
};

export const userBalanceDetailFormat = (num) => {
  let result = num;
  if (num >= 1000000000000) {
    result = roundDown(num / 1000000000000, 2) + `T`;
  } else if (num >= 1000000000) {
    result = roundDown(num / 1000000000, 2) + `B`;
  } else if (num >= 1000000) {
    result = roundDown(num / 1000000, 2) + `M`;
  } else if (num >= 1000) {
    result = roundDownValue(num / 1000, 2) + `K`;
  } else {
    result = roundDownValue(num, 2);
  }

  return result;
};

export const precisionRoundMod = (number, precision) => {
  var factor = Math.pow(10, precision);
  var n = precision < 0 ? number : 0.01 / factor + number;
  return Math.round(n * factor) / factor;
};

export const getDecimalInfo = (value) => {
  const MIN_FIXED_PT = 1;
  const MAX_FIXED_PT = 6;

  let floatValue = parseFloat(value);
  if (!value || isNaN(floatValue)) return NaN;
  let decimalValue = floatValue.toString().split(".")[1];
  let ptsLength = decimalValue?.length;
  let fixedDecimalPts =
    ptsLength > MIN_FIXED_PT
      ? ptsLength <= 5
        ? ptsLength
        : MAX_FIXED_PT
      : MIN_FIXED_PT;

  return fixedDecimalPts;
};

export const dynamicDecimalPrecision = (value) => {
  let fixedDecimalPts = getDecimalInfo(value);
  return precisionRoundMod(value, fixedDecimalPts);
};

export const mobnumValidation = (num) => {
  var mob_regex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;
  if (mob_regex.test(num)) {
    return true;
  } else {
    return false;
  }
};

export const useOnClickOutside = (ref, handler) => {
  console.log(ref, "ref");
  useEffect(() => {
    const listener = (event) => {
      if (!ref?.current || ref?.current?.contains(event.target)) {
        return;
      }
      console.log("OutsideClick");
      handler(2);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

export const DEFAULT_REVENUE_SHARE = "Revenue share (%) - TBA";

export const sameField = (input, cInput) => {
  if (input === cInput) return true;
  else return false;
};

export const raddx_level = (value) => {
  const TOTAL_LEVELS = 30;
  const levels = [];

  for (let i = 1; i <= TOTAL_LEVELS; i++) {
    levels.push({
      type: `${i}`,
      name: `LVL ${i}`,
      value: raddx_images[`level_${i}`],
    });
  }
  const levelData = levels.find((obj) => obj.type === value?.toString());
  return levelData;
};

export const raddx_car_category = (value) => {
  const car_categories = [
    {
      type: "Battle",
      name: "Battle",
      value: raddx_images.car_category_battle,
    },
    {
      type: "Concept",
      name: "Concept",
      value: raddx_images.car_category_concept,
    },
    {
      type: "Hyper",
      name: "Hyper",
      value: raddx_images.car_category_hyper,
    },
    {
      type: "Super",
      name: "Super",
      value: raddx_images.car_category_super,
    },
    {
      type: "Tuner",
      name: "Tuner",
      value: raddx_images.car_category_tuner,
    },
    {
      type: "Vintage",
      name: "Vintage",
      value: raddx_images.car_category_vintage,
    },
  ];

  const data = car_categories.find((obj) => obj.type === value?.toString());
  return data;
};

export const raddx_category = (value) => {
  const raddxCategory = [
    {
      name: "COMMON",
      value: "CO",
      color: "blue_color",
      textColor: "#3b56ff",
    },
    {
      name: "IMMORTAL",
      value: "IM",
      color: "lavender_color",
      textColor: "#803cef",
    },
    {
      name: "RARE",
      value: "RA",
      color: "orange_color",
      textColor: "#f58220",
    },
    {
      name: "ALIEN",
      value: "AL",
      color: "lavender_color",
      textColor: "#803cef",
    },
    {
      name: "LEGENDARY",
      value: "LG",
      color: "multi_color",
      textColor: "linear-gradient(202deg, #e2ff00, #18e0e0, #e8318d)",
    },
    // Land Categories
    {
      name: "HEART",
      value: "HT",
      color: "blue_color",
      textColor: "#3b56ff",
    },
    {
      name: "PRIME",
      value: "PM",
      color: "lavender_color",
      textColor: "#803cef",
    },
    {
      name: "MAINLAND",
      value: "ML",
      color: "multi_color",
      textColor: "linear-gradient(202deg, #e2ff00, #18e0e0, #e8318d)",
    },
    {
      name: "DOWNTOWN",
      value: "DT",
      color: "orange_color",
      textColor: "#f58220",
    },

    //Building Categories
    {
      name: "PLATINUM",
      value: "PT",
      color: "lavender_color",
      textColor: "#803cef",
    },
    {
      name: "DIAMOND",
      value: "DM",
      color: "multi_color",
      textColor: "linear-gradient(202deg, #e2ff00, #18e0e0, #e8318d)",
    },
    {
      name: "GOLD",
      value: "GO",
      color: "gold_color",
      textColor: "#cebd48",
    },
    {
      name: "SILVER",
      value: "SL",
      color: "blue_color",
      textColor: "#3b56ff",
    },
  ];

  const data = raddxCategory.find((obj) => obj.name === value);
  return data;
};

export const raddx_roles = (value) => {
  const raddxRoles = [
    {
      name: "Land",
      value: raddx_images.land_icon,
    },
    {
      name: "Building",
      value: raddx_images.building_icon,
    },
  ];

  const data = raddxRoles.find((obj) => obj.name === value);
  return data;
};

export const invokeTrackEvent = (eventName, payload = {}) => {
  // console.log(eventName, payload);

  if (window.webengage) window?.webengage?.track(eventName, payload);
};

export const EVENT_NAMES = {
  USER_SIGN_UP: "SignUp Completed",

  GUARDIANLINK_WALLET_VIEWED: "GuardianLink Wallet Viewed",

  WALLET_DEPOSIT_INITIATED: "GuardianLink Wallet Deposit Initiated",

  WALLET_WITHDRAW_INITIATED: "GuardianLink Wallet Withdraw Initiated",

  PROFILE_UPDATED: "Profile Updated",

  MY_ORDERS_VIEWED: "My Orders Viewed",

  // MY_ORDERS_PENDING_VIEWED: "My Orders - Pending Viewed",

  // MY_ORDERS_EXPIRED_VIEWED: "My Orders - Expired Viewed",

  ORDER_DETAILS_CHECKED: "Order Details Checked",

  INVOICES_BUY_ORDER_CHECKED: "Invoices - Buy Orders Checked",

  INVOICES_BUY_ORDER_CHECKED: "Invoices - Sell Orders Checked",

  INVOICE_VIEWED: "Invoice Viewed",

  DOWNLOAD_INVOICE: "Download Invoice",

  BIDS_VIEWED: "Bids Viewed",

  MY_BIDS_ACTIVE_BIDS: "My Bids - Active Bids",

  MY_BIDS_OUT_BIDS: "My Bids - Out Bids",

  KYC_STARTED: "KYC Started",

  KYC_RETRY: "KYC RETRY",

  KYC_COMPLETED: "KYC Completed",

  KYC_FAILED: "KYC Failed",
};
export const formattedBundlePrice = (value, digit = 6) => {
  value = parseFloat(value);
  return Number(value.toString().match(/^\d+(?:\.\d{0,6})?/));
};

export const toggleFreshworksHelp = (flag) => {
  try {
    const fwContainer = document.getElementById("freshworks-container");
    fwContainer.style.display = flag ? "block" : "none";
  } catch (error) {
    console.error("Error in disabling the fw support", error);
  }
};

export const validateCurrencyBundleNft = (value) => {
  // const re = /^(\d*)\.?(\d){0,10}$/;
  // const re = /^\d*\.?\d{0,2}$/;
  const re = /^[1-9][0-9]*$/;
  return re.test(value);
};
