From node:16-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install -g ts-node
COPY . .
EXPOSE 8080
CMD ["npm","start"]