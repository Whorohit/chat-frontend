import { Autocomplete, Backdrop, Box, FormControl, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import React, { memo, Suspense, useState } from 'react';
import Chatitem from '../shared/Chatitem';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { setIsNewGroup, setIsNotification } from '../Redux/misc';
import NewGroup from './NewGroup';
import { useDispatch, useSelector } from 'react-redux';
import Notifications from './Notifications';
import { Link } from 'react-router-dom';
import Avatarcard from '../shared/Avatarcard';
import Friendlist from './Friendlist';
import Search from './Search';
import CreateGroups from './CreateGroups';
import moment from 'moment';

const GroupList = ({ w, groups = [] }) => {
  const [newGroupanchor, setnewGroupanchor] = useState(null);
  

  const dispatch = useDispatch();
  const { isNewGroup, isFriendList, isCreategroup, isNotification, isSearch } = useSelector((state) => state.misc)
  const handleopennewGroup = (event) => {
    console.log("Opening new group menu");
    setnewGroupanchor(event.currentTarget);  // Set anchorEl when icon is clicked
    dispatch(setIsNewGroup(true));  // Open the menu
  }

  const handleCloseNewGroup = () => {
    console.log("Closing new group menu");
    setnewGroupanchor(null);  // Clear anchorEl to close the menu
    dispatch(setIsNewGroup(false));  // Close the menu
  }

  const handleopennotification = () => {
    console.log("Opening notifications");
    dispatch(setIsNotification(true));
  }


  return (
    <Stack
      direction={"column"}
      height={"100vh"}  // Set the fixed height for the entire Chatlist component
      overflow={"hidden"}  // Prevent scrolling on the Chatlist container
      w={w}
      borderRight={"1px solid #ddd"}
    >
      <Stack sx={{ borderBottom: "1px solid #ddd" }}>
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          paddingX: "1rem",
          paddingY: "1rem",
        }}>
          <Typography> Manage Groups</Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: "1.5rem" }}>
            <NotificationsNoneIcon onClick={handleopennotification} color='#f5f5f5' />
            <MoreVertIcon onClick={handleopennewGroup} color='#f5f5f5' />
          </Box>
        </Box>

        <Box className="flex justify-between items-center gap-[1.5rem] px-2 py-2" sx={{ borderBottom: "1px solid #ddd" }}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            sx={{ width: "100%" }}
            size='small'
            renderInput={(params) => <TextField {...params} label="Movie" />}
          />
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
      >
        {groups.map((groupInfo, index) => (
          <Groupitem key={index} groupinfo={groupInfo} />
        ))}
      </Stack>

      <NewGroup anchorEl={newGroupanchor} handleClose={handleCloseNewGroup} />
      <Notifications />
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

export default GroupList;


export const Groupitem = memo(({ groupinfo = {} }) => {
  const { _id, avatar, name, members = [],createdAt } = groupinfo;
  // Use _id from groupinfo if available
  const time = moment(createdAt).format('DD MM YYYY');

  return (
    <Link to={`?groups=${_id}`}>
      <Stack direction={"row"} className='px-2 rounded-md  p-4 my-2  border border-gray-300 hover:hover:border-[#665dfe] bg-white flex flex-row items-center justify-between'>
        <Avatarcard avatar={avatar} />
        <Typography className='text-black text-left'>
          {name}
        </Typography>
        <Stack justifyContent={"center"} alignItems={"start"} className='text-gray-400 text-sm'>
          <h1 className=''>On {time} </h1>
          <h1>{members.length} members</h1>
        </Stack>
        
      </Stack>
    </Link>
  );
});
