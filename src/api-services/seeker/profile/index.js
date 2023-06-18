import { apiDelete, apiGet, apiPost, apiPut } from "src/utils/axios";
import { baseURL } from "src/utils/pathConst";

const getProfileUrl = `${baseURL}/profile`;
const updateProfileUrl = `${baseURL}/job-seeker/update_profile`;
const addJobseekerExperienceUrl = `${baseURL}/job-seeker/add_experience`;
const updateJobseekerExperienceUrl = `${baseURL}/job-seeker/update_experience`;
const removeJobseekerExperienceUrl = `${baseURL}/job-seeker/delete_experience`;
const getEnumByTyUrl = `${baseURL}/enum_by_type`;
const addJobseekerEducationUrl = `${baseURL}/job-seeker/add_education`;
const updateJobseekerEducationUrl = `${baseURL}/job-seeker/update_education`;
const deleteJobseekerEducationUrl = `${baseURL}/job-seeker/delete_education`;

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
  return apiPut(updateJobseekerExperienceUrl, bodyParams);
};

export const removeJobseekerExperience = (bodyParams) => {
  return apiPut(removeJobseekerExperienceUrl, bodyParams);
};

export const getEnumByType = (type) => {
  return apiGet(getEnumByTyUrl + type);
};

export const addJobseekerEducation = (bodyParams) => {
  return apiPost(addJobseekerEducationUrl, bodyParams);
};

export const updateJobseekerEducation = (bodyParams) => {
  return apiPut(updateJobseekerEducationUrl, bodyParams);
};

export const removeJobseekerEducation = (bodyParams) => {
  return apiDelete(deleteJobseekerEducationUrl, bodyParams);
};
