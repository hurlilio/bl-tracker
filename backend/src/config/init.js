const pool = require('./database');

const createTablesSQL = `
    CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        avatar VARCHAR(255),
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS series (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(200) NOT NULL,
        sinopse TEXT,
        pais VARCHAR(50),
        ano INTEGER,
        temporadas INTEGER,
        capa VARCHAR(255),
        genero VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS progresso (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        serie_id INTEGER REFERENCES series(id) ON DELETE CASCADE,
        episodio_atual INTEGER DEFAULT 0,
        status VARCHAR(20) DEFAULT 'quero_assistir',
        nota DECIMAL(3,1) CHECK (nota >= 0 AND nota <= 10),
        comentario TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(usuario_id, serie_id)
    );

    CREATE TABLE IF NOT EXISTS grupos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        descricao TEXT,
        codigo_convite VARCHAR(10) UNIQUE NOT NULL,
        admin_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS membros_grupo (
        id SERIAL PRIMARY KEY,
        grupo_id INTEGER REFERENCES grupos(id) ON DELETE CASCADE,
        usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        role VARCHAR(20) DEFAULT 'membro',
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(grupo_id, usuario_id)
    );

    CREATE TABLE IF NOT EXISTS interpretacoes (
        id SERIAL PRIMARY KEY,
        serie_id INTEGER REFERENCES series(id) ON DELETE CASCADE,
        usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        titulo VARCHAR(200) NOT NULL,
        conteudo TEXT NOT NULL,
        spoiler BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_progresso_usuario ON progresso(usuario_id);
    CREATE INDEX IF NOT EXISTS idx_progresso_serie ON progresso(serie_id);
    CREATE INDEX IF NOT EXISTS idx_interpretacoes_serie ON interpretacoes(serie_id);
    CREATE INDEX IF NOT EXISTS idx_membros_grupo_grupo ON membros_grupo(grupo_id);
    CREATE INDEX IF NOT EXISTS idx_membros_grupo_usuario ON membros_grupo(usuario_id);
`;

const initializeDatabase = async () => {
    try {
        await pool.query(createTablesSQL);
        console.log('[OK] Tabelas criadas/verificadas');
        
        const seriesCheck = await pool.query('SELECT COUNT(*) FROM series');
        if (parseInt(seriesCheck.rows[0].count) === 0) {
            await seedSeries();
        }
        
        const adminCheck = await pool.query("SELECT COUNT(*) FROM usuarios WHERE email = 'admin@bltracker.com'");
        if (parseInt(adminCheck.rows[0].count) === 0) {
            await seedAdmin();
        }
    } catch (error) {
        console.error('[ERRO] Ao inicializar banco:', error.message);
        throw error;
    }
};

const seedSeries = async () => {
    const seriesList = [
        ['Semantic Error', 'Um estudante de design e um de ciencia da computacao se encontram em um projeto de grupo.', 'Coreia do Sul', 2022, 1, 'Romance, Comedia'],
        ['KinnPorsche', 'A historia de Kinn e Porsche em um mundo de mafia.', 'Tailandia', 2022, 1, 'Acao, Romance'],
        ['Cherry Magic', 'Um funcionario de escritorio ganha o poder de ler mentes.', 'Japao', 2020, 1, 'Romance, Comedia'],
        ['Bad Buddy', 'Dois estudantes de faculdade rivais comecam um relacionamento secreto.', 'Tailandia', 2021, 1, 'Romance, Comedia'],
        ['Cutie Pie', 'Uma historia sobre um noivado arranjado entre dois homens.', 'Tailandia', 2022, 1, 'Romance']
    ];

    for (const serie of seriesList) {
        await pool.query(
            'INSERT INTO series (titulo, sinopse, pais, ano, temporadas, genero) VALUES ($1, $2, $3, $4, $5, $6)',
            serie
        );
    }
    console.log('[OK] Series iniciais inseridas');
};

const seedAdmin = async () => {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await pool.query(
        'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3)',
        ['Admin', 'admin@bltracker.com', hashedPassword]
    );
    console.log('[OK] Usuario admin criado (admin@bltracker.com / admin123)');
};

module.exports = { initializeDatabase };