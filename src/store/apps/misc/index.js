import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet, apiPost } from "src/utils/axios";
import { errorHandler } from "src/utils/errorHandler";
import { baseURL } from "src/utils/pathConst";

const enumUrl = `${baseURL}/enum_by_type?type=`;
const jobCategoryUrl = `${enumUrl}JobCategory`;
// const jobSubCategoryUrl = `${enumUrl}job_applications`;
// const skillUrl = `${enumUrl}Skills&search=dev`;
const skillUrl = `${enumUrl}Skills`;
const jobTypeUrl = `${enumUrl}JobTypes`;
const noticePeriodUrl = `${enumUrl}NoticePeriod`;

export const getJobCategory = createAsyncThunk(
  "misc/getJobCategory",
  async ({}, { rejectWithValue }) => {
    try {
      const response = await apiGet(`${jobCategoryUrl}`);
      return response?.data?.data?.records;
    } catch (error) {
      return rejectWithValue(errorHandler(error));
    }
  }
);
export const getSkills = createAsyncThunk(
  "misc/getSkills",
  async ({}, { rejectWithValue }) => {
    try {
      const response = await apiGet(`${skillUrl}`);
      return response?.data?.data?.records;
    } catch (error) {
      return rejectWithValue(errorHandler(error));
    }
  }
);
export const getJobType = createAsyncThunk(
  "misc/getJobType",
  async ({}, { rejectWithValue }) => {
    try {
      const response = await apiGet(`${jobTypeUrl}`);
      return response?.data?.data?.records;
    } catch (error) {
      return rejectWithValue(errorHandler(error));
    }
  }
);
export const getNoticePeriod = createAsyncThunk(
  "misc/getNoticePeriod",
  async ({}, { rejectWithValue }) => {
    try {
      const response = await apiGet(`${noticePeriodUrl}`);
      return response?.data?.data?.records;
    } catch (error) {
      return rejectWithValue(errorHandler(error));
    }
  }
);

export const miscSlice = createSlice({
  name: "misc",
  initialState: {
    isLoading: false,
    jobCategory: [],
    skills: [],
    noticePeriod: [],
    jobType: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getJobCategory.pending, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(getJobCategory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.jobCategory = action.payload;
    });
    builder.addCase(getJobCategory.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(getSkills.pending, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(getSkills.fulfilled, (state, action) => {
      state.isLoading = false;
      state.skills = action.payload;
    });
    builder.addCase(getSkills.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(getJobType.pending, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(getJobType.fulfilled, (state, action) => {
      state.isLoading = false;
      state.jobType = action.payload;
    });
    builder.addCase(getJobType.rejected, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(getNoticePeriod.pending, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(getNoticePeriod.fulfilled, (state, action) => {
      state.isLoading = false;
      state.noticePeriod = action.payload;
    });
    builder.addCase(getNoticePeriod.rejected, (state, action) => {
      state.isLoading = false;
    });
  },
});
//export const { handleUserData } = appAuthSlice.actions;

export default miscSlice.reducer;
