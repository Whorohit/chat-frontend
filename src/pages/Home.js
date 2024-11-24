import React from 'react'
import Applayout from '../Layout/Applayout'
import Chatlist from '../specific/Chatlist'
import { Box, Container, Typography } from '@mui/material'

const Home = ({ chatId, user ,chats = [], archived = {},newmessagesAlert=[]}) => {
  return (
    <div className='h-screen'>
      <Box bgcolor={"grey"} height={"100vh"} display={{
        xs: "none",
        sm: "block"
      }} >
        <Typography p={"5rem"} variant='h5' textAlign={"center"}
        > Select  a  friend to text</Typography>;
      </Box>

      <Container sx={{
        display: {
          xs: 'block', // Show on extra small screens
          sm: 'none',  // Hide on small screens and larger
        },
        height: '100vh',
    }}>
        <Chatlist chatId={chatId}  chats={chats} archived={archived}  newmessagesAlert={newmessagesAlert}   />
      </Container>
    </div>

  )
}

export default Applayout(Home)