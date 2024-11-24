import React, { memo, useCallback, useEffect, useState } from 'react';
import List from '../shared/List';
import { Box, Stack, TextField, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setIsFriendlist, setIsSearch } from '../Redux/misc';
import FriendItem from './FriendItem';
import { useLazyFriendslistinfoQuery, useLazySearchuserQuery, useSendRequestMutation } from '../Redux/api';
import { useInputValidation } from '6pp'
import { Link } from 'react-router-dom';
import Avatarcard from '../shared/Avatarcard';
import { useAsnycMuatation } from '../features/hooks';
const Search = () => {
    const [triggerFriendslist, { }] = useLazyFriendslistinfoQuery();

    const isSearch = useSelector((state) => state.misc.isSearch);
    const userid = useSelector((state) => state.auth.user)
    const dispatch = useDispatch();
    const [friends, setfriends] = useState([])
    const [user, setUsers] = useState([]);
    const [searchlist, { data, error, isLoading }] = useLazySearchuserQuery();
    const search = useInputValidation("");
    const handleclosefreindlist = () => {
        dispatch(setIsSearch(false));
    };
    useEffect(() => {
        triggerFriendslist()
            .unwrap()
            .then((result) => {
                if (result?.alluserformchat) {
                    setfriends(result.alluserformchat.map((i) => i._id));
                } else {
                    setfriends([]);
                }
            })
            .catch((e) => {
                console.error(e);
                setfriends([]); // Fallback to an empty array in case of error
            });
    }, [triggerFriendslist]);


    useEffect(() => {
        if (isSearch) {
            search.clear(); // Reset search field when the modal opens
        }
    }, [isSearch]);


    useEffect(() => {
        const handler = setTimeout(() => {
            searchlist(search.value)
                .unwrap()
                .then((result) => {

                    if (result?.users) {
                        setUsers(result.users);
                    } else {
                        setUsers([]); // Ensure `user` is an array even if there's no data
                    }
                })
                .catch((e) => {
                    console.error(e);
                    setUsers([]); // Fallback to an empty array in case of error
                });
        }, 1000);

        return () => clearTimeout(handler);
    }, [search.value]);
    const [sendrequest, issendingrequest] = useAsnycMuatation(useSendRequestMutation)
    const sendrequesthandler = useCallback(
        async ({ _id, username }) => {
            sendrequest(`Sending Request to ${username} `, { reqid: _id })
        }

        , []
    )


    const serachbox = (
        <TextField
            variant="outlined"
            placeholder="Search..."
            className="border-gray-400 text-gray-300 bg-white hover:border-gray-400 focus:border-gray-400"
            sx={{
                width: '90%',
                marginX: 'auto',
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'transparent', // Remove default border color
                    },
                    '&:hover fieldset': {
                        borderColor: 'transparent', // Border color when hovering
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'transparent', // Border color when focused
                    },
                },
            }}
            value={search.value}
            onChange={search.changeHandler}
        />
    );

    const list = (
        <Stack
            direction="column"
            sx={{
                paddingX: '.5rem',
                paddingY: '.5rem',
                gap: '.5rem',
            }}
        >
            {user.length > 0 ? (
                user
                    .filter((i) => userid._id !== i._id) // Filter out the current user
                    .map((item, index) => <FriendItem isfriendlist={friends.includes(item._id)} key={index} i={item} sendrequest={true} />) // Map over the filtered array
            ) : (
                <div>No People.</div> // Fallback message
            )}
        </Stack>
    );

    return (
        <>
            <List
                loading={isLoading}
                title="Serach a New Friend"
                serach={serachbox}
                open={isSearch}
                handleclose={handleclosefreindlist}
                list={list}>
            </List>
        </>
    );
};

export default Search;

const Item = memo(({ i }) => {
    const { avatar, username, _id } = i

    return (
        <Box className="flex justify-between px-3 py-1 border items-center">
            <Avatarcard avatar={avatar} />
            <Typography>{username}</Typography>
            <Box className="flex   flex-col md:flex-row justify-center gap-2 items-center">
                <Link className=' text-center min-w-[7rem] rounded-md  bg-indigo-500 px-2 py-1 hover:bg-indigo-600 text-white hover:text-gray-100' to={`/`}>View Profile</Link>
                <Link className=' text-center  min-w-[7rem]  rounded-md bg-indigo-500 px-2 py-1 hover:bg-indigo-600 text-white hover:text-gray-100' to={`/`}>Send Request</Link>
            </Box>
        </Box>
    );
});
