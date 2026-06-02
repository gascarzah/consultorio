FROM node:20-alpine AS build
WORKDIR /app

ARG VITE_API_URL=http://localhost:8080/consultorio/
ARG VITE_API_TIMEOUT=30000

COPY package*.json ./
RUN npm ci

COPY . .
ENV DOCKER=true
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_API_TIMEOUT=${VITE_API_TIMEOUT}
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
