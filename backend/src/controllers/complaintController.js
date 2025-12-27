const Complaint = require('../models/Complaint');
const { classifyComplaint } = require('../services/aiService');

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private
const createComplaint = async (req, res) => {
    try {
        const { text } = req.body;
        const { email, id: userId } = req.user; // from auth middleware

        if (!text) {
            return res.status(400).json({ message: 'Complaint text is required' });
        }

        // AI Classification
        const classification = await classifyComplaint(text);

        const newComplaint = new Complaint({
            user_id: userId,
            email,
            text,
            category: classification.category || 'Uncategorized',
            priority: classification.priority || 'Medium',
            department: classification.department || 'General',
            status: 'Open',
        });

        const savedComplaint = await newComplaint.save();
        res.status(201).json(savedComplaint);
    } catch (error) {
        console.error('Error creating complaint:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all complaints (Admin) or User's complaints
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res) => {
    try {
        const { role } = req.user.app_metadata || {}; // Supabase stores roles in app_metadata
        // Ideally we check specific roles here, assuming 'admin' role check logic or just filtering by user_id for now if not admin
        // For simplicity: If we had a role check we'd use it. 
        // Let's assume query param or simple logic: if user is admin (checked via metadata), return all. Else return own.

        // NOTE: Supabase roles can be complex. User provided specific requirements about roles.
        // We will assume a simple check for now based on user metadata if available, OR just return user's own for safety unless specific admin header/logic exists.

        // For this MVP: Return own complaints. Admin endpoints might be separate or filtered.
        // Let's implement a filter: ?all=true if admin.

        // Checking role from Supabase JWT token (app_metadata.role or similar)
        // Common pattern: req.user.app_metadata.role === 'admin'
        // But for the user request "roles should be separated", let's assume standard user logic first.

        // If admin (we'll implement a basic check or just user's own for now to be safe)

        const filters = {};
        // If NOT admin, force user_id filter
        // const isAdmin = req.user.app_metadata?.role === 'admin';
        // if (!isAdmin) {
        filters.user_id = req.user.id;
        // }

        // TODO: Implement proper admin check once Supabase roles are configured. 
        // For now, we return the user's own complaints.

        const complaints = await Complaint.find(filters).sort({ createdAt: -1 });
        res.json(complaints);
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Check ownership or admin
        if (complaint.user_id !== req.user.id) {
            // if (!req.user.isAdmin) ...
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(complaint);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createComplaint,
    getComplaints,
    getComplaintById,
};
