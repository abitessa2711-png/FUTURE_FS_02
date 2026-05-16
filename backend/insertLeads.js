import { pool } from './config/db.js';

const run = async () => {
    try {
        await pool.execute("INSERT INTO leads (fullName, email, phone, company, source, status, notes) VALUES ('Alice Johnson', 'alice@techcorp.com', '+1-555-0101', 'TechCorp', 'Website', 'new', 'Interested in our Enterprise plan. Follow up by end of week.'), ('Bob Smith', 'bob@startupx.io', '+1-555-0102', 'StartupX', 'LinkedIn', 'contacted', 'Had an initial call. Needs pricing details.'), ('Carol Williams', 'carol@designhub.co', '+1-555-0103', 'Design Hub', 'Referral', 'converted', 'Signed the 12-month contract. Onboarding in progress.')");
        console.log('Leads seeded successfully.');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

run();
