import { apiGet, apiPost } from "src/utils/axios";
import { baseURL } from "src/utils/pathConst";

const postJob = `${baseURL}/recruiter/post_jobs`;
const getJob = `${baseURL}/recruiter/view_job`;
const updateJob = `${baseURL}/recruiter/update_job`;
const enumUrl = `${baseURL}/enum_by_type?type=JobSubCategory&job_category_id=`;
export const createJob = (bodyParams) => {
  return apiPost(postJob, bodyParams);
};
export const getJobById = (id) => {
  return apiGet(getJob + "/" + id);
};
export const updateJobById = (bodyParams) => {
  return apiPost(updateJob, bodyParams);
};
export const getJobSubCategoryById = (id) => {
  return apiGet(enumUrl + id);
};
