From node:16-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install -g ts-node
RUN npm install -g typescript
RUN npm run build
COPY . .
EXPOSE 3000
CMD ["npm","start"]