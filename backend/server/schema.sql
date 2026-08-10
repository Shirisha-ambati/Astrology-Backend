-- VedAura Database Schema for Neon PostgreSQL
-- Run this once to set up the database tables

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(255) UNIQUE NOT NULL,
  password      VARCHAR(255) NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default admin user (password will be hashed by the seed script)
-- Default: admin@vedaura.com / admin123

-- Auth sessions table
CREATE TABLE IF NOT EXISTS auth_sessions (
  id            SERIAL PRIMARY KEY,
  token_hash    VARCHAR(255) UNIQUE NOT NULL,
  user_type     VARCHAR(20) NOT NULL,
  role          VARCHAR(20),
  user_id       INTEGER NOT NULL,
  expires_at    TIMESTAMPTZ NOT NULL,
  revoked_at    TIMESTAMPTZ,
  last_used_at  TIMESTAMPTZ DEFAULT NOW(),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Pandit registrations table
CREATE TABLE IF NOT EXISTS pandit_registrations (
  id                  SERIAL PRIMARY KEY,
  full_name           VARCHAR(255) NOT NULL,
  gender              VARCHAR(20),
  dob                 DATE,
  profile_photo       VARCHAR(500),
  mobile              VARCHAR(20),
  email               VARCHAR(255),
  city                VARCHAR(100),
  state               VARCHAR(100),
  country             VARCHAR(100),
  address             TEXT,
  experience          VARCHAR(10),
  specialization      VARCHAR(100),
  languages           VARCHAR(255),
  bio                 TEXT,
  services            TEXT[],
  certifications      TEXT[],
  available_days      TEXT[],
  time_slots          VARCHAR(100),
  mode                VARCHAR(20),
  price               VARCHAR(20),
  free_consultation   VARCHAR(10),
  username            VARCHAR(100) UNIQUE,
  password_hash       VARCHAR(255),
  id_proof            VARCHAR(500),
  selfie              VARCHAR(500),
  upi_id              VARCHAR(100),
  bank_account        VARCHAR(100),
  ifsc_code           VARCHAR(20),
  status              VARCHAR(30) DEFAULT 'pending',
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Users table (for general site visitors / seekers)
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  phone         VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  full_name     VARCHAR(255),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Contact / inquiry submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(255),
  email         VARCHAR(255),
  phone         VARCHAR(20),
  message       TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Generated Kundli responses are retained for 30 days and linked to an anonymous secure cookie.
CREATE TABLE IF NOT EXISTS kundli_records (
  id          UUID PRIMARY KEY,
  kundli_data JSONB NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  expires_at  TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days'
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_pandit_email ON pandit_registrations(email);
CREATE INDEX IF NOT EXISTS idx_pandit_status ON pandit_registrations(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_token_hash ON auth_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_type ON auth_sessions(user_type);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_expires_at ON auth_sessions(expires_at);
