# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copiar package.json do frontend
COPY frontend/package*.json ./frontend/

# Instalar dependências
WORKDIR /app/frontend
RUN npm install

# Copiar o resto do frontend
COPY frontend/ ./frontend/

# Build
RUN npm run build

# Production stage
FROM nginx:alpine

# Copiar os arquivos buildados
COPY --from=build /app/frontend/dist /usr/share/nginx/html

# Copiar configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]