import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet, apiPost } from "src/utils/axios";
import { errorHandler } from "src/utils/errorHandler";
import { baseURL } from "src/utils/pathConst";

const jobSearchUrl = `${baseURL}/job-seeker/search_jobs`;

export const jobSearchSeeker = createAsyncThunk(
  "jobSearch/jobSearchSeeker",
  async (params, { rejectWithValue }) => {
    try {
      const response = await apiPost(`${jobSearchUrl}`, params);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(errorHandler(error));
    }
  }
);

export const jobSearchSlice = createSlice({
  name: "jobSearch",
  initialState: {
    isLoading: false,
    machedJobList: [],
    pageCount: "",
  },
  reducers: {
    handleMachedJobList: (state, action) => {
      state.machedJobList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(jobSearchSeeker.pending, (state, action) => {
      state.isLoading = true;
      state.machedJobList = [];
      state.pageCount = "";
    });
    builder.addCase(jobSearchSeeker.fulfilled, (state, action) => {
      state.isLoading = false;
      state.machedJobList = action.payload?.data;
      state.pageCount = action.payload;
    });
    builder.addCase(jobSearchSeeker.rejected, (state, action) => {
      state.isLoading = false;
    });
  },
});
export const { handleMachedJobList } = jobSearchSlice.actions;

export default jobSearchSlice.reducer;
