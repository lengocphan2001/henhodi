import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import girlRoutes from './routes/girl.routes.js';
import userRoutes from './routes/user.routes.js';
import reviewRoutes from './routes/review.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import { initialize } from './db.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors());

// Apply JSON parsing only to routes that need it (not file uploads)
app.use('/api/users', express.json({ limit: '50mb' }));
app.use('/api/reviews', express.json({ limit: '50mb' }));

// For girls routes, let multer handle file uploads and only apply JSON to non-file routes
app.use('/api/girls', (req, res, next) => {
  // Skip JSON parsing for file upload routes
  if ((req.path.includes('/detail-images') && req.method === 'POST') || 
      (req.path.includes('/image') && req.method === 'POST')) {
    next();
  } else {
    express.json({ limit: '50mb' })(req, res, next);
  }
});

app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/girls', girlRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Henhodi API is running',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

// Initialize database and start server
const startServer = async () => {
  try {
    console.log('🚀 Starting Henhodi API Server...');
    
    // Initialize database (creates tables and default admin user)
    await initialize();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 API available at http://localhost:${PORT}/api`);
      console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
      console.log(`👤 Admin panel: http://localhost:3000/admin`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 