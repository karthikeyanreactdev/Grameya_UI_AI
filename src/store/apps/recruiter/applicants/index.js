import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet, apiPost } from "src/utils/axios";
import { errorHandler } from "src/utils/errorHandler";
import { baseURL } from "src/utils/pathConst";

const getApplicants = `${baseURL}/recruiter/applicants`;

export const getAppliedCandidateList = createAsyncThunk(
  "applicants/getJobList",
  async (params, { rejectWithValue }) => {
    try {
      const response = await apiPost(`${getApplicants}`, params);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(errorHandler(error));
    }
  }
);

export const applicantsSlice = createSlice({
  name: "applicants",
  initialState: {
    isLoading: false,
    appliedCandidateList: [],
    pageCount: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAppliedCandidateList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAppliedCandidateList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.appliedCandidateList = action.payload?.data;
      state.pageCount = action.payload;
    });
    builder.addCase(getAppliedCandidateList.rejected, (state, action) => {
      state.isLoading = false;
    });
  },
});
//export const { handleUserData } = appAuthSlice.actions;

export default applicantsSlice.reducer;
