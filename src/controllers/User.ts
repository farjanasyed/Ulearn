import { Request, response, Response } from 'express';
const url = require('url');
import AuthService from '../services/Auth';
import UserService from '../services/User';
import QueryString from 'query-string';
import console from 'console';
import fs from 'fs';

import RoleService from '../services/Role'
import { AnyNsRecord } from 'dns';

const { Consumer } = require('sqs-consumer');
const AWS = require('aws-sdk');



AWS.config.update({
  region: 'ap-south-1',
  accessKeyId: 'ASIA24YBCO4U2LR3DP74',
  secretAccessKey: 'RXN69dCrf0NY+1SGtGb0IUSvVZlPrqQnU8OGoz8+',
  sessionToken: 'IQoJb3JpZ2luX2VjEIr//////////wEaCmFwLXNvdXRoLTEiRzBFAiEAlYAOKqDjq7lAjyVsnfx11Tuju8WPNvDY15taTVvACb0CICBwFtaxsXuWPWkWcFFaD9UGlikVmmJQtJC7rWKQvWMHKpYDCHMQARoMNzQ4OTM3MTgwOTY5IgzbAlOsvCDd1NYZgYQq8wK5KvjGPY2bvaXvQ6HmzpC+hGwHV1w/2rC15hBVGIGR9AQCgc9j/ZVkNNoVFyi0wFoTEepthpRROhMmJZDQXIetZs1JSaPa19Ksl3Uqd9EkmVhzNH4qHhCBqwuhiOZd4w5I7fCn9+7lySjX89mMvdgTYSExEhfnL/46/qySFYDMFPQ7DzpI49yQcngJrnV7wFmF+fCwefAViLNHF5OC8FsDi2rn+E/gGzrFUtS1MsYN/cN/T3jKWnxZ9k0R8VI+Y9oyhpDfPPNqgT8ruV+XoINgdVLh5rdlDwpH90vF9oaZgEazyBR3iE0mWus65mXkdYvXYG+FZSgEAifUtAa5vfDwpg2X3VnYOvQjbXWqjqO5rFZZlmS7lim1IRrBHmhpmFlmQ0GKprmMr42Ji9pCE1FDqRWYBf8CV+d1e2I0ItiHADC6QI421a7lmoCzuZ7CQ7Z7v7iIS6Si1f1nKX2I+LkC8A+GAZ87VyiEVmcmi09C5C2pJjD6zbKUBjqmAfmxVBwygXh044zNu6u7VcP6Xt34m6qSYX3fay2fHGyxRaRdm1jTj6J58RQnFS/Se+YIEyTC4fIDxvB8DNjoEis+F5+T+aILMcZiOkPGtyxz/2/uZ1CXIc3+TaLnZzEVsdDMRNs0oUV8eKQqq4pUm71JIx86+9hRZVBTVlTBIEDC1Jrv0sSwLR7eDOIK8V2Ntb2NX/6VRZ6TvHWkUpejwSWb7hFQU6w='
})
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


const app = Consumer.create({
  queueUrl: 'https://sqs.ap-south-1.amazonaws.com/748937180969/queue-ap-south-1-wso2-local',
  handleMessage: async (message: any) => {
    console.log("message", JSON.stringify(message));
    await tranformSQSUser(message);
    //  message = JSON.stringify(message);

  },
  sqs: new AWS.SQS()
});
app.on('error', (err) => {
  console.error(err.message);
});

app.on('processing_error', (err) => {
  console.error(err.message);
});




let dummy = {
  "uniqueId": "8d8e9b11-c51f-4c0a-b190-32a966efb911",
  "payload": {
    "unUser_Contact__c": null,
    "unMedium_Photo_URL__c": null,
    "unLinkedIN__c": null,
    "unPhone__c": null,
    "unId__c": "0059D000003LoKTQA0",
    "unEmail__c": "shubham.sapkal@aethereus.com",
    "unAbout_Me__c": null,
    "unSAML_Federation_ID__c": "0059D000003LoKTQA0",
    "unFacebook__c": null,
    "unOrganization_ID__c": "00D9D0000000VF7UAM",
    "unName__c": "University Course Coordinator",
    "unUser_Role__c": null,
    "Record_Created_Datetime__c": "2022-01-17T12:05:05Z",
    "Event__c": "Updated",
    "Record_Deleted_By__c": null,
    "Record_Created_By__c": "0055g00000DqPkiAAF",
    "Record_Last_Modified_By__c": "0059D000003ORJ9QAO",
    "Object_Name__c": "User",
    "unIs_Active__c": true,
    "unMobile__c": null,
    "unTitle__c": null,
    "unGoogle__c": null,
    "unProfile_Name__c": "University Course Coordinator",
    "Record_Last_Modified_Datetime__c": "2022-05-10T10:42:17Z",
    "unProfile__c": "00e9D000000clhCQAQ",
    "unUser_Name__c": "university.coursecoordinator@unext.com",
    "unCompany_Name__c": null,
    "Record_Deleted_Datetime__c": null
  }
}

const tranformSQSUser = async (eventData: any) => {
  console.log("message", JSON.parse(eventData.Body).Message);
  const userProfile = JSON.parse(eventData.Body).Message;
  const userData = JSON.parse(userProfile).payload;
  console.log("user profile", JSON.parse(userProfile).payload.unUser_Name__c)
  let user = {
    name: {
      givenName: userData.unName__c,
      familyName: userData.unName__c
    },
    cn: userData.unName__c,
    userName: userData.unUser_Name__c,
    password: "test@123",
    emails: [userData.unUser_Name__c],
    phoneNumbers: [{
      type: "work",
      value: userData.unMobile__c == null ? "" : userData.unMobile__c,
    }],
    "nickName": userData.unSAML_Federation_ID__c,
    "displayName": userData.unProfile_Name__c,
    "title": userData.unProfile__c,
    "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User": {
      "verifyEmail": false
    }
  }

  if (userData.unUser_Contact__c) {
    user["externalId"] = userData.unUser_Contact__c
  }
  console.log("user data", JSON.stringify(user));
  UserService.createUser(user).then(async userResponse => {
    if (userResponse.status == 201) {
      const tokenData = await UserService.getSalesForceToken();
      const activateUser = await UserService.activateUser(tokenData.data["access_token"], userData.unSAML_Federation_ID__c);
      console.log("user Response", activateUser);

    }
  }).then((error: any) => {
    if (error && error.response.status == 409) {
      console.log("err", error);
    }
  })

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
          "verifyEmail": true
        }
      }

      user["displayName"] = user.password;
      user["title"] = req?.body.isAdmin ? process.env.ADMIN_RESET_PASSWORD_URL : process.env.CANDIDATE_RESET_PASSWORD_URL
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
      UserService.getUserById(userId, req.headers.authorization).then((result: any) => {
        let userResponse = {};
        if (result.status == 200) {
          let rolesList = [];
          const defaultRoles = result.data?.roles.find((role)=> role.type== "default");
          if(defaultRoles){
             const listRoles = defaultRoles.value.split(',').filter(e=>
                  !e.includes('Internal/everyone')
             ).map(e=>e.split('/')[1]);
             rolesList = listRoles;
          }
          userResponse["email"] = result.data?.emails ? result.data?.emails[0] : "";
          userResponse["phoneNumber"] = result.data?.phoneNumbers ? result.data?.phoneNumbers[0].value : ""
          userResponse["firstName"] = result.data?.name?.givenName ? result.data?.name?.givenName : "";
          userResponse["familyName"] = result.data?.name?.familyName ? result.data?.name.familyName : "";
          userResponse["roles"] = rolesList;
          if(rolesList.length == 0){
            userResponse["temporaryPassword"] = result.data.displayName
          }
        }
        res.status(200).send({
          statusCode: 200,
          StatusMessage: "User Retrieved Successfully",
          data: userResponse
        })
      }).catch(err => {
        console.log("err", err);
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
      "name": {

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
      user["phoneNumbers"].push({ "type": "work", "value": req.body['phoneNumber'] })

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
    UserService.deActivateUser(upateRequest, userId).then(response => {
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



  public async deleteUser(req: Request, res: Response) {
    UserService.deleteUser(req.params.id).then(response => {
      console.log("Delete Api Response", response);
      if (response.status == 204) {
        return res.status(200).send({
          statusCode: 200,
          statuMessage: "User is deleted Successfully"
        })
      }
    }).catch(error => {
      console.log("err", error);
      if (error && error.response.status == 400) {
        res.status(400).send({
          statusCode: 400,
          statuMessage: "Bad Request"
        })
      }
      else if (error && error.response.status == 401) {
        return res.status(401).send({
          statusCode: 401,
          statuMessage: "Authentication failed"
        })
      }
      else if (error && error.response.status == 404) {
        return res.status(401).send({
          statusCode: 404,
          statuMessage: "User not found"
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

  public async forgotPassword(req: Request, res: Response) {
    console.log("ChangePassword Request", req.body)
    try {
      const userResponse = await UserService.getUserByName(req.body.userName, null);
      if (userResponse.status == 200) {
        const userId = userResponse.data['Resources'][0].id;
        if (userId) {
          let otpRequestBody = {
            "userId": userId
          }
          const generateOTPRes = await UserService.generateOTP(otpRequestBody);
          if (generateOTPRes.status === 200) {
            return res.status(200).send({
              statusCode: 200,
              statuMessage: "Mail sent to reset the password",
              data: {
                "transactionId": generateOTPRes.data["transactionId"]
              }
            })
          }
          else {
            return res.status(400).send({
              statusCode: 400,
              statuMessage: "Something went wrong while sending OTP",
              data: ""
            })
          }
        }
      }
      else {
        return res.status(400).send({
          statusCode: 400,
          statuMessage: "User Id not found",
          data: ""
        })
      }
    }
    catch (err) {
      console.log("err", err);
      if (err && err.response.status == 401) {
        return res.status(401).send({
          statusCode: 401,
          statuMessage: "Unauthorized To Perform the operation",
          data: ""
        })
      }
      else {
        return res.status(500).send({
          statusCode: 500,
          statuMessage: "Something went wrong",
          data: ""
        })

      }
    }
  }

  public async verifyandChangePassword(req: Request, res: Response) {
    try {
      const user = {
        userName: req.body.userName,
        password: req.body.password
      }
      const userResponse = await UserService.getUserByName(req.body.userName, null);
      if (userResponse.status == 200) {
        const userId = userResponse.data['Resources'][0].id;
        if (userId) {
          let otpRequestBody = {
            "userId": userId,
            "transactionId": req.body.transactionId,
            "emailOtp": req.body?.otp
          }
          const validateOTPRes: any = await UserService.validateOTP(otpRequestBody);
          console.log("validate otp", validateOTPRes);
          if (validateOTPRes.status === 200 && validateOTPRes.data && validateOTPRes.data?.isValid) {
            const updatePasswordRes = await UserService.changePassword(userId, user, "");
            if (updatePasswordRes.status == 200) {
              return res.status(200).send({
                statusCode: 200,
                statuMessage: "OTP Verified and Password changed successfully"
              })

            }
          }
          else {
            return res.status(400).send({
              statusCode: 400,
              statuMessage: "Failed to verify the otp",
              data: ""
            })
          }
        }
      }
      else {
        return res.status(400).send({
          statusCode: 400,
          statuMessage: "User Id not found",
          data: ""
        })
      }
    }
    catch (err) {
      console.log("Error while fetching user", err);
      if (err && err.response.status == 401) {
        return res.status(401).send({
          statusCode: 401,
          statuMessage: "Unauthorized To Perform the operation",
          data: ""
        })
      }
      else {
        return res.status(500).send({
          statusCode: 500,
          statuMessage: "Something went wrong",
          data: ""
        })
      }
    }
  }
  public async assignRoleToUser(req: Request, res: Response) {
    let roleBody = {
      "failOnErrors": 1.0,
      "schemas": [
        "urn:ietf:params:scim:api:messages:2.0:BulkRequest"
      ]
    }
    const rolesDetails = req.body.roles && req.body.roles.map((roleId: string) => {
      return {
        "method": "PATCH",
        "path": `/Roles/${roleId}`,
        "data": {
          "schemas": [
            "urn:ietf:params:scim:schemas:core:2.0:Role"
          ],
          "Operations": [{
            "op": "add",
            "value": {
              "users": [
                {
                  "value": req.body.userId ? req.body.userId : ""
                }
              ]
            }
          }]

        }
      }

    })

    roleBody["Operations"] = rolesDetails;
    UserService.assignRoles(roleBody).then((response: any) => {
      let isStatus = true
      if (response.status == 200) {
        console.log("Response operations", JSON.stringify(response.data.Operations));
        response.data && response.data.Operations && response.data.Operations.forEach((roleItem: any) => {
          if (roleItem.status && (roleItem.status.code === 500 || roleItem.status.code === 404)) {
            isStatus = false
          }
          else
            isStatus = true
        })

        if (isStatus) {
          return res.status(200).send({
            statusCode: 200,
            statusMessage: "Roles assigned successfully"

          })
        }
        else {
          return res.status(400).send({
            statusCode: 404,
            statusMessage: "Role Not found"

          })
        }

      }
    }).catch(err => {
      console.log("err", err);
      if (err && err.response && err.response.status == 500) {
        return res.status(500).send({
          statusCode: 404,
          statusMessage: "Specified user/role Not found"
        })
      }
      else
        res.status(400).send({
          statusCode: 400,
          statusMessage: "Bad request"
        })
    })
  }




}


export default new UserController();