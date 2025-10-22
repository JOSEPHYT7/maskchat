import React from 'react';
import RoomManager from './RoomManager';

const Home = ({ onStartTextChat, onStartVideoChat, socket, onCreateRoom, onJoinRoom }) => {
  return (
    <div className="text-center">
      <div className="card">
        <h2 style={{ 
          fontSize: '2rem', 
          color: '#ffffff', 
          marginBottom: '2rem',
          fontWeight: 'bold'
        }}>
          Choose Your Chat Mode
        </h2>
        
        <p style={{ 
          fontSize: '1.1rem', 
          color: '#ffffff',
          marginBottom: '3rem',
          lineHeight: '1.6',
          opacity: 0.9
        }}>
          Connect with strangers anonymously. No registration required.<br/>
          Your conversations are not stored or recorded.
        </p>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary"
            onClick={onStartTextChat}
            style={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '15px',
              padding: '30px 40px',
              minWidth: '250px',
              background: 'linear-gradient(45deg, #74b9ff, #0984e3)',
              boxShadow: '0 8px 25px rgba(116, 185, 255, 0.3)'
            }}
          >
            <div style={{ 
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '5px' }}>Text Chat</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Anonymous messaging</div>
            </div>
          </button>

          <button 
            className="btn"
            onClick={onStartVideoChat}
            style={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '15px',
              padding: '30px 40px',
              minWidth: '250px',
              background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
              boxShadow: '0 8px 25px rgba(255, 107, 107, 0.3)'
            }}
          >
            <div style={{ 
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '5px' }}>Video Chat</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Face-to-face conversation</div>
            </div>
          </button>
        </div>

        {/* Room Manager */}
        <RoomManager 
          socket={socket}
          onCreateRoom={onCreateRoom}
          onJoinRoom={onJoinRoom}
        />

        <div style={{ 
          marginTop: '2rem',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '15px',
          fontSize: '0.9rem',
          color: '#ffffff'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#ffffff' }}>Privacy & Safety</h3>
          <ul style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto' }}>
            <li>✅ Completely anonymous - no registration required</li>
            <li>✅ No chat history or data storage</li>
            <li>✅ End-to-end encrypted video calls</li>
            <li>✅ Skip to next stranger anytime</li>
            <li>✅ Report inappropriate behavior</li>
            <li>✅ Private rooms with friends</li>
            <li>✅ Password-protected rooms</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
