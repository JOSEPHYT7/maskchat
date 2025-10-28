import React from 'react';

const Footer = ({ onNavigate }) => {
  return (
    <footer style={{
      background: 'rgba(20, 20, 35, 0.95)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '40px 0',
      marginTop: '60px'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px',
          marginBottom: '30px'
        }}>
          {/* About Section */}
          <div>
            <h3 style={{ 
              color: '#6c5ce7', 
              marginBottom: '15px',
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <img 
                src="/logo.png" 
                alt="MeetWorld Logo" 
                style={{ 
                  width: '20px', 
                  height: '20px', 
                  objectFit: 'contain' 
                }} 
              />
              MeetWorld
            </h3>
            <p style={{ 
              color: '#aaa', 
              lineHeight: '1.6',
              fontSize: '0.9rem'
            }}>
              Welcome to MeetWorld! Connect with strangers anonymously. No registration, no history, 
              just real-time conversations that disappear forever.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ 
              color: '#6c5ce7', 
              marginBottom: '15px',
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
              </svg>
              Quick Links
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button onClick={() => onNavigate('privacy')} style={{ 
                color: '#aaa', 
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: 'color 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
                Privacy Policy
              </button>
              <button onClick={() => onNavigate('terms')} style={{ 
                color: '#aaa', 
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: 'color 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                </svg>
                Terms of Service
              </button>
              <button onClick={() => onNavigate('safety')} style={{ 
                color: '#aaa', 
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: 'color 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
                Safety Guidelines
              </button>
              <button onClick={() => onNavigate('contact')} style={{ 
                color: '#aaa', 
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: 'color 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                Contact Us
              </button>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 style={{ 
              color: '#6c5ce7', 
              marginBottom: '15px',
              fontSize: '1.2rem'
            }}>
              ✨ Features
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ color: '#aaa', fontSize: '0.9rem' }}>
                🔒 100% Anonymous
              </div>
              <div style={{ color: '#aaa', fontSize: '0.9rem' }}>
                ⚡ Instant Matching
              </div>
              <div style={{ color: '#aaa', fontSize: '0.9rem' }}>
                🚫 No Data Storage
              </div>
              <div style={{ color: '#aaa', fontSize: '0.9rem' }}>
                📹 Video & Text Chat
              </div>
            </div>
          </div>

          {/* Safety */}
          <div>
            <h3 style={{ 
              color: '#6c5ce7', 
              marginBottom: '15px',
              fontSize: '1.2rem'
            }}>
              🛡️ Safety First
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ color: '#aaa', fontSize: '0.9rem' }}>
                🚫 No Personal Info
              </div>
              <div style={{ color: '#aaa', fontSize: '0.9rem' }}>
                🔄 Skip Anytime
              </div>
              <div style={{ color: '#aaa', fontSize: '0.9rem' }}>
                📢 Report Issues
              </div>
              <div style={{ color: '#aaa', fontSize: '0.9rem' }}>
                🔐 End-to-End Encrypted
              </div>
            </div>
          </div>

          {/* Support Me */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '15px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            flexWrap: 'wrap'
          }}>
            {/* Left Content */}
            <div style={{ flex: '1', minWidth: '200px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                {/* Text Content */}
                <div style={{ flex: '1', minWidth: '150px' }}>
                  <h3 style={{ 
                    color: '#6c5ce7', 
                    marginBottom: '5px',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: '600'
                  }}>
                    ☕ Support My Work
                  </h3>
                  
                  <p style={{ 
                    color: '#ccc', 
                    fontSize: '0.85rem',
                    marginBottom: '5px',
                    lineHeight: '1.3'
                  }}>
                    Like what I'm building? Help keep this project running!
                  </p>
                  
                  <p style={{ 
                    color: '#ff6b6b', 
                    fontSize: '0.75rem',
                    marginBottom: '10px',
                    fontWeight: '500'
                  }}>
                    ⚠️ Current: 2,000 users. Need funding for 100,000+ users!
                  </p>
                </div>

                {/* Buy Me a Coffee Button */}
                <div style={{ flexShrink: 0 }}>
                  <a 
                    href="https://www.buymeacoffee.com/jamesbond7" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                      color: '#000',
                      textDecoration: 'none',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 3px 12px rgba(255, 215, 0, 0.3)',
                      border: 'none',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 5px 15px rgba(255, 215, 0, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 3px 12px rgba(255, 215, 0, 0.3)';
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h3l-1 1v1h12v-1l-1-1h3c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H4V5h16v11z"/>
                      <path d="M6 8h2v2H6zm4 0h2v2h-2zm4 0h2v2h-2z"/>
                    </svg>
                    Buy Me a Coffee
                  </a>
                </div>
              </div>
            </div>

            {/* QR Code - Right Side */}
            <div style={{
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '10px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              flexShrink: 0
            }}>
              <div style={{ 
                color: '#6c5ce7', 
                fontSize: '0.75rem',
                marginBottom: '6px',
                fontWeight: '600'
              }}>
                Scan QR Code
              </div>
              <img 
                src="/qr-code.png" 
                alt="QR Code for Support" 
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '6px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div style={{ color: '#666', fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} MeetWorld. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ color: '#666', fontSize: '0.8rem' }}>
              Made with ❤️ for anonymous connections
            </div>
            <div style={{ 
              background: 'linear-gradient(45deg, #6c5ce7, #a29bfe)',
              padding: '5px 10px',
              borderRadius: '10px',
              fontSize: '0.8rem',
              color: 'white'
            }}>
              🔒 Secure
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
