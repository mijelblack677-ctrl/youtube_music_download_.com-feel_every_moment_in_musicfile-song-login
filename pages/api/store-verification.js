const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { country, idNumber, fullName, city, dateOfBirth, verifiedAt } = req.body;
    
    console.log('📨 Received verification data for:', fullName);

    if (!country || !idNumber || !fullName || !city || !dateOfBirth) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const client = await pool.connect();
    
    // Create table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS verified_users (
        id SERIAL PRIMARY KEY,
        country VARCHAR(100) NOT NULL,
        id_number VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        date_of_birth DATE,
        verified_at TIMESTAMP,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'];

    const result = await client.query(
      `INSERT INTO verified_users 
       (country, id_number, full_name, city, date_of_birth, verified_at, ip_address, user_agent) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING id`,
      [country, idNumber, fullName, city, dateOfBirth, verifiedAt || new Date().toISOString(), ip, userAgent]
    );
    
    await client.release();
    
    console.log('✅ Verification data stored. ID:', result.rows[0].id);
    
    res.status(200).json({ 
      success: true, 
      message: 'Verification data stored successfully',
      id: result.rows[0].id 
    });
    
  } catch (error) {
    console.error('❌ Verification storage error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to store verification data',
      details: error.message 
    });
  }
}
