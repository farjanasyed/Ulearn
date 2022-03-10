import { App } from './app';
require('dotenv').config();


console.log("env",process.env.WSO2_URL);
const app = new App(3000);
app.use();

app.listen();
