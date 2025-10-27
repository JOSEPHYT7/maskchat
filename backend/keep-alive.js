#!/usr/bin/env node

/**
 * Keep-alive script for Render.com
 * This script periodically pings the server to prevent cold starts
 */

const https = require('https');
const http = require('http');

const BACKEND_URL = process.env.BACKEND_URL || 'https://maskchat-pbo3.onrender.com';
const INTERVAL = 5 * 60 * 1000; // 5 minutes

console.log('🔄 Starting keep-alive script for:', BACKEND_URL);
console.log('⏰ Interval:', INTERVAL / 1000, 'seconds');

function pingServer() {
  const url = new URL(BACKEND_URL);
  const client = url.protocol === 'https:' ? https : http;
  
  const options = {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: '/keep-alive',
    method: 'GET',
    timeout: 10000
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

// Ping immediately
pingServer();

// Then ping every interval
setInterval(pingServer, INTERVAL);

console.log('🚀 Keep-alive script is running...');
