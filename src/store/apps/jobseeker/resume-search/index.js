import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet, apiPost } from "src/utils/axios";
import { errorHandler } from "src/utils/errorHandler";
import { baseURL } from "src/utils/pathConst";

const resumeSearchUrl = `${baseURL}/recruiter/search_employee`;

export const resumeCandidates = createAsyncThunk(
  "resumeSearch/resumeCandidates",
  async (params, { rejectWithValue }) => {
    try {
      const response = await apiPost(`${resumeSearchUrl}`, params);
      return response?.data?.data?.data;
    } catch (error) {
      return rejectWithValue(errorHandler(error));
    }
  }
);

export const resumeSearchSlice = createSlice({
  name: "resumeSearch",
  initialState: {
    isLoading: false,
    resumeSearchList: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(resumeCandidates.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(resumeCandidates.fulfilled, (state, action) => {
      state.isLoading = false;
      state.resumeSearchList = action.payload;
    });
    builder.addCase(resumeCandidates.rejected, (state, action) => {
      state.isLoading = false;
    });
  },
});
//export const { handleUserData } = appAuthSlice.actions;

export default resumeSearchSlice.reducer;
