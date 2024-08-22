// Import packages
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import cors from 'cors';
import https from 'https'; // Import the HTTPS module
import fs from 'fs'; // Import the file system module

// Utilities
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

// Load environment variables
dotenv.config();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true // Allow cookies to be sent and received
};
app.use(cors(corsOptions));

// Middleware with in-memory store cookie management
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Set to true in production
    maxAge: 30 * 24 * 60 * 60 * 1000 // Session cookie expires in 30 days
  }
}));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);

// Paypal Config
app.get('/api/config/paypal', (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

// Serve static files
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Debugging and session info routes
app.get('/api/debug-session', (req, res) => {
  console.log('Session ID:', req.sessionID);
  res.send({ sessionID: req.sessionID });
});

app.get('/api/session-info', (req, res) => {
  if (req.session.user) {
    console.log('Session ID:', req.sessionID);
    console.log('Session Data:', req.session);

    res.status(200).json({
      sessionID: req.sessionID,
      sessionData: req.session
    });
  } else {
    res.status(401).json({ message: 'No session data found' });
  }
});

// SSL Certificates
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'server.key')), // Adjusted path
  cert: fs.readFileSync(path.join(__dirname, 'server')) // Adjusted path
};

// Start the HTTPS server
https.createServer(sslOptions, app).listen(port, () => {
  console.log(`HTTPS Server running on port: ${port}`);
});
