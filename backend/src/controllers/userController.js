const User = require('../models/User');

// @desc    Sync Supabase User with MongoDB
// @route   POST /api/users/sync
// @access  Private (Auth Token Required)
const syncUser = async (req, res) => {
    try {
        const { email, id } = req.user; // From Auth Middleware

        // Check if user exists by Email (to link with manually seeded accounts)
        let user = await User.findOne({ email });

        if (user) {
            // If user exists (seeded as admin/employee), ensure UID is linked
            if (user.supabase_uid !== id) {
                user.supabase_uid = id;
                await user.save();
            }
        } else {
            // New public user
            user = new User({
                email,
                supabase_uid: id,
                role: 'user',
            });
            await user.save();
        }

        res.json({ role: user.role });
    } catch (error) {
        console.error('Error syncing user:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { syncUser };
