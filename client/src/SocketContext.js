import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();

const socket = io('http://localhost:5000');
//const socket = io('https://my-first-video-calling-app.herokuapp.com/');

const ContextProvider = ({ children }) => {
  var [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState('');
  const [call, setCall] = useState({});
  const [me, setMe] = useState('');
  const senders = useRef([]);
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const [screenSwitch, setScreenSwitch] = useState();
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);

        myVideo.current.srcObject = currentStream;
      });
    
    socket.on('me', (id) => setMe(id));
   
    socket.on('callUser', ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name:callerName, signal });
      
    });
    socket.on("callEnded", ()=>{
      window.localStorage.removeItem("state");
      setCallEnded(true);
      window.location.reload();
    });
    
  }, []);
  
  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.from });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };
  
  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('callUser', { userToCall: id, signalData: data, from: me, name});
      
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on('callAccepted', (signal) => {
      window.localStorage.removeItem("state");
      setCallAccepted(true);
      setCall({to: 'Isha'});
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };
  

  const leaveCall = () => {
    window.localStorage.removeItem("state");
    socket.emit("callEnded");
    setCallEnded(true);
    connectionRef.current.destroy();
    window.location.reload();
    
  };
  let micSwitch = true;
  let videoSwitch = true;
  
  function toggleVideo(){
    if(stream != null && !screenSwitch && stream.getVideoTracks().length > 0){
      videoSwitch = !videoSwitch;
      
      stream.getVideoTracks()[0].enabled = videoSwitch;
    }
  }
  
  function toggleMic(){
    if(stream != null && !screenSwitch &&stream.getAudioTracks().length > 0){
      micSwitch = !micSwitch;
  
      stream.getAudioTracks()[0].enabled = micSwitch;
    }  
  }

 
  function shareScreenOn() {
    navigator.mediaDevices.getDisplayMedia({ cursor: true }).then(stream => {
      const screenTrack = stream.getTracks()[0];
      stream.current = screenTrack;
      myVideo.current.srcObject = stream;
      setStream(stream);
      setScreenSwitch(true);
      
    })
  }

  function shareScreenOff() {
    stream.getTracks().forEach(track => track.stop());
    
    if(videoSwitch){
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        const screenTrack = stream.getVideoTracks()[0];
        stream.current = screenTrack;
        myVideo.current.srcObject = stream;
        setStream(stream);
      })
    }
    else{
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        const screenTrack = stream.getVideoTracks()[0];
        stream.current = screenTrack;
        myVideo.current.srcObject = stream;
        stream.getVideoTracks()[0].enabled = false;
        setStream(stream);
      })
    }
    setScreenSwitch(false);
  }
  return (
    <SocketContext.Provider value={{
      call,
      callAccepted,
      myVideo,
      userVideo,
      stream,
      name,
      setName,
      callEnded,
      me,
      shareScreenOff,
      shareScreenOn,
      callUser,
      leaveCall,
      answerCall,
      toggleVideo,
      toggleMic,
      
      micSwitch,
      videoSwitch,
    }}
    >
      {children}
    </SocketContext.Provider>
    
  );
};

export { ContextProvider, SocketContext };