const pool = require('../config/database');

// Buscar séries do usuário
exports.getUserSeries = async (req, res) => {
    try {
        const usuarioId = req.userId;
        console.log('📚 Buscando séries do usuário:', usuarioId);
        
        const result = await pool.query(
            `SELECT s.*, us.added_at 
             FROM series s
             JOIN usuario_series us ON s.id = us.serie_id
             WHERE us.usuario_id = $1
             ORDER BY us.added_at DESC`,
            [usuarioId]
        );
        
        console.log('📚 Séries encontradas:', result.rows.length);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar séries do usuário:', error);
        res.status(500).json({ error: 'Erro ao buscar séries' });
    }
};

// Buscar todas as séries (para adicionar)
exports.getAllSeries = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM series ORDER BY titulo');
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar séries:', error);
        res.status(500).json({ error: 'Erro ao buscar séries' });
    }
};

// Adicionar série ao catálogo do usuário
exports.addToUserCatalog = async (req, res) => {
    try {
        const { serieId } = req.params;
        const usuarioId = req.userId;
        
        // Verificar se já existe
        const check = await pool.query(
            'SELECT id FROM usuario_series WHERE usuario_id = $1 AND serie_id = $2',
            [usuarioId, serieId]
        );
        
        if (check.rows.length > 0) {
            return res.status(409).json({ error: 'Série já está no seu catálogo' });
        }
        
        // Verificar se a série existe
        const serieCheck = await pool.query('SELECT id FROM series WHERE id = $1', [serieId]);
        if (serieCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Série não encontrada' });
        }
        
        await pool.query(
            'INSERT INTO usuario_series (usuario_id, serie_id) VALUES ($1, $2)',
            [usuarioId, serieId]
        );
        
        res.json({ message: 'Série adicionada ao seu catálogo' });
    } catch (error) {
        console.error('Erro ao adicionar série:', error);
        res.status(500).json({ error: 'Erro ao adicionar série' });
    }
};

// Remover série do catálogo do usuário
exports.removeFromUserCatalog = async (req, res) => {
    try {
        const { serieId } = req.params;
        const usuarioId = req.userId;
        
        await pool.query(
            'DELETE FROM usuario_series WHERE usuario_id = $1 AND serie_id = $2',
            [usuarioId, serieId]
        );
        
        res.json({ message: 'Série removida do seu catálogo' });
    } catch (error) {
        console.error('Erro ao remover série:', error);
        res.status(500).json({ error: 'Erro ao remover série' });
    }
};

// Verificar se série está no catálogo do usuário
exports.checkInCatalog = async (req, res) => {
    try {
        const { serieId } = req.params;
        const usuarioId = req.userId;
        
        const result = await pool.query(
            'SELECT id FROM usuario_series WHERE usuario_id = $1 AND serie_id = $2',
            [usuarioId, serieId]
        );
        
        res.json({ inCatalog: result.rows.length > 0 });
    } catch (error) {
        console.error('Erro ao verificar catálogo:', error);
        res.status(500).json({ error: 'Erro ao verificar catálogo' });
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM series WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Série não encontrada' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao buscar série:', error);
        res.status(500).json({ error: 'Erro ao buscar série' });
    }
};

exports.create = async (req, res) => {
    try {
        const { titulo, sinopse, pais, ano, temporadas, capa, genero } = req.body;
        
        const result = await pool.query(
            'INSERT INTO series (titulo, sinopse, pais, ano, temporadas, capa, genero) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [titulo, sinopse, pais, ano, temporadas, capa, genero]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao criar série:', error);
        res.status(500).json({ error: 'Erro ao criar série' });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        
        const check = await pool.query('SELECT id FROM series WHERE id = $1', [id]);
        if (check.rows.length === 0) {
            return res.status(404).json({ error: 'Série não encontrada' });
        }
        
        await pool.query('DELETE FROM usuario_series WHERE serie_id = $1', [id]);
        await pool.query('DELETE FROM progresso WHERE serie_id = $1', [id]);
        await pool.query('DELETE FROM interpretacoes WHERE serie_id = $1', [id]);
        await pool.query('DELETE FROM series WHERE id = $1', [id]);
        
        res.json({ message: 'Série excluída com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir série:', error);
        res.status(500).json({ error: 'Erro ao excluir série' });
    }
};