const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        default: 'Uncategorized',
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium',
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
        default: 'Open',
    },
    department: {
        type: String,
        default: 'General',
    },
    orderId: {
        type: String,
    },
    trackingCode: {
        type: String,
        required: true,
        unique: true,
    },
    resolutionNotes: {
        type: String,
    },
    resolvedBy: {
        type: String, // Email or Name of employee
    },
    metadata: {
        type: Map,
        of: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
