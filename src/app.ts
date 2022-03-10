import express from 'express';
import { Application } from 'express'
import * as bodyParser from 'body-parser';
import router from './router';
import swaggerUi from 'swagger-ui-express';
import yaml from 'js-yaml';
import { getSchema } from 'yaml-import';
import path from 'path';
import fs from 'fs';
import jks from 'jks-js'
import https from 'https';
import { validateToken } from './middleware/Token';
import cors from 'cors'

let css = {
  customCss: `
    .topbar-wrapper img {content:url(\'../assets/unext-jan.png\'); width:300px; height:auto;}
    .swagger-ui .topbar { background-color: white; }`,
  customSiteTitle: "New Title",
  customfavIcon: "/assets/favicon.ico"
}

export class App {
  public app: Application;
  public port: number;
  constructor(port: number) {
    this.port = port;
    this.app = express();
  }

  listen = () => {
    this.app.listen(this.port, () => {

    })
  }
  use = () => {
    this.app.use(bodyParser.json());
    this.app.use(cors({origin:true, credentials: true}))
    this.app.use('/api', router);
    const src = fs.readFileSync(path.join(__dirname, '../src/swagger.yaml'), 'utf8');
    const cwd = path.join(__dirname, 'foo');
    const schema = getSchema(cwd);
    const content = yaml.load(src, { schema: schema });
    this.app.use('/assets', express.static('assets'));
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(content, css));
    this.app.use('/api/auth/getRefreshToken', validateToken)
  }
}