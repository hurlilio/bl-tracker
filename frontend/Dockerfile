FROM node:18-alpine as build

WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o resto do código
COPY . .

# Build da aplicação
RUN npm run build

# Servir com nginx
FROM nginx:alpine

# Copiar os arquivos buildados
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuração do nginx
COPY ../nginx.conf /etc/nginx/conf.d/default.conf

# Expor a porta
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]