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


    async getAllUsers(token: any) {
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


    async getUserByName(userName: string, token) {
        let filter = `filter=userName eq ${userName}`
        return axios.get(`${process.env.WSO2_URL}/scim2/Users?${filter}`, {
            headers: {
                "Content-Type": "application/json"
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
    async getUserById(Id: string, token: any) {
        return axios.get(`${process.env.WSO2_URL}/scim2/Users/${Id}`, {
            headers: {
                "Content-Type": "application/json"
            },

            httpsAgent: new https.Agent({
                cert: cert,
                key: key,
                rejectUnauthorized: false
            }),
            auth: {
                username: process.env.AUTH_USER,
                password: process.env.AUTH_PASSWORD
            },
        })
    }

    async verifyUser(body: any) {
        return axios.post(`${process.env.WSO2_URL}/api/identity/user/v1.0/validate-code`, body, {
            headers: {
                "Content-Type": "application/json",
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


    async deleteUser(userId) {
        return axios.delete(`${process.env.WSO2_URL}/scim2/Users/${userId}`, {
            headers: {
                "Content-Type": "application/json",
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
    async deActivateUser(body: any, userId: String) {
        return axios.patch(`${process.env.WSO2_URL}/scim2/Users/${userId}`, body, {
            headers: {
                "Content-Type": "application/json",
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
    async changePassword(userId, body, token) {
        return axios.patch(`${process.env.WSO2_URL}/wso2/scim/Users/${userId}`, body, {
            httpsAgent: new https.Agent({
                cert: cert,
                key: key,
                rejectUnauthorized: false
            }),
            auth: {
                username: process.env.AUTH_USER,
                password: process.env.AUTH_PASSWORD
            },

        })
    }
    async verfyAndChangePassword(body) {
        console.log("body", body);
        return axios.post(`${process.env.WSO2_URL}/api/identity/recovery/v0.9/set-password`, body, {
            httpsAgent: new https.Agent({
                cert: cert,
                key: key,
                rejectUnauthorized: false
            }),
            auth: {
                username: process.env.AUTH_USER,
                password: process.env.AUTH_PASSWORD
            },

        })

    }
  async validateOTP(body:any){
    return axios.post(`${process.env.WSO2_URL}/api/identity/email-otp/v1/emailotp/validate`,body, {
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
    async forgotPassword(body) {
        return axios.post(`${process.env.WSO2_URL}/api/identity/recovery/v0.9/recover-password?type=email&notify=true`, body, {
            headers: {
                "Authorization": `Basic YWRtaW46YWRtaW4=`,
                "Content-Type": `application/json`,
                "Cookie": "JSESSIONID=20FC6E3F7B910787A08E8418632362CDAC8EA4DE995C3553627C5D79C31703367BFF3C27F68B2C30855E847B493D505721F955B2F2A7CCBD78AA233ACB3C39B0DB48FFEFCEB9CF03EA26BC847DC407C8C54582FF2FF4323DAEC5FEC085B13F5723B7697F8B7C1BFFEE6999F8FFD5EFAA8FFB5ABD6C076ADEC26813A780D70F90"
            },
            httpsAgent: new https.Agent({
                cert: cert,
                key: key,
                rejectUnauthorized: false
            })

        })
    }

    async updateUser(userId, body) {
        return axios.patch(`${process.env.WSO2_URL}/wso2/scim/Users/${userId}`, body, {
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
    async assignRoles(body) {
        return axios.post(`${process.env.WSO2_URL}/scim2/Bulk`, body, {
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
    async getSalesForceToken() {
        return axios.post(`https://test.salesforce.com/services/oauth2/token`, {
            username: 'apiuser@unextdev.com',
            password: 'Salesforce@1xrvRAp4tm3Z9EqELiEEl9TdF',
            grant_type: 'password',
            client_id: '3MVG9N6eDmZRVJOkKJiKVlUhFbYPKBITKQunDCUs6OU4K3t.73PDNUoBOLzdpt7B5LepCCRq7QtZ2VIMlQbFb',
            client_secret: '055697E714160A3F2A1DBD8D3B1EDC722E2150A026AD532BE75F982805B7CDE3'

        },
            {
                headers: {
                    "Authorization": `Basic YWRtaW46YWRtaW4=`,
                    "Content-Type": `application/json`
                }
            })
    }

    async activateUser(token: string, SFId: string) {
        return axios.patch(`https://unextlearningprivatelimitedpartofm--unextdev.my.salesforce.com/services/data/v54.0/sobjects/user/${SFId}`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/JSON'
            }

        })


    }

    async generateOTP(body: any) {
        return axios.post(`${process.env.WSO2_URL}/api/identity/email-otp/v1/emailotp/generate`, body, {
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
}


export default new UserService(); 