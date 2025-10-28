# MeetWorld

A real-time anonymous chat platform that allows users to connect randomly for text chat or video chat, with live online user count, intelligent matching, private rooms, and no chat history or user data storage.

## Features

- 🔒 **Completely Anonymous** - No registration or login required
- 💬 **Text Chat** - Real-time messaging with strangers
- 📹 **Video Chat** - Face-to-face conversations using WebRTC
- 👥 **Live User Count** - See how many users are online
- 🎲 **Intelligent Matching** - Advanced algorithm for better pairings
- ⏭️ **Skip Partners** - Move to the next stranger anytime
- 🏠 **Private Rooms** - Create or join password-protected rooms with friends
- 🚫 **No Data Storage** - Zero chat history or user data stored
- 🔐 **End-to-End Encryption** - Video calls are P2P encrypted
- ☕ **Support System** - Buy Me a Coffee integration for donations
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🎨 **Modern UI** - Clean, professional interface with popup modals

## Tech Stack

### Backend
- **Node.js** - Server runtime
- **Express** - Web framework
- **Socket.IO** - Real-time communication
- **CORS** - Cross-origin resource sharing
- **Advanced Matching Algorithm** - Intelligent user pairing system

### Frontend
- **React.js** - UI framework
- **Socket.IO Client** - Real-time communication
- **WebRTC** - Peer-to-peer video/audio
- **CSS3** - Modern styling with gradients and animations
- **Modal Components** - Popup interfaces for better UX

## Project Structure

```
MeetWorld/
├── backend/
│   ├── server.js              # Express + Socket.IO server
│   ├── matchingAlgorithm.js    # Advanced user matching system
│   └── package.json           # Backend dependencies
├── frontend/
│   ├── public/
│   │   ├── index.html         # HTML template
│   │   └── favicon.ico        # Site favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js      # Header with user count
│   │   │   ├── Home.js        # Home page with chat options
│   │   │   ├── TextChat.js    # Text chat interface
│   │   │   ├── VideoChat.js   # Video chat interface
│   │   │   ├── RoomManager.js # Private room management
│   │   │   ├── PrivateRoomChat.js # Private room chat interface
│   │   │   ├── Modal.js       # Reusable modal component
│   │   │   ├── Footer.js      # Footer with support section
│   │   │   ├── ContactUs.js   # Contact page
│   │   │   ├── PrivacyPolicy.js # Privacy policy page
│   │   │   ├── TermsOfService.js # Terms of service page
│   │   │   ├── SafetyGuidelines.js # Safety guidelines page
│   │   │   └── PerformanceMonitor.js # Performance monitoring
│   │   ├── App.js             # Main app component
│   │   ├── index.js           # React entry point
│   │   └── index.css          # Global styles
│   └── package.json           # Frontend dependencies
└── README.md                  # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

1. **Open the application** in your browser at `http://localhost:3000`
2. **Choose your chat mode**:
   - Click "Text Chat" for anonymous messaging
   - Click "Video Chat" for face-to-face conversations
   - Click "Create Room" to create a private room with friends
   - Click "Join Room" to join an existing private room
3. **Wait for pairing** - The intelligent system will find you a compatible stranger
4. **Start chatting** - Begin your anonymous conversation
5. **Control your session**:
   - Use "Next Partner" to skip to another stranger
   - Use "Stop Chat" to end the session
   - Use "End Room" (in private rooms) to close the room

## Features Explained

### Intelligent Matching System
- Advanced multi-criteria matching algorithm
- Users are placed in separate queues for text and video chats
- Intelligent pairing based on behavior, wait time, and compatibility
- Cross-queue notifications when users are available in other chat types
- Each pair gets a unique ephemeral room ID
- No user data is stored during the pairing process

### Private Rooms
- Create password-protected rooms to chat with friends
- Share room ID and password with specific people
- Room creator can end the room for all participants
- Separate from random matching system

### Text Chat
- Real-time messaging using Socket.IO
- Messages are relayed without storage
- Support for "Next" and "Stop" commands
- Automatic partner disconnection handling

### Video Chat
- WebRTC peer-to-peer video/audio connection
- Signaling handled via Socket.IO server
- STUN servers for NAT traversal
- Mute/unmute and video on/off controls
- Direct P2P connection (no server relay)

### Privacy & Security
- No user accounts or registration
- No message or video storage
- Ephemeral session IDs only
- WebRTC encryption for video calls
- Complete anonymity

## API Endpoints

### Health Check
- **GET** `/health` - Returns server status and statistics
- **GET** `/analytics` - Returns detailed analytics and metrics
- **GET** `/performance` - Returns performance monitoring data
- **GET** `/test-algorithm` - Test the matching algorithm
- **GET** `/algorithm-health` - Check algorithm health status

### Socket.IO Events

#### Client → Server
- `joinTextQueue` - Join text chat queue
- `joinVideoQueue` - Join video chat queue
- `leaveQueue` - Leave current queue
- `textMessage` - Send text message (random matching)
- `roomMessage` - Send message in private room
- `webrtc-signal` - WebRTC signaling data
- `nextPartner` - Skip to next partner
- `stopChat` - End current chat
- `createRoom` - Create private room
- `joinRoom` - Join private room
- `leaveRoom` - Leave private room
- `endRoom` - End private room (host only)

#### Server → Client
- `userCountUpdate` - Online user count update
- `partnerFound` - Partner matched successfully
- `partnerDisconnected` - Partner left the chat
- `textMessage` - Receive text message (random matching)
- `roomMessage` - Receive message in private room
- `webrtc-signal` - WebRTC signaling data
- `roomCreated` - Private room created successfully
- `roomJoined` - Successfully joined private room
- `roomError` - Error with room operation
- `roomEnded` - Room was ended by host
- `userJoinedRoom` - User joined your private room
- `userLeftRoom` - User left your private room

## Development

### Running in Development Mode

Backend with auto-restart:
```bash
cd backend
npm run dev
```

Frontend with hot reload:
```bash
cd frontend
npm start
```

### Building for Production

Frontend build:
```bash
cd frontend
npm run build
```

## Deployment Considerations

### Environment Variables
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

### Production Setup
1. Build the frontend: `npm run build`
2. Serve static files from the backend
3. Configure reverse proxy (nginx/Apache)
4. Set up SSL certificates for HTTPS
5. Configure TURN servers for WebRTC (optional)

### Optional Enhancements
- MongoDB integration for reporting/moderation
- User analytics and monitoring
- Ban/restriction system
- Language/interest filters
- Reconnection handling
- Redis for session management
- Load balancing for high traffic
- CDN integration for static assets

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Support System

- **Buy Me a Coffee Integration** - Support the project with donations
- **Clean Donation Interface** - Professional support section in footer
- **No Personal Details** - Only public donation links are shown
- **Mobile-Friendly** - Works perfectly on all devices

## Traffic Capacity

### Current Setup
- **Concurrent Users**: 1,000-2,000 users
- **Architecture**: Single Node.js process
- **Storage**: In-memory (no persistence)
- **Scaling**: Vertical only

### Recommended for High Traffic
- **PM2 Process Manager**: 10,000-20,000 users
- **Load Balancing**: 50,000-100,000 users  
- **Cloud Auto-scaling**: 500,000+ users
- **Redis Integration**: Session management
- **Database Persistence**: User analytics

## Security Notes

- All video/audio is peer-to-peer encrypted
- No server-side media storage
- STUN servers used for NAT traversal
- Optional TURN servers for strict firewalls
- No user data persistence
- Advanced matching algorithm with behavior tracking

## License

MIT License - Feel free to use and modify as needed.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues or questions, please create an issue in the repository.
