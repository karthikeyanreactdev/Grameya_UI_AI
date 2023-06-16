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

export const store = configureStore({
  reducer: {
    user,
    chat,
    email,
    invoice,
    calendar,
    permissions,
    auth,
    manageJob,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
