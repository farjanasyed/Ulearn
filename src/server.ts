import { App } from './app';
require('dotenv').config();
console.log("env",process.env);
const app = new App(3000);
app.use();
app.listen();
