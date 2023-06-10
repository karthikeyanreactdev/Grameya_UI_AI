import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiPost } from "src/utils/axios";
import { errorHandler } from "src/utils/errorHandler";
import { forgotPasswordUrl, loginUrl, registerUrl } from "src/utils/pathConst";

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
  },
  reducers: {},
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
  },
});

export default appAuthSlice.reducer;
