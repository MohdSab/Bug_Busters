FROM docker.io/node:lts-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm --omit=dev install

COPY dist/apps/c4-service apps/c4-service

# You can remove this install step if you build with `--bundle` option.
# The bundled output will include external dependencies.

CMD [ "node", "c4-service/main.js" ]