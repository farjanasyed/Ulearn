import AuthService from '../services/Auth';
import { Request, Response } from 'express';
import qs from 'qs';
class AuthContrller {
    public async getAuthToken(req: Request, res: Response) {

        req.body["grant_type"] = "password"
        req.body["scope"]= "openid"
        req.body["username"] = req.body.userName;
        console.log("Body:::",req.body);
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
        AuthService.getUserInfo(req.headers.authorization).then(result => {
            console.log("GETUSER::Error",result);
            res.status(200).send({
                statusMessage: "User Retrieved Successfully",
                data: result.data
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
        req.body["scope"]  = "openid"
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