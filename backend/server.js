const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const UserMatcher = require('./matchingAlgorithm');

// Store for private rooms
const rooms = new Map();

// Generate unique room ID
function generateRoomId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

const app = express();
const server = http.createServer(app);

// Configure Socket.IO
const io = socketIo(server);

// Middleware
app.use(express.json());

// Initialize advanced matching algorithm
const userMatcher = new UserMatcher();
userMatcher.io = io; // Pass io instance to matcher

// In-memory storage for online users
let onlineUsers = 0;

// Socket.IO connection handling
io.on('connection', (socket) => {
  onlineUsers++;
  console.log(`🚀 User ${socket.id} connected. Online users: ${onlineUsers}`);
  
  // Send current user count to the new user
  socket.emit('userCountUpdate', onlineUsers);
  
  // Broadcast updated user count to all users
  io.emit('userCountUpdate', onlineUsers);
  
  // Handle joining text chat queue with instant matching
  socket.on('joinTextQueue', () => {
    console.log(`📝 User ${socket.id} joined text queue`);
    
    // Always add user to queue first
    userMatcher.addUser(socket, 'text', {
      socketId: socket.id,
      joinTime: Date.now(),
      region: 'global', // Can be enhanced with geolocation
      language: 'en'    // Can be enhanced with language detection
    });
  });
  
  // Handle joining video chat queue with instant matching
  socket.on('joinVideoQueue', () => {
    console.log(`📹 User ${socket.id} joined video queue`);
    
    // Always add user to queue first
    userMatcher.addUser(socket, 'video', {
      socketId: socket.id,
      joinTime: Date.now(),
      region: 'global',
      language: 'en'
    });
  });
  
  // Handle leaving queue
  socket.on('leaveQueue', () => {
    console.log(`❌ User ${socket.id} left queue`);
    userMatcher.removeUser(socket.id);
  });

  // Create private room
  socket.on('createRoom', (data) => {
    console.log('Received createRoom event:', data);
    const { roomName, password, roomId: providedRoomId } = data;
    const roomId = providedRoomId || generateRoomId();
    
    // Store room information
    rooms.set(roomId, {
      id: roomId,
      name: roomName,
      password: password,
      creator: socket.id,
      users: [socket.id],
      createdAt: Date.now()
    });
    
    // Join the room
    socket.join(roomId);
    
    console.log(`🏠 Room created: ${roomId} by ${socket.id}`);
    console.log('Emitting roomCreated event:', { roomId, roomName });
    console.log('Room stored:', rooms.get(roomId));
    socket.emit('roomCreated', { roomId, roomName });
    socket.emit('roomConnected');
  });

  // Join private room
  socket.on('joinRoom', (data) => {
    console.log('Received joinRoom event:', data);
    const { roomId, password } = data;
    const room = rooms.get(roomId);
    
    console.log('Room lookup result:', room);
    
    if (!room) {
      console.log('Room not found:', roomId);
      socket.emit('roomError', { message: 'Room not found' });
      return;
    }
    
    if (room.password !== password) {
      console.log('Invalid password for room:', roomId);
      socket.emit('roomError', { message: 'Invalid password' });
      return;
    }
    
    // Check if user is already in the room
    if (room.users.includes(socket.id)) {
      console.log('User already in room');
      socket.emit('roomError', { message: 'You are already in this room' });
      return;
    }
    
    // Join the room
    socket.join(roomId);
    room.users.push(socket.id);
    
    console.log(`🚪 User ${socket.id} joined room ${roomId}`);
    socket.emit('roomJoined', { roomId, roomName: room.name });
    socket.emit('roomConnected');
    
    // Notify other users in the room
    socket.to(roomId).emit('userJoinedRoom', { 
      message: 'Someone joined the room',
      roomId: roomId,
      userId: socket.id,
      username: 'User'
    });
  });
  
  // Handle text messages (for random matching)
  socket.on('textMessage', (data) => {
    // Find the room for this user
    for (const [roomId, room] of userMatcher.activeRooms.entries()) {
      if (room.users.includes(socket.id)) {
        const otherUser = room.users.find(id => id !== socket.id);
        if (otherUser) {
          socket.to(otherUser).emit('textMessage', data);
        }
        break;
      }
    }
  });

  // Handle room messages (for private rooms)
  socket.on('roomMessage', (data) => {
    console.log('Received room message from socket:', socket.id, data);
    const { roomId, text, sender, timestamp } = data;
    const room = rooms.get(roomId);
    
    console.log('Room found:', room);
    console.log('User in room:', room && room.users.includes(socket.id));
    console.log('All rooms:', Array.from(rooms.keys()));
    
    if (room && room.users.includes(socket.id)) {
      console.log('Broadcasting message to room:', roomId);
      // Broadcast message to all users in the room (including sender)
      io.to(roomId).emit('roomMessage', {
        text,
        sender,
        timestamp,
        roomId
      });
      console.log('Message broadcasted successfully');
    } else {
      console.log('Room not found or user not in room');
      console.log('Available rooms:', Array.from(rooms.entries()));
    }
  });

  // Handle leaving room
  socket.on('leaveRoom', (data) => {
    const { roomId } = data;
    const room = rooms.get(roomId);
    
    if (room) {
      // Remove user from room
      room.users = room.users.filter(id => id !== socket.id);
      
      // Notify other users
      socket.to(roomId).emit('userLeftRoom', {
        userId: socket.id,
        username: 'User'
      });
      
      // If room is empty, delete it
      if (room.users.length === 0) {
        rooms.delete(roomId);
        console.log(`🗑️ Room ${roomId} deleted (empty)`);
      }
    }
  });

  // Handle ending room (host only)
  socket.on('endRoom', (data) => {
    console.log('Received endRoom event:', data);
    const { roomId } = data;
    const room = rooms.get(roomId);
    
    console.log('Room found:', room);
    console.log('Is creator:', room && room.creator === socket.id);
    
    if (room && room.creator === socket.id) {
      console.log('Notifying all users in room about room end');
      // Notify all users in the room (including host)
      io.to(roomId).emit('roomEnded', {
        message: 'The host has ended the room'
      });
      
      // Delete the room
      rooms.delete(roomId);
      console.log(`🏁 Room ${roomId} ended by host`);
    } else {
      console.log('Room not found or user is not the creator');
    }
  });
  
  // Handle WebRTC signaling
  socket.on('webrtc-signal', (data) => {
    // Find the room for this user
    for (const [roomId, room] of userMatcher.activeRooms.entries()) {
      if (room.users.includes(socket.id)) {
        const otherUser = room.users.find(id => id !== socket.id);
        if (otherUser) {
          socket.to(otherUser).emit('webrtc-signal', data);
        }
        break;
      }
    }
  });
  
  // Handle next partner request with instant re-matching
  socket.on('nextPartner', () => {
    console.log(`🔄 User ${socket.id} requested next partner`);
    userMatcher.handleNextPartner(socket.id, socket);
  });
  
  // Handle stop chat
  socket.on('stopChat', () => {
    console.log(`🛑 User ${socket.id} stopped chat`);
    userMatcher.removeUser(socket.id);
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    onlineUsers = Math.max(0, onlineUsers - 1);
    console.log(`👋 User ${socket.id} disconnected. Online users: ${onlineUsers}`);
    
    // Remove user from matching system
    userMatcher.removeUser(socket.id);
    
    // Broadcast updated user count
    io.emit('userCountUpdate', onlineUsers);
  });
});

// Health check endpoint with detailed analytics
app.get('/health', (req, res) => {
  const status = userMatcher.getStatus();
  res.json({ 
    status: 'OK', 
    onlineUsers,
    ...status,
    privateRooms: Array.from(rooms.entries()).map(([id, room]) => ({
      id,
      name: room.name,
      userCount: room.users.length,
      creator: room.creator
    })),
    timestamp: new Date().toISOString()
  });
});

// Analytics endpoint
app.get('/analytics', (req, res) => {
  const analytics = userMatcher.getAnalytics();
  res.json(analytics);
});

// Performance monitoring endpoint
app.get('/performance', (req, res) => {
  const status = userMatcher.getStatus();
  const performance = {
    instantPairingRate: status.textQueue + status.videoQueue === 0 ? 100 : 
      ((status.activeRooms * 2) / (status.activeRooms * 2 + status.textQueue + status.videoQueue)) * 100,
    averageWaitTime: userMatcher.metrics.averageWaitTime,
    totalPairings: userMatcher.metrics.totalPairings,
    successRate: userMatcher.metrics.successfulPairings / 
      (userMatcher.metrics.successfulPairings + userMatcher.metrics.failedPairings) * 100
  };
  res.json(performance);
});

// Algorithm testing endpoint
app.get('/test-algorithm', (req, res) => {
  const testResults = userMatcher.testMatchingAlgorithm();
  res.json(testResults);
});

// Algorithm health check
app.get('/algorithm-health', (req, res) => {
  const health = {
    status: 'OK',
    algorithm: {
      version: '2.0.0',
      features: [
        'Advanced multi-criteria matching',
        'Behavior-based compatibility',
        'Priority-based pairing',
        'Cross-queue notifications',
        'Real-time analytics'
      ],
      performance: userMatcher.getStatus(),
      recommendations: userMatcher.generateRecommendations()
    },
    timestamp: new Date().toISOString()
  };
  res.json(health);
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 Advanced Ephemeral Chat Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📈 Analytics: http://localhost:${PORT}/analytics`);
  console.log(`⚡ Performance: http://localhost:${PORT}/performance`);
  console.log(`🧪 Algorithm Test: http://localhost:${PORT}/test-algorithm`);
  console.log(`🔍 Algorithm Health: http://localhost:${PORT}/algorithm-health`);
  console.log(`\n🎯 Advanced Features enabled:`);
  console.log(`   ✅ Multi-criteria matching algorithm`);
  console.log(`   ✅ Behavior-based compatibility scoring`);
  console.log(`   ✅ Priority-based pairing system`);
  console.log(`   ✅ Cross-queue notifications`);
  console.log(`   ✅ Real-time performance monitoring`);
  console.log(`   ✅ Comprehensive testing & validation`);
  console.log(`   ✅ Intelligent recommendations`);
});