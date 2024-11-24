import { Box, Button, Stack, Typography } from '@mui/material';
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import Avatarcard from '../shared/Avatarcard';  // Ensure the path is correct

const Chatitem = ({ avatar, archive, index, _id, newmessagealert = [], isonline = false, handledeletechat, grupchat, username, samesender, lastmessage }) => {
  // console.log(isonline);
  // console.log(newmessagealert);
  const isnewmessagealert = newmessagealert.map((data) => data.chatId).includes(_id)
  console.log(isnewmessagealert);
  
  return (
    <Link to={`/chat/${_id}`} className="no-underline">
      <div className={`my-1 flex items-center  gap-0 md:gap-8   mx-0 md:mx-1 p-1  lg:px-4  lg:py-4 border border-gray-300 rounded-sm transition-colors duration-300   h-fit
        ${samesender ? "bg-black text-white" : "bg-transparent"}
        hover:border-[#665dfe]`}
      >
        <Avatarcard avatar={avatar} className={"basis-1/3"} isonline={isonline} />  {/* Pass avatar prop if needed */}
        <Stack className="text-decoration-none  basis-2/3">
          <Box className="flex   justify-between items-center gap-1 md:gap-7">
            <Typography style={{
              fontSize: {
                md: ".5rem",
                lg: "1rem"
              }
            }} className=" md:text-lg text-xs text-black">{username?.substring(0, 10) || "Default Name"}</Typography>
            {newmessagealert.find(item => item.chatId === _id) ? <Typography variant='subtitle2' className=" text-gray-400
                flex justify-center items-center  gap-1  md:text-base text-xs  ">
              <h1
                className='rounded-full  bg-indigo-500  w-5 h-5  text-center  text-white '
                >
                 {
                newmessagealert.find(item => item.chatId === _id)?.count || 0
              }</h1>  New Message
            </Typography> : " "
            }
          </Box>
          <h1
            className="text-gray-500   lg:text-base text-sm break-words h-fit text-wrap overflow-hidden text-ellipsis"
          >
            {lastmessage?.content?.substring(0, 25)  || "Lorem ipsum dolor sit amet."}.....
          </h1>
        </Stack>
      </div>
    </Link>
  )
}

export default memo(Chatitem)
