import { Box, Button, Typography } from '@mui/material';
import React, { memo, useCallback } from 'react'
import Avatarcard from '../shared/Avatarcard';
import { Link } from 'react-router-dom';
import { useSendRequestMutation } from '../Redux/api';
import { useAsnycMuatation } from '../features/hooks';

const FriendItem = memo(({ i, isfriendlist = false, sendrequest = false, logicfunc = false, logichandler = () => {

}, isLoading = false }) => {
    const { avatar, username, _id, chatIds = [] } = i
    const [sendreq, issendingrequest] = useAsnycMuatation(useSendRequestMutation)

    const sendrequesthandler = useCallback(
        async ({ _id, username }) => {
            sendreq(`Sending Request to ${username} `, { reqid: _id })
        }

        , []
    )

    return (
        <Box className="flex justify-between px-3 py-1 border items-center">
            <Avatarcard className="basis-[33%]" avatar={avatar} />
            <Typography className="basis-[33%]" >{username}</Typography>
            <Box className="flex basis-1/3  flex-col md:flex-row justify-center gap-2 items-center">
                <Link className=' text-center min-w-[7rem] rounded-md  bg-indigo-500 px-2 py-1 hover:bg-indigo-600 text-white hover:text-gray-100' to={`/viewprofile/${_id}`}>View Profile</Link>
                {!sendrequest && isfriendlist && <Link className=' text-center  min-w-[7rem]  rounded-md bg-indigo-500 px-2 py-1 hover:bg-indigo-600 text-white hover:text-gray-100' to={`/chat/${chatIds[0] ? chatIds[0] : ""}`}>Chat</Link>}
                {
                    !isfriendlist && sendrequest && <Button sx={{
                        bgcolor: "rgb(99,102 ,241)",
                        color: "white",
                        paddingY: ".25rem",

                        ":hover": {
                            bgcolor: "rgb(99,102 ,255)",
                            color: "white",
                        }
                    }} variant='contained' className=' text-center  min-w-[7rem]  rounded-md bg-indigo-500 px-2 py-0 hover:bg-indigo-600 text-white hover:text-gray-100'

                        onClick={() => {
                            sendrequesthandler({ _id, username })
                        }} disabled={issendingrequest}  >Request</Button>
                }
                {
                    logicfunc && <Button variant='contained' size='small' sx={{
                        bgcolor: "rgb(99,102 ,241)",
                        color: "white"

                    }} onClick={logichandler}>
                        Add
                    </Button>
                }
            </Box>
        </Box>
    );
});

export default memo(FriendItem)
