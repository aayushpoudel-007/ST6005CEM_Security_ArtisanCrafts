import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
  method: { type: String, required: true },
  endpoint: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  data: { type: mongoose.Schema.Types.Mixed }, // Optional: Store any additional data
});

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
