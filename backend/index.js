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

connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true in production
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
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
app.get('/debug-session', (req, res) => {
  // Log and respond with session ID
  console.log('Session ID:', req.sessionID);
  res.send({ sessionID: req.sessionID });
});

app.get('/session-info', (req, res) => {
  if (req.session.user) {
    // Log and display session information
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

// Start the server
app.listen(port, () => console.log(`Server running on port: ${port}`));
