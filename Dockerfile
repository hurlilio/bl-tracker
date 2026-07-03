FROM node:18-alpine as build

WORKDIR /app

# Copiar arquivos do frontend
COPY frontend/package*.json ./frontend/

# Instalar dependências do frontend
WORKDIR /app/frontend
RUN npm install

# Copiar o resto do código do frontend
COPY frontend/ ./frontend/

# Build do frontend
RUN npm run build

# Servir com nginx
FROM nginx:alpine

# Copiar os arquivos buildados
COPY --from=build /app/frontend/dist /usr/share/nginx/html

# Copiar configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]