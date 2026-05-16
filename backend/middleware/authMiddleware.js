import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch admin from MySQL (excluding password)
            const [rows] = await pool.execute(
                'SELECT id, name, email FROM admins WHERE id = ?',
                [decoded.id]
            );

            if (rows.length === 0) {
                return res.status(401).json({ message: 'Not authorized, admin not found' });
            }

            req.admin = rows[0];
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export { protect };
