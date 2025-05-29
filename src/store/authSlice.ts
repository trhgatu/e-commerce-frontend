// src/store/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/services/axios';
import { AxiosError } from 'axios';
import { IUser } from '@/types';

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
>(
    'auth/restoreAuth',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            const response = await axiosInstance.get('/users/me', {
                headers: { Authorization: `Bearer ${token}` },
            });
            return {
                token,
                user: response.data.data,
            };
        } catch (error) {
            const axiosError = error as AxiosError<ErrorResponse>;
            return rejectWithValue(axiosError.response?.data?.message || 'Failed to restore auth');
        }
    }
);
export const login = createAsyncThunk<
    AuthResponse,
    { identifier: string; password: string },
    { rejectValue: string }
>(
    'auth/login',
    async ({ identifier, password }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/auth/login', { identifier, password });
            return response.data as AuthResponse;
        } catch (error) {
            const axiosError = error as AxiosError<ErrorResponse>;
            return rejectWithValue(axiosError.response?.data?.message || 'Login failed');
        }
    }
);

export const register = createAsyncThunk<
    AuthResponse,
    { name: string; email: string; password: string },
    { rejectValue: string }
>(
    'auth/register',
    async ({ name, email, password }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/auth/register', { name, email, password });
            return response.data as AuthResponse;
        } catch (error) {
            const axiosError = error as AxiosError<ErrorResponse>;
            return rejectWithValue(axiosError.response?.data?.message || 'Registration failed');
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
    extraReducers: builder => {
        builder
            .addCase(restoreAuth.pending, state => {
                state.isInitialized = false;
                state.loading = true;
                state.error = null;
            })
            .addCase(restoreAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.isInitialized = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(restoreAuth.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.isInitialized = true;
                state.user = null;
                state.token = null;
                localStorage.removeItem('token');
            })
            .addCase(login.pending, state => {
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
            })
            .addCase(register.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;