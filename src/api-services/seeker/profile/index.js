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
const updateResumeUrl = `${baseURL}/job-seeker/upload_resume`;
const removeResumeUrl = `${baseURL}/job-seeker/delete_resume`;
const addCertificationSeekerUrl = `${baseURL}/job-seeker/add_certification`;
const updateCertificationSeekerUrl = `${baseURL}/job-seeker/update_certification`;
const deleteCertificationSeekerUrl = `${baseURL}/job-seeker/delete_certification`;

export const getProfile = () => {
  return apiGet(getProfileUrl);
};

export const updateResume = (bodyParams) => {
  return apiPut(updateResumeUrl, bodyParams);
};

export const removeResume = () => {
  return apiDelete(removeResumeUrl);
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
  return apiDelete(removeJobseekerExperienceUrl, bodyParams);
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

export const addCertificationSeeker = (bodyParams) => {
  return apiPost(addCertificationSeekerUrl, bodyParams);
};

export const editCertificationSeeker = (bodyParams) => {
  return apiPut(updateCertificationSeekerUrl, bodyParams);
};

export const removeCertificationSeeker = (bodyParams) => {
  return apiDelete(deleteCertificationSeekerUrl, bodyParams);
};
