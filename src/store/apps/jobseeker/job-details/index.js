import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet, apiPost } from "src/utils/axios";
import { errorHandler } from "src/utils/errorHandler";
import { baseURL } from "src/utils/pathConst";

const getAppliedSeekerUrl = `${baseURL}/recruiter/applicants`;

export const getAppliedSeekerProfile = createAsyncThunk(
  "jobDetailSeekerView/getAppliedSeekerProfile",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiGet(`${getAppliedSeekerUrl}/${id}`);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(errorHandler(error));
    }
  }
);

export const jobDetailSeekerViewSlice = createSlice({
  name: "jobDetailSeekerView",
  initialState: {
    isLoadingFlag: false,
    jobDetailSeeker: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(jobDetailSeeker.pending, (state, action) => {
      state.isLoadingFlag = true;
    });
    builder.addCase(jobDetailSeeker.fulfilled, (state, action) => {
      state.isLoadingFlag = false;
      state.jobDetailSeekerView = action.payload;
    });
    builder.addCase(jobDetailSeeker.rejected, (state, action) => {
      state.isLoadingFlag = false;
    });
  },
});
//export const { handleUserData } = appAuthSlice.actions;

export default jobDetailSeekerViewSlice.reducer;
