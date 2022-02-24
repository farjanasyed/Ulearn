"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
require('dotenv').config();
const app = new app_1.App(3000);
app.use();
app.listen();
//# sourceMappingURL=server.js.map