// src/store/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { IUser } from '@/types';
import type { AxiosError } from 'axios';
import type { LoginFormValues } from '@/features/admin/auth/validators/loginSchema';
// Update the import path below to the correct relative path if needed
import {
  login as loginApi,
  logout as logoutApi,
  getMe,
} from '@/features/admin/auth/services/authService';

interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: IUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

type AuthResponse = {
  user: IUser;
  token: string;
};

type ErrorResponse = {
  message: string;
};

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const restoreAuth = createAsyncThunk<
  AuthResponse,
  void,
  { rejectValue: string }
>('auth/restoreAuth', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const user = await getMe();
    return { token, user };
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    return rejectWithValue(
      err.response?.data?.message || 'Failed to restore auth'
    );
  }
});

export const login = createAsyncThunk<
  AuthResponse,
  LoginFormValues,
  { rejectValue: string }
>('auth/login', async (data, { rejectWithValue }) => {
  try {
    const { user, token } = await loginApi(data);
    return { user, token };
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logoutUser',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await logoutApi();
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return rejectWithValue(err.response?.data?.message || 'Logout failed');
    } finally {
      dispatch(logout());
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.isInitialized = true;
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreAuth.pending, (state) => {
        state.isInitialized = false;
        state.loading = true;
        state.error = null;
      })
      .addCase(restoreAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isInitialized = true;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(restoreAuth.rejected, (state) => {
        state.loading = false;
        state.isInitialized = true;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isInitialized = true;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;