FROM node:20-alpine

WORKDIR /app

COPY  package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD ["node", "--max-old-space-size=4096", "dist/main.js"]