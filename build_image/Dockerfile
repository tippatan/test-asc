FROM node:18.7-alpine


WORKDIR /tmp
RUN npm install -g @angular/cli@11.1.2
COPY .npmrc /root/.npmrc
COPY package*.json ./
RUN npm install --legacy-peer-deps --loglevel=error
