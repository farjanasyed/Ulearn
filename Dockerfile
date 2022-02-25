From node:16-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install -g ts-node
RUN npm install -g typescript
COPY . .
RUN tsc -p ./tsconfig.json
ENV WSO2_URL=https://ec2-3-108-178-123.ap-south-1.compute.amazonaws.com:9443
ENV AUTH_USER=admin
ENV AUTH_PASSWORD=admin
RUN npm run build
RUN pwd
RUN echo "$PWD"
EXPOSE 3000
CMD ["npm","start"]