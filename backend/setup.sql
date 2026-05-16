-- ============================================================
--  Mini CRM — MySQL Database Setup Script
--  Run this file in MySQL Workbench or via CLI:
--    mysql -u root -p < setup.sql
-- ============================================================

-- 1. Create the database
CREATE DATABASE IF NOT EXISTS mini_crm;
USE mini_crm;

-- ============================================================
-- 2. Create admins table
-- ============================================================
CREATE TABLE IF NOT EXISTS admins (
    id       INT AUTO_INCREMENT PRIMARY KEY,
    name     VARCHAR(255) NOT NULL,
    email    VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. Create leads table
-- ============================================================
CREATE TABLE IF NOT EXISTS leads (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    fullName  VARCHAR(255) NOT NULL,
    email     VARCHAR(255) NOT NULL,
    phone     VARCHAR(20)  NOT NULL,
    company   VARCHAR(255) NOT NULL,
    source    VARCHAR(255) NOT NULL,
    status    ENUM('new', 'contacted', 'converted') NOT NULL DEFAULT 'new',
    notes     TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- 4. Insert sample admin
--    Password below is bcrypt hash of: password123
--    Generate a fresh one with: node -e "const b=require('bcryptjs'); b.hash('password123',10).then(console.log)"
-- ============================================================
INSERT INTO admins (name, email, password) VALUES
(
    'Admin User',
    'admin@minicrm.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
);

-- ============================================================
-- 5. Insert sample leads (dummy data)
-- ============================================================
INSERT INTO leads (fullName, email, phone, company, source, status, notes) VALUES
('Alice Johnson',   'alice@techcorp.com',   '+1-555-0101', 'TechCorp',      'Website',   'new',       'Interested in our Enterprise plan. Follow up by end of week.'),
('Bob Smith',       'bob@startupx.io',      '+1-555-0102', 'StartupX',      'LinkedIn',  'contacted', 'Had an initial call. Needs pricing details.'),
('Carol Williams',  'carol@designhub.co',   '+1-555-0103', 'Design Hub',    'Referral',  'converted', 'Signed the 12-month contract. Onboarding in progress.'),
('David Lee',       'david@cloudsys.net',   '+1-555-0104', 'CloudSys',      'Cold Call', 'new',       NULL),
('Eva Martinez',    'eva@mediaflow.com',     '+1-555-0105', 'MediaFlow',     'Website',   'contacted', 'Demo scheduled for next Monday.'),
('Frank Brown',     'frank@finedge.org',    '+1-555-0106', 'FinEdge',       'LinkedIn',  'converted', 'Upgraded to Pro plan after trial.'),
('Grace Kim',       'grace@healthplus.io',  '+1-555-0107', 'HealthPlus',    'Referral',  'new',       'Referred by Carol. Very warm lead.'),
('Henry Davis',     'henry@buildright.com', '+1-555-0108', 'BuildRight',    'Website',   'contacted', 'Requested a custom quote.');

-- ============================================================
-- 6. Verify the data
-- ============================================================
SELECT 'Admins' AS TableName, COUNT(*) AS Rows FROM admins
UNION ALL
SELECT 'Leads',               COUNT(*)         FROM leads;
