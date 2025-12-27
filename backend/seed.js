const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const connectDB = require('./src/config/db');

dotenv.config();

const seedUsers = async () => {
    await connectDB();

    // CREDENTIALS TO BE USED:
    // Admin: admin@sys.com / password123
    // Employee: emp@sys.com / password123

    const users = [
        {
            email: 'admin@sys.com',
            role: 'admin',
            supabase_uid: 'placeholder_uid_admin', // Will be updated on first login sync
        },
        {
            email: 'emp@sys.com',
            role: 'employee',
            supabase_uid: 'placeholder_uid_emp', // Will be updated on first login sync
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
        console.log('Use these credentials:');
        console.log('1. Admin: admin@sys.com / password123');
        console.log('2. Employee: emp@sys.com / password123');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedUsers();
