const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all for MVP, restrict in production
    methods: ["GET", "POST"]
  }
});

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart-soother')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/babies', require('./routes/babies'));
app.use('/api/devices', require('./routes/devices'));
app.use('/api/readings', require('./routes/readings'));

app.get('/', (req, res) => {
  res.send('SmartSoother API Running');
});

// Socket Connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start IoT Simulation
const startSimulation = require('./services/iotService');
startSimulation(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
