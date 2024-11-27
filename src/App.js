import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { lazy, startTransition, Suspense, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Loaderlayout from './Layout/Loaderlayout';
import Auth from './Auth/Auth';
import { userExists, userNotExits } from './Redux/auth';
import { SocketProvider } from './Auth/Socket';
import DynamicSnackbar from './shared/DynamicSnackbar';
import CallDailog from './specific/CallDailog';
import Speednavbar from './specific/Speednavbar';
import GoogleCallback from './Auth/GoogleCallback';
// import { Login } from '@mui/icons-material';

// Lazy load components
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const Groups = lazy(() => import("./pages/Groups"));
const Notfound = lazy(() => import("./pages/Notfound"));
const Userprofile = lazy(() => import('./pages/Userprofile'));
const ViewProfile = lazy(() => import('./pages/ViewProfile'));
const Call = lazy(() => import('./pages/Call'));

function App() {
  const dispatch = useDispatch();
  const { user, loader } = useSelector((state) => state.auth);
  const [initialized, setInitialized] = useState(false);


  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //        const { data } = await axios.get('https://chat-backend-orpin-xi.vercel.app/api/user/protected', {
  //         withCredentials: true,
  //        });
  //       startTransition(() => {
  //         dispatch(userExists(data.user));
  //         setInitialized(true); // Set initialized to true after fetching user data
  //       });
  //     } catch (error) {
  //       startTransition(() => {
  //         dispatch(userNotExits());
  //         setInitialized(true); // Set initialized to true even if there's an error
  //       });
  //     }
  //   };
  //   fetchUser();
  // }, [dispatch]);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        // If token exists, make the request with Authorization header
        const { data } = await axios.get('https://chat-backend-orpin-xi.vercel.app/api/user/protected', {
          headers: {
            'Authorization': `Bearer ${token}`  // Include the token in the Authorization header
        }
        });
  
        // Dispatch the user data if available
        startTransition(() => {
          dispatch(userExists(data.user));
          setInitialized(true); // Set initialized to true after fetching user data
        });
      } catch (error) {
        // If there's an error (e.g. token is invalid or expired), dispatch userNotExists
        startTransition(() => {
          dispatch(userNotExits());
          setInitialized(true); // Set initialized to true even if there's an error
        });
      }
    };
  
    fetchUser();
  }, [dispatch]);
  


  if (!initialized) {
    return <Loaderlayout />;
  }

  return (
    <>
      {loader ? (
        <Loaderlayout />
      ) : (
        <Router>

          <Suspense fallback={<Loaderlayout />}>
            <Routes
            >
              {/* Define routes that require the user to be authenticated */}
              <Route element={
                <SocketProvider>
                  <Auth user={user} />
                  <Speednavbar />
                </SocketProvider>}>

                <Route path='/' element={<Home />} />
                <Route path='/chat/:id' element={<Chat />} />
                <Route path='/groups' element={<Groups />} />
                <Route path='/profile' element={<Userprofile />} />
                <Route path='/call' element={<Call />} />
                <Route path='/viewprofile/:id' element={<ViewProfile />} />
              </Route>



              {/* Public and fallback routes */}
              <Route path='/login' element={<Auth redirect='/' user={!user}><Login /></Auth>} />
              <Route path="/google/callback" element={<GoogleCallback/>} />
              <Route path='*' element={<Notfound />} />

            </Routes>


          </Suspense>

          <DynamicSnackbar />
        </Router>
      )}
    </>
  );
}

export default App;
