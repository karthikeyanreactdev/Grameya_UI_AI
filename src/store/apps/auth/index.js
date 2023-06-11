import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet, apiPost } from "src/utils/axios";
import { errorHandler } from "src/utils/errorHandler";
import {
  forgotPasswordUrl,
  loginUrl,
  registerUrl,
  userProfileUrl,
} from "src/utils/pathConst";

export const authLogin = createAsyncThunk(
  "auth/authLogin",
  async ({ formValue }, { rejectWithValue }) => {
    try {
      const response = await apiPost(`${loginUrl}`, formValue);
      return response;
    } catch (error) {
      return rejectWithValue(errorHandler(error));
    }
  }
);
export const getUserData = createAsyncThunk(
  "auth/getUserData",
  async ({}, { rejectWithValue }) => {
    try {
      let response = await apiGet(`${userProfileUrl}`);

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(errorHandler(error));
    }
  }
);
export const authForgotPasswor = createAsyncThunk(
  "auth/authForgotPasswor",
  async ({ formValue }, { rejectWithValue }) => {
    try {
      const response = await apiPost(`${forgotPasswordUrl}`, formValue);
      return response;
    } catch (error) {
      return rejectWithValue(errorHandler(error));
    }
  }
);

export const authRegister = createAsyncThunk(
  "auth/authRegister",
  async ({ formValue }, { rejectWithValue }) => {
    try {
      const response = await apiPost(`${registerUrl}`, formValue);
      return response;
    } catch (error) {
      return rejectWithValue(errorHandler(error));
    }
  }
);

export const appAuthSlice = createSlice({
  name: "appAuth",
  initialState: {
    isLoading: false,
    userData: [],
  },
  reducers: {
    handleUserData: (state, action) => {
      state.userData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(authLogin.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(authLogin.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(authLogin.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(getUserData.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getUserData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userData = action.payload;
    });
    builder.addCase(getUserData.rejected, (state, action) => {
      state.isLoading = false;
    });
  },
});
export const { handleUserData } = appAuthSlice.actions;

export default appAuthSlice.reducer;
