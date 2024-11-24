import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import React, { memo, useCallback, useEffect, useState } from 'react'
import List from '../shared/List';
import { useDispatch, useSelector } from 'react-redux';
import { useAddnewmembersMutation, useLazyFriendslistinfoQuery } from '../Redux/api';
import { setIsAddmember } from '../Redux/misc';
import FriendItem from './FriendItem';
import { useInputValidation } from '6pp';
import Avatarcard from '../shared/Avatarcard';
import { Link } from 'react-router-dom';
import { useAsnycMuatation } from '../features/hooks';

const Addmembers = ({ chatid, alreadymembers = [] }) => {
    const isAddMember = useSelector((state) => state.misc.isAddMember);
    const dispatch = useDispatch();
    const [selectmembers, setselectmembers] = useState([]);
    const [Addfunction, isLoadingadd] = useAsnycMuatation(useAddnewmembersMutation)
    const [user, setUsers] = useState([]);
    const [triggerFriendslist, { data, error, isLoading }] = useLazyFriendslistinfoQuery();
    const search = useInputValidation("");
    const handlecloseaddmembers = () => {
        dispatch(setIsAddmember(false));
    };
    useEffect(() => {

        console.log(alreadymembers);

        triggerFriendslist()
            .unwrap()
            .then((result) => {
                console.log(result);
                if (result?.alluserformchat) {
                    setUsers(result.alluserformchat.filter((item) => !alreadymembers.includes(item._id)));
                } else {
                    setUsers([]);
                }
            })
            .catch((e) => {
                console.error(e);
                setUsers([]);
            });
    }, [triggerFriendslist, alreadymembers]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (search.value.trim()) {
                const filteredUsers = data?.alluserformchat?.filter(user =>
                    user.username.toLowerCase().includes(search.value.toLowerCase()) && !alreadymembers.includes(user._id)
                );
                setUsers(filteredUsers);
            } else {
                setUsers(data?.alluserformchat?.filter(user => !alreadymembers.includes(user._id)) || []);
            }
        }, 1000);

        return () => clearTimeout(handler);
    }, [search.value, data]);


    const addmemberhandler = useCallback(
        (id) => {
            if (selectmembers.includes(id)) {
                setselectmembers(p => p.filter((i) => i !== id));
            } else {
                setselectmembers(p => [...p, id]);
            }
        },
        [selectmembers],
    );

    const addmembersubmit = () => {
        Addfunction(` Adding New Members`, { chatId: chatid, member: selectmembers })
    }
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
                marginY: ".25rem",
                paddingX: '.5rem',
                paddingY: '.5rem',
                gap: '.5rem',
            }}
        >
            {user.length > 0 ? (
                user.map((item, index) => <Item
                    i={item}
                    isadded={selectmembers.includes(item._id)}
                    handler={() => addmemberhandler(item._id)} />) // Ensure each item has a unique key
            ) : (
                <div className='text-center' >No friends</div> // Fallback message
            )}
        </Stack>
    );

    const submit = (
        <Stack direction={"row"} justifyContent={"space-evenly"} marginY={".5rem"}>
            <Button variant='text' color='error' sx={{
                size: {
                    md: "large",
                    sm: "small"
                }
            }} onClick={handlecloseaddmembers}  >Cancel</Button>
            <Button variant='contained' sx={{
                background: "rgb(79 70 229)",
                ":hover": {
                    background: "rgb(79 70 300)"
                },
                size: {
                    md: "large",
                    sm: "small"
                }


            }} onClick={addmembersubmit}  >Add </Button>
        </Stack>
    )

    return (
        <>
            <List
                title=" Add Members"
                serach={serachbox}
                open={isAddMember}
                handleclose={handlecloseaddmembers}
                list={list}
                submit={submit}
            />
        </>
    )
}

export default Addmembers



const Item = memo(({ i, handler, isadded }) => {
    const { avatar, username, _id } = i;
    return (
        <Box className="flex justify-between px-3 py-1 border items-center">
            <Avatarcard avatar={avatar} />
            <Typography>{username}</Typography>
            <Box className="flex flex-col md:flex-row justify-center gap-2 items-center">
                <Button
                    className='text-center min-w-[7rem]  rounded-md bg-indigo-500 px-2 py-1 hover:bg-indigo-600 text-white hover:text-gray-100'
                    onClick={handler}
                    sx={{
                        ":hover": {
                            color: "indigo"
                        }
                    }}
                >
                    {isadded ? "Remove" : "Select"}
                </Button>
                <Link
                    className='text-center min-w-[7r
                    em] rounded-md bg-indigo-500 px-2 py-1 hover:bg-indigo-600 text-white hover:text-gray-100'
                    to={`/`}
                >
                    Chat
                </Link>
            </Box>
        </Box>
    );
});

