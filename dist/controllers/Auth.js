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
const Auth_1 = __importDefault(require("../services/Auth"));
class AuthContrller {
    getAuthToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            Auth_1.default.getAuthToken(req.body, req.headers.authorization).then(result => {
                console.log("result from token", result.status);
                if (result.status == 400) {
                    console.log("Result", result);
                    res.send({
                        statusCode: 400,
                        statusMessage: "User Not Confirmed Yet",
                        data: result.data
                    });
                }
                else
                    res.send({
                        statusCode: 200,
                        statusMessage: "Token Retrieved Successfully",
                        data: result.data
                    });
            }).catch(error => {
                console.log("Error", error);
                if (error.response.status == 400) {
                    res.status(400).send({
                        statusCode: 400,
                        statusMessage: "User Not Confirmed Yet"
                    });
                }
                else
                    res.status(401).send({
                        statusCode: 401,
                        statusMessage: "Authorization Missing"
                    });
            });
        });
    }
    getUserInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            Auth_1.default.getUserInfo(req.headers.authorization, req.params.schema).then(result => {
                res.status(200).send({
                    statusMessage: "Roles Retrieved Successfully",
                    data: result.data
                });
            }).catch(err => {
                console.log("err", err);
                res.status(401).send({
                    statusCode: 401,
                    statusMessage: "Unathorized or Missing token"
                });
            });
        });
    }
    getRefreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            Auth_1.default.getRefreshToken(req.headers.authorization, req.body).then(result => {
                res.send({
                    statusCode: 200,
                    statusMessage: "Token Renewed Successfully",
                    data: result.data
                });
            }).catch(err => {
                console.log('err', err);
                res.send({
                    statusCode: 500,
                    statusMessage: "Something Went wrong"
                });
            });
        });
    }
}
exports.default = new AuthContrller();
//# sourceMappingURL=Auth.js.map