import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create a MySQL connection pool
// Pools manage multiple connections efficiently and are reused across requests
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true, // Wait if all connections are busy
    connectionLimit: 10,      // Max number of connections in pool
    queueLimit: 0,            // Unlimited queued connection requests
});

// Test the connection on startup
const connectDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log(`✅ MySQL Connected: ${process.env.DB_HOST}/${process.env.DB_NAME}`);
        connection.release(); // Always release back to the pool
    } catch (error) {
        console.error(`❌ MySQL Connection Failed: ${error.message}`);
        process.exit(1);
    }
};

export { pool, connectDB };
