const express = require('express');
const authMiddleware = require('../middlewares/auth');
const { 
    getUserSeries, 
    getAllSeries, 
    addToUserCatalog,
    removeFromUserCatalog,
    checkInCatalog,
    getById, 
    create, 
    delete: deleteSerie 
} = require('../controllers/serieController');

const router = express.Router();

router.use(authMiddleware);

// Catálogo do usuário
router.get('/', getUserSeries);
router.get('/all', getAllSeries);
router.post('/add/:serieId', addToUserCatalog);
router.delete('/remove/:serieId', removeFromUserCatalog);
router.get('/check/:serieId', checkInCatalog);

router.get('/:id', getById);
router.post('/', create);
router.delete('/:id', deleteSerie);

module.exports = router;