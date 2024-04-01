import { useState } from "react";
import { Modal } from "react-bootstrap";
import { BiCheck, BiX } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ToggleButton from "react-toggle-button";

import { profileUpdateApi } from "../../../api/methods";
import { getUserInfo } from "../../../redux/reducers/user_reducer";
import { user_load_by_token_thunk } from "../../../redux/thunk/user_thunk";
import {
  validateName,
  validateNameReplace,
  validateURL,
} from "../../../utils/common";
import { getCookies } from "../../../utils/cookies";

import InputText from "../../input-text";
import InputTextArea from "../../input-textarea";

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

const EditProfileModal = ({ show, onHide = () => {}, disableCloseButton }) => {
  const dispatch = useDispatch();
  const user = useSelector(getUserInfo);
  const [profile, setProfile] = useState(initialProfileInfo);
  const [validation, setValidation] = useState(initialValidationInfo);
  const [loading, setLoading] = useState(false);

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

  const handleUpdate = async () => {
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
            dispatch(user_load_by_token_thunk(token));
            onHide();
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

  const handleBlurURL = (e) => {
    let info = e.target.value;
    if (info) {
      if (!(info.startsWith("https://") || info.startsWith("http://"))) {
        info = `https://` + info;
      }
      setProfile({
        ...profile,
        [e.target.name]: info,
      });
    }
  };

  return (
    <Modal show={show} size="lg" onHide={onHide} backdrop={"static"}>
      <Modal.Header closeButton={disableCloseButton}>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body className="card-modal edit-profile-pop">
        <div className="row">
          <div className="col-12 col-md-6 mb-2">
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
          <div className="col-12 col-md-6 mb-2">
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

          <div className="col-12 col-md-6 mb-2">
            <InputText
              title="Website"
              name="website"
              value={profile.website}
              onChange={handleChangeEvent}
              onBlur={handleBlurURL}
            />
            {validation.valid_website && (
              <span className="text-danger error-valid-text">
                Please enter a valid url
              </span>
            )}
          </div>
          <div className="col-12 col-md-6 mb-2">
            <InputText
              title="Facebook"
              name="facebook"
              value={profile.facebook}
              onChange={handleChangeEvent}
              onBlur={handleBlurURL}
            />
            {validation.valid_facebook && (
              <span className="text-danger error-valid-text">
                Please enter a valid url
              </span>
            )}
          </div>
          <div className="col-12 col-md-6 mb-2">
            <InputText
              title="Instagram"
              name="instagram"
              value={profile.instagram}
              onChange={handleChangeEvent}
              onBlur={handleBlurURL}
            />
            {validation.valid_instagram && (
              <span className="text-danger error-valid-text">
                Please enter a valid url
              </span>
            )}
          </div>
          <div className="col-12 col-md-6 mb-2">
            <InputText
              title="Telegram"
              name="telegram"
              value={profile.telegram}
              onChange={handleChangeEvent}
              onBlur={handleBlurURL}
            />
            {validation.valid_telegram && (
              <span className="text-danger error-valid-text">
                Please enter a valid url
              </span>
            )}
          </div>
          <div className="col-12 col-md-6 mb-2">
            <InputText
              title="Twitter"
              name="twitter"
              value={profile.twitter}
              onChange={handleChangeEvent}
              onBlur={handleBlurURL}
            />
            {validation.valid_twitter && (
              <span className="text-danger error-valid-text">
                Please enter a valid url
              </span>
            )}
          </div>
          <div
            className={`col-12 col-md-6 mb-2 d-flex align-self-center ${
              profile.private ? "pt-4" : ""
            }`}
          >
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
            <div className="col-12 col-md-6 mb-2">
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
          <div className="col-12 mb-3">
            <InputTextArea
              title="Description"
              name="description"
              value={profile.description}
              onChange={handleChangeEvent}
              rows={3}
            />
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <button
            disabled={loading}
            className="btn btn-dark"
            onClick={handleUpdate}
            type="button"
          >
            {loading ? "Loading..." : "Update"}
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EditProfileModal;
