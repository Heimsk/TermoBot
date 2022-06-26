FROM node:latest

WORKDIR usr/src
COPY package.json .env ./
RUN mkdir src
COPY src ./src
RUN yarn

EXPOSE 8080

CMD ["src/index.js"]
