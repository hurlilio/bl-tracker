const express = require('express');
const authMiddleware = require('../middlewares/auth');
const { create, join, getUserGroups } = require('../controllers/groupController');

const router = express.Router();

router.use(authMiddleware);
router.post('/', create);
router.post('/join/:codigo', join);
router.get('/my-groups', getUserGroups);

module.exports = router;