FROM node:22-alpine AS build
WORKDIR /app
COPY package.json tsconfig.json ./
RUN npm install --no-audit --no-fund
COPY src ./src
COPY migrations ./migrations
RUN npm run build

FROM node:22-alpine
# Coolify's HTTP healthcheck uses curl/wget inside the runtime container.
# Provide curl explicitly; the base Alpine image alone is not sufficient.
RUN apk add --no-cache curl
ENV NODE_ENV=production
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund
COPY --from=build /app/dist ./dist
COPY migrations ./migrations
USER node
EXPOSE 8080
CMD ["sh","-c","node dist/migrate.js && exec node dist/main.js"]
