const errorHandler = (err, req, res, next) => {
    console.error('❌ Erro:', err);

    // Erros de validação do express-validator
    if (err.array && err.array().length > 0) {
        return res.status(400).json({
            error: 'Erro de validação',
            details: err.array()
        });
    }

    // Erros de banco de dados
    if (err.code && err.code.startsWith('23')) {
        return res.status(409).json({
            error: 'Conflito de dados',
            details: err.detail || 'Violação de integridade'
        });
    }

    // Erro padrão
    const status = err.status || 500;
    const message = err.message || 'Erro interno do servidor';

    res.status(status).json({
        error: message,
        code: err.code || 'INTERNAL_ERROR'
    });
};

module.exports = { errorHandler };
