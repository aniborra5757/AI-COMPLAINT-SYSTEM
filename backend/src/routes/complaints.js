const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { createComplaint, getComplaints, getComplaintById } = require('../controllers/complaintController');

router.use(authMiddleware);

router.post('/', createComplaint);
router.get('/', getComplaints);
router.get('/:id', getComplaintById);
router.patch('/:id', require('../controllers/complaintController').updateComplaintStatus);

module.exports = router;
