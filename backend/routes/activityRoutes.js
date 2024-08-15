
import express from 'express';
import Activity from '../models/activityModel';
import User from '../models/userModel';
import activityLogger from '../middlewares/activityLogger'; // Import the User model for user details

const router = express.Router();

// Endpoint to get activities with user details
router.get('/activities', async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate('userId', 'username email') // Populate user details
      .sort({ timestamp: -1 }); // Sort by most recent first
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities' });
  }
});

export default router;
