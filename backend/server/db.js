import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: "./backend/.env" });
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Test the connection on startup
pool
  .query("SELECT NOW()")
  .then((res) => {
    console.log("✅ Connected to Neon PostgreSQL at", res.rows[0].now);
  })
  .catch((err) => {
    console.error("❌ Database Error:");
    console.error(err);
  });

export default pool;
