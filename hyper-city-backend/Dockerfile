
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

ENV NODE_ENV=production
ENV PORT=10001

EXPOSE 10001

CMD ["node", "src/index.js"]
