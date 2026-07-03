const express = require('express');
const authMiddleware = require('../middlewares/auth');
const tmdbController = require('../controllers/tmdbController');

const router = express.Router();

router.use(authMiddleware);
router.get('/search', tmdbController.searchSeries);
router.get('/popular', tmdbController.getPopular);
router.get('/trending', tmdbController.getTrending);
router.post('/import/:tmdbId', tmdbController.importSerie);
router.get('/details/:tmdbId', tmdbController.getSerieDetailsTMDB);

module.exports = router;
