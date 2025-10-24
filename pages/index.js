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
    </div>
  );
}
