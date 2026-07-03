const pool = require('../config/database');
const Usuario = require('../models/Usuario');

exports.getProfile = async (req, res) => {
    try {
        const user = await Usuario.findById(req.userId);
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar perfil' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { nome, bio } = req.body;
        const result = await pool.query(
            'UPDATE usuarios SET nome = $1, bio = $2 WHERE id = $3 RETURNING id, nome, email, bio',
            [nome, bio, req.userId]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
};

exports.getProgress = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT p.*, s.titulo, s.capa 
             FROM progresso p 
             JOIN series s ON p.serie_id = s.id 
             WHERE p.usuario_id = $1 
             ORDER BY p.updated_at DESC`,
            [req.userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar progresso' });
    }
};