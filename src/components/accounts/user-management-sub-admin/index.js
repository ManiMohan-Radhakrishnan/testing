import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { MdEdit, MdDelete } from "react-icons/md";
import { AiFillFileText, AiOutlineEye, AiOutlineClose } from "react-icons/ai";
import { BiSearch } from "react-icons/bi";
import { BsPlusCircle } from "react-icons/bs";
import { toast } from "react-toastify";

import {
  guildRoleList,
  guildCreateRole,
  guildViewRoleMenus,
  guildEditRole,
  guildDeleteRole,
  guildRoleMenuDefault,
} from "../../../api/methods";
import InputText from "../../input-text";
import PaginationUserProfile from "../../pagination";
import { validateRoleName } from "../../../utils/common";

import "./style.scss";

const UserManagementSubAdmin = ({ guildUserMenuPermissionList }) => {
  const roleListPageSize = 20;
  const [guildRoleListProp, setGuildRoleListProp] = useState({
    page: "1",
    size: roleListPageSize,
    search: "",
  });

  // final states
  // table data section
  const [roleListTableData, setRoleListTableData] = useState([]);
  const [roleListCurrentPage, setRoleListCurrentPage] = useState(1);
  const [totalRoleListCount, setTotalRoleListCount] = useState(0);
  const [roleListLoading, setRoleListLoading] = useState(false);
  // delete role section
  const [deleteRolePopUp, setDeleteRolePopUp] = useState(false);
  const [deleteRoleLoading, setDeleteRoleLoading] = useState(false);
  //
  const [guildRolePermissions, setGuildRolePermissions] = useState([]);

  // create role section
  const [createRolePopUp, setCreateRolePopUp] = useState(false);
  const [createGuildRoleName, setCreateRoleName] = useState("");
  const [createRoleLoading, setCreateRoleLoading] = useState(false);
  const [roleNameValidation, setRoleNameValidation] = useState(false);
  const [rolePermissionValidation, setRolePermissionValidation] =
    useState(false);
  // edit role section
  const [editRoleLoading, setEditRoleLoading] = useState(false);

  // final state ends here

  const [editRolePopUp, setEditRolePopUp] = useState(false);

  // view role section
  const [viewRolePopUp, setViewRolePopUp] = useState(false);
  const [viewRolePopUpData, setViewRolePopUpData] = useState([]);

  // const [permissionsArray,setPermissionsArray] = useState([]);

  const [defalutGuildRoleMenus, setDefalutGuildRoleMenus] = useState([]);

  const [viewData, setViewData] = useState({});

  const [defalutGuildRoleMenuLoading, setDefalutGuildRoleMenuLoading] =
    useState(false);

  const [initialRoleData, setInitialRoleData] = useState();

  // const guidPermissions = defalutGuildRoleMenus;

  useEffect(() => {
    getRoleListTableApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guildRoleListProp, deleteRolePopUp, createRolePopUp]);

  const resetData = () => {
    setInitialRoleData();
    setCreateRoleName("");
    setGuildRolePermissions([]);
    setRoleNameValidation(false);
    setRolePermissionValidation(false);
    setGuildRoleListProp({
      ...guildRoleListProp,
      page: 1,
    });
    setRoleListCurrentPage(1);
  };

  const getRoleListTableApi = async () => {
    try {
      setRoleListLoading(true);
      const result = await guildRoleList(guildRoleListProp);

      setRoleListTableData(result?.data?.data?.guild_roles);
      setTotalRoleListCount(result?.data?.data?.total);
      setRoleListLoading(false);
    } catch (error) {
      console.log(
        "🚀 ~ file: index.js ~ line 41 ~ getRoleListTableApi ~ error",
        error
      );
    }
  };

  const getGuildRoleMenus = async () => {
    try {
      setDefalutGuildRoleMenuLoading(true);
      const result = await guildRoleMenuDefault();
      setDefalutGuildRoleMenus(result?.data?.data?.guild_menus);
      setDefalutGuildRoleMenuLoading(false);
    } catch (error) {
      console.log(
        "🚀 ~ file: index.js ~ line 51 ~ getGuildRoleMenus ~ error",
        error
      );
    }
  };

  const getGuildRoleMenusEditPopUp = async (editRoleData) => {
    try {
      setInitialRoleData(editRoleData);
      setRoleNameValidation(false);
      setRolePermissionValidation(false);
      const result = await guildViewRoleMenus(editRoleData?.slug);
      setViewRolePopUpData(result?.data?.data?.guild_menus);
      setCreateRoleName(editRoleData?.name);
      setEditRolePopUp(!editRolePopUp);

      let FilteredArray = [];
      if (result?.data?.data?.guild_menus) {
        result?.data?.data?.guild_menus.filter(function (obj) {
          let newArrData = "";
          newArrData = {
            guild_menu_id: obj?.slug,
            actions: obj?.actions,
          };
          FilteredArray.push(newArrData);
        }); //now obj has all the filtered items
      }

      setGuildRolePermissions(FilteredArray);
    } catch (error) {
      console.log(
        "🚀 ~ file: index.js ~ line 116 ~ getGuildRoleMenusEditPopUp ~ error",
        error
      );
    }
  };

  const postCreateRoleData = async (createRoleApiData) => {
    try {
      setCreateRoleLoading(true);
      const result = await guildCreateRole(createRoleApiData);
      setCreateRoleLoading(false);
      toast.success(result?.data?.message);
      setCreateRolePopUp(!createRolePopUp);
      resetData();
    } catch (error) {
      toast.error(error?.data?.message);
      console.log(error, "Error");
      setCreateRoleLoading(false);
      console.log(
        "🚀 ~ file: index.js ~ line 116 ~ postCreateRoleData ~ error",
        error
      );
    }
  };

  const putEditRoleData = async (editRoleApiData) => {
    try {
      setEditRoleLoading(true);
      const result = await guildEditRole(
        editRoleApiData,
        initialRoleData?.slug
      );
      setEditRoleLoading(false);
      toast.success(result?.data?.message);
      setEditRolePopUp(!editRolePopUp);
      resetData();
    } catch (error) {
      toast.error(error?.data?.message);

      console.log(
        "🚀 ~ file: index.js ~ line 142 ~ putEditRoleData ~ error",
        error
      );
    }
  };

  const deleteGuildRoleApi = async () => {
    try {
      setDeleteRoleLoading(true);
      const result = await guildDeleteRole(initialRoleData?.slug);
      setDeleteRoleLoading(false);
      toast.success(result?.data?.message);
      setDeleteRolePopUp(!deleteRolePopUp);
      resetData();
    } catch (error) {
      console.log(
        "🚀 ~ file: index.js ~ line 60 ~ deleteGuildRole ~ error",
        error
      );
      toast.error(error?.data?.message);
    }
  };

  const handleRoleListPageChange = (pageno) => {
    setGuildRoleListProp({
      ...guildRoleListProp,
      page: pageno,
    });
    setRoleListCurrentPage(pageno);
  };

  const handleCreateRole = () => {
    resetData();
    setCreateRolePopUp(!createRolePopUp);
    getGuildRoleMenus();
  };

  const handleDeleteRole = (roleData) => {
    setInitialRoleData(roleData);
    setDeleteRolePopUp(!deleteRolePopUp);
  };

  const handleCreateGuildMenu = (e, guildMenuSlug, guildIndex) => {
    var guildRolePermissionsData = [...guildRolePermissions];
    var guildRolePermissionsMenuSlugData = guildRolePermissionsData.find(
      (obj) => obj?.guild_menu_id === guildMenuSlug
    );

    if (guildRolePermissionsMenuSlugData) {
      if (guildIndex == "view") {
        guildRolePermissionsMenuSlugData.actions.view = e.target.checked;
      } else {
        guildRolePermissionsMenuSlugData.actions.edit = e.target.checked;
      }
      setGuildRolePermissions(guildRolePermissionsData);
    } else {
      if (e.target.checked) {
        let newArr = {};
        if (guildIndex == "view") {
          newArr = {
            guild_menu_id: guildMenuSlug,
            actions: {
              view: e.target.checked,
            },
          };
        } else {
          newArr = {
            guild_menu_id: guildMenuSlug,
            actions: {
              edit: e.target.checked,
            },
          };
        }
        var ExistArray = guildRolePermissions;
        ExistArray.push(newArr);
        setGuildRolePermissions(ExistArray);
      }
    }
  };

  const getViewRoleMenuData = async (viewRoleData) => {
    try {
      setViewData({});
      setInitialRoleData(viewRoleData);
      const result = await guildViewRoleMenus(viewRoleData?.slug);

      setViewData(
        roleListTableData?.find((e) => e?.slug == viewRoleData?.slug)
      );
      setViewRolePopUpData(result?.data?.data?.guild_menus);
      setViewRolePopUp(!viewRolePopUp);
    } catch (error) {
      console.log(
        "🚀 ~ file: index.js ~ line 86 ~ getViewRoleMenuData ~ error",
        error
      );
    }
  };
  const handleEditGuildMenu = (e, guildMenuSlug, guildIndex) => {
    var guildRolePermissionsData = [...guildRolePermissions];
    var guildRolePermissionsMenuSlugData = guildRolePermissionsData.find(
      (obj) => obj?.guild_menu_id === guildMenuSlug
    );
    if (guildRolePermissionsMenuSlugData) {
      if (guildIndex == "view") {
        guildRolePermissionsMenuSlugData.actions.view = e.target.checked;
      } else {
        guildRolePermissionsMenuSlugData.actions.edit = e.target.checked;
      }
      setGuildRolePermissions(guildRolePermissionsData);
    } else {
      if (e.target.checked) {
        let newArr = {};
        if (guildIndex == "view") {
          newArr = {
            guild_menu_id: guildMenuSlug,
            actions: {
              view: e.target.checked,
            },
          };
        } else {
          newArr = {
            guild_menu_id: guildMenuSlug,
            actions: {
              edit: e.target.checked,
            },
          };
        }
        var ExistArray = guildRolePermissions;
        ExistArray.push(newArr);
        setGuildRolePermissions(ExistArray);
      }
    }
  };

  const CreateRole = () => {
    if (
      createGuildRoleName.length > 0 &&
      validateRoleName(createGuildRoleName)
    ) {
      setRoleNameValidation(false);
      setRolePermissionValidation(false);
      var guildRolePermissionsData = guildRolePermissions;

      function removeObjectWithId(arr, id) {
        const objWithIdIndex = arr.findIndex((obj) => obj.guild_menu_id === id);
        arr.splice(objWithIdIndex, 1);
        return arr;
      }

      guildRolePermissions.map((boolVal) => {
        if (boolVal.actions) {
          let data = Object.values(boolVal.actions);
          let newArr = data.filter((value) => value === true).length;
          if (newArr > 0) {
          } else {
            removeObjectWithId(
              guildRolePermissionsData,
              boolVal?.guild_menu_id
            );
          }
        }
      });

      if (!guildRolePermissions.length) {
        setRolePermissionValidation(true);
        return false;
      } else {
        setRolePermissionValidation(false);
      }
      const apiSendingData = {
        guild_role: {
          name: createGuildRoleName,
          guild_role_permissions: guildRolePermissionsData,
        },
      };

      postCreateRoleData(apiSendingData);
    } else {
      return setRoleNameValidation(true);
    }
  };

  const EditRole = () => {
    if (
      createGuildRoleName.length > 0 &&
      validateRoleName(createGuildRoleName)
    ) {
      setRoleNameValidation(false);
      setRolePermissionValidation(false);
      var guildRolePermissionsData = guildRolePermissions;
      var ExistPermissions = [];
      var ExistPermissions = guildRolePermissionsData.filter((boolVal) => {
        if (boolVal.actions) {
          let data = Object.values(boolVal.actions);
          let newArr = data.filter((value) => value === true).length;
          if (newArr > 0) {
            return boolVal;
          }
        }
      });

      if (ExistPermissions.length > 0) {
        const apiSendingData = {
          guild_role: {
            name: createGuildRoleName,
            guild_role_permissions: guildRolePermissionsData,
          },
        };

        putEditRoleData(apiSendingData);
        // setRolePermissionValidation(true);
        // return false;
      } else {
        setRolePermissionValidation(true);
        return false;
      }
    } else {
      return setRoleNameValidation(true);
    }
  };

  // search events

  const sendUserSeacrhFilter = (e) => {
    setGuildRoleListProp({
      ...guildRoleListProp,
      search: e.target.value,
      page: 1,
    });
    setRoleListCurrentPage(1);
  };

  const handleTextUserSearch = (remove = false) => {
    if (remove) {
      setGuildRoleListProp({
        ...guildRoleListProp,
        search: "",
        page: 1,
      });
      setRoleListCurrentPage(1);
    }
  };

  const handleUserSearchKeyPressEvent = (event) => {
    if (event.key === "Enter") {
      handleTextUserSearch();
    }
  };
  const DropdownToggle = React.forwardRef(({ onClick }, ref) => (
    <div
      role="button"
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      <span className="text-capitalize ">Users</span>
    </div>
  ));

  return (
    <div className="main-content-block container-fluid">
      <div className="row">
        <div className="col-md-12">
          <div className="about-user">
            <div className="guild-role-section">
              <div className="mb-4 about-heading mynft-heading">
                <div className="internal-heading-sec guild-heading-sec">
                  <h3 className="about-title">Guild Sub-Admins</h3>{" "}
                </div>
                <div className="sub-admin-top-flex-block-pill">
                  <div className="sub-admin-top-flex-block-pill-box">
                    <div className="d-flex align-center justify-content-between">
                      <div
                        className={`rounded-pill ps-3 pe-3 pt-1 pb-1 top-activity-filter-pill active`}
                      >
                        Sub-Admin Roles
                        {totalRoleListCount ? ` (${totalRoleListCount})` : ""}
                      </div>

                      <div className="create-role-section">
                        <div className="sub-admin-title-button-section d-flex justify-content-around align-items-center">
                          {guildUserMenuPermissionList?.create_guild_role ? (
                            <button
                              className=" create-role-button-subadmin "
                              onClick={() => handleCreateRole()}
                            >
                              <BsPlusCircle />{" "}
                              <div className="ms-2">CREATE NEW ROLE</div>
                            </button>
                          ) : (
                            ""
                          )}
                          <div className="py-2 search-block me-2 ms2">
                            <div className="filt-flex-search ">
                              <input
                                type="text"
                                value={guildRoleListProp?.search}
                                className="search-box-add guild"
                                placeholder={`Search Roles`}
                                onKeyPress={handleUserSearchKeyPressEvent}
                                onChange={(e) => sendUserSeacrhFilter(e)}
                              />{" "}
                              <span
                                role="button"
                                className="search-button"
                                onClick={() => handleTextUserSearch}
                              >
                                <BiSearch size={15} />
                              </span>
                              {guildRoleListProp?.search && (
                                <span
                                  role="button"
                                  className="search-close-button"
                                  onClick={() => {
                                    handleTextUserSearch(true);
                                  }}
                                >
                                  <AiOutlineClose size={15} />
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="user-profile-table-section">
                  <div className="user-profile-table-section-block">
                    {!roleListLoading ? (
                      totalRoleListCount > 0 ? (
                        <table className="w-100 user-profile-table ms">
                          <thead>
                            <tr>
                              <th className="slno">SR NO</th>
                              <th>Role Name </th>
                              <th className="table-text-center">
                                Scholars Assigned
                              </th>
                              {/* <th className="table-text-center">View</th> */}

                              {(() => {
                                if (
                                  guildUserMenuPermissionList?.update_guild_role ||
                                  guildUserMenuPermissionList?.destroy_guild_role
                                ) {
                                  return (
                                    <th className="table-text-right">
                                      Actions
                                    </th>
                                  );
                                }
                              })()}
                            </tr>
                          </thead>
                          <tbody>
                            {roleListTableData?.map((obj, index) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    {(parseInt(roleListCurrentPage) - 1) *
                                      roleListPageSize +
                                      (index + 1)}
                                  </td>
                                  <td>{obj?.name}</td>
                                  <td className="table-text-center">
                                    {obj?.users_count}
                                  </td>
                                  {/* <td className="table-text-center">
                                    <AiOutlineEye
                                      className="role-icons"
                                      onClick={() => getViewRoleMenuData(obj)}
                                    />
                                  </td> */}

                                  {(() => {
                                    if (
                                      guildUserMenuPermissionList?.update_guild_role ||
                                      guildUserMenuPermissionList?.destroy_guild_role
                                    ) {
                                      return (
                                        <td className="table-text-right">
                                          {guildUserMenuPermissionList?.update_guild_role && (
                                            <MdEdit
                                              className="role-icons edit-role"
                                              onClick={() =>
                                                getGuildRoleMenusEditPopUp(obj)
                                              }
                                            />
                                          )}
                                          {guildUserMenuPermissionList?.destroy_guild_role && (
                                            <MdDelete
                                              className="role-icons delete-role"
                                              onClick={() =>
                                                handleDeleteRole(obj)
                                              }
                                            />
                                          )}
                                        </td>
                                      );
                                    }
                                  })()}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      ) : (
                        <p className="loading-text">No Guild Role Found!</p>
                      )
                    ) : (
                      <div className="display-f">
                        <p className="loading-text">Loading</p>
                        <span className="dot-flashing"></span>
                      </div>
                    )}
                  </div>
                </div>

                {totalRoleListCount > 0 ? (
                  <div className="role-list-table-pagination">
                    <PaginationUserProfile
                      className="pagination-bar"
                      currentPage={roleListCurrentPage}
                      totalCount={totalRoleListCount}
                      pageSize={roleListPageSize}
                      onPageChange={(page) => handleRoleListPageChange(page)}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>

              {/* view role popup */}

              <Modal
                show={viewRolePopUp}
                onHide={() => setViewRolePopUp(!viewRolePopUp)}
                className="view-modal-popup"
                backdrop="static"
              >
                <Modal.Header
                  className="view-modal-popup-header-section"
                  closeButton={() => setViewRolePopUp(!viewRolePopUp)}
                >
                  <>
                    <div className="d-flex w-100 justify-content-between align-items-center">
                      <div className="view-modal-popup-header">View Role</div>
                      {guildUserMenuPermissionList?.update_guild_role ? (
                        <button
                          onClick={() => {
                            setViewRolePopUp(false);
                            getGuildRoleMenusEditPopUp(viewData);
                          }}
                          className="edit-button"
                        >
                          {"Edit"}
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                  </>
                </Modal.Header>
                <Modal.Body className="view-modal-popup-body">
                  <>
                    {/* <div className="d-flex align-items-start w-100 flex-column"> */}
                    <InputText
                      title={"SUB-ADMIN ROLE NAME"}
                      placeholder={initialRoleData?.name}
                      className="w-100 twofa-modal-search"
                      disabled
                    />

                    <div className="section-content view-modal-section-heading">
                      <div className=" section-heading d-flex flex-row align-items-center">
                        <div className="p-2 section-head">Permissions</div>
                        <div className="section-titles d-flex flex-row">
                          <div className="view-title">view</div>
                          <div className="edit-title">edit</div>
                        </div>
                      </div>
                      {defalutGuildRoleMenuLoading ? (
                        <div className="display-f">
                          <p className="loading-text">Loading</p>
                          <span className="dot-flashing"></span>
                        </div>
                      ) : (
                        <div className="section-selections">
                          {viewRolePopUpData?.map(
                            (roleMenuData, roleMenuIndex) => (
                              <div key={roleMenuIndex}>
                                <div className="section-heading d-flex flex-row align-items-center">
                                  <div className="section-title p-2">
                                    {roleMenuData?.name}
                                  </div>
                                  <div className="section-icon d-flex flex-row justify-content-between">
                                    <input
                                      className="form-check-input view-check p-2 m-2"
                                      id="flexCheckDefault"
                                      type="checkbox"
                                      // value={
                                      //   guildRolePermissions?.find(
                                      //     (obj) =>
                                      //       obj?.guild_menu_id ===
                                      //       roleMenuData?.slug
                                      //   )?.actions?.view
                                      // }
                                      disabled={true}
                                      checked={roleMenuData?.actions?.view}
                                    />
                                    <input
                                      className="form-check-input view-check p-2 m-2"
                                      id="flexCheckDefault"
                                      type="checkbox"
                                      disabled={true}
                                      checked={roleMenuData?.actions?.edit}
                                    />
                                  </div>
                                </div>
                              </div>
                            )
                          )}

                          {/* <button
                            onClick={() => CreateRole()}
                            className="save-button"
                            disabled
                          >
                            {createRoleLoading ? "Saving..." : "Save"}
                          </button> */}
                        </div>
                      )}
                    </div>

                    {/* </div> */}
                  </>
                </Modal.Body>
              </Modal>
              {/* create role popup */}
              <Modal
                show={createRolePopUp}
                onHide={() => setCreateRolePopUp(!createRolePopUp)}
                className="view-modal-popup"
                backdrop="static"
              >
                <Modal.Header
                  className="view-modal-popup-header-section"
                  closeButton={() => setCreateRolePopUp(!createRolePopUp)}
                >
                  <>
                    <div className="view-modal-popup-header">
                      Create New Role
                    </div>
                  </>
                </Modal.Header>
                <Modal.Body className="view-modal-popup-body">
                  <>
                    {/* <div className="d-flex align-items-start w-100 flex-column"> */}
                    <InputText
                      title={"ROLE NAME"}
                      placeholder={"Role Name"}
                      className="view-modal-input-search"
                      lengthValue={50}
                      value={createGuildRoleName}
                      onChange={(e) => setCreateRoleName(e.target.value)}
                    />
                    {roleNameValidation ? (
                      <p className="error_text">Enter a valid Role Name</p>
                    ) : null}

                    <div className="section-content view-modal-section-heading">
                      <div className=" section-heading d-flex flex-row align-items-center">
                        <div className="p-2 section-head">Permissions</div>
                        <div className="section-titles d-flex flex-row">
                          <div className="view-title">view</div>
                          <div className="edit-title">edit</div>
                        </div>
                      </div>
                      {defalutGuildRoleMenuLoading ? (
                        <div className="display-f">
                          <p className="loading-text">Loading</p>
                          <span className="dot-flashing"></span>
                        </div>
                      ) : (
                        <div className="section-selections">
                          {defalutGuildRoleMenus?.map(
                            (roleMenuData, roleMenuIndex) => (
                              <div key={roleMenuIndex}>
                                <div className="section-heading d-flex flex-row align-items-center">
                                  <div className="section-title p-2">
                                    {roleMenuData?.name}
                                  </div>
                                  <div className="section-icon d-flex flex-row justify-content-between">
                                    <input
                                      className="form-check-input view-check p-2 m-2"
                                      id="flexCheckDefault"
                                      type="checkbox"
                                      // value={
                                      //   guildRolePermissions?.find(
                                      //     (obj) =>
                                      //       obj?.guild_menu_id ===
                                      //       roleMenuData?.slug
                                      //   )?.actions?.view
                                      // }
                                      defaultChecked={
                                        guildRolePermissions?.find(
                                          (obj) =>
                                            obj?.guild_menu_id ===
                                            roleMenuData?.slug
                                        )?.actions?.view
                                          ? true
                                          : false
                                      }
                                      disabled={
                                        guildRolePermissions?.find(
                                          (obj) =>
                                            obj?.guild_menu_id ===
                                            roleMenuData?.slug
                                        )?.actions?.edit
                                      }
                                      checked={
                                        guildRolePermissions?.find(
                                          (obj) =>
                                            obj?.guild_menu_id ===
                                            roleMenuData?.slug
                                        )?.actions?.view && "checked"
                                      }
                                      onChange={(e) =>
                                        handleCreateGuildMenu(
                                          e,
                                          roleMenuData?.slug,
                                          "view"
                                        )
                                      }
                                    />
                                    <input
                                      className="form-check-input view-check p-2 m-2"
                                      id="flexCheckDefault"
                                      type="checkbox"
                                      defaultChecked={
                                        guildRolePermissions?.find(
                                          (obj) =>
                                            obj?.guild_menu_id ===
                                            roleMenuData?.slug
                                        )?.actions?.edit
                                      }
                                      checked={
                                        guildRolePermissions?.find(
                                          (obj) =>
                                            obj?.guild_menu_id ===
                                            roleMenuData?.slug
                                        )?.actions?.edit && "checked"
                                      }
                                      onChange={(e) => {
                                        handleCreateGuildMenu(
                                          e,
                                          roleMenuData?.slug,
                                          "edit"
                                        );
                                        if (e.target.checked) {
                                          handleCreateGuildMenu(
                                            e,
                                            roleMenuData?.slug,
                                            "view"
                                          );
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                          {rolePermissionValidation ? (
                            <p className="error_text pl-2">
                              Please Select Aleast Permission
                            </p>
                          ) : null}
                          <button
                            onClick={() => CreateRole()}
                            // className="save-button"
                            className="btn btn-dark mx-auto mt-4 mb-3"
                          >
                            {createRoleLoading ? "Creating..." : "Create"}
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                </Modal.Body>
              </Modal>
              {/* edit role new popup */}
              <Modal
                show={editRolePopUp}
                onHide={() => setEditRolePopUp(!editRolePopUp)}
                className="view-modal-popup"
                backdrop="static"
              >
                <Modal.Header
                  className="view-modal-popup-header-section"
                  closeButton={() => setEditRolePopUp(!editRolePopUp)}
                >
                  <>
                    <div className="view-modal-popup-header">
                      Edit Sub-admin Role
                    </div>
                  </>
                </Modal.Header>
                <Modal.Body className="view-modal-popup-body">
                  <>
                    {/* <div className="d-flex align-items-start w-100 flex-column"> */}
                    <InputText
                      title={"ROLE NAME"}
                      // placeholder={initialRoleData?.name}
                      className="view-modal-input-search"
                      lengthValue={50}
                      value={createGuildRoleName}
                      onChange={(e) => setCreateRoleName(e.target.value)}
                    />
                    {roleNameValidation ? (
                      <p className="error_text">Enter a valid Role Name</p>
                    ) : null}
                    <div className="section-content view-modal-section-heading">
                      <div className=" section-heading d-flex flex-row">
                        <div className="p-2 section-head">Permissions</div>
                        <div className="section-titles d-flex flex-row justify-content-between ">
                          <div className="p-2 view-title">view</div>
                          <div className="p-2 edit-title">edit</div>
                        </div>
                      </div>
                      <div className="section-selections">
                        {viewRolePopUpData?.map(
                          (roleMenuData, roleMenuIndex) => (
                            <div key={roleMenuIndex}>
                              <div className="section-heading d-flex flex-row">
                                <div className="section-title p-2">
                                  {roleMenuData?.name}
                                </div>
                                <div className="section-icon d-flex flex-row justify-content-between">
                                  <input
                                    className="form-check-input view-check p-2 m-2"
                                    id="flexCheckDefault"
                                    type="checkbox"
                                    defaultChecked={
                                      roleMenuData?.actions?.view ||
                                      guildRolePermissions?.find(
                                        (obj) =>
                                          obj?.guild_menu_id ===
                                          roleMenuData?.slug
                                      )?.actions?.view
                                    }
                                    checked={
                                      roleMenuData?.actions?.view ||
                                      guildRolePermissions?.find(
                                        (obj) =>
                                          obj?.guild_menu_id ===
                                          roleMenuData?.slug
                                      )?.actions?.view
                                    }
                                    onChange={(e) =>
                                      handleEditGuildMenu(
                                        e,
                                        roleMenuData?.slug,
                                        "view"
                                      )
                                    }
                                    disabled={
                                      guildRolePermissions?.find(
                                        (obj) =>
                                          obj?.guild_menu_id ===
                                          roleMenuData?.slug
                                      )?.actions?.edit
                                    }
                                  />
                                  <input
                                    className="form-check-input view-check p-2 m-2"
                                    id="flexCheckDefault"
                                    type="checkbox"
                                    defaultChecked={
                                      roleMenuData?.actions?.edit ||
                                      guildRolePermissions?.find(
                                        (obj) =>
                                          obj?.guild_menu_id ===
                                          roleMenuData?.slug
                                      )?.actions?.edit
                                    }
                                    checked={
                                      roleMenuData?.actions?.edit ||
                                      guildRolePermissions?.find(
                                        (obj) =>
                                          obj?.guild_menu_id ===
                                          roleMenuData?.slug
                                      )?.actions?.edit
                                    }
                                    onChange={(e) => {
                                      handleEditGuildMenu(
                                        e,
                                        roleMenuData?.slug,
                                        "edit"
                                      );
                                      if (e.target.checked) {
                                        handleEditGuildMenu(
                                          e,
                                          roleMenuData?.slug,
                                          "view"
                                        );
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          )
                        )}
                        <button
                          onClick={() => EditRole()}
                          // className="save-button"
                          className="btn btn-dark mx-auto mt-4 mb-3"
                        >
                          {createRoleLoading ? "Saving..." : "save"}
                        </button>
                      </div>
                    </div>

                    {/* </div> */}
                  </>
                </Modal.Body>
              </Modal>
              {/* delete role popup */}
              <Modal
                show={deleteRolePopUp}
                className="delete-role-pop"
                backdrop="static"
              >
                <Modal.Header
                // closeButton={() => setDeleteRolePopUp(!deleteRolePopUp)}
                >
                  <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body className="delete-role-body">
                  <>
                    <h4>
                      Are you sure you want to delete the{" "}
                      <span>{initialRoleData?.name}</span> sub-admin role?
                    </h4>
                    <div className="d-flex align-items-center justify-content-evenly w-75">
                      <button
                        className="btn btn-dark"
                        onClick={() => deleteGuildRoleApi()}
                      >
                        {!deleteRoleLoading ? "YES" : "DELETING..."}
                      </button>
                      <button
                        className="btn btn-dark-secondary"
                        onClick={() => setDeleteRolePopUp(!deleteRolePopUp)}
                      >
                        NO
                      </button>
                    </div>
                  </>
                </Modal.Body>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementSubAdmin;
