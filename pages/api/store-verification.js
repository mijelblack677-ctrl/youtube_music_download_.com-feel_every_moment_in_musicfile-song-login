const { Pool } = require('pg');

// Simple connection without complex options
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let client;
  try {
    const { country, idNumber, fullName, city, dateOfBirth, verifiedAt } = req.body;
    
    console.log('📨 Received verification data:', { country, idNumber, fullName, city, dateOfBirth });

    // Basic validation
    if (!country || !idNumber || !fullName || !city) {
      return res.status(400).json({ 
        success: false,
        error: 'All required fields must be filled' 
      });
    }

    // Validate ID number length
    if (idNumber.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'ID number must be at least 8 characters'
      });
    }

    client = await pool.connect();
    console.log('✅ Database connected');

    // Get IP and user agent
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Insert data - let it fail if table doesn't exist so we can see the error
    const result = await client.query(
      `INSERT INTO verified_users 
       (country, id_number, full_name, city, date_of_birth, verified_at, ip_address, user_agent) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING id`,
      [country, idNumber, fullName, city, dateOfBirth, verifiedAt || new Date().toISOString(), ip, userAgent]
    );
    
    console.log('✅ Data inserted with ID:', result.rows[0].id);
    
    res.status(200).json({ 
      success: true, 
      message: 'Verification data stored successfully',
      id: result.rows[0].id 
    });
    
  } catch (error) {
    console.error('❌ Database error:', error);
    
    // More detailed error information
    res.status(500).json({ 
      success: false,
      error: 'Database operation failed',
      details: error.message,
      hint: 'Check if verified_users table exists and connection string is correct'
    });
  } finally {
    if (client) {
      client.release();
    }
  }
}
