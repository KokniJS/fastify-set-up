FROM node:20.10-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . ./
EXPOSE 3001
