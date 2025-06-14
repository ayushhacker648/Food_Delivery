const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import routes
const authRoutes = require('./routes/auth');
const restaurantRoutes = require('./routes/restaurants');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Database connection status
let dbConnected = false;

// MongoDB connection with improved error handling for WebContainer environment
const connectDB = async () => {
  try {
    // Check if we have a MongoDB URI configured
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.log('⚠️  No MONGODB_URI found in environment variables');
      console.log('📝 To connect to a database, add MONGODB_URI to your .env file');
      console.log('🔗 For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/database');
      console.log('🚀 Server will run without database connection for development');
      return;
    }
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    
    dbConnected = true;
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.log('❌ MongoDB connection failed:', error.message);
    console.log('');
    console.log('💡 To fix this issue:');
    console.log('   1. Set up MongoDB Atlas (free): https://www.mongodb.com/atlas');
    console.log('   2. Add your connection string to backend/.env as MONGODB_URI');
    console.log('   3. Or use a local MongoDB instance if available');
    console.log('');
    console.log('🚀 Server will continue running without database connection');
  }
};

// Connect to database
connectDB();

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  dbConnected = true;
  console.log('✅ MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  dbConnected = false;
  console.log('❌ MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  dbConnected = false;
  console.log('⚠️  MongoDB disconnected');
});

// Middleware to check database connection for API routes
const checkDbConnection = (req, res, next) => {
  if (!dbConnected) {
    return res.status(503).json({ 
      error: 'Database not available',
      message: 'Please configure MongoDB connection in .env file',
      details: 'Add MONGODB_URI to your environment variables'
    });
  }
  next();
};

// Routes with database connection check
app.use('/api/auth', checkDbConnection, authRoutes);
app.use('/api/restaurants', checkDbConnection, restaurantRoutes);
app.use('/api/menu', checkDbConnection, menuRoutes);
app.use('/api/orders', checkDbConnection, orderRoutes);

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    if (dbConnected) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
});

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Foodie API is running!',
    database: dbConnected ? 'Connected' : 'Not Connected',
    status: 'OK'
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    database: dbConnected ? 'Connected' : 'Not Connected',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Database setup instructions endpoint
app.get('/api/setup', (req, res) => {
  res.json({
    message: 'Database Setup Instructions',
    steps: [
      '1. Create a free MongoDB Atlas account at https://www.mongodb.com/atlas',
      '2. Create a new cluster and database',
      '3. Get your connection string from Atlas',
      '4. Add MONGODB_URI=your_connection_string to backend/.env file',
      '5. Restart the server'
    ],
    currentStatus: dbConnected ? 'Connected' : 'Not Connected'
  });
});

app.listen(PORT, () => {
  console.log('');
  console.log('🚀 Foodie API Server Started');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`📋 Setup guide: http://localhost:${PORT}/api/setup`);
  console.log('');
  
  if (!dbConnected) {
    console.log('⚠️  Database not connected - API routes will return 503 errors');
    console.log('💡 Visit /api/setup for database configuration instructions');
  }
  
  console.log('');
});