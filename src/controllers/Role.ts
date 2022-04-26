import RoleService from '../services/Role';
import { Request, Response } from 'express';
import qs from 'qs';

export class RoleController {
    public async assignRoleToUser(req: Request, res: Response) {
        let users = req.body.users.map((userId: any) => {
            return {
                "value": userId
            }
        })
        const roleRequest =
        {
            "schemas": [
                "urn:ietf:params:scim:schemas:extension:2.0:Role"
            ],
            "displayName": req.body.roleName,
            "users": users,

            "permissions": req.body.permissions
        }

        RoleService.assignRole(roleRequest).then(result => {
            console.log("result from token", result.status);
            if (result.status == 400) {
                console.log("Result", result);
                res.status(400).send({
                    statusCode: 400,
                    statusMessage: "Bad Request",
                    data: result.data
                })
            }
            else
                res.status(200).send({
                    statusCode: 200,
                    statusMessage: "Roles Retrieved Successfully",
                    data: result.data
                })
        }).catch(error => {
            console.log("Error", error);
            if (error.response.status == 400) {
                res.status(400).send({
                    statusCode: 400,
                    statusMessage: "Bad Request"
                })
            }
            else if (error.response.status == 401) {
                res.status(401).send({

                    statusCode: 401,
                    statusMessage: "Authorization Missing"
                })

            }
            else if (error.response.status == 409) {
                res.status(409).send({

                    statusCode: 409,
                    statusMessage: "Role already  exist"
                })

            }
            else {
                res.status(500).send({

                    statusCode: 500,
                    statusMessage: "Somethingwent wrong"
                })

            }
        })
    }

    public async createBulkRoles(req: Request, res: Response) {

        let roleRequest = {
            "failOnErrors": 1,
            "schemas": [
                "urn:ietf:params:scim:api:messages:2.0:BulkRequest"
            ],
        };
        const roles = req.body.roles.map((role: any) => {
            return {

                "data": {
                    "schemas": [
                        "urn:ietf:params:scim:schemas:extension:2.0:Role"
                    ],
                    "displayName": role.name,
                    "permissions": role.permissions,
                },
                "method": req.body.method,
                "path": '/Roles',
                "bulkId": req.body.id,
            }


        });
  
        roleRequest["Operations"] = roles;
        console.log("Roles",JSON.stringify(roleRequest));
        RoleService.createRolesInBulk(roleRequest).then((result:any) => {
            console.log("result from token", result);

            if (result.status == 400) {
                console.log("Result", result);
                res.status(400).send({
                    statusCode: 400,
                    statusMessage: "Bad Request",
                    data: result.data
                })
            }
            else if(result.status == 200){
                 result.data?.Operations.forEach((operation:any)=>{
                     console.log("Res",operation);
                    if(operation.status.code == 409){
                        return res.status(409).send({
                            statusCode: 409,
                            statusMessage: "This Role already exist",
                            data: result.data
                        })
                    }
                })


            }
            const roleList = result.data.Operations.map((operation:any)=>{
                 return {
                     roleId: operation.location.substring(operation.location.lastIndexOf('/')+1)
                 }
            })

            console.log("Role List",roleList);
                res.status(200).send({
                    statusCode: 200,
                    statusMessage: "Roles Retrieved Successfully",
                    data: roleList
                })
        }).catch(error => {
            console.log("Error", error);
            if (error.response.status == 400) {
                res.status(400).send({
                    statusCode: 400,
                    statusMessage: "Bad Request"
                })
            }
            else if (error.response.status == 401) {
                res.status(401).send({

                    statusCode: 401,
                    statusMessage: "Authorization Missing"
                })

            }
            else if (error.response.status == 409) {
                res.status(409).send({

                    statusCode: 409,
                    statusMessage: "Role already  exist"
                })

            }
            else {
                res.status(500).send({

                    statusCode: 500,
                    statusMessage: "Somethingwent wrong"
                })

            }
        })


    }
    // public async getUserInfo(req: Request, res: Response) {
    //     AuthService.getUserInfo(req.headers.authorization).then(result => {
    //         console.log("GETUSER::Error",result);
    //         res.status(200).send({
    //             statusMessage: "User Retrieved Successfully",
    //             data: result.data
    //         })
    //     }).catch(err => {
    //         console.log("GETUSER::Error",err);
    //         res.status(401).send({
    //             statusCode: 401,
    //             statusMessage: "Unathorized or Missing token"
    //         })
    //     })
    // }
    // public async getRefreshToken(req: Request, res: Response) {

    //     req.body["grant_type"] = "refresh_token",
    //     req.body["scope"]  = "openid"
    //     AuthService.getRefreshToken(req.body).then(result => {
    //         res.status(200).send({
    //             statusCode: 200,
    //             statusMessage: "Token Renewed Successfully",
    //             data: result.data
    //         })
    //     }).catch(err => {
    //         console.log('err', err);
    //         res.status(500).send({
    //             statusCode: 500,
    //             statusMessage: "Something Went wrong"
    //         })
    //     })
    // }
}


export default new RoleController();