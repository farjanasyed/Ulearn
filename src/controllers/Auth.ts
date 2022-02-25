import AuthService from '../services/Auth';
import { Request, Response } from 'express';
import qs from 'qs';
class AuthContrller {
    public async getAuthToken(req: Request, res: Response) {
        AuthService.getAuthToken(req.body, req.headers.authorization).then(result => {
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
        AuthService.getUserInfo(req.headers.authorization, req.params.schema).then(result => {
            res.status(200).send({
                statusMessage: "Roles Retrieved Successfully",
                data: result.data
            })
        }).catch(err => {
            console.log("err", err);
            res.status(401).send({
                statusCode: 401,
                statusMessage: "Unathorized or Missing token"
            })
        })
    }
    public async getRefreshToken(req: Request, res: Response) {
        AuthService.getRefreshToken(req.headers.authorization, req.body).then(result => {
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