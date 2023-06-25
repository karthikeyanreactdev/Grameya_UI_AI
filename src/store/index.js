// ** Toolkit imports
import { configureStore } from "@reduxjs/toolkit";

// ** Reducers
import chat from "src/store/apps/chat";
import user from "src/store/apps/user";
import email from "src/store/apps/email";
import invoice from "src/store/apps/invoice";
import calendar from "src/store/apps/calendar";
import permissions from "src/store/apps/permissions";
import auth from "src/store/apps/auth/index";
import manageJob from "src/store/apps/recruiter/manageJob/index";
import applications from "src/store/apps/recruiter/applications/index";
import applicants from "src/store/apps/recruiter/applicants/index";
import candidates from "src/store/apps/recruiter/candidates/index";
import resumeSearch from "src/store/apps/recruiter/resume-search/index";
import appliedJobs from "src/store/apps/jobseeker/applications/index";
import jobSearch from "src/store/apps/jobseeker/job-search/index";
import misc from "src/store/apps/misc/index";
export const store = configureStore({
  reducer: {
    user,
    chat,
    email,
    invoice,
    calendar,
    permissions,
    auth,
    //recruiter
    manageJob,
    resumeSearch,
    applications,
    candidates,
    applicants,
    //enum
    misc,
    //seeker
    appliedJobs,
    jobSearch,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
