import { apiDelete, apiGet, apiPost, apiPut } from "src/utils/axios";
import { baseURL } from "src/utils/pathConst";

const sheduleInterViewUrl = `${baseURL}/recruiter/schedule_interview`;
const deleteCandidateUrl = `${baseURL}/recruiter/remove_from_short_list`;
const addShortListUrl = `${baseURL}/recruiter/add_to_short_list`;
const updateShortListUrl = `${baseURL}/recruiter/update_short_list`;

export const sheduleInterview = (bodyParams) => {
  return apiPost(sheduleInterViewUrl, bodyParams);
};
export const deleteShortListedCandidate = (bodyParams) => {
  return apiDelete(deleteCandidateUrl, bodyParams);
};
export const addShortList = (bodyParams) => {
  return apiPut(addShortListUrl, bodyParams);
};
export const updateShortLisedCandidate = (bodyParams) => {
  return apiPut(updateShortListUrl, bodyParams);
};
