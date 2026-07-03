-- BL Tracker Database Schema

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