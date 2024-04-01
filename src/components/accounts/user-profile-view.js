/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { FaUserCheck, FaUserLock } from "react-icons/fa";
import { HiOutlineLockClosed } from "react-icons/hi";
import { toast } from "react-toastify";
import ContentLoader from "react-content-loader";

import userImg from "../../images/user_1.png";
import faImg from "../../images/facebook-1@2x.jpg";
import inImg from "../../images/instagram-1@2x.jpg";
import teImg from "../../images/telegram@2x.jpg";
import twImg from "../../images/twitter@2x.jpg";
import ToolTip from "../tooltip";
import { showUserApi } from "../../api/methods";

const UserProfileView = ({ slug }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    getUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserDetails = async () => {
    try {
      setLoading(true);
      const result = await showUserApi(slug);
      setData(result.data.data.user);
      setLoading(false);

      console.log(
        "🚀 ~ file: user-profile-view.js ~ line 48 ~ getUserDetails ~ result",
        result.data.data
      );
    } catch (error) {
      setLoading(false);
      toast.error("An unexpected error occured. Please try again  later");
      console.log(
        "🚀 ~ file: user-profile-view.js ~ line 50 ~ getUserDetails ~ error",
        error
      );
    }
  };

  return loading ? (
    <>
      <ContentLoader
        viewBox="0 0 900 400"
        width={"100%"}
        height={"100%"}
        backgroundColor="#f5f5f5"
        foregroundColor="#dbdbdb"
      >
        <circle cx="30" cy="258" r="30" />
        <rect x="0" y="300" rx="5" ry="5" width="90%" height="10" />
        <rect x="75" y="233" rx="4" ry="4" width="100" height="13" />
        <rect x="75" y="260" rx="4" ry="4" width="50" height="8" />
        <rect x="0" y="210" rx="5" ry="5" width="400" height="10" />
        <rect x="0" y="0" rx="5" ry="5" width="100%" height="200" />
      </ContentLoader>
    </>
  ) : (
    <>
      {data?.slug && (
        <div className="container-fluid px-0">
          <div className="row">
            <div className="col-md-12 p-b-100">
              <div className="row">
                <div className="col-md-12 px-0">
                  <div
                    className="banner-user"
                    style={(() => {
                      if (data?.banner) {
                        return { backgroundImage: `url(${data.banner})` };
                      }
                    })()}
                  >
                    <div className="banner-content">
                      <div className="media">
                        <div className={`item-img`}>
                          <img
                            src={data?.avatar_url ? data.avatar_url : userImg}
                            alt="User logo"
                          />
                        </div>
                        <div className="media-body">
                          <div className="item-subtitle">
                            @
                            {data?.private ? (
                              data.private_name
                            ) : (
                              <>
                                {data.first_name}
                                {data.last_name}
                              </>
                            )}
                            {!data.private ? (
                              <ToolTip
                                icon={
                                  <FaUserCheck
                                    color="white"
                                    size={20}
                                    className="ms-2"
                                  />
                                }
                                content="This profile is public"
                                placement="top"
                              />
                            ) : (
                              <ToolTip
                                icon={
                                  <FaUserLock
                                    color="white"
                                    size={20}
                                    className="ms-2"
                                  />
                                }
                                content="This profile is private"
                                placement="top"
                              />
                            )}
                          </div>
                          <h3 className="item-title">
                            {data?.private ? (
                              data.private_name
                            ) : (
                              <>
                                {data.first_name} {data.last_name}
                              </>
                            )}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {data.private ? (
                  <div className="col-md-12 text-center align-self-center">
                    <div className="position-relative">
                      <HiOutlineLockClosed className="private_user_icon" />
                      <h2 className="mb-0 mt-4">This account is private</h2>
                      <p className="mt-3">
                        Follow this account to see their bid activities
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="col-md-12">
                    <div className="about-user">
                      <div className="about-heading mb-4">
                        <h3 className="about-title">About</h3>
                      </div>
                      <ul className="user-info">
                        {/* <li>
                          <label>Email</label>
                          <p>{data.email}</p>
                        </li> */}
                        <li>
                          <label>Description</label>
                          <p>
                            {data.desc ? data.desc : "No description found"}
                          </p>
                        </li>
                        <li>
                          <label>Website</label>
                          <p>
                            {" "}
                            {data.website ? (
                              <a
                                href={data.website}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {data.website}
                              </a>
                            ) : (
                              "No website found"
                            )}
                          </p>
                        </li>
                        <li>
                          <label>Social</label>
                          <div className="social-icon">
                            {!data.social_links.facebook &&
                              !data.social_links.instagram &&
                              !data.social_links.telegram &&
                              !data.social_links.twitter &&
                              "No social profiles found"}

                            {data.social_links.facebook && (
                              <a
                                href={data.social_links.facebook}
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                              >
                                <img src={faImg} alt="facebook logo" />
                              </a>
                            )}

                            {data.social_links.instagram && (
                              <a
                                href={data.social_links.instagram}
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                              >
                                <img src={inImg} alt="instagram logo" />
                              </a>
                            )}

                            {data.social_links.telegram && (
                              <a
                                href={data.social_links.telegram}
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                              >
                                <img src={teImg} alt="telegram logo" />
                              </a>
                            )}

                            {data.social_links.twitter && (
                              <a
                                href={data.social_links.twitter}
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                              >
                                <img src={twImg} alt="twitter logo" />
                              </a>
                            )}
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfileView;
