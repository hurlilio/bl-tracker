# 🎬 BL Tracker

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-18.x-brightgreen)
![Vue](https://img.shields.io/badge/vue-3.x-4fc08d)

**BL Tracker** é uma aplicação web completa para organizar séries BL, registrar progresso e compartilhar interpretações com amigos.

## ✨ Funcionalidades

### 🔐 Autenticação
- Cadastro e login com JWT
- Proteção de rotas
- Sessão persistente

### 👤 Usuário
- Perfil personalizado
- Lista de séries por status
- Estatísticas de progresso

### 📺 Séries
- Catálogo completo
- Busca e filtros
- Detalhes com sinopse

### 📊 Progresso
- Registro de episódios
- Notas pessoais
- Comentários
- Status personalizado

### 👥 Grupos
- Grupos privados
- Código de convite
- Membros e administradores

### 💬 Interpretações
- Textos colaborativos
- Marcador de spoiler
- Feed de atividades

## 🚀 Tecnologias

### Backend
- **Node.js** + **Express** - API REST
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **bcryptjs** - Criptografia

### Frontend
- **Vue.js 3** - Framework progressivo
- **Pinia** - Gerenciamento de estado
- **Vue Router** - Navegação
- **Axios** - Requisições HTTP

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração

## 📦 Instalação

### Pré-requisitos

- Node.js 18+
- PostgreSQL 15+
- npm ou yarn
- Docker (opcional)

### 1. Clonar o repositório

\\\ash
git clone https://github.com/seu-usuario/bl-tracker.git
cd bl-tracker
\\\

### 2. Configurar o backend

\\\ash
cd backend
npm install
cp .env.example .env
# Edite o arquivo .env com suas configurações
npm run dev
\\\

### 3. Configurar o frontend

\\\ash
cd frontend
npm install
cp .env.example .env
npm run dev
\\\

### 4. Acessar a aplicação

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- Health Check: http://localhost:3000/api/health

### 5. Credenciais de exemplo

- Email: admin@bltracker.com
- Senha: admin123

## 🐳 Usando Docker

\\\ash
docker-compose up -d
\\\

## 📁 Estrutura do Projeto

\\\
bl-tracker/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── app.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── router/
│   │   ├── store/
│   │   ├── services/
│   │   ├── views/
│   │   ├── App.vue
│   │   └── main.js
│   ├── .env
│   ├── package.json
│   └── vite.config.js
├── database/
│   ├── schema.sql
│   └── seed.sql
├── docker-compose.yml
└── README.md
\\\

## 🔒 Variáveis de Ambiente

### Backend (.env)

\\\env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=bltracker
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
\\\

### Frontend (.env)

\\\env
VITE_API_URL=http://localhost:3000/api
\\\

## 📚 API Endpoints

### Autenticação
- POST /api/auth/register - Cadastro
- POST /api/auth/login - Login
- GET /api/auth/me - Perfil

### Usuários
- GET /api/users/profile - Perfil
- PUT /api/users/profile - Atualizar
- GET /api/users/progress - Progresso
- GET /api/users/stats - Estatísticas

### Séries
- GET /api/series - Listar
- GET /api/series/:id - Detalhes
- POST /api/series - Criar (admin)

### Progresso
- POST /api/progress - Salvar
- GET /api/progress/:serieId - Buscar

### Grupos
- POST /api/groups - Criar
- POST /api/groups/join/:codigo - Entrar
- GET /api/groups/my-groups - Meus grupos

### Interpretações
- POST /api/interpretations - Criar
- GET /api/interpretations/serie/:serieId - Listar

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua branch (git checkout -b feature/AmazingFeature)
3. Commit suas alterações (git commit -m 'Add some AmazingFeature')
4. Push para a branch (git push origin feature/AmazingFeature)
5. Abra um Pull Request

## 📝 Licença

Distribuído sob a licença MIT. Veja \LICENSE\ para mais informações.

## 📧 Contato

Equipe BL Tracker - contato@bltracker.com

Link do Projeto: [https://github.com/seu-usuario/bl-tracker](https://github.com/seu-usuario/bl-tracker)

---

Desenvolvido com ❤️ para a comunidade BL
