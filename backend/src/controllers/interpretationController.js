const pool = require('../config/database');

exports.create = async (req, res) => {
    try {
        const { serieId, titulo, conteudo, spoiler } = req.body;
        
        const result = await pool.query(
            'INSERT INTO interpretacoes (serie_id, usuario_id, titulo, conteudo, spoiler) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [serieId, req.userId, titulo, conteudo, spoiler || false]
        );
        
        const user = await pool.query('SELECT nome FROM usuarios WHERE id = $1', [req.userId]);
        result.rows[0].usuario_nome = user.rows[0].nome;
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar interpretação' });
    }
};

exports.getBySerie = async (req, res) => {
    try {
        const { serieId } = req.params;
        
        const result = await pool.query(
            `SELECT i.*, u.nome as usuario_nome 
             FROM interpretacoes i 
             JOIN usuarios u ON i.usuario_id = u.id 
             WHERE i.serie_id = $1 
             ORDER BY i.created_at DESC`,
            [serieId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar interpretações' });
    }
};