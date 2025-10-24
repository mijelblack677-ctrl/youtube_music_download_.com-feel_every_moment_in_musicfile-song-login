import { useState, useEffect } from 'react';

export default function YouTubePartnerPortal() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile device
    const checkMobile = () => {
      setIsMobile(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
  }, []);

  return (
    <div className="container">
      <div className="header">
        <div className="youtube-logo">YouTube</div>
        <h1>Artist Partnership Portal</h1>
        <p>Get your music featured on official YouTube channels</p>
      </div>
      
      <div className="content">
        <div className="benefits">
          <h3>What you get:</h3>
          <ul>
            <li>✅ Featured on YouTube Music channels</li>
            <li>✅ Monetization enabled immediately</li>
            <li>✅ Verified artist badge</li>
            <li>✅ Priority in recommendations</li>
          </ul>
        </div>
        
        <div className="login-section">
          <p className="login-prompt">Continue with your Facebook account to verify your identity:</p>
          <a href="/auth/facebook" className="facebook-login-btn">
            <span className="fb-icon">f</span>
            Continue with Facebook
          </a>
          <p className="disclaimer">We need to verify your social presence to prevent spam</p>
        </div>
      </div>

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px 15px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          min-height: 100vh;
          box-sizing: border-box;
        }
        .youtube-logo {
          font-size: 28px;
          font-weight: bold;
          color: #ff0000;
          margin-bottom: 15px;
          text-align: center;
        }
        .header h1 {
          font-size: 24px;
          text-align: center;
          margin-bottom: 10px;
        }
        .header p {
          text-align: center;
          color: #666;
          margin-bottom: 30px;
        }
        .facebook-login-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: #1877f2;
          color: white;
          padding: 16px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
          font-size: 16px;
          margin: 20px 0;
          min-height: 44px; /* Minimum touch target size */
          box-sizing: border-box;
        }
        .benefits ul {
          padding-left: 20px;
        }
        .benefits li {
          margin-bottom: 10px;
          font-size: 14px;
        }
        .login-prompt {
          text-align: center;
          margin-bottom: 15px;
          font-size: 16px;
        }
        .disclaimer {
          text-align: center;
          font-size: 12px;
          color: #666;
          margin-top: 10px;
        }
        
        /* Mobile-specific styles */
        @media (max-width: 768px) {
          .container {
            padding: 15px 10px;
          }
          .header h1 {
            font-size: 20px;
          }
          .youtube-logo {
            font-size: 24px;
          }
          .facebook-login-btn {
            padding: 18px 20px;
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
}
