const express = require('express');
const authMiddleware = require('../middlewares/auth');
const { save, getByUser, getBySerie } = require('../controllers/progressController');

const router = express.Router();

router.use(authMiddleware);
router.post('/', save);
router.get('/', getByUser);
router.get('/:serieId', getBySerie);

module.exports = router;