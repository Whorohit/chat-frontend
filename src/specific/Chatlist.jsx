import { Autocomplete, Backdrop, Badge, Box, FormControl, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import React, { Suspense, useState } from 'react';
import Chatitem from '../shared/Chatitem';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { setIsNewGroup, setIsNotification } from '../Redux/misc';
import NewGroup from './NewGroup';
import { useDispatch, useSelector } from 'react-redux';
import Notifications from './Notifications';
import Friendlist from './Friendlist';
import CreateGroups from './CreateGroups'
import Search from './Search'


const Chatlist = ({ w, chats = [], archived = {}, newmessagesAlert = [] }) => {
  // console.log(online);

  const [newGroupanchor, setnewGroupanchor] = useState(null);
  const [chattype, setchattype] = useState("all")
  const { noitificationcount } = useSelector((state) => state.chat)


  const [mychat, setmychat] = useState(chats)
  const { isNewGroup, isFriendList, isCreategroup, isNotification, isSearch, onlineuser } = useSelector((state) => state.misc)
  const dispatch = useDispatch();
  // console.log(onlineuser);

  const handleopennewGroup = (event) => {

    setnewGroupanchor(event.currentTarget);  // Set anchorEl when icon is clicked
    dispatch(setIsNewGroup(true));  // Open the menu
  }

  const handleCloseNewGroup = () => {

    setnewGroupanchor(null);  // Clear anchorEl to close the menu
    dispatch(setIsNewGroup(false));  // Close the menu
  }

  const handleopennotification = () => {

    dispatch(setIsNotification(true));
  }


  return (
    <Stack
      direction={"column"}
      height={"100vh"}  // Set the fixed height for the entire Chatlist component
      overflow={"hidden"}  // Prevent scrolling on the Chatlist container
      w={w}
      className='md:border-r  md:border-gray-300'
    >
      <Stack sx={{
        borderBottom: "1px solid #ddd",

      }}>
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          paddingX: "1rem",
          paddingY: "1rem",
          // Optional border for visual separation
        }}>
          <Typography className='font-extrabold '>Chat</Typography>

          <Box sx={{ display: "flex", justifyContent: "center", gap: "1.5rem" }}>
            <Badge
              badgeContent={noitificationcount}
              onClick={handleopennotification}
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: '#665dfe',
                  color: 'white', // Optional: to set text color
                },
              }}
            >
              <NotificationsNoneIcon />
            </Badge>
            {/* <NotificationsNoneIcon value={noitificationcount} onClick={handleopennotification} color='#f5f5f5' /> */}
            <MoreVertIcon onClick={handleopennewGroup} color='#f5f5f5' />
          </Box>
        </Box>

        <Box className="flex justify-between items-center gap-[1.5rem] px-2" sx={{ borderBottom: "1px solid #ddd" }}>
          <FormControl sx={{ m: 1,  width:"100%" }} size='small'>
            <Select
              inputProps={{ 'aria-label': 'Without label' }}
              defaultValue=""
              value={chattype}
              onChange={(e) => {
                setchattype(e.target.value)
              }}// Set a default value to ensure "None" appears as an option
            >

              <MenuItem value={"all"}>All</MenuItem>
              <MenuItem value={"archived"}>Archived</MenuItem>
              <MenuItem value={"family"}>Family</MenuItem>
              <MenuItem value={"blocked"}>Blocked</MenuItem>
            </Select>
          </FormControl>
         
        </Box>

      </Stack>
      <Stack
        sx={{
          flex: 1,  // Allow this Stack to take the remaining space
          overflowY: 'auto',  // Enable vertical scrolling
          padding: '1rem',
          '&::-webkit-scrollbar': {
            display: 'none',
          },

          scrollbarWidth: 'none',

        }}
        className=''
      >
        {chats.map((chat, index) => {
          const { name, avatar, _id, groupchat, visible, members, lastMessage = {} } = chat;

          const isonline = groupchat ? false : onlineuser.includes(members[0]);
          // console.log(isonline);
          // console.log(_id);



          return visible && chattype === "all"
            ? (
              <Chatitem
                key={index}
                avatar={avatar}
                _id={_id}
                isonline={isonline}
                groupchat={groupchat}
                username={name}
                newmessagealert={newmessagesAlert}
                lastmessage={lastMessage}
              />
            )
            : archived[chattype] && archived[chattype].includes(members[0])
              ? (
                <Chatitem
                  key={index}
                  avatar={avatar}
                  _id={_id}
                  isonline={isonline}
                  groupchat={groupchat}
                  username={name}
                  newmessagealert={newmessagesAlert}
                  lastmessage={lastMessage}
                />
              )
              : null;
        })}
      </Stack>

      <NewGroup anchorEl={newGroupanchor} handleClose={handleCloseNewGroup} />
      {isNotification && <Suspense fallback={<Backdrop open />}>
        <Notifications /></Suspense>}
      {
        isSearch && <Suspense fallback={<Backdrop open />}>
          <Search /></Suspense>

      }
      {
        isFriendList && <Suspense fallback={<Backdrop open />}>
          <Friendlist /></Suspense>

      }
      {
        isCreategroup && <Suspense fallback={<Backdrop open />}>
          <CreateGroups /></Suspense>

      }

    </Stack>
  );
}

export default Chatlist;
