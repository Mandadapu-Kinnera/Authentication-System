-- Auth System Database Setup
-- Run these commands in your MySQL command line interface

-- Create database
CREATE DATABASE IF NOT EXISTS auth_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE auth_system;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  isVerified BOOLEAN NOT NULL DEFAULT FALSE,
  resetToken VARCHAR(255) NULL,
  resetTokenExpiry DATETIME NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes for performance
  INDEX idx_email (email),
  INDEX idx_reset_token (resetToken),
  INDEX idx_role (role),
  INDEX idx_created_at (createdAt)
);

-- Create an admin user (password: Admin123!)
-- The password hash is for 'Admin123!' - you should change this
INSERT INTO users (name, email, password, role, isVerified) VALUES 
('Admin User', 'admin@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5aRj4qZQei', 'admin', TRUE)
ON DUPLICATE KEY UPDATE role = 'admin';

-- Create a regular user (password: User123!)
-- The password hash is for 'User123!' - you should change this
INSERT INTO users (name, email, password, role, isVerified) VALUES 
('Test User', 'user@example.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', TRUE)
ON DUPLICATE KEY UPDATE id = id;

-- Verify the table structure
DESCRIBE users;

-- Show created users
SELECT id, name, email, role, isVerified, createdAt FROM users;

-- Optional: Create indexes for better performance (already included above)
-- CREATE INDEX idx_users_email ON users(email);
-- CREATE INDEX idx_users_reset_token ON users(resetToken);
-- CREATE INDEX idx_users_role ON users(role);

SHOW TABLES;
SHOW INDEXES FROM users;