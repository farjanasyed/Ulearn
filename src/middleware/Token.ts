
import { Request, Response } from 'express';
import jwt_decode from "jwt-decode";




export const validateToken = (req: Request, res: Response, next: any) => {
   const access_token = req.headers["access_token"] as string;
   const decodedToken: any = req.body["access_token"] ? jwt_decode(req.body["access_token"]) : jwt_decode(access_token);
   if (new Date(decodedToken.exp * 1000) <= new Date()) {
      res.status(401).send({
         stausCode: 401,
         statusMessage: "Token Expired"
         
      })
   }
   else {
      next();
   }
}

export const checkTokenValidity = (req: Request,res: Response, next: any) =>{
   // const decodedToken: any = jwt_decode(req.body["access_token"]);
   console.log("req.headers.authorization",req.headers.authorization);
   if (req.headers.authorization === undefined) {
    return  res.status(401).send({
         stausCode: 401,
         statusMessage: "Unauthorized"
         
      })
   }
   else {
      next();
   }
}

export const setHeaders = (req :Request ,res: Response, next: any)=>{
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
}