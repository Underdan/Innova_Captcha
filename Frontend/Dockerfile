# Etapa 1: Compilación
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

# Etapa 2: Servidor NGINX
FROM nginx:alpine
COPY --from=builder /app/dist/Frontend /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
