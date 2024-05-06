FROM node:buster

WORKDIR /app

COPY package*.json /app/
RUN npm cache clean --force
RUN npm install

COPY . /app

CMD ["node", "app.js"]
