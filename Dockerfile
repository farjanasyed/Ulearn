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
ENV Web_Client_Id=YRlwurgrJ_ghTfPXWnYwTaboNSMa
ENV Web_Client_Secret=5JPH8IzQcFLkrXX71ZFF4QsJUc8a
ENV Mobile_Client_Id=MP3cp5zFcQLPqVDCHfX6VosHefUa
ENV Mobile_Client_Secret=3Hm8DeStrrPTik1wjkysGVjBH30a
RUN npm run build
RUN pwd
RUN echo "$PWD"
EXPOSE 3000
CMD ["npm","start"]