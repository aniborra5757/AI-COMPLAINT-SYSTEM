const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { classifyComplaint } = require('../services/aiService');
const generateTrackingCode = require('../utils/codeGenerator');
const sendEmail = require('../services/emailService');

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private
const createComplaint = async (req, res) => {
  try {
    const { text, orderId, category } = req.body;
    const { email, id: userId } = req.user;

    if (!text) {
      return res.status(400).json({ message: 'Complaint text is required' });
    }

    let classification = {};

    // If user chose "Other" or didn't specify category, use AI
    if (!category || category === 'Other') {
      classification = await classifyComplaint(text);
    } else {
      const aiResult = await classifyComplaint(text);
      classification = {
        ...aiResult,
        category: category
      };
    }

    const trackingCode = generateTrackingCode();

    const newComplaint = new Complaint({
      user_id: userId,
      email,
      text,
      orderId,
      trackingCode,
      category: classification.category || 'Uncategorized',
      priority: classification.priority || 'Medium',
      department: classification.department || 'General',
      status: 'Open',
    });

    const savedComplaint = await newComplaint.save();

    // Send Confirmation Email
    await sendEmail(
      email,
      `Complaint Received: #${trackingCode}`,
      `Your complaint has been received. You can track it using code: ${trackingCode}`
    );

    res.status(201).json(savedComplaint);
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get complaints based on Role
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res) => {
  try {
    const currentUser = await User.findOne({ supabase_uid: req.user.id });
    const userRole = currentUser ? currentUser.role : 'user';

    let filters = {};

    if (userRole === 'admin') {
      filters = {};
    } else if (userRole === 'employee') {
      filters = {};
    } else {
      filters.user_id = req.user.id;
    }

    const complaints = await Complaint.find(filters).sort({ createdAt: -1 });
    res.json({ complaints, role: userRole });
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
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    const currentUser = await User.findOne({ supabase_uid: req.user.id });
    const userRole = currentUser ? currentUser.role : 'user';

    if (userRole === 'user' && complaint.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(complaint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update complaint status (Admin/Employee)
// @route   PATCH /api/complaints/:id
// @access  Private
const updateComplaintStatus = async (req, res) => {
  try {
    const currentUser = await User.findOne({ supabase_uid: req.user.id });
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'employee')) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { status, resolutionNotes } = req.body;
    const updates = {
      status,
      resolutionNotes,
      resolvedBy: currentUser.email
    };

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    // --- EMAIL NOTIFICATION LOGIC (REAL) ---
    // --- EMAIL NOTIFICATION LOGIC (REAL) ---
    if (updatedComplaint) {
      if (status === 'Resolved') {
        await sendEmail(
          updatedComplaint.email,
          `Ticket Resolved: #${updatedComplaint.trackingCode}`,
          `Hello,\n\nGood news! Your complaint regarding "${updatedComplaint.category}" has been marked as RESOLVED.\n\nResolution Details:\n${resolutionNotes || 'No notes provided.'}\n\nThank you for your patience.`
        );
      } else if (status === 'In Progress') {
        await sendEmail(
          updatedComplaint.email,
          `Update: Ticket #${updatedComplaint.trackingCode} is In Progress`,
          `Hello,\n\nWe wanted to let you know that our team is currently working on your complaint regarding "${updatedComplaint.category}".\n\nWe will update you as soon as we have a resolution.\n\nThank you.`
        );
      }
    }

    res.json(updatedComplaint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus
};
