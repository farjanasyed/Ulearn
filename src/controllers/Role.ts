import RoleService from '../services/Role';
import { Request, Response } from 'express';
import qs from 'qs';



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
                    statusMessage: "Users are not exist"
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
        RoleService.getRoleById(req.params.id).then((result: any) => {
            console.log("Get Role::Error", result);
            if (result.status == 200) {
                const role = {
                    roleId: result.data?.id,
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

    public async getAllRoles(req: Request, res: Response) {
        RoleService.getAllRoles().then((response: any) => {
            if (response.status == 200) {
                let roles = response.data?.Resources.map(res => {
                    return {
                        roleId: res.id,
                        roleName: res.displayName,
                        permissions: res.permissions ? res.permissions : []
                    }
                })
                res.status(200).send({
                    statusCode: 200,
                    statusMessage: "Roles Retrieved Successfully",
                    data: roles
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


    public async revokUsers(req: Request, res: Response) {
        let users = req.body.users.map(user => {
            return {
                value: user
            }
        })
        let request = {
            "schemas": [
                "urn:ietf:params:scim:api:messages:2.0:PatchOp"
            ],
            "Operations": [
                {
                    "op": "remove",
                    "path": "users",
                    "value": users
                }
            ]
        }

        RoleService.updateRole(req.params.id, request).then(response => {
            let resBody = {};
            resBody["roleId"] = response.data["id"];
            resBody["roleName"] = response.data["displayName"]
            if (response.status == 200) {

                return res.status(200).send({
                    statusCode: 200,
                    statusMessage: "Roles Revoked to the users",
                    datat: resBody

                })

            }


        }).catch(err => {
            if (err.response.status == 400) {
                res.status(400).send({
                    statusCode: 400,
                    statusMessage: "Bad Request"
                })
            }
            else if (err.response.status == 401) {
                res.status(401).send({
                    statusCode: 401,
                    statusMessage: "Authorization Missing"
                })

            }
            else {
                res.status(200).send({
                    statusCode: 404,
                    statusMessage: "Users Not Found"
                })

            }

        })


    }

    public async updateRoleById(req: Request, res: Response) {
        
        let users = req.body.users && req.body.users?.map((user:any) => {

            return {
                value : user
            }
        });

      let role =   {
            "displayName": req.body.roleName,
            "users": users,
            "permissions": req.body.permissions
          }
        RoleService.updateRoleById(req.params.id,role).then((result: any) => {
            console.log("Get Role::Error", result);
            if (result.status == 200) {
                const role = {
                    roleId: result.data?.id,
                    roleName: result.data?.displayName,
                    permissions: result.data.permissions ? result.data.permissions : []
                }
                res.status(200).send({
                    statusMessage: "Updated Role Successfully",
                    data: role
                })
            }

        }).catch(err => {
            console.log("Get Role::Error", err);
            if (err.response.status == 400) {
                res.status(400).send({
                    statusCode: 400,
                    statusMessage: "Bad Request"
                })
            }
            else if (err.response.status == 401) {
                res.status(401).send({
                    statusCode: 401,
                    statusMessage: "Authorization Missing"
                })

            }
            else if (err.response.status == 409){
                res.status(409).send({
                    statusCode: 409,
                    statusMessage: "Role Name already exist"
                })

            }
            else {
                res.status(500).send({
                    statusCode: 500,
                    statusMessage: "User doesn't exist"
                })
            }
        })
    }

    public async addUsersToRole(req: Request, res: Response) {
        let users = req.body.users.map(user => {
            return {
                value: user
            }
        })
        let request = {
            "schemas": [
                "urn:ietf:params:scim:api:messages:2.0:PatchOp"
            ],
            "Operations": [
                {
                    "op": "add",
                    "path": "users",
                    "value": users
                }
            ]
        }

        RoleService.assignUsers(req.params.id, request).then(response => {
            console.log("Role Response", response);
            let resBody = {};
            resBody["roleId"] = response.data["id"];
            resBody["roleName"] = response.data["displayName"]
            if (response.status == 200) {

                return res.status(200).send({
                    statusCode: 200,
                    statusMessage: "Users assigned to Role",
                    datat: resBody

                })
            }
        }).catch(err => {
            if (err.response.status == 400) {
                res.status(400).send({
                    statusCode: 400,
                    statusMessage: "Bad Request"
                })
            }
            else if (err.response.status == 401) {
                res.status(401).send({
                    statusCode: 401,
                    statusMessage: "Authorization Missing"
                })

            }
            else {
                res.status(200).send({
                    statusCode: 404,
                    statusMessage: "Users Not Found"
                })

            }
        })
    }

}





export default new RoleController();