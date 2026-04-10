import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================

// CORS Configuration - Frontend se requests accept karne ke liye
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173', // Vite default port
  credentials: true, // Cookies/Auth headers allow karne ke liye
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// JSON Body Parser
app.use(express.json());

// URL Encoded Data Parser (for form submissions)
app.use(express.urlencoded({ extended: true }));

// ==================== ROUTES ====================

// Auth Routes (Login, Register, Setup-Admin)
app.use('/api/auth', authRoutes);

// User Management Routes (Admin: Create/Read/Delete Users)
app.use('/api/users', userRoutes);

// ==================== HEALTH CHECK ROUTE ====================
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'School Management System API is running',
    timestamp: new Date().toISOString()
  });
});

// ==================== ERROR HANDLING MIDDLEWARE ====================

// 404 - Route Not Found
app.use((req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  console.error('❌ Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    path: req.path,
    method: req.method
  });

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// ==================== SERVER START ====================
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════╗
║  🎓 School Management System API   ║
╠════════════════════════════════════╣
║  🚀 Server running on port ${PORT}
║  🔗 http://localhost:${PORT}
║  🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}
║  📦 Environment: ${process.env.NODE_ENV || 'development'}
╚════════════════════════════════════╝
  `);
});

// Graceful Shutdown (Optional but recommended for production)
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  // Agar aapke paas database connection close karne ka method hai toh yahan call karein
  // await mongoose.connection.close();
  process.exit(0);
});