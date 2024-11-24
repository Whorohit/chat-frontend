// Filename: snackbarSlice.js

import { createSlice } from '@reduxjs/toolkit';

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState: {
    open: false,
    message: '',
    severity: 'info', // info, success, error, warning
    loading: false,
  },
  reducers: {
    showSnackbar: (state, action) => {
      state.open = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity || 'info';
      state.loading = action.payload.loading || false;
    },
    hideSnackbar: (state) => {
      state.open = false;
      state.loading = false;
    },
  },
});

export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;

export default snackbarSlice.reducer;
