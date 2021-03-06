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

class PermissionService {
    async createPermissionInstance(body) {
        var data = qs.stringify(body);
        return axios.post(`${process.env.WSO2_URL}/carbon/resources/add_collection_ajaxprocessor.jsp`, data, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            auth: {
                username: process.env.AUTH_USER,
                password: process.env.AUTH_PASSWORD
            },
            httpsAgent: new https.Agent({
                cert: cert,
                key: key,
                rejectUnauthorized: false
            })
        })
    }

    async createModuleInstance(body) {
        var data = qs.stringify(body);
        return axios.post(`${process.env.WSO2_URL}/carbon/resources/add_collection_ajaxprocessor.jsp`, data, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            auth: {
                username: process.env.AUTH_USER,
                password: process.env.AUTH_PASSWORD
            },
            httpsAgent: new https.Agent({
                cert: cert,
                key: key,
                rejectUnauthorized: false
            })
        })
       
    }
    async addModule(body) {
        console.log("env", `${process.env.WSO2_URL}`)
        var data = qs.stringify(body);
        return axios.post(`${process.env.WSO2_URL}/carbon/properties/properties-ajaxprocessor.jsp`, data, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            auth: {
                username: process.env.AUTH_USER,
                password: process.env.AUTH_PASSWORD
            },
            httpsAgent: new https.Agent({
                cert: cert,
                key: key,
                rejectUnauthorized: false
            })
        })
    }
    async getPermission(appName) {
        //console.log("access tokne",accessToken);
        return axios.get(`${process.env.WSO2_URL}/permissions/app/${appName}`, {
            httpsAgent: new https.Agent({
                cert: cert,
                key: key,
                rejectUnauthorized: false
            })
            // ,
            // headers:{
            //     "Authorization":`${accessToken}`
            // }
        })
    }
    async permissionWithRole(permissionId, user) {
        return axios.get(`${process.env.WSO2_URL}/permissions/auth/${permissionId}/${user}`, {
            httpsAgent: new https.Agent({
                cert: cert,
                key: key,
                rejectUnauthorized: false
            })
        })
    }


    async deleteModulePermission(body) {
        var data = qs.stringify(body);
        console.log(data);
        return axios.post(`${process.env.WSO2_URL}/carbon/resources/delete_ajaxprocessor.jsp`,data, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            auth: {
                username: process.env.AUTH_USER,
                password: process.env.AUTH_PASSWORD
            },
            httpsAgent: new https.Agent({
                cert: cert,
                key: key,
                rejectUnauthorized: false
            })
        })
    }

    async getAllRolesUsingPermissionId(permissionId) {
        return axios.get(`${process.env.WSO2_URL}/permissions/${permissionId}/roles`, {
            httpsAgent: new https.Agent({
                cert: cert,
                key: key,
                rejectUnauthorized: false
            })
        })
    }

    async allModulesAndPermission(token) {
        let response = axios.get(`${process.env.WSO2_URL}/api/server/v1/permission-management/permissions`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            auth: {
                username: process.env.AUTH_USER,
                password: process.env.AUTH_PASSWORD
            },
            httpsAgent: new https.Agent({
                cert: cert,
                key: key,
                rejectUnauthorized: false
            })
        })

        return response;
    }
}

export default new PermissionService();
