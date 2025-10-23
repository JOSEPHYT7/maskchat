import React, { useState, useEffect, useRef, useCallback } from 'react';

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
  const [connectionStatus, setConnectionStatus] = useState('Initializing...');
  
  const [isInitiator, setIsInitiator] = useState(false);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const connectionTimeoutRef = useRef(null);

  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' }
    ]
  };

  // Initialize local media - useCallback to prevent recreating on every render
  const initializeLocalMedia = useCallback(async () => {
    try {
      console.log('🎬 Requesting camera and microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      setLocalStream(stream);
      console.log('✅ Local media initialized successfully');
      console.log('📹 Video tracks:', stream.getVideoTracks().length);
      console.log('🎤 Audio tracks:', stream.getAudioTracks().length);
    } catch (error) {
      console.error('❌ Error accessing media devices:', error);
      alert('Unable to access camera and microphone. Please check your permissions and ensure no other application is using them.');
      setConnectionStatus('Camera/Mic access denied');
    }
  }, []);

  // Define createPeerConnection early
  const createPeerConnection = useCallback(() => {
    if (!localStream) {
      console.error('Cannot create peer connection without local stream');
      return null;
    }

    console.log('Creating new peer connection');
    const peerConnection = new RTCPeerConnection(iceServers);
    
    // Add local stream to peer connection
    localStream.getTracks().forEach(track => {
      console.log('Adding track to peer connection:', track.kind);
      peerConnection.addTrack(track, localStream);
    });

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      console.log('✅ Received remote track:', event.streams[0]);
      setRemoteStream(event.streams[0]);
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socket) {
        console.log('📡 Sending ICE candidate');
        socket.emit('webrtc-signal', {
          type: 'ice-candidate',
          candidate: event.candidate
        });
      } else if (!event.candidate) {
        console.log('All ICE candidates have been sent');
      }
    };

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      console.log('🔗 Connection state:', peerConnection.connectionState);
      switch (peerConnection.connectionState) {
        case 'connecting':
          setConnectionStatus('Connecting to peer...');
          break;
        case 'connected':
          setConnectionStatus('Connected!');
          console.log('✅ Successfully connected!');
          break;
        case 'disconnected':
          setConnectionStatus('Disconnected');
          console.log('⚠️ Connection disconnected');
          break;
        case 'failed':
          setConnectionStatus('Connection failed');
          console.log('❌ Connection failed');
          break;
        default:
          break;
      }
    };

    // Handle ICE connection state changes
    peerConnection.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', peerConnection.iceConnectionState);
      
      if (peerConnection.iceConnectionState === 'failed') {
        console.log('❌ ICE connection failed');
        setConnectionStatus('Connection failed - Please try again');
      } else if (peerConnection.iceConnectionState === 'disconnected') {
        console.log('⚠️ ICE connection disconnected');
      }
    };

    peerConnectionRef.current = peerConnection;
    return peerConnection;
  }, [localStream, socket]);

  // Define handleWebRTCSignal early
  const handleWebRTCSignal = useCallback(async (data) => {
    try {
      const peerConnection = peerConnectionRef.current;
      
      if (!peerConnection) {
        console.warn('⚠️ Received WebRTC signal but peer connection not ready yet. Ignoring:', data.type);
        return;
      }

      switch (data.type) {
        case 'offer':
          console.log('📨 Received offer, creating answer');
          setConnectionStatus('Received call, answering...');
          
          // Set remote description
          await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
          console.log('✅ Remote description set');
          
          // Create and send answer
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          console.log('✅ Local description (answer) set');
          
          if (socket) {
            socket.emit('webrtc-signal', {
              type: 'answer',
              answer: answer
            });
            console.log('📤 Answer sent to peer');
          }
          break;

        case 'answer':
          console.log('📨 Received answer');
          setConnectionStatus('Call answered, connecting...');
          await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
          console.log('✅ Remote description (answer) set');
          break;

        case 'ice-candidate':
          console.log('📨 Received ICE candidate');
          if (data.candidate) {
            await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
            console.log('✅ ICE candidate added');
          }
          break;
          
        default:
          console.warn('Unknown WebRTC signal type:', data.type);
      }
    } catch (error) {
      console.error('❌ Error handling WebRTC signal:', error);
      setConnectionStatus('Connection error: ' + error.message);
    }
  }, [socket]);

  // Define initiateCall early
  const initiateCall = useCallback(async () => {
    try {
      console.log('🎬 Initiating call as initiator...');
      setConnectionStatus('Creating offer...');
      
      const peerConnection = peerConnectionRef.current;
      if (!peerConnection) {
        console.error('❌ Peer connection not ready');
        setConnectionStatus('Connection not ready...');
        return;
      }

      // Create offer
      console.log('📝 Creating offer...');
      const offer = await peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      
      // Set local description
      await peerConnection.setLocalDescription(offer);
      console.log('✅ Local description (offer) set');
      
      // Send offer to peer
      if (socket) {
        console.log('📤 Sending offer to peer');
        socket.emit('webrtc-signal', {
          type: 'offer',
          offer: offer
        });
        setConnectionStatus('Offer sent, waiting for answer...');
      } else {
        console.error('❌ Socket not available');
      }
    } catch (error) {
      console.error('❌ Error initiating call:', error);
      setConnectionStatus('Error initiating call: ' + error.message);
    }
  }, [socket]);

  const handleNextPartner = useCallback(() => {
    if (!socket) {
      console.error('Socket not available');
      return;
    }
    
    console.log('🔄 User requested next partner');
    socket.emit('nextPartner');
    
    // Reset all connection state
    setIsWaiting(true);
    setIsConnected(false);
    setRemoteStream(null);
    setConnectionStatus('Finding next partner...');
    setIsInitiator(false);
    
    // Clear connection timeout
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
    }
    
    // Close and clear peer connection
    if (peerConnectionRef.current) {
      console.log('Closing existing peer connection');
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
  }, [socket]);

  const handleStopChat = useCallback(() => {
    console.log('🛑 Stopping chat and cleaning up...');
    
    if (socket) {
      socket.emit('stopChat');
    }
    
    // Clear connection timeout
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
    }
    
    // Clear video elements first
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
      console.log('🧹 Cleared local video element');
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
      console.log('🧹 Cleared remote video element');
    }
    
    // Stop local stream tracks
    if (localStream) {
      localStream.getTracks().forEach(track => {
        track.stop();
        console.log('🔴 Stopped track:', track.kind);
      });
      setLocalStream(null); // Clear the local stream state
    }
    
    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    // Reset all state
    setRemoteStream(null);
    setIsConnected(false);
    setIsWaiting(true);
    setConnectionStatus('Initializing...');
    setIsInitiator(false);
    
    onBackToHome();
  }, [socket, localStream, onBackToHome]);

  // Initialize media once on mount
  useEffect(() => {
    console.log('🎥 VideoChat component mounted - initializing media');
    
    // Small delay to ensure camera is fully released from previous session
    const initTimer = setTimeout(() => {
      console.log('⏰ Attempting to initialize camera...');
      initializeLocalMedia();
    }, 300);
    
    return () => {
      clearTimeout(initTimer);
      console.log('🎥 VideoChat component will unmount');
    };
  }, [initializeLocalMedia]); // Run when initializeLocalMedia changes (which should be never due to useCallback)

  // Set up WebRTC signal listener FIRST (before other socket events)
  useEffect(() => {
    if (!socket) return;

    console.log('🎧 Setting up WebRTC signal listener');
    socket.on('webrtc-signal', handleWebRTCSignal);
    
    return () => {
      console.log('🔇 Removing WebRTC signal listener');
      socket.off('webrtc-signal', handleWebRTCSignal);
    };
  }, [socket, handleWebRTCSignal]);

  // NOW start with other socket useEffects
  useEffect(() => {
    if (!socket) return;

    // Listen for partner found
    const handlePartnerFound = (data) => {
      console.log('✨ Partner found! RAW DATA:', JSON.stringify(data));
      console.log('   - roomId:', data.roomId);
      console.log('   - type:', data.type);
      console.log('   - isInitiator (raw):', data.isInitiator);
      console.log('   - isInitiator type:', typeof data.isInitiator);
      console.log('🎭 I am the:', data.isInitiator ? 'INITIATOR (will send offer)' : 'RECEIVER (will receive offer)');
      console.log('📹 Local stream ready:', !!localStream);
      console.log('🔗 Peer connection exists:', !!peerConnectionRef.current);
      
      setIsWaiting(false);
      setIsConnected(true);
      setShowNoUsersAlert(false);
      setIsInitiator(data.isInitiator === true); // Strict comparison
      setConnectionStatus('Partner found! Connecting...');
      
      // Clear any existing timeout
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
      
      // Set connection timeout (30 seconds)
      connectionTimeoutRef.current = setTimeout(() => {
        console.log('⏱️ Connection timeout - checking if retry needed...');
        setConnectionStatus('Connection taking longer than expected...');
      }, 30000);
    };
    
    socket.on('partnerFound', handlePartnerFound);

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
      socket.off('partnerFound', handlePartnerFound);
      socket.off('lookingForPartner');
      socket.off('noUsersAvailable');
      socket.off('noUsersInQueue');
      socket.off('partnerDisconnected');
    };
  }, [socket, localStream]);

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      console.log('📹 Setting local video stream');
      console.log('📹 Stream ID:', localStream.id);
      console.log('📹 Active tracks:', localStream.getTracks().map(t => `${t.kind}: ${t.readyState}`));
      
      localVideoRef.current.srcObject = localStream;
      
      // Force play in case autoPlay doesn't work
      localVideoRef.current.play()
        .then(() => {
          console.log('✅ Local video playing successfully');
        })
        .catch(err => {
          console.error('❌ Error playing local video:', err);
        });
    } else if (!localStream) {
      console.log('⚠️ No local stream available to display');
    } else if (!localVideoRef.current) {
      console.log('⚠️ Video ref not available yet');
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      console.log('📹 Setting remote video stream');
      remoteVideoRef.current.srcObject = remoteStream;
      setConnectionStatus('Connected!');
      
      // Force play in case autoPlay doesn't work
      remoteVideoRef.current.play().catch(err => {
        console.error('Error playing remote video:', err);
      });
      
      // Clear connection timeout
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
    }
  }, [remoteStream]);

  // Create peer connection for BOTH users when partner is found and local stream is ready
  useEffect(() => {
    if (isConnected && localStream && !peerConnectionRef.current) {
      console.log('🔗 Creating peer connection (isConnected=true, localStream=ready)');
      
      const pc = createPeerConnection();
      if (pc) {
        console.log(`✅ Peer connection created - State: ${pc.connectionState}, ICE: ${pc.iceConnectionState}`);
      } else {
        console.error('❌ Failed to create peer connection');
      }
    }
  }, [isConnected, localStream, createPeerConnection]);

  // Auto-initiate call when initiator has peer connection ready
  useEffect(() => {
    if (isConnected && isInitiator && peerConnectionRef.current && localStream) {
      console.log('🎬 Auto-initiating call as initiator...');
      console.log('   ✅ All conditions met: isConnected=' + isConnected + ', isInitiator=' + isInitiator + ', peerConnection=' + !!peerConnectionRef.current + ', localStream=' + !!localStream);
      setConnectionStatus('Initiating video call...');
      // Delay to ensure the non-initiator has also created their peer connection
      const timer = setTimeout(() => {
        console.log('⏰ Timer expired, calling initiateCall()');
        initiateCall();
      }, 2000); // Increased delay to ensure both peers are ready
      
      return () => clearTimeout(timer);
    } else {
      console.log('⏳ Initiator waiting: isConnected=' + isConnected + ', isInitiator=' + isInitiator + ', peerConnection=' + !!peerConnectionRef.current + ', localStream=' + !!localStream);
    }
  }, [isConnected, isInitiator, localStream, initiateCall]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('🧹 VideoChat component unmounting - cleaning up...');
      
      // Clear timeout
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
      
      // Clear video elements
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
      
      // Stop local stream
      if (localStream) {
        localStream.getTracks().forEach(track => {
          track.stop();
          console.log('🔴 Stopped track on unmount:', track.kind);
        });
      }
      
      // Close peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        console.log('Closed peer connection on unmount');
      }
    };
  }, [localStream]);

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

  if (isWaiting && !isConnected) {
    return (
      <div className="text-center">
        <div className="card">
          <div className="loading" style={{ marginBottom: '20px' }}></div>
          <h2>{waitingMessage}</h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            Please wait while we find someone to video chat with you.
          </p>
          {localStream && (
            <div style={{ marginBottom: '1rem', color: '#00cec9' }}>
              ✅ Camera and microphone are ready
            </div>
          )}
          <button className="btn btn-danger" onClick={handleStopChat}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (showNoUsersAlert && !isConnected) {
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
            <button className="btn btn-secondary" onClick={() => {
              setShowNoUsersAlert(false);
              setIsWaiting(true);
              if (socket) socket.emit('joinVideoQueue');
            }}>
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
        <div className={`status ${remoteStream ? 'connected' : 'waiting'}`}>
          {connectionStatus}
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
              <div className="loading" style={{ marginBottom: '10px' }}></div>
              <div>{connectionStatus}</div>
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
    </div>
  );
};

export default VideoChat;
