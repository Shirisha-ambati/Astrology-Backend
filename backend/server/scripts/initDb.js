import pool from '../db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDatabase() {
  console.log('🔧 Initializing database schema...');

  try {
    // Read and execute schema SQL
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    await pool.query(schema);
    console.log('✅ Database schema created successfully.');

    // Seed default admin user if not exists
    const existingAdmin = await pool.query(
      'SELECT id FROM admin_users WHERE username = $1',
      ['admin@vedaura.com']
    );

    if (existingAdmin.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      await pool.query(
        'INSERT INTO admin_users (username, password) VALUES ($1, $2)',
        ['admin@vedaura.com', hashedPassword]
      );
      console.log('✅ Default admin user created (admin@vedaura.com / admin123)');
    } else {
      console.log('ℹ️  Admin user already exists.');
    }

    console.log('🎉 Database initialization complete!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
  } finally {
    await pool.end();
  }
}

initDatabase();
