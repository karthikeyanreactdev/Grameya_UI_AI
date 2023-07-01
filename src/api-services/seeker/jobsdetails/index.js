import { apiGet, apiPost } from "src/utils/axios";
import { baseURL } from "src/utils/pathConst";

const getJob = `${baseURL}/job-seeker/view_job`;

export const getSeekerJobDetailsById = (id) => {
  return apiGet(getJob + "/" + id);
};
