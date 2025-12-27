const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { syncUser } = require('../controllers/userController');

router.use(authMiddleware);
router.post('/sync', syncUser);

module.exports = router;
