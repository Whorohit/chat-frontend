
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Snackbar,  CircularProgress, Box, Alert } from '@mui/material';
import { hideSnackbar } from '../Redux/snackbarslice';

const DynamicSnackbar = () => {
    const dispatch = useDispatch();
    const { open, message, severity, loading } = useSelector((state) => state.snackbar);

    const handleClose = () => {
        dispatch(hideSnackbar());
    };

    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} >
            {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={24} />
                    <span>{message}</span>
                </Box>
            ) : (
                <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
                    {message}
                </Alert>
            )}
        </Snackbar>
    );
};

export default DynamicSnackbar;
