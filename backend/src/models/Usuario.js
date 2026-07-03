const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class Usuario {
    static async create(nome, email, senha) {
        const hash = await bcrypt.hash(senha, 10);
        const result = await pool.query(
            'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email',
            [nome, email, hash]
        );
        return result.rows[0];
    }

    static async findByEmail(email) {
        try {
            console.log('🔍 Buscando:', email);
            const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
            return result.rows[0];
        } catch (error) {
            console.error('Erro ao buscar email:', error);
            return null;
        }
    }

    static async findById(id) {
        try {
            const result = await pool.query('SELECT id, nome, email FROM usuarios WHERE id = $1', [id]);
            return result.rows[0];
        } catch (error) {
            console.error('Erro ao buscar id:', error);
            return null;
        }
    }

    static async verifyPassword(email, senha) {
        try {
            const user = await this.findByEmail(email);
            if (!user) return false;
            return await bcrypt.compare(senha, user.senha);
        } catch (error) {
            console.error('Erro ao verificar senha:', error);
            return false;
        }
    }
}

module.exports = Usuario;