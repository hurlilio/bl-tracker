const express = require('express');
const authMiddleware = require('../middlewares/auth');
const { getProfile, updateProfile, getProgress } = require('../controllers/userController');

const router = express.Router();

router.use(authMiddleware);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/progress', getProgress);

module.exports = router;