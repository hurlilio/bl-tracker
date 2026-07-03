<div align="center">

# 🎬 BL Tracker

**Organize suas séries BL, acompanhe seu progresso e compartilhe interpretações com amigos.**

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Vue](https://img.shields.io/badge/Vue.js-3-42b883?logo=vuedotjs&logoColor=white)

</div>

---

# 📖 Sobre

O **BL Tracker** é uma aplicação web completa para fãs de séries **BL (Boys' Love)**.

A plataforma permite organizar séries, registrar o progresso dos episódios assistidos, criar anotações pessoais, compartilhar interpretações e interagir com amigos através de grupos privados.

---

# ✨ Funcionalidades

## 🔐 Autenticação

- Cadastro de usuários
- Login com JWT
- Rotas protegidas
- Sessão persistente

---

## 👤 Usuário

- Perfil personalizado
- Lista de séries por status
- Estatísticas de progresso

---

## 📺 Séries

- Catálogo completo
- Busca por nome
- Filtros
- Página de detalhes
- Sinopse

---

## 📊 Progresso

- Registro de episódios assistidos
- Notas pessoais
- Comentários
- Status personalizados

Exemplos:

- Assistindo
- Pausado
- Concluído
- Planejo assistir
- Abandonado

---

## 👥 Grupos

- Grupos privados
- Código de convite
- Administradores
- Lista de membros

---

## 💬 Interpretações

- Publicações colaborativas
- Marcação de spoiler
- Feed de atividades

---

# 🚀 Tecnologias

## Backend

- Node.js
- Express
- PostgreSQL
- JWT
- bcryptjs

---

## Frontend

- Vue.js 3
- Pinia
- Vue Router
- Axios
- Vite

---

## DevOps

- Docker
- Docker Compose

---

# 📦 Instalação

## Pré-requisitos

- Node.js 18+
- PostgreSQL 15+
- npm ou Yarn
- Docker (opcional)

---

## 1️⃣ Clonar o projeto

```bash
git clone https://github.com/seu-usuario/bl-tracker.git

cd bl-tracker
```

---

## 2️⃣ Backend

```bash
cd backend

npm install

cp .env.example .env
```

Edite o arquivo `.env` com suas configurações.

Depois execute:

```bash
npm run dev
```

---

## 3️⃣ Frontend

```bash
cd frontend

npm install

cp .env.example .env

npm run dev
```

---

## 4️⃣ Acessar a aplicação

| Serviço | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| API | http://localhost:3000/api |
| Health Check | http://localhost:3000/api/health |

---

## 5️⃣ Credenciais de demonstração

```text
Email: admin@bltracker.com
Senha: admin123
```

---

# 🐳 Executando com Docker

```bash
docker-compose up -d
```

---

# 📁 Estrutura do Projeto

```text
bl-tracker/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── app.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── router/
│   │   ├── store/
│   │   ├── services/
│   │   ├── views/
│   │   ├── App.vue
│   │   └── main.js
│   │
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── docker-compose.yml
│
└── README.md
```

---

# 🔒 Variáveis de Ambiente

## Backend

```env
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
```

---

## Frontend

```env
VITE_API_URL=http://localhost:3000/api
```

---

# 📚 API

## 🔐 Autenticação

| Método | Endpoint | Descrição |
|---------|----------|-----------|
| POST | `/api/auth/register` | Cadastro |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Perfil |

---

## 👤 Usuários

| Método | Endpoint |
|---------|----------|
| GET | `/api/users/profile` |
| PUT | `/api/users/profile` |
| GET | `/api/users/progress` |
| GET | `/api/users/stats` |

---

## 📺 Séries

| Método | Endpoint |
|---------|----------|
| GET | `/api/series` |
| GET | `/api/series/:id` |
| POST | `/api/series` *(Administrador)* |

---

## 📊 Progresso

| Método | Endpoint |
|---------|----------|
| POST | `/api/progress` |
| GET | `/api/progress/:serieId` |

---

## 👥 Grupos

| Método | Endpoint |
|---------|----------|
| POST | `/api/groups` |
| POST | `/api/groups/join/:codigo` |
| GET | `/api/groups/my-groups` |

---

## 💬 Interpretações

| Método | Endpoint |
|---------|----------|
| POST | `/api/interpretations` |
| GET | `/api/interpretations/serie/:serieId` |

---

# 🤝 Contribuindo

1. Faça um **Fork** do projeto.

2. Crie uma branch.

```bash
git checkout -b feature/NovaFuncionalidade
```

3. Faça suas alterações.

```bash
git commit -m "Nova funcionalidade"
```

4. Envie para o GitHub.

```bash
git push origin feature/NovaFuncionalidade
```

5. Abra um Pull Request.

---

# 📝 Licença

Este projeto está distribuído sob a licença **MIT**.

Consulte o arquivo **LICENSE** para mais informações.

---

# 📧 Contato

**Equipe BL Tracker**

📩 contato@bltracker.com

🔗 **Projeto**

https://github.com/seu-usuario/bl-tracker

---

<div align="center">

**Desenvolvido com ❤️ para a comunidade BL**

</div>
