import React, { createContext, useContext, useMemo, useRef, useState } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const socket = useMemo(
    () =>
      io("http://localhost:5000", {
        withCredentials: true,
        auth: { token: localStorage.getItem('token') }
        
      }),
    []
  );
  const peerconnection = useRef(null);
  const localref = useRef(null);
  const remoteref = useRef(null);
  const localStream = useRef(null);
  const [from, setfrom] = useState(null)
  const [to, setto] = useState(null)
  const [incomingCall, setIncomingCall] = useState(null)
  const [id, setid] = useState(null);
  const [callid, setcallid] = useState(null);
  const [calltype, setcalltype] = useState(false);

  return (
    <SocketContext.Provider value={{ socket, peerconnection, localref, remoteref, localStream, to, setto, setfrom, from, setIncomingCall, incomingCall,setid,id,callid,setcallid ,calltype,setcalltype}}>
      {children}
    </SocketContext.Provider>
  );
};

const useSocket = () => {
  return useContext(SocketContext);
};

export { useSocket, SocketProvider };
