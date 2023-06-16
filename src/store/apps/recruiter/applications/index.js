import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet, apiPost } from "src/utils/axios";
import { errorHandler } from "src/utils/errorHandler";
import { baseURL } from "src/utils/pathConst";

const getApplication = `${baseURL}/recruiter/job_applications`;

export const getApplicantsList = createAsyncThunk(
  "applications/getJobList",
  async ( params , { rejectWithValue }) => {
    try {
      const response = await apiPost(`${getApplication}`, params);
      return response?.data?.data?.data;
    } catch (error) {
      return rejectWithValue(errorHandler(error));
    }
  }
);

export const applicationsSlice = createSlice({
  name: "applications",
  initialState: {
    isLoading: false,
    recruiterApplicantsList: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getApplicantsList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getApplicantsList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.recruiterApplicantsList = action.payload;
    });
    builder.addCase(getApplicantsList.rejected, (state, action) => {
      state.isLoading = false;
    });
  },
});
//export const { handleUserData } = appAuthSlice.actions;

export default applicationsSlice.reducer;
