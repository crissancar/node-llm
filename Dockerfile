FROM node:20.11.1-alpine

WORKDIR /code

COPY package.json package-lock.json ./

RUN npm install
