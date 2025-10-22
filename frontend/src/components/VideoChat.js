import React, { useState, useEffect, useRef } from 'react';

const VideoChat = ({ socket, roomId, onBackToHome }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isWaiting, setIsWaiting] = useState(true);
  const [waitingMessage, setWaitingMessage] = useState('Finding a stranger...');
  const [showNoUsersAlert, setShowNoUsersAlert] = useState(false);
  const [noUsersMessage, setNoUsersMessage] = useState('');
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);

  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  useEffect(() => {
    if (!socket) return;

    // Initialize local media
    initializeLocalMedia();

    // Listen for partner found
    socket.on('partnerFound', () => {
      setIsWaiting(false);
      setIsConnected(true);
      setShowNoUsersAlert(false);
    });

    // Listen for looking for partner
    socket.on('lookingForPartner', (data) => {
      setWaitingMessage(data.message || 'Finding a stranger to connect with you...');
      setIsWaiting(true);
    });

    // Listen for no users available
    socket.on('noUsersAvailable', (data) => {
      setNoUsersMessage(data.message);
      setShowNoUsersAlert(true);
      setIsWaiting(false);
    });

    // Listen for no users in specific queue
    socket.on('noUsersInQueue', (data) => {
      setNoUsersMessage(data.message);
      setShowNoUsersAlert(true);
      setIsWaiting(false);
    });

    // Listen for WebRTC signaling
    socket.on('webrtc-signal', handleWebRTCSignal);

    // Listen for partner disconnected
    socket.on('partnerDisconnected', () => {
      setIsConnected(false);
      setIsWaiting(false);
      setRemoteStream(null);
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    });

    return () => {
      socket.off('partnerFound');
      socket.off('lookingForPartner');
      socket.off('noUsersAvailable');
      socket.off('noUsersInQueue');
      socket.off('webrtc-signal');
      socket.off('partnerDisconnected');
    };
  }, [socket]);

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const initializeLocalMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setLocalStream(stream);
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Unable to access camera and microphone. Please check your permissions.');
    }
  };

  const createPeerConnection = () => {
    const peerConnection = new RTCPeerConnection(iceServers);
    
    // Add local stream to peer connection
    if (localStream) {
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });
    }

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('webrtc-signal', {
          type: 'ice-candidate',
          candidate: event.candidate
        });
      }
    };

    peerConnectionRef.current = peerConnection;
    return peerConnection;
  };

  const handleWebRTCSignal = async (data) => {
    if (!peerConnectionRef.current) {
      createPeerConnection();
    }

    const peerConnection = peerConnectionRef.current;

    try {
      switch (data.type) {
        case 'offer':
          await peerConnection.setRemoteDescription(data.offer);
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          socket.emit('webrtc-signal', {
            type: 'answer',
            answer: answer
          });
          break;

        case 'answer':
          await peerConnection.setRemoteDescription(data.answer);
          break;

        case 'ice-candidate':
          await peerConnection.addIceCandidate(data.candidate);
          break;
      }
    } catch (error) {
      console.error('Error handling WebRTC signal:', error);
    }
  };

  const initiateCall = async () => {
    if (!peerConnectionRef.current) {
      createPeerConnection();
    }

    const peerConnection = peerConnectionRef.current;

    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      
      socket.emit('webrtc-signal', {
        type: 'offer',
        offer: offer
      });
    } catch (error) {
      console.error('Error initiating call:', error);
    }
  };

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const handleNextPartner = () => {
    if (socket) {
      console.log('User requested next partner');
      socket.emit('nextPartner');
      setIsWaiting(true);
      setIsConnected(false);
      setRemoteStream(null);
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    }
  };

  const handleStopChat = () => {
    if (socket) {
      socket.emit('stopChat');
    }
    
    // Stop local stream
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    
    onBackToHome();
  };

  if (isWaiting) {
    return (
      <div className="text-center">
        <div className="card">
          <div className="loading" style={{ marginBottom: '20px' }}></div>
          <h2>{waitingMessage}</h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            Please wait while we find someone to video chat with you.
          </p>
          <button className="btn btn-danger" onClick={handleStopChat}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (showNoUsersAlert) {
    return (
      <div className="text-center">
        <div className="card">
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📹</div>
          <h2>No Users Available</h2>
          <p style={{ color: '#666', marginBottom: '2rem', lineHeight: '1.6' }}>
            {noUsersMessage}
          </p>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            padding: '15px', 
            borderRadius: '10px',
            marginBottom: '2rem'
          }}>
            <p style={{ fontSize: '0.9rem', color: '#888' }}>
              💡 <strong>Tip:</strong> You can wait here and we'll notify you when someone joins!
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" onClick={() => window.location.reload()}>
              Try Again
            </button>
            <button className="btn btn-danger" onClick={handleStopChat}>
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '15px',
        borderBottom: '2px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h2>Video Chat</h2>
        <div className="status connected">
          Connected
        </div>
      </div>

      <div className="video-container">
        <div className="video-wrapper">
          <video 
            ref={remoteVideoRef} 
            autoPlay 
            playsInline
            style={{ 
              background: '#000',
              borderRadius: '15px'
            }}
          />
          <div className="video-label">Stranger</div>
          {!remoteStream && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>👤</div>
              <div>Waiting for stranger...</div>
            </div>
          )}
        </div>

        <div className="video-wrapper">
          <video 
            ref={localVideoRef} 
            autoPlay 
            playsInline 
            muted
            style={{ 
              background: '#000',
              borderRadius: '15px'
            }}
          />
          <div className="video-label">You</div>
        </div>
      </div>

      <div className="controls">
        <button 
          className={`btn ${isMuted ? 'btn-danger' : 'btn-success'}`}
          onClick={toggleMute}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            {isMuted ? (
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            ) : (
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            )}
          </svg>
          {isMuted ? 'Unmute' : 'Mute'}
        </button>
        
        <button 
          className={`btn ${isVideoOff ? 'btn-danger' : 'btn-success'}`}
          onClick={toggleVideo}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            {isVideoOff ? (
              <path d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82L21 17.18V6.5zM3.27 2L2 3.27 4.73 6H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.55-.18L19.73 21 21 19.73 3.27 2zM5 16V8h1.73l8 8H5z"/>
            ) : (
              <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
            )}
          </svg>
          {isVideoOff ? 'Turn On Video' : 'Turn Off Video'}
        </button>
        
        <button className="btn btn-secondary" onClick={handleNextPartner} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
          </svg>
          Next Partner
        </button>
        
        <button className="btn btn-danger" onClick={handleStopChat} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
          Stop Chat
        </button>
      </div>

      {isConnected && !remoteStream && (
        <div style={{ 
          textAlign: 'center', 
          marginTop: '20px',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '15px'
        }}>
          <button className="btn btn-success" onClick={initiateCall}>
            Start Video Call
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoChat;
