import React, { useState } from 'react';

const Header = ({ onlineUsers }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header style={{ 
      background: 'rgba(20, 20, 35, 0.95)', 
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '12px 0',
      marginBottom: '15px'
    }}>
      <div className="container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          {/* Logo and Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              width: '35px',
              height: '35px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(26, 26, 46, 0.4)',
              overflow: 'hidden'
            }}>
              <img 
                src="/logo.png" 
                alt="MaskChat Logo" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain' 
                }} 
              />
            </div>
            <div>
              <h1 style={{ 
                fontSize: '1.4rem', 
                margin: 0,
                background: 'linear-gradient(45deg, #6c5ce7, #a29bfe)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: '700'
              }}>
                Mask Chat
              </h1>
              <p style={{ 
                fontSize: '0.75rem', 
                color: '#aaa',
                margin: 0
              }}>
                Anonymous • Real-time • No History
              </p>
            </div>
          </div>

          {/* Online Users & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '8px 16px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#00ff88',
                boxShadow: '0 0 8px rgba(0, 255, 136, 0.6)',
                animation: 'pulse 2s infinite'
              }}></div>
              <span style={{ fontWeight: '600' }}>{onlineUsers} online</span>
            </div>
            

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setShowMenu(!showMenu)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer',
                display: 'none'
              }}
              className="mobile-menu-btn"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div style={{
            marginTop: '20px',
            padding: '20px',
            background: 'rgba(30, 30, 46, 0.9)',
            borderRadius: '15px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a href="#home" style={{ color: 'white', textDecoration: 'none', padding: '10px' }}>
                🏠 Home
              </a>
              <a href="#privacy" style={{ color: 'white', textDecoration: 'none', padding: '10px' }}>
                🔒 Privacy Policy
              </a>
              <a href="#terms" style={{ color: 'white', textDecoration: 'none', padding: '10px' }}>
                📋 Terms of Service
              </a>
              <a href="#about" style={{ color: 'white', textDecoration: 'none', padding: '10px' }}>
                ℹ️ About
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
