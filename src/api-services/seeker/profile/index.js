import { apiGet, apiPost, apiPut } from "src/utils/axios";
import { baseURL } from "src/utils/pathConst";

const getProfileUrl = `${baseURL}/profile`;
const updateProfileUrl = `${baseURL}/job-seeker/update_profile`;
const addJobseekerExperienceUrl = `${baseURL}/job-seeker/update_experience`;

export const getProfile = () => {
  return apiGet(getProfileUrl);
};

export const updateProfile = (bodyParams) => {
  return apiPut(updateProfileUrl, bodyParams);
};

export const addJobseekerExperience = (bodyParams) => {
  return apiPost(addJobseekerExperienceUrl, bodyParams);
};

export const updateJobseekerExperience = (bodyParams) => {
  return apiPut(addJobseekerExperienceUrl, bodyParams);
};
