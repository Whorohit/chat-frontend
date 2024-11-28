import { Box, Button, Card, CardActions, CardContent, CardMedia, Dialog, Typography } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSocket } from '../Auth/Socket';
import { setIsCalling } from '../Redux/misc';

const CallDialog = () => {
    const { isCallbox } = useSelector((state) => state.misc);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user)
    const { localref, remoteref, to, from, localStream, socket, peerconnection, id, callid, setcallid, setid } = useSocket();


    // useEffect(() => {
    //     // Update local video source from Redux state
    //     if (localref && localVideoRef.current) {
    //         localVideoRef.current.srcObject = localref;
    //     }
    //     // Update remote video source from Redux state
    //     if (remoteref && remoteVideoRef.current) {
    //         remoteVideoRef.current.srcObject = remoteref;
    //     }
    // }, [localref, remoteref]);
    const endCall = () => {
        let answer = false;
        console.log();

        if (localref.current && remoteref.current && callid) {
            console.log(localref);
            console.log(remoteref);


            answer = true;
        }
        if (localStream.current) {
            localStream.current.getTracks().forEach((track) => track.stop());
        }
        peerconnection.current?.close();
        peerconnection.current = null;
        remoteref.current.srcObject = null;
        localref.current.srcObject = null;

        socket.emit('end-call', { chatId: id, callresponse: answer, from, to, callid });
        dispatch(setIsCalling(false))
        setcallid(null)
        setid(null)

    };

    return (
        <Dialog open={isCallbox} maxWidth={'xl'}>
            <Box className="flex items-center gap-1 flex-col md:flex-row p-2   ">
                <Card sx={{ minWidth: 400, maxWidth: 400, minHeight: "100%" }} className='h-full'>
                    <CardMedia
                        component="video"
                        autoPlay
                        muted
                        loop
                        sx={{
                            minHeight: { sm: "15rem", md: '20rem' },
                            width: '100%',
                            objectFit: 'cover',

                        }}
                        ref={localref} // Set local video ref here
                    />

                    <Typography textAlign="center" gutterBottom variant="subtitle1">
                        Your Video
                    </Typography>

                </Card>
                <Card sx={{ minWidth: 400, maxWidth: 400 }}>
                    <CardMedia
                        component="video"
                        autoPlay
                        muted
                        loop
                        sx={{
                            minHeight: { sm: "15rem", md: '20rem' },
                            width: '100%',
                            objectFit: 'cover',
                        }}
                        ref={remoteref} // Set remote video ref here
                    />

                    <Typography textAlign="center" gutterBottom variant="subtitle1">
                        {to?.username}
                    </Typography>

                </Card>
            </Box>
            <Box className="flex justify-center items-center py-2">
                <Button variant='outlined' sx={{
                    borderColor: '#665dfe',
                    ":hover": {
                        bgcolor: '#665dfe',
                        borderColor: '#665dfe',
                        color: "white"
                    }
                }} className='hover:bg-indigo-500' onClick={endCall}>Cancel Call</Button>
            </Box>
        </Dialog>
    );
};

export default CallDialog;
