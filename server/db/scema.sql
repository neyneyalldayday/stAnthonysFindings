DROP DATABASE IF EXISTS st_anthony;

CREATE DATABASE st_anthony;



CREATE TABLE donations (
  id SERIAL PRIMARY KEY,
  amount INTEGER NOT NULL,
  donor_name VARCHAR(100),
  email VARCHAR(100),
  project VARCHAR(100),
  stripe_payment_intent_id VARCHAR(100) UNIQUE,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_donations_email ON donations(email);
CREATE INDEX idx_donations_project ON donations(project);