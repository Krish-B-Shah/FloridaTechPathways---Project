// src/components/Dashboard.js

import React from 'react';
import './Dashboard.css'; // Import the updated Dashboard.css

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1>Welcome to the Dashboard!</h1>
        <p>Here, you can manage your account and settings.</p>
        <div className="dashboard-buttons">
          <button className="button">View Profile</button>
          <button className="button">Settings</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
