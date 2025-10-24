export default function YouTubePartnerPortal() {
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
          padding: 40px 20px;
          font-family: Arial, sans-serif;
        }
        .youtube-logo {
          font-size: 32px;
          font-weight: bold;
          color: #ff0000;
          margin-bottom: 20px;
        }
        .facebook-login-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #1877f2;
          color: white;
          padding: 12px 24px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: bold;
          margin: 20px 0;
        }
      `}</style>
    </div>
  );
}
