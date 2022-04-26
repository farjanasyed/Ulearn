import { Request, response, Response } from 'express';
const url = require('url');
import AuthService from '../services/Auth';

import UserService from '../services/User';
import QueryString from 'query-string';
import console from 'console';

interface PhoneNumbers {
  type: string,
  value: string
}

interface MailSettings {
  verifyEmail: boolean
}
interface UserName {
  givenName: string
  familyName: string
}

interface User {
  name: UserName
  userName: string
  password: string
  emails: string[]
  phoneNumbers: PhoneNumbers[]
  "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User": MailSettings
}


interface VerificationPrameters {
  type: string,
  claim: string
}

interface VerifyUser {
  code: string,
  verifiedChannel: VerificationPrameters
}

export class UserController {
  public async createUser(req: Request, res: Response) {

    try {
      let user: User = {
        name: {
          givenName: req.body.firstName,
          familyName: req.body.lastName
        },
        userName: req.body.userName,
        password: req.body.password ? req.body.password : "test@123",
        emails: [req.body.email],
        phoneNumbers: [{
          type: "work",
          value: req.body.mobileNumber == null ? "" : req.body.mobileNumber.toString(),
        }],
        "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User": {
          "verifyEmail": false
        }
      }
      UserService.createUser(user).then(response => {
        res.status(200).send({
          statusCode: 200,
          statuMessage: "User Created Successfully",
          data: response.data
        }
        );
      }).catch(error => {
        console.log("Error:: Create User", error)
        if (error && error.response.status == 400) {
          res.status(400).send({
            statusCode: 400,
            statuMessage: "Bad Request"
          })
        }

        if (error && error.response.status == 409) {
          res.status(409).send({
            statusCode: 409,
            statuMessage: "User already exist"
          })
        }

        else {
          res.status(500).send({
            statusCode: 500,
            statuMessage: "Something Went Wrong"
          })
        }
      })
    }
    catch (error) {
      res.status(500).send({
        statusCode: 500,
        statuMessage: "Something Went Wrong"
      })
    }
  }


  public async changePassword(req: Request, res: Response) {
    console.log("ChangePassword Request", req.body)

    try {
      AuthService.getUserInfo(req.headers.authorization).then((useInfo: any) => {
        console.log("Res", res);
        let userData: any = {
          userName: useInfo?.data?.userName,
          password: req.body.newPassword
        }
        UserService.changePassword(useInfo.data.id, userData, req.headers.authorization).then(response => {
          console.log("resonse", response)
          return res.status(200).send({
            statusCode: 200,
            statuMessage: "Password Updated Successfully",
            data: response.data
          });
        }).catch(error => {
          console.log("Error:: Create User", error)
          if (error && error.response.status == 400) {
            res.status(400).send({
              statusCode: 400,
              statuMessage: "Bad Request"
            })
          }
          if (error && error.response.status == 401) {
            return res.status(401).send({
              statusCode: 401,
              statuMessage: "Authentication failed"
            })
          }
          else {
            return res.status(500).send({
              statusCode: 500,
              statuMessage: "Something Went Wrong"
            })
          }
        })

      }).catch(err => {
        if (err && err.response && err.response.status == 401) {
          return res.status(401).send({
            statusCode: 401,
            statuMessage: "Unauthorized to perform this operation"
          })
        }
      })

    }
    catch (err) {
      return res.status(500).send({
        statusCode: 500,
        statuMessage: "Something Went Wrong"
      })
    }
  }

  public async getUserById(req: Request, res: Response) {

    try {
      let userId = req.params.id;
      let userResponse = {

      }
      UserService.getUserById(userId, req.headers.authorization).then((response: any) => {
        res.status(200).send({
          statusCode: 200,
          StatusMessage: "User Retrieved Successfully",
          data: userResponse
        })
      }).catch(err => {
        res.status(500).send({
          statusCode: 500,
          statusMessage: "Something Went Wrong"
        })
      })
    }

    catch (err) {

      res.status(500).send({
        statusCode: 500,
        statuMessage: "Something Went Wrong"
      })

    }

  }



  public async getAllusers(req: Request, res: Response) {

    try {
      UserService.getAllUsers(req.headers.authorization).then(response => {
        res.status(200).send({
          statusCode: 200,
          StatusMessage: "User Retrieved Successfully",
          data: response.data
        })
      }).catch(err => {
        console.log("err", err);
        if (err && err.response && err.response.status == 401) {
          res.status(401).send({
            statusCode: 401,
            statusMessage: "Unauthorized"
          })
        }

        else {
          res.status(500).send({
            statusCode: 500,
            statusMessage: "Something Went Wrong"
          })
        }
      })

    }

    catch (err) {
      res.status(500).send({
        statusCode: 500,
        statuMessage: "Something Went Wrong"
      })
    }


  }
  public async verifyUser(req: Request, res: Response) {
    let parsedUrl = url.parse(req.url);
    let parsedQs = QueryString.parse(parsedUrl.query);

    console.log("codes", parsedQs);

    const verifyUserBody: VerifyUser = {
      code: parsedQs.confirmation as string,
      verifiedChannel: {
        type: 'EMAIL',
        claim: 'http://wso2.org/claims/emailaddress'
      }
    }

    UserService.verifyUser(verifyUserBody).then(response => {
      console.log("response from verify email", response.data);
      res.status(200).send({
        statusMessage: `${parsedQs.username} Confirmed Successfully`
      })

    }).catch(err => {
      console.log("err", err);
      res.send({
        statusCode: 500,
        statusMessage: "Something Went Wrong"
      })
    })

  }

  public async createBulkUsers(req: Request, res: Response) {
    let operations = req.body.map(user => {
      return {
        "method": "POST",
        "path": "/Users",
        "bulkId": "ytrewq",
        "data": {
          "schemas": [
            "urn:ietf:params:scim:schemas:core:2.0:User"
          ],
          "userName": user.userName,
          "firstName": user.firstName,
          "password": user.password,
          "name": {
            givenName: user.firstName,
            familyName: user.lastName
          },
          emails: [user.email],
          phoneNumbers: [{
            type: "work",
            value: user.mobileNumber.toString(),
          }],
          "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User": {
            "verifyEmail": true
          }
        }

      }
    })

    let bulkUsersBody = {
      "failOnErrors": 1,
      "schemas": [
        "urn:ietf:params:scim:api:messages:2.0:BulkRequest"
      ],
      Operations: operations

    }
    UserService.createBulkUsers(bulkUsersBody, req.headers.authorization).then(response => {
      console.log("response", response);
      res.status(200).send({
        status: 200,
        data: response.data
      })
    }).catch(err => {
      console.log("err", err);
      res.status(500).send({
        statusCode: 500,
        statusMessage: "Something Went wrong"
      })
    })

  }


  public async editUser(req: Request, res: Response) {

    console.log("req", req.body['familyName']);

    const userId = req.params['id']

    let user = {
      "schemas": ["urn:scim:schemas:core:1.0"],
      "name":{

      }, "meta": { "attributes": [] }
    }

    console.log("user", user);

    if (req.body['firstName']) {
      user["name"]["familyName"] = req.body['firstName']
    }
    if (req.body['lastName']) {
      user["name"]["givenName"] = req.body['lastName']
    }
    if (req.body['phoneNumber']) {

      user["phoneNumbers"] = [];
      user["phoneNumbers"].push({"type":"work","value":req.body['phoneNumber']})

    }
    if (req.body["emails"]) {
      user["emails"] = [];
      user["emails"].push(req.body['email'])
    }
    if (req.body["userName"]) {
      user["userName"] = req.body["userName"]
    }
    UserService.updateUser(userId, user).then(response => {
      console.log("INFO:Response::UpdateUser", response);
      res.status(200).send({
        status: 200,
        data: req.body,
        statusMessage: "User Updated Successfully"
      })
    }).catch(err => {
      console.log("err", err);
      if (err && err.response && err.response.status == 404) {
        return res.status(404).send({
          statusCode: 404,
          statusMessage: "Specified User Not found"
        })
      }
      else
        res.status(500).send({
          statusCode: 500,
          statusMessage: "User Name is not Mutable and It's Manditory Filed"
        })

    })


  }

  public async deleteUser(req: Request, res: Response) {
    console.log("request", req);
    let userId = req.params["id"];
    UserService.deleteUser(userId).then(response => {
      res.status(200).send({
        status: 200,
        data: 'User Deleted Successfully'
      })
    }).catch(err => {
      console.log("err", err);
      if (err && err.response && err.response.status == 404) {
        return res.status(404).send({
          statusCode: 404,
          statusMessage: "Specified User Not found"
        })
      }
      else
        res.status(500).send({
          statusCode: 500,
          statusMessage: "Something Went wrong"
        })
    })
  }

}



export default new UserController();