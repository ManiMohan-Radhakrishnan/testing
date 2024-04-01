import { forwardRef, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown } from "react-bootstrap";
import ToggleButton from "react-toggle-button";
import { BiCheck, BiLoaderAlt, BiX } from "react-icons/bi";
import { BsFillTelephoneFill, BsInfoCircleFill } from "react-icons/bs";
import { FaAddressCard, FaCamera, FaPhoneAlt } from "react-icons/fa";
import { GoMail } from "react-icons/go";
import { toast } from "react-toastify";
import { VscClose } from "react-icons/vsc";

import {
  mobileNumVerifyModal,
  mobilNumAddModal,
} from "../../../redux/actions/user_action";
import { getUserInfo } from "../../../redux/reducers/user_reducer";
import { user_load_by_token_thunk } from "../../../redux/thunk/user_thunk";
import {
  privateNFTApi,
  profileUpdateApi,
  removeImage,
  updateAvatar,
} from "../../../api/methods";

import { getCookies } from "../../../utils/cookies";
import {
  EVENT_NAMES,
  getMobileNumber,
  invokeTrackEvent,
  validateName,
  validateNameReplace,
  validateURL,
} from "../../../utils/common";

import ToolTip from "../../tooltip";
import InputText from "../../input-text";

import Tick from "../../../images/verified.svg";
import Verify from "../../../images/verified-icon.png";
import userImg from "../../../images/user_1.png";
import Public from "../../../images/public.svg";
import Private from "../../../images/private-account.svg";

const initialProfileInfo = Object.freeze({
  first_name: "",
  last_name: "",
  website: "",
  facebook: "",
  instagram: "",
  telegram: "",
  twitter: "",
  private: false,
  private_name: "",
  description: "",
});

const initialValidationInfo = Object.freeze({
  first_name: false,
  valid_first_name: false,
  last_name: false,
  valid_last_name: false,
  website: false,
  valid_website: false,
  facebook: false,
  valid_facebook: false,
  instagram: false,
  valid_instagram: false,
  telegram: false,
  valid_telegram: false,
  twitter: false,
  valid_twitter: false,
  private_name: false,
  valid_private_name: false,
  description: false,
});

const UserIconToggle = forwardRef(({ onClick }, ref) => (
  <ToolTip
    ref={ref}
    temp
    icon={
      <div
        className="item-camera"
        role="button"
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
      >
        <FaCamera size={25} />
      </div>
    }
    content="Change banner"
    placement="top"
  />
));

const UserProfileCard = ({ kycLoading = false, setKycModal }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector(getUserInfo);
  const avatarImageRef = useRef(null);
  const bgImageRef = useRef(null);
  const [avatar, setAvatar] = useState({ file: null, base64: null });
  const [bg, setBg] = useState({ file: null, base64: null });
  const [editProfileCard, setEditProfileCard] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(initialProfileInfo);
  const [validation, setValidation] = useState(initialValidationInfo);
  const socialLinks = user.social_links;
  const phone_number = getMobileNumber(
    user?.phone_no || "",
    user?.phone_code || ""
  );
  const [privateNFT, setPrivateNFT] = useState(
    user?.private_nfts ? user?.private_nfts : false
  );
  useEffect(() => {
    window?.webengage?.user?.setAttribute("KYC Status", user?.kyc_status);
    if (user?.kyc_status === "rejected")
      window?.webengage?.user?.setAttribute(
        "KYC Rejected Reason",
        user?.kyc_reject_reason
      );
  }, []);

  const checkValidation = () => {
    let c_validation = { ...validation };

    if (!profile.first_name) {
      c_validation = { ...c_validation, first_name: true };
    } else {
      if (validateName(profile.first_name)) {
        c_validation = { ...c_validation, valid_first_name: false };
      } else {
        c_validation = { ...c_validation, valid_first_name: true };
      }
    }

    if (!profile.last_name) {
      c_validation = { ...c_validation, last_name: true };
    } else {
      if (validateName(profile.last_name)) {
        c_validation = { ...c_validation, valid_last_name: false };
      } else {
        c_validation = { ...c_validation, valid_last_name: true };
      }
    }

    if (profile.website) {
      if (!validateURL(profile.website)) {
        c_validation = { ...c_validation, valid_website: true };
      } else {
        c_validation = { ...c_validation, valid_website: false };
      }
    } else {
      c_validation = { ...c_validation, valid_website: false };
    }

    if (profile.facebook) {
      if (!validateURL(profile.facebook)) {
        c_validation = { ...c_validation, valid_facebook: true };
      } else {
        c_validation = { ...c_validation, valid_facebook: false };
      }
    } else {
      c_validation = { ...c_validation, valid_facebook: false };
    }

    if (profile.instagram) {
      if (!validateURL(profile.instagram)) {
        c_validation = { ...c_validation, valid_instagram: true };
      } else {
        c_validation = { ...c_validation, valid_instagram: false };
      }
    } else {
      c_validation = { ...c_validation, valid_instagram: false };
    }

    if (profile.telegram) {
      if (!validateURL(profile.telegram)) {
        c_validation = { ...c_validation, valid_telegram: true };
      } else {
        c_validation = { ...c_validation, valid_telegram: false };
      }
    } else {
      c_validation = { ...c_validation, valid_telegram: false };
    }

    if (profile.twitter) {
      if (!validateURL(profile.twitter)) {
        c_validation = { ...c_validation, valid_twitter: true };
      } else {
        c_validation = { ...c_validation, valid_twitter: false };
      }
    } else {
      c_validation = { ...c_validation, valid_twitter: false };
    }

    if (profile.private) {
      if (!profile.private_name) {
        c_validation = { ...c_validation, valid_private_name: true };
      } else {
        c_validation = { ...c_validation, valid_private_name: false };
      }
    }

    setValidation(c_validation);
    if (
      !c_validation.first_name &&
      !c_validation.valid_first_name &&
      !c_validation.last_name &&
      !c_validation.valid_last_name &&
      !c_validation.valid_website &&
      !c_validation.valid_facebook &&
      !c_validation.valid_instagram &&
      !c_validation.valid_telegram &&
      !c_validation.valid_private_name &&
      !c_validation.valid_twitter
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleEditProfileCard = () => {
    setProfile({
      first_name: user.first_name ? user.first_name : "",
      last_name: user.last_name ? user.last_name : "",
      website: user.website ? user.website : "",
      facebook: socialLinks.facebook ? socialLinks.facebook : "",
      instagram: socialLinks.instagram ? socialLinks.instagram : "",
      telegram: socialLinks.telegram ? socialLinks.telegram : "",
      twitter: socialLinks.twitter ? socialLinks.twitter : "",
      private: user.private,
      private_name: user.private_name ? user.private_name : "",
      description: user.desc ? user.desc : "",
    });
    setEditProfileCard(true);
  };

  const handleChangeEvent = (e) => {
    if (e.target.value) {
      if (e.target.name === "name") {
        if (validateName(e.target.value)) {
          setProfile({
            ...profile,
            [e.target.name]: validateNameReplace(e.target.value),
          });
          setValidation({ ...validation, [e.target.name]: false });
        }
      } else {
        setProfile({ ...profile, [e.target.name]: e.target.value });
        setValidation({ ...validation, [e.target.name]: false });
      }
    } else {
      setProfile({ ...profile, [e.target.name]: e.target.value });
      setValidation({ ...validation, [e.target.name]: true });
    }
  };

  const handleBannerChange = (input) => {
    for (let file of input.target.files) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBg({ ...bg, base64: event.target.result, file: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBanner = async (type) => {
    try {
      await removeImage(user.slug, type);

      if (type === "banner") toast.success("Banner Image Removed Successfully");
      else toast.success("Avatar Image Removed Successfully");

      dispatch(user_load_by_token_thunk(getCookies()));
    } catch (error) {
      console.log("Error in removing the banner", error);
    }
  };

  const handleCardEditUpdate = async () => {
    if (checkValidation()) {
      try {
        setLoading(true);
        let apiInput = { ...profile };
        const updateData = {
          user: {
            first_name: apiInput.first_name,
            last_name: apiInput.last_name,
            private: apiInput.private,
            private_name: apiInput.private_name,
            user_profile_attributes: {
              desc: apiInput.description,
              website: apiInput.website,
              social_links: {
                facebook: apiInput.facebook,
                instagram: apiInput.instagram,
                telegram: apiInput.telegram,
                twitter: apiInput.twitter,
              },
            },
          },
        };
        const result = await profileUpdateApi({
          slug: user.slug,
          data: updateData,
        });
        if (result.data.success) {
          toast.success("Profile Information Updated Successfully");
          const token = getCookies();
          if (token) {
            invokeTrackEvent(EVENT_NAMES?.PROFILE_UPDATED, {
              first_name: profile?.first_name,
              last_name: profile?.last_name,
            });
            dispatch(user_load_by_token_thunk(token));
            setEditProfileCard(false);
          }
        }
      } catch (err) {
        if (err?.data?.status === 406) {
          toast.error(
            err.data.message ||
              "An unexpected error occured. Please try again later"
          );
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAvatarChange = (input) => {
    for (let file of input.target.files) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar({ ...avatar, base64: event.target.result, file: file });
        handleSaveAvatar({
          ...avatar,
          base64: event.target.result,
          file: file,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = async (input) => {
    try {
      setAvatarLoading(true);
      var formData = new FormData();
      formData.append("user[user_profile_attributes][avatar]", input.file);
      await updateAvatar(user.slug, formData);
      setAvatarLoading(false);
      toast.success("Avatar Image Updated Successfully");
      setAvatar({ file: null, base64: null });
      dispatch(user_load_by_token_thunk(getCookies()));
    } catch (error) {
      setAvatarLoading(false);
      console.log("Error in saving the avatar", error);
    }
  };

  const handlePrivateNFT = async (value) => {
    try {
      setLoading(true);
      var formData = new FormData();
      formData.append("user[private_nfts]", value);
      const result = await privateNFTApi({
        data: formData,
      });
      if (result.data.success) {
        // toast.success("Private NFT Success");
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
    setLoading(false);
  };

  const kycStatus = ["success", "aml_failed", "in_progress"];
  const initialStatus = [null, "aml_failed"];

  return (
    <article className="grid-card">
      <input
        type="file"
        accept="image/*"
        ref={avatarImageRef}
        style={{ display: "none" }}
        onClick={(event) => {
          event.target.value = null;
        }}
        onChange={handleAvatarChange}
      />
      <input
        type="file"
        accept="image/*"
        ref={bgImageRef}
        style={{ display: "none" }}
        onClick={(event) => {
          event.target.value = null;
        }}
        onChange={handleBannerChange}
      />
      <div
        className={`card-box user-detail-card ${
          editProfileCard ? "edit-form-open" : ""
        }`}
      >
        <div className="kyc-block ">
          {user?.kyc_status === "success" ? (
            <>
              <span className={`btn-sm btn-light kycboxbg verify-pill`}>
                <span>
                  <img src={Tick} alt="tick-icon" />
                </span>
                Verified
              </span>
            </>
          ) : (
            <span
              className={`btn-sm btn-light kycboxbg
                ${user?.kyc_status === null ? "notInitiated" : user?.kyc_status}
              `}
            >
              {user?.kyc_status === null && "verification pending"}{" "}
              {user?.kyc_status === "aml_failed" && "verification failed"}{" "}
              {!initialStatus.includes(user?.kyc_status) &&
                `verification ${user?.kyc_status?.replace("_", " ")}`}{" "}
              {user?.kyc_reject_reason !== null &&
              user?.kyc_status !== null &&
              user?.kyc_status !== "in_progress" &&
              user?.kyc_status !== "pending" ? (
                <ToolTip
                  className={
                    user?.kyc_reject_reason != null ? "" : "no-cursorpoint"
                  }
                  icon={<BsInfoCircleFill />}
                  content={user?.kyc_reject_reason}
                  placement="top"
                />
              ) : (
                ""
              )}
            </span>
          )}
        </div>
        <div className="media">
          <div className={`item-img ${avatar.base64 ? "edit" : ""}`}>
            <img
              src={(() => {
                if (avatar.base64) {
                  return avatar.base64;
                } else if (user.avatar_url) {
                  return user.avatar_url;
                } else {
                  return userImg;
                }
              })()}
              alt="User Avatar"
            />

            <Dropdown style={{ position: "initial" }}>
              <Dropdown.Toggle as={UserIconToggle}></Dropdown.Toggle>

              <Dropdown.Menu
                align="start"
                style={{ marginTop: "0 !important" }}
                className="avatar-img"
              >
                <Dropdown.Item
                  as="button"
                  onClick={() => avatarImageRef.current.click()}
                >
                  Upload Avatar
                </Dropdown.Item>
                {user.avatar_url && (
                  <>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      as="button"
                      onClick={() => handleRemoveBanner("avatar")}
                    >
                      Remove Avatar
                    </Dropdown.Item>
                  </>
                )}
              </Dropdown.Menu>
            </Dropdown>

            {avatarLoading && (
              <div className="item-loading">
                <BiLoaderAlt size={25} className="fa fa-spin" color="white" />
              </div>
            )}
            {user?.kyc_status === "success" && user?.phone_verified && (
              <img src={Verify} alt="tick-icon" className="verified-image" />
            )}
          </div>
          <div className="media-body flex-user-info">
            <div className="curruser-box">
              <div className="item-title">
                <span className="username">
                  @{user.first_name} {user.last_name}
                </span>
                {!user.private ? (
                  <ToolTip
                    icon={<img src={Public} />}
                    content="Your profile is public"
                    placement="top"
                  />
                ) : (
                  <ToolTip
                    icon={<img src={Private} />}
                    content="Your profile is private"
                    placement="top"
                  />
                )}
              </div>
              <div className="item-subtitle">
                <span>
                  <GoMail /> <span>{user.email}</span>
                </span>
              </div>
              <div className="item-subtitle">
                <span>
                  {user?.phone_no && (
                    <>
                      <BsFillTelephoneFill />{" "}
                      {`+${phone_number[0]?.number?.countryCallingCode}`}
                      &nbsp;
                      {phone_number[0]?.number?.nationalNumber}
                    </>
                  )}
                  {"  "}
                </span>
              </div>
            </div>
          </div>

          <button
            className="edit-status btn btn-dark"
            onClick={handleEditProfileCard}
          >
            Edit Profile
          </button>
        </div>

        <div className="alerts-block">
          <h4>Alerts</h4>
          {!user?.phone_no ||
          !user?.phone_verified ||
          user?.kyc_status === null ||
          [
            "failed",
            "expired",
            "rejected",
            "cancelled",
            "pending",
            "partially_verified",
            "aml_failed",
          ].includes(user?.kyc_status) ? (
            <ul className="verify-list data_height">
              {!user?.phone_no || !user?.phone_verified ? (
                <li>
                  <div className="alert-card">
                    <div className="title-box">
                      <FaPhoneAlt />
                      <span>
                        {!user?.phone_no
                          ? "Add Mobile Number"
                          : "Verify Mobile Number"}
                      </span>
                    </div>
                    <div className="btn-box">
                      {!user?.phone_no ? (
                        <span
                          className="btn btn-sm btn-dark rounded-pill min-unset"
                          onClick={() => {
                            history.push("/accounts/settings");
                            dispatch(mobilNumAddModal(true));
                          }}
                        >
                          ADD
                        </span>
                      ) : (
                        <span
                          className="btn btn-sm btn-dark rounded-pill min-unset"
                          onClick={() => {
                            history.push("/accounts/settings");
                            dispatch(mobileNumVerifyModal(true));
                          }}
                        >
                          VERIFY
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ) : (
                <br />
              )}
              {user?.kyc_status === null ? (
                <li>
                  <div className="alert-card">
                    <div className="title-box">
                      <FaAddressCard />
                      <span>Verification Is Not Initiated</span>
                    </div>
                    <div className="btn-box">
                      <button
                        className="btn btn-sm btn-dark rounded-pill min-unset"
                        type="button"
                        disabled={kycLoading}
                        onClick={() => {
                          setKycModal(true);
                          invokeTrackEvent(EVENT_NAMES?.KYC_STARTED, {
                            "First Name": user?.first_name,
                            "Last Name": user?.last_name,
                            Email: user?.email,
                            Phone: user?.phone_no,
                          });
                        }}
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                  {/* <h6 className="info-box">
                    <BsExclamationCircle /> Please update the valid proof
                  </h6> */}
                </li>
              ) : (
                <>
                  {user?.kyc_status !== "success" ? (
                    <li>
                      <div className="alert-card">
                        <div className="title-box">
                          <FaAddressCard />
                          {user?.kyc_status === "aml_failed" ? (
                            <span className="aml-text">
                              {user?.kyc_reject_reason}
                            </span>
                          ) : (
                            <span>
                              User Verification{" "}
                              <span style={{ textTransform: "capitalize" }}>
                                {user?.kyc_status?.replace("_", " ")}
                              </span>
                            </span>
                          )}
                        </div>
                        {!kycStatus.includes(user?.kyc_status) && (
                          <div className="btn-box">
                            <button
                              className="btn btn-sm btn-dark rounded-pill min-unset"
                              type="button"
                              disabled={kycLoading}
                              onClick={() => {
                                setKycModal(true);
                                invokeTrackEvent(EVENT_NAMES?.KYC_RETRY, {});
                              }}
                            >
                              Retry
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  ) : (
                    <br />
                  )}
                </>
              )}
            </ul>
          ) : (
            <ul className="verify-list no_data">
              <li>
                {" "}
                <div className="alert-card">
                  <div className="title-box w-100">
                    <p className="text-center w-100 mb-0">No alerts found</p>
                  </div>
                </div>
              </li>
            </ul>
          )}
        </div>

        <div className="user-form-card">
          <div className="row">
            <div className="col-12 mb-2">
              <h4 className="card-title">
                Edit Detail{" "}
                <VscClose onClick={() => setEditProfileCard(false)} />
              </h4>
            </div>
          </div>
          <div className="row">
            <div className="col-12 mb-2">
              <InputText
                title={"First Name"}
                name="first_name"
                value={profile.first_name}
                required={validation.first_name}
                onChange={handleChangeEvent}
              />
              {validation.valid_first_name && (
                <span className="text-danger error-valid-text">
                  Please enter a valid first name
                </span>
              )}
            </div>
            <div className="col-12 mb-2">
              <InputText
                title={"Last Name"}
                name="last_name"
                value={profile.last_name}
                required={validation.last_name}
                onChange={handleChangeEvent}
              />
              {validation.valid_last_name && (
                <span className="text-danger error-valid-text">
                  Please enter a valid last name
                </span>
              )}
            </div>

            <div className={`col-12 mb-2 d-flex align-self-center `}>
              <label className="toggle-private-title w-100">
                Make Your Profile Private
              </label>
              <div>
                <ToggleButton
                  inactiveLabel={<BiX size={20} />}
                  activeLabel={<BiCheck size={20} />}
                  value={profile.private}
                  onToggle={(value) => {
                    setProfile({ ...profile, private: !value });
                  }}
                />
              </div>
            </div>
            {profile.private && (
              <div className="col-12 mb-2">
                <InputText
                  title="Private Name"
                  name="private_name"
                  value={profile.private_name}
                  required={validation.private_name}
                  onChange={handleChangeEvent}
                />
                {validation.valid_private_name && (
                  <span className="text-danger error-valid-text">
                    Please enter a private name
                  </span>
                )}
              </div>
            )}
            <div className={`col-12 mb-2 d-flex align-self-center `}>
              <label className="toggle-private-title w-100">
                Make Your NFTs Private
              </label>
              <p>
                <ToggleButton
                  inactiveLabel={<BiX size={20} />}
                  activeLabel={<BiCheck size={20} />}
                  value={privateNFT}
                  onToggle={(value) => {
                    setPrivateNFT(!value);
                    handlePrivateNFT(!value);
                  }}
                />
              </p>
            </div>
          </div>
          <div className="d-flex justify-content-center sticky-bottom">
            <button
              disabled={loading}
              className="btn btn-dark"
              onClick={handleCardEditUpdate}
              type="button"
            >
              {loading ? "Loading..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default UserProfileCard;
