# Dockerfile for frontend service
FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5179

CMD ["npm", "run", "buld-preview"]
