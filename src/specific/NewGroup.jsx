import { Menu, MenuItem } from '@mui/material'
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIsCreateGroup, setIsFriendlist, setIsNewGroup, setIsSearch } from '../Redux/misc'

const NewGroup = ({ anchorEl, handleClose }) => {
  const dispatch = useDispatch();
  const isNewGroup = useSelector((state) => state.misc.isNewGroup);

  const handleCloseNewGroup = () => {
    handleClose();  // Call the function passed down to close the menu
    dispatch(setIsNewGroup(false));  // Ensure the menu is closed in the state
  }
  const handleopenFriendilist = () => {

    dispatch(setIsFriendlist(true));
    dispatch(setIsNewGroup(false));  // Dispatch the action to open the friend list
  };
  const handleopennewGrp = () => {
    dispatch(setIsCreateGroup(true))
    dispatch(setIsNewGroup(false));

  }


  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl) && isNewGroup}
      onClose={handleCloseNewGroup}
    >
      <MenuItem onClick={handleopenFriendilist}>Friends</MenuItem>
      <MenuItem onClick={() => {

        dispatch(setIsSearch(true))
        dispatch(setIsNewGroup(false));  // Dispatc
      }}>New Chat</MenuItem>
      <MenuItem onClick={handleopennewGrp}>New Group</MenuItem>
      <MenuItem onClick={handleCloseNewGroup}>Inviation</MenuItem>
    </Menu>
  )
}

export default NewGroup;
