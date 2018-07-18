FROM node:10.6.0-alpine as node_modules
ENV NODE_ENV production
WORKDIR /tmp
COPY package.json package-lock.json /tmp/
RUN npm install --production --loglevel error

FROM node:10.6.0-alpine
ENV NODE_ENV production
WORKDIR /app
COPY * ./
COPY --from=node_modules /tmp/node_modules ./node_modules
RUN apk add --no-cache \
    curl \
    jq
EXPOSE 3000
CMD ["node_modules/.bin/micro", "index.js"]
