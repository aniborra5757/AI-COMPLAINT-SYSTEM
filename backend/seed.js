const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const connectDB = require('./src/config/db');

dotenv.config();

const seedUsers = async () => {
    await connectDB();

    // CREDENTIALS FOR TESTING:
    // 1. Admin: test_admin@demo.com
    // 2. Employee: test_employee@demo.com

    const users = [
        {
            email: 'test_admin@demo.com',
            role: 'admin',
            supabase_uid: 'pending_admin_test',
        },
        {
            email: 'test_employee@demo.com',
            role: 'employee',
            supabase_uid: 'pending_employee_test',
        },
        // Manual Request Credentials
        {
            email: 'admin@sys.com',
            role: 'admin',
            supabase_uid: 'pending_manual_admin',
        },
        {
            email: 'emp@sys.com',
            role: 'employee',
            supabase_uid: 'pending_manual_emp',
        }
    ];

    try {
        for (const u of users) {
            // Upsert based on email
            await User.findOneAndUpdate(
                { email: u.email },
                u,
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            console.log(`Seeded Role for: ${u.email} -> ${u.role}`);
        }
        console.log('---');
        console.log('NOTE: You must now manually "Sign Up" these users in Supabase (or via the App Frontend TEMPORARILY) if they do not exist in Auth yet.');
        console.log('Use these credentials (OR create them now via Sign Up):');
        console.log('1. Admin: test_admin@demo.com');
        console.log('2. Employee: test_employee@demo.com');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedUsers();
