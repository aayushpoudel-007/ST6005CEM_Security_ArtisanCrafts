import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Ensure axios is configured to include credentials
axios.defaults.withCredentials = true;

const SessionTable = () => {
  const [sessionID, setSessionID] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessionInfo = async () => {
      try {
        // Fetch session info from the backend
        const response = await axios.get('http://localhost:5000/api/debug-session');
        setSessionID(response.data.sessionID); // Adjust based on response structure
      } catch (err) {
        // Convert error object to a string
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionInfo();
  }, []);

  // Inline CSS styles
  const containerStyle = {
    margin: '20px',
    fontFamily: 'Arial, sans-serif'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px'
  };

  const thStyle = {
    backgroundColor: '#f4f4f4',
    color: '#333',
    padding: '10px',
    borderBottom: '2px solid #ddd',
    textAlign: 'left' // Align text to the left
  };

  const tdStyle = {
    padding: '10px',
    borderBottom: '1px solid #ddd',
    textAlign: 'left' // Align text to the left
  };

  const headerStyle = {
    fontSize: '24px',
    marginBottom: '10px'
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Session Information</h2>
      {sessionID ? (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Session ID</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>{sessionID}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>No session data available.</p>
      )}
    </div>
  );
};

export default SessionTable;
