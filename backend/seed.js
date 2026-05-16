import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Admin from './models/Admin.js';
import Lead from './models/Lead.js';

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Admin.deleteMany();
        await Lead.deleteMany();

        const createdAdmins = await Admin.insertMany([
            {
                name: 'Admin User',
                email: 'admin@minicrm.com',
                password: 'password123',
            },
        ]);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    // destroy data logic if needed
} else {
    importData();
}
