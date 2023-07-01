import { apiDelete, apiGet, apiPost, apiPut } from "src/utils/axios";
import { baseURL } from "src/utils/pathConst";

const updateUserInfo = `${baseURL}/recruiter/update_profile`;

const uploadFilesUrl = `${baseURL}/update_profile_image`;
const deleteFilesUrl = `${baseURL}/remove_profile_image`;
// const DELETE_FILES = AUTH_SERVER_URL + "/profile/remove_profile_image";
export const updateProfile = (bodyParams) => {
  return apiPut(updateUserInfo, bodyParams);
};

export const uploadFile = function (payload) {
  return apiPut(uploadFilesUrl, payload);
};

export const deleteFile = function (payload) {
  return apiDelete(deleteFilesUrl, payload);
};
