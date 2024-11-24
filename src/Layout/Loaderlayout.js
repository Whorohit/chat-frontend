import { Grid, Skeleton, Stack } from '@mui/material'
import React from 'react'

function Loaderlayout() {
  return (<>
   <Grid container height={"100vh"} spacing={"1rem"} >
        <Grid item  md={3} sm={4} height={"100vh"} sx={{
          display: {
            xs: "none", sm: "block"
          }

        }} >
          <Stack>
            <Skeleton
              
              variant="rectangular"

              height={"100vh"}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={4} md={6} height={"100vh"} >
          <Stack spacing={1} height={"100vh"}>
            {
              Array.from({ length: 8 }).map(data => (
                <Skeleton
                  
                  variant="rectangular"

                  height={"5rem"}
                />
              ))
            }
          </Stack>
        </Grid>
        <Grid item  md={3} sm={4}  height={"100vh"} sx={{
          display: {
            xs: "none", sm: "block"
          }

        }} >
          <Stack>
            <Skeleton
             
              variant="rectangular"

              height={"100vh"}
            />
          </Stack>
        </Grid>
      </Grid>
    </>
  )
}

export default Loaderlayout
