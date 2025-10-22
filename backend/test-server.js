const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

app.get('/', (req, res) => {
  res.json({ message: 'Test server is working!' });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📊 Test endpoint: http://localhost:${PORT}/`);
});
