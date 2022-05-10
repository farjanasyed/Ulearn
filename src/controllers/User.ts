import { Request, response, Response } from 'express';
const url = require('url');
import AuthService from '../services/Auth';
import UserService from '../services/User';
import QueryString from 'query-string';
import console from 'console';

const { Consumer } = require('sqs-consumer');
const AWS = require('aws-sdk');

// AWS.config.update({
//   region: 'ap-south-1',
//   accessKeyId: 'ASIA24YBCO4UU3QN3V7E',
//   secretAccessKey: 'rvQUUDJx7HWrUzLIn6K73ST2SVl09fFqGZHPhGgV',
//   sessionToken:'IQoJb3JpZ2luX2VjECAaCmFwLXNvdXRoLTEiRzBFAiEAg8DfznJX5/8zkXbiVuGcM0TyD9M/V51PW+fVx5+WMu8CICnjzV9O3cf05Tqtb/XDR/7gIJPSErcgvoM4eXOFsuitKp8DCOn//////////wEQARoMNzQ4OTM3MTgwOTY5Igx6fIo5bJVnv8SPNcMq8wJLHlgFKAmta4jxk9+K4gQbJQx7r9RUFTv+5B9OSfRkQD1jNlAiz9E/+ysEybboQMxh5YKRSgOdfkIMD6LNrmZaqWpAL7YeJxW8Aut/hN64Vl5Mg9tknnTyBgeYqkqvMlJoxysOOJPG2mY8YDYbUjry1CWekPQK5S/+AUhjW0zbDgHyUOyQK7i0H0dQ+xDngfE4CqhwZ3G5jVT2QN4zotSxxCKuFTeO1riZpM8gNxQqi1GtUaGFPEIdyAR+cuSEKONC/EcG1Jj+7Lvf3RcCTzySd893vHBmR7zXJahUd7HhUR2MC7Pl+/xHGtwhDDk/sy4M1bXHQv7MjkILcGRKwBgSEmgn4j2DOCKSHR1ai4RUouyAhov9LeVZuLSzkK9fKImijlPKhcDcHbf7JHioIV0P17TynhO0zyOkJ3lp/qTE2UuaL+rYeYHxv8jmGNafOGehACqiU7a72FDqnxebIqa6CUQ+tG1kgzRgnPKiT1peLYL2MjCxmuOTBjqmAQ763VsG0GdnHhgB/3grjk0CPAv0yNC3FsfRBEaKxv6IsrwVyCTQUf5uTjiTezfiA9s2Qz3k/y0mMcuVQi4DpKhujiwJiNKeItfWz5024tyY8c975Q08wi3HLuUPmLW6FzX+hmppBMzH0Vs19H+UTU746ShNhxjpO2E8jZ2lWYvueCCdUeOcXAWGPb+J/WAMNhD6O5mrJgxuggBtQ98eUbugXCm0K2U='
// })

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

    // const app = Consumer.create({
    //   queueUrl: 'https://sqs.ap-south-1.amazonaws.com/748937180969/queue-ap-south-1-wso2-local',
    //   handleMessage: async (message:any) => {
    //     console.log("message",message);
    //   //  message = JSON.stringify(message);
      
    //   },
    //   sqs: new AWS.SQS()
    // });
    // app.on('error', (err) => {
    //   console.error(err.message);
    // });
    
    // app.on('processing_error', (err) => {
    //   console.error(err.message);
    // });
    // app.start();
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

  public async disableUser(req: Request, res: Response) {
    console.log("request", req);
    let userId = req.params["id"];
    let upateRequest = {
      "schemas": [
          "urn:ietf:params:scim:api:messages:2.0:PatchOp"
      ],
      "Operations": [
          {
              "op": "replace",
              "value": {
                  "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User": {
                      "accountDisabled": req.body["isActive"]
                  }
              }
          }
      ]
  }
    UserService.deleteUser(upateRequest,userId).then(response => {
      res.status(200).send({
        status: 200,
        data: req.body["isActive"] ? 'User Activated' : 'User Deactivated'
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


  public async forgotPassword(req: Request, res: Response) {
    console.log("ChangePassword Request", req.body)

    const userRequest = {
      "user": {
          "username": req.body.userName,
          "realm": "",
          "tenant-domain": ""
      },
      "properties": []
  }
      
        UserService.forgotPassword(userRequest).then(response => {
          console.log("resonse", response)
          return res.status(200).send({
            statusCode: 200,
            statuMessage: "Mail sent to reset the password",
            data: response.data
          });
        }).catch(error => {
          console.log("Error::FORGOTPASSWORD", error)
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

      
    }
  

}






export default new UserController();