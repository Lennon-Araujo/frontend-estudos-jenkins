FROM node:14-alpine

USER root

WORKDIR /usr/chat/app

COPY package*.json ./

RUN npm install --silent

COPY . .

EXPOSE 8000
