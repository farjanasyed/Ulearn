import ActivitiesController from "./controllers/Activities";
import * as express from "express";
import User from "./controllers/User";
import Auth from "./controllers/Auth"
import { checkTokenValidity, setHeaders, validateToken } from "./middleware/Token";
const router = express.Router();




router.post('/users', User.createUser);
//router.get('/users/:id',User.getUserById);
router.post('/authn/token', Auth.getAuthToken);


router.get('/users/me', checkTokenValidity,Auth.getUserInfo);
router.post('/authn/refresh-token', Auth.getRefreshToken);
router.get('/users/verification',checkTokenValidity, User.verifyUser)
router.post('/users/bulk',checkTokenValidity, User.createBulkUsers);
router.post('/users/me/changePassword',checkTokenValidity,User.changePassword);
router.get('/users',checkTokenValidity,User.getAllusers);

export default router;