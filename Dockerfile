FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY drizzle ./drizzle
COPY src ./src

RUN npx tsc -p tsconfig.json

FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY drizzle ./drizzle
COPY --from=build /app/dist ./dist

EXPOSE 4000

USER node

CMD ["node", "dist/server.js"]
