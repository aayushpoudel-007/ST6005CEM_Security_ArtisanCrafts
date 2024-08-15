// middleware/activityLogger.js
import Activity from '../models/activityModel'; // Import the Activity model

const activityLogger = async (req, res, next) => {
  try {
    const { user } = req; // Assuming user is attached to req (e.g., from authentication middleware)
    
    if (user) { // Log only if user is authenticated
      const activity = new Activity({
        userId: user._id, // Reference to the authenticated user
        method: req.method,
        endpoint: req.originalUrl,
        timestamp: new Date(),
        data: req.body, // Optional: Log request body if needed
      });

      await activity.save();
    }
  } catch (error) {
    console.error('Error logging activity:', error);
  }
  next();
};

export default activityLogger;
