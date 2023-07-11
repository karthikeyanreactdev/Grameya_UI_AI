import { apiGet, apiPost, apiPut } from "src/utils/axios";
import { baseURL } from "src/utils/pathConst";

const getJob = `${baseURL}/job-seeker/view_job`;
const saveJobUrl = `${baseURL}/job-seeker/save_job`;
const saveJobListUrl = `${baseURL}/job-seeker/saved_jobs`;
const applyUrl = `${baseURL}/job-seeker/apply_job`;
const recommendedJobDetailUrl = `${baseURL}/job-seeker/recommended_jobs`;

export const getSeekerJobDetailsById = (id) => {
  return apiGet(getJob + "/" + id);
};

export const addSaveJob = (param) => {
  return apiPut(saveJobUrl, param);
};

export const saveJobList = (param) => {
  return apiPost(saveJobListUrl, param);
};

export const applyJobById = (param) => {
  return apiPost(applyUrl, param);
};

export const recommendedJobDetail = (param) => {
  return apiPost(recommendedJobDetailUrl, param);
};
