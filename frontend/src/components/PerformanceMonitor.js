import React, { useState, useEffect } from 'react';

const PerformanceMonitor = ({ isVisible, onClose }) => {
  const [analytics, setAnalytics] = useState(null);
  const [performance, setPerformance] = useState(null);

  useEffect(() => {
    if (!isVisible) return;

    const fetchAnalytics = async () => {
      try {
        const [analyticsRes, performanceRes] = await Promise.all([
          fetch('http://localhost:5000/analytics'),
          fetch('http://localhost:5000/performance')
        ]);
        
        const analyticsData = await analyticsRes.json();
        const performanceData = await performanceRes.json();
        
        setAnalytics(analyticsData);
        setPerformance(performanceData);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: '350px',
      background: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '20px',
      borderRadius: '15px',
      zIndex: 1000,
      fontFamily: 'monospace',
      fontSize: '12px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, color: '#00ff88' }}>⚡ Performance Monitor</h3>
        <button 
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '18px',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
      </div>

      {analytics && (
        <div>
          <div style={{ marginBottom: '10px' }}>
            <strong style={{ color: '#00ff88' }}>📊 Live Stats:</strong>
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <span style={{ color: '#ffaa00' }}>👥 Online Users:</span> {analytics.totalUsers}
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <span style={{ color: '#00aaff' }}>💬 Text Queue:</span> {analytics.textQueue}
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <span style={{ color: '#ff6600' }}>📹 Video Queue:</span> {analytics.videoQueue}
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <span style={{ color: '#00ff88' }}>🏠 Active Rooms:</span> {analytics.activeRooms}
          </div>
        </div>
      )}

      {performance && (
        <div style={{ marginTop: '15px', borderTop: '1px solid #333', paddingTop: '10px' }}>
          <div style={{ marginBottom: '10px' }}>
            <strong style={{ color: '#00ff88' }}>⚡ Performance:</strong>
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <span style={{ color: '#00ff88' }}>🚀 Instant Pairing Rate:</span> {performance.instantPairingRate.toFixed(1)}%
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <span style={{ color: '#ffaa00' }}>⏱️ Avg Wait Time:</span> {performance.averageWaitTime.toFixed(0)}ms
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <span style={{ color: '#00aaff' }}>✅ Success Rate:</span> {performance.successRate.toFixed(1)}%
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <span style={{ color: '#ff6600' }}>🔗 Total Pairings:</span> {performance.totalPairings}
          </div>
        </div>
      )}

      <div style={{ 
        marginTop: '15px', 
        padding: '10px', 
        background: 'rgba(0, 255, 136, 0.1)', 
        borderRadius: '8px',
        border: '1px solid #00ff88'
      }}>
        <div style={{ fontSize: '10px', color: '#00ff88', marginBottom: '5px' }}>
          🎯 Advanced Features:
        </div>
        <div style={{ fontSize: '9px', lineHeight: '1.4' }}>
          • Intelligent matching algorithm<br/>
          • Behavior-based priority<br/>
          • Load balancing<br/>
          • Instant pairing<br/>
          • Real-time analytics
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;
