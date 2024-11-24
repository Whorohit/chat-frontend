import React, { Fragment, memo, Suspense, useEffect } from 'react'
import Applayout from '../Layout/Applayout'
import { Avatar, Box, Menu, Skeleton, Stack, Typography } from '@mui/material'
import { ArrowOutwardOutlined, CallReceived, CallReceivedOutlined, KeyboardBackspace } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useGetallcallQuery } from '../Redux/api'
import Avatarcard from '../shared/Avatarcard'
import moment from 'moment'
import { useSocket } from '../Auth/Socket'

const Call = () => {
    const navigate = useNavigate();
    const { data: allcalls, isError, isLoading, error, refetch } = useGetallcallQuery();
    const { socket } = useSocket();
    console.log(allcalls);
    

    return (
        <Stack className="relative p-4  h-[100vh]">
            <Stack direction={"column"} className='px-4  text-xl  '>
                <Stack textAlign={"left"}
                    paddingX={"1rem"}
                    paddingY={".5rem"}


                    className='border-b-[1px]'>
                    <Typography variant='h6' fontWeight={"bold"}>
                        Calls

                    </Typography>
                    <Typography variant='subtitle1' color={"gray"}>
                        View Your  All Incoming and Outgoing Calls
                    </Typography>
                </Stack>

            </Stack>
            <Box className="flex justify-start p-4   ">
                <KeyboardBackspace fontSize='large' className='text-white p-1   rounded-full bg-indigo-400 text-xl hover:text-gray-600' onClick={() => {
                    navigate(-1)
                }} />


            </Box>
            <Stack sx={{
                flex: 1,  // Allow this Stack to take the remaining space
                overflowY: 'auto',  // Enable vertical scrolling
                padding: '1rem',
                '&::-webkit-scrollbar': {
                    display: 'none',
                },

                scrollbarWidth: 'none',

            }} className=' w-full  md:w-[90%] mx-auto   '>
                <Suspense fallback={<Skeleton />}>
                    <Box className="flex flex-col gap-8 px-0 md:px-4 py-2    ">
                        {
                            isLoading ? <Skeleton /> : allcalls?.calls.map((data) => {
                                return (<Callitem data={data} />)
                            })
                        }
                    </Box>
                </Suspense>


            </Stack>




        </Stack>
    )
}

export default Applayout(Call)

export const Callitem = memo(({ data }) => {
    console.log(data);
    const { caller, response, endTime, responsetype, startTime, calllength
    } = data
    const stime = moment(startTime); // Use moment to parse startTime
    const etime = moment(endTime);
    const duration = moment.duration(calllength);
    const durationFormatted = `${String(duration.hours()).padStart(2, '0')}:${String(duration.minutes()).padStart(2, '0')}:${String(duration.seconds()).padStart(2, '0')}`;
    return (
        <Box className="flex justify-between  hover:border-[#665dfe]  p-4 border border-gray-300 rounded-sm transition-colors duration-300   h-fit items-center flex-nowrap hover:bg-[#edecfc]">
            <Box className="basis-[30%]">
                <Avatar
                    sx={{
                        height: '3rem', // Set the height
                        width: '3rem',   // Set the width
                    }}
                    className="h-[10rem] w-[5rem]  " // Tailwind class if needed
                    src={caller?.avatar?.url}
                /></Box>
            <Box className="flex justify-center gap-1  h-full flex-col text-start basis-[30%] ">
                <h1 className='text-xs md:text-base '
                    variant='subtitle1'>
                    {caller?.username}
                </h1>
                <h1 className={` text-xs md:text-base capitalize  ${responsetype == "Missed" || responsetype == "Not Answerd" ? "text-red-500 " : "text-[#544bff]"}  `}>
                    {response === "outgoing" ? (
                        <ArrowOutwardOutlined
                            sx={{
                                color: responsetype === "Not Answerd" ? "red" : "#544bff",

                            }}
                        />
                    ) : (
                        <CallReceivedOutlined
                            sx={{
                                color: responsetype === "Missed" ? "red" : "#544bff",
                            }}
                        />
                    )}
                    {response}
                </h1>



            </Box>
            <Box className="flex flex-col text-xs md:text-base text-end gap-1 justify-between h-full   capitalize  basis-[30%] ">
                <h1>{stime.startOf("minute").fromNow()}</h1>

                <h1>
                    {durationFormatted}
                </h1>

            </Box>


        </Box>
    )
})