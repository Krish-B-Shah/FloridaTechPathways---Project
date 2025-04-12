import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // ✅ Include Link here
import './SignUp.css'; // Ensure the path is correct
const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook to navigate

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate sign-up logic here
    navigate('/home'); // Redirect to Home page after sign-up
  };

  return (
    <div className="sign-up-container">
      <div className="sign-up-card">
        <h2>Create an Account</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <div className="button-container">
            <button className="sign-up-button" type="submit">
              Sign Up
            </button>
          </div>
        </form>

        <div className="sign-in-link">
          <p>
            Already have an account? <Link to="/sign-in">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
