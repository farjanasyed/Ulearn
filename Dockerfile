From node:16-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install -g ts-node
RUN npm install -g typescript
COPY . .
RUN tsc -p ./tsconfig.json
ENV WSO2_URL=https://3.135.36.52:9443
ENV AUTH_USER=admin@wso2.com
ENV AUTH_PASSWORD=admin
ENV Web_Client_Id=BsVXYu3TbA30z6g4ZXoPB8Uc4VIa
ENV Web_Client_Secret=sOfDYKsFAO9_YnHn67cfcoRXNRca
ENV Mobile_Client_Id=MP3cp5zFcQLPqVDCHfX6VosHefUa
ENV Mobile_Client_Secret=3Hm8DeStrrPTik1wjkysGVjBH30a
ENV CANDIDATE_RESET_PASSWORD_URL=https://applicant-dev.talentnext.ai
ENV ADMIN_RESET_PASSWORD_URL=http://dev.talentnext.ai/
RUN npm run build
RUN pwd
RUN echo "$PWD"
EXPOSE 3000
CMD ["npm","start"]