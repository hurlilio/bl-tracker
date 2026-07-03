const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'bltracker_secret_2024';

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        console.error('Erro ao verificar token:', error.message);
        return null;
    }
};

module.exports = { generateToken, verifyToken };