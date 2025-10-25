const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, country, idNumber, fullName, city, verifiedAt } = req.body;

  try {
    const client = await pool.connect();
    
    // Create table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS verified_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        country VARCHAR(100),
        id_number VARCHAR(255),
        full_name VARCHAR(255),
        city VARCHAR(100),
        verified_at TIMESTAMP,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const result = await client.query(
      `INSERT INTO verified_users 
       (email, country, id_number, full_name, city, verified_at, ip_address, user_agent) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING id`,
      [email, country, idNumber, fullName, city, verifiedAt, ip, userAgent]
    );
    
    await client.release();
    
    console.log('✅ Verification data stored:', { 
      email: email.substring(0, 3) + '***', 
      country,
      city 
    });
    
    res.status(200).json({ 
      success: true, 
      message: 'Verification data stored successfully',
      id: result.rows[0].id 
    });
    
  } catch (error) {
    console.error('❌ Verification storage error:', error);
    res.status(500).json({ 
      error: 'Failed to store verification data',
      details: error.message 
    });
  }
}
