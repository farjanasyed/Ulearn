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

class RoleService {
    async assignRole(body) {
        return axios.post(`${process.env.WSO2_URL}/scim2/Roles`,body, {
            httpsAgent: new https.Agent({
                cert: cert,
                key: key,
                rejectUnauthorized: false
            }),

            headers: {
                'Content-Type': 'application/json'
               
            },
            auth:{
                username: process.env.AUTH_USER,
                password: process.env.AUTH_PASSWORD
            }
        })
    }

    async createRolesInBulk(body) {
        return axios.post(`${process.env.WSO2_URL}/scim2/Bulk`,body, {
            httpsAgent: new https.Agent({
                cert: cert,
                key: key,
                rejectUnauthorized: false
            }),

            headers: {
                'Content-Type': 'application/json'
            },
            auth:{
                username: process.env.AUTH_USER,
                password: process.env.AUTH_PASSWORD
            }
        })
    }

    async getRoleById(roleId: string){
        console.log("Id",roleId);
        return axios.get(`${process.env.WSO2_URL}/scim2/Roles/${roleId}`, {
            httpsAgent: new https.Agent({
                cert: cert,
                key: key,
                rejectUnauthorized: false
            }),

            headers: {
                'Content-Type': 'application/json'
            },
            auth:{
                username: process.env.AUTH_USER,
                password: process.env.AUTH_PASSWORD
            }
        })

    }

    async getAllRoles(){
        return axios.get(`${process.env.WSO2_URL}/scim2/Roles`, {
            httpsAgent: new https.Agent({
                cert: cert,
                key: key,
                rejectUnauthorized: false
            }),

            headers: {
                'Content-Type': 'application/json'
            },
            auth:{
                username: process.env.AUTH_USER,
                password: process.env.AUTH_PASSWORD
            }
        })

    }

    async updateRole(roleId: string,body: any){
        return axios.post(`${process.env.WSO2_URL}/scim2/Roles/${roleId}`,body,{
            httpsAgent: new https.Agent({
                cert: cert,
                key: key,
                rejectUnauthorized: false
            }),

            headers: {
                'Content-Type': 'application/json'
            },
            auth:{
                username: process.env.AUTH_USER,
                password: process.env.AUTH_PASSWORD
            }
        })


    }

    async assignUsers(roleId: string,body: any){
        return axios.patch(`${process.env.WSO2_URL}/scim2/Roles/${roleId}`,body,{
            httpsAgent: new https.Agent({
                cert: cert,
                key: key,
                rejectUnauthorized: false
            }),

            headers: {
                'Content-Type': 'application/json'
            },
            auth:{
                username: process.env.AUTH_USER,
                password: process.env.AUTH_PASSWORD
            }
        })


    }

    async updateRoleById(roleId: string,body: any){
        return axios.put(`${process.env.WSO2_URL}/scim2/Roles/${roleId}`,body,{
            httpsAgent: new https.Agent({
                cert: cert,
                key: key,
                rejectUnauthorized: false
            }),

            headers: {
                'Content-Type': 'application/json'
            },
            auth:{
                username: process.env.AUTH_USER,
                password: process.env.AUTH_PASSWORD
            }
        })


    }
   
   async getRolesById(roleId: string){
    return axios.get(`${process.env.WSO2_URL}/scim2/Roles/${roleId}`,{
        httpsAgent: new https.Agent({
            cert: cert,
            key: key,
            rejectUnauthorized: false
        }),

        headers: {
            'Content-Type': 'application/json'
        },
        auth:{
            username: process.env.AUTH_USER,
            password: process.env.AUTH_PASSWORD
        }
    })
   }
}

export default new RoleService();
