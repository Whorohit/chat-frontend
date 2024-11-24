import { Error } from '@mui/icons-material'
import { Container, Stack, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

function Notfound() {
  return (
    <Container maxWidth="lg" sx={{
      height:"100vh"
    }}>

      <Stack sx={{
        alignItems:"center"
        
      }}
       spacing={"2rem"} justifyContent={"center"} height={"100%"}>
        <Error/>
        <Typography variant='h1'>
          404
        </Typography>
        <Typography variant='h3'>
          Not Found
        </Typography>
        <Link to={"/"}> go to home
        </Link>
      </Stack>
    </Container>
  )
}

export default Notfound