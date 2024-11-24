import React from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import {
    Notifications,
    ChatBubble,
    Add,
    Group,
    Person2,
    LogoutSharp,
    AccountCircle,
    Call,
} from '@mui/icons-material';

const Speednavbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    const handlelogout = () => {
        try {
            axios
                .get('http://localhost:5000/api/user/logout', {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then(() => {
                    console.log('Logged out');
                    document.cookie = '';
                    navigate('/login');
                });
        } catch (error) {
            console.log(error);
        }
    };

    const actions = [
        { title: 'Chat', Icon: <CommentIcon />, path: '' },
        { title: 'Group', Icon: <Group />, path: 'Groups' },
        { title: 'Calls', Icon: <Call />, path: 'call' },
        { title: 'Profile', Icon: <AccountCircle />, path: 'profile' },
    ];

    return (
        <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{
                position: 'absolute', bottom: 16, right: 16,
                display: {
                    sm: "block",
                     md: "none"
                }
            }}
            icon={<SpeedDialIcon />}
        >
            {/* Map through actions for navigation */}
            {actions.map(({ title, Icon, path }) => (

                <SpeedDialAction icon={Icon} tooltipTitle={title}  onClick={()=>{
                    navigate(`/${path}`);
                }}>
                  
                </SpeedDialAction>

            ))}



            {/* Logout Action */}
            <SpeedDialAction
                tooltipTitle="Logout"
                onClick={handlelogout}
                icon={<LogoutSharp />}
            />
        </SpeedDial>
    );
};

export default Speednavbar;
