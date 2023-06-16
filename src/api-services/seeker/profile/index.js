import { apiGet, apiPost } from "src/utils/axios";
import { baseURL } from "src/utils/pathConst";

const getProfileUrl = `${baseURL}/profile`;

export const getProfile = () => {
  return apiGet(getProfileUrl);
};
