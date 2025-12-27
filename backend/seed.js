const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const connectDB = require('./src/config/db');

dotenv.config();

const seedUsers = async () => {
    await connectDB();

    const users = [
        {
            email: 'admin@example.com',
            role: 'admin',
            supabase_uid: 'pending_admin_login',
        },
        {
            email: 'employee@example.com',
            role: 'employee',
            supabase_uid: 'pending_employee_login',
        }
    ];

    try {
        for (const u of users) {
            const exists = await User.findOne({ email: u.email });
            if (!exists) {
                await User.create(u);
                console.log(`Created: ${u.email} (${u.role})`);
            } else {
                console.log(`Exists: ${u.email}`);
            }
        }
        console.log('Seeding complete. Use these emails to Sign Up in Frontend.');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedUsers();
