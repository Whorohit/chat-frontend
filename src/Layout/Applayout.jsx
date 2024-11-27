import React, { useEffect, useRef, useState } from 'react';
import Title from '../shared/Title';
import NavbarLayout from './NavbarLayout';
import { Grid, Skeleton, Stack } from '@mui/material';
import Chatlist from '../specific/Chatlist';
import { useMychatsQuery } from '../Redux/api';
import { useDispatch, useSelector } from 'react-redux';
import { useSocket } from '../Auth/Socket';
import { addMember, newlist, removeMember, setIsCalling, setrejectcall, setrejectcalltext } from '../Redux/misc';
import { useParams } from 'react-router-dom';
import { getorsavefromstorage } from '../features/feature';
import { increasenotification, removenewmessagealert, setnewmessagealert } from '../Redux/chat';
import CallDailog from '../specific/CallDailog';
import CallAction from '../specific/CallAction';
import RejectCallDailog from '../specific/RejectCallDailog';


const Applayout = (WrappedComponent) => {
    const AppLayoutComponents = (props) => {
        const iceServers = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
            ],
        };
        const { isLoading, data, isError, error, refetch } = useMychatsQuery("")
        const user = useSelector((state) => state.auth.user)
        const { alertarray } = useSelector((state) => state.chat)
        const { onlineuser } = useSelector((state) => state.misc)
        // console.log(onlineuser);
        // const [incomingCall, setIncomingCall] = useState(null);


        const { socket, peerconnection, remoteref, localref, localStream, to, setto, setfrom, from, incomingCall, setIncomingCall, setid, id, callid, setcallid, calltype, setcalltype } = useSocket();
        const dispatch = useDispatch();
        const params = useParams();
        const chatId = params.id;
        const handleAnswer = async (answer) => {
            await peerconnection.current.setRemoteDescription(new RTCSessionDescription(answer));
        };


        const handleOffer = async (offer) => {
            try {
                dispatch(setIsCalling(true))
                setIncomingCall(null)
                peerconnection.current = new RTCPeerConnection(iceServers);
                peerconnection.current.ontrack = (event) => {
                    remoteref.current.srcObject = event.streams[0];
                };
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });
                localStream.current = stream;
                localref.current.srcObject = stream;

                stream.getTracks().forEach((track) => peerconnection.current.addTrack(track, stream));




                peerconnection.current.onicecandidate = (event) => {
                    if (event.candidate) {
                        socket.emit('ice-candidate', {
                            candidate: event.candidate,
                            chatId,
                            from: from, to: to
                        });
                    }
                };

                await peerconnection.current.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await peerconnection.current.createAnswer();
                await peerconnection.current.setLocalDescription(answer);
                socket.emit('answer', { answer, chatId, from: from, to: to });
            } catch (error) {
                console.log(error);

            }
        };





        useEffect(() => {
            // Handle a friend coming online
            ;
            socket.on('friendOnline', (data) => {
                // console.log("Friend came online:", data.friendId);
                dispatch(addMember(data.friendId))
                // setOnlineFriends(prev => [...new Set([...prev, data.friendId])]);
            });

            // Handle a friend going offline
            socket.on('friendOffline', (data) => {
                // console.log("Friend went offline:", data.friendId);
                dispatch(removeMember(data.friendId))
                // setOnlineFriends(prev => prev.filter(id => id !== data.friendId));
            });

            // Receive the initial online friends list
            socket.on('onlineFriendsList', (friends) => {
                // console.log("Online friends list:", friends);
                console.log(friends);

                dispatch(newlist(friends))
            });


            return () => {
                socket.off('friendOnline');
                socket.off('friendOffline');
                socket.off('onlineFriendsList');
            };
        }, [socket, dispatch, onlineuser]);
        useEffect(() => {
            getorsavefromstorage({ key: "NEW_MESSAGE_ALERT", value: alertarray, get: true })
            console.log(alertarray);
        }, [alertarray])

        useEffect(() => {

            socket.on('GROUP_CREATED', (groupData) => {
                console.log("New group created:", groupData);
                refetch()
                // Example action to add the new group to the state
            });

            // Listen for 'NEW_MESSAGE_ALERT' event from the server
            // socket.on('NEW_MESSAGE_ALERT', (Data) => {
            //     refetch();
            //     if (Data.chatId === chatId)
            //         return
            //     dispatch(setnewmessagealert(Data))
            //     console.log("New message alert received:", Data);
            //     // dispatch(setNewMessageAlert(alertData)); // Example action to update message alerts
            // });
            console.log(alertarray);


            return () => {
                socket.off('GROUP_CREATED');
                // socket.off('NEW_MESSAGE_ALERT');
            };
        }, [socket, dispatch]);
        useEffect(() => {
            socket.on('NEW_MESSAGE_ALERT', (Data) => {
                refetch();
                if (Data.chatId == chatId) return;
                dispatch(setnewmessagealert(Data))
                console.log("New message alert received:", Data);
                // dispatch(setNewMessageAlert(alertData)); // Example action to update message alerts
            });

            return () => {
                socket.off('NEW_MESSAGE_ALERT');
            }
        }, [socket, dispatch])


        useEffect(() => {
            socket.on('REQUEST', (Data) => {
                dispatch(increasenotification())

            });

            return () => {
                socket.off('REQUEST');
            }
        }, [socket, dispatch])
        useEffect(() => {

            socket.on('ice-candidate', (data) => {

                if (data.candidate) {
                    peerconnection.current?.addIceCandidate(new RTCIceCandidate(data.candidate)).catch(error => {
                        console.error('Error adding received ICE candidate:', error);
                    });
                }
            });
            socket.on('offer', ({ offer, from, to, id, callid, isVideo }) => {
                setIncomingCall(offer);
                setto(from)
                setfrom(to)
                setid(id)
                console.log(callid);
                setcallid(callid);
                setcalltype(isVideo)

            });
            socket.on('answer', ({ answer, callid }) => {
                console.log(answer);

                handleAnswer(answer);
                setcallid(callid)
            });
            socket.on('rejectcall', (data) => {
                console.log(data);
                if (localStream.current) {
                    localStream.current.getTracks().forEach((track) => track.stop());
                }
                peerconnection.current?.close();
                peerconnection.current = null;
                remoteref.current.srcObject = null;
                localref.current.srcObject = null;
                dispatch(setIsCalling(false))
                dispatch(setrejectcall(true))
                dispatch(setrejectcalltext("Call Rejected By"))

            })
            socket.on('end-call', (data) => {
                setIncomingCall(null)
                if (localStream.current) {
                    localStream.current.getTracks().forEach((track) => track.stop());
                }
                peerconnection.current?.close();
                peerconnection.current = null;
                if (remoteref.current) {
                    remoteref.current.srcObject = null;
                }

                if (localref.current)
                    localref.current.srcObject = null;
                dispatch(setIsCalling(false))

            })
            socket.on('busy', (data) => {
                console.log(data);

                if (localStream.current) {
                    localStream.current.getTracks().forEach((track) => track.stop());
                }
                peerconnection.current?.close();
                peerconnection.current = null;
                if (remoteref.current) {
                    remoteref.current.srcObject = null;
                }

                if (localref.current)
                    localref.current.srcObject = null;
                dispatch(setIsCalling(false))
                dispatch(setrejectcall(true))
                dispatch(setrejectcalltext("Busy with another Call"))

            })



            return () => {
                socket.off('offer');
                socket.off('answer');
                socket.off('ice-candidate');
                socket.off('end-call');
                socket.off('rejectcall')
                socket.off("busy")
            }
        }, [])



        // useEffect(() => {

        //         dispatch(removenewmessagealert(chatId));

        // }, [chatId])
        const acceptCall = async () => {
            // Accept the incoming call
            if (incomingCall) {
                console.log("yes");
                await handleOffer(incomingCall);
                setIncomingCall(null); // Clear incoming call after accepting
            }
        };

        const rejectCall = () => {
            const allmembers = [to._id, from._id]

            socket.emit("rejectcall", { chatId, from: to, to: from, allmembers, callid: "callid" })
            setIncomingCall(null)

        }





        return (
            <>
                <Title />

                <Grid container height="100vh" spacing={0}>
                    <Grid item md={.7} sm={.7} height="100vh" sx={{ display: { xs: "none", sm: "block" }, }}>
                        <NavbarLayout />
                    </Grid>
                    <Grid item md={3.3} sm={5.3} height="100vh" sx={{ display: { xs: "none", sm: "block" }, bgcolor: "white" }}>
                        <Chatlist chats={data?.chats} archived={data?.archived} newmessagesAlert={alertarray} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={8} height="100vh">
                        <WrappedComponent {...props} user={user} chatId={chatId} chats={data?.chats} archived={data?.archived} newmessagesAlert={alertarray} />
                    </Grid>
                </Grid>
                <CallDailog />
                <RejectCallDailog />
                {incomingCall && <CallAction from={to} to={from} acceptcallaction={acceptCall} rejectcallaction={rejectCall} />}
            </>
        );
    };
    return AppLayoutComponents;
};

export default Applayout;
