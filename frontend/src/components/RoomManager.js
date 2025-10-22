import React, { useState } from 'react';
import Modal from './Modal';

const RoomManager = ({ socket, onJoinRoom, onCreateRoom }) => {
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [roomData, setRoomData] = useState({
    roomName: '',
    password: '',
    joinRoomId: '',
    joinPassword: ''
  });

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (roomData.roomName.trim() && roomData.password.trim()) {
      onCreateRoom(roomData.roomName, roomData.password);
      setRoomData({ roomName: '', password: '', joinRoomId: '', joinPassword: '' });
      setShowCreateRoom(false);
    }
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (roomData.joinRoomId.trim() && roomData.joinPassword.trim()) {
      setIsJoining(true);
      onJoinRoom(roomData.joinRoomId, roomData.joinPassword);
      
      // Reset joining state after 5 seconds (fallback)
      setTimeout(() => {
        setIsJoining(false);
      }, 5000);
    }
  };

  // Listen for room join success/error events
  React.useEffect(() => {
    const handleJoinSuccess = () => {
      setIsJoining(false);
      setRoomData({ roomName: '', password: '', joinRoomId: '', joinPassword: '' });
      setShowJoinRoom(false);
    };

    const handleJoinError = () => {
      setIsJoining(false);
    };

    window.addEventListener('roomJoinSuccess', handleJoinSuccess);
    window.addEventListener('roomJoinError', handleJoinError);

    return () => {
      window.removeEventListener('roomJoinSuccess', handleJoinSuccess);
      window.removeEventListener('roomJoinError', handleJoinError);
    };
  }, []);

  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ 
          color: '#6c5ce7', 
          marginBottom: '0.5rem',
          fontSize: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Private Rooms
        </h2>
        <p style={{ color: '#aaa', fontSize: '0.9rem', margin: 0 }}>
          Create or join private rooms with friends
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setShowCreateRoom(!showCreateRoom)}
          className="btn btn-primary"
          style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 20px'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Create Room
        </button>

        <button 
          onClick={() => setShowJoinRoom(!showJoinRoom)}
          className="btn btn-secondary"
          style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 20px'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          Join Room
        </button>
      </div>

      {/* Create Room Modal */}
      <Modal 
        isOpen={showCreateRoom} 
        onClose={() => setShowCreateRoom(false)}
        title="Create New Room"
        type="create"
      >
        <form onSubmit={handleCreateRoom} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ color: '#ccc', display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Room Name *
            </label>
            <input
              type="text"
              value={roomData.roomName}
              onChange={(e) => setRoomData({...roomData, roomName: e.target.value})}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '0.9rem'
              }}
              placeholder="Enter room name"
            />
          </div>
          <div>
            <label style={{ color: '#ccc', display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Password *
            </label>
            <input
              type="password"
              value={roomData.password}
              onChange={(e) => setRoomData({...roomData, password: e.target.value})}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '0.9rem'
              }}
              placeholder="Enter room password"
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              Create Room
            </button>
            <button 
              type="button" 
              onClick={() => setShowCreateRoom(false)}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Join Room Modal */}
      <Modal 
        isOpen={showJoinRoom} 
        onClose={() => {
          setShowJoinRoom(false);
          setIsJoining(false);
          setRoomData({ roomName: '', password: '', joinRoomId: '', joinPassword: '' });
        }}
        title="Join Existing Room"
        type="join"
      >
        <form onSubmit={handleJoinRoom} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ color: '#ccc', display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Room ID *
            </label>
            <input
              type="text"
              value={roomData.joinRoomId}
              onChange={(e) => setRoomData({...roomData, joinRoomId: e.target.value})}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '0.9rem'
              }}
              placeholder="Enter room ID"
            />
          </div>
          <div>
            <label style={{ color: '#ccc', display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Password *
            </label>
            <input
              type="password"
              value={roomData.joinPassword}
              onChange={(e) => setRoomData({...roomData, joinPassword: e.target.value})}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '0.9rem'
              }}
              placeholder="Enter room password"
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ flex: 1 }}
              disabled={isJoining}
            >
              {isJoining ? 'Joining...' : 'Join Room'}
            </button>
            <button 
              type="button" 
              onClick={() => {
                setShowJoinRoom(false);
                setIsJoining(false);
                setRoomData({ roomName: '', password: '', joinRoomId: '', joinPassword: '' });
              }}
              className="btn btn-secondary"
              style={{ flex: 1 }}
              disabled={isJoining}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RoomManager;
