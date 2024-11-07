# Etapa 1: Build da aplicação
FROM node:18 AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia o package.json e o package-lock.json
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código para o diretório de trabalho
COPY . .

# Compila a aplicação
RUN npm run build

# Etapa 2: Imagem para execução
FROM node:18-alpine

WORKDIR /app

# Copia as dependências instaladas e o código compilado da etapa anterior
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist


EXPOSE 3000


CMD ["node", "dist/main"]
