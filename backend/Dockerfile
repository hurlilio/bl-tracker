FROM node:18-alpine

WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar o resto do código
COPY . .

# Expor a porta
EXPOSE 3000

# Iniciar a aplicação
CMD ["node", "server.js"]