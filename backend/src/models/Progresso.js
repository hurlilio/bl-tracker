const pool = require('../config/database');

class Progresso {
    static async getByUser(usuarioId) {
        const result = await pool.query(\
            SELECT p.*, s.titulo, s.capa, s.temporadas
            FROM progresso p
            JOIN series s ON p.serie_id = s.id
            WHERE p.usuario_id = 
            ORDER BY p.updated_at DESC
        \, [usuarioId]);
        return result.rows;
    }

    static async getByUserAndSerie(usuarioId, serieId) {
        const result = await pool.query(
            'SELECT * FROM progresso WHERE usuario_id =  AND serie_id = ',
            [usuarioId, serieId]
        );
        return result.rows[0];
    }

    static async save(data) {
        const { usuarioId, serieId, episodioAtual, status, nota, comentario } = data;
        const result = await pool.query(\
            INSERT INTO progresso (usuario_id, serie_id, episodio_atual, status, nota, comentario)
            VALUES (, , , , , )
            ON CONFLICT (usuario_id, serie_id) 
            DO UPDATE SET 
                episodio_atual = EXCLUDED.episodio_atual,
                status = EXCLUDED.status,
                nota = EXCLUDED.nota,
                comentario = EXCLUDED.comentario,
                updated_at = CURRENT_TIMESTAMP
            RETURNING *
        \, [usuarioId, serieId, episodioAtual, status, nota, comentario]);
        return result.rows[0];
    }

    static async delete(usuarioId, serieId) {
        const result = await pool.query(
            'DELETE FROM progresso WHERE usuario_id =  AND serie_id =  RETURNING id',
            [usuarioId, serieId]
        );
        return result.rows[0];
    }

    static async getGroupProgress(grupoId) {
        const result = await pool.query(\
            SELECT p.*, u.nome as usuario_nome, s.titulo as serie_titulo
            FROM progresso p
            JOIN usuarios u ON p.usuario_id = u.id
            JOIN series s ON p.serie_id = s.id
            JOIN membros_grupo mg ON u.id = mg.usuario_id
            WHERE mg.grupo_id = 
            ORDER BY p.updated_at DESC
            LIMIT 50
        \, [grupoId]);
        return result.rows;
    }
}

module.exports = Progresso;
