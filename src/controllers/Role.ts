import RoleService from '../services/Role';
import { Request, Response } from 'express';
import qs from 'qs';
import async from 'async'
import { resolve } from 'path';






let finalData = []


const getAllUserById = (roles: any) => {
    return Promise.all(roles.map(async (role) => {
        return await RoleService.getRoleById(role.roleId)

    }));
}

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
                "method": "POST",
                "path": '/Roles',
                "bulkId": "ywvjz",
            }
        });

        roleRequest["Operations"] = roles;
        RoleService.createRolesInBulk(roleRequest).then(async (result: any) => {
            if (result.status == 400) {
                res.status(400).send({
                    statusCode: 400,
                    statusMessage: "Bad Request",
                    data: result.data
                })
            }
            else if (result.data.Operations[0].status.code == 409) {
                return res.status(409).send({
                    statusCode: 409,
                    statusMessage: "This Role already exist",
                    data: result.data
                })
            }

            else {
                const roleList = result.data.Operations.map((operation: any) => {
                    return {
                        roleId: operation.location ? operation.location.substring(operation.location.lastIndexOf('/') + 1) : []
                    }
                })
                if (roleList.length > 0) {
                    getAllUserById(roleList).then(result => {
                        const roleData = result.map(role => {
                            return {
                                roleId: role.data.id,
                                roleName: role.data.displayName,
                                permissions: role.data.permissions ? role.data.permissions : []
                            }
                        })
                        return res.status(200).send({
                            statusCode: 200,
                            statusMessage: "List of Roles",
                            data: roleData
                        })
                    })
                }
            }


        }).catch(error => {
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
    public async getRoleById(req: Request, res: Response) {
        RoleService.getRoleById(req.params.id).then((result:any) => {
            console.log("Get Role::Error", result);
            if(result.status == 200){
                const role = {
                    roleId : result.data?.id,
                    roleName: result.data?.displayName,
                    permissions: result.data.permissions ? result.data.permissions : []
                }
                res.status(200).send({
                    statusMessage: "Role Retrieved Successfully",
                    data: role
                })
            }
           
        }).catch(err => {
            console.log("Get Role::Error", err);
            res.status(401).send({
                statusCode: 401,
                statusMessage: "Unathorized or Missing token"
            })
        })
    }
}





export default new RoleController();