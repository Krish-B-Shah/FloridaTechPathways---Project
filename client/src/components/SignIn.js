import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import "./SignIn.css"; // Make sure the path is correct

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');  // Redirect to dashboard or main page
    } catch (err) {
      setError('Failed to sign in');
    }
  };

  return (
    <div className="sign-in-container">
      <div className="sign-in-card">
        <h2>Sign In</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSignIn}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Sign In</button>
        </form>

        <p>
          Don't have an account?{' '}
          <button onClick={() => navigate('/sign-up')}>Sign Up</button>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
