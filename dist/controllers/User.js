"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const url = require('url');
const User_1 = __importDefault(require("../services/User"));
const query_string_1 = __importDefault(require("query-string"));
class UserController {
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = {
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
                    "verifyEmail": false
                }
            };
            User_1.default.createUser(user).then(response => {
                res.send({
                    statusCode: 200,
                    statuMessage: "User Created Successfully",
                    data: response.data
                });
            }).catch(error => {
                if (error && error.response.status == 400) {
                    res.send({
                        statusCode: 400,
                        statuMessage: "Bad Request"
                    });
                }
                if (error && error.response.status == 409) {
                    res.send({
                        statusCode: 409,
                        statuMessage: "User already exist"
                    });
                }
                else {
                    res.send({
                        statusCode: 500,
                        statuMessage: "Something Went Wrong"
                    });
                }
            });
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let userId = req.params.id;
            User_1.default.getUserById(userId).then(response => {
                res.send({
                    statusCode: 200,
                    StatusMessage: "User Retrieved Successfully",
                    data: response.data
                });
            }).catch(err => {
                res.send({
                    statusCode: 500,
                    statusMessage: "Something Went Wrong"
                });
            });
        });
    }
    verifyUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let parsedUrl = url.parse(req.url);
            let parsedQs = query_string_1.default.parse(parsedUrl.query);
            console.log("codes", parsedQs);
            const verifyUserBody = {
                code: parsedQs.confirmation,
                verifiedChannel: {
                    type: 'EMAIL',
                    claim: 'http://wso2.org/claims/emailaddress'
                }
            };
            User_1.default.verifyUser(verifyUserBody).then(response => {
                console.log("response from verify email", response.data);
                res.status(200).send({
                    statusMessage: `${parsedQs.username} Confirmed Successfully`
                });
            }).catch(err => {
                console.log("err", err);
                res.send({
                    statusCode: 500,
                    statusMessage: "Something Went Wrong"
                });
            });
        });
    }
    createBulkUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
            };
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
                };
            });
            let bulkUsersBody = {
                "failOnErrors": 1,
                "schemas": [
                    "urn:ietf:params:scim:api:messages:2.0:BulkRequest"
                ],
                Operations: operations
            };
            User_1.default.createBulkUsers(bulkUsersBody).then(response => {
                console.log("response", response);
                res.status(200).send({
                    status: 200,
                    data: response.data
                });
            }).catch(err => {
                console.log("err", err);
                res.status(500).send({
                    statusCode: 500,
                    statusMessage: "Something Went wrong"
                });
            });
        });
    }
}
exports.UserController = UserController;
exports.default = new UserController();
//# sourceMappingURL=User.js.map