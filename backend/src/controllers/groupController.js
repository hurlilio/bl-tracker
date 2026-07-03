const pool = require('../config/database');
const crypto = require('crypto');

exports.create = async (req, res) => {
    try {
        const { nome, descricao } = req.body;
        
        let codigoConvite;
        let exists = true;
        while (exists) {
            codigoConvite = crypto.randomBytes(4).toString('hex').toUpperCase();
            const check = await pool.query('SELECT id FROM grupos WHERE codigo_convite = $1', [codigoConvite]);
            exists = check.rows.length > 0;
        }
        
        const result = await pool.query(
            'INSERT INTO grupos (nome, descricao, codigo_convite, admin_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [nome, descricao, codigoConvite, req.userId]
        );
        
        await pool.query(
            'INSERT INTO membros_grupo (grupo_id, usuario_id, role) VALUES ($1, $2, $3)',
            [result.rows[0].id, req.userId, 'admin']
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar grupo' });
    }
};

exports.join = async (req, res) => {
    try {
        const { codigo } = req.params;
        
        const group = await pool.query('SELECT id FROM grupos WHERE codigo_convite = $1', [codigo]);
        if (group.rows.length === 0) {
            return res.status(404).json({ error: 'Grupo não encontrado' });
        }
        
        await pool.query(
            'INSERT INTO membros_grupo (grupo_id, usuario_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [group.rows[0].id, req.userId]
        );
        
        res.json({ message: 'Entrou no grupo com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao entrar no grupo' });
    }
};

exports.getUserGroups = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT g.*, (SELECT COUNT(*) FROM membros_grupo WHERE grupo_id = g.id) as total_membros 
             FROM grupos g 
             JOIN membros_grupo mg ON g.id = mg.grupo_id 
             WHERE mg.usuario_id = $1 
             ORDER BY g.created_at DESC`,
            [req.userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar grupos' });
    }
};