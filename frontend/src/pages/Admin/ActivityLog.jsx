// components/ActivityLog.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get('/api/activities'); // Fetch from your endpoint
        setActivities(response.data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div>
      <h2>Activity Log</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Method</th>
            <th>Endpoint</th>
            <th>Timestamp</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {activities.map(activity => (
            <tr key={activity._id}>
              <td>{activity.userId ? activity.userId.username : 'Unknown'}</td>
              <td>{activity.userId ? activity.userId.email : 'Unknown'}</td>
              <td>{activity.method}</td>
              <td>{activity.endpoint}</td>
              <td>{new Date(activity.timestamp).toLocaleString()}</td>
              <td>{JSON.stringify(activity.data)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityLog;
