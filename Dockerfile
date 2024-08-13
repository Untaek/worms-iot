FROM node:20-alpine

ENV TZ=Asia/Seoul

WORKDIR /app

COPY ./package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "start"]