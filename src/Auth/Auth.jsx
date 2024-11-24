import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const Auth = ({ user, redirect = "/login", children }) => {
  console.log(user);
  if (!user) {
    console.log("User not logged in. Should be on Login Page.");
    return <Navigate to={redirect} />
  }


  return (
    children ? children : <Outlet />
  )
}

export default Auth