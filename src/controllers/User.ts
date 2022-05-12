import { Request, response, Response } from 'express';
const url = require('url');
import AuthService from '../services/Auth';
import UserService from '../services/User';
import QueryString from 'query-string';
import console from 'console';
import fs from 'fs';
import { any } from 'async';


const { Consumer } = require('sqs-consumer');
const AWS = require('aws-sdk');

AWS.config.update({
  region: 'ap-south-1',
  accessKeyId: 'ASIA24YBCO4UYTY6V5GJ',
  secretAccessKey: 'mzbQ/7GhDcBpVoYnPhbCa0rcE1ZaijN58sKXrrs1',
  sessionToken: 'IQoJb3JpZ2luX2VjEDsaCmFwLXNvdXRoLTEiSDBGAiEA3mtXX10Gtlo94gG36zENCxVKRdfbKAF2cn4enKz9Ih0CIQCzE1hN31OUlMIsaX3nid2EiKG9LylCsCwlM3WGEWe4SiqWAwgUEAEaDDc0ODkzNzE4MDk2OSIMH1e2+k7qwO2v426MKvMCQD49atF8+I/ijdCtLGJloZH44Hes5YaaXQIXlIP/h9asyQnbFCFc97pOBq6HQhjH9UkVbGKrDL68Xfdo55WDUCwVbXwieLmPSeLdKIvCb+wWKLVaDnvq6s5O/lx1nbiNC39v11g4RroJa2cuRKW5KdOWDiOiA6GrUY8bz+RAFftGfRXdzdVkZr/tX+rBvOWM1edT2p9rm4nB5j6b0pde5gnt/BVbT7ZmlY59g85uZvODCwHv2GIPrC/rTa/BABzZXKZ8bjOVzTHM/M4ZhnvCD1Mdy7jab8GZKPjd4V3Nb5Q7P0AXxu2nHbmWUJcY1qqv4ly17OopkanYMw424z1sjqOdl0T0p4jQE9RGRHS4QDKIwMx1lHoLaw7DiKsBLqh2uefWYL31qbR03NwB64NA+bBtlqx70EFrthuMEScNjwcDzEPCiE/tk/8Ahsx/9x00zPCfqq5Mg8CI9uHpnkgjn2DXzdegp3MknSGJ1rRkYFJR9bgwlovpkwY6pQGHVeFq7IZpUANkcvoHbgQ8u2VvH12BSO8pdKa7gVq0NwmHBvB8BlMgL1np5amvEw+eAE1rPSQf0sSzHZco20RuVCzQxVXXZ4IHBfhCHfOIp19jF61cVk9ll/a9sxQHKlxUrqlrG/WZKsKTtVxrB5lM0/hPfxC3E6TBaRRQtlBsVzXfoyC2aKxsZtBLwp2qUk0NWOc52ycQtdFVoOhWLZDihkvrGfI='
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


// const app = Consumer.create({
//   queueUrl: 'https://sqs.ap-south-1.amazonaws.com/748937180969/queue-ap-south-1-wso2-local',
//   handleMessage: async (message:any) => {
//     console.log("message",JSON.stringify(message));
//     await tranformSQSUser(JSON.stringify(message));
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


// const eventData = {
//   "MessageId": "5c94ae99-1746-4195-9ab8-1473f053f5f1",
//   "ReceiptHandle": "AQEBGZaS//rnvX3YUu7m0FeI5AR650JlFC+9yB5hGHRAhpTO8O9R9IpQEt2nC2zL0xCMFFF+O8EptphQFhGu7nGSMa1ohMaGC97VZJAMnQu0CXc6roYxZfIfRgwfQnoPPYnLi/AsfnequYgcjQDt+/zQTIUhyvmD4U8c1GsQXTomFaIx5QCC1quj8xe938eLtUEdLpli2ufV4npWP+OoQ6dHRQ3ad+UhVPIvqkIjwV3vTJ81mVk+apSjYmx6xbgnvqyuEjQMP5RXs7ErhzxsGfHCZPWzpv287FvN1R6N35EeLB5yM+YMpq1FDkCuuGvWXjFVhHFO+D+5r8NxP9/OiMRnfkyrEGNivLdAvNkMLibvA934L3OxfoqEMKqA0dNoKH6/H/+EYDcLGjefa9RiTfgmRI+lUPIPs1h2ZYtWrrc/X34=",
//   "MD5OfBody": "70a206e33fe308ecdce29ff128bd16e9",
//   "Body": "{\n  \"Type\" : \"Notification\",\n  \"MessageId\" : \"7423c881-f881-58e9-8a24-9275bb4d7fc4\",\n  \"TopicArn\" : \"arn:aws:sns:ap-south-1:748937180969:topic-ap-south-1-user-local\",\n  \"Message\" : \"{\\\"uniqueId\\\":\\\"8d8e9b11-c51f-4c0a-b190-32a966efb911\\\",\\\"payload\\\":{\\\"unUser_Contact__c\\\":null,\\\"unMedium_Photo_URL__c\\\":null,\\\"unLinkedIN__c\\\":null,\\\"unPhone__c\\\":null,\\\"unId__c\\\":\\\"0059D000003LoKTQA0\\\",\\\"unEmail__c\\\":\\\"shubham.sapkal@aethereus.com\\\",\\\"unAbout_Me__c\\\":null,\\\"unSAML_Federation_ID__c\\\":\\\"0059D000003LoKTQA0\\\",\\\"unFacebook__c\\\":null,\\\"unOrganization_ID__c\\\":\\\"00D9D0000000VF7UAM\\\",\\\"unName__c\\\":\\\"University  Course Coordinator\\\",\\\"unUser_Role__c\\\":null,\\\"Record_Created_Datetime__c\\\":\\\"2022-01-17T12:05:05Z\\\",\\\"Event__c\\\":\\\"Updated\\\",\\\"Record_Deleted_By__c\\\":null,\\\"Record_Created_By__c\\\":\\\"0055g00000DqPkiAAF\\\",\\\"Record_Last_Modified_By__c\\\":\\\"0059D000003ORJ9QAO\\\",\\\"Object_Name__c\\\":\\\"User\\\",\\\"unIs_Active__c\\\":true,\\\"unMobile__c\\\":null,\\\"unTitle__c\\\":null,\\\"unGoogle__c\\\":null,\\\"unProfile_Name__c\\\":\\\"University Course Coordinator\\\",\\\"Record_Last_Modified_Datetime__c\\\":\\\"2022-05-10T10:42:17Z\\\",\\\"unProfile__c\\\":\\\"00e9D000000clhCQAQ\\\",\\\"unUser_Name__c\\\":\\\"university.coursecoordinator@unext.com\\\",\\\"unCompany_Name__c\\\":null,\\\"Record_Deleted_Datetime__c\\\":null}}\",\n  \"Timestamp\" : \"2022-05-10T10:42:20.969Z\",\n  \"SignatureVersion\" : \"1\",\n  \"Signature\" : \"jYKSecsg6PX1/gAMGNhwjo350jgZorxoDWU3wAb0QI7v7ufh7JW1DWfoy22LW2DmTOV1xySteF05zK8yYx/C0F5SNAtgsvBNoXubB4ORbWxd4crqyWya5q6T7e7iDTyDKMHphGFKDdz/b2/q4FZow5A4qbBLFeo8iGt1yV+iOXdJztmGxxyfX2rUzdMMI4wHFpjEiKUUbstAMyoj1eZNyzrmMuwlqRwmYDSSaP8eyUOCildvsMWmMOaO/4/AHKNJ4X1mDeseERgt5UBLaGGOoa2w3NiYWrAugWFVtJW8iKSrmwHxLBx/LyYVKG3V+dxqy9XPzRJ9z5vwFi8annBSGA==\",\n  \"SigningCertURL\" : \"https://sns.ap-south-1.amazonaws.com/SimpleNotificationService-7ff5318490ec183fbaddaa2a969abfda.pem\",\n  \"UnsubscribeURL\" : \"https://sns.ap-south-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:ap-south-1:748937180969:topic-ap-south-1-user-local:a26a07d8-8357-4bd7-9fb0-5738c1c4bbe4\"\n}"
// }
// let dummy ={
// "uniqueId": "8d8e9b11-c51f-4c0a-b190-32a966efb911",
// "payload": {
// "unUser_Contact__c": null,
// "unMedium_Photo_URL__c": null,
// "unLinkedIN__c": null,
// "unPhone__c": null,
// "unId__c": "0059D000003LoKTQA0",
// "unEmail__c": "shubham.sapkal@aethereus.com",
// "unAbout_Me__c": null,
// "unSAML_Federation_ID__c": "0059D000003LoKTQA0", =====> 
// "unFacebook__c": null,
// "unOrganization_ID__c": "00D9D0000000VF7UAM",
// "unName__c": "University Course Coordinator",
// "unUser_Role__c": null,
// "Record_Created_Datetime__c": "2022-01-17T12:05:05Z",
// "Event__c": "Updated",
// "Record_Deleted_By__c": null,
// "Record_Created_By__c": "0055g00000DqPkiAAF",
// "Record_Last_Modified_By__c": "0059D000003ORJ9QAO",
// "Object_Name__c": "User",
// "unIs_Active__c": true,
// "unMobile__c": null,
// "unTitle__c": null,
// "unGoogle__c": null,
// "unProfile_Name__c": "University Course Coordinator", ====> Role
// "Record_Last_Modified_Datetime__c": "2022-05-10T10:42:17Z",
// "unProfile__c": "00e9D000000clhCQAQ",
// "unUser_Name__c": "university.coursecoordinator@unext.com", 
// "unCompany_Name__c": null,
// "Record_Deleted_Datetime__c": null
// }
// }

const tranformSQSUser = async (eventData: any) => {
  const userProfile = JSON.parse(eventData.Body).Message
  console.log("user profile", userProfile)
  let user = {
    name: {
      givenName: userProfile.payload.unUser_Name__c,
      familyName: userProfile.payload.unUser_Name__c
    },
    userName: userProfile.payload.unUser_Name__c,
    password: "test@123",
    emails: [userProfile.payload.unUser_Name__c],
    phoneNumbers: [{
      type: "work",
      value: userProfile.payload.unMobile__c == null ? "" : userProfile.payload.unMobile__c,
    }],
    "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User": {
      "verifyEmail": false
    }
  }
  const userResponse = UserService.createUser(user);
  if (userResponse) {

  }

}

export class UserController {
  public async createUser(req: Request, res: Response) {

    //tranformSQSUser(eventData);
    //return;
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
    UserService.deleteUser(upateRequest, userId).then(response => {
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