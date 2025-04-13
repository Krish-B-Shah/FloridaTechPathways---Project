import { useState } from 'react';

// Enhanced SignUp component with working sign-in link and improvements
export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [currentView, setCurrentView] = useState('signup'); // 'signup' or 'signin'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        
        // Reset form after showing success message
        setTimeout(() => {
          setFormData({
            fullName: '',
            email: '',
            password: '',
            confirmPassword: ''
          });
          setSubmitSuccess(false);
        }, 3000);
      }, 1500);
    }
  };

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate sign in API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Sign in functionality would be implemented here!');
    }, 1000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const switchToSignIn = (e) => {
    e.preventDefault();
    setCurrentView('signin');
  };

  const switchToSignUp = (e) => {
    e.preventDefault();
    setCurrentView('signup');
  };

  return (
    <div className="sign-up-container">
      <div className={`sign-up-card ${submitSuccess ? 'success' : ''}`}>
        {currentView === 'signup' ? (
          <>
            <h2 className="sign-up-title">Create Account</h2>
            
            {submitSuccess ? (
              <div className="success-message">
                <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                  <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                  <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
                <p>Account created successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="fullName">Full Name</label>
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      id="fullName" 
                      name="fullName" 
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={errors.fullName ? 'error' : ''}
                    />
                    {formData.fullName && (
                      <span className="input-icon success">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </span>
                    )}
                  </div>
                  {errors.fullName && <p className="error-message">{errors.fullName}</p>}
                </div>
                
                <div className="input-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-wrapper">
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className={errors.email ? 'error' : ''}
                    />
                    {formData.email && !errors.email && (
                      <span className="input-icon success">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </span>
                    )}
                  </div>
                  {errors.email && <p className="error-message">{errors.email}</p>}
                </div>
                
                <div className="input-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-wrapper">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      id="password" 
                      name="password" 
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      className={errors.password ? 'error' : ''}
                    />
                    <button 
                      type="button" 
                      className="toggle-password"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="error-message">{errors.password}</p>}
                  
                  {formData.password && (
                    <div className="password-strength">
                      <div className="strength-meter">
                        <div 
                          className={`strength-bar ${
                            formData.password.length < 8 ? 'weak' : 
                            formData.password.length < 12 ? 'medium' : 'strong'
                          }`}
                          style={{ 
                            width: `${Math.min(100, (formData.password.length / 16) * 100)}%`
                          }}
                        ></div>
                      </div>
                      <span className="strength-text">
                        {formData.password.length < 8 ? 'Weak' : 
                        formData.password.length < 12 ? 'Medium' : 'Strong'}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="input-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="input-wrapper">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      id="confirmPassword" 
                      name="confirmPassword" 
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className={errors.confirmPassword ? 'error' : ''}
                    />
                    {formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && (
                      <span className="input-icon success">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </span>
                    )}
                  </div>
                  {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                </div>
                
                <div className="button-container">
                  <button 
                    type="submit" 
                    className="sign-up-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="spinner"></div>
                    ) : "Create Account"}
                  </button>
                  
                  <div className="divider">
                    <span>or</span>
                  </div>
                  
                  <button type="button" className="google-sign-in">
                    <svg viewBox="0 0 24 24">
                      <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                    </svg>
                    Sign up with Google
                  </button>
                </div>
                
                <div className="sign-in-link">
                  Already have an account? <a href="#" onClick={switchToSignIn}>Sign in</a>
                </div>
              </form>
            )}
          </>
        ) : (
          <>
            <h2 className="sign-up-title">Sign In</h2>
            <form onSubmit={handleSignInSubmit}>
              <div className="input-group">
                <label htmlFor="signInEmail">Email Address</label>
                <div className="input-wrapper">
                  <input 
                    type="email" 
                    id="signInEmail" 
                    name="signInEmail"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>
              
              <div className="input-group">
                <label htmlFor="signInPassword">Password</label>
                <div className="input-wrapper">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="signInPassword" 
                    name="signInPassword"
                    placeholder="Enter your password"
                  />
                  <button 
                    type="button" 
                    className="toggle-password"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="forgot-password">
                <a href="#">Forgot password?</a>
              </div>
              
              <div className="button-container">
                <button 
                  type="submit" 
                  className="sign-up-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="spinner"></div>
                  ) : "Sign In"}
                </button>
                
                <div className="divider">
                  <span>or</span>
                </div>
                
                <button type="button" className="google-sign-in">
                  <svg viewBox="0 0 24 24">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                  </svg>
                  Sign in with Google
                </button>
              </div>
              
              <div className="sign-in-link">
                Don't have an account? <a href="#" onClick={switchToSignUp}>Sign up</a>
              </div>
            </form>
          </>
        )}
      </div>
      
      <style jsx>{`
        /* Base styles and variables */
        :root {
          --primary-color: #4f46e5;
          --primary-dark: #4338ca;
          --primary-light: #e0e7ff;
          --success-color: #10b981;
          --error-color: #ef4444;
          --text-primary: #1f2937;
          --text-secondary: #6b7280;
          --background-light: #f9fafb;
          --card-bg: #ffffff;
          --border-color: #e5e7eb;
          --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
          --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          --animation-speed: 0.3s;
        }

        /* Background with soft gradient */
        .sign-up-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #f6f9fc, #edf2f7);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 20px;
        }

        /* Card styling with improved animations */
        .sign-up-card {
          width: 100%;
          max-width: 460px;
          background-color: var(--card-bg);
          border-radius: 16px;
          box-shadow: var(--shadow-lg);
          padding: 40px;
          position: relative;
          transition: transform var(--animation-speed), box-shadow var(--animation-speed);
          border: 1px solid var(--border-color);
          overflow: hidden;
        }

        .sign-up-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        /* Success state for the card */
        .sign-up-card.success {
          background-color: #f0fdf4;
          border-color: var(--success-color);
        }

        /* Decorative element - top bar with gradient animation */
        .sign-up-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: linear-gradient(90deg, var(--primary-color), #8b5cf6, #ec4899);
          background-size: 200% 200%;
          animation: gradientShift 3s ease infinite;
          border-radius: 16px 16px 0 0;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Header Styling */
        .sign-up-title {
          text-align: center;
          margin-bottom: 32px;
          color: var(--text-primary);
          font-weight: 700;
          font-size: 1.9rem;
          letter-spacing: 1px;
          position: relative;
          display: inline-block;
          width: 100%;
        }

        .sign-up-title::after {
          content: "";
          position: absolute;
          width: 60px;
          height: 4px;
          background: var(--primary-color);
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 2px;
        }

        /* Form layout */
        form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* Input styling with enhanced feedback */
        .input-group {
          margin-bottom: 5px;
        }

        .input-group label {
          color: var(--text-secondary);
          font-size: 0.875rem;
          margin-bottom: 8px;
          font-weight: 600;
          display: block;
        }

        .input-wrapper {
          position: relative;
        }

        .input-group input {
          width: 100%;
          padding: 14px 18px;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          font-size: 1rem;
          background-color: #fafafa;
          transition: all 0.3s ease;
          padding-right: 40px;
        }

        .input-group input:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
          outline: none;
          background-color: #fff;
        }

        .input-group input.error {
          border-color: var(--error-color);
          box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
        }

        .input-group input::placeholder {
          color: #9ca3af;
        }

        .error-message {
          color: var(--error-color);
          font-size: 0.75rem;
          margin-top: 6px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .error-message::before {
          content: "⚠️";
          font-size: 0.875rem;
        }

        /* Input icon */
        .input-icon {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .input-icon.success {
          color: var(--success-color);
        }

        /* Password visibility toggle */
        .toggle-password {
          background: none;
          border: none;
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: var(--text-secondary);
          display: flex;
          padding: 0;
          width: 20px;
          height: 20px;
        }

        .toggle-password:hover {
          color: var(--primary-color);
        }

        /* Password strength meter */
        .password-strength {
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .strength-meter {
          flex-grow: 1;
          height: 6px;
          background-color: #e5e7eb;
          border-radius: 3px;
          overflow: hidden;
        }

        .strength-bar {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s ease, background-color 0.3s ease;
        }

        .strength-bar.weak {
          background-color: var(--error-color);
        }

        .strength-bar.medium {
          background-color: #f59e0b;
        }

        .strength-bar.strong {
          background-color: var(--success-color);
        }

        .strength-text {
          font-size: 0.75rem;
          font-weight: 600;
          white-space: nowrap;
        }

        /* Button styling with loading state */
        .button-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 10px;
        }

        .sign-up-button {
          background-color: var(--primary-color);
          color: white;
          font-weight: 600;
          padding: 16px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .sign-up-button:hover {
          background-color: var(--primary-dark);
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        }

        .sign-up-button:active {
          transform: translateY(1px);
          box-shadow: none;
        }

        .sign-up-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .sign-up-button::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.6s ease, height 0.6s ease;
        }

        .sign-up-button:not(:disabled):hover::before {
          width: 300px;
          height: 300px;
        }

        /* Loading spinner */
        .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Divider between buttons */
        .divider {
          display: flex;
          align-items: center;
          margin: 5px 0;
          color: var(--text-secondary);
        }

        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background-color: var(--border-color);
        }

        .divider span {
          padding: 0 10px;
          font-size: 0.875rem;
          text-transform: uppercase;
          font-weight: 600;
        }

        /* Google sign-in button */
        .google-sign-in {
          background-color: white;
          color: var(--text-primary);
          font-weight: 600;
          padding: 14px;
          border: 1px solid var(--border-color);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: var(--shadow-sm);
        }

        .google-sign-in:hover {
          background-color: #f9fafb;
          box-shadow: var(--shadow-md);
        }

        .google-sign-in svg {
          width: 18px;
          height: 18px;
          fill: #4285F4;
        }

        /* Sign-in link */
        .sign-in-link {
          text-align: center;
          margin-top: 24px;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .sign-in-link a {
          color: var(--primary-color);
          text-decoration: none;
          font-weight: 600;
          position: relative;
          transition: all 0.3s ease;
        }

        .sign-in-link a::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -2px;
          left: 0;
          background-color: var(--primary-color);
          transition: width 0.3s ease;
        }

        .sign-in-link a:hover::after {
          width: 100%;
        }

        /* Success animation */
        .success-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          height: 300px;
        }

        .success-message p {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--success-color);
          margin-top: 20px;
        }

        .checkmark {
          width: 80px;
          height: 80px;
        }

        .checkmark-circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-width: 2;
          stroke-miterlimit: 10;
          stroke: var(--success-color);
          fill: none;
          animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }

        .checkmark-check {
          transform-origin: 50% 50%;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          stroke-width: 3;
          stroke: var(--success-color);
          animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
        }

        /* Forgot password link */
        .forgot-password {
          text-align: right;
          margin-top: 5px;
        }

        .forgot-password a {
          color: var(--primary-color);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .forgot-password a:hover {
          color: var(--primary-dark);
          text-decoration: underline;
        }

        @keyframes stroke {
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}