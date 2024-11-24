import { configureStore } from '@reduxjs/toolkit';
import misslice from './misc';
import authReducer from './auth'; // Updated import for authslice
import snackbarReducer from './snackbarslice';
import api from './api';
import chatReducer from './chat'

export const store = configureStore({
    reducer: {
        misc: misslice.reducer,
        auth: authReducer, // Using the default export as the auth reducer
        snackbar: snackbarReducer,
        chat: chatReducer,
        [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
});
