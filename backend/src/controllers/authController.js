const Usuario = require('../models/Usuario');
const { generateToken } = require('../config/auth');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
        console.log('📝 Registrando:', req.body.email);
        const { nome, email, senha } = req.body;
        
        const existing = await Usuario.findByEmail(email);
        if (existing) {
            return res.status(409).json({ error: 'Email já cadastrado' });
        }

        const user = await Usuario.create(nome, email, senha);
        const token = generateToken(user.id);

        res.status(201).json({ user, token });
    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
};

exports.login = async (req, res) => {
    try {
        console.log('🔑 Tentando login:', req.body.email);
        const { email, senha } = req.body;
        
        if (!email || !senha) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        const user = await Usuario.findByEmail(email);
        if (!user) {
            console.log('❌ Usuário não encontrado:', email);
            return res.status(401).json({ error: 'Email ou senha inválidos' });
        }

        console.log('✅ Usuário encontrado:', user.email);
        console.log('🔑 Hash no banco:', user.senha);

        // Verificar senha usando bcrypt
        const isValid = await bcrypt.compare(senha, user.senha);
        console.log('🔐 Senha válida?', isValid);

        if (!isValid) {
            console.log('❌ Senha inválida para:', email);
            return res.status(401).json({ error: 'Email ou senha inválidos' });
        }

        const token = generateToken(user.id);
        console.log('✅ Login bem-sucedido:', email);

        res.json({ 
            user: { id: user.id, nome: user.nome, email: user.email }, 
            token 
        });
    } catch (error) {
        console.error('❌ Erro no login:', error);
        res.status(500).json({ error: 'Erro ao fazer login: ' + error.message });
    }
};