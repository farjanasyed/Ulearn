import { Request, response, Response } from 'express';
const url = require('url');

import UserService from '../services/User';
import QueryString from 'query-string';

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
    console.log("user", req.body);
    let user: User = {
      name: {
        givenName: req.body.firstName,
        familyName: req.body.lastName
      },
      userName: req.body.firstName,
      password: req.body.password ? req.body.password : "test@123",
      emails: [req.body.email],
      phoneNumbers: [{
        type: "work",
        value: req.body.mobileNumber.toString(),
      }],
      "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User": {
        "verifyEmail": true
      }
    }
    console.log("body", user);
    UserService.createUser(user).then(response => {
      res.send({
        statusCode: 200,
        statuMessage: "User Created Successfully",
        data: response.data
      }
      );
    }).catch(error => {
      console.log("err", error.response.status);
      res.send({
        statusCode: 409,
        statuMessage: "User Already Exist"
      })
      res.send({
        statusCode: 500,
        statuMessage: "Something Went Wrong"
      })
    })
  }

  public async getUserById(req: Request, res: Response) {
    let userId = req.params.id
    UserService.getUserById(userId).then(response => {
      res.send({
        statusCode: 200,
        StatusMessage: "User Retrieved Successfully",
        data: response.data
      })
    }).catch(err => {
      res.send({
        statusCode: 500,
        statusMessage: "Something Went Wrong"
      })
    })

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

    let body = {
      "failOnErrors": 1,
      "schemas": [
        "urn:ietf:params:scim:api:messages:2.0:BulkRequest"
      ],
      "Operations": [
        {
          "method": "POST",
          "path": "/Users",
          "bulkId": "ytrewq",
          "data": {
            "schemas": [
              "urn:ietf:params:scim:schemas:core:2.0:User"
            ],
            "userName": "jesse",
            "password": "jesspass"
          }

        }
      ]
    }

    let operations = req.body.map(user => {
      return {
        "method": "POST",
        "path": "/Users",
        "bulkId": "ytrewq",
        "data": {
          "schemas": [
            "urn:ietf:params:scim:schemas:core:2.0:User"
          ],
          "userName": user.firstName,
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
    UserService.createBulkUsers(bulkUsersBody).then(response => {
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
}

export default new UserController();