FROM node:16.19.1 AS builder
ARG PORT
ENV NODE_ENV=development
WORKDIR /opt/project
COPY ./package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --production

FROM node:16.19.1 AS staging
ARG PORT
ENV NODE_ENV=development
WORKDIR /opt/project
COPY ./package*.json ./
COPY --from=builder /opt/project/dist ./dist
COPY --from=builder /opt/project/node_modules ./node_modules
EXPOSE ${PORT}
CMD [ "node", "./dist/src/main" ]
