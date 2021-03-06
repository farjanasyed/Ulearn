import PermissionService from '../services/Permission';
import { Request, Response } from 'express';
import qs from 'qs';

class PermissionController {
    public async createPermission(req: Request, res: Response) {
        req.body["parentPath"] = req.body.parentPath;
        req.body["collectionName"] = req.body.collectionName;
        req.body["mediaType"] = req.body.mediaType;
        req.body["description"] = req.body.description;    
        PermissionService.createPermissionInstance(req.body).then((result:any) => {
           // console.log("result from token", result);
            if (result.status == 400) {
                res.status(400).send({
                    statusCode: 400,
                    statusMessage: "Bad Request",
                    data: result.data
                })
            }
            else
                var dataBody:Object={
                    "path":req.body.parentPath+"/"+req.body.collectionName,
                    "name":"name",
                    "value":req.body.collectionName
                }
                PermissionService.addModule(dataBody).then(result => {
                    if (result.status == 400) {
                        res.status(400).send({
                            statusCode: 400,
                            statusMessage: "Bad Request",
                            data: result.data
                        })
                    }
                    else
                        res.status(200).send({
                            statusCode: 200,
                            statusMessage: "Permission created Successfully",
                            data: result.data
                        })
                }).catch(error => {
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
        }).catch(error => {
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
    public async getPermission(req: Request, res: Response) {
        PermissionService.getPermission(req.params.appName).then(result => {
            console.log("GETUSER::Error", result);
            res.status(200).send({
                statusMessage: "Permission Retrieved Successfully",
                data: result.data
            })
        }).catch(err => {
            console.log("GETUSER::Error", err);
            res.status(401).send({
                statusCode: 401,
                statusMessage: "Unathorized or Missing token"
            })
        })
    }

    public async getPermissionGrantRole(req: Request, res: Response) {
        PermissionService.permissionWithRole(req.params.permissionId, req.params.user).then(result => {
            console.log("GETUSER::Error", result);
            res.status(200).send({
                statusMessage: "Permission Retrieved Successfully",
                data: result.data
            })
        }).catch(err => {
            console.log("GETUSER::Error", err);
            res.status(401).send({
                statusCode: 401,
                statusMessage: "Unathorized or Missing token"
            })
        })
    }


    public async deleteModulePermissions(req: Request, res: Response) {
        PermissionService.deleteModulePermission(req.body).then(result => {
            console.log("GETUSER::sucess", result);
            res.status(200).send({
                statusMessage: "Permission deleted Successfully",
                data: result.data
            })
        }).catch(err => {
            console.log("GETUSER::Error", err);
            res.status(401).send({
                statusCode: 401,
                statusMessage: "Unathorized or Missing token"
            })
        })
    }

    public async allRolesUsingPermissionId(req: Request, res: Response) {
        PermissionService.getAllRolesUsingPermissionId(req.params.permissionId).then(result => {
            console.log("GETUSER::Error", result);
            res.status(200).send({
                statusMessage: "Permission Retrieved Successfully",
                data: result.data
            })
        }).catch(err => {
            console.log("GETUSER::Error", err);
            res.status(401).send({
                statusCode: 401,
                statusMessage: "Unathorized or Missing token"
            })
        })
    }

    public async createModule(req: Request, res: Response) {
        req.body["parentPath"] = req.body.parentPath;
        req.body["collectionName"] = req.body.collectionName;
        req.body["mediaType"] = req.body.mediaType;
        req.body["description"] = req.body.description;    
        PermissionService.createModuleInstance(req.body).then((result:any) => {
           // console.log("result from token", result);
            if (result.status == 400) {
                res.status(400).send({
                    statusCode: 400,
                    statusMessage: "Bad Request",
                    data: result.data
                })
            }
            else
                var dataBody:Object={
                    "path":req.body.parentPath+"/"+req.body.collectionName,
                    "name":"name",
                    "value":req.body.collectionName
                }
                PermissionService.addModule(dataBody).then(result => {
                    if (result.status == 400) {
                        res.status(400).send({
                            statusCode: 400,
                            statusMessage: "Bad Request",
                            data: result.data
                        })
                    }
                    else
                        res.status(200).send({
                            statusCode: 200,
                            statusMessage: "Module created Successfully",
                            data: result.data
                        })
                }).catch(error => {
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
        }).catch(error => {
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

    public async allModulesAndPermission(req: Request, res: Response) {
        let finalData: any = [];
        var commonPath;
        PermissionService.allModulesAndPermission(req.headers.authorization).then((result: any) => {
            let resData = result.data;
            resData.forEach(element => {
                let resourcePath = element.resourcePath;
                let splitData = resourcePath.split("/");
                if (splitData[3] == "AMS" && splitData[4] !== null && splitData[4] !== undefined) {
                    commonPath = splitData[0] + "/" + splitData[1] + "/" + splitData[2] + "/" + splitData[3] + "/";
                    let obj = {
                        "module": splitData[4],
                        "permission": splitData[5] ? splitData[5] : "/"
                    }
                    finalData.push(obj);
                }
            });
            let output: any = finalData.reduce(function (rv, x) {
                (rv[x['module']] = rv[x['module']] || []).push(x['permission']);
                return rv;
            }, {});
            let finalOutput = []
            Object.entries(output).map(([key, value]) => {
                let dataElement = {
                    "moduleName": key,
                    "moduleId": commonPath ? commonPath + key : "/",
                    "permissions": value
                }
                finalOutput.push(dataElement);
            })


            res.status(200).send({
                statusMessage: "Module and Permission Retrieved Successfully",
                data: finalOutput
            })
        }).catch(err => {
            console.log("GETUSER::Error", err);
            res.status(401).send({
                statusCode: 401,
                statusMessage: "Unathorized or Missing token"
            })
        })
    }

}

export default new PermissionController();
