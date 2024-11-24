import React, { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsCreateGroup, setIsNewGroup } from '../Redux/misc';
import { useInputValidation, useFileHandler } from '6pp';
import { Box, Button, CircularProgress, Dialog, DialogTitle, Divider, Input, Stack, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useLazyFriendslistinfoQuery, useNewGroupMutation } from '../Redux/api';
import Avatarcard from '../shared/Avatarcard';
import { Link } from 'react-router-dom';
import { showSnackbar } from '../Redux/snackbarslice';
import { useAsnycMuatation } from '../features/hooks';


const CreateGroups = () => {
    const dispatch = useDispatch();
    const [Users, setUsers] = useState([]);
    const isCreategroup = useSelector((state) => state.misc.isCreategroup);
    const [newGroup, isLoadingNewGroup] = useAsnycMuatation(useNewGroupMutation)
    const [selectmembers, setselectmembers] = useState([]);
    const handleclose = useCallback(
        () => {
            dispatch(setIsCreateGroup(false));
        },
        [dispatch],
    );

    const [triggerFriendslist, { data, error, isLoading }] = useLazyFriendslistinfoQuery();
    const name = useInputValidation("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageName, setImageName] = useState("");
    const image = useFileHandler("single", 2);

    const handleImageChange = (event) => {

        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);  // Store the actual file, not the URL
            console.log(file.name);
            setImageName(file.name); // Set the file name
        }
    };
    useEffect(() => {
        triggerFriendslist()
            .unwrap()
            .then((result) => {
                if (result?.alluserformchat) {
                    setUsers(result.alluserformchat);
                } else {
                    setUsers([]);
                }
            })
            .catch((e) => {
                console.error(e);
                setUsers([]); // Fallback to an empty array in case of error
            });
    }, [triggerFriendslist]);

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
    console.log(selectmembers);

    const submithandler = useCallback(
        () => {
            console.log(selectmembers.length <= 2);

            if (selectmembers.length <= 2) {
                dispatch(showSnackbar({
                    message: "group name is not defined or   members is less than 3",
                    severity: "error"
                }))
                return
            }
            console.log(selectedImage);

            newGroup("Creating new Group", { name: name.value, members: selectmembers, avatar: selectedImage })

            handleclose();



        },
        [selectedImage, selectmembers, name.value, newGroup, dispatch],
    )

    console.log(image.preview);



    return (
        <Dialog  open={isCreategroup} onClose={handleclose}>
            <Box sx={{
               
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingX: ".5rem",
                minWidth: "30rem"
            }}>
                <DialogTitle>
                    <Typography variant="h6" fontWeight={"semibold"}>New Group</Typography>
                </DialogTitle>
                <CloseIcon sx={{ ":hover": { color: "grey" } }} onClick={handleclose} />
            </Box>
            <Divider />
            <TextField
                variant="outlined"
                placeholder="Groups Name..."
                size='small'
                className=" text-gray-300   border-gray-400 focus:border-gray-400"
                sx={{
                    width: '90%',
                    marginX: 'auto',
                    marginY: ".15rem",
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#c0c0c0',
                        },
                        '&:hover fieldset': {
                            borderColor: '#c0c0c0',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#c0c0c0',
                        },
                    },
                }}
                value={name.value}
                onChange={name.changeHandler}
            />
            <Box className="flex justify-between items-center mx-auto  my-1 border w-[90%]   md:h-[2.4rem] border-[#c0c0c0] rounded-md">
                <div className='basis-3/5 pl-1'>
                    {imageName ? <Typography>{imageName}</Typography> : <Typography>Choose Group Image</Typography>}
                </div>
                <div className='basis-2/5 flex justify-end'>
                    <Button
                        className='text-sm bg-indigo-500'
                        size='medium'
                        component="label"
                    >
                        Upload Image
                        <input
                            accept="image/*"
                            size='small'
                            type="file"
                            onChange={handleImageChange}
                            style={{ display: 'none' }} // Hide the input, but let the button trigger it
                        />
                    </Button>
                </div>
            </Box>

            <Divider />

            {isLoading ? (
                <Box className="flex justify-center items-center h-10">
                    <CircularProgress />
                </Box>
            ) : (
                <Stack
                    direction="column"
                    sx={{
                        paddingX: '.5rem',
                        paddingY: '.5rem',
                        gap: '.5rem',
                        overflowY: "auto"
                    }}
                >
                    {Users.length > 0 ? (
                        Users.map((item, index) => (
                            <Item
                                key={item._id}
                                i={item}
                                handler={() => addmemberhandler(item._id)} // Use arrow function here
                                isadded={selectmembers.includes(item._id)}
                            />
                        ))
                    ) : (
                        <div>No friends.</div>
                    )}
                </Stack>
            )}
            <Stack direction={"row"}  justifyContent={"space-evenly"} marginY={".15rem"}>
                <Button variant='text' color='error' sx={{
                    size:{
                        md:"large",
                        sm:"small"
                    }
                }}  >Cancel</Button>
                <Button variant='contained' sx={{
                    background: "rgb(79 70 229)",
                    ":hover": {
                        background: "rgb(79 70 300)"
                    },
                    size:{
                        md:"large",
                        sm:"small"
                    }
                    
                }} onClick={submithandler} >Create</Button>
            </Stack>
        </Dialog>
    );
};

export default CreateGroups;

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
