import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    loader: false,
};

const authslice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        userExists: (state, action) => {
            state.user = action.payload;
            state.loader = false;
        },
        userNotExits: (state) => {
            state.user = null;
            state.loader = false;
        }
    }
});

export const { userExists, userNotExits } = authslice.actions;

export default authslice.reducer;
