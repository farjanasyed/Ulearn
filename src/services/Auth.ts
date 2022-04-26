import axios from "axios";
import fs from "fs";
import https from 'https';
import path from 'path';
import jks from 'jks-js'
import qs from 'qs';

const keystore = jks.toPem(
    fs.readFileSync(path.join(__dirname, "../wso2carbon.jks")),
    'wso2carbon'
)
const { cert, key } = keystore["wso2carbon"];
const credentials = { key: key, cert: cert };

class AuthService {
    async getAuthToken(body) {
        return axios.post(`${process.env.WSO2_URL}/oauth2/token`, qs.stringify(body), {
            httpsAgent: new https.Agent({
                cert: cert,
                key: key,
                rejectUnauthorized: false
            }),

            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
               
            },
            auth:{
                username: process.env.Web_Client_Id,
                password: process.env.Web_Client_Secret
            }
        })
    }
    async getUserInfo(accessToken) {
         console.log("access tokne",accessToken);
        return axios.get(`${process.env.WSO2_URL}/wso2/scim/Users/me`, {
            httpsAgent: new https.Agent({
                cert: cert,
                key: key,
                rejectUnauthorized: false
            }),
            headers:{
                "Authorization":`${accessToken}`
            }
        })
    }
    async getRefreshToken(body) {
        return axios.post(`${process.env.WSO2_URL}/oauth2/token`, qs.stringify(body), {
            httpsAgent: new https.Agent({
                cert: cert,
                key: key,
                rejectUnauthorized: false
            }),
            auth: {
               username : process.env.Web_Client_Id,
               password: process.env.Web_Client_Secret
            },
        })
    }
}

export default new AuthService();
