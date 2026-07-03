const pool = require('../config/database');

class Interpretacao {
    static async create(data) {
        const { serieId, usuarioId, titulo, conteudo, spoiler } = data;
        const result = await pool.query(
            'INSERT INTO interpretacoes (serie_id, usuario_id, titulo, conteudo, spoiler) VALUES (, , , , ) RETURNING *',
            [serieId, usuarioId, titulo, conteudo, spoiler || false]
        );
        return result.rows[0];
    }

    static async findBySerie(serieId, includeSpoilers = false) {
        let query = \
            SELECT i.*, u.nome as usuario_nome, u.avatar as usuario_avatar
            FROM interpretacoes i
            JOIN usuarios u ON i.usuario_id = u.id
            WHERE i.serie_id = 
        \;
        
        if (!includeSpoilers) {
            query += ' AND i.spoiler = false';
        }
        
        query += ' ORDER BY i.created_at DESC';
        
        const result = await pool.query(query, [serieId]);
        return result.rows;
    }

    static async findById(id) {
        const result = await pool.query(\
            SELECT i.*, u.nome as usuario_nome, u.avatar as usuario_avatar
            FROM interpretacoes i
            JOIN usuarios u ON i.usuario_id = u.id
            WHERE i.id = 
        \, [id]);
        return result.rows[0];
    }

    static async update(id, data) {
        const { titulo, conteudo, spoiler } = data;
        const result = await pool.query(
            'UPDATE interpretacoes SET titulo = , conteudo = , spoiler = , updated_at = CURRENT_TIMESTAMP WHERE id =  RETURNING *',
            [titulo, conteudo, spoiler, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        const result = await pool.query('DELETE FROM interpretacoes WHERE id =  RETURNING id', [id]);
        return result.rows[0];
    }

    static async getByUser(usuarioId) {
        const result = await pool.query(\
            SELECT i.*, s.titulo as serie_titulo
            FROM interpretacoes i
            JOIN series s ON i.serie_id = s.id
            WHERE i.usuario_id = 
            ORDER BY i.created_at DESC
        \, [usuarioId]);
        return result.rows;
    }
}

module.exports = Interpretacao;
