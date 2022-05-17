import AuthService from '../services/Auth';
import { Request, Response } from 'express';
class AuthContrller {
    public async getAuthToken(req: Request, res: Response) {
        console.log("Request::GetToken",req.body);
        req.body["grant_type"] = "password"
        req.body["scope"]= "openid"
        req.body["username"] = req.body.userName;
        AuthService.getAuthToken(req.body).then(result => {
            console.log("result from token", result.status);
            if (result.status == 400) {
                console.log("Result",result);
                res.status(400).send({
                    statusCode: 400,
                    statusMessage: "Bad Request",
                    data: result.data
                })
            }
            else
                res.status(200).send({
                    statusCode: 200,
                    statusMessage: "Token Retrieved Successfully",
                    data: result.data
                })
        }).catch(error => {
            console.log("Error",error);
            if (error.response.status == 400) {
                res.status(400).send({
                    statusCode: 400,
                    statusMessage: "Bad Request"
                })
            }
            else
                res.status(401).send({
                
                    statusCode: 401,
                    statusMessage: "Authorization Missing"
                })
        })
    }


   
    public async getUserInfo(req: Request, res: Response) {
        AuthService.getUserInfo(req.headers.authorization).then((result:any) => {
            console.log("GETUSER::Error",result);

            let userResponse = {};

            if(result.status == 200){
                 let rolesList = [];
                result.data?.roles.forEach((role:string)=>{
                    if(!role.includes("everyone")){
                        rolesList.push(role.substring(role.indexOf('/')+1));
                    }
                })
                userResponse["email"] = result.data?.emails ? result.data?.emails[0] :"" ;
                userResponse["phoneNumber"] = result.data?.phoneNumbers ? result.data?.phoneNumbers[0].value: ""
                userResponse["firstName"] = result.data?.name?.givenName ? result.data?.name?.givenName : "";
                userResponse["familyName"] = result.data?.name?.familyName ? result.data?.name.familyName : "";
                userResponse["roles"] = rolesList
     
             }
            res.status(200).send({
                statusMessage: "User Retrieved Successfully",
                data: userResponse
            })
        }).catch(err => {
            console.log("GETUSER::Error",err);
            res.status(401).send({
                statusCode: 401,
                statusMessage: "Unathorized or Missing token"
            })
        })
    }
    public async getRefreshToken(req: Request, res: Response) {

        req.body["grant_type"] = "refresh_token",
        req.body["scope"]  = "openid",
        req.body["access_token"] = req.headers['access-token'] as string,
        AuthService.getRefreshToken(req.body).then(result => {
            res.status(200).send({
                statusCode: 200,
                statusMessage: "Token Renewed Successfully",
                data: result.data
            })
        }).catch(err => {
            console.log('err', err);
            res.status(500).send({
                statusCode: 500,
                statusMessage: "Something Went wrong"
            })
        })
    }
}

export default new AuthContrller();