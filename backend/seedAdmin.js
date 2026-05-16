import { pool, connectDB } from './config/db.js';
import bcrypt from 'bcryptjs';

const seedAdmin = async () => {
    try {
        await connectDB();
        
        // Create table if not exists (just to be safe)
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS admins (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create leads table if not exists
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS leads (
                id INT AUTO_INCREMENT PRIMARY KEY,
                fullName VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                company VARCHAR(255) NOT NULL,
                source VARCHAR(255) NOT NULL,
                status ENUM('new', 'contacted', 'converted') NOT NULL DEFAULT 'new',
                notes TEXT,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        const email = 'admin@minicrm.com';
        const password = 'password123';

        // Check if admin already exists
        const [existing] = await pool.execute('SELECT * FROM admins WHERE email = ?', [email]);
        
        if (existing.length === 0) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await pool.execute(
                'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)',
                ['Admin User', email, hashedPassword]
            );
            console.log('✅ Admin user created successfully: admin@minicrm.com / password123');
        } else {
            console.log('ℹ️ Admin user already exists.');
            
            // Update password just in case it was wrong
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            await pool.execute('UPDATE admins SET password = ? WHERE email = ?', [hashedPassword, email]);
            console.log('✅ Admin password reset to: password123');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    }
};

seedAdmin();
