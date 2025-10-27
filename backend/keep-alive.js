#!/usr/bin/env node

/**
 * Aggressive keep-alive script for Render.com
 * This script frequently pings the server to prevent cold starts
 */

const https = require('https');
const http = require('http');

const BACKEND_URL = process.env.BACKEND_URL || 'https://maskchat-pbo3.onrender.com';
const INTERVAL = 2 * 60 * 1000; // 2 minutes (more frequent)

console.log('🔄 Starting AGGRESSIVE keep-alive script for:', BACKEND_URL);
console.log('⏰ Interval:', INTERVAL / 1000, 'seconds');

function pingServer() {
  const url = new URL(BACKEND_URL);
  const client = url.protocol === 'https:' ? https : http;
  
  const options = {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: '/keep-alive',
    method: 'GET',
    timeout: 5000 // Faster timeout
  };

  const req = client.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log(`✅ Keep-alive successful: ${response.status} - ${response.message}`);
      } catch (error) {
        console.log('✅ Keep-alive successful (non-JSON response)');
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Keep-alive failed:', error.message);
  });

  req.on('timeout', () => {
    console.error('❌ Keep-alive timeout');
    req.destroy();
  });

  req.end();
}

// Ping immediately and then every interval
pingServer();
setInterval(pingServer, INTERVAL);

console.log('🚀 AGGRESSIVE keep-alive script is running...');
