// src/components/Home.js
import React from 'react';
import './Home.css'; // Import the updated Home.css

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-card">
        <h1>Welcome to the Home Page!</h1>
        <p>Get started by signing up or logging in to your account.</p>
        <div className="home-buttons">
          <button className="button">Sign Up</button>
          <button className="button">Log In</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
