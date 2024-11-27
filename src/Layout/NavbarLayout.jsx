import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Notifications, ChatBubble, Add, Group, Person2, LogoutSharp, AccountCircle, Cookie, Call } from '@mui/icons-material'
import { Badge, IconButton, Tooltip } from '@mui/material';
import Avatarcard from '../shared/Avatarcard';
import CommentIcon from '@mui/icons-material/Comment';
import ArticleIcon from '@mui/icons-material/Article';
import { Link, useNavigate } from 'react-router-dom';
import { useLazyLogoutQuery } from '../Redux/api';
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { userExists, userNotExits } from '../Redux/auth';
import { startTransition } from 'react';
const NavbarLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [logout, { data, isLoading }] = useLazyLogoutQuery();
    const handlelogout = () => {
        try {
            localStorage.clear("token")
            localStorage.clear("user")
                    dispatch(userNotExits());
                    
                
            // Redirect to login page after logout


        } catch (error) {
            console.log(error);

        }
    }

    return (
        <>
            <Box

                sx={
                    {
                        display: { xs: "none", sm: "block" },
                        bgcolor: '#665dfe',
                        // position:"relative",

                        position: "relative",
                        // Set the background to transparent
                        boxShadow: 'none', // Remove any default shadow
                        backdropFilter: 'blur(10px)',
                        height: "100vh" // Optional: adds a blur effect}
                    }
                }

            >
                <Box sx={{}} role="presentation" paddingY={".5rem"} >
                    <Avatarcard />
                    <List sx={{ marginY: "8rem", display: "flex", flexDirection: "column", justifyContent: "center", gap: ".5rem" }}>
                        {[

                            { title: "Chat", Icon: CommentIcon, path: "" },
                            { title: "Group", Icon: Group, path: "Groups" },
                            { title: "Calls", Icon: Call, path: "call" },
                            { title: "Profile", Icon: AccountCircle, path: "profile" },

                        ].map(({ title, Icon, path }) => (
                            <Link to={`/${path}`}>
                                <NavIcon key={title} title={title} Icon={Icon} />
                            </Link>
                        ))}
                        <NavIcon title={"Logout"} onClick={
                            handlelogout
                        } Icon={LogoutSharp} />
                    </List>



                    {/* <Divider
                    variant="middle"
                    sx={{
                        bgcolor: '#bdbdbd',
                        marginY: '.5rem',
                        width: "60%"
                        // Removes any left indentation
                        // Ensures the divider spans the full width
                    }}
                /> */}


                    {/* <List sx={{ marginTop: "0rem" }}>
                        {[


                           

                        ].map(({ title, Icon }) => (
                            <NavIcon key={title} title={title} Icon={Icon} />
                        ))}

                    </List> */}
                    {/* <List sx={{ marginTop: "3rem" }}>
                        <NavIcon title={"Logut"} Icon={LogoutSharp} />
                    </List> */}

                </Box>


            </Box>

        </>
    );
};

export default NavbarLayout;

const NavIcon = ({ title, Icon, onClick, value }) => {
    return (
        <ListItem disablePadding>
            <ListItemButton sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                padding: 0,  // Adjust padding if needed
            }} onClick={onClick}>
                <Tooltip title={title} arrow placement="right-end">


                    <ListItemIcon sx={{
                        justifyContent: "center",
                        color: "white",
                        fontSize: "small", // Reduce the icon size
                        minWidth: 0  // Adjust if you want to minimize the icon spacing
                    }}>
                        <IconButton color='inherit' size='medium'>  {/* Ensure the button size is small */}
                            {value ? (
                                <Badge badgeContent={value} color='error'>
                                    <Icon fontSize="medium" />
                                </Badge>
                            ) : (
                                <Icon fontSize="medium" />
                            )}
                        </IconButton>
                    </ListItemIcon>
                </Tooltip>


            </ListItemButton>
        </ListItem>

    );
};



{/* <AppBar position='fixed'   sx={{ background: 'transparent', boxShadow: "none" ,top
}}>
   <Toolbar sx={{
       display: "flex",
       flexDirection: "column",
       justifyContent: "space-between",
       alignItems: "center",
       paddingY: "1rem",
       boxShadow: "none"
   }}>
       <Avatarcard />
       {/* <Box sx={{ display: "flex", alignItems: "center" }}> */}
//    <Icon title={"Search"} Icon={ChatBubble} />
//    <Icon title={"New Group"} Icon={Add} />
//    <Icon title={"Manage Groups"} Icon={Group} />
//    <Icon title={"Friend List"} Icon={Person2} />
//    <Icon title={"Notifications"} Icon={Notifications} />
//    <Icon title={"Logout"} Icon={LogoutSharp} />
{/* </Box> */ }
//    </Toolbar>
// </AppBar> */}