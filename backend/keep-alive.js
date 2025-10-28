#!/usr/bin/env node

/**
 * Aggressive keep-alive script for Render.com
 * This script frequently pings the server to prevent cold starts
 */

const https = require('https');
const http = require('http');

const BACKEND_URL = process.env.BACKEND_URL || 'https://maskchat-pbo3.onrender.com';
const INTERVAL = 30 * 1000; // 30 seconds (very aggressive for free tier)

console.log('🔄 Starting ULTRA-AGGRESSIVE keep-alive script for FREE TIER:', BACKEND_URL);
console.log('⏰ Interval:', INTERVAL / 1000, 'seconds (prevents free tier sleep)');

function pingServer(endpoint = '/keep-alive') {
  const url = new URL(BACKEND_URL);
  const client = url.protocol === 'https:' ? https : http;
  
  const options = {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: endpoint,
    method: 'GET',
    timeout: 10000 // Increased timeout for cold starts
  };

  const req = client.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        const coldStart = response.coldStart ? ' (COLD START)' : '';
        console.log(`✅ ${endpoint} successful: ${response.status} - ${response.message}${coldStart}`);
        if (response.coldStart) {
          console.log('🔥 Server was cold, warming up...');
          // Try to warm up the server (may not exist on older deployments)
          setTimeout(() => pingServer('/warmup'), 2000);
        }
      } catch (error) {
        console.log(`✅ ${endpoint} successful (non-JSON response)`);
      }
    });
  });

  req.on('error', (error) => {
    console.error(`❌ ${endpoint} failed:`, error.message);
  });

  req.on('timeout', () => {
    console.error(`❌ ${endpoint} timeout`);
    req.destroy();
  });

  req.end();
}

// Ping immediately and then every interval
pingServer();
setInterval(pingServer, INTERVAL);

console.log('🚀 AGGRESSIVE keep-alive script is running...');
