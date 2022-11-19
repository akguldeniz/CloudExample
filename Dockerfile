FROM node:16 AS build
ADD . /app
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm ci --only=production

FROM gcr.io/distroless/nodejs:16
COPY --from=build /app /app
WORKDIR /app
EXPOSE 12101
CMD ["server.js"]