/**
 * High-Performance User Matching Algorithm
 * 
 * This algorithm provides instant pairing for anonymous chat users
 * with advanced features like load balancing, priority queuing,
 * and intelligent matching based on user behavior patterns.
 */

class UserMatcher {
  constructor() {
    // Separate queues for different chat types
    this.textQueue = new Map(); // socketId -> userData
    this.videoQueue = new Map(); // socketId -> userData
    
    // Active rooms tracking
    this.activeRooms = new Map(); // roomId -> roomData
    
    // Performance metrics
    this.metrics = {
      totalPairings: 0,
      averageWaitTime: 0,
      activeUsers: 0,
      successfulPairings: 0,
      failedPairings: 0
    };
    
    // User behavior tracking for intelligent matching
    this.userBehavior = new Map(); // socketId -> behaviorData
    
    // Load balancing weights
    this.loadBalancer = {
      textWeight: 1.0,
      videoWeight: 1.2, // Video chats are slightly prioritized
      newUserBonus: 0.1
    };
  }

  /**
   * Add user to appropriate queue with instant matching attempt
   * @param {Object} socket - Socket.IO socket object
   * @param {string} type - 'text' or 'video'
   * @param {Object} userData - Additional user information
   */
  addUser(socket, type, userData = {}) {
    const userInfo = {
      socketId: socket.id,
      type: type,
      joinTime: Date.now(),
      priority: this.calculatePriority(userData),
      behavior: this.getUserBehavior(socket.id),
      ...userData
    };

    // Add to appropriate queue
    const queue = type === 'text' ? this.textQueue : this.videoQueue;
    queue.set(socket.id, userInfo);
    
    console.log(`🚀 User ${socket.id} added to ${type} queue (Priority: ${userInfo.priority})`);
    
    // Attempt instant pairing
    const paired = this.attemptInstantPairing(socket, type);
    
    // If not paired, notify all waiting users that someone joined
    if (!paired) {
      this.notifyWaitingUsers(type);
    }
    
    // Update metrics
    this.updateMetrics();
  }

  /**
   * Calculate user priority for intelligent matching
   * @param {Object} userData - User information
   * @returns {number} Priority score (higher = more priority)
   */
  calculatePriority(userData) {
    let priority = 1.0;
    
    // New users get slight priority boost
    if (!this.userBehavior.has(userData.socketId)) {
      priority += this.loadBalancer.newUserBonus;
    }
    
    // Users who have been waiting longer get higher priority
    const waitTime = Date.now() - (userData.joinTime || Date.now());
    priority += Math.min(waitTime / 10000, 0.5); // Max 0.5 bonus for waiting
    
    // Users with good behavior get priority
    const behavior = this.userBehavior.get(userData.socketId);
    if (behavior) {
      priority += behavior.goodBehaviorScore * 0.2;
    }
    
    return priority;
  }

  /**
   * Get or create user behavior tracking
   * @param {string} socketId - User socket ID
   * @returns {Object} Behavior data
   */
  getUserBehavior(socketId) {
    if (!this.userBehavior.has(socketId)) {
      this.userBehavior.set(socketId, {
        goodBehaviorScore: 0.5, // Start neutral
        totalChats: 0,
        averageChatDuration: 0,
        lastSeen: Date.now(),
        reports: 0,
        skips: 0
      });
    }
    return this.userBehavior.get(socketId);
  }

  /**
   * Attempt instant pairing using advanced algorithms
   * @param {Object} socket - Socket object
   * @param {string} type - Chat type
   */
  attemptInstantPairing(socket, type) {
    const queue = type === 'text' ? this.textQueue : this.videoQueue;
    const otherQueue = type === 'text' ? this.videoQueue : this.textQueue;
    
    console.log(`🔍 Attempting pairing for ${type}: Queue size: ${queue.size}, Other queue: ${otherQueue.size}`);
    console.log(`📊 Total users: Text=${this.textQueue.size}, Video=${this.videoQueue.size}`);
    
    // If we have 2+ users in the current queue, try to pair them
    if (queue.size >= 2) {
      console.log(`✅ Found ${queue.size} users in ${type} queue - attempting pairing`);
      const match = this.findBestMatch(socket.id, type);
      
      if (match) {
        this.createPairing(socket, match, type);
        return true;
      }
    }
    
    // If we have users in both queues, try cross-queue pairing
    if (queue.size >= 1 && otherQueue.size >= 1) {
      console.log(`🔄 Cross-queue pairing: ${queue.size} in ${type}, ${otherQueue.size} in other queue`);
      // For now, just notify that users are available in other queue
      socket.emit('noUsersInQueue', {
        message: `No users are currently in ${type} chat.`,
        suggestion: `There are ${otherQueue.size} users in ${type === 'text' ? 'video' : 'text'} chat. Try switching chat types!`,
        alternativeType: type === 'text' ? 'video' : 'text'
      });
      return false;
    }
    
    // If only 1 user in current queue and no other users
    if (queue.size === 1 && otherQueue.size === 0) {
      console.log(`❌ Only current user in ${type} queue, no other users`);
      socket.emit('noUsersAvailable', {
        message: 'No other users are currently online. Please try again later.',
        suggestion: 'You can wait here and we\'ll notify you when someone joins!'
      });
      return false;
    }
    
    // If no users in any queue
    if (this.textQueue.size === 0 && this.videoQueue.size === 0) {
      console.log(`❌ No users in any queue - notifying user`);
      socket.emit('noUsersAvailable', {
        message: 'No users are currently online. Please try again later.',
        suggestion: 'You can wait here and we\'ll notify you when someone joins!'
      });
      return false;
    }
    
    // If we reach here, user is waiting for a partner
    console.log(`⏳ ${type} queue has ${queue.size} users, waiting for more...`);
    socket.emit('lookingForPartner', { 
      type: type,
      message: 'Finding a stranger to connect with you...',
      queuePosition: queue.size
    });
    
    return false;
  }

  /**
   * Find the best match for a user using advanced multi-criteria algorithm
   * @param {string} socketId - User socket ID
   * @param {string} type - Chat type
   * @returns {Object|null} Best match or null
   */
  findBestMatch(socketId, type) {
    const queue = type === 'text' ? this.textQueue : this.videoQueue;
    const currentUser = queue.get(socketId);
    
    if (!currentUser) return null;
    
    let bestMatch = null;
    let bestScore = -1;
    const candidates = [];
    
    console.log(`🔍 Advanced matching for ${socketId} in ${type} queue (${queue.size} users)`);
    
    // Find all potential matches with detailed scoring
    for (const [otherSocketId, otherUser] of queue.entries()) {
      if (otherSocketId === socketId) continue;
      
      const matchScore = this.calculateAdvancedMatchScore(currentUser, otherUser, type);
      const compatibility = this.calculateCompatibility(currentUser, otherUser);
      const priority = this.calculatePriorityScore(currentUser, otherUser);
      
      candidates.push({
        user: otherUser,
        socketId: otherSocketId,
        matchScore,
        compatibility,
        priority,
        totalScore: matchScore + compatibility + priority
      });
      
      console.log(`  📊 Candidate ${otherSocketId}: Match=${matchScore.toFixed(2)}, Compat=${compatibility.toFixed(2)}, Priority=${priority.toFixed(2)}, Total=${(matchScore + compatibility + priority).toFixed(2)}`);
    }
    
    // Sort by total score (highest first)
    candidates.sort((a, b) => b.totalScore - a.totalScore);
    
    if (candidates.length > 0) {
      bestMatch = candidates[0].user;
      bestScore = candidates[0].totalScore;
      
      console.log(`🎯 Selected match: ${bestMatch.socketId} with score ${bestScore.toFixed(2)}`);
      console.log(`📈 Match details: Match=${candidates[0].matchScore.toFixed(2)}, Compat=${candidates[0].compatibility.toFixed(2)}, Priority=${candidates[0].priority.toFixed(2)}`);
    }
    
    return bestMatch;
  }

  /**
   * Calculate advanced match score with multiple criteria
   * @param {Object} user1 - First user
   * @param {Object} user2 - Second user
   * @param {string} type - Chat type
   * @returns {number} Advanced match score
   */
  calculateAdvancedMatchScore(user1, user2, type) {
    let score = 0;
    
    // Base compatibility score
    score += 1.0;
    
    // Wait time priority (users waiting longer get higher priority)
    const waitTime1 = Date.now() - user1.joinTime;
    const waitTime2 = Date.now() - user2.joinTime;
    const avgWaitTime = (waitTime1 + waitTime2) / 2;
    score += Math.min(avgWaitTime / 10000, 1.0); // Max 1.0 bonus for waiting
    
    // Chat type preference
    if (type === 'video') {
      // Video chat requires more compatibility
      score += 0.5;
    }
    
    // User experience level matching
    const behavior1 = this.userBehavior.get(user1.socketId);
    const behavior2 = this.userBehavior.get(user2.socketId);
    
    if (behavior1 && behavior2) {
      // Match users with similar experience levels
      const experienceDiff = Math.abs(behavior1.totalChats - behavior2.totalChats);
      score += Math.max(0, 1 - (experienceDiff / 10)); // Normalize to 0-1
      
      // Behavior compatibility
      const behaviorDiff = Math.abs(behavior1.goodBehaviorScore - behavior2.goodBehaviorScore);
      score += (1 - behaviorDiff) * 0.6;
      
      // Penalize bad behavior
      if (behavior1.reports > 1 || behavior2.reports > 1) {
        score -= 0.3;
      }
      if (behavior1.skips > 5 || behavior2.skips > 5) {
        score -= 0.2;
      }
    }
    
    // Geographic proximity bonus
    if (user1.region && user2.region && user1.region === user2.region) {
      score += 0.3;
    }
    
    // Language matching bonus
    if (user1.language && user2.language && user1.language === user2.language) {
      score += 0.4;
    }
    
    // Time zone compatibility (if available)
    if (user1.timezone && user2.timezone) {
      const timeDiff = Math.abs(user1.timezone - user2.timezone);
      if (timeDiff <= 2) { // Within 2 hours
        score += 0.2;
      }
    }
    
    return Math.max(0, score); // Ensure non-negative score
  }

  /**
   * Calculate compatibility score between two users
   * @param {Object} user1 - First user
   * @param {Object} user2 - Second user
   * @returns {number} Compatibility score
   */
  calculateCompatibility(user1, user2) {
    let compatibility = 0;
    
    // Age compatibility (if available)
    if (user1.age && user2.age) {
      const ageDiff = Math.abs(user1.age - user2.age);
      compatibility += Math.max(0, 1 - (ageDiff / 20)); // Normalize to 0-1
    }
    
    // Interest matching (if available)
    if (user1.interests && user2.interests) {
      const commonInterests = user1.interests.filter(interest => 
        user2.interests.includes(interest)
      ).length;
      compatibility += (commonInterests / Math.max(user1.interests.length, user2.interests.length)) * 0.5;
    }
    
    // Chat history compatibility
    const behavior1 = this.userBehavior.get(user1.socketId);
    const behavior2 = this.userBehavior.get(user2.socketId);
    
    if (behavior1 && behavior2) {
      // Match users with similar chat durations
      const durationDiff = Math.abs(behavior1.averageChatDuration - behavior2.averageChatDuration);
      compatibility += Math.max(0, 1 - (durationDiff / 300000)); // 5 minutes = 300000ms
    }
    
    return Math.min(compatibility, 2.0); // Cap at 2.0
  }

  /**
   * Calculate priority score for matching
   * @param {Object} user1 - First user
   * @param {Object} user2 - Second user
   * @returns {number} Priority score
   */
  calculatePriorityScore(user1, user2) {
    let priority = 0;
    
    // New user bonus
    const behavior1 = this.userBehavior.get(user1.socketId);
    const behavior2 = this.userBehavior.get(user2.socketId);
    
    if (behavior1 && behavior1.totalChats === 0) {
      priority += 0.3; // New user bonus
    }
    if (behavior2 && behavior2.totalChats === 0) {
      priority += 0.3; // New user bonus
    }
    
    // Good behavior bonus
    if (behavior1 && behavior1.goodBehaviorScore > 0.7) {
      priority += 0.2;
    }
    if (behavior2 && behavior2.goodBehaviorScore > 0.7) {
      priority += 0.2;
    }
    
    // Active user bonus (recent activity)
    if (behavior1 && behavior2) {
      const recentActivity1 = Date.now() - behavior1.lastSeen;
      const recentActivity2 = Date.now() - behavior2.lastSeen;
      
      if (recentActivity1 < 300000) { // 5 minutes
        priority += 0.1;
      }
      if (recentActivity2 < 300000) { // 5 minutes
        priority += 0.1;
      }
    }
    
    return Math.min(priority, 1.0); // Cap at 1.0
  }

  /**
   * Create a pairing between two users
   * @param {Object} socket1 - First user socket
   * @param {Object} user2 - Second user data
   * @param {string} type - Chat type
   */
  createPairing(socket1, user2, type) {
    const roomId = this.generateRoomId();
    const user1 = this.textQueue.get(socket1.id) || this.videoQueue.get(socket1.id);
    
    // Create room
    this.activeRooms.set(roomId, {
      users: [socket1.id, user2.socketId],
      type: type,
      createdAt: Date.now(),
      user1: user1,
      user2: user2
    });
    
    // Remove from queues
    this.textQueue.delete(socket1.id);
    this.videoQueue.delete(socket1.id);
    this.textQueue.delete(user2.socketId);
    this.videoQueue.delete(user2.socketId);
    
    // Update behavior tracking
    this.updateUserBehavior(socket1.id, 'chat_started');
    this.updateUserBehavior(user2.socketId, 'chat_started');
    
    // Emit pairing events to both users
    // User 1 is the initiator for video calls
    const data1 = { roomId, type, isInitiator: true };
    const data2 = { roomId, type, isInitiator: false };
    
    console.log(`📤 Sending to ${socket1.id}:`, JSON.stringify(data1));
    socket1.emit('partnerFound', data1);
    
    console.log(`📤 Sending to ${user2.socketId}:`, JSON.stringify(data2));
    this.io.to(user2.socketId).emit('partnerFound', data2);
    
    // Update metrics
    this.metrics.totalPairings++;
    this.metrics.successfulPairings++;
    
    const waitTime = Date.now() - user1.joinTime;
    this.metrics.averageWaitTime = (this.metrics.averageWaitTime + waitTime) / 2;
    
    console.log(`✅ INSTANT PAIRING: ${socket1.id} (initiator) + ${user2.socketId} (receiver) in ${type} room ${roomId}`);
    console.log(`📊 Active rooms: ${this.activeRooms.size}, Text queue: ${this.textQueue.size}, Video queue: ${this.videoQueue.size}`);
  }

  /**
   * Remove user from all queues and rooms
   * @param {string} socketId - User socket ID
   */
  removeUser(socketId) {
    // Remove from queues
    this.textQueue.delete(socketId);
    this.videoQueue.delete(socketId);
    
    // Find and clean up rooms
    for (const [roomId, room] of this.activeRooms.entries()) {
      if (room.users.includes(socketId)) {
        const otherUser = room.users.find(id => id !== socketId);
        if (otherUser) {
          // Notify other user
          this.io.to(otherUser).emit('partnerDisconnected');
        }
        this.activeRooms.delete(roomId);
        console.log(`🧹 Cleaned up room ${roomId} for user ${socketId}`);
      }
    }
    
    // Update behavior
    this.updateUserBehavior(socketId, 'disconnected');
    this.updateMetrics();
  }

  /**
   * Handle next partner request with instant re-matching
   * @param {string} socketId - User socket ID
   * @param {Object} socket - Socket object
   */
  handleNextPartner(socketId, socket) {
    // Find current room
    let currentRoom = null;
    let currentRoomId = null;
    
    for (const [roomId, room] of this.activeRooms.entries()) {
      if (room.users.includes(socketId)) {
        currentRoom = room;
        currentRoomId = roomId;
        break;
      }
    }
    
    if (currentRoom) {
      // Notify other user
      const otherUser = currentRoom.users.find(id => id !== socketId);
      if (otherUser) {
        socket.to(otherUser).emit('partnerDisconnected');
      }
      
      // Clean up room
      this.activeRooms.delete(currentRoomId);
      
      // Update behavior
      this.updateUserBehavior(socketId, 'skipped');
      this.updateUserBehavior(otherUser, 'partner_skipped');
      
      // Re-add to queue for instant re-matching
      this.addUser(socket, currentRoom.type, {
        socketId: socketId,
        joinTime: Date.now(),
        isRejoining: true
      });
      
      console.log(`🔄 User ${socketId} rejoined ${currentRoom.type} queue for instant re-matching`);
    }
  }

  /**
   * Update user behavior tracking
   * @param {string} socketId - User socket ID
   * @param {string} action - Action performed
   */
  updateUserBehavior(socketId, action) {
    const behavior = this.getUserBehavior(socketId);
    behavior.lastSeen = Date.now();
    
    switch (action) {
      case 'chat_started':
        behavior.totalChats++;
        behavior.goodBehaviorScore += 0.1;
        break;
      case 'skipped':
        behavior.skips++;
        behavior.goodBehaviorScore -= 0.05;
        break;
      case 'partner_skipped':
        behavior.goodBehaviorScore += 0.02; // Not their fault
        break;
      case 'disconnected':
        behavior.goodBehaviorScore -= 0.01;
        break;
    }
    
    // Keep behavior score between 0 and 1
    behavior.goodBehaviorScore = Math.max(0, Math.min(1, behavior.goodBehaviorScore));
  }

  /**
   * Generate unique room ID
   * @returns {string} Room ID
   */
  generateRoomId() {
    return Math.random().toString(36).substr(2, 12);
  }

  /**
   * Update performance metrics
   */
  updateMetrics() {
    this.metrics.activeUsers = this.textQueue.size + this.videoQueue.size + (this.activeRooms.size * 2);
  }

  /**
   * Get current system status
   * @returns {Object} System status
   */
  getStatus() {
    return {
      textQueue: this.textQueue.size,
      videoQueue: this.videoQueue.size,
      activeRooms: this.activeRooms.size,
      totalUsers: this.metrics.activeUsers,
      metrics: this.metrics
    };
  }

  /**
   * Check if there are any users available for pairing
   * @param {string} type - Chat type
   * @returns {boolean} True if users are available
   */
  hasAvailableUsers(type) {
    const queue = type === 'text' ? this.textQueue : this.videoQueue;
    const otherQueue = type === 'text' ? this.videoQueue : this.textQueue;
    
    // Allow first user to join queue (queue.size >= 0)
    // Only block if there are absolutely no users in any queue
    return this.textQueue.size > 0 || this.videoQueue.size > 0;
  }

  /**
   * Notify user about availability status
   * @param {Object} socket - Socket object
   * @param {string} type - Chat type
   */
  notifyAvailabilityStatus(socket, type) {
    const queue = type === 'text' ? this.textQueue : this.videoQueue;
    const otherQueue = type === 'text' ? this.videoQueue : this.textQueue;
    
    console.log(`🔍 Checking availability for ${type}: Text queue: ${this.textQueue.size}, Video queue: ${this.videoQueue.size}`);
    
    if (this.textQueue.size === 0 && this.videoQueue.size === 0) {
      // No users in either queue
      console.log(`❌ No users available - emitting noUsersAvailable`);
      socket.emit('noUsersAvailable', {
        message: 'No users are currently online. Please try again later.',
        suggestion: 'You can wait here and we\'ll notify you when someone joins!'
      });
    } else if (queue.size <= 1 && otherQueue.size === 0) {
      // Only current user in this queue, no other users
      console.log(`❌ Only current user in ${type} queue - emitting noUsersAvailable`);
      socket.emit('noUsersAvailable', {
        message: 'No other users are currently online. Please try again later.',
        suggestion: 'You can wait here and we\'ll notify you when someone joins!'
      });
    } else if (queue.size <= 1 && otherQueue.size > 0) {
      // No users in this specific queue, but users in other queue
      console.log(`🔄 No users in ${type} queue, but ${otherQueue.size} in other queue`);
      socket.emit('noUsersInQueue', {
        message: `No users are currently in ${type} chat.`,
        suggestion: `There are ${otherQueue.size} users in ${type === 'text' ? 'video' : 'text'} chat. Try switching chat types!`,
        alternativeType: type === 'text' ? 'video' : 'text'
      });
    }
  }

  /**
   * Notify all waiting users that someone joined
   * @param {string} type - Chat type
   */
  notifyWaitingUsers(type) {
    const queue = type === 'text' ? this.textQueue : this.videoQueue;
    const otherQueue = type === 'text' ? this.videoQueue : this.textQueue;
    
    // Notify all users in the queue that someone joined
    for (const [socketId, userInfo] of queue.entries()) {
      if (this.io) {
        this.io.to(socketId).emit('userJoined', {
          message: 'Someone joined! Looking for a match...',
          queueSize: queue.size
        });
      }
    }
    
    // Also notify users in other queue about cross-queue availability
    if (otherQueue.size > 0) {
      for (const [socketId, userInfo] of otherQueue.entries()) {
        if (this.io) {
          this.io.to(socketId).emit('usersInOtherQueue', {
            message: `There are ${queue.size} users in ${type} chat. Try switching!`,
            alternativeType: type,
            alternativeQueueSize: queue.size
          });
        }
      }
    }
    
    console.log(`📢 Notified ${queue.size} waiting users that someone joined ${type} queue`);
  }

  /**
   * Test the matching algorithm with comprehensive validation
   * @returns {Object} Test results
   */
  testMatchingAlgorithm() {
    const testResults = {
      timestamp: new Date().toISOString(),
      queueStatus: {
        textQueue: this.textQueue.size,
        videoQueue: this.videoQueue.size,
        totalUsers: this.textQueue.size + this.videoQueue.size
      },
      algorithmPerformance: {
        averageMatchTime: this.metrics.averageWaitTime,
        successRate: this.metrics.successfulPairings / (this.metrics.successfulPairings + this.metrics.failedPairings) * 100,
        totalPairings: this.metrics.totalPairings
      },
      userBehavior: {
        totalTrackedUsers: this.userBehavior.size,
        averageBehaviorScore: this.calculateAverageBehaviorScore(),
        newUsers: this.countNewUsers(),
        activeUsers: this.countActiveUsers()
      },
      recommendations: this.generateRecommendations()
    };

    console.log('🧪 Algorithm Test Results:', JSON.stringify(testResults, null, 2));
    return testResults;
  }

  /**
   * Calculate average behavior score
   * @returns {number} Average behavior score
   */
  calculateAverageBehaviorScore() {
    if (this.userBehavior.size === 0) return 0;
    
    let totalScore = 0;
    for (const behavior of this.userBehavior.values()) {
      totalScore += behavior.goodBehaviorScore;
    }
    
    return totalScore / this.userBehavior.size;
  }

  /**
   * Count new users (0 total chats)
   * @returns {number} Number of new users
   */
  countNewUsers() {
    let newUsers = 0;
    for (const behavior of this.userBehavior.values()) {
      if (behavior.totalChats === 0) {
        newUsers++;
      }
    }
    return newUsers;
  }

  /**
   * Count active users (seen in last 5 minutes)
   * @returns {number} Number of active users
   */
  countActiveUsers() {
    let activeUsers = 0;
    const fiveMinutesAgo = Date.now() - 300000;
    
    for (const behavior of this.userBehavior.values()) {
      if (behavior.lastSeen > fiveMinutesAgo) {
        activeUsers++;
      }
    }
    return activeUsers;
  }

  /**
   * Generate recommendations for algorithm optimization
   * @returns {Array} Array of recommendations
   */
  generateRecommendations() {
    const recommendations = [];
    
    // Check queue balance
    const textUsers = this.textQueue.size;
    const videoUsers = this.videoQueue.size;
    const totalUsers = textUsers + videoUsers;
    
    if (totalUsers > 0) {
      const textRatio = textUsers / totalUsers;
      const videoRatio = videoUsers / totalUsers;
      
      if (textRatio > 0.8) {
        recommendations.push({
          type: 'queue_balance',
          message: 'Text queue is overloaded. Consider promoting video chat.',
          priority: 'medium'
        });
      }
      
      if (videoRatio > 0.8) {
        recommendations.push({
          type: 'queue_balance',
          message: 'Video queue is overloaded. Consider promoting text chat.',
          priority: 'medium'
        });
      }
    }
    
    // Check behavior scores
    const avgBehavior = this.calculateAverageBehaviorScore();
    if (avgBehavior < 0.3) {
      recommendations.push({
        type: 'behavior',
        message: 'Low average behavior score. Consider implementing stricter matching.',
        priority: 'high'
      });
    }
    
    // Check success rate
    const successRate = this.metrics.successfulPairings / (this.metrics.successfulPairings + this.metrics.failedPairings) * 100;
    if (successRate < 70) {
      recommendations.push({
        type: 'performance',
        message: 'Low success rate. Algorithm may need optimization.',
        priority: 'high'
      });
    }
    
    return recommendations;
  }

  /**
   * Get detailed analytics
   * @returns {Object} Analytics data
   */
  getAnalytics() {
    return {
      ...this.getStatus(),
      averageWaitTime: this.metrics.averageWaitTime,
      successRate: this.metrics.successfulPairings / (this.metrics.successfulPairings + this.metrics.failedPairings) * 100,
      userBehavior: Object.fromEntries(this.userBehavior),
      testResults: this.testMatchingAlgorithm()
    };
  }
}

module.exports = UserMatcher;
