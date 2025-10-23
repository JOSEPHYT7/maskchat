import React, { useState, useEffect, useRef } from 'react';

const TextChat = ({ socket, roomId, onBackToHome }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isWaiting, setIsWaiting] = useState(true);
  const [waitingMessage, setWaitingMessage] = useState('Finding a stranger...');
  const [showNoUsersAlert, setShowNoUsersAlert] = useState(false);
  const [noUsersMessage, setNoUsersMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

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

    // Listen for user joined notification
    socket.on('userJoined', (data) => {
      setWaitingMessage(data.message || 'Someone joined! Looking for a match...');
      setIsWaiting(true);
    });

    // Listen for users in other queue notification
    socket.on('usersInOtherQueue', (data) => {
      setWaitingMessage(data.message || 'Users available in other chat type!');
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

    // Listen for text messages
    socket.on('textMessage', (data) => {
      setMessages(prev => [...prev, { ...data, isOwn: false }]);
    });

    // Listen for partner disconnected
    socket.on('partnerDisconnected', () => {
      setIsConnected(false);
      setIsWaiting(false);
      setMessages(prev => [...prev, { 
        text: 'Your partner has disconnected.', 
        isOwn: false, 
        isSystem: true 
      }]);
    });

    return () => {
      socket.off('partnerFound');
      socket.off('lookingForPartner');
      socket.off('userJoined');
      socket.off('usersInOtherQueue');
      socket.off('noUsersAvailable');
      socket.off('noUsersInQueue');
      socket.off('textMessage');
      socket.off('partnerDisconnected');
    };
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !isConnected) return;

    const messageData = {
      text: newMessage,
      timestamp: new Date().toISOString()
    };

    // Add to local messages
    setMessages(prev => [...prev, { ...messageData, isOwn: true }]);
    
    // Send to partner
    socket.emit('textMessage', messageData);
    
    setNewMessage('');
  };

  const handleNextPartner = () => {
    if (socket) {
      console.log('User requested next partner');
      socket.emit('nextPartner');
      setMessages([]);
      setIsWaiting(true);
      setIsConnected(false);
    }
  };

  const handleStopChat = () => {
    if (socket) {
      socket.emit('stopChat');
    }
    onBackToHome();
  };

  if (isWaiting && !isConnected) {
    return (
      <div className="text-center">
        <div className="card">
          <div className="loading" style={{ marginBottom: '20px' }}></div>
          <h2>{waitingMessage}</h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            Please wait while we find someone to connect with you.
          </p>
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
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>😔</div>
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
              if (socket) socket.emit('joinTextQueue');
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
      <div className="chat-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '15px',
        borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <h2 style={{ margin: 0 }}>Text Chat</h2>
        <div className="status connected">
          Connected
        </div>
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="empty-chat" style={{ 
              textAlign: 'center', 
              color: '#666',
              padding: '40px 20px'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>👋</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Say hello to your stranger!</h3>
              <p style={{ fontSize: '0.95rem' }}>Start typing to begin your conversation.</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.isOwn ? 'own' : 'other'}`}
                style={message.isSystem ? { 
                  textAlign: 'center', 
                  fontStyle: 'italic',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#666'
                } : {}}
              >
                {message.text}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="chat-input">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={!isConnected}
            style={{ 
              opacity: isConnected ? 1 : 0.6,
              cursor: isConnected ? 'text' : 'not-allowed'
            }}
          />
          <button 
            type="submit" 
            disabled={!isConnected || !newMessage.trim()}
            className="send-button"
            style={{ 
              opacity: (isConnected && newMessage.trim()) ? 1 : 0.6,
              cursor: (isConnected && newMessage.trim()) ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
            <span className="send-text">Send</span>
          </button>
        </form>
      </div>

      <div className="controls" style={{ marginTop: '15px' }}>
        <button className="btn btn-secondary" onClick={handleNextPartner} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
          </svg>
          <span>Next Partner</span>
        </button>
        <button className="btn btn-danger" onClick={handleStopChat} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
          <span>Stop Chat</span>
        </button>
      </div>
    </div>
  );
};

export default TextChat;
