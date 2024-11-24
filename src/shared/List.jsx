import { Box, CircularProgress, Dialog, DialogTitle, Divider, Typography } from '@mui/material'
import React, { memo } from 'react'
import CloseIcon from '@mui/icons-material/Close';

const List = ({ open, handleclose, title, list, serach, loading, submit }) => {
    return (
        <Dialog
            open={open}
            onClose={handleclose}
        >
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingX: ".5rem",
                minWidth: "30rem"
            }}>
                <DialogTitle>
                    <Typography variant="h6" fontWeight={"semibold"}>{title}</Typography>
                </DialogTitle>
                <CloseIcon sx={{ ":hover": { color: "grey" } }} onClick={handleclose} />
            </Box>
            <Divider />
            {serach}
            <Divider />
            {loading ? <CircularProgress /> : list}
            {submit && submit}
        </Dialog>
    )
}

export default memo(List)
