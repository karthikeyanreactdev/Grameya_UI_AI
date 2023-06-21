import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet, apiPost } from "src/utils/axios";
import { errorHandler } from "src/utils/errorHandler";
import { baseURL } from "src/utils/pathConst";

const getAppliedJobsUrl = `${baseURL}/job-seeker/applied_jobs`;

export const getAppliedJobs = createAsyncThunk(
  "appliedJobs/getJobList",
  async (params, { rejectWithValue }) => {
    try {
      const response = await apiPost(`${getAppliedJobsUrl}`, params);
      return response?.data?.data?.data;
    } catch (error) {
      return rejectWithValue(errorHandler(error));
    }
  }
);

export const appliedJobsSlice = createSlice({
  name: "appliedJobs",
  initialState: {
    isLoading: false,
    appliedJobs: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAppliedJobs.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAppliedJobs.fulfilled, (state, action) => {
      state.isLoading = false;
      state.appliedJobs = action.payload;
    });
    builder.addCase(getAppliedJobs.rejected, (state, action) => {
      state.isLoading = false;
    });
  },
});
//export const { handleUserData } = appAuthSlice.actions;

export default appliedJobsSlice.reducer;
