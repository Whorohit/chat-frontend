import { Avatar, Box, Button, Dialog, DialogActions, Typography } from '@mui/material'
import React from 'react'
import { useSocket } from '../Auth/Socket'
import { useDispatch } from 'react-redux'
import { setIsCalling, setrejectcall } from '../Redux/misc'

const CallAction = ({ acceptcallaction = () => { }, rejectcallaction = () => { } }) => {
    const dispatch = useDispatch();
    const { socket, peerconnection, remoteref, localref, localStream, to, setto, setfrom, from, incomingCall, setIncomingCall, id, setid, callid, setcallid, calltype } = useSocket();
    const iceServers = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
        ],
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
                video: calltype,
                audio: true,
            });
            localStream.current = stream;
            localref.current.srcObject = stream;

            stream.getTracks().forEach((track) => peerconnection.current.addTrack(track, stream));




            peerconnection.current.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit('ice-candidate', {
                        candidate: event.candidate,
                        chatId: id,
                        from: from, to: to
                    });
                }
            };

            await peerconnection.current.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerconnection.current.createAnswer();
            await peerconnection.current.setLocalDescription(answer);
            socket.emit('answer', { answer, id, from: from, to: to, callid });
        } catch (error) {
            console.log(error);

        }
    };

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
        socket.emit("rejectcall", { id, from: to, to: from, allmembers, callid: callid,chatId:id })
        setIncomingCall(null)
        dispatch(setrejectcall(false))
    }
    return (
        <Dialog open={Boolean(incomingCall)} minWidth="xl" >
            <Box className=
                "pt-1 px-10 pb-1">
                <Typography sx={{
                    marginY: "1rem"
                }} variant='subtitle1' className='my-3 text-center'>
                    Incoming  Call
                </Typography>
                <Box className="flex  flex-col  gap-1 justify-center items-center">
                    <Avatar src={to?.avatar} />
                    <Typography className='font-bold'>
                        {to?.username}
                    </Typography>
                </Box>
                <DialogActions>
                    <Button sx={{
                        bgcolor: '#665dfe', color: "white", ":hover": {
                            bgcolor: '#668dfe'
                        }
                    }} variant='contained' className="capitalize" onClick={acceptCall}>Accept</Button>
                    <Button sx={{
                        borderColor: "#665dfe",
                    }} variant='outlined' className="capitalize" onClick={rejectCall}>Reject</Button>
                </DialogActions>

            </Box>
        </Dialog>
    )
}

export default CallAction
