const { verifyToken } = require('../config/auth');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ error: 'Token inválido' });
    }

    req.userId = decoded.id;
    next();
};

module.exports = authMiddleware;