import React, { useState, Fragment, useRef, useEffect, useCallback, Suspense } from 'react';
import Applayout from '../Layout/Applayout';
import { Backdrop, Box, Dialog, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material';
import Avatarcard from '../shared/Avatarcard';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { AddCircleOutline, ArrowRightAlt, CallMade, CallMadeOutlined, PhoneCallback, PhoneOutlined, SearchOutlined, VideoCallOutlined } from '@mui/icons-material';
import Picker from 'emoji-picker-react';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import Messages from '../shared/Messages';
import { useParams } from 'react-router-dom';
import { useChatsdetailsQuery, useGetmessagesMutation, } from '../Redux/api';
import { useInfiniteScrollTop } from '6pp'
import { useDispatch, useSelector } from 'react-redux';
import { useSocket } from '../Auth/Socket';
import { useSocketEvents } from '../features/hooks';
import Loader from '../shared/Loader';
import { removenewmessagealert } from '../Redux/chat';
import Filemenu from '../specific/Filemenu';
import { setIsCalling, setIsFileMenu, setlocalref, setremoteref } from '../Redux/misc';

const Chat = ({ user, chatId, newmessagesAlert }) => {
  // const params = useParams();
  // const chatId = params.id;

  const { onlineuser, } = useSelector((state) => state.misc)
  // console.log(chatId);
  // const { alertarray  } = useSelector((state) => state.chat)
  const [istypeing, setistypeing] = useState(false)
  const bottomref = useRef(null)
  const [page, setpage] = useState(1)
  const [usertypeing, setusertypeing] = useState(false)
  // const user = useSelector((state) => state.auth.user)

  const { data, isError, isLoading, error, refetch } = useChatsdetailsQuery({ chatId, })
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const members = data?.message?.members.map((item) => item._id)

  const containerRef = useRef(null)
  const [anchorEl, setAnchorEl] = useState(null);
  const [sendattachmentanchorE1, setsendattachmentanchorE1] = useState(null);
  const [message, setMessage] = useState("");
  const [messagethsocket, setmessagethsocket] = useState([])
  const { socket, localref, remoteref, peerconnection, to, from, setto, setfrom, localStream, setid, id } = useSocket();
  const [picker, setpicker] = useState(false)
  const writetime = useRef(null)
  const dispatch = useDispatch();

  // call varible 

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  // const localStream = useRef(null);
  const [calltype, setcalltype] = useState(true)
  //  call varible 
  const [anchorcall, setAnchorcall] = useState(null);
  const opencall = Boolean(anchorcall);
  const opencallhandler = (event) => {
    setAnchorcall(event.currentTarget);
  };
  const closecallhandler = () => {
    setAnchorcall(null);
  };

  const [incomingCall, setIncomingCall] = useState(null);
  // const [from, setfrom] = useState(null)
  // const [to, setto] = useState(null)// Track incoming calls

  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };

  const initiateCall = async (isVideo = true) => {
    try {
      dispatch(setIsCalling(true))
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideo,
        audio: true,
      });
      // dispatch(setlocalref(stream));

      localStream.current = stream;
      localref.current.srcObject = stream;
      peerconnection.current = new RTCPeerConnection(iceServers);
      stream.getTracks().forEach((track) => peerconnection.current.addTrack(track, stream));
      peerconnection.current.ontrack = (event) => {
        remoteref.current.srcObject = event.streams[0];
        // dispatch(setremoteref(event.streams[0]));
      };
      const me = {
        _id: user._id.toString(),
        username: user.username,
        avatar: user?.avatar?.url,
      }
      const other = {
        _id: members[0],
        avatar: data?.message?.avatar,
        username: data?.message?.name,
      }
      setto(other);
      setfrom(me);
      setid(chatId);
      const allmembers = [me.from, other.to];
      peerconnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', {
            candidate: event.candidate,
            id: chatId,
            from: me, to: other, members: allmembers
          });
        }
      };

      const offer = await peerconnection.current.createOffer();
      await peerconnection.current.setLocalDescription(offer);

      socket.emit('offer', { offer, id: chatId, from: me, to: other, members: allmembers, isVideo: isVideo });
    } catch (error) {
      console.error('Error accessing media devices.', error);
    }
  };

  // const handleOffer = async (offer) => {
  //   try {
  //     peerConnection.current = new RTCPeerConnection(iceServers);
  //     peerConnection.current.ontrack = (event) => {
  //       remoteVideoRef.current.srcObject = event.streams[0];
  //     };
  //     const stream = await navigator.mediaDevices.getUserMedia({
  //       video: true,
  //       audio: true,
  //     });
  //     localStream.current = stream;
  //     localVideoRef.current.srcObject = stream;

  //     stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));




  //     peerConnection.current.onicecandidate = (event) => {
  //       if (event.candidate) {
  //         socket.emit('ice-candidate', {
  //           candidate: event.candidate,
  //           chatId,
  //           from: to, to: from
  //         });
  //       }
  //     };

  //     await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
  //     const answer = await peerConnection.current.createAnswer();
  //     await peerConnection.current.setLocalDescription(answer);
  //     socket.emit('answer', { answer, chatId, from: to, to: from });
  //   } catch (error) {
  //     console.log(error);

  //   }
  // };


  const handleAnswer = async (answer) => {
    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
  };

  useEffect(() => {
    // socket.on('ice-candidate', (data) => {
    //   console.log(data);
    //   if (data.candidate) {
    //     peerConnection.current?.addIceCandidate(new RTCIceCandidate(data.candidate)).catch(error => {
    //       console.error('Error adding received ICE candidate:', error);
    //     });
    //   }
    // });

    // socket.on('offer', ({ offer, from, to }) => {
    //   console.log(offer, from, to);
    //   setIncomingCall(offer);
    //   setto(to)
    //   setfrom(from) // Save the incoming call offer
    // });

    // socket.on('answer', ({ answer }) => {
    //   handleAnswer(answer);
    // });

    // socket.on('end-call', () => {
    //   endCall(); // End the call if notified
    // });

    return () => {
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.off('end-call');
    };
  }, []);
  const rejectCall = () => {
    const me = user._id.toString()
    const other = members[0]
    const allmembers = [me, other];
    socket.emit("rejectcall", { chatId, from, to, allmembers, callid: "callid" })
  }

  const acceptCall = async () => {
    // Accept the incoming call
    // if (incomingCall) {
    //   console.log("yes");
    //   await handleOffer(incomingCall);
    //   setIncomingCall(null); // Clear incoming call after accepting
    // }
  };

  // const endCall = () => {
  //   if (localStream.current) {
  //     localStream.current.getTracks().forEach((track) => track.stop());
  //   }
  //   peerConnection.current?.close();
  //   peerConnection.current = null;
  //   remoteVideoRef.current.srcObject = null;
  //   localVideoRef.current.srcObject = null;
  //   socket.emit('end-call', { chatId });
  // };


  // end  of call varible 

  useEffect(() => {

    return () => {

      setMessage("");
      setpage(0);
      setoldmessage([])
      setmessagethsocket([])
      dispatch(removenewmessagealert(chatId));

    }
  }, [chatId])
  useEffect(() => {
    if (newmessagesAlert.map(i => i.chatId).includes(chatId)) {

      dispatch(removenewmessagealert(chatId));
    }



  }, [newmessagesAlert, chatId])




  //  useEffect(() => {
  //   dispatch(removenewmessagealert(chatId))

  //  }, [alertarray])


  const [oldmessagechunk, { isLoading: isMessagesLoading, isError: isMessagesError, data: oldmessageData }] = useGetmessagesMutation();
  // console.log(oldmessagechunk);



  const { data: oldmessage, setData: setoldmessage } = useInfiniteScrollTop(containerRef, oldmessagechunk?.data?.totalpages,
    page,
    setpage,
    oldmessageData?.messages
  )
  useEffect(() => {
    if (chatId) {
      oldmessagechunk({ chatId, page });
    }
  }, [chatId, page, oldmessagechunk]);

  const allmessages = [...oldmessage, ...messagethsocket].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  const onEmojiClick = (emojiObject, event) => {
    if (emojiObject && emojiObject) {
      setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    }
    setAnchorEl(null);
  };
  useEffect(() => {


    return () => {
      if (bottomref.current) {
        bottomref.current.scrollIntoView({ behavior: "smooth" })
      }
    }
  }, [message])

  useEffect(() => {
    if (socket) {

      socket.on("NEW_MESSAGE", ({ chat: incomingChatId, message }) => {

        if (incomingChatId === chatId) {
          setmessagethsocket((prevMessages) => [...prevMessages, message]);

          // Scroll to the bottom after the message is added
          if (bottomref.current) {
            bottomref.current.scrollIntoView({ behavior: "smooth" });
          }
        }
      });
    }

    return () => {
      socket?.off("NEW_MESSAGE");
    };
  }, [socket, chatId]);

  const handleopenfilemenu = (e) => {
    dispatch(setIsFileMenu(true))
    setsendattachmentanchorE1(e.currentTarget)
  }












  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const allMembers = [...(Array.isArray(members) ? members : []), user._id];
    socket.emit("NEW_MESSAGE", { chatId, allMembers, messages: message })
    setMessage("");
  };
  const chatuser = Array.isArray(members) ? members.filter((id) => id !== user._id?.toString()) : [];

  // Check if the chat is not a group chat and if chatuser is in the onlineuser list
  const online = data?.message?.groupchat
    ? false
    : chatuser.length > 0 && chatuser.some((id) => onlineuser.includes(id));


  const messagewriteHandler = useCallback(
    (e) => {
      const id = user._id.toString();
      setMessage(e.target.value)
      if (!istypeing) {
        socket.emit("START_TYPING", { members, chatId })
        setistypeing(true)
      }
      if (writetime.current) {
        clearTimeout(writetime.current)
      }


      writetime.current = setTimeout(() => {
        setistypeing(false)
        socket.emit("STOP_TYPING", { members, chatId, userId: id })
      }, 1000);
    },
    [istypeing, members, chatId, socket],
  )
  const startTypingListener = useCallback(
    (data) => {

      if (data.chatId !== chatId) return;
      setusertypeing(true);
    },
    [chatId, user._id]
  );

  // Stop Typing listener (another user)
  const stopTypingListener = useCallback(
    (data) => {

      if (data.chatId !== chatId) return;
      setusertypeing(false);
    },
    [chatId, user._id]
  );
  useEffect(() => {
    socket.on("START_TYPING", startTypingListener);
    socket.on("STOP_TYPING", stopTypingListener);

    return () => {
      socket.off("START_TYPING", startTypingListener);
      socket.off("STOP_TYPING", stopTypingListener);
    };
  }, [socket, startTypingListener, stopTypingListener]);







  return (
    <Fragment className="relative">
      {/* Chat Header */}
      <Box className="flex justify-between items-center border px-4 py-2 h-[10%] border-b-gray-300">
        <Box className="flex flex-row justify-center gap-3 items-center">
          <Avatarcard avatar={data?.message?.avatar} isonline={online} />
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
            <Typography variant="subtitle1" className="font-semibold text-gray-700 break-words ">{data?.message?.name}</Typography>
            <Typography variant="caption2" className="font-light text-gray-700">{online ? "Online" : " "}</Typography>
          </Box>
        </Box>
        <Box className="flex justify-end items-center gap-1">
          {data?.message?.groupchat===false && <PhoneOutlined className="text-gray-400 hover:text-gray-500 transition-all duration-300" onClick={opencallhandler} />}
          <MoreVertIcon className="text-gray-400 hover:text-gray-500 transition-all duration-300" />
        </Box>
      </Box>

      <Stack
        boxSizing={"border-box"}
        padding={"1rem"}
        paddingTop={"2rem"}
        spacing={"1rem"}
        className="bg-gray-100"
        height={"80%"}
        gap={"1rem"}
        ref={containerRef}
        sx={{ overflowX: "hidden", overflowY: "auto" }}
      >
        {
          allmessages.map((i) => {
            return (<Messages key={i._id} message={i} user={user} />)
          })
        }
        {!istypeing && usertypeing && <Loader />}
        <div ref={bottomref} />
      </Stack>

      {/* Chat Input */}
      <Box className="h-[10%] flex items-center relative border px-2 border-t-gray-300">
        <form className="flex items-center w-full gap-x-2" onSubmit={handleFormSubmit}>
          <AddCircleOutline className="basis-[5%] text-gray-400 hover:text-gray-700 font-semibold" onClick={handleopenfilemenu} anchorE1={sendattachmentanchorE1} />
          <input
            type="text"
            value={message}
            onChange={messagewriteHandler}
            className="basis-[80%] h-full px-1 py-5 text-xl outline-none border-none"
          />
          <SentimentVerySatisfiedIcon
            className="basis-[5%] text-gray-400 hover:text-gray-700 font-semibold"
            onClick={(event) => {
              // setpicker(!picker)
              setAnchorEl(event.currentTarget)
            }}
          />
          <IconButton
            type="submit"
            sx={{
              backgroundColor: "#665dfe",
              flexBasis: "5%",
              '&:hover': {
                backgroundColor: "#4b46d7",
              }
            }}
            onClick={handleFormSubmit}
          >
            <ArrowRightAlt fontSize="inherit" className="text-gray-200 hover:text-gray-700" />
          </IconButton>
        </form>

        {/* Emoji Picker */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <Picker onEmojiClick={onEmojiClick} />
        </Menu>
      </Box>
      <Filemenu anchorE1={sendattachmentanchorE1} chatId={chatId} />
      {
        anchorcall && <Suspense fallback={<Backdrop open />} >
          <Call anchorEl={anchorcall} open={opencall} handleClose={closecallhandler} callaction={initiateCall} />
        </Suspense>
      }
      {/* <Dialog open>
      
        <div className='bg-blue-700 '>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit deserunt quod modi!
          <video ref={localVideoRef} autoPlay muted className="local-video w-full" />
          <video ref={remoteVideoRef} src={remoteVideoRef} autoPlay className="remote-video w-full" />

        </div>
       
       { incomingCall ? (
          <div>
            <p>Incoming Call...</p>
            <IconButton onClick={acceptCall}>Accept Call</IconButton>
            <IconButton onClick={() => setIncomingCall(null)}>Decline Call</IconButton>
          </div>
        ) : (
          <div>
            <IconButton onClick={() => initiateCall(true)}>Start Video Call</IconButton>
            <IconButton onClick={() => initiateCall(false)}>Start Voice Call</IconButton>
          </div>
        )}

        <IconButton onClick={endCall}>End Call</IconButton>

       </Dialog>   */}
    </Fragment>
  );
};

export default Applayout(Chat);

export const Call = ({ anchorEl, open, handleClose, callaction = () => {

} }) => {
  return (
    <Menu
      className='text-gray-400'
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
    >
      <MenuItem className='text-gray-400' onClick={() => {
        callaction(false);
        handleClose()
      }}> <PhoneCallback className="text-gray-400 hover:text-gray-500 transition-all duration-300" /> Voice</MenuItem>
      <MenuItem className='text-gray-400'
        onClick={() => {
          callaction(true);
          handleClose();
        }}
      ><VideoCallOutlined className="text-gray-400 hover:text-gray-500 transition-all duration-300" />Video</MenuItem>
    </Menu>
  );
};
