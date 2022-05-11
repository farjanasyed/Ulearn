import PermissionService from '../services/Permission';
import { Request, Response } from 'express';
import qs from 'qs';

class PermissionController {
    public async createPermission(req: Request, res: Response) {
        req.body["appName"] = req.body.appName;
        req.body["permissionString"]= req.body.permissionString;
        PermissionService.createPermission(req.body).then(result => {
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
    public async getPermission(req: Request, res: Response) {
        PermissionService.getPermission(req.params.appName).then(result => {
            console.log("GETUSER::Error",result);
            res.status(200).send({
                statusMessage: "Permission Retrieved Successfully",
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
    
    public async getPermissionGrantRole(req: Request, res: Response) {
        PermissionService.permissionWithRole(req.params.permissionId,req.params.user).then(result => {
            console.log("GETUSER::Error",result);
            res.status(200).send({
                statusMessage: "Permission Retrieved Successfully",
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
    
  
    public async deletePermissions(req: Request, res: Response) {
        PermissionService.deletePermission(req.params.permissionId).then(result => {
            console.log("GETUSER::Error",result);
            res.status(200).send({
                statusMessage: "Permission deleted Successfully",
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

    public async allRolesUsingPermissionId(req: Request, res: Response) {
        PermissionService.getAllRolesUsingPermissionId(req.params.permissionId).then(result => {
            console.log("GETUSER::Error",result);
            res.status(200).send({
                statusMessage: "Permission Retrieved Successfully",
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

    public async allModulesAndPermission(req: Request, res: Response) {
        let finalData:any=[];
        PermissionService.allModulesAndPermission(req.headers.authorization).then((result:any) => {
            let resData=result.data;
            resData.forEach(element => {
                let resourcePath=element.resourcePath;
                let splitData=resourcePath.split("/");
                if(splitData[3]=="AMS" && splitData[4] !== null && splitData[4] !== undefined){
                    let obj={
                        "module":splitData[4],
                        "permission":splitData[5]?splitData[5]:"/"
                    }
                    finalData.push(obj);
                }
            });
           
            let output:any=finalData.reduce(function(rv, x) {
                (rv[x['module']] = rv[x['module']] || []).push(x['permission']);
                return rv;
              }, {}); 
              let finalOutput=[]
              Object.entries(output).map(([key,value])=>{
                  let dataElement={
                      "module":key,
                      "permissions":value
                  }
                  finalOutput.push(dataElement);
              })

            console.log("GETModules::Error",output);
            console.log("GETAllModules::Error",finalOutput);
            res.status(200).send({
                statusMessage: "Module and Permission Retrieved Successfully",
                data: finalOutput
            })
        }).catch(err => {
            console.log("GETUSER::Error",err);
            res.status(401).send({
                statusCode: 401,
                statusMessage: "Unathorized or Missing token"
            })
        })
    }
   
}

export default new PermissionController();