FROM node:alpine

RUN wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub \
    && wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.35-r0/glibc-2.35-r0.apk \
    && apk add glibc-2.35-r0.apk

WORKDIR /app

COPY package*.json /app/
RUN npm cache clean --force
RUN npm install

COPY . /app

CMD ["node", "app.js"]
