import { Avatar, Box, Dialog, Typography } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSocket } from '../Auth/Socket';
import { Close } from '@mui/icons-material';
import { setrejectcall, setrejectcalltext } from '../Redux/misc';

const RejectCallDailog = () => {
    const { rejectcall, rejectcalltext } = useSelector((state) => state.misc);
    const { from, to } = useSocket();
    const dispatch = useDispatch();
    const close = () => {
        dispatch(setrejectcall(false))
        dispatch(setrejectcalltext(""))
    }
    return (
        <Dialog open={rejectcall} minWidth="xl" onClose={close}  >
            <Box className="flex justify-end items-center px-2 pt-1 mb-0 "> <Close onClick={close} /></Box>
            <Box className=
                "px-10 pb-4 ">

                <Typography sx={{
                    marginY: "1rem"
                }} variant='subtitle1' className='my-3 text-center'>
                    {rejectcalltext}
                </Typography>
                <Box className="flex  flex-col  gap-1 justify-center items-center">
                    <Avatar src={to?.avatar} />
                    <Typography className='font-bold'>
                        {to?.username}
                    </Typography>
                </Box>

            </Box>
        </Dialog>
    )
}

export default RejectCallDailog
