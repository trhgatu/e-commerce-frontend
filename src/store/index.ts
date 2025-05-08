import {configureStore} from '@reduxjs/toolkit';
import filterReducer from './filterSlice'
import authReducer from './authSlice'

export const store = configureStore({
    reducer: {
        filter: filterReducer,
        auth: authReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

