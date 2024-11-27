import React, { useState } from 'react';
import { Avatar, Box, Button, Container, Divider, Grid, Stack, TextField, Typography, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { useInputValidation, useStrongPassword } from '6pp'
import { useDispatch } from 'react-redux';
import { showSnackbar } from '../Redux/snackbarslice';
import { userExists } from '../Redux/auth';
import axios from 'axios'

const FormCard = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(3),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    borderRadius: "1rem",
    boxShadow: theme.shadows[5],
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '90%',
}));

const TransitionBox = styled(Box)(({ theme }) => ({
    height: '90%',
    width: '100%',
    borderRadius: "1rem",
    backgroundImage: 'linear-gradient(to right, #7678ed, #FF416C)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'all 0.5s ease-in-out',
    color: 'white',
    fontFamily: 'Montserrat',
}));

const Login = () => {
    const dispatch = useDispatch();
    const [isLogin, setIsLogin] = useState(true);
    const name = useInputValidation("");
    const [isLoading, setisLoading] = useState(false)
    const bio = useInputValidation("");
    const username = useInputValidation("");
    const email = useInputValidation("");
    const password = useStrongPassword();
    const handleToggle = () => {
        setIsLogin(!isLogin);
    };
    // api/user/google

    const handleGoogleLogin = () => {
        window.location.href = 'https://chat-backend-orpin-xi.vercel.app/api/user/google'; // This URL should point to your backend Google auth route
    };
    // Example of handling the login in your frontend (React, for instance)



    // const handleLogin = async (e) => {
    //     setisLoading(true)

    //     e.preventDefault();
    //     try {
    //         const { data } = await axios.post(`https://chat-backend-orpin-xi.vercel.app/api/user/login`, {
    //             email: username.value,
    //             password: password.value
    //         }, {
    //             withCredentials: true,
    //             headers: {
    //                 "Content-Type": "application/json"
    //             }
    //         });
    //         // console.log('API Response:', data); // Log the full response

    //         if (data.user) {

    //             dispatch(userExists(data.user));
    //             dispatch(
    //                 showSnackbar({
    //                     message: data.message,
    //                     severity: 'success',
    //                 })
    //             );
    //             console.count(6)
    //         } else {
    //             throw new Error('User data is missing in response');
    //         }

    //     } catch (error) {
    //         console.log(error);

    //         const errorMessage = error?.response?.data?.error?.message || "Something went wrong";

    //         // toast.error(errorMessage,{
    //         //     id:toastid
    //         // });
    //         dispatch(showSnackbar({
    //             message: errorMessage,
    //             severity: "error"
    //         }))
    //     }
    //     finally {
    //         setisLoading(false)
    //     }
    // }
    const handleLogin = async (e) => {
        setisLoading(true);
        e.preventDefault();

        try {
            const { data } = await axios.post(`https://chat-backend-orpin-xi.vercel.app/api/user/login`, {
                email: username.value,
                password: password.value,
            }, {
                headers: {
                    "Content-Type": "application/json",
                }
            });

            // Log the API response for debugging
            console.log('API Response:', data);

            if (data.token) {
                // Store the JWT token in localStorage
                localStorage.setItem('token', data.token);

                // Optionally, store user information as well
                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    dispatch(userExists(data.user));
                }

                // Dispatch success message
                dispatch(showSnackbar({
                    message: data.message,
                    severity: 'success',
                }));

                console.count(6); // Debugging log
            } else {
                throw new Error('Token missing in response');
            }

        } catch (error) {
            console.log(error);

            // Handle error messages (with response or default message)
            const errorMessage = error?.response?.data?.error?.message || "Something went wrong";

            // Display error snackbar
            dispatch(showSnackbar({
                message: errorMessage,
                severity: 'error',
            }));
        } finally {
            setisLoading(false);
        }
    };

    const handleSignUp = async (e) => {
        setisLoading(true)
        dispatch(
            showSnackbar({
                message: "Loading.....",
                severity: 'success',
            })
        );
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name.value);
        formData.append("email", email.value)
        formData.append("bio", bio.value);
        formData.append("username", username.value);
        formData.append("password", password.value);
        try {
            const { data } = await axios.post(`https://chat-backend-orpin-xi.vercel.app/api/user/register`, formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (data.token) {
                localStorage.setItem('token', data.token);
                dispatch(userExists(data.user));
                dispatch(
                    showSnackbar({
                        message: "Created",
                        severity: 'success',
                    })
                );
            }

        } catch (error) {
            console.log(error);
            const errorMessage = error?.response?.data?.error?.message || "Something went wrong";
            // toast.error(errorMessage, {
            //     id: toastid
            // });
            dispatch(
                showSnackbar({
                    message: errorMessage,
                    severity: 'error',
                })
            );
        }
        finally {
            setisLoading(false)
        }
    }


    return (
        <Container
            component={"main"}
            sx={{
                display: "flex", paddingTop: "4rem",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                overflow: 'hidden'
            }}
            maxWidth="xl"
        >
            <Grid container spacing={2} width={{ xs: "90%", lg: "65%" }} sx={{ position: 'relative', height: '100%' }}>
                <Grid item xs={12} lg={6} sx={{ position: 'relative', height: '100%' }}>
                    <AnimatePresence >
                        {isLogin ? (
                            <motion.div
                                key="login"
                                initial={{ opacity: 0, x: -200 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 200 }}
                                transition={{ duration: 1.5 }}
                                style={{ height: '100%' }}
                            >
                                <FormCard>
                                    <Stack direction="column" justifyContent="center" spacing={2} marginY={"6rem"} sx={{ height: '100%' }}>
                                        <Stack alignItems={"center"} justifyContent={"center"} sx={{ backgroundColor: "white", ":hover": { bgcolor: "rgba(255,255,255,0.7)" } }}>
                                            <Avatar sx={{ width: "5rem", height: "5rem", objectFit: "contain" }} />
                                        </Stack>
                                        <Typography textAlign={"center"} variant='h5'>Login</Typography>
                                        <form style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem", height: '100%' }} onSubmit={handleLogin} >
                                            <TextField label="Email" size='small' variant="outlined" fullWidth
                                                value={username.value}
                                                onChange={username.changeHandler}
                                            />
                                            <TextField label="Password" type='password' size='small' variant="outlined" fullWidth
                                                value={password.value}
                                                onChange={password.changeHandler} />
                                            <Button sx={{ marginTop: "1rem", backgroundImage: "linear-gradient(to right, #7678ed, #FF416C)" }} variant='contained' disabled={isLoading} type='submit'>
                                                Login
                                            </Button>
                                        </form>
                                        <Divider marginTop={"1rem"}>OR</Divider>
                                        <Button sx={{
                                            marginTop: "1rem", color: "#7678ed", borderColor: "#7678ed", ":hover": {
                                                borderColor: "#7678ed"
                                            }
                                        }} variant="outlined" onClick={handleGoogleLogin}>
                                            Continue with Google
                                        </Button>

                                        <Button sx={{
                                            marginTop: "1rem", color: "#7678ed", borderColor: "#7678ed", ":hover": {
                                                borderColor: "#7678ed"
                                            },
                                            display: {
                                                sm: "block",
                                                md: "none"
                                            }

                                        }} variant="outlined" onClick={handleToggle}>
                                            Create Account
                                        </Button>

                                    </Stack>
                                </FormCard>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="signupp"
                                initial={{ opacity: 0, x: -200 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 400 }}
                                transition={{ duration: 0.5 }}
                                style={{ height: '100%' }}
                            >
                                <FormCard>
                                    <Stack direction="column" justifyContent="center" spacing={2} marginY={"6rem"} sx={{ height: '100%', minHeight: "100%" }}>
                                        <Stack alignItems={"center"} justifyContent={"center"} sx={{ backgroundColor: "white", ":hover": { bgcolor: "rgba(255,255,255,0.7)" } }}>
                                            <Avatar sx={{ width: "5rem", height: "5rem", objectFit: "contain" }} />
                                        </Stack>
                                        <Typography textAlign={"center"} variant='h5'>Sign Up</Typography>
                                        <form style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem", height: '100%' }} onSubmit={handleSignUp}>
                                            <TextField label="UserName" value={username.value} onChange={username.changeHandler} size='small' variant="outlined" fullWidth />
                                            <TextField label="FullName" value={name.value} onChange={name.changeHandler} size='small' variant="outlined" fullWidth />

                                            <TextField label="Email" value={email.value} onChange={email.changeHandler} type='email' size='small' variant="outlined" fullWidth />
                                            <TextField label="Password" value={password.value} onChange={password.changeHandler} type='password' size='small' variant="outlined" fullWidth />
                                            <Button type='submit' disabled={isLoading} sx={{ marginTop: "1rem", backgroundImage: "linear-gradient(to right, #7678ed, #FF416C)" }} variant='contained'>
                                                Sign Up
                                            </Button>
                                            <Divider marginTop={"1rem"}>OR</Divider>
                                            <Button sx={{
                                                marginTop: "1rem", color: "#7678ed", borderColor: "#7678ed", ":hover": {
                                                    borderColor: "#7678ed"
                                                },
                                                display: {
                                                    sm: "block",
                                                    md: "none"
                                                }

                                            }} variant="outlined" onClick={handleToggle}>
                                                Login
                                            </Button>
                                        </form>

                                    </Stack>
                                </FormCard>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Grid>

                <Grid item xs={0} lg={6} sx={{ position: 'relative', display: { xs: 'none', lg: 'block' } }}>
                    <AnimatePresence >
                        {isLogin ? (
                            <motion.div
                                key="loginm"
                                initial={{ opacity: 0, x: -200 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 200 }}
                                transition={{ duration: 1.5 }}
                                style={{ height: '100%' }}
                            >
                                <TransitionBox>
                                    <Stack direction="column" justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
                                        <Typography variant='h4' sx={{ fontWeight: "bold" }}>
                                            Hello, Friend
                                        </Typography>
                                        <Typography marginY={".5rem"} textAlign={"center"}>
                                            Enter your details and start chatting with your friends
                                        </Typography>
                                        <Button
                                            sx={{
                                                textTransform: "capitalize",
                                                color: "white",
                                                borderColor: 'white',
                                                paddingX: "1.5rem",
                                                '&:hover': {
                                                    borderColor: 'white',
                                                    borderWidth: 2,
                                                },
                                                marginY: "1rem"
                                            }}
                                            variant='outlined'
                                            onClick={handleToggle}
                                        >
                                            Sign Up
                                        </Button>
                                    </Stack>
                                </TransitionBox>
                            </motion.div>) : <motion.div
                                key="login"
                                initial={{ opacity: 0, x: -200 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 200 }}
                                transition={{ duration: 1.5 }}
                                style={{ height: '100%' }}
                            >

                            <TransitionBox>
                                <Stack direction="column" justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
                                    <Typography variant='h4' sx={{ fontWeight: "bold" }}>
                                        Welcome Back
                                    </Typography>
                                    <Typography marginY={".5rem"} textAlign={"center"}>
                                        Please login to continue
                                    </Typography>
                                    <Button
                                        sx={{
                                            textTransform: "capitalize",
                                            color: "white",
                                            borderColor: 'white',
                                            paddingX: "1.5rem",
                                            '&:hover': {
                                                borderColor: 'white',
                                                borderWidth: 2,
                                            },
                                            marginY: "1rem"
                                        }}
                                        variant='outlined'
                                        onClick={handleToggle}
                                    >
                                        Login
                                    </Button>
                                </Stack>
                            </TransitionBox>
                        </motion.div>


                        }
                    </AnimatePresence>

                </Grid>
            </Grid>
        </Container>
    );
};

export default Login;
