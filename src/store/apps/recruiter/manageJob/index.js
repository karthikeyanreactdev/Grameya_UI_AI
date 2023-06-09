import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet, apiPost } from "src/utils/axios";
import { errorHandler } from "src/utils/errorHandler";
import { baseURL } from "src/utils/pathConst";

const getJob = `${baseURL}/recruiter/posted_jobs`;

export const getJobList = createAsyncThunk(
  "manageJob/getJobList",
  async (params, { rejectWithValue }) => {
    try {
      const response = await apiPost(`${getJob}`, params);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(errorHandler(error));
    }
  }
);

export const manageJobSlice = createSlice({
  name: "manageJob",
  initialState: {
    isLoading: false,
    recruiterJobList: [],
    pageCount: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getJobList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getJobList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.recruiterJobList = action.payload?.data;
      state.pageCount = action.payload;
    });
    builder.addCase(getJobList.rejected, (state, action) => {
      state.isLoading = false;
    });
  },
});
//export const { handleUserData } = appAuthSlice.actions;

export default manageJobSlice.reducer;
