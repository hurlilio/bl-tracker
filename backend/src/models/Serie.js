const pool = require('../config/database');

class Serie {
    static async findAll(filters = {}) {
        const { search, pais, genero, limit = 50, offset = 0 } = filters;
        let query = 'SELECT * FROM series WHERE 1=1';
        const params = [];
        let counter = 1;

        if (search) {
            query +=  AND (titulo ILIKE }{counter} OR sinopse ILIKE }{counter});
            params.push(%%);
            counter++;
        }

        if (pais) {
            query +=  AND pais = }{counter};
            params.push(pais);
            counter++;
        }

        if (genero) {
            query +=  AND genero ILIKE }{counter};
            params.push(%%);
            counter++;
        }

        query +=  ORDER BY titulo LIMIT }{counter} OFFSET }{counter + 1};
        params.push(limit, offset);

        const result = await pool.query(query, params);
        return result.rows;
    }

    static async findById(id) {
        const result = await pool.query('SELECT * FROM series WHERE id = ', [id]);
        return result.rows[0];
    }

    static async create(data) {
        const { titulo, sinopse, pais, ano, temporadas, capa, genero } = data;
        const result = await pool.query(
            'INSERT INTO series (titulo, sinopse, pais, ano, temporadas, capa, genero) VALUES (, , , , , , ) RETURNING *',
            [titulo, sinopse, pais, ano, temporadas, capa, genero]
        );
        return result.rows[0];
    }

    static async update(id, data) {
        const { titulo, sinopse, pais, ano, temporadas, capa, genero } = data;
        const result = await pool.query(
            'UPDATE series SET titulo = , sinopse = , pais = , ano = , temporadas = , capa = , genero =  WHERE id =  RETURNING *',
            [titulo, sinopse, pais, ano, temporadas, capa, genero, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        const result = await pool.query('DELETE FROM series WHERE id =  RETURNING id', [id]);
        return result.rows[0];
    }

    static async getGroupProgress(serieId, grupoId) {
        const result = await pool.query(\
            SELECT p.*, u.nome as usuario_nome, u.avatar as usuario_avatar
            FROM progresso p
            JOIN usuarios u ON p.usuario_id = u.id
            JOIN membros_grupo mg ON u.id = mg.usuario_id
            WHERE p.serie_id =  AND mg.grupo_id = 
            ORDER BY p.nota DESC NULLS LAST
        \, [serieId, grupoId]);
        return result.rows;
    }
}

module.exports = Serie;
