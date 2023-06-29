import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet, apiPost } from "src/utils/axios";
import { errorHandler } from "src/utils/errorHandler";
import { baseURL } from "src/utils/pathConst";

const getAppliedSeekerUrl = `${baseURL}/recruiter/applicants`;

export const getAppliedSeekerProfile = createAsyncThunk(
  "appliedCandidateProfile/getAppliedSeekerProfile",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiGet(`${getAppliedSeekerUrl}/${id}`);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(errorHandler(error));
    }
  }
);

export const appliedCandidateProfileSlice = createSlice({
  name: "appliedCandidateProfile",
  initialState: {
    isLoadingFlag: false,
    appliedCandidateProfile: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAppliedSeekerProfile.pending, (state, action) => {
      state.isLoadingFlag = true;
    });
    builder.addCase(getAppliedSeekerProfile.fulfilled, (state, action) => {
      state.isLoadingFlag = false;
      state.appliedCandidateProfile = action.payload;
    });
    builder.addCase(getAppliedSeekerProfile.rejected, (state, action) => {
      state.isLoadingFlag = false;
    });
  },
});
//export const { handleUserData } = appAuthSlice.actions;

export default appliedCandidateProfileSlice.reducer;
