import { keyframes, Skeleton, Stack, styled } from '@mui/material'
import React from 'react'

const Loader = () => {
    return (
        <Stack
            direction={"row"}
            gap={".5rem"}
            justifyContent={"center"}
            alignItems={"center"}
            alignSelf={"start"}>
            Typing
            <MyComponent variant='circular' width={1} height={1}
                style={{
                    animationDelay: "0.5sec"
                }} />
            <MyComponent variant='circular' width={4} height={4}
                style={{
                    animationDelay: "0.8sec"
                }} />
            <MyComponent variant='circular' width={6} height={6}
                style={{
                    animationDelay: "0.12sec"
                }} />
            <MyComponent variant='circular' width={8} height={8}
                style={{
                    animationDelay: "1.2sec"
                }} />
            <MyComponent variant='circular' width={10} height={10}
                style={{
                    animationDelay: "1.8sec"
                }} />



        </Stack>
    )
}

export default Loader

export const bounceAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.5); }
  100% { transform: scale(1); }
`;


const MyComponent = styled(Skeleton)({
    color: 'darkslategray',
    backgroundColor: 'gray',
    padding: 8,
    borderRadius: 6,
    animation: `${bounceAnimation} 1s infinite`

}
);

