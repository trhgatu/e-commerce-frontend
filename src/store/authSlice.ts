// src/store/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/services/axios';
import { AxiosError } from 'axios';

interface AuthState {
    isAuthenticated: boolean;
    user: { _id: string; email: string; name: string, role: string } | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

type AuthResponse = {
    user: { _id: string; email: string; name: string, role: string };
    token: string;
};

type ErrorResponse = {
    message: string;
};

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null,
};

export const login = createAsyncThunk<
    AuthResponse,
    { email: string; password: string },
    { rejectValue: string }
>(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/auth/login', { email, password });
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
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
        },
    },
    extraReducers: builder => {
        builder
            .addCase(login.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
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