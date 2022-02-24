import { App } from './app';
require('dotenv').config();
const app = new App(3000);
app.use();
app.listen();
