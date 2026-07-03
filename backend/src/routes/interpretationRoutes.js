const express = require('express');
const authMiddleware = require('../middlewares/auth');
const { create, getBySerie } = require('../controllers/interpretationController');

const router = express.Router();

router.use(authMiddleware);
router.post('/', create);
router.get('/serie/:serieId', getBySerie);

module.exports = router;