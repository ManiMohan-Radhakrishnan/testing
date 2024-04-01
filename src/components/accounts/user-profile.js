import { useState, useRef, useEffect, forwardRef } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaImage } from "react-icons/fa";
import { FiCheck } from "react-icons/fi";
import { Dropdown, Modal } from "react-bootstrap";
import { useLocation } from "react-router";
import { BiLoaderAlt } from "react-icons/bi";
import { VscClose } from "react-icons/vsc";
import { useHistory } from "react-router-dom";

import { user_load_by_token_thunk } from "../../redux/thunk/user_thunk";
import { getUserInfo } from "../../redux/reducers/user_reducer";
import { removeImage, updateAvatar } from "../../api/methods";
import { updateBanner } from "../../api/methods";
import { getCookies } from "../../utils/cookies";
import { toggleFreshworksHelp } from "../../utils/common";
import { useQuery } from "../../hooks/url-params";

import ToolTip from "../tooltip";
import UserProfileCard from "./profile-dashboard/user-profile-card";
import GlWalletCard from "./profile-dashboard/gl-wallet-card";
import RecentActivitiesCard from "./profile-dashboard/recent-activities-card";
import ReferralCard from "./profile-dashboard/referral-card";
import MyNftsCard from "./profile-dashboard/my-nfts-card";
import FeatureStatusCard from "./profile-dashboard/feature-status-card";
import EditProfileModal from "./profile-dashboard/edit-profile-modal";
import KycModal from "./profile-dashboard/kyc-modal";

import "./_style.scss";

const UserProfile = () => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { page } = useParams();
  const query = useQuery(location.search);
  const openToKycPopup = query.get("wayToCome");

  const user = useSelector(getUserInfo);
  const myProfile = useRef(null);

  const bgImageRef = useRef(null);
  const avatarImageRef = useRef(null);
  const [avatar, setAvatar] = useState({ file: null, base64: null });
  const [avatarLoading, setAvatarLoading] = useState(false);

  const [bgLoading, setBgLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [kycModal, setKycModal] = useState(false);
  const [kycLoading, setKycLoading] = useState(false);
  const [disableCloseButton, setDisableCloseButton] = useState(true);
  const [step, setStep] = useState("step1");
  const [bg, setBg] = useState({ file: null, base64: null });
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const myprofile_scroll = () => myProfile.current.scrollIntoView();

  const handleState = () => {
    setKycModal(false);
    setStep("step1");
    history.replace(window.location.pathname);
  };

  const randomString = () => (Math.random() + 1).toString(36).substring(7);

  const handleSaveBanner = async () => {
    try {
      setBgLoading(true);
      var formData = new FormData();

      const myNewFile = new File([bg.file], randomString(), {
        type: bg.file.type,
      });

      formData.append("user[user_profile_attributes][banner]", myNewFile);
      await updateBanner(user.slug, formData);
      toast.success("Banner Image Updated Successfully");
      setBgLoading(false);
      setBg({ file: null, base64: null });
      dispatch(user_load_by_token_thunk(getCookies()));
    } catch (error) {
      setBgLoading(false);
      console.log(
        "🚀 ~ file: user-profile.js ~ line 54 ~ handleSaveBanner ~ error",
        error
      );
    }
  };

  const BannerToggle = forwardRef(({ onClick }, ref) => (
    <ToolTip
      ref={ref}
      icon={
        <FaImage
          role="button"
          color="white"
          size={25}
          // onClick={() => bgImageRef.current.click()}
          onClick={(e) => {
            e.preventDefault();
            onClick(e);
          }}
        />
      }
      content="Change banner"
      placement="top"
    />
  ));

  const handleRemoveBanner = async (type) => {
    try {
      await removeImage(user.slug, type);

      if (type === "banner") toast.success("Banner Image Removed Successfully");
      else toast.success("Avatar Image Removed Successfully");

      dispatch(user_load_by_token_thunk(getCookies()));
    } catch (error) {
      console.log(
        "🚀 ~ file: user-profile.js ~ line 521 ~ handleRemoveBanner ~ error",
        error
      );
    }
  };

  useEffect(() => {
    if (
      query.get("forceUpdate") === "true" ||
      (!user.first_name && !user.last_name)
    ) {
      toast.warning("Please update the profile information");
      setEditModal(true);
      setDisableCloseButton(false);
    }
    if (page === "profile") {
      myprofile_scroll();
    }
    toggleFreshworksHelp(false);
    return () => {
      toggleFreshworksHelp(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBannerChange = (input) => {
    for (let file of input.target.files) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBg({ ...bg, base64: event.target.result, file: file });
      };
      reader.readAsDataURL(file);
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

  useEffect(() => {
    if (openToKycPopup === "fracto") {
      setKycModal(true);
    }
  }, []);

  return (
    <>
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
      <div className="main-content-block profilepage" ref={myProfile}>
        <div
          className="banner-user"
          style={(() => {
            if (bg.base64) {
              return { backgroundImage: `url(${bg.base64})` };
            } else if (user.banner_url) {
              return { backgroundImage: `url(${user.banner_url})` };
            }
          })()}
        >
          <div className="banner-content">
            <div className="profile-icon" align="end">
              <div className="kyc-user-icon">
                <span className="edit-status">
                  {bg.base64 ? (
                    <>
                      {bgLoading ? (
                        <BiLoaderAlt
                          className="fa fa-spin"
                          color="white"
                          size={25}
                        />
                      ) : (
                        <>
                          <ToolTip
                            icon={
                              <FiCheck
                                role="button"
                                color="white"
                                size={25}
                                onClick={handleSaveBanner}
                              />
                            }
                            content="Save"
                            placement="top"
                          />

                          <ToolTip
                            icon={
                              <VscClose
                                role="button"
                                color="white"
                                size={25}
                                onClick={() =>
                                  setBg({ file: null, base64: null })
                                }
                              />
                            }
                            content="Cancel"
                            placement="top"
                          />
                        </>
                      )}
                    </>
                  ) : (
                    <Dropdown>
                      <Dropdown.Toggle
                        align="start"
                        drop="start"
                        as={BannerToggle}
                      ></Dropdown.Toggle>

                      <Dropdown.Menu align="end">
                        <Dropdown.Item
                          as="button"
                          onClick={() => bgImageRef.current.click()}
                        >
                          {/* <BsCloudUpload /> */}
                          Upload Banner
                        </Dropdown.Item>

                        {user.banner_url && (
                          <>
                            <Dropdown.Divider />
                            <Dropdown.Item
                              as="button"
                              onClick={() => handleRemoveBanner("banner")}
                            >
                              {/* <FaTrash /> */}
                              Remove Banner
                            </Dropdown.Item>
                          </>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        <section className="profile-grid-layout-container">
          <UserProfileCard setKycModal={setKycModal} kycLoading={kycLoading} />
          <GlWalletCard />
          <RecentActivitiesCard />
          <ReferralCard />
          <MyNftsCard />
          <FeatureStatusCard />
        </section>
      </div>

      {editModal && (
        <EditProfileModal
          show={editModal}
          onHide={() => setEditModal(false)}
          disableCloseButton={disableCloseButton}
        />
      )}

      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Remove banner image
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure that you want to remove your banner image?
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-outline-dark"
            type="button"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button className="btn btn-dark" type="button" onClick={handleClose}>
            Confirm
          </button>
        </Modal.Footer>
      </Modal>

      {kycModal && (
        <KycModal
          show={kycModal}
          onHide={handleState}
          step={step}
          setStep={setStep}
          kycLoading={kycLoading}
          setKycLoading={setKycLoading}
        />
      )}
    </>
  );
};

export default UserProfile;
