import React, { useEffect, useState, useMemo, useCallback } from 'react';
import List from '../shared/List';
import { Stack, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setIsFriendlist } from '../Redux/misc';
import FriendItem from './FriendItem';
import { useLazyFriendslistinfoQuery } from '../Redux/api';
import { useInputValidation } from '6pp';

const Friendlist = () => {
  const isfriend = useSelector((state) => state.misc.isFriendList);
  const dispatch = useDispatch();
  const [user, setUsers] = useState([]);
  const [triggerFriendslist, { data, isLoading }] = useLazyFriendslistinfoQuery();
  const search = useInputValidation("");

  const handleclosefreindlist = useCallback(() => {
    dispatch(setIsFriendlist(false));
  }, [dispatch]);

  useEffect(() => {
    triggerFriendslist()
      .unwrap()
      .then((result) => {
        setUsers(result?.alluserformchat || []);
      })
      .catch(() => {
        setUsers([]);
      });
  }, [triggerFriendslist]);

  // Memoized filtered user list based on search value
  // const filteredUsers = useMemo(() => {
  //   if (!search.value.trim()) return user;
  //   return user.filter(({ username }) =>
  //     username.toLowerCase().includes(search.value.toLowerCase())
  //   );
  // }, [user, search.value]);
  useEffect(() => {
    const handler = setTimeout(() => {
      if (search.value.trim()) {
        const filteredUsers = data?.alluserformchat?.filter(user =>
          user.username.toLowerCase().includes(search.value.toLowerCase())
        );
        setUsers(filteredUsers);
      } else {
        setUsers(data?.alluserformchat)
      }
    }, 1000);

    return () => clearTimeout(handler);
  }, [search.value, data]);

  // Memoized searchBox to avoid re-renders on typing
  const searchBox = useMemo(() => (
    <TextField
      variant="outlined"
      placeholder="Search..."
      value={search.value}
      onChange={search.changeHandler}
      sx={{
        width: '90%',
        marginX: 'auto',
        '& .MuiOutlinedInput-root': {
          '& fieldset': { borderColor: 'transparent' },
          '&:hover fieldset': { borderColor: 'transparent' },
          '&.Mui-focused fieldset': { borderColor: 'transparent' },
        },
      }}
    />
  ), [search]);

  // Memoized listContent to avoid re-renders on typing
  const listContent = useMemo(() => (
    <Stack direction="column" sx={{ paddingX: '.5rem', paddingY: '.5rem', gap: '.5rem' }}>
      {user.length > 0 ? (
        user.map((item, index) => <FriendItem key={index} i={item} isfriendlist />)
      ) : (
        <div className="text-center">No friends.</div>
      )}
    </Stack>
  ), [user]);

  return (
    <List
      title="FriendList"
      serach={searchBox}
      open={isfriend}
      handleclose={handleclosefreindlist}
      list={listContent}
      loading={isLoading}
    />
  );
};

export default Friendlist;
