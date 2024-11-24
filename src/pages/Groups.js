import { Avatar, Box, Button, Grid, IconButton, MenuItem, Menu, Stack, TextField, Typography, Backdrop } from '@mui/material'
import React, { Suspense, useEffect, useState, useCallback } from 'react'
import NavbarLayout from '../Layout/NavbarLayout'
import GroupList from '../specific/GroupList'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Done, Edit, GridOff, KeyboardBackspace, } from '@mui/icons-material'
import { useChatsdetailsQuery, useGetmygroupsQuery, useLeavegroupMutation, useModifyAdminsMutation, useRemoveGroupmemberMutation, useUpdategroupdetailsMutation } from '../Redux/api'
import Loaderlayout from '../Layout/Loaderlayout'
import Avatarcard from '../shared/Avatarcard'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { useAsnycMuatation } from '../features/hooks'
import Addmembers from '../specific/Addmembers'
import { setIsAddmember } from '../Redux/misc'
import { useSocket } from '../Auth/Socket'
import RejectCallDailog from '../specific/RejectCallDailog'
import CallAction from '../specific/CallAction'
import CallDailog from '../specific/CallDailog'

const Groups = () => {
  const dispatch = useDispatch();
  const { socket, peerconnection, remoteref, localref, localStream, to, setto, setfrom, from, incomingCall, setIncomingCall, setid, id, callid, setcallid, calltype, setcalltype } = useSocket();
  const chatId = useSearchParams()[0].get("groups");
  const mygrp = useGetmygroupsQuery();
  const [isedit, setisedit] = useState(false)
  const user = useSelector((state) => state.auth.user)
  const isAddMember = useSelector((state) => state.misc.isAddMember);
  const [groupName, setgroupName] = useState("rohit");
  const navigate = useNavigate();
  const [editGroup, isLoadingNewGroup] = useAsnycMuatation(useUpdategroupdetailsMutation)
  const [removemember, isLoadingremovemember] = useAsnycMuatation(useRemoveGroupmemberMutation)
  const [modifyadmins, isLoadingmodifyadmins] = useAsnycMuatation(useModifyAdminsMutation)
  const [leave, isleave] = useAsnycMuatation(useLeavegroupMutation)
  const [GroupnameUpdatevalue, setGroupnameUpdatevalue] = useState("rohit")
  const { data: groupsdetails, isError, isLoading, error, refetch } = useChatsdetailsQuery({ chatId, populate: true })
  // console.log(groupsdetails);
  const [selectedImage, setSelectedImage] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const changeprofilehandler = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const closeprofilehandler = () => {
    setAnchorEl(null);
  };
  const handleImageChange = async (event) => {
    event.preventDefault();
    const file = event.target.files[0]; // Get the file from the input
    if (file && chatId) { // Ensure chatId is not null
      const formData = new FormData();
      formData.append("chatid", chatId); // Append chatId
      formData.append("avatar", file); // Append the file directly


      closeprofilehandler()
      await editGroup("updating Group Profile", formData);
    } else {
      ;
    }
  };
  const leavegruphandler = useCallback(
    async () => {
      await leave("leave the  Group ", { chatId })
      navigate("/groups")
    },
    [leave],
  )


  useEffect(() => {
    if (chatId !== null) {
      setgroupName(`GroupName ${chatId}`)
      setGroupnameUpdatevalue(`GroupName ${chatId}`)
    }
    return () => {
      setGroupnameUpdatevalue("GroupChat")
      setgroupName("GroupName")
      setisedit(false)
    }
  }, [chatId])
  useEffect(() => {
    if (groupsdetails?.message) {
      setGroupnameUpdatevalue(groupsdetails?.message?.name)
      setgroupName(groupsdetails?.message?.name)
    }

    return () => {
      setgroupName("")
      setGroupnameUpdatevalue("")
      setisedit(false)
    }

  }, [groupsdetails?.message])
  const handleupdategroupname = async () => {
    if (chatId) { // Ensure chatId is not null
      const formData = new FormData();
      formData.append("chatid", chatId); // Append chatId
      formData.append("name", GroupnameUpdatevalue); // Append the file directly


      setisedit(!isedit)
      await editGroup("updating Group Profile", formData);
    }
  }

  const removememeberhandler = (username, userid) => {
    removemember(` Removing ${username}`, { chatId: chatId, userId: userid })
  }
  const changeadminshandler = (username, userid, add) => {
    modifyadmins(` Making ${username}as Admins `, { chatId: chatId, userId: userid, add: add })
  }

  const Groupsname = (
    <Stack my={"2rem"} direction={"row "} justifyContent={"center"} spacing={"1rem"} alignItems={"center"}>
      {
        isedit ?
          (<>
            <TextField
              value={GroupnameUpdatevalue}
              onChange={(e) => {
                setGroupnameUpdatevalue(e.target.value)
              }}
            />
            <IconButton
            //  disabled={isLoadingrpname} onClick={updateGrouphandler}
            >
              <Done
                onClick={handleupdategroupname}
              />
            </IconButton>
          </>) : <>

            <Typography variant='h4'>
              {GroupnameUpdatevalue}
            </Typography>
            <IconButton onClick={() => {
              setisedit(!isedit)
            }}>
              <Edit />
            </IconButton>

          </>

      }
    </Stack>
  )
  const EditGroupsProfile = (
    <>
      <Menu

        anchorEl={anchorEl}
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
    mygrp?.isLoading ? <Loaderlayout /> :
      <>
        {EditGroupsProfile}
        <Grid container height="100vh" spacing={0}>
          <Grid item md={.7} sm={.7} height="100vh" sx={{ display: { xs: "none", sm: "block" }, }}>
            <NavbarLayout />
          </Grid>
          <Grid item md={3.3} sm={5.3} height="100vh" sx={{ display: { xs: "none", sm: "block" }, bgcolor: "white" }}>
            <GroupList groups={mygrp?.data?.chats} />
          </Grid>
          <Grid item xs={12} sm={6} md={8} sx={{ overflowX: "hidden", overflowY: "auto" }} height="100vh" >
            <Stack direction={"column"} className='px-4 text-xl  '>
              <Box className="flex justify-between items-start pt-2 ">
                <KeyboardBackspace fontSize='large' className='text-gray-500 p-1   rounded-full bg-gray-200 text-xl hover:text-gray-600' onClick={() => {
                  navigate(-1)
                }} />
                <Menu sx={{
                  display: {
                    xs: "block",
                    sm: "none"
                  }
                }} fontSize='large' className='text-gray-500 hidden p-1    rounded-full bg-gray-200 text-xl hover:text-gray-600' onClick={() => {
                  navigate(-1)
                }} />
              </Box>
            </Stack>
            {
              chatId == null && <Stack sx={{ display: { xs: "block", sm: "none" }, bgcolor: "white" }} ><GroupList groups={mygrp?.data?.chats} /></Stack>
            }
            {chatId !== null && groupName &&
              <Box className=" lg:w-[90%] mx-auto border" paddingY={"1rem"}>
                <Box className="flex justify-end items-start  px-2">
                  <MoreVertIcon onClick={changeprofilehandler} />
                </Box>
                <Box className="flex justify-center items-center ">
                  <Avatar
                    src={groupsdetails?.message?.avatar?.url}
                    sx={{
                      width: "5rem",
                      height: "5rem"
                    }} className='w-16 h-16' />
                </Box>
                {Groupsname}

                <Stack className=' border  w-full  lg:w-[85%]  shadow-lg  mx-auto  text-start py-4'>
                  <Box
                    className="flex  flex-col md:flex-row   justify-center gap-6 items-center px-5 py-2  ">
                    <Typography variant='subtitle1' className=' basis-1/2'>
                      Creator : <span className='font-bold capitalize '>
                        {groupsdetails?.message?.creator.username}
                      </span>
                    </Typography>
                    <Typography variant='subtitle1' className='basis-1/2'>
                      Members :<span className='font-bold'>
                        {groupsdetails?.message?.members?.length} Members
                      </span>
                    </Typography>
                  </Box>
                  <Box
                    className="flex  flex-col md:flex-row    justify-center gap-6 items-center px-5 border-t  py-2">
                    <Typography variant='subtitle1' className='basis-1/2'>
                      Admins :<span className='font-bold'>
                        {groupsdetails?.message?.admins?.length} Members
                      </span>

                    </Typography>
                    <Typography variant='subtitle1' className='basis-1/2'>
                      Created On : <span className='font-bold'> {
                        moment(groupsdetails?.message?.createdAt).format('DD MM YYYY')}
                      </span>
                    </Typography>
                  </Box>


                </Stack>
                <Stack className=' border  w-[85%]  shadow-lg  mx-auto mt-5  text-start py-4 px-3'>
                  <Typography variant='subtitle1' fontWeight={"bold"} textAlign={"center"}>
                    Admins
                  </Typography>
                  <Stack gap={".5rem"}>
                    {
                      groupsdetails?.message?.admins.map(({ _id, username, avatar }) => {
                        return <Box className="px-2 rounded-md  p-4 my-2  border border-gray-300 hover:hover:border-[#665dfe] bg-white flex flex-wrap  flex-row items-center justify-between">
                          <Avatarcard avatar={avatar} className="basis-1/3" />
                          <Typography flexBasis={"30%"} className="  font-bold capitalize" variant='h6'   >
                            {username}</Typography>
                          <Box display={"flex"} gap={"1rem"} justifyContent={"center"} alignItems={"start"} className='text-gray-400 text-sm'>
                            {/* {  groupsdetails?.message?.admins.map((item)=>item._id).includes()
                               <h1 className=''>On  </h1>
                            <h1> members</h1>} */}
                            {
                              _id.toString() !== user._id.toString() && <>
                                <Button variant='contained' sx={{
                                  background: "rgb(79 70 229)",
                                  ":hover": {
                                    background: "rgb(79 70 300)"
                                  },
                                  size: {
                                    md: "large",
                                    sm: "small"
                                  }

                                }} onClick={() => {
                                  changeadminshandler(username, _id, false)
                                }}  >Remove </Button>


                              </>
                            }
                          </Box>

                        </Box>
                      })
                    }
                  </Stack>

                </Stack>
                <Stack className=' border  w-[85%]  shadow-lg  mx-auto mt-5  text-start py-4 px-3'>
                  <Typography variant='subtitle1' fontWeight={"bold"} textAlign={"center"}>
                    Members
                  </Typography>
                  <Stack gap={".5rem"}>
                    {
                      groupsdetails?.message?.members.map(({ _id, username, avatar }) => {
                        return <Box className="px-2 rounded-md  p-4 my-2  border border-gray-300 hover:hover:border-[#665dfe] bg-white flex flex-wrap flex-row items-center justify-between">
                          <Avatarcard avatar={avatar} className="" />
                          <Typography flexBasis={"30%"} className="  font-bold capitalize" variant='h6'   >
                            {username}</Typography>
                          <Box display={"flex"} gap={"1rem"} justifyContent={"center"} alignItems={"start"} className='text-gray-400 basis-1/3 text-sm'>
                            {/* {  groupsdetails?.message?.admins.map((item)=>item._id).includes()
                               <h1 className=''>On  </h1>
                            <h1> members</h1>} */}
                            {
                              groupsdetails?.message?.admins.map((item) => item._id).includes(user._id) && <>
                                <Box className="flex justify-between gap-3">
                                  <Button variant='contained' sx={{
                                    background: "rgb(79 70 229)",
                                    ":hover": {
                                      background: "rgb(79 70 300)"
                                    },
                                    size: {
                                      lg: "large",
                                      md: "small"
                                    }

                                  }} onClick={() => {
                                    removememeberhandler(username, _id)
                                  }}   >Remove </Button>
                                  <Button variant='contained'
                                    className='text-nowrap' sx={{
                                      background: "rgb(79 70 229)",
                                      ":hover": {
                                        background: "rgb(79 70 300)",

                                      },
                                      size: {
                                        lg: "large",
                                        md: "small"
                                      }

                                    }} onClick={() => {
                                      changeadminshandler(username, _id, true)
                                    }}  >Make Admin </Button>
                                </Box>


                              </>
                            }
                          </Box>

                        </Box>
                      })
                    }
                  </Stack>

                </Stack>
                <Box className="flex  justify-end w-[85%] mx-auto gap-3  mt-5 items-start ">
                  <Button variant='contained' sx={{
                    background: "rgb(79 70 229)",
                    ":hover": {
                      background: "rgb(79 70 300)"
                    },
                    size: {
                      lg: "large",
                      md: "small"
                    }

                  }} onClick={() => {
                    dispatch(setIsAddmember(true))
                  }}  >Add Members </Button>
                  <Button variant='contained' sx={{
                    background: "rgb(79 70 229)",
                    ":hover": {
                      background: "rgb(79 70 300)"
                    },
                    size: {
                      md: "large",
                      sm: "small"
                    }

                  }} onClick={leavegruphandler} >Leave</Button>
                </Box>
              </Box>}
          </Grid>
        </Grid >
        {
          isAddMember && <Suspense fallback={<Backdrop open />}>
            <Addmembers chatid={chatId} alreadymembers={groupsdetails?.message?.members.map((item) => item._id)} /></Suspense>

        }
        <CallDailog />
        <RejectCallDailog />
        {incomingCall && <CallAction />}
      </>
  )
}

export default Groups



