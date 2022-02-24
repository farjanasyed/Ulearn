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
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const bodyParser = __importStar(require("body-parser"));
const router_1 = __importDefault(require("./router"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const yaml_import_1 = require("yaml-import");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const Token_1 = require("./middleware/Token");
let css = {
    customCss: `
    .topbar-wrapper img {content:url(\'../assets/unext-jan.png\'); width:300px; height:auto;}
    .swagger-ui .topbar { background-color: white; }`,
    customSiteTitle: "New Title",
    customfavIcon: "/assets/favicon.ico"
};
class App {
    constructor(port) {
        this.listen = () => {
            this.app.listen(this.port, () => {
            });
        };
        this.use = () => {
            this.app.use(bodyParser.json());
            this.app.use('/api', router_1.default);
            const src = fs_1.default.readFileSync(path_1.default.join(__dirname, '../src/swagger.yaml'), 'utf8');
            const cwd = path_1.default.join(__dirname, 'foo');
            const schema = (0, yaml_import_1.getSchema)(cwd);
            const content = js_yaml_1.default.load(src, { schema: schema });
            this.app.use('/assets', express_1.default.static('assets'));
            this.app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(content, css));
            this.app.use('/api/auth/getRefreshToken', Token_1.validateToken);
        };
        this.port = port;
        this.app = (0, express_1.default)();
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map