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
    async getAuthToken(body, token) {
        return axios.post('https://localhost:9443/oauth2/token', qs.stringify(body), {
            httpsAgent: new https.Agent({
                cert: cert,
                key: key,
                rejectUnauthorized: false
            }),

            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                "Authorization": token
            }
        })
    }
    async getUserInfo(accessToken, param) {
        return axios.get(`https://localhost:9443/oauth2/userinfo?schema=${param}`, {
            httpsAgent: new https.Agent({
                cert: cert,
                key: key,
                rejectUnauthorized: false
            }),
            headers: {
                "Authorization": accessToken
            },
        })
    }
    async getRefreshToken(accessToken, body) {
        return axios.post(`https://localhost:9443/oauth2/token`, qs.stringify(body), {
            httpsAgent: new https.Agent({
                cert: cert,
                key: key,
                rejectUnauthorized: false
            }),
            headers: {
                "Authorization": accessToken
            },
        })
    }
}

export default new AuthService();
