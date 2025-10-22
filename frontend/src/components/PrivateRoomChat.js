import React, { useState, useEffect, useRef } from 'react';

const PrivateRoomChat = ({ socket, roomId, roomName, isHost, onLeaveRoom }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [roomUsers, setRoomUsers] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!socket) {
      console.error('❌ No socket provided to PrivateRoomChat');
      return;
    }

    console.log('🔌 PrivateRoomChat socket:', socket.id);

    // Listen for room messages
    socket.on('roomMessage', (data) => {
      console.log('Received room message:', data);
      console.log('Current socket ID:', socket.id);
      console.log('Message sender:', data.sender);
      console.log('Is own message:', data.sender === socket.id);
      
      setMessages(prev => {
        const newMessage = {
          id: Date.now() + Math.random(), // Ensure unique ID
          text: data.text,
          sender: data.sender,
          timestamp: data.timestamp,
          isOwn: data.sender === socket.id
        };
        console.log('Adding message:', newMessage);
        return [...prev, newMessage];
      });
    });

    // Listen for user joined room
    socket.on('userJoinedRoom', (data) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: `${data.username || 'Someone'} joined the room`,
        isSystem: true,
        timestamp: new Date().toLocaleTimeString()
      }]);
      setRoomUsers(prev => [...prev, data.userId]);
    });

    // Listen for user left room
    socket.on('userLeftRoom', (data) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: `${data.username || 'Someone'} left the room`,
        isSystem: true,
        timestamp: new Date().toLocaleTimeString()
      }]);
      setRoomUsers(prev => prev.filter(id => id !== data.userId));
    });

    // Listen for room ended by host
    socket.on('roomEnded', (data) => {
      console.log('🏁 Room ended event received:', data);
      alert('The host has ended the room.');
      onLeaveRoom();
    });

    // Listen for connection status
    socket.on('roomConnected', () => {
      console.log('Room connected event received');
      setIsConnected(true);
      
      // Add a welcome message
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: isHost ? 'You created this room. Share the Room ID with friends to let them join!' : 'You joined the room successfully!',
        isSystem: true,
        timestamp: new Date().toLocaleTimeString()
      }]);
    });

    // Set initial connection status
    setIsConnected(true);

    return () => {
      socket.off('roomMessage');
      socket.off('userJoinedRoom');
      socket.off('userLeftRoom');
      socket.off('roomEnded');
      socket.off('roomConnected');
    };
  }, [socket, onLeaveRoom, isHost]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      const messageData = {
        text: newMessage.trim(),
        sender: socket.id,
        timestamp: new Date().toLocaleTimeString(),
        roomId: roomId
      };
      
      console.log('💬 Sending room message:', messageData);
      console.log('💬 Socket ID:', socket.id);
      console.log('💬 Room ID:', roomId);
      socket.emit('roomMessage', messageData);
      setNewMessage('');
    } else {
      console.error('❌ Cannot send message:', { 
        hasMessage: !!newMessage.trim(), 
        hasSocket: !!socket,
        socketId: socket?.id 
      });
    }
  };

  const handleEndRoom = () => {
    if (isHost && socket) {
      if (window.confirm('Are you sure you want to end this room? All users will be disconnected.')) {
        socket.emit('endRoom', { roomId });
        onLeaveRoom();
      }
    }
  };

  const handleLeaveRoom = () => {
    if (socket) {
      socket.emit('leaveRoom', { roomId });
      onLeaveRoom();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(15px)',
        padding: '12px 16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px',
        minHeight: '60px'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          flex: 1,
          minWidth: '200px'
        }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: isConnected ? '#00ff88' : '#ff4757',
            boxShadow: isConnected ? '0 0 10px rgba(0, 255, 136, 0.5)' : '0 0 10px rgba(255, 71, 87, 0.5)'
          }}></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ 
              margin: 0, 
              color: '#ffffff', 
              fontWeight: '600',
              fontSize: 'clamp(14px, 4vw, 18px)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {roomName} {isHost && '(Host)'}
            </h3>
            <p style={{ 
              margin: 0, 
              fontSize: 'clamp(10px, 3vw, 12px)', 
              color: '#b0b0b0',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              Room ID: {roomId}
            </p>
          </div>
        </div>
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'flex-end'
        }}>
          <span style={{ 
            color: '#b0b0b0', 
            fontSize: 'clamp(10px, 3vw, 12px)', 
            opacity: 0.9,
            whiteSpace: 'nowrap'
          }}>
            {roomUsers.length + 1} users
          </span>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(roomId);
              alert('Room ID copied to clipboard!');
            }}
            style={{ 
              padding: '8px 12px', 
              fontSize: 'clamp(10px, 3vw, 12px)',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            Copy ID
          </button>
          <button 
            onClick={() => {
              const testMessage = {
                text: 'Test message from ' + (isHost ? 'host' : 'guest'),
                sender: socket.id,
                timestamp: new Date().toLocaleTimeString(),
                roomId: roomId
              };
              console.log('Sending test message:', testMessage);
              socket.emit('roomMessage', testMessage);
            }}
            style={{ 
              padding: '8px 12px', 
              fontSize: 'clamp(10px, 3vw, 12px)',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            Test
          </button>
          {isHost && (
            <button 
              onClick={handleEndRoom}
              style={{ 
                padding: '8px 12px', 
                fontSize: 'clamp(10px, 3vw, 12px)',
                background: 'rgba(255, 71, 87, 0.2)',
                border: '1px solid rgba(255, 71, 87, 0.4)',
                borderRadius: '6px',
                color: '#ff4757',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 71, 87, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 71, 87, 0.2)';
              }}
            >
              End
            </button>
          )}
          <button 
            onClick={handleLeaveRoom}
            style={{ 
              padding: '8px 12px', 
              fontSize: 'clamp(10px, 3vw, 12px)',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            Leave
          </button>
        </div>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 'clamp(10px, 3vw, 20px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(8px, 2vw, 12px)',
        background: 'rgba(0, 0, 0, 0.1)'
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.isOwn ? 'own' : 'other'} ${message.isSystem ? 'system' : ''}`}
            style={{
              marginBottom: 'clamp(6px, 1.5vw, 10px)',
              padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
              borderRadius: 'clamp(12px, 3vw, 20px)',
              maxWidth: 'clamp(200px, 70%, 500px)',
              wordWrap: 'break-word',
              backgroundColor: message.isSystem 
                ? 'rgba(255, 71, 87, 0.2)' 
                : message.isOwn 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                  : 'rgba(255, 255, 255, 0.1)',
              color: message.isSystem ? '#ff4757' : '#ffffff',
              alignSelf: message.isOwn ? 'flex-end' : 'flex-start',
              fontSize: 'clamp(12px, 3vw, 14px)',
              border: message.isSystem ? '1px solid rgba(255, 71, 87, 0.3)' : 'none',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              lineHeight: '1.4'
            }}
          >
            {!message.isSystem && (
              <div style={{ 
                fontSize: 'clamp(10px, 2.5vw, 11px)', 
                opacity: 0.8, 
                marginBottom: '4px',
                fontWeight: '500',
                color: message.isOwn ? 'rgba(255, 255, 255, 0.9)' : '#b0b0b0'
              }}>
                {message.sender === socket.id ? 'You' : 'Other User'}
              </div>
            )}
            <div style={{ 
              fontSize: 'clamp(12px, 3vw, 14px)',
              lineHeight: '1.4',
              wordBreak: 'break-word'
            }}>
              {message.text}
            </div>
            <div style={{ 
              fontSize: 'clamp(9px, 2.5vw, 10px)', 
              opacity: 0.6, 
              marginTop: '4px',
              color: message.isOwn ? 'rgba(255, 255, 255, 0.7)' : '#888'
            }}>
              {message.timestamp}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} style={{
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(15px)',
        padding: 'clamp(12px, 3vw, 16px) clamp(16px, 4vw, 20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        gap: 'clamp(8px, 2vw, 12px)',
        alignItems: 'center',
        minHeight: '60px'
      }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={!isConnected}
          style={{ 
            flex: 1,
            padding: 'clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)',
            borderRadius: 'clamp(20px, 5vw, 25px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: '#ffffff',
            fontSize: 'clamp(12px, 3vw, 14px)',
            outline: 'none',
            opacity: isConnected ? 1 : 0.6,
            cursor: isConnected ? 'text' : 'not-allowed',
            transition: 'all 0.2s ease',
            minHeight: 'clamp(36px, 8vw, 44px)'
          }}
          onFocus={(e) => {
            e.target.style.border = '1px solid rgba(255, 255, 255, 0.4)';
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)';
            e.target.style.background = 'rgba(255, 255, 255, 0.05)';
          }}
        />
        <button 
          type="submit" 
          disabled={!isConnected || !newMessage.trim()}
          style={{ 
            padding: 'clamp(10px, 2.5vw, 12px) clamp(16px, 4vw, 20px)',
            borderRadius: 'clamp(20px, 5vw, 25px)',
            border: 'none',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#ffffff',
            fontSize: 'clamp(12px, 3vw, 14px)',
            fontWeight: '600',
            cursor: (isConnected && newMessage.trim()) ? 'pointer' : 'not-allowed',
            opacity: (isConnected && newMessage.trim()) ? 1 : 0.6,
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(4px, 1.5vw, 6px)',
            transition: 'all 0.3s ease',
            minHeight: 'clamp(36px, 8vw, 44px)',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
          }}
          onMouseEnter={(e) => {
            if (isConnected && newMessage.trim()) {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
          }}
        >
          <svg 
            width="clamp(14px, 3.5vw, 16px)" 
            height="clamp(14px, 3.5vw, 16px)" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
          Send
        </button>
      </form>
    </div>
  );
};

export default PrivateRoomChat;
