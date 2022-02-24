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
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const path_1 = __importDefault(require("path"));
const jks_js_1 = __importDefault(require("jks-js"));
const keystore = jks_js_1.default.toPem(fs_1.default.readFileSync(path_1.default.join(__dirname, "../wso2carbon.jks")), 'wso2carbon');
const { cert, key } = keystore["wso2carbon"];
const credentials = { key: key, cert: cert };
class UserService {
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("env", `${process.env.WSO2_URL}`);
            return axios_1.default.post(`${process.env.WSO2_URL}/scim2/Users`, data, {
                headers: {
                    "Content-Type": "application/json",
                },
                auth: {
                    username: process.env.AUTH_USER,
                    password: process.env.AUTH_PASSWORD
                },
                httpsAgent: new https_1.default.Agent({
                    cert: cert,
                    key: key,
                    rejectUnauthorized: false
                })
            });
        });
    }
    getUserById(Id) {
        return __awaiter(this, void 0, void 0, function* () {
            return axios_1.default.get(`${process.env.WSO2_URL}/scim2/Users/${Id}`, {
                headers: {
                    "Content-Type": "application/json",
                },
                auth: {
                    username: process.env.AUTH_USER,
                    password: process.env.AUTH_PASSWORD
                },
                httpsAgent: new https_1.default.Agent({
                    cert: cert,
                    key: key,
                    rejectUnauthorized: false
                })
            });
        });
    }
    verifyUser(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return axios_1.default.post(`${process.env.WSO2_URL}/api/identity/user/v1.0/validate-code`, body, {
                headers: {
                    "Content-Type": "application/json",
                },
                auth: {
                    username: 'admin',
                    password: 'admin'
                },
                httpsAgent: new https_1.default.Agent({
                    cert: cert,
                    key: key,
                    rejectUnauthorized: false
                })
            });
        });
    }
    createBulkUsers(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return axios_1.default.post(`${process.env.WSO2_URL}/scim2/Bulk`, data, {
                headers: {
                    "Content-Type": "application/json",
                },
                auth: {
                    username: process.env.AUTH_USER,
                    password: process.env.AUTH_PASSWORD
                },
                httpsAgent: new https_1.default.Agent({
                    cert: cert,
                    key: key,
                    rejectUnauthorized: false
                })
            });
        });
    }
}
exports.default = new UserService();
//# sourceMappingURL=User.js.map