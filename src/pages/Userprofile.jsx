import React, { lazy, useCallback, useEffect, useRef, useState } from 'react'
import Applayout from '../Layout/Applayout'
import { Avatar, Box, Button, Grid, Menu, MenuItem, Stack, Switch, TextField, Typography } from '@mui/material'
import NavbarLayout from '../Layout/NavbarLayout'
import Avatarcard from '../shared/Avatarcard'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { AccessTime, AccessTimeFilledOutlined, BackHand, CalendarMonth, CalendarMonthOutlined, Email, EmailOutlined, HouseOutlined, KeyboardBackspace, LockClock, Person2Outlined, Phone, PhoneAndroidOutlined } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { useLazyFriendslistinfoQuery, useLazyViewmyprofileQuery, useLazyViewuserprofileQuery, useUpdatepasswordMutation, useUpdateprofileMutation, useViewmyprofileQuery } from '../Redux/api'
import { useAsnycMuatation } from '../features/hooks'
import { showSnackbar } from '../Redux/snackbarslice'
import RejectCallDailog from '../specific/RejectCallDailog'
import CallAction from '../specific/CallAction'
import { useSocket } from '../Auth/Socket'
import CallDailog from '../specific/CallDailog'
const Userprofile = () => {
    const [anchor, setanchor] = useState(null)
    const { socket, peerconnection, remoteref, localref, localStream, to, setto, setfrom, from, incomingCall, setIncomingCall, setid, id, callid, setcallid, calltype, setcalltype } = useSocket();
    
    const { data: groupsdetails, isError, isLoading, error, refetch } = useViewmyprofileQuery();
    const open = Boolean(anchor);
    const dispatch = useDispatch();
    const [info, setinfo] = useState({
        name: "",
        username: "",
        createdAt: new Date(),
        email: "",
        password: "",
        bio: "",
        phone: "",
        address: "",
        website: "",
        avatar: "",
        newpassword: "",
        repassword: ""
    })
    const user = useSelector((state) => state.auth.user)
    const [updateprofile, isLoadingupdateprofile] = useAsnycMuatation(useUpdateprofileMutation)
    const [updatepassword, isLoadingupdatepassword] = useAsnycMuatation(useUpdatepasswordMutation)
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageName, setImageName] = useState("");
    const [userinfo, setuserinfo] = useState({
        name: "",
        username: "",
        createdAt: new Date(),
        email: "",
        password: "",
        bio: "",
        phone: "",
        address: "",
        website: "",
        avatar: "",
        oldpassword: "",
        newpassword: "",
        repassword: ""

    });
    const handleInputChange = (event) => {
        const { name, value } = event.target; // Get the field name and value from the event
        setuserinfo((prevData) => ({
            ...prevData,
            [name]: value // Update only the field that changed
        }));
    };
    const handleImageChange = useCallback(
        async (event) => {
            event.preventDefault();
            const file = event.target.files[0];
            if (file) {
                const formData = new FormData();
                const previewURL = URL.createObjectURL(file);
                formData.append("avatar", file);

                setuserinfo((prev) => ({
                    ...prev,
                    avatar: previewURL // Update avatar URL
                }));
                try {
                    await updateprofile("updating Profile image", formData);
                    closeprofilehandler();
                    // Call change function to update user info after the profile update
                    // change();
                } catch (error) {
                    console.error('Error updating profile:', error);
                }
            }
        },
        []
    );
    const handlerprivcayinfo = useCallback(
        async () => {
            // name, bio, website, phone, birthdate, address
            const formData = new FormData();
            if (userinfo.oldpassword.length < 10) {
                dispatch(showSnackbar({
                    message: "old password length is less than 10",
                    severity: 'error',
                }))
                return
            }
            if (userinfo.newpassword !== userinfo.repassword) {
                dispatch(showSnackbar({
                    message: "new password and reenter neepassord does not match",
                    severity: 'error',
                }))
                return
            }
            if (userinfo.newpassword.length < 10 || userinfo.repassword.length > 10) {
                dispatch(showSnackbar({
                    message: "length of password must be of 10 ",
                    severity: 'error',
                }))
                return
            }

            if (userinfo.address.length < 1 || userinfo.bio.length < 1 || userinfo.website.length < 1 || userinfo.phone < 1 || userinfo.name < 1) {
                dispatch(showSnackbar({
                    message: "please filled  all filled",
                    severity: 'error',
                }))
                return

            }

            formData.append("oldpassword", userinfo.oldpassword)
            formData.append("newpassword", userinfo.newpassword)

            try {
                await updatepassword("updating password", formData);
                setuserinfo((prevData) => ({
                    ...prevData,
                    oldpassword: "",
                    newpassword: "",
                    repassword: ""
                }));

                // Call change function to update user info after the profile update
                // change();
            } catch (error) {
                setuserinfo((prevData) => ({
                    ...prevData,
                    oldpassword: "",
                    newpassword: "",
                    repassword: ""
                }));
                console.error('Error updating profile:', error);
            }
            finally {

            }
        }, [userinfo, updateprofile])
    const handlerpersonalinfo = useCallback(
        async () => {
            // name, bio, website, phone, birthdate, address
            const formData = new FormData();
            // if (userinfo.address.length < 1 || userinfo.bio.length < 1 || userinfo.website.length < 1 || userinfo.phone < 1 || userinfo.name < 1) {
            //     dispatch(showSnackbar({
            //         message: "please filled  all filled",
            //         severity: 'error',
            //     }))
            //     return

            // }
            const date = new Date(userinfo.birthdate)
            formData.append("name", userinfo.name)
            formData.append("bio", userinfo.bio)
            formData.append("website", userinfo.website)
            formData.append("phone", userinfo.phone)
            formData.append("address", userinfo.address)
            formData.append("birthdate", date)
            console.log(formData);
            try {
                await updateprofile("updating Profile", formData);
                closeprofilehandler();

                // Call change function to update user info after the profile update
                // change();
            } catch (error) {
                console.error('Error updating profile:', error);
            }
            // refetch();
        },
        [userinfo, updateprofile],
    )
    console.log(userinfo);

    // const change = useCallback(async () => {
    //     console.log("Fetching user profile...");
    //     try {

    //         if (groupsdetails?.user) {
    //             setuserinfo((prev) => ({
    //                 ...prev,
    //                 name: groupsdetails.user.name || prev.name,
    //                 username: groupsdetails.user.username || prev.username,
    //                 createdAt: groupsdetails.user.createdAt || prev.createdAt,
    //                 email: groupsdetails.user.email || prev.email,
    //                 bio: groupsdetails.user.bio || prev.bio,
    //                 phone: groupsdetails.user.phone || prev.phone,
    //                 address: groupsdetails.user.address || prev.address,
    //                 website: groupsdetails.user.website || prev.website,
    //                 avatar: groupsdetails.user.avatar || prev.avatar, // Update avatar URL
    //             }));
    //         }
    //     } catch (e) {
    //         console.error('Error fetching user data:', e);
    //     }
    // }, [triggerprofile]);




    useEffect(() => {
        try {

            if (groupsdetails?.user) {
                setuserinfo((prev) => ({
                    ...prev,
                    name: groupsdetails.user.name || prev.name,
                    username: groupsdetails.user.username || prev.username,
                    createdAt: groupsdetails.user.createdAt || prev.createdAt,
                    email: groupsdetails.user.email || prev.email,
                    bio: groupsdetails.user.bio || prev.bio,
                    phone: groupsdetails.user.phone || prev.phone,
                    address: groupsdetails.user.address || prev.address,
                    website: groupsdetails.user.website || prev.website,
                    avatar: groupsdetails.user.avatar || prev.avatar,
                    birthdate: moment(groupsdetails.user.birthdate).format('YYYY-MM-DD') || prev.birthdate
                    // Update avatar URL
                }));
                setinfo(groupsdetails?.user)
            }
        } catch (e) {
            console.error('Error fetching user data:', e);
        }
    }, [groupsdetails?.user]);



    const handleopen = useCallback(
        (e) => {
            setanchor(e.currentTarget);
        },
        [anchor],
    )

    const closeprofilehandler = () => {
        setanchor(null)

    }
    const time = moment(info.createdAt).format('MMMM Do YYYY')
    const navigate = useNavigate();
    const EditProfile = (
        <>
            <Menu

                anchorEl={anchor}
                open={open}
                onClose={closeprofilehandler}

                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}

            >
                <MenuItem sx={{
                    backgroundColor: "transparent"
                }}   >
                    <Typography sx={{
                        backgroundColor: "transparent"
                    }}
                        className='bg-transparent '
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
                    </Typography>

                </MenuItem>


            </Menu>
        </>
    )




    return (
        <Grid container height="100vh" spacing={0}>
            <Grid item md={.7} sm={.7} height="100vh" sx={{ display: { xs: "none", sm: "block" }, }}>
                <NavbarLayout />
            </Grid>
            <Grid item md={3.3} sm={5.3} height="100vh" sx={{ display: { xs: "none", sm: "block" }, bgcolor: "white" }}>
                {/* <Chatlist chats={data?.chats} archived={data?.archived} /> */}
                <Stack height={"100vh"}  // Set the fixed height for the entire Chatlist component
                    overflow={"hidden"}
                    className='sm:border-r-[1px]'>
                    <Stack className='px-2 py-2   border-gray-300  border-b-[1px]'>
                        <Typography variant='h6' fontWeight={"bold"}>
                            Profile
                        </Typography>
                        <Typography variant='subtitle1' color={"gray"} fontWeight={"semibold"}>
                            Personal Information & Settings
                        </Typography>

                    </Stack>
                    <Stack sx={{
                        flex: 1,  // Allow this Stack to take the remaining space
                        overflowY: 'auto',  // Enable vertical scrolling
                        padding: '1rem',
                        '&::-webkit-scrollbar': {
                            display: 'none',
                        },

                        scrollbarWidth: 'none',

                    }} >
                        <Stack className='border mb-4 py-2'>
                            <Box className="flex justify-end items-center"><MoreVertIcon onClick={handleopen} color='#f5f5f5' /></Box>
                            <Box className="w-full   py-2   flex gap-5   flex-col justify-start items-center ">
                                <Box className="flex justify-center items-center  ">
                                    <Avatar
                                        src={userinfo.avatar}
                                        alt="User Avatar"
                                        // Replace with your image URL
                                        sx={{ width: 60, height: 60 }} // Increase size to 100x100 pixels
                                    />
                                </Box>
                                <Typography variant='h6' fontWeight={"medium"} textAlign={"center"}>
                                    {info.username}
                                </Typography>
                            </Box>
                        </Stack>
                        <Stack className='border '>
                            <Box className="px-4 py-2 w-full justify-between  items-center flex border-b-[1px] ">
                                <Stack gap={""}>
                                    <Typography variant='subtitle2' color={"gray"}>UserName</Typography>
                                    <Typography variant='subtitle2' color={"black"}>  {info?.username}</Typography>


                                </Stack>
                                <Person2Outlined sx={{ color: 'gray' }} />
                            </Box>
                            <Box className="px-4 py-2 w-full justify-between  items-center flex border-b-[1px] ">
                                <Stack gap={""}>
                                    <Typography variant='subtitle2' color={"gray"}>Joined Time </Typography>
                                    <Typography variant='subtitle2' color={"black"}>{moment(info.createdAt).format('MMMM Do YYYY')}</Typography>


                                </Stack>
                                <AccessTimeFilledOutlined sx={{ color: 'gray' }} />
                            </Box>
                            <Box className="px-4 py-2 w-full justify-between  items-center flex border-b-[1px] ">
                                <Stack gap={""}>
                                    <Typography variant='subtitle2' color={"gray"}>Birthdate </Typography>
                                    <Typography variant='subtitle2' color={"black"}>{moment(info?.birthdate).format('MMMM Do YYYY')} </Typography>


                                </Stack>
                                <CalendarMonthOutlined sx={{ color: 'gray' }} />
                            </Box>
                            <Box className="px-4 py-2 w-full justify-between  items-center flex border-b-[1px] ">
                                <Stack gap={""}>
                                    <Typography variant='subtitle2' color={"gray"}>Phone No.</Typography>
                                    <Typography variant='subtitle2' color={"black"}>{info.phone}</Typography>


                                </Stack>
                                <PhoneAndroidOutlined sx={{ color: 'gray' }} />
                            </Box>
                            <Box className="px-4 py-2 w-full justify-between  items-center flex border-b-[1px] ">
                                <Stack gap={""}>
                                    <Typography variant='subtitle2' color={"gray"}>Email</Typography>
                                    <Typography variant='subtitle2' color={"black"}>{info.email}</Typography>


                                </Stack>
                                <EmailOutlined sx={{ color: 'gray' }} />
                            </Box>
                            <Box className="px-4 py-2 w-full justify-between  items-center flex border-b-[1px] ">
                                <Stack gap={""}>
                                    <Typography variant='subtitle2' color={"gray"}>Address</Typography>
                                    <Typography variant='subtitle2' color={"black"}>
                                        {info?.address}
                                    </Typography>


                                </Stack>
                                <HouseOutlined sx={{ color: 'gray' }} />
                            </Box>
                        </Stack>

                    </Stack>

                </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={8} height="100vh" >
                <Stack height={"100vh"} overflowY="hidden">
                    <Stack textAlign={"left"}
                        paddingX={"1rem"}
                        paddingY={".5rem"}


                        className='border-b-[1px]'>
                        <Typography variant='h6' fontWeight={"bold"}>
                            Settings

                        </Typography>
                        <Typography variant='subtitle1' color={"gray"}>
                            Update Personal Information & Settings
                        </Typography>
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

                    }} className=' w-[90%] mx-auto   '>
                        <Stack className=" border-[1px] my-4">
                            <Box className=" w-full  border-b-[1px] px-4 py-1
                            "  bgcolor={"rgb(243 247 253)"}>
                                <Typography variant='subtitle1' fontWeight={"medium"}>
                                    Account

                                </Typography>
                                <Typography variant='subtitle2' color={"gray"}>
                                    Update personal & contact information
                                </Typography>


                            </Box>
                            <Box className="py-2 px-4">
                                <Box className="flex  flex-col sm:flex-row justify-between sm:my-2  sm:gap-6 ">

                                    <Box className="w-full">
                                        {/* Separate label component */}
                                        <Typography variant="body1" gutterBottom>
                                            FullName
                                        </Typography>
                                        <TextField
                                            id="name"
                                            name='name'
                                            className="hover:outline-none w-full"
                                            size="small"
                                            variant="outlined"
                                            onChange={handleInputChange}
                                            value={userinfo.name}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: 'gray', // Default border color (no outline)
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: 'gray', // No outline on hover
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: 'gray',
                                                        borderWidth: "1px" // No outline on focus/click
                                                    },
                                                },
                                            }}
                                        />
                                    </Box>

                                    {/* Second TextField with a separate label */}
                                    <Box className="w-full">
                                        {/* Separate label component */}
                                        <Typography variant="body1" gutterBottom>
                                            UserName
                                        </Typography>
                                        <TextField
                                            id="username"
                                            name='username'
                                            className="hover:outline-none w-full"
                                            size="small"
                                            onChange={handleInputChange}
                                            value={userinfo.username}
                                            disabled
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: 'gray', // Default border color (no outline)
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: 'gray', // No outline on hover
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: 'gray',
                                                        borderWidth: "1px" // No outline on focus/click
                                                    },
                                                },
                                            }}
                                        />
                                    </Box>

                                </Box>
                                <Box className="flex  flex-col sm:flex-row justify-between  sm:my-2 sm:gap-6 ">

                                    <Box className="w-full">
                                        {/* Separate label component */}
                                        <Typography variant="body1" gutterBottom>
                                            Mobile Number
                                        </Typography>
                                        <TextField
                                            id="phone"
                                            name='phone'
                                            className="hover:outline-none w-full"
                                            size="small"
                                            type='number'
                                            onChange={handleInputChange}
                                            value={userinfo.phone}
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: 'gray', // Default border color (no outline)
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: 'gray', // No outline on hover
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: 'gray',
                                                        borderWidth: "1px" // No outline on focus/click
                                                    },
                                                },
                                            }}
                                        />
                                    </Box>

                                    {/* Second TextField with a separate label */}
                                    <Box className="w-full">
                                        {/* Separate label component */}
                                        <Typography variant="body1" gutterBottom>
                                            BirthDate
                                        </Typography>
                                        <TextField
                                            id="birthdate"
                                            name='birthdate'
                                            className="hover:outline-none w-full"
                                            size="small"
                                            onChange={handleInputChange}
                                            type='date'
                                            value={userinfo.birthdate}
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: 'gray', // Default border color (no outline)
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: 'gray', // No outline on hover
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: 'gray',
                                                        borderWidth: "1px" // No outline on focus/click
                                                    },
                                                },
                                            }}
                                        />
                                    </Box>


                                </Box>
                                <Box className="flex  flex-col sm:flex-row justify-between  sm:my-2 sm:gap-6 ">

                                    <Box className="w-full">
                                        {/* Separate label component */}
                                        <Typography variant="body1" gutterBottom>
                                            Email Id
                                        </Typography>
                                        <TextField
                                            id="email"
                                            name='email'
                                            className="hover:outline-none w-full"
                                            size="small"
                                            variant="outlined"
                                            type='email'
                                            disabled
                                            onChange={handleInputChange}
                                            value={userinfo.email}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: 'gray', // Default border color (no outline)
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: 'gray', // No outline on hover
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: 'gray',
                                                        borderWidth: "1px" // No outline on focus/click
                                                    },
                                                },
                                            }}
                                        />
                                    </Box>

                                    {/* Second TextField with a separate label */}
                                    <Box className="w-full">
                                        {/* Separate label component */}
                                        <Typography variant="body1" gutterBottom>
                                            Website
                                        </Typography>
                                        <TextField
                                            id="website"
                                            name='website'
                                            className="hover:outline-none w-full"
                                            size="small"
                                            onChange={handleInputChange}
                                            value={userinfo.website}
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: 'gray', // Default border color (no outline)
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: 'gray', // No outline on hover
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: 'gray',
                                                        borderWidth: "1px" // No outline on focus/click
                                                    },
                                                },
                                            }}
                                        />
                                    </Box>


                                </Box>
                                <Box className="flex  flex-col sm:flex-row justify-between  sm:my-2 sm:gap-6 ">

                                    <Box className="w-full">
                                        {/* Separate label component */}
                                        <Typography variant="body1" gutterBottom>
                                            Bio
                                        </Typography>
                                        <TextField
                                            id="bio"
                                            name='bio'
                                            className="hover:outline-none w-full"
                                            size="small"
                                            onChange={handleInputChange}
                                            value={userinfo.bio}
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: 'gray', // Default border color (no outline)
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: 'gray', // No outline on hover
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: 'gray',
                                                        borderWidth: "1px" // No outline on focus/click
                                                    },
                                                },
                                            }}
                                        />
                                    </Box>

                                    {/* Second TextField with a separate label */}


                                </Box>
                                <Box className="flex  flex-col sm:flex-row justify-between  sm:my-2 sm:gap-6 ">

                                    <Box className="w-full">
                                        {/* Separate label component */}
                                        <Typography variant="body1" gutterBottom>
                                            Address
                                        </Typography>
                                        <TextField
                                            id="address"
                                            name='address'
                                            className="hover:outline-none w-full"
                                            size="small"
                                            onChange={handleInputChange}
                                            value={userinfo.address}
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: 'gray', // Default border color (no outline)
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: 'gray', // No outline on hover
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: 'gray',
                                                        borderWidth: "1px" // No outline on focus/click
                                                    },
                                                },
                                            }}
                                        />
                                    </Box>

                                    {/* Second TextField with a separate label */}


                                </Box>
                                <Box className="flex justify-end my-2">
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: '#665dfe', // Custom background color
                                            color: '#fff', // Set text color to white for contrast
                                            '&:hover': {
                                                backgroundColor: '#4c44d8', // Custom hover color
                                            },
                                        }}
                                        disabled={isLoadingupdateprofile}
                                        onClick={handlerpersonalinfo}
                                    >
                                        Save Changes
                                    </Button>
                                </Box>
                            </Box>

                        </Stack>
                        <Stack className=" border-[1px] my-2">

                            <Box className=" w-full  border-b-[1px] px-4 py-1
                            "  bgcolor={"rgb(243 247 253)"}>
                                <Typography variant='subtitle1' fontWeight={"medium"}>
                                    Password

                                </Typography>
                                <Typography variant='subtitle2' color={"gray"}>
                                    Update Password & contact information
                                </Typography>


                            </Box>
                            <Box className="py-2 px-4">



                                <Box className="flex  flex-col sm:flex-row justify-between  sm:my-2 sm:gap-6 ">




                                    <Box className="w-full">
                                        {/* Separate label component */}
                                        <Typography variant="body1" gutterBottom>
                                            Old Password
                                        </Typography>
                                        <TextField
                                            id="oldpassword"
                                            name='oldpassword'
                                            type='password'
                                            onChange={handleInputChange}
                                            className="hover:outline-none w-full"
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: 'gray', // Default border color (no outline)
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: 'gray', // No outline on hover
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: 'gray',
                                                        borderWidth: "1px" // No outline on focus/click
                                                    },
                                                },
                                            }}
                                        />
                                    </Box>


                                </Box>
                                <Box className="flex  flex-col sm:flex-row justify-between sm:my-2  sm:gap-6 ">

                                    <Box className="w-full">
                                        {/* Separate label component */}
                                        <Typography variant="body1" gutterBottom>
                                            New Password
                                        </Typography>
                                        <TextField
                                            id="newpassword"
                                            name='newpassword'
                                            type='password'
                                            onChange={handleInputChange}
                                            className="hover:outline-none w-full"
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: 'gray', // Default border color (no outline)
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: 'gray', // No outline on hover
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: 'gray',
                                                        borderWidth: "1px" // No outline on focus/click
                                                    },
                                                },
                                            }}
                                        />
                                    </Box>

                                    {/* Second TextField with a separate label */}
                                    <Box className="w-full">
                                        {/* Separate label component */}
                                        <Typography variant="body1" gutterBottom>
                                            Repeat New Password
                                        </Typography>
                                        <TextField
                                            id="repassword"
                                            name='repassword'
                                            onChange={handleInputChange}
                                            className="hover:outline-none w-full"
                                            size="small"
                                            type='password'
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: 'gray', // Default border color (no outline)
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: 'gray', // No outline on hover
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: 'gray',
                                                        borderWidth: "1px" // No outline on focus/click
                                                    },
                                                },
                                            }}
                                        />
                                    </Box>

                                </Box>

                                <Box className="flex justify-end my-2">
                                    <Button
                                        disabled={isLoadingupdatepassword}
                                        onClick={handlerprivcayinfo}
                                        variant="contained"
                                        sx={{
                                            backgroundColor: '#665dfe', // Custom background color
                                            color: '#fff', // Set text color to white for contrast
                                            '&:hover': {
                                                backgroundColor: '#4c44d8', // Custom hover color
                                            },
                                        }}
                                    >
                                        Save Changes
                                    </Button>
                                </Box>
                            </Box>

                        </Stack>
                        <Stack className=" border-[1px] my-2">
                            <Box className=" w-full  border-b-[1px] px-4 py-1
                            "  bgcolor={"rgb(243 247 253)"}>
                                <Typography variant='subtitle1' fontWeight={"medium"}>
                                    Security


                                </Typography>
                                <Typography variant='subtitle2' color={"gray"}>
                                    Update personal & contact information
                                </Typography>


                            </Box>
                            <Box className="py-2 px-4">
                                <Box className="flex  flex-col sm:flex-row justify-between sm:my-2  sm:gap-6 ">

                                    <Box className="w-full  basis-full sm:basis-2/3">
                                        <Typography variant='subtitle1' fontWeight={"medium"}>
                                            Use two-factor authentication


                                        </Typography>
                                        <Typography variant='subtitle2' >
                                            Ask for a code if attempted login from an unrecognised device or browser.
                                        </Typography>

                                    </Box>
                                    <Switch
                                        // checked={checked}
                                        // onChange={handleChange}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                    />

                                    {/* Second TextField with a separate label */}


                                </Box>

                                <Box className="flex justify-end my-2">
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: '#665dfe', // Custom background color
                                            color: '#fff', // Set text color to white for contrast
                                            '&:hover': {
                                                backgroundColor: '#4c44d8', // Custom hover color
                                            },
                                        }}
                                    >
                                        Save Changes
                                    </Button>
                                </Box>
                            </Box>

                        </Stack>

                    </Stack>
                </Stack>
            </Grid>
            {
                EditProfile
            }
            <CallDailog/>
            <RejectCallDailog />
            {incomingCall && <CallAction  />}

        </Grid>

    )
}

export default Userprofile


