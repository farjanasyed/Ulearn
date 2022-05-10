import axios from "axios";
import fs from "fs";


import https from 'https';
import path from 'path';
import jks from 'jks-js'
import qs from "qs";

const keystore = jks.toPem(
    fs.readFileSync(path.join(__dirname, "../wso2carbon.jks")),
    'wso2carbon'
)
const { cert, key } = keystore["wso2carbon"];
const credentials = { key: key, cert: cert };

class UserService {
    async createUser(data: any) {

     
        console.log("env",`${process.env.WSO2_URL}`)

        return axios.post(`${process.env.WSO2_URL}/scim2/Users`, data, {
            headers: {
                "Content-Type": "application/json"
            },
          
            httpsAgent: new https.Agent({
                cert: cert,
                key: key,
                rejectUnauthorized: false
            })
        })

    
    
    }


    async getAllUsers(token: any){
        return axios.get(`${process.env.WSO2_URL}/scim2/Users`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
          
            httpsAgent: new https.Agent({
                cert: cert,
                key: key,
                rejectUnauthorized: false
            })
        })
    }


    async getUserByName(userName: string,token){
        let filter = `filter=userName eq ${userName}`
        return axios.get(`${process.env.WSO2_URL}/scim2/Users?${filter}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            httpsAgent: new https.Agent({
                cert: cert,
                key: key,
                rejectUnauthorized: false
            })
        })
    }
    async getUserById(Id: string,token: any) {
        return axios.get(`${process.env.WSO2_URL}/scim2/Users/${Id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
           
            httpsAgent: new https.Agent({
                cert: cert,
                key: key,
                rejectUnauthorized: false
            })
        })
    }

    async verifyUser(body: any) {
        return axios.post(`${process.env.WSO2_URL}/api/identity/user/v1.0/validate-code`, body, {
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

    async deleteUser(body:any,userId: String){
        return axios.patch(`${process.env.WSO2_URL}/scim2/Users/${userId}`,body,{
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

    async createBulkUsers(data: any, token: any) {
        return axios.post(`${process.env.WSO2_URL}/scim2/Bulk`, data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            httpsAgent: new https.Agent({
                cert: cert,
                key: key,
                rejectUnauthorized: false
            })
        })
    }
    async changePassword(userId,body,token) {
        return axios.patch(`${process.env.WSO2_URL}/wso2/scim/Users/${userId}`,body, {
            httpsAgent: new https.Agent({
                cert: cert,
                key: key,
                rejectUnauthorized: false
            }),

            headers:{
                "Authorization":`${token}`
            }
           
        })
    }


    async forgotPassword(body) {
        return axios.post(`${process.env.WSO2_URL}/api/identity/recovery/v0.9/recover-password?type=email&notify=true`,body, {
           headers:{
            "Authorization":`Basic YWRtaW46YWRtaW4=`,
            "Content-Type":`application/json`,
            "Cookie":"JSESSIONID=20FC6E3F7B910787A08E8418632362CDAC8EA4DE995C3553627C5D79C31703367BFF3C27F68B2C30855E847B493D505721F955B2F2A7CCBD78AA233ACB3C39B0DB48FFEFCEB9CF03EA26BC847DC407C8C54582FF2FF4323DAEC5FEC085B13F5723B7697F8B7C1BFFEE6999F8FFD5EFAA8FFB5ABD6C076ADEC26813A780D70F90"
           },
            httpsAgent: new https.Agent({
                cert: cert,
                key: key,
                rejectUnauthorized: false
            })
           
        })
    }

    async updateUser(userId,body){
        return axios.patch(`${process.env.WSO2_URL}/wso2/scim/Users/${userId}`,body,{
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