"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Activities_1 = __importDefault(require("./controllers/Activities"));
const express = __importStar(require("express"));
const User_1 = __importDefault(require("./controllers/User"));
const Auth_1 = __importDefault(require("./controllers/Auth"));
const Token_1 = require("./middleware/Token");
const router = express.Router();
router.get('/activity/list', Activities_1.default.getActivities);
router.put('/activity/update', Activities_1.default.updateActivity);
router.post('/activity/create', Activities_1.default.createActivity);
router.get('/activity/:id', Activities_1.default.getActivity);
router.delete('/activity/deleteById/:id', Activities_1.default.deleteActivity);
router.post('/users', User_1.default.createUser);
//router.get('/users/:id',User.getUserById);
router.post('/authn/token', Auth_1.default.getAuthToken);
router.get('/users/user-info/:schema', Auth_1.default.getUserInfo);
router.post('/authn/refresh-token', Token_1.validateToken, Auth_1.default.getRefreshToken);
router.get('/users/verification', User_1.default.verifyUser);
router.post('/users/bulk', User_1.default.createBulkUsers);
exports.default = router;
//# sourceMappingURL=router.js.map