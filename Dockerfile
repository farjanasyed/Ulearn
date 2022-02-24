From node:16-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install -g ts-node
RUN npm install -g typescript
COPY . .
RUN tsc -p ./tsconfig.json
RUN npm run build
RUN pwd
RUN echo "$PWD"
EXPOSE 3000
CMD ["npm","start"]