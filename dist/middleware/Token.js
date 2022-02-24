"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = void 0;
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const validateToken = (req, res, next) => {
    const decodedToken = (0, jwt_decode_1.default)(req.body["access_token"]);
    if (new Date(decodedToken.exp * 1000) <= new Date()) {
        res.status(401).send({
            stausCode: 401,
            statusMessage: "Token Expired"
        });
    }
    else {
        next();
    }
};
exports.validateToken = validateToken;
//# sourceMappingURL=Token.js.map