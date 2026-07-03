const pool = require('../config/database');

exports.save = async (req, res) => {
    try {
        const { serieId, episodioAtual, status, nota, comentario } = req.body;
        const usuarioId = req.userId;
        
        console.log('📝 Salvando progresso do usuário:', usuarioId);
        console.log('📝 Série:', serieId);

        // Verificar se o usuário existe
        const userCheck = await pool.query('SELECT id FROM usuarios WHERE id = $1', [usuarioId]);
        if (userCheck.rows.length === 0) {
            console.log('❌ Usuário não encontrado:', usuarioId);
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Verificar se a série existe
        const serieCheck = await pool.query('SELECT id FROM series WHERE id = $1', [serieId]);
        if (serieCheck.rows.length === 0) {
            console.log('❌ Série não encontrada:', serieId);
            return res.status(404).json({ error: 'Série não encontrada' });
        }

        const result = await pool.query(
            `INSERT INTO progresso (usuario_id, serie_id, episodio_atual, status, nota, comentario)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (usuario_id, serie_id) 
             DO UPDATE SET 
                episodio_atual = EXCLUDED.episodio_atual,
                status = EXCLUDED.status,
                nota = EXCLUDED.nota,
                comentario = EXCLUDED.comentario,
                updated_at = CURRENT_TIMESTAMP
             RETURNING *`,
            [usuarioId, serieId, episodioAtual || 0, status || 'quero_assistir', nota || null, comentario || null]
        );
        
        console.log('✅ Progresso salvo para usuário:', usuarioId);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('❌ Erro ao salvar progresso:', error);
        res.status(500).json({ error: 'Erro ao salvar progresso: ' + error.message });
    }
};

exports.getByUser = async (req, res) => {
    try {
        const usuarioId = req.userId;
        console.log('📊 Buscando progresso do usuário:', usuarioId);
        
        const result = await pool.query(
            `SELECT p.*, s.titulo, s.capa, s.temporadas 
             FROM progresso p 
             JOIN series s ON p.serie_id = s.id 
             WHERE p.usuario_id = $1 
             ORDER BY p.updated_at DESC`,
            [usuarioId]
        );
        
        console.log('📊 Encontrados:', result.rows.length);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar progresso:', error);
        res.status(500).json({ error: 'Erro ao buscar progresso' });
    }
};

exports.getBySerie = async (req, res) => {
    try {
        const { serieId } = req.params;
        const usuarioId = req.userId;
        console.log('📊 Buscando progresso do usuário:', usuarioId, 'para série:', serieId);
        
        const result = await pool.query(
            'SELECT * FROM progresso WHERE usuario_id = $1 AND serie_id = $2',
            [usuarioId, serieId]
        );
        console.log('📊 Resultado:', result.rows.length > 0 ? 'Encontrado' : 'Não encontrado');
        res.json(result.rows[0] || null);
    } catch (error) {
        console.error('Erro ao buscar progresso:', error);
        res.status(500).json({ error: 'Erro ao buscar progresso' });
    }
};