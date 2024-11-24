import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Stack, Typography } from '@mui/material';
import React, { memo, useEffect, useLayoutEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setIsNotification } from '../Redux/misc';
import CloseIcon from '@mui/icons-material/Close';
import { resetnotifiction } from '../Redux/chat';
import { useAcceptRequestMutation, useGetallnotificationsQuery, useLazyGetallnotificationsQuery, useRemoveNotificationMutation } from '../Redux/api';
import { useAsnycMuatation } from '../features/hooks';
import moment from 'moment';

const Notifications = () => {
    const isNotification = useSelector((state) => state.misc.isNotification);
    const { noitificationcount } = useSelector((state) => state.chat);
    // const [triggerNotification, { data, error, isLoading }] = useLazyGetallnotificationsQuery();

    const dispatch = useDispatch();
    const [notification, setnotification] = useState([])
    const { data, isError, isLoading, error, refetch } = useGetallnotificationsQuery()
    const handleclosenotification = () => {
        dispatch(setIsNotification(false));
    }

    useEffect(() => {
        refetch()
    }, [noitificationcount])

    useEffect(() => {
        if (isNotification) {
            dispatch(resetnotifiction());
        }
    }, [isNotification, dispatch]);
    useEffect(() => {
        if (data?.request) {
            setnotification(data?.request);
        }
        else {
            setnotification([]); // Ensure `user` is an array even if there's no data
        }


    }, [data, noitificationcount]);

    const user = [
        { sender: "User 1", id: "1" },
        { sender: "User 2", id: "2" },
        { sender: "User 3", id: "3" },
    ];

    return (
        <Dialog
            open={isNotification}
            onClose={handleclosenotification}
            maxWidth="xl"
        >
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingX: ".5rem",
                paddingBottom: "1rem",
                minWidth: {
                    sm: "15rem",
                    md: "30rem"
                }
            }}>
                <DialogTitle>
                    <Typography variant="h6" fontWeight={"semibold"}>Notifications</Typography>
                </DialogTitle>
                <CloseIcon sx={{ ":hover": { color: "grey" } }} onClick={handleclosenotification} />
            </Box>
            <Divider />
            {notification.map((item) => {
                let notificationtext = item.type == "request" ? "FriendShip  Request Comes From" : item.type == "accepted" ? "FreindShip  Request Accept by  " : item.type == "rejected" ? "FreindShip Request Rejected By" : item.type == 'call' ? "Missed Call from" : " Profile  Updated By"
                return (
                    <Notificationsitem
                        key={item._id}
                        notificationtext={notificationtext}
                        item={item}
                        id={item._id}

                    />
                )
            })}
        </Dialog>
    );
}

export default Notifications;

export const Notificationsitem = memo(({ notificationtext, id, item = {}, }) => {
    const [acceptrequest, isLoadingrequest] = useAsnycMuatation(useAcceptRequestMutation)
    const [remove, isLoadingremove] = useAsnycMuatation(useRemoveNotificationMutation)

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",


            alignContent: "center",
            gap: ".5rem",
            marginX: ".5rem",
            marginY: ".25rem"

        }} className="border flex-wrap rounded-sm  py-2">
            <Box className="flex justify-end w-full items-center px-2 mb-0">
                <CloseIcon sx={{ ":hover": { color: "grey" }, fontSize: "medium", }} onClick={() => {
                    if (item.type == "request") {
                        return
                    }
                    remove("removing", { reqid: id })
                }} />
            </Box>
            <Box className="flex justify-between w-full items-center px-2 mb-0">
                <Typography variant='subtitle2'>

                    {moment(item.createdAt).startOf('minute').fromNow()}

                </Typography>
                <Typography variant='subtitle2'>
                    {moment(item.createdAt).format("MMM Do YY")}
                </Typography>

            </Box>

            <Box className="flex justify-center gap-4 items-center">
                <h1 className=' text-sm md:text-base '>
                    {notificationtext}
                </h1>
                <Box className="flex  gap-1 justify-center items-center">
                    <Avatar src={item?.sender?.avatar} sx={{
                        width: "2rem",
                        height: "2rem"
                    }} />
                    <Typography variant='subtitle2'>{item?.sender?.username}</Typography>
                </Box>
            </Box>
            {item.type == "request" && <Box className="flex  justify-center gap-2 items-center">
                <Button sx={{
                    bgcolor: "rgb(99,102 ,241)",
                    color: "white",
                    ":hover": {
                        bgcolor: "rgb(99,102 ,255)",
                        color: "white",
                    }
                }} disabled={isLoadingrequest} variant='contained' onClick={() => {
                    acceptrequest("Accepyting the Request ", { reqid: id, accept: true })
                }} >Accept</Button>
                <Button sx={{
                    bgcolor: "rgb(255,99,71)",
                    color: "white",
                    ":hover": {
                        bgcolor: "rgb(255,99,65)",
                        color: "white",
                    }
                }} disabled={isLoadingrequest} variant='contained' onClick={() => {
                    acceptrequest("Accepyting the Request ", { reqid: id, accept: false })
                }}>Reject</Button>
            </Box>}

        </Box>
    );
});
