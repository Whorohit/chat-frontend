import React, { memo } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import Avatarcard from './Avatarcard';
import { Box, Stack, Typography } from '@mui/material';
import Renderattachment from '../specific/Renderattachment';
import { fileformat } from '../features/libs';

const Messages = ({ message,user }) => {
  // const user = useSelector((state) => state.auth.user);
  // console.log(user);
  
  const { sender, content, attachments = [], createdAt } = message;
  const isUser = sender._id?.toString() === user._id?.toString();
  const time = moment(createdAt).format('h:mm A');
  const timeago = moment(createdAt).fromNow();

  return (
    <div
      className={`relative w-fit rounded-3xl   text-xs max-w-[50%] flex flex-col  justify-center items-center ${isUser ? '  self-end ' : ' self-start'
        } p-5  ${isUser ? 'bg-indigo-500 text-white   rounded-r-[-1rem]' : 'bg-gray-50 text-gray-500'
        }`}
      style={{

      }}

    >
      <Stack
        className={`absolute ${isUser ? 'top-[-1.5rem] right-[-1.5rem]' : 'top-[-1.5rem] left-[-1.5rem]'
          }`}
      >
        <Avatarcard avatar={sender?.avatar?.url} />
      </Stack>

      <div className="flex flex-col items-start">
        {content && <Typography variant="subtitle2" className="mb-2">
          {content}
        </Typography>}
        <Typography variant="caption" className="text-xs ">
          {time} • {timeago}
        </Typography>
        {
          attachments.length > 0 && attachments.map((i, index) => {
            const url = i.url;

            const file = fileformat(url)
            console.log(file,5677);
            return (
              <Box key={index} >
                <a href={url} target='_blank' download
                  style={{
                    color: "black",
                    margin:".5rem .5rem"

                  }}>
                  {
                    Renderattachment({ file, url})
                  }
                </a>

              </Box>
            )
          })
        }
      </div>

    </div>
  );
};

export default memo(Messages);
