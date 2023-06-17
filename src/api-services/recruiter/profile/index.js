import { apiGet, apiPost, apiPut } from "src/utils/axios";
import { baseURL } from "src/utils/pathConst";

const updateUserInfo = `${baseURL}/recruiter/update_profile`;

export const updateProfile = (bodyParams) => {
  return apiPut(updateUserInfo, bodyParams);
};
