const pool = require('../config/database');
const crypto = require('crypto');

class Grupo {
    static async create(data) {
        const { nome, descricao, adminId } = data;
        
        // Gera código de convite único
        let codigoConvite;
        let exists = true;
        while (exists) {
            codigoConvite = crypto.randomBytes(4).toString('hex').toUpperCase();
            const check = await pool.query('SELECT id FROM grupos WHERE codigo_convite = ', [codigoConvite]);
            exists = check.rows.length > 0;
        }

        const result = await pool.query(
            'INSERT INTO grupos (nome, descricao, codigo_convite, admin_id) VALUES (, , , ) RETURNING *',
            [nome, descricao, codigoConvite, adminId]
        );

        // Adiciona admin como membro
        await pool.query(
            'INSERT INTO membros_grupo (grupo_id, usuario_id, role) VALUES (, , )',
            [result.rows[0].id, adminId, 'admin']
        );

        return result.rows[0];
    }

    static async findById(id) {
        const result = await pool.query(\
            SELECT g.*, 
                (SELECT COUNT(*) FROM membros_grupo WHERE grupo_id = g.id) as total_membros
            FROM grupos g
            WHERE g.id = 
        \, [id]);
        return result.rows[0];
    }

    static async findByCode(codigo) {
        const result = await pool.query('SELECT * FROM grupos WHERE codigo_convite = ', [codigo.toUpperCase()]);
        return result.rows[0];
    }

    static async getUserGroups(usuarioId) {
        const result = await pool.query(\
            SELECT g.*, 
                (SELECT COUNT(*) FROM membros_grupo WHERE grupo_id = g.id) as total_membros,
                (SELECT COUNT(*) FROM interpretacoes i WHERE i.serie_id IN (SELECT serie_id FROM progresso WHERE usuario_id = ) AND i.usuario_id = ) as total_interpretacoes
            FROM grupos g
            JOIN membros_grupo mg ON g.id = mg.grupo_id
            WHERE mg.usuario_id = 
            ORDER BY g.created_at DESC
        \, [usuarioId]);
        return result.rows;
    }

    static async addMember(grupoId, usuarioId, role = 'membro') {
        const result = await pool.query(
            'INSERT INTO membros_grupo (grupo_id, usuario_id, role) VALUES (, , ) ON CONFLICT DO NOTHING RETURNING *',
            [grupoId, usuarioId, role]
        );
        return result.rows[0];
    }

    static async removeMember(grupoId, usuarioId) {
        const result = await pool.query(
            'DELETE FROM membros_grupo WHERE grupo_id =  AND usuario_id =  RETURNING id',
            [grupoId, usuarioId]
        );
        return result.rows[0];
    }

    static async getMembers(grupoId) {
        const result = await pool.query(\
            SELECT u.id, u.nome, u.email, u.avatar, mg.role, mg.joined_at
            FROM membros_grupo mg
            JOIN usuarios u ON mg.usuario_id = u.id
            WHERE mg.grupo_id = 
            ORDER BY mg.role = 'admin' DESC, mg.joined_at ASC
        \, [grupoId]);
        return result.rows;
    }

    static async isMember(grupoId, usuarioId) {
        const result = await pool.query(
            'SELECT id FROM membros_grupo WHERE grupo_id =  AND usuario_id = ',
            [grupoId, usuarioId]
        );
        return result.rows.length > 0;
    }

    static async isAdmin(grupoId, usuarioId) {
        const result = await pool.query(
            'SELECT id FROM membros_grupo WHERE grupo_id =  AND usuario_id =  AND role = ',
            [grupoId, usuarioId, 'admin']
        );
        return result.rows.length > 0;
    }

    static async delete(id) {
        const result = await pool.query('DELETE FROM grupos WHERE id =  RETURNING id', [id]);
        return result.rows[0];
    }
}

module.exports = Grupo;
