import { Avatar, Box, Stack } from '@mui/material';
import React from 'react';

const Avatarcard = ({ avatar = "", isonline = false }) => {
    // console.log(isonline);

    return (
        <Stack direction={"row"} justifyContent="center" alignItems="center" position={"relative"} >
            <Box width={"5rem"} height={"3rem"} display="flex" justifyContent="center" alignItems="center">
                {isonline && <Box sx={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    position: "absolute",
                    backgroundColor: "green",
                    top: "0",
                    right: "1rem",

                    transform: "translateY(-50)%"
                }} />}
                <Avatar src={avatar}></Avatar>
            </Box>
        </Stack>
    );
};

export default Avatarcard;
