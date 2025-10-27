import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Header from './components/Header';
import Home from './components/Home';
import TextChat from './components/TextChat';
import VideoChat from './components/VideoChat';
import PerformanceMonitor from './components/PerformanceMonitor';
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import SafetyGuidelines from './components/SafetyGuidelines';
import ContactUs from './components/ContactUs';
import PrivateRoomChat from './components/PrivateRoomChat';

function App() {
  const [socket, setSocket] = useState(null);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'textChat', 'videoChat', 'privacy', 'terms', 'safety', 'contact', 'privateRoom'
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [roomId, setRoomId] = useState(null);
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting'); // 'connecting', 'connected', 'disconnected', 'error'

  useEffect(() => {
    // Auto-detect backend URL based on environment
    // For production: Use your deployed Render backend URL
    // For development: Use localhost
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 
                       (window.location.hostname === 'localhost' 
                         ? 'http://localhost:5001' 
                         : 'https://maskchat-pbo3.onrender.com');
    
    console.log('🔌 Attempting to connect to:', backendUrl);
    
    const newSocket = io(backendUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000, // Increased from 5000 to 20000ms (20 seconds)
      forceNew: true,
      reconnection: true,
      reconnectionDelay: 1000, // Start reconnecting after 1 second
      reconnectionDelayMax: 5000, // Max delay between reconnection attempts
      maxReconnectionAttempts: 5, // Try up to 5 times
      reconnectionAttempts: 5,
      randomizationFactor: 0.5, // Add randomness to prevent thundering herd
      upgrade: true, // Allow transport upgrades
      rememberUpgrade: true
    });
    setSocket(newSocket);
    
    // Test socket connection
    newSocket.on('connect', () => {
      console.log('✅ Connected to backend:', newSocket.id);
      console.log('✅ Socket transport:', newSocket.io.engine.transport.name);
      setConnectionStatus('connected');
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from backend:', reason);
      setConnectionStatus('disconnected');
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
      console.error('❌ Error details:', error.message);
      setConnectionStatus('error');
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Reconnected after', attemptNumber, 'attempts');
      setConnectionStatus('connected');
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('❌ Reconnection error:', error);
      setConnectionStatus('error');
    });

    newSocket.on('reconnect_attempt', (attemptNumber) => {
      console.log('🔄 Reconnection attempt:', attemptNumber);
      setConnectionStatus('connecting');
    });

    newSocket.on('reconnecting', (attemptNumber) => {
      console.log('🔄 Reconnecting... attempt:', attemptNumber);
      setConnectionStatus('connecting');
    });

    // Listen for user count updates
    newSocket.on('userCountUpdate', (count) => {
      setOnlineUsers(count);
    });

    // Listen for partner found
    newSocket.on('partnerFound', (data) => {
      console.log('📩 App.js received partnerFound:', JSON.stringify(data));
      setRoomId(data.roomId);
      // Only change view for text chat (VideoChat component already shown)
      if (data.type === 'text') {
        setCurrentView('textChat');
      }
      // Don't change view for video - already showing VideoChat component
    });

    // Listen for partner disconnected
    newSocket.on('partnerDisconnected', () => {
      alert('Your partner has disconnected.');
      setCurrentView('home');
      setRoomId(null);
    });

    // Listen for room creation success
    newSocket.on('roomCreated', (data) => {
      console.log('Room created event received:', data);
      setRoomId(data.roomId);
      setRoomName(data.roomName);
      setIsHost(true);
      setCurrentView('privateRoom');
      // Show room ID to user
      alert(`Room created successfully!\nRoom ID: ${data.roomId}\n\nShare this Room ID with your friends to let them join!`);
    });

    // Listen for room joining success
    newSocket.on('roomJoined', (data) => {
      console.log('Room joined successfully:', data);
      setRoomId(data.roomId);
      setRoomName(data.roomName);
      setIsHost(false);
      setCurrentView('privateRoom');
      // Reset any joining states
      window.dispatchEvent(new CustomEvent('roomJoinSuccess'));
    });

    // Listen for room errors
    newSocket.on('roomError', (data) => {
      alert(`Room Error: ${data.message}`);
      // Redirect back to home on error
      setCurrentView('home');
      setRoomId(null);
      setRoomName('');
      setIsHost(false);
      // Reset any joining states
      window.dispatchEvent(new CustomEvent('roomJoinError'));
    });

    // Listen for user joined room
    newSocket.on('userJoinedRoom', (data) => {
      console.log('Someone joined your room:', data.message);
    });

    // Listen for room ended (handled by PrivateRoomChat component)
    newSocket.on('roomEnded', (data) => {
      console.log('🏁 App.js received room ended event:', data);
      setCurrentView('home');
      setRoomId(null);
      setRoomName('');
      setIsHost(false);
    });

    // Listen for room name update
    newSocket.on('roomNameUpdate', (data) => {
      setRoomName(data.roomName);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handleStartTextChat = () => {
    if (socket) {
      socket.emit('joinTextQueue');
      setCurrentView('textChat');
    }
  };

  const handleStartVideoChat = () => {
    if (socket) {
      socket.emit('joinVideoQueue');
      setCurrentView('videoChat');
    }
  };

  const handleBackToHome = () => {
    if (socket) {
      socket.emit('leaveQueue');
      socket.emit('stopChat');
    }
    setCurrentView('home');
    setRoomId(null);
    setRoomName('');
    setIsHost(false);
  };

  const handleLeaveRoom = () => {
    if (socket && roomId) {
      socket.emit('leaveRoom', { roomId });
    }
    setCurrentView('home');
    setRoomId(null);
    setRoomName('');
    setIsHost(false);
  };

  const handleNavigation = (view) => {
    setCurrentView(view);
    // Scroll to top when navigating to a new page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateRoom = (roomName, password) => {
    console.log('🏠 Creating room:', { roomName, password });
    
    if (!socket) {
      console.error('❌ Socket not connected');
      alert('Connection error. Please refresh the page.');
      return;
    }
    
    // Generate room ID immediately for immediate redirection
    const roomId = 'room_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    
    console.log('🏠 Generated room ID:', roomId);
    
    // Set room data immediately
    setRoomId(roomId);
    setRoomName(roomName);
    setIsHost(true);
    setCurrentView('privateRoom');
    
    // Also emit to socket for backend tracking
    socket.emit('createRoom', { roomName, password, roomId });
    console.log('🏠 Room creation event emitted to backend');
  };

  const handleJoinRoom = (roomId, password) => {
    console.log('🚪 Joining room:', { roomId, password });
    
    if (!socket) {
      console.error('❌ Socket not connected');
      alert('Connection error. Please refresh the page.');
      return;
    }
    
    // Don't redirect immediately - wait for backend validation
    socket.emit('joinRoom', { roomId, password });
    console.log('🚪 Room join event emitted to backend');
  };

  return (
    <div className="App">
      {currentView !== 'privateRoom' && (
        <Header 
          onlineUsers={onlineUsers}
          connectionStatus={connectionStatus}
        />
      )}
      <div className="container">
        {currentView === 'home' && (
          <Home 
            onStartTextChat={handleStartTextChat}
            onStartVideoChat={handleStartVideoChat}
            socket={socket}
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
          />
        )}
        {currentView === 'textChat' && (
          <TextChat 
            socket={socket}
            roomId={roomId}
            onBackToHome={handleBackToHome}
          />
        )}
        {currentView === 'videoChat' && (
          <VideoChat 
            socket={socket}
            roomId={roomId}
            onBackToHome={handleBackToHome}
          />
        )}
        {currentView === 'privacy' && (
          <PrivacyPolicy onBack={handleNavigation} />
        )}
        {currentView === 'terms' && (
          <TermsOfService onBack={handleNavigation} />
        )}
        {currentView === 'safety' && (
          <SafetyGuidelines onBack={handleNavigation} />
        )}
        {currentView === 'contact' && (
          <ContactUs onBack={handleNavigation} />
        )}
        {currentView === 'privateRoom' && (
          <PrivateRoomChat 
            socket={socket}
            roomId={roomId}
            roomName={roomName}
            isHost={isHost}
            onLeaveRoom={handleLeaveRoom}
          />
        )}
      </div>
      <PerformanceMonitor 
        isVisible={showPerformanceMonitor}
        onClose={() => setShowPerformanceMonitor(false)}
      />
      {currentView !== 'privateRoom' && (
        <Footer onNavigate={handleNavigation} />
      )}
    </div>
  );
}

export default App;
