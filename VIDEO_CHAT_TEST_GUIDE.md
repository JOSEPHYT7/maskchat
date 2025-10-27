# 🎥 Video Chat Testing Guide

## Prerequisites

Before testing, ensure:
- ✅ Backend server is running on port 5001
- ✅ Frontend is running on port 3000 (or deployed)
- ✅ Camera and microphone permissions enabled in browser
- ✅ Two separate browser windows/tabs or devices

---

## 🚀 Quick Start Testing

### Step 1: Start the Backend Server

```bash
cd backend
npm start
```

**Expected Output:**
```
🚀 Advanced Ephemeral Chat Server running on port 5001
📊 Health check: http://localhost:5001/health
📈 Analytics: http://localhost:5001/analytics
⚡ Performance: http://localhost:5001/performance
🧪 Algorithm Test: http://localhost:5001/test-algorithm
🔍 Algorithm Health: http://localhost:5001/algorithm-health

🎯 Advanced Features enabled:
   ✅ Multi-criteria matching algorithm
   ✅ Behavior-based compatibility scoring
   ✅ Priority-based pairing system
   ✅ Cross-queue notifications
   ✅ Real-time performance monitoring
   ✅ Comprehensive testing & validation
   ✅ Intelligent recommendations
```

### Step 2: Start the Frontend

```bash
cd frontend
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view mask-chat in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

---

## 📋 Test Scenarios

### Test 1: Basic Video Chat Connection (2 Users)

1. **Open Browser Window 1:**
   - Navigate to `http://localhost:3000`
   - Click **"Video Chat"** button
   - Allow camera/microphone permissions
   - Should see: *"Finding a stranger..."*

2. **Open Browser Window 2 (Incognito/Different Browser):**
   - Navigate to `http://localhost:3000`
   - Click **"Video Chat"** button
   - Allow camera/microphone permissions
   - Should see: *"Finding a stranger..."*

3. **Expected Result:**
   - ✅ Both users see: *"Partner found! Connecting..."*
   - ✅ Window 1 (initiator) shows: *"Initiating video call..."*
   - ✅ Window 2 (receiver) shows: *"Received call, answering..."*
   - ✅ Both show: *"Connecting to peer..."*
   - ✅ Both show: *"Connected!"* 
   - ✅ Both can see each other's video
   - ✅ Both can hear each other's audio
   - ✅ Total time: 2-5 seconds

4. **Test Controls:**
   - Click **Mute** → Audio should stop
   - Click **Unmute** → Audio should resume
   - Click **Turn Off Video** → Video should stop (black screen)
   - Click **Turn On Video** → Video should resume

---

### Test 2: No Users Available (Single User)

1. **Open One Browser Window:**
   - Click **"Video Chat"**
   - Wait 2-3 seconds

2. **Expected Result:**
   - ✅ Message: *"No users are currently online. Please try again later."*
   - ✅ Tip shown: *"You can wait here and we'll notify you when someone joins!"*
   - ✅ Two buttons: "Try Again" and "Go Back"

---

### Test 3: Next Partner

1. **With 2 users connected:**
   - In Window 1, click **"Next Partner"**

2. **Expected Result:**
   - ✅ Window 1: Returns to *"Finding a stranger..."*
   - ✅ Window 2: Shows *"Partner Disconnected"*
   - ✅ Video/audio connections properly closed
   - ✅ Window 1 re-enters the queue

---

### Test 4: Stop Chat

1. **With 2 users connected:**
   - In Window 1, click **"Stop Chat"**

2. **Expected Result:**
   - ✅ Window 1: Returns to home page
   - ✅ Camera/microphone released
   - ✅ Window 2: Shows *"Partner Disconnected"*

---

### Test 5: Connection Timeout/Retry

1. **Simulate slow connection:**
   - Open browser DevTools → Network tab
   - Throttle to "Slow 3G"
   - Connect two users

2. **Expected Result:**
   - ✅ Shows: *"Connection taking longer than expected..."*
   - ✅ Automatic retry attempt
   - ✅ Eventually connects (may take 10-30 seconds)

---

### Test 6: Camera/Microphone Permission Denied

1. **Deny permissions:**
   - Click **"Video Chat"**
   - When browser asks for camera/mic, click **"Block"**

2. **Expected Result:**
   - ✅ Alert: *"Unable to access camera and microphone. Please check your permissions."*
   - ✅ User can grant permissions and try again

---

## 🔍 Debugging

### Check Server Logs

The server console should show:
```
🚀 User SOCKET_ID_1 connected. Online users: 1
📹 User SOCKET_ID_1 joined video queue
🚀 User SOCKET_ID_2 connected. Online users: 2
📹 User SOCKET_ID_2 joined video queue
🔍 Attempting pairing for video: Queue size: 2
✅ INSTANT PAIRING: SOCKET_ID_1 (initiator) + SOCKET_ID_2 (receiver) in video room ROOM_ID
📡 Forwarding WebRTC signal from SOCKET_ID_1 to SOCKET_ID_2: offer
📡 Forwarding WebRTC signal from SOCKET_ID_2 to SOCKET_ID_1: answer
📡 Forwarding WebRTC signal from SOCKET_ID_1 to SOCKET_ID_2: ice-candidate
📡 Forwarding WebRTC signal from SOCKET_ID_2 to SOCKET_ID_1: ice-candidate
```

### Check Browser Console (F12)

**User 1 (Initiator):**
```
Partner found! {roomId: "...", type: "video", isInitiator: true}
Local media initialized successfully
Auto-initiating call as initiator...
Creating peer connection
Initiating call...
Sending offer
Connection state: connecting
Sending ICE candidate
Received answer
Connection state: connected
```

**User 2 (Receiver):**
```
Partner found! {roomId: "...", type: "video", isInitiator: false}
Local media initialized successfully
Creating peer connection for incoming signal
Received offer, creating answer
Answer sent
Sending ICE candidate
Connection state: connecting
Connection state: connected
Received remote track: MediaStream
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Unable to connect to the remote server"
**Solution:** Backend server not running
```bash
cd backend
npm start
```

### Issue 2: Camera/Mic not working
**Solution:** 
- Check browser permissions (chrome://settings/content/camera)
- Try a different browser
- Ensure no other app is using camera/mic

### Issue 3: Video shows but no audio
**Solution:**
- Check mute button status
- Check system audio settings
- Verify microphone permissions

### Issue 4: Connection stuck at "Connecting..."
**Solution:**
- Check browser console for WebRTC errors
- Try different network (STUN servers might be blocked)
- Disable VPN/proxy
- Check firewall settings

### Issue 5: "Partner found" but no video
**Solution:**
- Check browser console for errors
- Verify WebRTC signals are being exchanged (server logs)
- Try refreshing both windows
- Check NAT/firewall settings

---

## 🧪 Advanced Testing

### Test Backend Endpoints

```bash
# Health check
curl http://localhost:5001/health

# Analytics
curl http://localhost:5001/analytics

# Performance metrics
curl http://localhost:5001/performance

# Algorithm health
curl http://localhost:5001/algorithm-health
```

### Test with Multiple Users (4+ users)

1. Open 4 browser windows
2. Click "Video Chat" in all 4
3. **Expected:** 2 pairs form automatically
4. Each pair connected independently

---

## ✅ Success Criteria

A successful video chat test should show:

- [x] Automatic pairing within 2-5 seconds
- [x] Clear video on both sides
- [x] Clear audio on both sides
- [x] Mute/unmute works
- [x] Video on/off works
- [x] Next Partner works
- [x] Stop Chat works
- [x] Proper cleanup (camera light turns off)
- [x] No React warnings in console
- [x] No memory leaks (can test multiple times)

---

## 📊 Performance Expectations

- **Initial Connection:** 2-5 seconds
- **WebRTC Setup:** 1-3 seconds
- **Total Time to Video:** 3-8 seconds
- **CPU Usage:** < 10% (per user)
- **Memory Usage:** ~50-100MB (per user)
- **Network:** ~500 Kbps - 2 Mbps per stream

---

## 🎬 Recording a Test

If you want to record the test:

1. Use OBS Studio or screen recorder
2. Record both browser windows side-by-side
3. Show connection process from start to finish
4. Demonstrate all controls (mute, video, next, stop)
5. Show console logs proving automatic connection

---

## 📞 Need Help?

If tests fail:
1. Check browser console (F12) for errors
2. Check server console for errors
3. Verify both services are running
4. Try different browsers (Chrome recommended)
5. Check network connectivity
6. Review the fixes in the previous response

---

**Happy Testing! 🚀**

