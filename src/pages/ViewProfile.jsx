import React, { useEffect } from 'react'
import Applayout from '../Layout/Applayout'
import { Avatar, Box, Button, Stack, Typography } from '@mui/material'
import { ArrowLeftOutlined, KeyboardBackspace, KeyboardBackspaceOutlined } from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import Avatarcard from '../shared/Avatarcard'
import { useLazyViewuserprofileQuery } from '../Redux/api'


const ViewProfile = ({ chatId, user, chats = [], archived = {}, newmessagesAlert = [] }) => {
    const navigate = useNavigate();
    const [profile, { data, error, isLoading }] = useLazyViewuserprofileQuery();
    const params = useParams();
    const userid = params.id;
     useEffect(() => {
        profile(userid);
     }, [userid])
  console.log(data);
  
     
    return (
        <div className='h-screen'>
            <Box bgcolor={""} height={"100vh"} display={{


            }} >
                <Box className="flex justify-start p-4   ">
                    <KeyboardBackspace fontSize='large' className='text-white p-1   rounded-full bg-indigo-400 text-xl hover:text-gray-600' onClick={() => {
                        navigate(-1)
                    }} />

                </Box>
                <Box className="border  w-[90%] mx-auto   ">
                    <Stack className='border-b-[1px] py-2'>
                        <Typography variant='h6' textAlign={'center'} fontWeight={"bold"}>
                            Profile
                        </Typography>
                        <Typography variant='subtitle2' textAlign={'center'} fontWeight={"medium"}>View   User Profile </Typography>
                    </Stack>
                    <Box className="flex justify-center items-center py-2  ">
                        <Avatar

                            alt="User Avatar"
                             src={data?.user?.avatar}
                            // Replace with your image URL
                            sx={{ width: 60, height: 60 }}
                        // Increase size to 100x100 pixels
                        />
                    </Box>
                    <Box>
                        <Typography variant='h6' fontWeight={"medium"} textAlign={"center"}>
                            {data?.user?.name}
                        </Typography>

                    </Box>
                    <Box>
                        <Typography variant='h6' fontWeight={"medium"} textAlign={"center"}>
                            @  {data?.user?.username}
                        </Typography>

                    </Box>
                    <Box className="flex justify-end gap-4 my-4 px-4 ">
                        <Button variant='contained' sx={{
                            background: "rgb(79 70 229)",
                            ":hover": {
                                background: "rgb(79 70 300)"
                            },
                            size: {
                                md: "large",
                                sm: "small"
                            }

                        }}  >Send Request</Button>
                        <Button variant='contained' sx={{
                            background: "rgb(79 70 229)",
                            ":hover": {
                                background: "rgb(79 70 300)"
                            },
                            size: {
                                md: "large",
                                sm: "small"
                            }

                        }}  >Chat</Button>
                    </Box>



                </Box>

            </Box>
        </div>

    )
}

export default Applayout(ViewProfile)
