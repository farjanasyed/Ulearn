import axios from "axios";
import fs from "fs";


import https from 'https';
import path from 'path';
import jks from 'jks-js'

const keystore = jks.toPem(
    fs.readFileSync(path.join(__dirname, "../wso2carbon.jks")),
    'wso2carbon'
)
const { cert, key } = keystore["wso2carbon"];
const credentials = { key: key, cert: cert };

class UserService {
    async createUser(data: any) {

        return axios.post(`https://localhost:9443/scim2/Users`, data, {
            headers: {
                "Content-Type": "application/json",
            },
            auth: {
                username: 'admin',
                password: 'admin'
            },
            httpsAgent: new https.Agent({
                cert: cert,
                key: key,
                rejectUnauthorized: false
            })
        })
    }
    async getUserById(Id: string) {
        return axios.get(`https://localhost:9443/scim2/Users/${Id}`, {
            headers: {
                "Content-Type": "application/json",
            },
            auth: {
                username: 'admin',
                password: 'admin'
            },
            httpsAgent: new https.Agent({
                cert: cert,
                key: key,
                rejectUnauthorized: false
            })
        })
    }

    async verifyUser(body: any) {
        return axios.post(`https://localhost:9443/api/identity/user/v1.0/validate-code`, body, {
            headers: {
                "Content-Type": "application/json",
            },
            auth: {
                username: 'RBQa1_wQZ_L5t43OnHdCUFWfhl8a',
                password: 'nzoRnNJ9yhDl5Eih7vpdKXOOy38a'
            },
            httpsAgent: new https.Agent({
                cert: cert,
                key: key,
                rejectUnauthorized: false
            })
        })

    }

    async createBulkUsers(data: any) {
        return axios.post(`https://20.204.146.129:9443/scim2/Bulk`, data, {
            headers: {
                "Content-Type": "application/json",
            },
            auth: {
                username: 'admin',
                password: 'admin'
            },
            httpsAgent: new https.Agent({
                cert: cert,
                key: key,
                rejectUnauthorized: false
            })
        })
    }

}


export default new UserService(); 