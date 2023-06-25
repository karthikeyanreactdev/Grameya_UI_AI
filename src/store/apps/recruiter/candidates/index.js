import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet, apiPost } from "src/utils/axios";
import { errorHandler } from "src/utils/errorHandler";
import { baseURL } from "src/utils/pathConst";

const getCandidatesUrl = `${baseURL}/recruiter/short_list`;

export const getCandidateList = createAsyncThunk(
  "candidates/getCandidateList",
  async (params, { rejectWithValue }) => {
    try {
      const response = await apiPost(`${getCandidatesUrl}`, params);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(errorHandler(error));
    }
  }
);

export const candidatesSlice = createSlice({
  name: "candidates",
  initialState: {
    isLoading: false,
    shortListedCandidatesList: [],
    pageCount: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCandidateList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getCandidateList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.shortListedCandidatesList = action.payload?.data;
      state.pageCount = action.payload;
    });
    builder.addCase(getCandidateList.rejected, (state, action) => {
      state.isLoading = false;
    });
  },
});
//export const { handleUserData } = appAuthSlice.actions;

export default candidatesSlice.reducer;
