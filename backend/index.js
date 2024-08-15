// packages
import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session';

// Utilities
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configure session middleware with in-memory store
app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret-key', // Use session secret from environment or default
  resave: false, // Avoid resaving sessions if unmodified
  saveUninitialized: false, // Avoid creating sessions until something is stored
  cookie: {
    httpOnly: true, // Ensure cookies are not accessible via JavaScript
    secure: process.env.NODE_ENV === 'production', // Set to true in production (HTTPS only)
    maxAge: 30 * 24 * 60 * 60 * 1000 // Session cookie expires in 30 days
  }
}));

// Middleware to log session ID on every request
app.use((req, res, next) => {
  if (req.sessionID) {
    console.log('Session ID:', req.sessionID); // Log session ID to terminal
  }
  next();
});

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

// Debugging route to check session ID
app.get('/debug-session', (req, res) => {
  console.log('Session ID:', req.sessionID); // Log session ID to terminal
  res.send({ sessionID: req.sessionID });
});

// Start the server
app.listen(port, () => console.log(`Server running on port: ${port}`));
