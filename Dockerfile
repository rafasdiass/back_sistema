# Etapa 1: Construção da aplicação
FROM node:18 AS builder

WORKDIR /app

# Copia os arquivos necessários
COPY package*.json ./
COPY prisma ./prisma

# Instala as dependências
RUN npm install

# Copia o restante do código
COPY . .

# Gera o cliente Prisma e compila o projeto
RUN npx prisma generate
RUN npm run build

# Remove as dependências de desenvolvimento para reduzir o tamanho da imagem
RUN npm prune --production

# Etapa 2: Configuração para execução
FROM node:18

WORKDIR /app

# Copia os arquivos compilados, o cliente do Prisma e o schema
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Expor a porta padrão do NestJS
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["node", "dist/main.js"]
