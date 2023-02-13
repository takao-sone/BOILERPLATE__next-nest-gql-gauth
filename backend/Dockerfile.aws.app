ARG PORT

FROM node:16.17.1 AS builder
ENV NODE_ENV=development
WORKDIR /opt/project
COPY ./package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --production

FROM node:16.17.1
ENV NODE_ENV=production
WORKDIR /opt/project
COPY ./package*.json ./
RUN npm ci
COPY . .
#COPY --from=builder /opt/project/dist ./dist
#COPY --from=builder /opt/project/node_modules/.prisma/client ./node_modules/.prisma/client

EXPOSE ${PORT}

# CMD [ "node", "./dist/src/main" ]
CMD [ "npm", "run", "start:aws" ]