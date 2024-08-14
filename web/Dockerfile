FROM node:20-alpine
WORKDIR /app

ENV TZ=Asia/Seoul

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install

COPY ./server/package.json ./server
COPY ./server/package-lock.json ./server
RUN cd server
RUN npm install

RUN cd ../

COPY . .

ARG VITE_API_HOST
ENV VITE_API_HOST=$VITE_API_HOST

ENV GENERATE_SOURCEMAP=false
ENV NODE_OPTIONS=--max-old-space-size=1024
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
